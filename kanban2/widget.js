// ========== KANBAN2 — VERSION 3 ==========
// Responsables multiples, étiquettes Trello, pièces jointes et commentaires.
// Compatible avec WidgetSDK 1.2.0.62.

let W;
let T;

const DEADLINE_PRIORITE = new Date('3000-01-01');
const BACKCOLOR = '#DCDCDC';
const TEXTCOLOR = '#000000';
const ATTACHMENT_TOKEN_MAX_AGE = 2 * 60 * 1000;
const MAX_ATTACHMENT_SIZE = 50 * 1024 * 1024;

let RECS = [];
let RESPONSABLES = [];
let RESPONSABLES_BY_ID = new Map();
let RESPONSABLES_LOADED_FOR = null;
let ETIQUETTES = [];
let ATTACHMENT_META = new Map();
let ATTACHMENT_META_LOADED = false;
let ATTACHMENT_READ_TOKEN = null;
let ATTACHMENT_READ_TOKEN_AT = 0;

const RESPONSABLE_SAVE_QUEUES = new Map();
const LABEL_SAVE_QUEUES = new Map();
const COMMENT_SAVE_QUEUES = new Map();

// ========== INITIALISATION ==========

window.addEventListener('load', async () => {
    W = new WidgetSDK();
    T = await W.loadTranslations(['widget.js']);

    const lookupDetails = `If empty, the widget uses the column properties to build the list. Otherwise, provide either:\n• A list separated by ";"\n• A table or column reference starting with "$" ($TableID or $TableID.ColumnID)`;

    W.configureOptions(
        [
            WidgetSDK.newItem(
                'columns',
                null,
                'Behavior',
                'Configure the behavior of each column',
                'Columns',
                {
                    columnId: 'STATUT',
                    template: [
                        WidgetSDK.newItem('addbutton', true, 'Can add card', 'Display a button to add a card.'),
                        WidgetSDK.newItem('isdone', false, 'Is done', 'Cards in this column are considered completed.'),
                        WidgetSDK.newItem('useconfetti', false, 'Use confetti', 'Display confetti when a card enters this column.'),
                        WidgetSDK.newItem('hidecolumn', false, 'Hide', 'Hide this column.')
                    ]
                }
            ),
            WidgetSDK.newItem(
                'ref',
                '',
                'References',
                'List of task references available.',
                'Cards options',
                {description: lookupDetails, columnId: 'REFERENCE_PROJET', type: 'lookup'}
            ),
            WidgetSDK.newItem(
                'cardcolor',
                '',
                'Card color',
                'List of colors available for card backgrounds.',
                'Cards options',
                {description: lookupDetails, columnId: 'COULEUR', type: 'lookup'}
            ),
            WidgetSDK.newItem('rotation', true, 'Tilt', 'Randomly tilt cards.', 'Display'),
            WidgetSDK.newItem('compact', false, 'Compact', 'Use a compact rendering.', 'Display'),
            WidgetSDK.newItem('readonly', false, 'Read only', 'Disable all edits.', 'Display'),
            WidgetSDK.newItem('hideedit', false, 'Hide editing form', 'Do not open the editing form when clicking a card.', 'Display'),
            WidgetSDK.newItem('gristeditcard', false, 'Grist Record Card', 'Open the Grist record card on double click.', 'Display')
        ],
        '#config-view',
        '#main-view',
        {onOptChange: optionsChanged, onOptLoad: optionsChanged}
    );

    W.initMetaData();

    W.ready({
        requiredAccess: 'full',
        allowSelectBy: true,
        columns: [
            {name: 'STATUT', title: 'Statut', description: 'Colonne du Kanban', type: 'Choice', strictType: true},
            {name: 'DESCRIPTION', title: 'Nom de la tâche', description: 'Nom principal de la tâche', type: 'Any'},
            {name: 'DESCRIPTION_DISPLAY', title: 'Affichage de la tâche', description: 'Contenu personnalisé facultatif affiché sur la carte', type: 'Any', optional: true},
            {name: 'NOTES', title: 'Notes', description: 'Notes détaillées de la tâche', type: 'Any', optional: true},
            {name: 'DEADLINE', title: 'Échéance', description: 'Date limite ou ordre de priorité', type: 'Date', optional: true},
            {name: 'REFERENCE_PROJET', title: 'Référence projet', description: 'Référence facultative associée à la tâche', type: 'Any', optional: true},
            {name: 'RESPONSABLE', title: 'Responsables', description: 'Personnes responsables de la tâche', type: 'RefList', strictType: true, optional: true},
            {name: 'ETIQUETTES', title: 'Étiquettes', description: 'Étiquettes multiples de type Trello', type: 'ChoiceList', strictType: true, optional: true},
            {name: 'PIECES_JOINTES', title: 'Pièces jointes', description: 'Fichiers et images associés à la tâche', type: 'Attachments', strictType: true, optional: true},
            {name: 'COMMENTAIRES', title: 'Commentaires', description: 'Commentaires du widget stockés en JSON', type: 'Text', strictType: true, optional: true},
            {name: 'COULEUR', title: 'Couleur de carte', description: 'Couleur de fond facultative', type: 'Choice,Text', optional: true},
            {name: 'CREE_PAR', title: 'Créé par', type: 'Any', optional: true},
            {name: 'CREE_LE', title: 'Date de création', type: 'DateTime', optional: true},
            {name: 'DERNIERE_MISE_A_JOUR', title: 'Dernière mise à jour', description: 'Champ technique non affiché', type: 'DateTime', optional: true}
        ]
    });

    // mapRef:true fournit les libellés dans RESPONSABLE et les rowId dans RESPONSABLE_id.
    W.onRecords(afficherKanban, {
        expandRefs: false,
        keepEncoded: false,
        mapRef: true
    });

    W.isLoaded().then(() => {
        W.initDone = true;
    });

    grist.on('message', async (event) => {
        if (event.mappingsChange) {
            await mappingChanged();
        }
    });

    initialiserLecteurPiecesJointes();
});

// ========== CHARGEMENT DES LISTES ==========

async function chargerResponsables(force = false) {
    if (!W?.map?.RESPONSABLE || !W?.col?.RESPONSABLE) {
        viderCacheResponsables();
        return;
    }

    const colMeta = W.col.RESPONSABLE;
    const [kind, tableId] = String(colMeta.type || '').split(':');

    if (kind !== 'RefList' || !tableId || !colMeta.visibleCol) {
        viderCacheResponsables();
        return;
    }

    const cacheKey = `${tableId}:${colMeta.visibleCol}`;
    if (!force && RESPONSABLES_LOADED_FOR === cacheKey && RESPONSABLES.length > 0) {
        return;
    }

    try {
        const [table, visibleMeta] = await Promise.all([
            grist.docApi.fetchTable(tableId),
            colMeta.getMeta(colMeta.visibleCol)
        ]);

        const visibleColumnId = visibleMeta?.colId;
        const ids = Array.isArray(table?.id) ? table.id : [];
        const labels = visibleColumnId && Array.isArray(table?.[visibleColumnId])
            ? table[visibleColumnId]
            : [];

        const rows = ids
            .map((rowId, index) => ({
                id: Number(rowId),
                label: valeurTexte(labels[index]).trim()
            }))
            .filter((person) => Number.isInteger(person.id) && person.id > 0 && person.label && person.label !== '#KeyError')
            .sort((a, b) => a.label.localeCompare(b.label, W.cultureFull, {sensitivity: 'base'}));

        RESPONSABLES = rows;
        RESPONSABLES_BY_ID = new Map(rows.map((person) => [person.id, person]));
        RESPONSABLES_LOADED_FOR = cacheKey;
    } catch (error) {
        viderCacheResponsables();
        console.error('Impossible de charger la table des responsables :', error);
    }
}

function viderCacheResponsables() {
    RESPONSABLES = [];
    RESPONSABLES_BY_ID = new Map();
    RESPONSABLES_LOADED_FOR = null;
}

async function chargerEtiquettes() {
    ETIQUETTES = [];
    if (!W?.map?.ETIQUETTES || !W?.col?.ETIQUETTES) {
        return;
    }

    try {
        ETIQUETTES = [...new Set((await W.col.ETIQUETTES.getChoices() || []).map(valeurTexte).filter(Boolean))];
    } catch (error) {
        console.error('Impossible de charger les étiquettes :', error);
    }
}

