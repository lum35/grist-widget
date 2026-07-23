// ========== KANBAN2 — VERSION REFAITE ==========
// Compatible avec WidgetSDK 1.2.0.62 et les colonnes Grist RefList

let W;
let T;

const DEADLINE_PRIORITE = new Date('3000-01-01');
const BACKCOLOR = '#DCDCDC';
const TEXTCOLOR = '#000000';

let RECS = [];
let TAGSLIST = [];
let RESPONSABLES = [];
let RESPONSABLES_BY_ID = new Map();
let RESPONSABLES_LOADED_FOR = null;
const RESPONSABLE_SAVE_QUEUES = new Map();

// ========== INITIALISATION ==========

window.addEventListener('load', async () => {
    W = new WidgetSDK();
    T = await W.loadTranslations(['widget.js']);

    const lookupDetails = `If empty, the widget uses the column properties (choices or references) to build the list. Otherwise, provide either:\n• A list separated by ";"\n• A table or column reference starting with "$" ($TableID or $TableID.ColumnID)`;

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
                'types',
                '',
                'Type',
                'List of task types available.',
                'Cards options',
                {description: lookupDetails, columnId: 'TYPE', type: 'lookup'}
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
            {name: 'STATUT', title: 'Status', description: 'Defines the Kanban column', type: 'Choice', strictType: true},
            {name: 'DESCRIPTION', title: 'Task', description: 'Task name', type: 'Any'},
            {name: 'DESCRIPTION_DISPLAY', title: 'Task Display', description: 'Displayed card content, for example an HTML formula column', type: 'Any', optional: true},
            {name: 'DEADLINE', title: 'Deadline', description: 'Can also be used as priority', type: 'Date', optional: true},
            {name: 'REFERENCE_PROJET', title: 'Reference', description: 'Reference associated with the task', type: 'Any', optional: true},
            {name: 'TYPE', title: 'Type', description: 'Type associated with the task', type: 'Any', optional: true},
            {name: 'RESPONSABLE', title: 'Responsables', description: 'Personnes responsables de la tâche', type: 'RefList', strictType: true, optional: true},
            {name: 'CREE_PAR', title: 'Created by', type: 'Any', optional: true},
            {name: 'CREE_LE', title: 'Creation date', type: 'DateTime', optional: true},
            {name: 'DERNIERE_MISE_A_JOUR', title: 'Last update date', description: 'Updated after any change', type: 'DateTime', optional: true},
            {name: 'NOTES', title: 'Notes', description: 'Additional notes', type: 'Any', optional: true},
            {name: 'COULEUR', title: 'Card color', description: 'Choice or HTML color value', type: 'Choice,Text', optional: true},
            {name: 'TAGS', title: 'Tags', description: 'Additional fields to display', type: 'Any', optional: true, allowMultiple: true}
        ]
    });

    // mapRef:true fournit deux valeurs :
    // - RESPONSABLE : libellés visibles
    // - RESPONSABLE_id : identifiants des lignes référencées
    W.onRecords(afficherKanban, {
        expandRefs: false,
        keepEncoded: false,
        mapRef: true
    });

    W.isLoaded().then(async () => {
        W.initDone = true;
    });

    grist.on('message', async (event) => {
        if (event.mappingsChange) {
            await mappingChanged();
        }
    });
});

// ========== CHARGEMENT DES DONNÉES DE RÉFÉRENCE ==========

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
            .map((rowId, index) => {
                const id = Number(rowId);
                const rawLabel = labels[index];
                const label = rawLabel === null || rawLabel === undefined
                    ? ''
                    : String(rawLabel).trim();

                return {id, label};
            })
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

async function updateTagsList() {
    await W.isMapped();
    TAGSLIST = [];

    const mappedTags = normaliserTableau(W.map?.TAGS);
    if (mappedTags.length === 0) {
        return;
    }

    TAGSLIST = await Promise.all(
        mappedTags.map(async (columnId) => {
            try {
                const meta = await W.meta.getColMeta(columnId);
                return await meta?.getChoices() ?? [];
            } catch (error) {
                console.warn(`Impossible de charger les choix de ${columnId}`, error);
                return [];
            }
        })
    );
}