async function chargerMetaPiecesJointes(force = false) {
    if (ATTACHMENT_META_LOADED && !force) {
        return;
    }

    ATTACHMENT_META = new Map();
    ATTACHMENT_META_LOADED = true;

    try {
        const table = await grist.docApi.fetchTable('_grist_Attachments');
        const ids = Array.isArray(table?.id) ? table.id : [];

        ids.forEach((rawId, index) => {
            const id = Number(rawId);
            if (!Number.isInteger(id) || id <= 0) {
                return;
            }

            const fileName = valeurTexte(table.fileName?.[index]) || `Pièce jointe ${id}`;
            const fileExt = valeurTexte(table.fileExt?.[index]) || extensionDepuisNom(fileName);
            const fileType = valeurTexte(table.fileType?.[index]);
            const fileSize = Number(table.fileSize?.[index]) || 0;

            ATTACHMENT_META.set(id, {
                id,
                fileName,
                fileExt,
                fileType,
                fileSize,
                imageWidth: Number(table.imageWidth?.[index]) || 0,
                imageHeight: Number(table.imageHeight?.[index]) || 0
            });
        });
    } catch (error) {
        console.warn('Métadonnées des pièces jointes indisponibles :', error);
    }
}

// ========== RENDU DU KANBAN ==========

async function afficherKanban(records) {
    RECS = Array.isArray(records) ? records : [];

    await Promise.all([
        chargerResponsables(),
        chargerEtiquettes()
    ]);

    const container = document.getElementById('conteneur-kanban');
    if (!container) {
        return;
    }

    container.innerHTML = '';

    const statuses = await W.col.STATUT.getChoices();
    if (!Array.isArray(statuses) || statuses.length === 0) {
        container.innerHTML = `<div class="kanban-message">${echapperHtml(T('No choice available in the Status column'))}</div>`;
        return;
    }

    statuses.forEach((status, index) => {
        const column = creerColonneKanban(status, index);
        if (column) {
            container.appendChild(column);
        }
    });

    RECS.forEach((todo) => {
        const status = valeurTexte(todo.STATUT);
        const target = Array.from(container.querySelectorAll('.contenu-colonne'))
            .find((column) => column.dataset.statut === status);

        if (target) {
            target.insertBefore(creerCarteTodo(todo), target.firstChild);
        }
    });

    initialiserTriEtGlisserDeposer();
    document.querySelectorAll('.colonne-kanban').forEach(mettreAJourCompteur);
}

async function optionsChanged() {
    await W.isMapped();
    await afficherKanban(RECS);
}

async function mappingChanged() {
    viderCacheResponsables();
    ETIQUETTES = [];
    ATTACHMENT_META_LOADED = false;
    ATTACHMENT_READ_TOKEN = null;

    await Promise.all([
        chargerResponsables(true),
        chargerEtiquettes()
    ]);

    await afficherKanban(RECS);
}

function creerColonneKanban(status, index) {
    const option = getColumnOption(index);
    if (option.hidecolumn) {
        return null;
    }

    const statusText = valeurTexte(status);
    const column = document.createElement('section');
    column.className = `colonne-kanban${(!option.addbutton && !W.opt.compact) ? ' colonne-nobouton' : ''}`;
    column.id = statusText;

    if (localStorage.getItem(getColumnStorageKey(statusText)) === 'true') {
        column.classList.add('collapsed');
    }

    const background = W.col.STATUT.getColor(statusText) ?? BACKCOLOR;
    const color = W.col.STATUT.getTextColor(statusText) ?? TEXTCOLOR;
    const encodedStatus = encoderAttribut(statusText);

    column.innerHTML = `
        <div class="entete-colonne" style="background-color:${background};color:${color}">
            <div class="titre-statut">${echapperHtml(statusText)} <span class="compteur-colonne">(0)</span></div>
            <div class="actions-colonne">
                ${(option.addbutton && !W.opt.readonly)
                    ? `<button type="button" class="bouton-ajouter-entete ${W.opt.compact ? 'compact' : ''}" onclick="creerNouvelleTache(decodeURIComponent('${encodedStatus}'))" aria-label="${echapperAttribut(T('Add a new task'))}">+</button>`
                    : ''}
                <button type="button" class="bouton-toggle" onclick="toggleColonne(this.closest('.colonne-kanban'), event)" aria-label="Replier ou déplier">⇄</button>
            </div>
        </div>
        ${(option.addbutton && !W.opt.readonly)
            ? `<button type="button" class="bouton-ajouter ${W.opt.compact ? 'compact' : ''}" onclick="creerNouvelleTache(decodeURIComponent('${encodedStatus}'))">+ ${echapperHtml(T('Add a new task'))}</button>`
            : ''}
        <div class="contenu-colonne" data-statut="${echapperAttribut(statusText)}" data-isdone="${option.isdone ? 'true' : 'false'}"></div>
    `;

    return column;
}

function creerCarteTodo(todo) {
    const card = document.createElement('article');
    card.className = `carte${W.opt.rotation ? '' : ' norotate'}${W.opt.compact ? ' compact' : ''}`;
    card.dataset.todoId = String(todo.id);
    card.dataset.lastUpdate = serialiserDate(todo.DERNIERE_MISE_A_JOUR);
    card.dataset.deadline = serialiserDate(todo.DEADLINE);

    appliquerCouleurCarte(card, todo.COULEUR);

    const projectRef = valeurTexte(todo.REFERENCE_PROJET);
    const deadline = todo.DEADLINE ? formatDate(todo.DEADLINE) : '';
    const responsables = obtenirLibellesResponsables(todo);
    const etiquettes = normaliserListeTexte(todo.ETIQUETTES);
    const attachmentCount = normaliserIdsListe(todo.PIECES_JOINTES).length;
    const commentCount = parserCommentaires(todo.COMMENTAIRES).length;

    const description = todo.DESCRIPTION_DISPLAY
        ? String(todo.DESCRIPTION_DISPLAY)
        : echapperHtml(valeurTexte(todo.DESCRIPTION) || T('No description'));

    const labelsHtml = etiquettes
        .map((label) => construireBadgeEtiquette(label))
        .join('');

    const responsablesHtml = responsables
        .map((responsable) => `<span class="responsable-badge">${echapperHtml(responsable)}</span>`)
        .join('');

    const columnOption = getColumnOptionByStatus(todo.STATUT);
    const deadlineTimestamp = toTimestamp(todo.DEADLINE);
    const isLate = deadlineTimestamp !== null
        && deadlineTimestamp < Date.now()
        && deadlineTimestamp < DEADLINE_PRIORITE.getTime();

    card.innerHTML = `
        ${projectRef ? `<div class="projet-ref truncate">#${echapperHtml(projectRef)}</div>` : ''}
        ${labelsHtml ? `<div class="etiquettes-list">${labelsHtml}</div>` : (projectRef ? '<div class="card-spacer"></div>' : '')}
        <div class="description">${description}</div>
        ${deadline ? `<div class="deadline${isLate ? ' late' : ''} truncate">📅 ${echapperHtml(deadline)}</div>` : ''}
        ${responsables.length ? `<div class="responsables-list">${responsablesHtml}</div>` : ''}
        ${(attachmentCount || commentCount)
            ? `<div class="card-indicators">
                ${attachmentCount ? `<span title="${attachmentCount} pièce(s) jointe(s)">📎 ${attachmentCount}</span>` : ''}
                ${commentCount ? `<span title="${commentCount} commentaire(s)">💬 ${commentCount}</span>` : ''}
               </div>`
            : ''}
        ${columnOption?.isdone
            ? `<div class="tampon-termine" style="color:${W.col.STATUT.getColor(todo.STATUT) ?? BACKCOLOR};">${echapperHtml(valeurTexte(todo.STATUT))}</div>`
            : ''}
    `;

    card.addEventListener('click', () => {
        grist.setCursorPos({rowId: todo.id});
        if (!W.opt.hideedit) {
            togglePopupTodo(todo);
        }
    });

    card.addEventListener('dblclick', () => {
        grist.setCursorPos({rowId: todo.id});
        if (W.opt.gristeditcard) {
            grist.commandApi.run('viewAsCard');
        } else if (!W.opt.hideedit) {
            togglePopupTodo(todo);
        }
    });

    return card;
}

function construireBadgeEtiquette(label) {
    const background = W.col?.ETIQUETTES?.getColor(label) || 'rgba(0, 0, 0, 0.08)';
    const color = W.col?.ETIQUETTES?.getTextColor(label) || '#273142';
    return `<span class="etiquette-badge" style="background:${echapperAttribut(background)};color:${echapperAttribut(color)}">${echapperHtml(label)}</span>`;
}

function appliquerCouleurCarte(card, rawColor) {
    if (!rawColor || !W.map?.COULEUR || !W.col?.COULEUR) {
        return;
    }

    let color = '';
    if (W.col.COULEUR.type === 'Choice') {
        color = W.col.COULEUR.getColor(rawColor) || '';
    } else {
        const candidate = valeurTexte(rawColor).trim();
        if (/^#?[0-9a-f]{3,8}$/i.test(candidate)) {
            color = candidate.startsWith('#') ? candidate : `#${candidate}`;
        } else if (/^[a-z]+$/i.test(candidate)) {
            color = candidate;
        }
    }

    if (color) {
        card.style.backgroundColor = color;
    }
}

// ========== GLISSER-DÉPOSER ET TRI ==========

function initialiserTriEtGlisserDeposer() {
    document.querySelectorAll('.contenu-colonne').forEach((column) => {
        trierTodo(column);

        if (W.opt.readonly || typeof Sortable !== 'function') {
            return;
        }

        new Sortable(column, {
            group: 'kanban-todo',
            animation: 150,
            ghostClass: 'carte-fantome',
            chosenClass: 'carte-selectionnee',
            onEnd: async (event) => {
                const targetStatus = event.to.dataset.statut;
                const sourceStatus = event.from.dataset.statut;
                const cardId = event.item.dataset.todoId;

                try {
                    if (targetStatus !== sourceStatus) {
                        await mettreAJourChamp(cardId, 'STATUT', targetStatus);
                    } else if (event.oldIndex !== event.newIndex) {
                        await mettreAJourOrdreParDeadline(event.to);
                    }
                } catch (error) {
                    console.error(T('Error during status update:'), error);
                    await afficherKanban(RECS);
                }

                trierTodo(event.to);
                mettreAJourCompteur(event.to.closest('.colonne-kanban'));
                if (event.from !== event.to) {
                    mettreAJourCompteur(event.from.closest('.colonne-kanban'));
                }
            }
        });
    });
}

async function mettreAJourOrdreParDeadline(column) {
    if (!W.map?.DEADLINE) {
        return;
    }

    const cards = Array.from(column.querySelectorAll('.carte'));
    const movedCards = cards.filter((card) => {
        const timestamp = toTimestamp(card.dataset.deadline);
        return timestamp === null || timestamp >= DEADLINE_PRIORITE.getTime();
    });

    if (movedCards.length === 0) {
        return;
    }

    let year = DEADLINE_PRIORITE.getFullYear();
    const records = movedCards.map((card) => {
        const deadline = `${year}-01-01`;
        year += 1;
        card.dataset.deadline = deadline;
        return W.formatRecord(card.dataset.todoId, {DEADLINE: deadline});
    });

    await W.updateRecords(records);
}

function trierTodo(container) {
    if (!container) {
        return;
    }

    const isDone = container.dataset.isdone === 'true';
    const cards = Array.from(container.children);

    cards.sort((a, b) => {
        let delta = 0;

        if (W.map?.DEADLINE) {
            if (isDone) {
                // La date de dernière mise à jour reste uniquement technique pour le tri.
                delta = toSortableTimestamp(b.dataset.lastUpdate, 0) - toSortableTimestamp(a.dataset.lastUpdate, 0);
            } else {
                delta = toSortableTimestamp(a.dataset.deadline, Number.MAX_SAFE_INTEGER)
                    - toSortableTimestamp(b.dataset.deadline, Number.MAX_SAFE_INTEGER);
            }
        }

        return delta !== 0
            ? delta
            : (Number(a.dataset.todoId) || 0) - (Number(b.dataset.todoId) || 0);
    });

    cards.forEach((card) => container.appendChild(card));
}

function mettreAJourCompteur(column) {
    if (!column) {
        return;
    }

    const content = column.querySelector('.contenu-colonne');
    const counter = column.querySelector('.compteur-colonne');
    if (content && counter) {
        counter.textContent = `(${content.children.length})`;
    }
}

// ========== FICHE LATÉRALE ==========

async function togglePopupTodo(todo) {
    const popup = document.getElementById('popup-todo');
    if (!popup) {
        return;
    }

    if (W.opt.readonly) {
        fermerPopup();
        return;
    }

    document.querySelector('.carte.active')?.classList.remove('active');
    trouverCarteParId(todo.id)?.classList.add('active');

    const columnOption = getColumnOptionByStatus(todo.STATUT);
    const background = W.col.STATUT.getColor(todo.STATUT) ?? BACKCOLOR;
    const color = W.col.STATUT.getTextColor(todo.STATUT) ?? TEXTCOLOR;

    popup.style.borderLeftColor = background;
    popup.dataset.statut = valeurTexte(todo.STATUT);
    popup.dataset.isdone = columnOption?.isdone ? 'true' : 'false';
    popup.dataset.currentTodo = String(todo.id);

    const title = popup.querySelector('.popup-title');
    const content = popup.querySelector('.popup-content');
    const header = popup.querySelector('.popup-header');
    const closeButton = popup.querySelector('.bouton-fermer');

    if (title) {
        title.textContent = valeurTexte(todo.DESCRIPTION) || T('New task');
    }
    if (header) {
        header.style.backgroundColor = background;
        header.style.color = color;
    }
    if (closeButton) {
        closeButton.style.color = color;
    }
    if (!content) {
        return;
    }

    const descriptionDisabled = W.col.DESCRIPTION.getIsFormula();
    const notesDisabled = W.map?.NOTES ? W.col.NOTES.getIsFormula() : false;

    // Le nom de la tâche et les notes sont volontairement placés tout en haut.
    let form = `
        <div class="task-main-fields">
            <div class="field field-primary">
                <label class="field-label">Nom de la tâche</label>
                <textarea
                    class="field-textarea auto-expand task-title-input"
                    onchange="mettreAJourChamp(${Number(todo.id)}, 'DESCRIPTION', this.value, event)"
                    oninput="ajusterTextarea(this)"
                    ${descriptionDisabled ? 'disabled' : ''}
                >${echapperHtml(valeurTexte(todo.DESCRIPTION))}</textarea>
            </div>
            ${W.map?.NOTES
                ? `<div class="field field-primary">
                    <label class="field-label">Notes</label>
                    <textarea
                        class="field-textarea auto-expand notes-input"
                        onchange="mettreAJourChamp(${Number(todo.id)}, 'NOTES', this.value, event)"
                        oninput="ajusterTextarea(this)"
                        ${notesDisabled ? 'disabled' : ''}
                    >${echapperHtml(valeurTexte(todo.NOTES))}</textarea>
                  </div>`
                : ''}
        </div>
    `;

    const compactFields = [];

    if (W.map?.ETIQUETTES) {
        compactFields.push(construireChampEtiquettes(todo));
    }

    if (W.map?.RESPONSABLE) {
        compactFields.push(insererChampResponsables(
            todo.id,
            obtenirIdsResponsables(todo),
            W.map.RESPONSABLE,
            W.col.RESPONSABLE.getIsFormula()
        ));
    }

    if (W.map?.DEADLINE) {
        compactFields.push(`
            <div class="field">
                <label class="field-label">Échéance</label>
                <input
                    type="date"
                    class="field-input"
                    value="${echapperAttribut(formatDateForInput(todo.DEADLINE))}"
                    onchange="mettreAJourChamp(${Number(todo.id)}, 'DEADLINE', this.value || null, event)"
                    ${W.col.DEADLINE.getIsFormula() ? 'disabled' : ''}
                >
            </div>
        `);
    }

    if (W.map?.REFERENCE_PROJET) {
        compactFields.push(insererChampSimple(
            todo.id,
            todo.REFERENCE_PROJET,
            W.valuesList.ref,
            'Référence projet',
            'REFERENCE_PROJET',
            W.col.REFERENCE_PROJET.getIsFormula()
        ));
    }

    if (W.map?.COULEUR) {
        compactFields.push(insererChampSimple(
            todo.id,
            todo.COULEUR,
            W.valuesList.cardcolor,
            'Couleur de carte',
            'COULEUR',
            W.col.COULEUR.getIsFormula()
        ));
    }

    for (let index = 0; index < compactFields.length; index += 2) {
        form += `<div class="field-row">${compactFields[index]}${compactFields[index + 1] || ''}</div>`;
    }

    if (W.map?.PIECES_JOINTES) {
        form += construireSectionPiecesJointes(todo);
    }

    if (W.map?.COMMENTAIRES) {
        form += construireSectionCommentaires(todo);
    }

    const creationInfo = construireInfoCreation(todo);
    if (creationInfo) {
        form += `<div class="info-creation">${creationInfo}</div>`;
    }

    form += `
        <div class="popup-actions">
            <button
                type="button"
                class="popup-action-button bouton-supprimer"
                onclick="supprimerTodo(${Number(todo.id)}, event)"
                title="${echapperAttribut(T('Remove the task'))}"
                aria-label="${echapperAttribut(T('Remove the task'))}"
            >🗑️</button>
        </div>
    `;

    content.innerHTML = form;
    content.querySelectorAll('.auto-expand').forEach(ajusterTextarea);
    popup.classList.add('visible');

    if (W.map?.PIECES_JOINTES) {
        await rafraichirPiecesJointes(todo.id);
    }
}