// ========== RENDU DU KANBAN ==========

async function afficherKanban(records) {
    RECS = Array.isArray(records) ? records : [];

    await Promise.all([
        chargerResponsables(),
        updateTagsList()
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
        const status = String(todo.STATUT ?? '');
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
    await chargerResponsables(true);
    await updateTagsList();
    await afficherKanban(RECS);
}

function creerColonneKanban(status, index) {
    const option = getColumnOption(index);
    if (option.hidecolumn) {
        return null;
    }

    const statusText = String(status);
    const column = document.createElement('section');
    column.className = `colonne-kanban${(!option.addbutton && !W.opt.compact) ? ' colonne-nobouton' : ''}`;
    column.id = statusText;

    const storageKey = getColumnStorageKey(statusText);
    if (localStorage.getItem(storageKey) === 'true') {
        column.classList.add('collapsed');
    }

    const background = W.col.STATUT.getColor(statusText) ?? BACKCOLOR;
    const color = W.col.STATUT.getTextColor(statusText) ?? TEXTCOLOR;
    const escapedStatus = echapperHtml(statusText);
    const encodedStatus = encoderAttribut(statusText);

    column.innerHTML = `
        <div class="entete-colonne" style="background-color:${background};color:${color}">
            <div class="titre-statut">${escapedStatus} <span class="compteur-colonne">(0)</span></div>
            <div class="actions-colonne">
                ${(option.addbutton && !W.opt.readonly)
                    ? `<button type="button" class="bouton-ajouter-entete ${W.opt.compact ? 'compact' : ''}" onclick="creerNouvelleTache(decodeURIComponent('${encodedStatus}'))" aria-label="${echapperHtml(T('Add a new task'))}">+</button>`
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

    const type = valeurTexte(todo.TYPE);
    const projectRef = valeurTexte(todo.REFERENCE_PROJET);
    const deadline = todo.DEADLINE ? formatDate(todo.DEADLINE) : '';
    const responsables = obtenirLibellesResponsables(todo);
    const tags = normaliserTableau(todo.TAGS)
        .flatMap((value) => normaliserTableau(value))
        .map(valeurTexte)
        .filter(Boolean);

    const description = todo.DESCRIPTION_DISPLAY
        ? String(todo.DESCRIPTION_DISPLAY)
        : echapperHtml(valeurTexte(todo.DESCRIPTION) || T('No description'));

    const responsablesHtml = responsables
        .map((responsable) => `<span class="responsable-badge">${echapperHtml(responsable)}</span>`)
        .join('');

    const tagsHtml = tags
        .map((tag) => `<span class="more-tag">${echapperHtml(tag)}</span>`)
        .join('');

    const columnOption = getColumnOptionByStatus(todo.STATUT);
    const deadlineTimestamp = toTimestamp(todo.DEADLINE);
    const isLate = deadlineTimestamp !== null && deadlineTimestamp < Date.now() && deadlineTimestamp < DEADLINE_PRIORITE.getTime();

    card.innerHTML = `
        ${projectRef ? `<div class="projet-ref truncate">#${echapperHtml(projectRef)}</div>` : ''}
        ${type
            ? `<div class="type-tag truncate">${echapperHtml(type)}</div>`
            : (projectRef ? '<div class="card-spacer">&nbsp;</div>' : '')}
        ${tagsHtml ? `<div class="tags-list">${tagsHtml}</div>` : ''}
        <div class="description">${description}</div>
        ${deadline
            ? `<div class="deadline${isLate ? ' late' : ''} truncate">📅 ${echapperHtml(deadline)}</div>`
            : (responsables.length ? '<div class="card-spacer">&nbsp;</div>' : '')}
        ${responsables.length ? `<div class="responsables-list">${responsablesHtml}</div>` : ''}
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

function appliquerCouleurCarte(card, rawColor) {
    if (!rawColor || !W.map?.COULEUR || !W.col?.COULEUR) {
        return;
    }

    let color = '';
    if (W.col.COULEUR.type === 'Choice') {
        color = W.col.COULEUR.getColor(rawColor) || '';
    } else {
        const candidate = String(rawColor).trim();
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
                delta = toSortableTimestamp(b.dataset.lastUpdate, 0) - toSortableTimestamp(a.dataset.lastUpdate, 0);
            } else {
                delta = toSortableTimestamp(a.dataset.deadline, Number.MAX_SAFE_INTEGER)
                    - toSortableTimestamp(b.dataset.deadline, Number.MAX_SAFE_INTEGER);
            }
        }

        if (delta !== 0) {
            return delta;
        }

        return (Number(a.dataset.todoId) || 0) - (Number(b.dataset.todoId) || 0);
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

// ========== FORMULAIRE LATÉRAL ==========

function togglePopupTodo(todo) {
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

    const topFields = [];

    if (W.map?.DEADLINE) {
        topFields.push(`
            <div class="field">
                <label class="field-label">${echapperHtml(W.map.DEADLINE)}</label>
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
        topFields.push(insererChamp(
            todo.id,
            todo.REFERENCE_PROJET,
            W.valuesList.ref,
            W.map.REFERENCE_PROJET,
            'REFERENCE_PROJET',
            W.col.REFERENCE_PROJET.getIsFormula()
        ));
    }

    if (W.map?.TYPE) {
        topFields.push(insererChamp(
            todo.id,
            todo.TYPE,
            W.valuesList.types,
            W.map.TYPE,
            'TYPE',
            W.col.TYPE.getIsFormula()
        ));
    }

    if (W.map?.RESPONSABLE) {
        topFields.push(insererChampMultiple(
            todo.id,
            obtenirIdsResponsables(todo),
            W.map.RESPONSABLE,
            W.col.RESPONSABLE.getIsFormula()
        ));
    }

    const mappedTags = normaliserTableau(W.map?.TAGS);
    const tagMetas = normaliserTableau(W.col?.TAGS);
    const todoTags = normaliserTableau(todo.TAGS);
    mappedTags.forEach((mappedTag, index) => {
        topFields.push(insererChamp(
            todo.id,
            todoTags[index],
            TAGSLIST[index],
            mappedTag,
            mappedTag,
            tagMetas[index]?.getIsFormula?.() ?? false
        ));
    });

    if (W.map?.COULEUR) {
        topFields.push(insererChamp(
            todo.id,
            todo.COULEUR,
            W.valuesList.cardcolor,
            W.map.COULEUR,
            'COULEUR',
            W.col.COULEUR.getIsFormula()
        ));
    }

    const rowsHtml = [];
    for (let index = 0; index < topFields.length; index += 2) {
        rowsHtml.push(`<div class="field-row">${topFields[index]}${topFields[index + 1] || ''}</div>`);
    }

    const descriptionValue = echapperHtml(valeurTexte(todo.DESCRIPTION));
    const notesValue = echapperHtml(valeurTexte(todo.NOTES));

    let form = rowsHtml.join('');
    form += `
        <div class="field">
            <label class="field-label">${echapperHtml(W.map.DESCRIPTION)}</label>
            <textarea
                class="field-textarea auto-expand"
                onchange="mettreAJourChamp(${Number(todo.id)}, 'DESCRIPTION', this.value, event)"
                oninput="ajusterTextarea(this)"
            >${descriptionValue}</textarea>
        </div>
    `;

    if (W.map?.NOTES) {
        form += `
            <div class="field">
                <label class="field-label">${echapperHtml(W.map.NOTES)}</label>
                <textarea
                    class="field-textarea auto-expand"
                    onchange="mettreAJourChamp(${Number(todo.id)}, 'NOTES', this.value, event)"
                    oninput="ajusterTextarea(this)"
                    ${W.col.NOTES.getIsFormula() ? 'disabled' : ''}
                >${notesValue}</textarea>
            </div>
        `;
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
}

function insererChamp(id, value, list, title, column, disabled) {
    const currentValue = valeurTexte(value);
    const choices = [...new Set(normaliserTableau(list).map(valeurTexte).filter(Boolean))];
    const label = echapperHtml(title);

    if (choices.length > 0 && choices.length < 20) {
        const options = choices.map((choice) => `
            <option value="${echapperAttribut(choice)}" ${choice === currentValue ? 'selected' : ''}>
                ${echapperHtml(choice)}
            </option>
        `).join('');

        return `
            <div class="field">
                <label class="field-label">${label}</label>
                <select
                    class="field-select"
                    onchange="mettreAJourChamp(${Number(id)}, '${echapperJs(column)}', this.value, event)"
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
                    onchange="mettreAJourChamp(${Number(id)}, '${echapperJs(column)}', this.value, event)"
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
                onchange="mettreAJourChamp(${Number(id)}, '${echapperJs(column)}', this.value, event)"
                ${disabled ? 'disabled' : ''}
            >
        </div>
    `;
}

function insererChampMultiple(id, selectedIds, title, disabled) {
    const selection = new Set(normaliserIdsRefList(selectedIds));
    const options = RESPONSABLES.map((person) => `
        <label class="multi-option" data-search="${echapperAttribut(person.label.toLocaleLowerCase(W.cultureFull))}">
            <input
                type="checkbox"
                value="${person.id}"
                data-label="${echapperAttribut(person.label)}"
                ${selection.has(person.id) ? 'checked' : ''}
                onchange="mettreAJourChampMultiple(${Number(id)}, this.closest('.multi-dropdown'), event)"
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
            <details class="multi-dropdown" data-row-id="${Number(id)}">
                <summary>${echapperHtml(resumeResponsables(selectedLabels))}</summary>
                <div class="multi-dropdown-menu">
                    <div class="multi-toolbar">
                        <input
                            type="search"
                            class="multi-search"
                            placeholder="Rechercher…"
                            oninput="filtrerResponsables(this)"
                            onclick="event.stopPropagation()"
                            ${disabled ? 'disabled' : ''}
                        >
                        <button
                            type="button"
                            class="multi-clear"
                            onclick="viderResponsables(this, event)"
                            ${disabled ? 'disabled' : ''}
                        >Effacer</button>
                    </div>
                    <div class="multi-options">
                        ${options || '<div class="multi-empty">Aucun membre disponible</div>'}
                    </div>
                    <div class="multi-status" aria-live="polite"></div>
                </div>
            </details>
        </div>
    `;
}

function resumeResponsables(labels) {
    const values = normaliserTableau(labels).filter(Boolean);
    if (values.length === 0) {
        return 'Choisir…';
    }
    if (values.length === 1) {
        return values[0];
    }
    return `${values.length} responsables`;
}

function filtrerResponsables(input) {
    const dropdown = input.closest('.multi-dropdown');
    if (!dropdown) {
        return;
    }

    const query = input.value.trim().toLocaleLowerCase(W.cultureFull);
    dropdown.querySelectorAll('.multi-option').forEach((option) => {
        option.hidden = query !== '' && !String(option.dataset.search || '').includes(query);
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

    mettreAJourChampMultiple(Number(dropdown.dataset.rowId || 0), dropdown, event);
}

async function mettreAJourChampMultiple(rowId, dropdown, event) {
    event?.stopPropagation();

    const resolvedRowId = Number(rowId || dropdown?.dataset?.rowId || dropdown?.closest('[data-row-id]')?.dataset?.rowId);
    if (!Number.isInteger(resolvedRowId) || resolvedRowId <= 0 || !dropdown) {
        console.error('Identifiant de ligne invalide pour les responsables.', {rowId, resolvedRowId});
        return;
    }

    const ids = Array.from(dropdown.querySelectorAll('input[type="checkbox"]:checked'))
        .map((input) => Number(input.value))
        .filter((id) => Number.isInteger(id) && id > 0 && RESPONSABLES_BY_ID.has(id));

    const labels = ids.map((id) => RESPONSABLES_BY_ID.get(id).label);
    mettreAJourResumeResponsables(dropdown, labels);
    setResponsableStatus(dropdown, 'saving', 'Enregistrement…');

    const previous = RESPONSABLE_SAVE_QUEUES.get(resolvedRowId) || Promise.resolve();
    const next = previous
        .catch(() => undefined)
        .then(() => enregistrerResponsablesDansGrist(resolvedRowId, ids))
        .then(() => {
            mettreAJourResponsablesLocaux(resolvedRowId, ids);
            setResponsableStatus(dropdown, 'saved', 'Enregistré');
            window.setTimeout(() => setResponsableStatus(dropdown, '', ''), 1200);
        })
        .catch((error) => {
            setResponsableStatus(dropdown, 'error', 'Échec de l’enregistrement');
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

    // Dans l’API des widgets Grist, une RefList au format normal est un tableau de rowId.
    const table = grist.getTable();
    await table.update({
        id: Number(rowId),
        fields: {
            [actualColumnId]: [...ids]
        }
    });

    if (W.map?.DERNIERE_MISE_A_JOUR && !W.col.DERNIERE_MISE_A_JOUR.getIsFormula()) {
        try {
            await W.updateRecords(
                W.formatRecord(rowId, {DERNIERE_MISE_A_JOUR: new Date().toISOString()})
            );
        } catch (error) {
            console.warn('Responsables enregistrés, mais date de mise à jour non modifiée :', error);
        }
    }
}

function mettreAJourResponsablesLocaux(rowId, ids) {
    const record = RECS.find((item) => Number(item.id) === Number(rowId));
    if (!record) {
        return;
    }

    record.RESPONSABLE_id = [...ids];
    record.RESPONSABLE = ids
        .map((id) => RESPONSABLES_BY_ID.get(id)?.label)
        .filter(Boolean);
}

function mettreAJourResumeResponsables(dropdown, labels) {
    const summary = dropdown.querySelector('summary');
    if (summary) {
        summary.textContent = resumeResponsables(labels);
    }
}

function setResponsableStatus(dropdown, state, message) {
    const status = dropdown.querySelector('.multi-status');
    if (!status) {
        return;
    }

    status.className = `multi-status${state ? ` ${state}` : ''}`;
    status.textContent = message;
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
    } catch (error) {
        console.error(T('Error during update:'), error);
        throw error;
    }
}

async function creerNouvelleTache(status) {
    try {
        const data = {
            DESCRIPTION: '',
            STATUT: status
        };

        if (W.map?.TYPE && !W.col.TYPE.getIsFormula()) {
            data.TYPE = '';
        }
        if (W.map?.REFERENCE_PROJET && !W.col.REFERENCE_PROJET.getIsFormula()) {
            data.REFERENCE_PROJET = null;
        }
        if (W.map?.DERNIERE_MISE_A_JOUR && !W.col.DERNIERE_MISE_A_JOUR.getIsFormula()) {
            data.DERNIERE_MISE_A_JOUR = new Date().toISOString();
        }
        if (W.map?.CREE_LE && !W.col.CREE_LE.getIsFormula()) {
            data.CREE_LE = new Date().toISOString();
        }

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

    const todoId = popup.dataset.currentTodo;
    trouverCarteParId(todoId)?.classList.remove('active');
    popup.classList.remove('visible');
    fermerTousLesMenusResponsables();
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
    textarea.style.height = `${textarea.scrollHeight}px`;
}

function fermerTousLesMenusResponsables(except = null) {
    document.querySelectorAll('.multi-dropdown[open]').forEach((details) => {
        if (details !== except) {
            details.removeAttribute('open');
        }
    });
}

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        const openedDropdown = document.querySelector('.multi-dropdown[open]');
        if (openedDropdown) {
            openedDropdown.removeAttribute('open');
        } else {
            fermerPopup();
        }
    }
});

document.addEventListener('click', (event) => {
    const openedDropdown = event.target.closest('.multi-dropdown');
    fermerTousLesMenusResponsables(openedDropdown);

    const popup = document.getElementById('popup-todo');
    if (!popup?.classList.contains('visible')) {
        return;
    }

    const isInsidePopup = popup.contains(event.target);
    const isCard = Boolean(event.target.closest('.carte'));
    if (!isInsidePopup && !isCard) {
        fermerPopup();
    }
});

// ========== HELPERS ==========

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
    return `column-todo-${String(status)}`;
}

function obtenirIdsResponsables(todo) {
    const directIds = normaliserIdsRefList(todo?.RESPONSABLE_id);
    if (directIds.length > 0) {
        return directIds;
    }

    const labels = obtenirLibellesResponsables(todo);
    if (labels.length === 0) {
        return [];
    }

    const unused = [...RESPONSABLES];
    return labels.flatMap((label) => {
        const index = unused.findIndex((person) => person.label === label);
        if (index < 0) {
            return [];
        }
        const [person] = unused.splice(index, 1);
        return [person.id];
    });
}

function obtenirLibellesResponsables(todo) {
    const labels = normaliserTableau(todo?.RESPONSABLE)
        .map(valeurTexte)
        .filter((value) => value && value !== '#KeyError');

    if (labels.length > 0) {
        return labels;
    }

    return normaliserIdsRefList(todo?.RESPONSABLE_id)
        .map((id) => RESPONSABLES_BY_ID.get(id)?.label)
        .filter(Boolean);
}

function normaliserIdsRefList(value) {
    let values = normaliserTableau(value);

    // Tolérance pour d’anciennes valeurs encodées comme ["L", ...ids].
    if (values[0] === 'L') {
        values = values.slice(1);
    }

    return [...new Set(
        values
            .map(Number)
            .filter((id) => Number.isInteger(id) && id > 0)
    )];
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
    const hasUpdateDate = Boolean(W.map?.DERNIERE_MISE_A_JOUR && todo.DERNIERE_MISE_A_JOUR);

    if (!hasCreationDate && !hasCreator && !hasUpdateDate) {
        return '';
    }

    const parts = [echapperHtml(T('Created'))];

    if (hasCreationDate) {
        parts.push(echapperHtml(T('on %on', {on: formatDate(todo.CREE_LE)})));
    }

    if (hasCreator) {
        parts.push(echapperHtml(T('by %by', {by: valeurTexte(todo.CREE_PAR)})));
    }

    let html = parts.join(' ');
    if (hasUpdateDate) {
        html += `<br>${echapperHtml(T('Last update on %on', {on: formatDate(todo.DERNIERE_MISE_A_JOUR)}))}`;
    }

    return html;
}

function formatDate(dateValue) {
    if (!dateValue) {
        return '';
    }

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime()) || date >= DEADLINE_PRIORITE) {
        return '';
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = date.toLocaleDateString(W.cultureFull, {month: 'short'});
    return `${day} ${month} ${date.getFullYear()}`;
}

function formatDateForInput(dateValue) {
    if (!dateValue) {
        return '';
    }

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime()) || date >= DEADLINE_PRIORITE) {
        return '';
    }

    return date.toISOString().split('T')[0];
}

function serialiserDate(value) {
    if (!value) {
        return '';
    }
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? String(value) : date.toISOString();
}

function toTimestamp(value) {
    if (!value) {
        return null;
    }
    const timestamp = new Date(value).getTime();
    return Number.isNaN(timestamp) ? null : timestamp;
}

function toSortableTimestamp(value, fallback) {
    return toTimestamp(value) ?? fallback;
}

function echapperHtml(value) {
    return String(value ?? '')
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
    return String(value ?? '')
        .replace(/\\/g, '\\\\')
        .replace(/'/g, "\\'");
}

function encoderAttribut(value) {
    return encodeURIComponent(String(value ?? '')).replace(/'/g, '%27');
}

function triggerConfetti() {
    if (typeof confetti !== 'function') {
        return;
    }

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
window.mettreAJourChampMultiple = mettreAJourChampMultiple;
window.filtrerResponsables = filtrerResponsables;
window.viderResponsables = viderResponsables;
window.ajusterTextarea = ajusterTextarea;