function insererChampSimple(id, value, list, title, column, disabled) {
    const currentValue = valeurTexte(value);
    const choices = [...new Set(normaliserListeTexte(list))];
    const label = echapperHtml(title);

    if (choices.length > 0 && choices.length < 20) {
        const options = choices.map((choice) => `
            <option value="${echapperAttribut(choice)}" ${choice === currentValue ? 'selected' : ''}>${echapperHtml(choice)}</option>
        `).join('');

        return `
            <div class="field">
                <label class="field-label">${label}</label>
                <select
                    class="field-select"
                    onchange="mettreAJourChamp(${Number(id)}, '${echapperJs(column)}', this.value || null, event)"
                    ${disabled ? 'disabled' : ''}
                >
                    <option value=""></option>
                    ${options}
                </select>
            </div>
        `;
    }

    if (choices.length >= 20) {
        const dataListId = `list-${column}-${id}`.replace(/[^a-zA-Z0-9_-]/g, '-');
        const options = choices.map((choice) => `<option value="${echapperAttribut(choice)}"></option>`).join('');

        return `
            <div class="field">
                <label class="field-label">${label}</label>
                <input
                    type="text"
                    list="${dataListId}"
                    class="field-input"
                    value="${echapperAttribut(currentValue)}"
                    onchange="mettreAJourChamp(${Number(id)}, '${echapperJs(column)}', this.value || null, event)"
                    ${disabled ? 'disabled' : ''}
                >
                <datalist id="${dataListId}">${options}</datalist>
            </div>
        `;
    }

    return `
        <div class="field">
            <label class="field-label">${label}</label>
            <input
                type="text"
                class="field-input"
                value="${echapperAttribut(currentValue)}"
                onchange="mettreAJourChamp(${Number(id)}, '${echapperJs(column)}', this.value || null, event)"
                ${disabled ? 'disabled' : ''}
            >
        </div>
    `;
}

// ========== RESPONSABLES ==========

function insererChampResponsables(id, selectedIds, title, disabled) {
    const selection = new Set(normaliserIdsRefList(selectedIds));
    const options = RESPONSABLES.map((person) => `
        <label class="multi-option" data-search="${echapperAttribut(person.label.toLocaleLowerCase(W.cultureFull))}">
            <input
                type="checkbox"
                value="${person.id}"
                data-label="${echapperAttribut(person.label)}"
                ${selection.has(person.id) ? 'checked' : ''}
                onchange="mettreAJourChampResponsables(${Number(id)}, this.closest('.multi-dropdown'), event)"
                ${disabled ? 'disabled' : ''}
            >
            <span>${echapperHtml(person.label)}</span>
        </label>
    `).join('');

    const selectedLabels = [...selection]
        .map((personId) => RESPONSABLES_BY_ID.get(personId)?.label)
        .filter(Boolean);

    return `
        <div class="field field-responsables">
            <label class="field-label">${echapperHtml(title)}</label>
            <details class="multi-dropdown responsables-dropdown" data-row-id="${Number(id)}">
                <summary>${echapperHtml(resumeResponsables(selectedLabels))}</summary>
                <div class="multi-dropdown-menu">
                    <div class="multi-toolbar">
                        <input
                            type="search"
                            class="multi-search"
                            placeholder="Rechercher…"
                            oninput="filtrerOptionsMultiples(this)"
                            onclick="event.stopPropagation()"
                            ${disabled ? 'disabled' : ''}
                        >
                        <button type="button" class="multi-clear" onclick="viderResponsables(this, event)" ${disabled ? 'disabled' : ''}>Effacer</button>
                    </div>
                    <div class="multi-options">${options || '<div class="multi-empty">Aucun membre disponible</div>'}</div>
                    <div class="multi-status" aria-live="polite"></div>
                </div>
            </details>
        </div>
    `;
}

function resumeResponsables(labels) {
    const values = normaliserListeTexte(labels);
    if (values.length === 0) {
        return 'Choisir…';
    }
    if (values.length === 1) {
        return values[0];
    }
    return `${values.length} responsables`;
}

function filtrerOptionsMultiples(input) {
    const dropdown = input.closest('.multi-dropdown');
    if (!dropdown) {
        return;
    }

    const query = input.value.trim().toLocaleLowerCase(W.cultureFull);
    dropdown.querySelectorAll('.multi-option').forEach((option) => {
        option.hidden = query !== '' && !valeurTexte(option.dataset.search).includes(query);
    });
}

function viderResponsables(button, event) {
    event?.preventDefault();
    event?.stopPropagation();

    const dropdown = button.closest('.multi-dropdown');
    if (!dropdown) {
        return;
    }

    dropdown.querySelectorAll('input[type="checkbox"]:checked').forEach((checkbox) => {
        checkbox.checked = false;
    });

    mettreAJourChampResponsables(Number(dropdown.dataset.rowId), dropdown, event);
}

async function mettreAJourChampResponsables(rowId, dropdown, event) {
    event?.stopPropagation();

    const resolvedRowId = Number(rowId || dropdown?.dataset?.rowId);
    if (!Number.isInteger(resolvedRowId) || resolvedRowId <= 0 || !dropdown) {
        return;
    }

    const ids = Array.from(dropdown.querySelectorAll('input[type="checkbox"]:checked'))
        .map((input) => Number(input.value))
        .filter((id) => Number.isInteger(id) && id > 0 && RESPONSABLES_BY_ID.has(id));

    const labels = ids.map((id) => RESPONSABLES_BY_ID.get(id).label);
    dropdown.querySelector('summary').textContent = resumeResponsables(labels);
    setMultiStatus(dropdown, 'saving', 'Enregistrement…');

    const previous = RESPONSABLE_SAVE_QUEUES.get(resolvedRowId) || Promise.resolve();
    const next = previous
        .catch(() => undefined)
        .then(() => enregistrerResponsablesDansGrist(resolvedRowId, ids))
        .then(() => {
            mettreAJourResponsablesLocaux(resolvedRowId, ids);
            setMultiStatus(dropdown, 'saved', 'Enregistré');
            window.setTimeout(() => setMultiStatus(dropdown, '', ''), 1200);
        })
        .catch((error) => {
            setMultiStatus(dropdown, 'error', 'Échec de l’enregistrement');
            console.error('Erreur lors de l’enregistrement des responsables :', error);
        })
        .finally(() => {
            if (RESPONSABLE_SAVE_QUEUES.get(resolvedRowId) === next) {
                RESPONSABLE_SAVE_QUEUES.delete(resolvedRowId);
            }
        });

    RESPONSABLE_SAVE_QUEUES.set(resolvedRowId, next);
    await next;
}

async function enregistrerResponsablesDansGrist(rowId, ids) {
    const actualColumnId = W.map?.RESPONSABLE;
    if (!actualColumnId || Array.isArray(actualColumnId)) {
        throw new Error('La colonne Responsable n’est pas correctement mappée.');
    }

    const table = grist.getTable();
    await table.update({
        id: Number(rowId),
        fields: {[actualColumnId]: [...ids]}
    });

    await mettreAJourDateTechnique(rowId);
}

function mettreAJourResponsablesLocaux(rowId, ids) {
    const record = trouverRecord(rowId);
    if (!record) {
        return;
    }

    record.RESPONSABLE_id = [...ids];
    record.RESPONSABLE = ids.map((id) => RESPONSABLES_BY_ID.get(id)?.label).filter(Boolean);
}

// ========== ÉTIQUETTES ==========

function construireChampEtiquettes(todo) {
    const selected = new Set(normaliserListeTexte(todo.ETIQUETTES));
    const options = ETIQUETTES.map((label) => {
        const background = W.col.ETIQUETTES.getColor(label) || '#dfe3e8';
        const color = W.col.ETIQUETTES.getTextColor(label) || '#273142';
        return `
            <label class="multi-option etiquette-option" data-search="${echapperAttribut(label.toLocaleLowerCase(W.cultureFull))}">
                <input
                    type="checkbox"
                    value="${echapperAttribut(label)}"
                    ${selected.has(label) ? 'checked' : ''}
                    onchange="mettreAJourEtiquettes(${Number(todo.id)}, this.closest('.multi-dropdown'), event)"
                    ${W.col.ETIQUETTES.getIsFormula() ? 'disabled' : ''}
                >
                <span class="etiquette-preview" style="background:${echapperAttribut(background)};color:${echapperAttribut(color)}">${echapperHtml(label)}</span>
            </label>
        `;
    }).join('');

    return `
        <div class="field field-etiquettes">
            <label class="field-label">Étiquettes</label>
            <details class="multi-dropdown etiquettes-dropdown" data-row-id="${Number(todo.id)}">
                <summary>${echapperHtml(resumeEtiquettes([...selected]))}</summary>
                <div class="multi-dropdown-menu">
                    <div class="multi-toolbar">
                        <input type="search" class="multi-search" placeholder="Rechercher…" oninput="filtrerOptionsMultiples(this)" onclick="event.stopPropagation()">
                        <button type="button" class="multi-clear" onclick="viderEtiquettes(this, event)">Effacer</button>
                    </div>
                    <div class="multi-options">${options || '<div class="multi-empty">Ajoutez des choix dans la colonne Étiquettes de Grist</div>'}</div>
                    <div class="multi-status" aria-live="polite"></div>
                </div>
            </details>
        </div>
    `;
}

function resumeEtiquettes(labels) {
    const values = normaliserListeTexte(labels);
    if (values.length === 0) {
        return 'Choisir…';
    }
    if (values.length === 1) {
        return values[0];
    }
    return `${values.length} étiquettes`;
}

function viderEtiquettes(button, event) {
    event?.preventDefault();
    event?.stopPropagation();

    const dropdown = button.closest('.multi-dropdown');
    dropdown?.querySelectorAll('input[type="checkbox"]:checked').forEach((checkbox) => {
        checkbox.checked = false;
    });

    if (dropdown) {
        mettreAJourEtiquettes(Number(dropdown.dataset.rowId), dropdown, event);
    }
}

async function mettreAJourEtiquettes(rowId, dropdown, event) {
    event?.stopPropagation();

    const resolvedRowId = Number(rowId || dropdown?.dataset?.rowId);
    if (!Number.isInteger(resolvedRowId) || resolvedRowId <= 0 || !dropdown) {
        return;
    }

    const labels = Array.from(dropdown.querySelectorAll('input[type="checkbox"]:checked'))
        .map((input) => valeurTexte(input.value))
        .filter((label) => ETIQUETTES.includes(label));

    dropdown.querySelector('summary').textContent = resumeEtiquettes(labels);
    setMultiStatus(dropdown, 'saving', 'Enregistrement…');

    const previous = LABEL_SAVE_QUEUES.get(resolvedRowId) || Promise.resolve();
    const next = previous
        .catch(() => undefined)
        .then(async () => {
            const actualColumnId = W.map?.ETIQUETTES;
            if (!actualColumnId || Array.isArray(actualColumnId)) {
                throw new Error('La colonne Étiquettes n’est pas correctement mappée.');
            }

            // ChoiceList est un objet liste typé dans l’API de widget Grist.
            await grist.getTable().update({
                id: resolvedRowId,
                fields: {[actualColumnId]: ['L', ...labels]}
            });
            await mettreAJourDateTechnique(resolvedRowId);
        })
        .then(() => {
            const record = trouverRecord(resolvedRowId);
            if (record) {
                record.ETIQUETTES = [...labels];
            }
            setMultiStatus(dropdown, 'saved', 'Enregistré');
            window.setTimeout(() => setMultiStatus(dropdown, '', ''), 1200);
        })
        .catch((error) => {
            setMultiStatus(dropdown, 'error', 'Échec de l’enregistrement');
            console.error('Erreur lors de l’enregistrement des étiquettes :', error);
        })
        .finally(() => {
            if (LABEL_SAVE_QUEUES.get(resolvedRowId) === next) {
                LABEL_SAVE_QUEUES.delete(resolvedRowId);
            }
        });

    LABEL_SAVE_QUEUES.set(resolvedRowId, next);
    await next;
}

function setMultiStatus(dropdown, state, message) {
    const status = dropdown?.querySelector('.multi-status');
    if (!status) {
        return;
    }

    status.className = `multi-status${state ? ` ${state}` : ''}`;
    status.textContent = message;
}

// ========== PIÈCES JOINTES ==========

function construireSectionPiecesJointes(todo) {
    const disabled = W.col.PIECES_JOINTES.getIsFormula();
    return `
        <section class="detail-section attachments-section" data-row-id="${Number(todo.id)}">
            <div class="detail-section-header">
                <div>
                    <h3>📎 Pièces jointes</h3>
                    <p>Images, PDF et autres fichiers</p>
                </div>
                <label class="attachment-upload-button ${disabled ? 'disabled' : ''}">
                    <span>Ajouter</span>
                    <input
                        type="file"
                        multiple
                        onchange="ajouterPiecesJointes(${Number(todo.id)}, this, event)"
                        ${disabled ? 'disabled' : ''}
                    >
                </label>
            </div>
            <div id="attachments-status-${Number(todo.id)}" class="section-status" aria-live="polite"></div>
            <div id="attachments-list-${Number(todo.id)}" class="attachments-grid">
                <div class="section-loading">Chargement des pièces jointes…</div>
            </div>
        </section>
    `;
}

async function rafraichirPiecesJointes(rowId) {
    const container = document.getElementById(`attachments-list-${Number(rowId)}`);
    if (!container) {
        return;
    }

    const record = trouverRecord(rowId);
    const ids = normaliserIdsListe(record?.PIECES_JOINTES);

    if (ids.length === 0) {
        container.innerHTML = '<div class="section-empty">Aucune pièce jointe</div>';
        return;
    }

    container.innerHTML = '<div class="section-loading">Chargement des aperçus…</div>';

    try {
        const [tokenInfo] = await Promise.all([
            obtenirTokenPiecesJointes(true),
            chargerMetaPiecesJointes()
        ]);

        container.innerHTML = ids.map((id) => construireCartePieceJointe(rowId, id, tokenInfo)).join('');
    } catch (error) {
        console.error('Impossible d’afficher les pièces jointes :', error);
        container.innerHTML = ids.map((id) => construireCartePieceJointe(rowId, id, null)).join('');
    }
}

function construireCartePieceJointe(rowId, attachmentId, tokenInfo) {
    const meta = getAttachmentMeta(attachmentId);
    const url = tokenInfo ? construireUrlPieceJointe(tokenInfo, attachmentId) : '';
    const kind = typePieceJointe(meta);
    const preview = kind === 'image' && url
        ? `<img src="${echapperAttribut(url)}" alt="${echapperAttribut(meta.fileName)}" loading="lazy">`
        : `<div class="attachment-file-icon">${iconePieceJointe(kind)}</div>`;

    return `
        <article class="attachment-card">
            <button type="button" class="attachment-preview" onclick="ouvrirPieceJointe(${Number(rowId)}, ${Number(attachmentId)}, event)" title="Ouvrir ${echapperAttribut(meta.fileName)}">
                ${preview}
            </button>
            <div class="attachment-info">
                <div class="attachment-name" title="${echapperAttribut(meta.fileName)}">${echapperHtml(meta.fileName)}</div>
                <div class="attachment-meta">${echapperHtml(formatTailleFichier(meta.fileSize))}</div>
            </div>
            <div class="attachment-actions">
                <button type="button" onclick="ouvrirPieceJointe(${Number(rowId)}, ${Number(attachmentId)}, event)" title="Visualiser">👁</button>
                <button type="button" onclick="retirerPieceJointe(${Number(rowId)}, ${Number(attachmentId)}, event)" title="Retirer de la tâche">×</button>
            </div>
        </article>
    `;
}

async function ajouterPiecesJointes(rowId, input, event) {
    event?.stopPropagation();

    const files = Array.from(input?.files || []);
    if (files.length === 0) {
        return;
    }

    const tooLarge = files.find((file) => file.size > MAX_ATTACHMENT_SIZE);
    if (tooLarge) {
        afficherStatutSection('attachments', rowId, 'error', `${tooLarge.name} dépasse 50 Mo.`);
        input.value = '';
        return;
    }

    input.disabled = true;
    afficherStatutSection('attachments', rowId, 'saving', `Envoi de ${files.length} fichier(s)…`);

    try {
        const tokenInfo = await grist.docApi.getAccessToken({readOnly: false});
        const formData = new FormData();
        files.forEach((file) => formData.append('upload', file, file.name));

        const response = await fetch(`${tokenInfo.baseUrl}/attachments?auth=${encodeURIComponent(tokenInfo.token)}`, {
            method: 'POST',
            body: formData,
            headers: {'X-Requested-With': 'XMLHttpRequest'}
        });

        if (!response.ok) {
            throw new Error(`Upload échoué (${response.status} ${response.statusText})`);
        }

        const result = await response.json();
        const uploadedIds = normaliserIdsListe(result);
        if (uploadedIds.length === 0) {
            throw new Error('Grist n’a retourné aucun identifiant de pièce jointe.');
        }

        const record = trouverRecord(rowId);
        const existingIds = normaliserIdsListe(record?.PIECES_JOINTES);
        const newIds = [...new Set([...existingIds, ...uploadedIds])];
        await enregistrerPiecesJointesDansGrist(rowId, newIds);

        if (record) {
            record.PIECES_JOINTES = [...newIds];
        }

        ATTACHMENT_META_LOADED = false;
        await chargerMetaPiecesJointes(true);
        await rafraichirPiecesJointes(rowId);
        afficherStatutSection('attachments', rowId, 'saved', 'Pièce(s) jointe(s) ajoutée(s).');
    } catch (error) {
        console.error('Erreur pendant l’ajout des pièces jointes :', error);
        afficherStatutSection('attachments', rowId, 'error', error.message || 'Échec de l’envoi.');
    } finally {
        input.value = '';
        input.disabled = false;
    }
}

async function retirerPieceJointe(rowId, attachmentId, event) {
    event?.preventDefault();
    event?.stopPropagation();

    const record = trouverRecord(rowId);
    const ids = normaliserIdsListe(record?.PIECES_JOINTES);
    const remaining = ids.filter((id) => id !== Number(attachmentId));

    try {
        afficherStatutSection('attachments', rowId, 'saving', 'Mise à jour…');
        await enregistrerPiecesJointesDansGrist(rowId, remaining);
        if (record) {
            record.PIECES_JOINTES = [...remaining];
        }
        await rafraichirPiecesJointes(rowId);
        afficherStatutSection('attachments', rowId, 'saved', 'Pièce jointe retirée de la tâche.');
    } catch (error) {
        console.error('Erreur pendant le retrait de la pièce jointe :', error);
        afficherStatutSection('attachments', rowId, 'error', 'Impossible de retirer la pièce jointe.');
    }
}

async function enregistrerPiecesJointesDansGrist(rowId, ids) {
    const actualColumnId = W.map?.PIECES_JOINTES;
    if (!actualColumnId || Array.isArray(actualColumnId)) {
        throw new Error('La colonne Pièces jointes n’est pas correctement mappée.');
    }

    // L’API table.update attend ici un objet liste typé.
    await grist.getTable().update({
        id: Number(rowId),
        fields: {[actualColumnId]: ['L', ...ids]}
    });

    await mettreAJourDateTechnique(rowId);
}

async function ouvrirPieceJointe(rowId, attachmentId, event) {
    event?.preventDefault();
    event?.stopPropagation();

    try {
        const [tokenInfo] = await Promise.all([
            obtenirTokenPiecesJointes(true),
            chargerMetaPiecesJointes()
        ]);

        const meta = getAttachmentMeta(attachmentId);
        const url = construireUrlPieceJointe(tokenInfo, attachmentId);
        afficherLecteurPieceJointe(meta, url);
    } catch (error) {
        console.error('Impossible d’ouvrir la pièce jointe :', error);
        window.alert('Impossible d’ouvrir cette pièce jointe.');
    }
}

function initialiserLecteurPiecesJointes() {
    if (document.getElementById('attachment-viewer')) {
        return;
    }

    const viewer = document.createElement('div');
    viewer.id = 'attachment-viewer';
    viewer.className = 'attachment-viewer';
    viewer.setAttribute('aria-hidden', 'true');
    viewer.innerHTML = `
        <div class="attachment-viewer-backdrop" onclick="fermerLecteurPieceJointe(event)"></div>
        <div class="attachment-viewer-dialog" role="dialog" aria-modal="true" aria-labelledby="attachment-viewer-title">
            <div class="attachment-viewer-header">
                <h3 id="attachment-viewer-title">Pièce jointe</h3>
                <div class="attachment-viewer-actions">
                    <a id="attachment-viewer-download" href="#" target="_blank" rel="noopener">Télécharger</a>
                    <button type="button" onclick="fermerLecteurPieceJointe(event)" aria-label="Fermer">×</button>
                </div>
            </div>
            <div id="attachment-viewer-content" class="attachment-viewer-content"></div>
        </div>
    `;
    document.body.appendChild(viewer);
}

function afficherLecteurPieceJointe(meta, url) {
    const viewer = document.getElementById('attachment-viewer');
    const content = document.getElementById('attachment-viewer-content');
    const title = document.getElementById('attachment-viewer-title');
    const download = document.getElementById('attachment-viewer-download');
    if (!viewer || !content || !title || !download) {
        return;
    }

    title.textContent = meta.fileName;
    download.href = url;
    const kind = typePieceJointe(meta);

    if (kind === 'image') {
        content.innerHTML = `<img src="${echapperAttribut(url)}" alt="${echapperAttribut(meta.fileName)}">`;
    } else if (kind === 'pdf') {
        content.innerHTML = `<iframe src="${echapperAttribut(url)}" title="${echapperAttribut(meta.fileName)}"></iframe>`;
    } else if (kind === 'video') {
        content.innerHTML = `<video src="${echapperAttribut(url)}" controls autoplay></video>`;
    } else if (kind === 'audio') {
        content.innerHTML = `<div class="attachment-generic-preview"><div class="attachment-large-icon">🎵</div><audio src="${echapperAttribut(url)}" controls autoplay></audio></div>`;
    } else {
        content.innerHTML = `<div class="attachment-generic-preview"><div class="attachment-large-icon">${iconePieceJointe(kind)}</div><p>Ce format ne dispose pas d’un aperçu intégré.</p><a href="${echapperAttribut(url)}" target="_blank" rel="noopener">Ouvrir ou télécharger le fichier</a></div>`;
    }

    viewer.classList.add('visible');
    viewer.setAttribute('aria-hidden', 'false');
}

function fermerLecteurPieceJointe(event) {
    event?.preventDefault();
    event?.stopPropagation();
    const viewer = document.getElementById('attachment-viewer');
    if (!viewer) {
        return;
    }

    viewer.classList.remove('visible');
    viewer.setAttribute('aria-hidden', 'true');
    const content = document.getElementById('attachment-viewer-content');
    if (content) {
        content.innerHTML = '';
    }
}

async function obtenirTokenPiecesJointes(readOnly = true) {
    if (readOnly && ATTACHMENT_READ_TOKEN && Date.now() - ATTACHMENT_READ_TOKEN_AT < ATTACHMENT_TOKEN_MAX_AGE) {
        return ATTACHMENT_READ_TOKEN;
    }

    const token = await grist.docApi.getAccessToken({readOnly});
    if (readOnly) {
        ATTACHMENT_READ_TOKEN = token;
        ATTACHMENT_READ_TOKEN_AT = Date.now();
    }
    return token;
}

function construireUrlPieceJointe(tokenInfo, attachmentId) {
    return `${tokenInfo.baseUrl}/attachments/${Number(attachmentId)}/download?auth=${encodeURIComponent(tokenInfo.token)}`;
}

function getAttachmentMeta(id) {
    return ATTACHMENT_META.get(Number(id)) || {
        id: Number(id),
        fileName: `Pièce jointe ${Number(id)}`,
        fileExt: '',
        fileType: '',
        fileSize: 0,
        imageWidth: 0,
        imageHeight: 0
    };
}

function typePieceJointe(meta) {
    const extension = valeurTexte(meta.fileExt || extensionDepuisNom(meta.fileName)).toLowerCase().replace(/^\./, '');
    const mime = valeurTexte(meta.fileType).toLowerCase();

    if (mime.startsWith('image/') || ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp', 'avif'].includes(extension)) return 'image';
    if (mime === 'application/pdf' || extension === 'pdf') return 'pdf';
    if (mime.startsWith('video/') || ['mp4', 'webm', 'mov', 'm4v', 'ogv'].includes(extension)) return 'video';
    if (mime.startsWith('audio/') || ['mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac'].includes(extension)) return 'audio';
    if (['doc', 'docx', 'odt'].includes(extension)) return 'document';
    if (['xls', 'xlsx', 'ods', 'csv'].includes(extension)) return 'tableur';
    if (['ppt', 'pptx', 'odp'].includes(extension)) return 'presentation';
    if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) return 'archive';
    return 'file';
}

function iconePieceJointe(kind) {
    return {
        image: '🖼️',
        pdf: '📕',
        video: '🎬',
        audio: '🎵',
        document: '📄',
        tableur: '📊',
        presentation: '📽️',
        archive: '🗜️',
        file: '📎'
    }[kind] || '📎';
}

// ========== COMMENTAIRES ==========

function construireSectionCommentaires(todo) {
    const comments = parserCommentaires(todo.COMMENTAIRES);
    const author = localStorage.getItem('kanban2-comment-author') || '';

    return `
        <section class="detail-section comments-section" data-row-id="${Number(todo.id)}">
            <div class="detail-section-header">
                <div>
                    <h3>💬 Commentaires</h3>
                    <p>${comments.length} commentaire(s)</p>
                </div>
            </div>
            <div id="comments-list-${Number(todo.id)}" class="comments-list">
                ${construireListeCommentaires(comments, todo.id)}
            </div>
            <div class="comment-composer">
                <input
                    type="text"
                    class="comment-author"
                    value="${echapperAttribut(author)}"
                    placeholder="Votre nom"
                    onchange="memoriserAuteurCommentaire(this.value)"
                >
                <textarea class="comment-input" placeholder="Écrire un commentaire…" oninput="ajusterTextarea(this)"></textarea>
                <div class="comment-composer-footer">
                    <div id="comments-status-${Number(todo.id)}" class="section-status" aria-live="polite"></div>
                    <button type="button" onclick="ajouterCommentaire(${Number(todo.id)}, this, event)">Commenter</button>
                </div>
            </div>
        </section>
    `;
}

function construireListeCommentaires(comments, rowId) {
    if (comments.length === 0) {
        return '<div class="section-empty">Aucun commentaire</div>';
    }

    return comments.map((comment) => `
        <article class="comment-card" data-comment-id="${echapperAttribut(comment.id)}">
            <div class="comment-header">
                <strong>${echapperHtml(comment.author || 'Anonyme')}</strong>
                <span>${echapperHtml(formatDateTime(comment.createdAt))}</span>
                <button type="button" onclick="supprimerCommentaire(${Number(rowId)}, '${echapperJs(comment.id)}', event)" title="Supprimer le commentaire">×</button>
            </div>
            <div class="comment-body">${echapperHtml(comment.text).replace(/\n/g, '<br>')}</div>
        </article>
    `).join('');
}

function parserCommentaires(rawValue) {
    const raw = valeurTexte(rawValue).trim();
    if (!raw) {
        return [];
    }

    try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) {
            throw new Error('Format non tableau');
        }

        return parsed
            .map((comment, index) => ({
                id: valeurTexte(comment?.id) || `legacy-${index}`,
                author: valeurTexte(comment?.author) || 'Anonyme',
                createdAt: valeurTexte(comment?.createdAt),
                text: valeurTexte(comment?.text)
            }))
            .filter((comment) => comment.text.trim());
    } catch (_) {
        // Compatibilité avec une ancienne cellule de texte simple.
        return [{
            id: 'legacy-text',
            author: 'Ancien commentaire',
            createdAt: '',
            text: raw
        }];
    }
}

function memoriserAuteurCommentaire(value) {
    localStorage.setItem('kanban2-comment-author', valeurTexte(value).trim());
}

async function ajouterCommentaire(rowId, button, event) {
    event?.preventDefault();
    event?.stopPropagation();

    const section = button.closest('.comments-section');
    const textarea = section?.querySelector('.comment-input');
    const authorInput = section?.querySelector('.comment-author');
    const text = valeurTexte(textarea?.value).trim();
    const author = valeurTexte(authorInput?.value).trim() || 'Anonyme';

    if (!text) {
        afficherStatutSection('comments', rowId, 'error', 'Écrivez un commentaire.');
        textarea?.focus();
        return;
    }

    memoriserAuteurCommentaire(author);
    button.disabled = true;
    afficherStatutSection('comments', rowId, 'saving', 'Enregistrement…');

    const comment = {
        id: genererIdentifiant(),
        author,
        createdAt: new Date().toISOString(),
        text
    };

    try {
        await mettreAJourCommentairesEnFile(rowId, (comments) => [...comments, comment]);
        if (textarea) {
            textarea.value = '';
            ajusterTextarea(textarea);
        }
        rafraichirCommentaires(rowId);
        afficherStatutSection('comments', rowId, 'saved', 'Commentaire ajouté.');
    } catch (error) {
        console.error('Erreur pendant l’ajout du commentaire :', error);
        afficherStatutSection('comments', rowId, 'error', 'Impossible d’ajouter le commentaire.');
    } finally {
        button.disabled = false;
    }
}

async function supprimerCommentaire(rowId, commentId, event) {
    event?.preventDefault();
    event?.stopPropagation();

    try {
        afficherStatutSection('comments', rowId, 'saving', 'Suppression…');
        await mettreAJourCommentairesEnFile(rowId, (comments) => comments.filter((comment) => comment.id !== commentId));
        rafraichirCommentaires(rowId);
        afficherStatutSection('comments', rowId, 'saved', 'Commentaire supprimé.');
    } catch (error) {
        console.error('Erreur pendant la suppression du commentaire :', error);
        afficherStatutSection('comments', rowId, 'error', 'Impossible de supprimer le commentaire.');
    }
}

async function mettreAJourCommentairesEnFile(rowId, transform) {
    const resolvedRowId = Number(rowId);
    const previous = COMMENT_SAVE_QUEUES.get(resolvedRowId) || Promise.resolve();

    const next = previous
        .catch(() => undefined)
        .then(async () => {
            const record = trouverRecord(resolvedRowId);
            const current = parserCommentaires(record?.COMMENTAIRES);
            const updated = transform(current);
            const serialized = JSON.stringify(updated);

            await W.updateRecords(W.formatRecord(resolvedRowId, {
                COMMENTAIRES: serialized,
                ...(W.map?.DERNIERE_MISE_A_JOUR && !W.col.DERNIERE_MISE_A_JOUR.getIsFormula()
                    ? {DERNIERE_MISE_A_JOUR: new Date().toISOString()}
                    : {})
            }));

            if (record) {
                record.COMMENTAIRES = serialized;
            }
        })
        .finally(() => {
            if (COMMENT_SAVE_QUEUES.get(resolvedRowId) === next) {
                COMMENT_SAVE_QUEUES.delete(resolvedRowId);
            }
        });

    COMMENT_SAVE_QUEUES.set(resolvedRowId, next);
    return next;
}

function rafraichirCommentaires(rowId) {
    const record = trouverRecord(rowId);
    const comments = parserCommentaires(record?.COMMENTAIRES);
    const list = document.getElementById(`comments-list-${Number(rowId)}`);
    const section = list?.closest('.comments-section');

    if (list) {
        list.innerHTML = construireListeCommentaires(comments, rowId);
    }
    const subtitle = section?.querySelector('.detail-section-header p');
    if (subtitle) {
        subtitle.textContent = `${comments.length} commentaire(s)`;
    }
}

// ========== ÉCRITURE GRIST ==========

async function mettreAJourChamp(todoId, field, value, event) {
    event?.stopPropagation();

    try {
        if (field === 'STATUT') {
            const columnInfo = getColumnOptionByStatus(value);
            if (columnInfo?.useconfetti) {
                triggerConfetti();
            }
        }

        const data = {[field]: value};
        if (W.map?.DERNIERE_MISE_A_JOUR && field !== 'DERNIERE_MISE_A_JOUR' && !W.col.DERNIERE_MISE_A_JOUR.getIsFormula()) {
            data.DERNIERE_MISE_A_JOUR = new Date().toISOString();
        }

        await W.updateRecords(W.formatRecord(todoId, data));

        const record = trouverRecord(todoId);
        if (record) {
            record[field] = value;
            if (data.DERNIERE_MISE_A_JOUR) {
                record.DERNIERE_MISE_A_JOUR = data.DERNIERE_MISE_A_JOUR;
            }
        }
    } catch (error) {
        console.error(T('Error during update:'), error);
        throw error;
    }
}

async function mettreAJourDateTechnique(rowId) {
    if (!W.map?.DERNIERE_MISE_A_JOUR || W.col.DERNIERE_MISE_A_JOUR.getIsFormula()) {
        return;
    }

    try {
        const value = new Date().toISOString();
        await W.updateRecords(W.formatRecord(rowId, {DERNIERE_MISE_A_JOUR: value}));
        const record = trouverRecord(rowId);
        if (record) {
            record.DERNIERE_MISE_A_JOUR = value;
        }
    } catch (error) {
        console.warn('Données enregistrées, mais date technique non modifiée :', error);
    }
}

async function creerNouvelleTache(status) {
    try {
        const data = {DESCRIPTION: '', STATUT: status};

        if (W.map?.REFERENCE_PROJET && !W.col.REFERENCE_PROJET.getIsFormula()) data.REFERENCE_PROJET = null;
        if (W.map?.DERNIERE_MISE_A_JOUR && !W.col.DERNIERE_MISE_A_JOUR.getIsFormula()) data.DERNIERE_MISE_A_JOUR = new Date().toISOString();
        if (W.map?.CREE_LE && !W.col.CREE_LE.getIsFormula()) data.CREE_LE = new Date().toISOString();
        if (W.map?.COMMENTAIRES && !W.col.COMMENTAIRES.getIsFormula()) data.COMMENTAIRES = '[]';

        const result = await W.createRecords({fields: data});
        if (result?.id > 0) {
            grist.setCursorPos({rowId: result.id});
            const record = await W.fetchSelectedRecord(result.id);
            if (!W.opt.hideedit) {
                togglePopupTodo(record);
            }
        }
    } catch (error) {
        console.error(T('Error on creation:'), error);
    }
}

async function supprimerTodo(todoId, event) {
    event?.stopPropagation();
    if (!confirm(T('Are you sure you want to delete this task?'))) {
        return;
    }

    try {
        await W.destroyRecords(todoId);
        fermerPopup();
    } catch (error) {
        console.error(T('Error on delete:'), error);
    }
}

// ========== POPUP ET INTERACTIONS ==========

function fermerPopup() {
    const popup = document.getElementById('popup-todo');
    if (!popup) {
        return;
    }

    trouverCarteParId(popup.dataset.currentTodo)?.classList.remove('active');
    popup.classList.remove('visible');
    fermerTousLesMenusMultiples();
}

function toggleColonne(column, event) {
    event?.stopPropagation();
    if (!column) {
        return;
    }

    column.classList.toggle('collapsed');
    const status = column.querySelector('.titre-statut')?.childNodes?.[0]?.textContent?.trim() || column.id;
    localStorage.setItem(getColumnStorageKey(status), String(column.classList.contains('collapsed')));
}

function ajusterTextarea(textarea) {
    if (!textarea) {
        return;
    }
    textarea.style.height = '';
    textarea.style.height = `${Math.max(textarea.scrollHeight, 42)}px`;
}

function fermerTousLesMenusMultiples(except = null) {
    document.querySelectorAll('.multi-dropdown[open]').forEach((details) => {
        if (details !== except) {
            details.removeAttribute('open');
        }
    });
}

document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') {
        return;
    }

    const viewer = document.getElementById('attachment-viewer');
    if (viewer?.classList.contains('visible')) {
        fermerLecteurPieceJointe(event);
        return;
    }

    const openedDropdown = document.querySelector('.multi-dropdown[open]');
    if (openedDropdown) {
        openedDropdown.removeAttribute('open');
    } else {
        fermerPopup();
    }
});

document.addEventListener('click', (event) => {
    const openedDropdown = event.target.closest('.multi-dropdown');
    fermerTousLesMenusMultiples(openedDropdown);

    const popup = document.getElementById('popup-todo');
    if (!popup?.classList.contains('visible')) {
        return;
    }

    const isInsidePopup = popup.contains(event.target);
    const isCard = Boolean(event.target.closest('.carte'));
    const isAttachmentViewer = Boolean(event.target.closest('#attachment-viewer'));
    if (!isInsidePopup && !isCard && !isAttachmentViewer) {
        fermerPopup();
    }
});

// ========== HELPERS ==========

function trouverRecord(rowId) {
    return RECS.find((item) => Number(item.id) === Number(rowId)) || null;
}

function trouverCarteParId(rowId) {
    return Array.from(document.querySelectorAll('.carte'))
        .find((card) => Number(card.dataset.todoId) === Number(rowId)) || null;
}

function getColumnOption(index) {
    const options = Array.isArray(W.opt?.columns) ? W.opt.columns : [];
    return {
        addbutton: false,
        isdone: false,
        useconfetti: false,
        hidecolumn: false,
        ...(options[index] || {})
    };
}

function getColumnOptionByStatus(status) {
    const statuses = W.valuesList?.columns || [];
    const index = statuses.indexOf(status);
    return index >= 0 ? getColumnOption(index) : null;
}

function getColumnStorageKey(status) {
    return `column-todo-${valeurTexte(status)}`;
}

function obtenirIdsResponsables(todo) {
    const directIds = normaliserIdsRefList(todo?.RESPONSABLE_id);
    if (directIds.length > 0) {
        return directIds;
    }

    const labels = obtenirLibellesResponsables(todo);
    const available = [...RESPONSABLES];
    return labels.flatMap((label) => {
        const index = available.findIndex((person) => person.label === label);
        if (index < 0) {
            return [];
        }
        const [person] = available.splice(index, 1);
        return [person.id];
    });
}

function obtenirLibellesResponsables(todo) {
    const labels = normaliserListeTexte(todo?.RESPONSABLE).filter((value) => value !== '#KeyError');
    if (labels.length > 0) {
        return labels;
    }

    return normaliserIdsRefList(todo?.RESPONSABLE_id)
        .map((id) => RESPONSABLES_BY_ID.get(id)?.label)
        .filter(Boolean);
}

function normaliserIdsRefList(value) {
    return normaliserIdsListe(value);
}

function normaliserIdsListe(value) {
    let values = normaliserTableau(value);
    if (values[0] === 'L') {
        values = values.slice(1);
    }

    return [...new Set(values
        .flatMap((item) => Array.isArray(item) ? item : [item])
        .map(Number)
        .filter((id) => Number.isInteger(id) && id > 0))];
}

function normaliserListeTexte(value) {
    let values = normaliserTableau(value);
    if (values[0] === 'L') {
        values = values.slice(1);
    }

    return [...new Set(values
        .flatMap((item) => Array.isArray(item) ? item : [item])
        .map(valeurTexte)
        .map((item) => item.trim())
        .filter(Boolean))];
}

function normaliserTableau(value) {
    if (value === null || value === undefined || value === '') {
        return [];
    }
    return Array.isArray(value) ? value : [value];
}

function valeurTexte(value) {
    if (value === null || value === undefined) {
        return '';
    }
    return String(value);
}

function construireInfoCreation(todo) {
    const hasCreationDate = Boolean(W.map?.CREE_LE && todo.CREE_LE);
    const hasCreator = Boolean(W.map?.CREE_PAR && todo.CREE_PAR);
    if (!hasCreationDate && !hasCreator) {
        return '';
    }

    const parts = [echapperHtml(T('Created'))];
    if (hasCreationDate) parts.push(echapperHtml(T('on %on', {on: formatDate(todo.CREE_LE)})));
    if (hasCreator) parts.push(echapperHtml(T('by %by', {by: valeurTexte(todo.CREE_PAR)})));
    return parts.join(' ');
}

function afficherStatutSection(prefix, rowId, state, message) {
    const status = document.getElementById(`${prefix}-status-${Number(rowId)}`);
    if (!status) {
        return;
    }
    status.className = `section-status${state ? ` ${state}` : ''}`;
    status.textContent = message;
}

function formatDate(dateValue) {
    if (!dateValue) return '';
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime()) || date >= DEADLINE_PRIORITE) return '';
    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleDateString(W.cultureFull, {month: 'short'});
    return `${day} ${month} ${date.getFullYear()}`;
}

function formatDateTime(dateValue) {
    if (!dateValue) return '';
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleString(W.cultureFull, {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function formatDateForInput(dateValue) {
    if (!dateValue) return '';
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime()) || date >= DEADLINE_PRIORITE) return '';
    return date.toISOString().split('T')[0];
}

function serialiserDate(value) {
    if (!value) return '';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? valeurTexte(value) : date.toISOString();
}

function toTimestamp(value) {
    if (!value) return null;
    const timestamp = new Date(value).getTime();
    return Number.isNaN(timestamp) ? null : timestamp;
}

function toSortableTimestamp(value, fallback) {
    return toTimestamp(value) ?? fallback;
}

function formatTailleFichier(bytes) {
    const value = Number(bytes) || 0;
    if (value <= 0) return '';
    const units = ['o', 'Ko', 'Mo', 'Go'];
    const index = Math.min(Math.floor(Math.log(value) / Math.log(1024)), units.length - 1);
    return `${(value / (1024 ** index)).toFixed(index === 0 ? 0 : 1)} ${units[index]}`;
}

function extensionDepuisNom(fileName) {
    const match = valeurTexte(fileName).match(/(\.[^.]+)$/);
    return match ? match[1] : '';
}

function genererIdentifiant() {
    if (globalThis.crypto?.randomUUID) {
        return crypto.randomUUID();
    }
    return `comment-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function echapperHtml(value) {
    return valeurTexte(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function echapperAttribut(value) {
    return echapperHtml(value).replace(/`/g, '&#096;');
}

function echapperJs(value) {
    return valeurTexte(value)
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'")
        .replace(/\r/g, '\\r')
        .replace(/\n/g, '\\n');
}

function encoderAttribut(value) {
    return encodeURIComponent(valeurTexte(value)).replace(/'/g, '%27');
}

function triggerConfetti() {
    if (typeof confetti !== 'function') return;

    const duration = 2000;
    const animationEnd = Date.now() + duration;
    const defaults = {startVelocity: 30, spread: 360, ticks: 60, zIndex: 1500};
    const randomInRange = (min, max) => Math.random() * (max - min) + min;

    const interval = window.setInterval(() => {
        const timeLeft = animationEnd - Date.now();
        if (timeLeft <= 0) {
            window.clearInterval(interval);
            return;
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({...defaults, particleCount, origin: {x: randomInRange(0.1, 0.3), y: Math.random() - 0.2}});
        confetti({...defaults, particleCount, origin: {x: randomInRange(0.7, 0.9), y: Math.random() - 0.2}});
    }, 250);
}

// ========== EXPORTS POUR LES ATTRIBUTS HTML ==========

window.toggleColonne = toggleColonne;
window.togglePopupTodo = togglePopupTodo;
window.fermerPopup = fermerPopup;
window.mettreAJourChamp = mettreAJourChamp;
window.creerNouvelleTache = creerNouvelleTache;
window.supprimerTodo = supprimerTodo;
window.mettreAJourChampResponsables = mettreAJourChampResponsables;
window.filtrerOptionsMultiples = filtrerOptionsMultiples;
window.viderResponsables = viderResponsables;
window.mettreAJourEtiquettes = mettreAJourEtiquettes;
window.viderEtiquettes = viderEtiquettes;
window.ajouterPiecesJointes = ajouterPiecesJointes;
window.retirerPieceJointe = retirerPieceJointe;
window.ouvrirPieceJointe = ouvrirPieceJointe;
window.fermerLecteurPieceJointe = fermerLecteurPieceJointe;
window.memoriserAuteurCommentaire = memoriserAuteurCommentaire;
window.ajouterCommentaire = ajouterCommentaire;
window.supprimerCommentaire = supprimerCommentaire;
window.ajusterTextarea = ajusterTextarea;
