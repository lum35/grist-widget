// ========== KANBAN2 — VERSION 5.2 ==========
// Notes enrichies, responsables et étiquettes en RefList, avatars compacts, pièces jointes et commentaires Grist.
// Compatible avec WidgetSDK 1.2.0.62.

let W;
let T;

const DEADLINE_PRIORITE = new Date('3000-01-01');
const BACKCOLOR = '#DCDCDC';
const TEXTCOLOR = '#000000';
const ATTACHMENT_TOKEN_MAX_AGE = 2 * 60 * 1000;
const MAX_ATTACHMENT_SIZE = 50 * 1024 * 1024;
const COMMENT_AUTHOR_PLACEHOLDER = '__GRIST_USER_NAME__';

let RECS = [];
let RESPONSABLES = [];
let RESPONSABLES_BY_ID = new Map();
let RESPONSABLES_LOADED_FOR = null;
let ETIQUETTES = [];
let ETIQUETTES_BY_ID = new Map();
let ETIQUETTES_LOADED_FOR = null;
let ATTACHMENT_META = new Map();
let ATTACHMENT_META_LOADED = false;
let ATTACHMENT_READ_TOKEN = null;
let ATTACHMENT_READ_TOKEN_AT = 0;
const RESPONSABLE_SAVE_QUEUES = new Map();
const LABEL_SAVE_QUEUES = new Map();
const COMMENT_SAVE_QUEUES = new Map();
const NOTES_SAVE_QUEUES = new Map();
const NOTES_SAVE_TIMERS = new Map();

let CONFIG_SAVE_TIMER = null;
let CONFIG_SAVE_IN_PROGRESS = false;

// ========== INITIALISATION ==========

window.addEventListener('load', async () => {
    W = new WidgetSDK();
    T = await W.loadTranslations(['widget.js']);

    W.configureOptions(
        [
            WidgetSDK.newItem(
                'columns',
                null,
                'Colonnes du Kanban',
                'Réglez le comportement de chaque statut.',
                '1 — Colonnes',
                {
                    columnId: 'STATUT',
                    template: [
                        WidgetSDK.newItem('addbutton', true, 'Autoriser l’ajout', 'Afficher un bouton pour créer une carte dans cette colonne.'),
                        WidgetSDK.newItem('isdone', false, 'Colonne terminée', 'Considérer les cartes de cette colonne comme terminées.'),
                        WidgetSDK.newItem('useconfetti', false, 'Confettis', 'Afficher des confettis lorsqu’une carte arrive dans cette colonne.'),
                        WidgetSDK.newItem('hidecolumn', false, 'Masquer la colonne', 'Ne pas afficher cette colonne dans le Kanban.')
                    ]
                }
            ),

            WidgetSDK.newItem('rotation', true, 'Inclinaison des cartes', 'Donner un léger effet post-it aux cartes.', '2 — Affichage des cartes'),
            WidgetSDK.newItem('compact', false, 'Mode compact', 'Réduire les espacements et la hauteur des cartes.', '2 — Affichage des cartes'),
            WidgetSDK.newItem('showlabels', true, 'Afficher les étiquettes', 'Afficher les étiquettes colorées sur les cartes.', '2 — Affichage des cartes'),
            WidgetSDK.newItem('showmembers', true, 'Afficher les responsables', 'Afficher les bulles d’initiales sur les cartes.', '2 — Affichage des cartes'),
            WidgetSDK.newItem('showdeadline', true, 'Afficher l’échéance', 'Afficher la date limite sur les cartes.', '2 — Affichage des cartes'),
            WidgetSDK.newItem('showindicators', true, 'Afficher les indicateurs', 'Afficher le nombre de pièces jointes et de commentaires.', '2 — Affichage des cartes'),
            WidgetSDK.newItem('defaultcardcolor', '#FFFFD1', 'Couleur par défaut', 'Couleur utilisée lorsqu’aucune couleur personnalisée n’est enregistrée.', '2 — Affichage des cartes'),

            WidgetSDK.newItem('showattachments', true, 'Pièces jointes', 'Afficher la section des pièces jointes dans la fiche.', '3 — Fiche descriptive'),
            WidgetSDK.newItem('showcomments', true, 'Commentaires', 'Afficher la section des commentaires dans la fiche.', '3 — Fiche descriptive'),
            WidgetSDK.newItem('enablementions', true, 'Mentions @', 'Permettre de mentionner les membres dans les commentaires.', '3 — Fiche descriptive'),
            WidgetSDK.newItem(
                'mentionnotificationtable',
                'Notifications_Kanban',
                'Table des notifications',
                'Table utilisée pour préparer un e-mail par personne mentionnée. L’envoi réel est réalisé par une Automatisation Grist.',
                '3 — Fiche descriptive'
            ),
            WidgetSDK.newItem('showmetadata', true, 'Informations de suivi', 'Afficher les lignes « Créé le » et « Modifié le » en bas de la fiche.', '3 — Fiche descriptive'),
            WidgetSDK.newItem('autoclosemenus', true, 'Fermer les menus automatiquement', 'Fermer les sélecteurs multiples lorsqu’on clique ailleurs.', '3 — Fiche descriptive'),

            WidgetSDK.newItem('readonly', false, 'Lecture seule', 'Désactiver toutes les modifications depuis le widget.', '4 — Comportement'),
            WidgetSDK.newItem('hideedit', false, 'Masquer la fiche', 'Ne pas ouvrir la fiche descriptive lors d’un clic sur une carte.', '4 — Comportement'),
            WidgetSDK.newItem('gristeditcard', false, 'Double-clic vers la fiche Grist', 'Ouvrir la fiche native de Grist lors d’un double-clic.', '4 — Comportement'),
            WidgetSDK.newItem('confirmdelete', true, 'Confirmer les suppressions', 'Demander une confirmation avant de supprimer une tâche.', '4 — Comportement')
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
            {name: 'NOTES', title: 'Notes', description: 'Notes enrichies enregistrées en HTML sécurisé', type: 'Text', strictType: true, optional: true},
            {name: 'DEADLINE', title: 'Échéance', description: 'Date limite ou ordre de priorité', type: 'Date', optional: true},
            {name: 'RESPONSABLE', title: 'Responsables', description: 'Personnes responsables de la tâche', type: 'RefList', strictType: true, optional: true},
            {name: 'ETIQUETTES', title: 'Étiquettes', description: 'Étiquettes multiples référencées depuis une table dédiée', type: 'RefList', strictType: true, optional: true},
            {name: 'PIECES_JOINTES', title: 'Pièces jointes', description: 'Fichiers et images associés à la tâche', type: 'Attachments', strictType: true, optional: true},
            {name: 'COMMENTAIRES', title: 'Commentaires', description: 'Commentaires du widget stockés en JSON', type: 'Text', strictType: true, optional: true},
            {name: 'COULEUR', title: 'Couleur de carte', description: 'Code hexadécimal choisi depuis le widget', type: 'Text', strictType: true, optional: true},
            {name: 'CREE_PAR', title: 'Créé par', type: 'Any', optional: true},
            {name: 'CREE_LE', title: 'Date de création', type: 'DateTime', optional: true},
            {name: 'DERNIERE_MISE_A_JOUR', title: 'Dernière mise à jour', description: 'Date technique affichée dans le suivi', type: 'DateTime', optional: true},
            {name: 'MODIFIE_PAR', title: 'Modifié par', description: 'Nom de la dernière personne ayant modifié la tâche', type: 'Text', strictType: true, optional: true}
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
    installerSauvegardeAutomatiqueConfiguration();
});

// ========== CHARGEMENT DES LISTES ==========

async function chargerResponsables(force = false) {
    if (!W?.map?.RESPONSABLE || !W?.col?.RESPONSABLE) {
        viderCacheResponsables();
        return;
    }

    const colMeta = W.col.RESPONSABLE;
    const cacheKey = `${colMeta.type}:${colMeta.visibleCol}`;

    if (!force && RESPONSABLES_LOADED_FOR === cacheKey && RESPONSABLES.length > 0) {
        return;
    }

    try {
        const reference = await chargerTableReference(colMeta);
        const dataColumns = reference.dataColumns;

        const initialsColumnId = trouverColonneParNoms(
            dataColumns,
            ['initiales', 'initiale', 'initials', 'abreviation', 'abréviation', 'sigle']
        ) || colonneSuivante(dataColumns, reference.visibleColumnId);

        const emailColumnId = trouverColonneParNoms(
            dataColumns,
            [
                'email', 'e-mail', 'mail', 'courriel',
                'adresseemail', 'adresse_email',
                'adressemail', 'adresse_mail'
            ]
        );

        const initialsValues = initialsColumnId && Array.isArray(reference.table[initialsColumnId])
            ? reference.table[initialsColumnId]
            : [];

        const emailValues = emailColumnId && Array.isArray(reference.table[emailColumnId])
            ? reference.table[emailColumnId]
            : [];

        RESPONSABLES = reference.ids
            .map((rowId, index) => {
                const label = valeurTexte(reference.labels[index]).trim();
                const initials = nettoyerInitiales(initialsValues[index]) || calculerInitiales(label);
                const email = normaliserEmail(emailValues[index]);

                return {
                    id: Number(rowId),
                    label,
                    initials,
                    email,
                    avatarColor: couleurAvatar(label || rowId)
                };
            })
            .filter((person) =>
                Number.isInteger(person.id) &&
                person.id > 0 &&
                person.label &&
                person.label !== '#KeyError'
            )
            .sort((a, b) =>
                a.label.localeCompare(b.label, W.cultureFull, {sensitivity: 'base'})
            );

        RESPONSABLES_BY_ID = new Map(
            RESPONSABLES.map((person) => [person.id, person])
        );
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

async function chargerEtiquettes(force = false) {
    if (!W?.map?.ETIQUETTES || !W?.col?.ETIQUETTES) {
        viderCacheEtiquettes();
        return;
    }

    const colMeta = W.col.ETIQUETTES;
    const cacheKey = `${colMeta.type}:${colMeta.visibleCol}`;

    if (!force && ETIQUETTES_LOADED_FOR === cacheKey && ETIQUETTES.length > 0) {
        return;
    }

    try {
        const reference = await chargerTableReference(colMeta);
        const dataColumns = reference.dataColumns;
        const colorColumnId = trouverColonneParNoms(
            dataColumns,
            ['couleur', 'color', 'hex', 'codecouleur', 'code_couleur']
        ) || colonneSuivante(dataColumns, reference.visibleColumnId);

        const colorValues = colorColumnId && Array.isArray(reference.table[colorColumnId])
            ? reference.table[colorColumnId]
            : [];

        ETIQUETTES = reference.ids
            .map((rowId, index) => {
                const label = valeurTexte(reference.labels[index]).trim();
                const explicitColor = normaliserCouleur(colorValues[index]);
                const color = explicitColor || couleurEtiquetteParDefaut(label || rowId);
                return {
                    id: Number(rowId),
                    label,
                    color,
                    textColor: couleurTexteContraste(color)
                };
            })
            .filter((item) => Number.isInteger(item.id) && item.id > 0 && item.label && item.label !== '#KeyError')
            .sort((a, b) => a.label.localeCompare(b.label, W.cultureFull, {sensitivity: 'base'}));

        ETIQUETTES_BY_ID = new Map(ETIQUETTES.map((item) => [item.id, item]));
        ETIQUETTES_LOADED_FOR = cacheKey;
    } catch (error) {
        viderCacheEtiquettes();
        console.error('Impossible de charger la table des étiquettes :', error);
    }
}

function viderCacheEtiquettes() {
    ETIQUETTES = [];
    ETIQUETTES_BY_ID = new Map();
    ETIQUETTES_LOADED_FOR = null;
}

async function chargerTableReference(colMeta) {
    const [kind, tableId] = valeurTexte(colMeta?.type).split(':');
    if (kind !== 'RefList' || !tableId || !colMeta?.visibleCol) {
        throw new Error('La colonne doit être une Liste de références avec une colonne visible configurée.');
    }

    const [table, visibleMeta] = await Promise.all([
        grist.docApi.fetchTable(tableId),
        colMeta.getMeta(colMeta.visibleCol)
    ]);

    const visibleColumnId = visibleMeta?.colId;
    if (!visibleColumnId || !Array.isArray(table?.id) || !Array.isArray(table?.[visibleColumnId])) {
        throw new Error(`La colonne visible de la table ${tableId} est introuvable.`);
    }

    const dataColumns = Object.keys(table)
        .filter((columnId) =>
            Array.isArray(table[columnId]) &&
            columnId !== 'id' &&
            columnId !== 'manualSort' &&
            !columnId.startsWith('gristHelper_')
        );

    return {
        tableId,
        table,
        ids: table.id,
        labels: table[visibleColumnId],
        visibleColumnId,
        dataColumns
    };
}

function trouverColonneParNoms(columnIds, candidateNames) {
    const wanted = new Set(candidateNames.map(normaliserIdentifiant));
    return columnIds.find((columnId) => wanted.has(normaliserIdentifiant(columnId))) || null;
}

function colonneSuivante(columnIds, currentColumnId) {
    const index = columnIds.indexOf(currentColumnId);
    return index >= 0 ? (columnIds[index + 1] || null) : null;
}

function normaliserIdentifiant(value) {
    return valeurTexte(value)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]/gi, '')
        .toLowerCase();
}

function nettoyerInitiales(value) {
    return valeurTexte(value)
        .trim()
        .replace(/\s+/g, '')
        .slice(0, 4)
        .toUpperCase();
}

function calculerInitiales(name) {
    const words = valeurTexte(name)
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (words.length === 0) return '?';
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return `${words[0][0] || ''}${words[words.length - 1][0] || ''}`.toUpperCase();
}

function couleurAvatar(seed) {
    let hash = 0;
    for (const char of valeurTexte(seed)) {
        hash = ((hash << 5) - hash) + char.charCodeAt(0);
        hash |= 0;
    }
    const hue = Math.abs(hash) % 360;
    return `hsl(${hue} 58% 42%)`;
}

function couleurEtiquetteParDefaut(seed) {
    let hash = 0;
    for (const char of valeurTexte(seed)) {
        hash = ((hash << 5) - hash) + char.charCodeAt(0);
        hash |= 0;
    }
    const hue = Math.abs(hash) % 360;
    return hslVersHex(hue, 62, 72);
}

function hslVersHex(h, s, l) {
    s /= 100;
    l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (h < 60) [r, g, b] = [c, x, 0];
    else if (h < 120) [r, g, b] = [x, c, 0];
    else if (h < 180) [r, g, b] = [0, c, x];
    else if (h < 240) [r, g, b] = [0, x, c];
    else if (h < 300) [r, g, b] = [x, 0, c];
    else [r, g, b] = [c, 0, x];

    return `#${[r, g, b].map((v) => Math.round((v + m) * 255).toString(16).padStart(2, '0')).join('')}`.toUpperCase();
}

function couleurTexteContraste(hexColor) {
    const color = normaliserCouleur(hexColor) || '#DDE3EA';
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    return luminance > 0.58 ? '#1F2937' : '#FFFFFF';
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


/**
 * Le WidgetSDK n'enregistre normalement les options qu'au clic sur « Appliquer ».
 * Cette surcouche sauvegarde aussi chaque modification sans fermer l'écran.
 */
function installerSauvegardeAutomatiqueConfiguration() {
    const configView = document.getElementById('config-view');

    if (!configView || configView.dataset.autosaveInstalled === 'true') {
        return;
    }

    configView.dataset.autosaveInstalled = 'true';

    configView.addEventListener('input', (event) => {
        if (event.target.matches('input, textarea, select')) {
            planifierSauvegardeConfiguration();
        }
    });

    configView.addEventListener('change', (event) => {
        if (event.target.matches('input, textarea, select')) {
            planifierSauvegardeConfiguration();
        }
    });

    // Les interrupteurs du WidgetSDK sont des div et non des inputs.
    configView.addEventListener('click', (event) => {
        if (event.target.closest('.config-switch')) {
            // Laisser d'abord le SDK modifier la classe switch_on.
            window.setTimeout(planifierSauvegardeConfiguration, 0);
        }
    });
}

function planifierSauvegardeConfiguration() {
    window.clearTimeout(CONFIG_SAVE_TIMER);
    afficherEtatSauvegardeConfiguration('saving', 'Sauvegarde…');

    CONFIG_SAVE_TIMER = window.setTimeout(
        sauvegarderConfigurationSansFermer,
        350
    );
}

async function sauvegarderConfigurationSansFermer() {
    if (
        CONFIG_SAVE_IN_PROGRESS ||
        !W?._parameters ||
        !W?._config ||
        W._config.style.display === 'none'
    ) {
        return;
    }

    CONFIG_SAVE_IN_PROGRESS = true;

    try {
        W.opt = await W.readOptionValues(
            W._parameters,
            W._config,
            W.opt
        );

        // Même stockage Grist que le bouton « Appliquer » du WidgetSDK.
        await grist.widgetApi.setOption(
            'options',
            JSON.parse(JSON.stringify(W.opt))
        );

        await optionsChanged();
        afficherEtatSauvegardeConfiguration('saved', 'Enregistré');

        window.setTimeout(() => {
            afficherEtatSauvegardeConfiguration('', '');
        }, 1400);
    } catch (error) {
        console.error(
            'Impossible de sauvegarder automatiquement la configuration :',
            error
        );
        afficherEtatSauvegardeConfiguration(
            'error',
            'Échec de la sauvegarde'
        );
    } finally {
        CONFIG_SAVE_IN_PROGRESS = false;
    }
}

function afficherEtatSauvegardeConfiguration(state, message) {
    const configView = document.getElementById('config-view');

    if (!configView || configView.style.display === 'none') {
        return;
    }

    let status = configView.querySelector('.config-autosave-status');

    if (!status && message) {
        status = document.createElement('div');
        status.className = 'config-autosave-status';
        status.setAttribute('aria-live', 'polite');
        configView.appendChild(status);
    }

    if (!status) {
        return;
    }

    status.className = `config-autosave-status${state ? ` ${state}` : ''}`;
    status.textContent = message;
    status.hidden = !message;
}

async function optionsChanged() {
    await W.isMapped();
    await afficherKanban(RECS);
}

async function mappingChanged() {
    viderCacheResponsables();
    viderCacheEtiquettes();
    ATTACHMENT_META_LOADED = false;
    ATTACHMENT_READ_TOKEN = null;

    await Promise.all([
        chargerResponsables(true),
        chargerEtiquettes(true)
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

    const deadline = todo.DEADLINE ? formatDate(todo.DEADLINE) : '';
    const responsables = obtenirResponsables(todo);
    const etiquettes = obtenirEtiquettes(todo);
    const attachmentCount = normaliserIdsListe(todo.PIECES_JOINTES).length;
    const commentCount = parserCommentaires(todo.COMMENTAIRES).length;

    const description = todo.DESCRIPTION_DISPLAY
        ? String(todo.DESCRIPTION_DISPLAY)
        : echapperHtml(valeurTexte(todo.DESCRIPTION) || T('No description'));

    const labelsHtml = etiquettes
        .map((item) => construireBadgeEtiquette(item))
        .join('');

    const responsablesHtml = responsables
        .map((person) => `
            <span
                class="responsable-avatar"
                style="background:${echapperAttribut(person.avatarColor)}"
                title="${echapperAttribut(person.label)}"
                aria-label="${echapperAttribut(person.label)}"
            >${echapperHtml(person.initials)}</span>
        `)
        .join('');

    const columnOption = getColumnOptionByStatus(todo.STATUT);
    const deadlineTimestamp = toTimestamp(todo.DEADLINE);
    const isLate = deadlineTimestamp !== null
        && deadlineTimestamp < Date.now()
        && deadlineTimestamp < DEADLINE_PRIORITE.getTime();

    const showLabels = W.opt.showlabels !== false;
    const showMembers = W.opt.showmembers !== false;
    const showDeadline = W.opt.showdeadline !== false;
    const showIndicators = W.opt.showindicators !== false;

    card.innerHTML = `
        ${(showLabels && labelsHtml) ? `<div class="etiquettes-list">${labelsHtml}</div>` : ''}
        <div class="description">${description}</div>
        ${(showDeadline && deadline) ? `<div class="deadline${isLate ? ' late' : ''} truncate">📅 ${echapperHtml(deadline)}</div>` : ''}
        ${(showMembers && responsables.length) ? `<div class="responsables-list" aria-label="Responsables">${responsablesHtml}</div>` : ''}
        ${(showIndicators && (attachmentCount || commentCount))
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

function construireBadgeEtiquette(item) {
    return `
        <span
            class="etiquette-badge"
            style="background:${echapperAttribut(item.color)};color:${echapperAttribut(item.textColor)}"
            title="${echapperAttribut(item.label)}"
        >${echapperHtml(item.label)}</span>
    `;
}

function appliquerCouleurCarte(card, rawColor) {
    const color = normaliserCouleur(rawColor)
        || normaliserCouleur(W.opt?.defaultcardcolor)
        || '#FFFFD1';
    card.style.backgroundColor = color;
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

    const fields = [];
    const descriptionDisabled = W.col.DESCRIPTION.getIsFormula();
    const notesDisabled = W.map?.NOTES ? W.col.NOTES.getIsFormula() : false;

    // Nom et notes restent dans la même grille que les autres champs, mais apparaissent en premier.
    fields.push(`
        <div class="field field-wide">
            <label class="field-label">Nom de la tâche</label>
            <textarea
                class="field-textarea auto-expand task-title-input"
                onchange="mettreAJourChamp(${Number(todo.id)}, 'DESCRIPTION', this.value, event)"
                oninput="ajusterTextarea(this)"
                ${descriptionDisabled ? 'disabled' : ''}
            >${echapperHtml(valeurTexte(todo.DESCRIPTION))}</textarea>
        </div>
    `);

    if (W.map?.NOTES) {
        fields.push(construireEditeurNotes(todo, notesDisabled));
    }

    if (W.map?.ETIQUETTES) {
        fields.push(construireChampEtiquettes(todo));
    }

    if (W.map?.RESPONSABLE) {
        fields.push(insererChampResponsables(
            todo.id,
            obtenirIdsResponsables(todo),
            W.map.RESPONSABLE,
            W.col.RESPONSABLE.getIsFormula()
        ));
    }

    if (W.map?.DEADLINE) {
        fields.push(`
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

    if (W.map?.COULEUR) {
        fields.push(construireChampCouleur(todo));
    }

    let form = `<div class="form-grid">${fields.join('')}</div>`;

    if (W.map?.PIECES_JOINTES && W.opt.showattachments !== false) {
        form += construireSectionPiecesJointes(todo);
    }

    if (W.map?.COMMENTAIRES && W.opt.showcomments !== false) {
        form += construireSectionCommentaires(todo);
    }

    const creationInfo = W.opt.showmetadata !== false ? construireInfoCreation(todo) : '';
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

    if (W.map?.PIECES_JOINTES && W.opt.showattachments !== false) {
        await rafraichirPiecesJointes(todo.id);
    }
}

function construireEditeurNotes(todo, disabled) {
    const rowId = Number(todo.id);
    const value = normaliserHtmlNotes(todo.NOTES);
    const hasContent = texteDepuisHtml(value).trim().length > 0;
    const disabledAttribute = disabled ? 'disabled' : '';

    const commandButtons = [
        ['bold', '<strong>B</strong>', 'Gras'],
        ['italic', '<em>I</em>', 'Italique'],
        ['underline', '<u>U</u>', 'Souligné'],
        ['strikeThrough', '<s>S</s>', 'Barré'],
        ['insertUnorderedList', '• Liste', 'Liste à puces'],
        ['insertOrderedList', '1. Liste', 'Liste numérotée'],
        ['insertHorizontalRule', '―', 'Ligne de séparation'],
        ['removeFormat', 'Tx', 'Effacer la mise en forme'],
        ['undo', '↶', 'Annuler'],
        ['redo', '↷', 'Rétablir']
    ].map(([command, label, title]) => `
        <button
            type="button"
            class="notes-tool"
            data-command="${command}"
            onmousedown="event.preventDefault()"
            onclick="appliquerCommandeNotes(this, '${command}', null, event)"
            title="${echapperAttribut(title)}"
            aria-label="${echapperAttribut(title)}"
            ${disabledAttribute}
        >${label}</button>
    `).join('');

    return `
        <div
            class="field field-wide notes-field"
            data-row-id="${rowId}"
            data-disabled="${disabled ? 'true' : 'false'}"
        >
            <div class="notes-heading">
                <label class="field-label">Notes</label>
                <button
                    type="button"
                    class="notes-edit-button"
                    onclick="activerEditionNotes(this, event)"
                    ${disabledAttribute}
                >✏️ Modifier</button>
            </div>

            <div
                class="notes-display${hasContent ? '' : ' empty'}"
                tabindex="0"
            >${hasContent ? value : 'Aucune note pour cette tâche.'}</div>

            <div class="notes-edit-panel" hidden>
                <div class="notes-toolbar" role="toolbar" aria-label="Mise en forme des notes">
                    <label class="sr-only" for="notes-format-${rowId}">Style du paragraphe</label>
                    <select
                        id="notes-format-${rowId}"
                        class="notes-format-select"
                        onchange="appliquerFormatBlocNotes(this, event)"
                        title="Style du paragraphe"
                        ${disabledAttribute}
                    >
                        <option value="p">Paragraphe</option>
                        <option value="h2">Titre</option>
                        <option value="h3">Sous-titre</option>
                        <option value="blockquote">Citation</option>
                        <option value="pre">Bloc de code</option>
                    </select>

                    <span class="notes-toolbar-separator" aria-hidden="true"></span>

                    ${commandButtons}

                    <button
                        type="button"
                        class="notes-tool"
                        onmousedown="event.preventDefault()"
                        onclick="appliquerBaliseSelectionNotes(this, 'code', event)"
                        title="Code dans la ligne"
                        aria-label="Code dans la ligne"
                        ${disabledAttribute}
                    >&lt;/&gt;</button>

                    <button
                        type="button"
                        class="notes-tool"
                        onmousedown="event.preventDefault()"
                        onclick="appliquerBaliseSelectionNotes(this, 'mark', event)"
                        title="Surligner"
                        aria-label="Surligner"
                        ${disabledAttribute}
                    >🖍</button>

                    <button
                        type="button"
                        class="notes-tool notes-tool-link"
                        onmousedown="event.preventDefault()"
                        onclick="creerLienNotes(this, event)"
                        title="Ajouter ou modifier un lien"
                        aria-label="Ajouter ou modifier un lien"
                        ${disabledAttribute}
                    >🔗 Lien</button>

                    <button
                        type="button"
                        class="notes-tool"
                        data-command="unlink"
                        onmousedown="event.preventDefault()"
                        onclick="appliquerCommandeNotes(this, 'unlink', null, event)"
                        title="Retirer le lien"
                        aria-label="Retirer le lien"
                        ${disabledAttribute}
                    >⛓̸</button>
                </div>

                <div
                    class="notes-editor"
                    contenteditable="${disabled ? 'false' : 'true'}"
                    data-placeholder="Ajoutez des notes…"
                    oninput="marquerNotesModifiees(this)"
                    onpaste="nettoyerCollageNotes(this, event)"
                    onkeyup="mettreAJourEtatBarreNotes(this)"
                    onmouseup="mettreAJourEtatBarreNotes(this)"
                    onkeydown="gererRaccourcisNotes(this, event)"
                    role="textbox"
                    aria-multiline="true"
                >${value}</div>

                <div class="notes-edit-footer">
                    <div
                        id="notes-status-${rowId}"
                        class="section-status notes-status"
                        aria-live="polite"
                    ></div>
                    <div class="notes-edit-actions">
                        <button
                            type="button"
                            class="notes-cancel-button"
                            onclick="annulerEditionNotes(this, event)"
                        >Annuler</button>
                        <button
                            type="button"
                            class="notes-save-button"
                            onclick="enregistrerEtFermerNotes(this, event)"
                        >Enregistrer</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function activerEditionNotes(button, event) {
    event?.preventDefault();
    event?.stopPropagation();

    const field = button.closest('.notes-field');
    const panel = field?.querySelector('.notes-edit-panel');
    const display = field?.querySelector('.notes-display');
    const editor = field?.querySelector('.notes-editor');

    if (
        !field ||
        !panel ||
        !display ||
        !editor ||
        field.dataset.disabled === 'true'
    ) {
        return;
    }

    field._originalNotesHtml = sanitiserHtmlNotes(editor.innerHTML);
    field.classList.add('is-editing');
    field.classList.remove('is-dirty');
    display.hidden = true;
    panel.hidden = false;
    button.hidden = true;

    document.execCommand('defaultParagraphSeparator', false, 'p');
    editor.focus();
    placerCurseurFin(editor);
    mettreAJourEtatBarreNotes(editor);
    setNotesStatus(Number(field.dataset.rowId), '', '');
}

function annulerEditionNotes(button, event) {
    event?.preventDefault();
    event?.stopPropagation();

    const field = button.closest('.notes-field');
    const editor = field?.querySelector('.notes-editor');

    if (!field || !editor) {
        return;
    }

    editor.innerHTML = field._originalNotesHtml || '';
    fermerEditionNotes(field, false);
}

async function enregistrerEtFermerNotes(button, event) {
    event?.preventDefault();
    event?.stopPropagation();

    const field = button.closest('.notes-field');
    const editor = field?.querySelector('.notes-editor');
    const rowId = Number(field?.dataset?.rowId);

    if (!field || !editor || !Number.isInteger(rowId) || rowId <= 0) {
        return;
    }

    button.disabled = true;

    try {
        const savedHtml = await enregistrerNotes(rowId, editor);
        field._originalNotesHtml = savedHtml;
        fermerEditionNotes(field, true);
    } finally {
        button.disabled = false;
    }
}

function fermerEditionNotes(field, updateDisplay) {
    const panel = field.querySelector('.notes-edit-panel');
    const display = field.querySelector('.notes-display');
    const editor = field.querySelector('.notes-editor');
    const editButton = field.querySelector('.notes-edit-button');

    if (updateDisplay && display && editor) {
        const html = sanitiserHtmlNotes(editor.innerHTML).trim();
        const hasContent = texteDepuisHtml(html).trim().length > 0;
        display.innerHTML = hasContent ? html : 'Aucune note pour cette tâche.';
        display.classList.toggle('empty', !hasContent);
    }

    field.classList.remove('is-editing', 'is-dirty');
    if (panel) panel.hidden = true;
    if (display) display.hidden = false;
    if (editButton) editButton.hidden = false;
    setNotesStatus(Number(field.dataset.rowId), '', '');
}

function normaliserHtmlNotes(rawValue) {
    const raw = valeurTexte(rawValue).trim();
    if (!raw) {
        return '';
    }

    const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(raw);
    const html = looksLikeHtml
        ? raw
        : echapperHtml(raw).replace(/\r?\n/g, '<br>');

    return sanitiserHtmlNotes(html);
}

function sanitiserHtmlNotes(html) {
    const template = document.createElement('template');
    template.innerHTML = valeurTexte(html);

    const allowedTags = new Set([
        'B', 'STRONG', 'I', 'EM', 'U', 'S', 'STRIKE',
        'A', 'UL', 'OL', 'LI', 'P', 'DIV', 'BR',
        'BLOCKQUOTE', 'H2', 'H3', 'SPAN',
        'CODE', 'PRE', 'HR', 'MARK'
    ]);

    const dangerousTags = new Set([
        'SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED',
        'FORM', 'INPUT', 'BUTTON', 'SVG', 'MATH', 'META', 'LINK'
    ]);

    const walk = (node) => {
        Array.from(node.childNodes).forEach((child) => {
            if (child.nodeType === Node.ELEMENT_NODE) {
                if (dangerousTags.has(child.tagName)) {
                    child.remove();
                    return;
                }

                if (!allowedTags.has(child.tagName)) {
                    walk(child);
                    child.replaceWith(...Array.from(child.childNodes));
                    return;
                }

                Array.from(child.attributes).forEach((attribute) => {
                    const allowedLinkAttribute = child.tagName === 'A'
                        && ['href', 'target', 'rel'].includes(attribute.name.toLowerCase());

                    if (!allowedLinkAttribute) {
                        child.removeAttribute(attribute.name);
                    }
                });

                if (child.tagName === 'A') {
                    const href = normaliserUrlLien(child.getAttribute('href'));
                    if (!href) {
                        child.replaceWith(...Array.from(child.childNodes));
                        return;
                    }

                    child.setAttribute('href', href);
                    child.setAttribute('target', '_blank');
                    child.setAttribute('rel', 'noopener noreferrer');
                }

                walk(child);
            } else if (child.nodeType !== Node.TEXT_NODE) {
                child.remove();
            }
        });
    };

    walk(template.content);
    return template.innerHTML;
}

function appliquerFormatBlocNotes(select, event) {
    event?.preventDefault();
    event?.stopPropagation();

    const field = select.closest('.notes-field');
    const editor = field?.querySelector('.notes-editor');

    if (!editor || editor.contentEditable !== 'true') {
        return;
    }

    editor.focus();
    document.execCommand('formatBlock', false, select.value || 'p');
    marquerNotesModifiees(editor);
    mettreAJourEtatBarreNotes(editor);
}

function appliquerCommandeNotes(button, command, value, event) {
    event?.preventDefault();
    event?.stopPropagation();

    const field = button.closest('.notes-field');
    const editor = field?.querySelector('.notes-editor');

    if (!editor || editor.contentEditable !== 'true') {
        return;
    }

    editor.focus();
    document.execCommand(command, false, value);
    marquerNotesModifiees(editor);
    mettreAJourEtatBarreNotes(editor);
}

function appliquerBaliseSelectionNotes(button, tagName, event) {
    event?.preventDefault();
    event?.stopPropagation();

    const field = button.closest('.notes-field');
    const editor = field?.querySelector('.notes-editor');
    const selection = window.getSelection();

    if (
        !editor ||
        editor.contentEditable !== 'true' ||
        !selection ||
        selection.rangeCount === 0
    ) {
        return;
    }

    editor.focus();
    const range = selection.getRangeAt(0);

    if (!editor.contains(range.commonAncestorContainer)) {
        return;
    }

    const selectedText = range.toString();
    const tag = tagName === 'mark' ? 'mark' : 'code';

    if (selectedText) {
        document.execCommand(
            'insertHTML',
            false,
            `<${tag}>${echapperHtml(selectedText)}</${tag}>`
        );
    } else {
        document.execCommand(
            'insertHTML',
            false,
            `<${tag}>&#8203;</${tag}>`
        );
    }

    marquerNotesModifiees(editor);
    mettreAJourEtatBarreNotes(editor);
}

function creerLienNotes(button, event) {
    event?.preventDefault();
    event?.stopPropagation();

    const field = button.closest('.notes-field');
    const editor = field?.querySelector('.notes-editor');

    if (!editor || editor.contentEditable !== 'true') {
        return;
    }

    editor.focus();
    const rawUrl = window.prompt('Adresse du lien :', 'https://');
    if (rawUrl === null) {
        return;
    }

    const url = normaliserUrlLien(rawUrl);
    if (!url) {
        setNotesStatus(Number(field.dataset.rowId), 'error', 'Adresse de lien invalide.');
        return;
    }

    const selection = window.getSelection();

    if (!selection || selection.isCollapsed) {
        document.execCommand(
            'insertHTML',
            false,
            `<a href="${echapperAttribut(url)}" target="_blank" rel="noopener noreferrer">${echapperHtml(url)}</a>`
        );
    } else {
        document.execCommand('createLink', false, url);
    }

    marquerNotesModifiees(editor);
    mettreAJourEtatBarreNotes(editor);
}

function normaliserUrlLien(rawUrl) {
    const value = valeurTexte(rawUrl).trim();
    if (!value) {
        return '';
    }

    const candidate = /^(https?:|mailto:|tel:)/i.test(value)
        ? value
        : `https://${value}`;

    try {
        const url = new URL(candidate);
        return ['http:', 'https:', 'mailto:', 'tel:'].includes(url.protocol)
            ? url.href
            : '';
    } catch (_) {
        return '';
    }
}

function nettoyerCollageNotes(editor, event) {
    if (!event?.clipboardData) {
        return;
    }

    event.preventDefault();

    const rich = event.clipboardData.getData('text/html');
    const plain = event.clipboardData.getData('text/plain');
    const content = rich
        ? sanitiserHtmlNotes(rich)
        : echapperHtml(plain).replace(/\r?\n/g, '<br>');

    document.execCommand('insertHTML', false, content);
    marquerNotesModifiees(editor);
}

function marquerNotesModifiees(editor) {
    const field = editor?.closest('.notes-field');
    if (!field) {
        return;
    }

    field.classList.add('is-dirty');
    setNotesStatus(
        Number(field.dataset.rowId),
        'saving',
        'Modifications non enregistrées'
    );
}

function mettreAJourEtatBarreNotes(editor) {
    const field = editor?.closest('.notes-field');
    if (!field || !field.classList.contains('is-editing')) {
        return;
    }

    field.querySelectorAll('.notes-tool[data-command]').forEach((button) => {
        let active = false;

        try {
            active = document.queryCommandState(button.dataset.command);
        } catch (_) {
            active = false;
        }

        button.classList.toggle('active', active);
        button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    const formatSelect = field.querySelector('.notes-format-select');
    if (formatSelect) {
        let format = 'p';

        try {
            format = valeurTexte(document.queryCommandValue('formatBlock'))
                .replace(/[<>]/g, '')
                .toLowerCase() || 'p';
        } catch (_) {
            format = 'p';
        }

        if (Array.from(formatSelect.options).some((option) => option.value === format)) {
            formatSelect.value = format;
        } else {
            formatSelect.value = 'p';
        }
    }
}

function gererRaccourcisNotes(editor, event) {
    if (!(event.ctrlKey || event.metaKey)) {
        return;
    }

    const key = event.key.toLowerCase();

    if (key === 'k') {
        event.preventDefault();
        const button = editor
            .closest('.notes-field')
            ?.querySelector('.notes-tool-link');
        if (button) {
            creerLienNotes(button, event);
        }
    }

    if (event.shiftKey && key === '7') {
        event.preventDefault();
        document.execCommand('insertOrderedList');
        marquerNotesModifiees(editor);
    }

    if (event.shiftKey && key === '8') {
        event.preventDefault();
        document.execCommand('insertUnorderedList');
        marquerNotesModifiees(editor);
    }
}

function placerCurseurFin(element) {
    const range = document.createRange();
    const selection = window.getSelection();

    range.selectNodeContents(element);
    range.collapse(false);
    selection?.removeAllRanges();
    selection?.addRange(range);
}

function texteDepuisHtml(html) {
    const template = document.createElement('template');
    template.innerHTML = valeurTexte(html);
    return template.content.textContent || '';
}

async function enregistrerNotes(rowId, editor) {
    if (!editor) {
        return '';
    }

    const resolvedRowId = Number(rowId);
    const sanitized = sanitiserHtmlNotes(editor.innerHTML).trim();
    const previous = NOTES_SAVE_QUEUES.get(resolvedRowId) || Promise.resolve();

    setNotesStatus(resolvedRowId, 'saving', 'Enregistrement…');

    const next = previous
        .catch(() => undefined)
        .then(() =>
            mettreAJourChamp(
                resolvedRowId,
                'NOTES',
                sanitized || null
            )
        )
        .then(() => {
            editor.innerHTML = sanitized;
            setNotesStatus(resolvedRowId, 'saved', 'Enregistré');
            return sanitized;
        })
        .catch((error) => {
            setNotesStatus(
                resolvedRowId,
                'error',
                'Échec de l’enregistrement'
            );
            console.error(
                'Erreur pendant l’enregistrement des notes :',
                error
            );
            throw error;
        })
        .finally(() => {
            if (NOTES_SAVE_QUEUES.get(resolvedRowId) === next) {
                NOTES_SAVE_QUEUES.delete(resolvedRowId);
            }
        });

    NOTES_SAVE_QUEUES.set(resolvedRowId, next);
    return next;
}

function setNotesStatus(rowId, state, message) {
    const status = document.getElementById(
        `notes-status-${Number(rowId)}`
    );

    if (!status) {
        return;
    }

    status.className =
        `section-status notes-status${state ? ` ${state}` : ''}`;
    status.textContent = message;
}

function construireChampCouleur(todo) {
    const current = normaliserCouleur(todo.COULEUR);
    const pickerValue = current || normaliserCouleur(W.opt?.defaultcardcolor) || '#FFFFD1';
    const disabled = W.col.COULEUR.getIsFormula();

    return `
        <div class="field color-field" data-row-id="${Number(todo.id)}">
            <label class="field-label">Couleur de la carte</label>
            <div class="color-picker-row">
                <input
                    type="color"
                    class="color-picker"
                    value="${echapperAttribut(pickerValue)}"
                    oninput="previsualiserCouleur(${Number(todo.id)}, this.value, this)"
                    onchange="mettreAJourCouleur(${Number(todo.id)}, this.value, this, event)"
                    ${disabled ? 'disabled' : ''}
                    aria-label="Choisir une couleur"
                >
                <input
                    type="text"
                    class="field-input color-value"
                    value="${echapperAttribut(current || '')}"
                    placeholder="#FFFFD1"
                    maxlength="7"
                    oninput="previsualiserCouleur(${Number(todo.id)}, this.value, this)"
                    onchange="mettreAJourCouleur(${Number(todo.id)}, this.value, this, event)"
                    ${disabled ? 'disabled' : ''}
                >
                <button
                    type="button"
                    class="color-reset"
                    onclick="reinitialiserCouleur(this, event)"
                    ${disabled ? 'disabled' : ''}
                    title="Utiliser la couleur par défaut"
                >Réinitialiser</button>
            </div>
            <div class="section-status color-status" aria-live="polite"></div>
        </div>
    `;
}

function normaliserCouleur(value) {
    const raw = valeurTexte(value).trim();
    if (!raw) {
        return '';
    }

    const candidate = raw.startsWith('#') ? raw : `#${raw}`;
    if (/^#[0-9a-f]{3}$/i.test(candidate)) {
        return `#${candidate[1]}${candidate[1]}${candidate[2]}${candidate[2]}${candidate[3]}${candidate[3]}`.toUpperCase();
    }
    if (/^#[0-9a-f]{6}$/i.test(candidate)) {
        return candidate.toUpperCase();
    }
    return '';
}

function previsualiserCouleur(rowId, value, source) {
    const color = normaliserCouleur(value);
    if (!color) {
        return;
    }

    const card = trouverCarteParId(rowId);
    if (card) {
        card.style.backgroundColor = color;
    }

    const field = source?.closest('.color-field');
    if (field) {
        const picker = field.querySelector('.color-picker');
        const text = field.querySelector('.color-value');
        if (picker && source !== picker) picker.value = color;
        if (text && source !== text) text.value = color;
    }
}

async function mettreAJourCouleur(rowId, value, source, event) {
    event?.stopPropagation();

    const field = source?.closest('.color-field');
    const status = field?.querySelector('.color-status');
    const raw = valeurTexte(value).trim();
    const color = normaliserCouleur(raw);

    if (raw && !color) {
        if (status) {
            status.className = 'section-status color-status error';
            status.textContent = 'Utilisez un code hexadécimal, par exemple #FFFFD1.';
        }
        return;
    }

    try {
        if (status) {
            status.className = 'section-status color-status saving';
            status.textContent = 'Enregistrement…';
        }

        await mettreAJourChamp(rowId, 'COULEUR', color || null, event);

        const card = trouverCarteParId(rowId);
        if (card) {
            if (color) {
                card.style.backgroundColor = color;
            } else {
                card.style.backgroundColor = normaliserCouleur(W.opt?.defaultcardcolor) || '#FFFFD1';
            }
        }

        if (field) {
            const picker = field.querySelector('.color-picker');
            const text = field.querySelector('.color-value');
            if (picker) picker.value = color || normaliserCouleur(W.opt?.defaultcardcolor) || '#FFFFD1';
            if (text) text.value = color || '';
        }

        if (status) {
            status.className = 'section-status color-status saved';
            status.textContent = 'Enregistré';
            window.setTimeout(() => {
                status.className = 'section-status color-status';
                status.textContent = '';
            }, 1200);
        }
    } catch (error) {
        if (status) {
            status.className = 'section-status color-status error';
            status.textContent = 'Impossible d’enregistrer la couleur.';
        }
        console.error('Erreur pendant l’enregistrement de la couleur :', error);
    }
}

function reinitialiserCouleur(button, event) {
    event?.preventDefault();
    event?.stopPropagation();

    const field = button.closest('.color-field');
    const rowId = Number(field?.dataset?.rowId);
    if (!field || !Number.isInteger(rowId) || rowId <= 0) {
        return;
    }

    const text = field.querySelector('.color-value');
    if (text) text.value = '';
    mettreAJourCouleur(rowId, '', button, event);
}

// ========== RESPONSABLES ET ÉTIQUETTES (REFLIST) ==========

function insererChampResponsables(id, selectedIds, title, disabled) {
    const selection = new Set(normaliserIdsRefList(selectedIds));
    const options = RESPONSABLES.map((person) => `
        <label class="multi-option responsable-option" data-search="${echapperAttribut(person.label.toLocaleLowerCase(W.cultureFull))}">
            <input
                type="checkbox"
                value="${person.id}"
                ${selection.has(person.id) ? 'checked' : ''}
                onchange="mettreAJourChampResponsables(${Number(id)}, this.closest('.multi-dropdown'), event)"
                ${disabled ? 'disabled' : ''}
            >
            <span class="responsable-option-avatar" style="background:${echapperAttribut(person.avatarColor)}">${echapperHtml(person.initials)}</span>
            <span class="responsable-option-name">${echapperHtml(person.label)}</span>
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
    if (values.length === 0) return 'Choisir…';
    if (values.length === 1) return values[0];
    return `${values.length} responsables`;
}

function filtrerOptionsMultiples(input) {
    const dropdown = input.closest('.multi-dropdown');
    if (!dropdown) return;

    const query = input.value.trim().toLocaleLowerCase(W.cultureFull);
    dropdown.querySelectorAll('.multi-option').forEach((option) => {
        option.hidden = query !== '' && !valeurTexte(option.dataset.search).includes(query);
    });
}

function viderResponsables(button, event) {
    event?.preventDefault();
    event?.stopPropagation();

    const dropdown = button.closest('.multi-dropdown');
    if (!dropdown) return;

    dropdown.querySelectorAll('input[type="checkbox"]:checked').forEach((checkbox) => {
        checkbox.checked = false;
    });

    mettreAJourChampResponsables(Number(dropdown.dataset.rowId), dropdown, event);
}

async function mettreAJourChampResponsables(rowId, dropdown, event) {
    event?.stopPropagation();

    const resolvedRowId = Number(rowId || dropdown?.dataset?.rowId);
    if (!Number.isInteger(resolvedRowId) || resolvedRowId <= 0 || !dropdown) return;

    const ids = Array.from(dropdown.querySelectorAll('input[type="checkbox"]:checked'))
        .map((input) => Number(input.value))
        .filter((id) => Number.isInteger(id) && id > 0 && RESPONSABLES_BY_ID.has(id));

    const labels = ids.map((id) => RESPONSABLES_BY_ID.get(id).label);
    dropdown.querySelector('summary').textContent = resumeResponsables(labels);
    setMultiStatus(dropdown, 'saving', 'Enregistrement…');

    const previous = RESPONSABLE_SAVE_QUEUES.get(resolvedRowId) || Promise.resolve();
    const next = previous
        .catch(() => undefined)
        .then(() => ecrireReferenceMultiple(resolvedRowId, 'RESPONSABLE', ids))
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

function mettreAJourResponsablesLocaux(rowId, ids) {
    const record = trouverRecord(rowId);
    if (!record) return;

    record.RESPONSABLE_id = [...ids];
    record.RESPONSABLE = ids
        .map((id) => RESPONSABLES_BY_ID.get(id)?.label)
        .filter(Boolean);
}

function construireChampEtiquettes(todo) {
    const selection = new Set(obtenirIdsEtiquettes(todo));
    const disabled = W.col.ETIQUETTES.getIsFormula();

    const options = ETIQUETTES.map((item) => `
        <label class="multi-option etiquette-option" data-search="${echapperAttribut(item.label.toLocaleLowerCase(W.cultureFull))}">
            <input
                type="checkbox"
                value="${item.id}"
                ${selection.has(item.id) ? 'checked' : ''}
                onchange="mettreAJourEtiquettes(${Number(todo.id)}, this.closest('.multi-dropdown'), event)"
                ${disabled ? 'disabled' : ''}
            >
            <span
                class="etiquette-preview"
                style="background:${echapperAttribut(item.color)};color:${echapperAttribut(item.textColor)}"
            >${echapperHtml(item.label)}</span>
        </label>
    `).join('');

    const selectedLabels = [...selection]
        .map((id) => ETIQUETTES_BY_ID.get(id)?.label)
        .filter(Boolean);

    return `
        <div class="field field-etiquettes">
            <label class="field-label">Étiquettes</label>
            <details class="multi-dropdown etiquettes-dropdown" data-row-id="${Number(todo.id)}">
                <summary>${echapperHtml(resumeEtiquettes(selectedLabels))}</summary>
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
                        <button type="button" class="multi-clear" onclick="viderEtiquettes(this, event)" ${disabled ? 'disabled' : ''}>Effacer</button>
                    </div>
                    <div class="multi-options">${options || '<div class="multi-empty">Ajoutez des lignes dans la table référencée par Étiquettes</div>'}</div>
                    <div class="multi-status" aria-live="polite"></div>
                </div>
            </details>
        </div>
    `;
}

function resumeEtiquettes(labels) {
    const values = normaliserListeTexte(labels);
    if (values.length === 0) return 'Choisir…';
    if (values.length === 1) return values[0];
    return `${values.length} étiquettes`;
}

function viderEtiquettes(button, event) {
    event?.preventDefault();
    event?.stopPropagation();

    const dropdown = button.closest('.multi-dropdown');
    if (!dropdown) return;

    dropdown.querySelectorAll('input[type="checkbox"]:checked').forEach((checkbox) => {
        checkbox.checked = false;
    });

    mettreAJourEtiquettes(Number(dropdown.dataset.rowId), dropdown, event);
}

async function mettreAJourEtiquettes(rowId, dropdown, event) {
    event?.stopPropagation();

    const resolvedRowId = Number(rowId || dropdown?.dataset?.rowId);
    if (!Number.isInteger(resolvedRowId) || resolvedRowId <= 0 || !dropdown) return;

    const ids = Array.from(dropdown.querySelectorAll('input[type="checkbox"]:checked'))
        .map((input) => Number(input.value))
        .filter((id) => Number.isInteger(id) && id > 0 && ETIQUETTES_BY_ID.has(id));

    const labels = ids.map((id) => ETIQUETTES_BY_ID.get(id).label);
    dropdown.querySelector('summary').textContent = resumeEtiquettes(labels);
    setMultiStatus(dropdown, 'saving', 'Enregistrement…');

    const previous = LABEL_SAVE_QUEUES.get(resolvedRowId) || Promise.resolve();
    const next = previous
        .catch(() => undefined)
        .then(() => ecrireReferenceMultiple(resolvedRowId, 'ETIQUETTES', ids))
        .then(() => {
            mettreAJourEtiquettesLocales(resolvedRowId, ids);
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

function mettreAJourEtiquettesLocales(rowId, ids) {
    const record = trouverRecord(rowId);
    if (!record) return;

    record.ETIQUETTES_id = [...ids];
    record.ETIQUETTES = ids
        .map((id) => ETIQUETTES_BY_ID.get(id)?.label)
        .filter(Boolean);
}

async function ecrireReferenceMultiple(rowId, mappingKey, ids) {
    const actualColumnId = W.map?.[mappingKey];
    if (!actualColumnId || Array.isArray(actualColumnId)) {
        throw new Error(`La colonne ${mappingKey} n’est pas correctement mappée.`);
    }

    const normalizedIds = [...new Set(
        normaliserTableau(ids)
            .map(Number)
            .filter((id) => Number.isInteger(id) && id > 0)
    )];

    const tableId = await grist.getTable().getTableId();
    const rawValue = normalizedIds.length > 0 ? ['L', ...normalizedIds] : null;

    /*
     * Écriture au format natif Grist :
     * RefList = ["L", rowId1, rowId2, ...].
     * applyUserActions contourne les conversions de chaînes et les remappages du SDK.
     */
    await grist.docApi.applyUserActions([
        ['UpdateRecord', tableId, Number(rowId), {
            [actualColumnId]: rawValue
        }]
    ]);

    const writtenValue = await lireValeurBruteCellule(rowId, actualColumnId);
    const writtenIds = extraireIdsReferenceMultiple(writtenValue);

    if (!memeListeIds(normalizedIds, writtenIds)) {
        throw new Error(
            `Vérification d’écriture échouée pour ${mappingKey}. ` +
            `Valeur envoyée : ${JSON.stringify(rawValue)} ; valeur relue : ${JSON.stringify(writtenValue)}`
        );
    }

    await mettreAJourDateTechnique(rowId);
}

async function lireValeurBruteCellule(rowId, columnId) {
    const tableId = await grist.getTable().getTableId();
    const rawTable = await grist.docApi.fetchTable(tableId);
    const rowIndex = normaliserTableau(rawTable?.id).findIndex((id) => Number(id) === Number(rowId));

    if (rowIndex < 0) {
        throw new Error(`Ligne ${rowId} introuvable dans la table ${tableId}.`);
    }

    return rawTable?.[columnId]?.[rowIndex];
}

function extraireIdsReferenceMultiple(value) {
    if (value === null || value === undefined || value === '') return [];
    if (!Array.isArray(value) || value[0] === 'E') return [];
    if (value[0] === 'L') return normaliserIdsListe(value.slice(1));
    if (value[0] === 'r') return normaliserIdsListe(value[2]);
    return normaliserIdsListe(value);
}

function memeListeIds(expected, actual) {
    const left = [...new Set(expected.map(Number))].sort((a, b) => a - b);
    const right = [...new Set(actual.map(Number))].sort((a, b) => a - b);
    return left.length === right.length && left.every((id, index) => id === right[index]);
}

function setMultiStatus(dropdown, state, message) {
    const status = dropdown?.querySelector('.multi-status');
    if (!status) return;

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
    const mentionsEnabled = W.opt.enablementions !== false;

    return `
        <section
            class="detail-section comments-section"
            data-row-id="${Number(todo.id)}"
        >
            <div class="detail-section-header">
                <div>
                    <h3>💬 Commentaires</h3>
                    <p>${comments.length} commentaire(s)</p>
                </div>
            </div>

            <div
                id="comments-list-${Number(todo.id)}"
                class="comments-list"
            >
                ${construireListeCommentaires(comments, todo.id)}
            </div>

            <div class="comment-composer">
                <div class="comment-input-wrapper">
                    <textarea
                        class="comment-input"
                        placeholder="Écrire un commentaire${mentionsEnabled ? ' — utilisez @ pour mentionner quelqu’un' : ''}…"
                        oninput="ajusterTextarea(this); gererSaisieMention(this)"
                        onkeydown="gererTouchesMention(this, event)"
                    ></textarea>

                    ${mentionsEnabled ? construireMenuMentions() : ''}
                </div>

                ${mentionsEnabled ? `
                    <div class="comment-mention-tools">
                        <button
                            type="button"
                            class="comment-mention-button"
                            onclick="ouvrirMenuMentions(this, event)"
                        >@ Mentionner</button>
                        <div class="comment-selected-mentions"></div>
                    </div>
                ` : ''}

                <div class="comment-grist-author">
                    Le nom de l’auteur est renseigné par Grist avec
                    <code>user.Name</code>.
                    ${mentionsEnabled
                        ? 'Les e-mails sont préparés dans la table de notifications configurée.'
                        : ''}
                </div>

                <div class="comment-composer-footer">
                    <div
                        id="comments-status-${Number(todo.id)}"
                        class="section-status"
                        aria-live="polite"
                    ></div>
                    <button
                        type="button"
                        onclick="ajouterCommentaire(${Number(todo.id)}, this, event)"
                    >Commenter</button>
                </div>
            </div>
        </section>
    `;
}

function construireMenuMentions() {
    const options = RESPONSABLES.map((person) => `
        <button
            type="button"
            class="mention-option"
            data-member-id="${person.id}"
            data-search="${echapperAttribut(
                `${person.label} ${person.email || ''}`.toLocaleLowerCase(
                    W.cultureFull
                )
            )}"
            onclick="selectionnerMentionCommentaire(this, ${person.id}, event)"
        >
            <span
                class="mention-option-avatar"
                style="background:${echapperAttribut(person.avatarColor)}"
            >${echapperHtml(person.initials)}</span>
            <span class="mention-option-text">
                <strong>${echapperHtml(person.label)}</strong>
                <small>${person.email
                    ? echapperHtml(person.email)
                    : 'E-mail manquant dans la table Membres'}</small>
            </span>
        </button>
    `).join('');

    return `
        <div class="mention-menu" hidden>
            <div class="mention-menu-header">
                <strong>Mentionner un membre</strong>
                <button
                    type="button"
                    onclick="fermerMenuMentions(this, event)"
                    aria-label="Fermer"
                >×</button>
            </div>
            <div class="mention-options">
                ${options || '<div class="section-empty">Aucun membre disponible</div>'}
            </div>
        </div>
    `;
}

function ouvrirMenuMentions(button, event) {
    event?.preventDefault();
    event?.stopPropagation();

    const composer = button.closest('.comment-composer');
    const menu = composer?.querySelector('.mention-menu');

    if (!menu) {
        return;
    }

    menu.hidden = false;
    filtrerMenuMentions(menu, '');
}

function fermerMenuMentions(button, event) {
    event?.preventDefault();
    event?.stopPropagation();
    const menu = button.closest('.mention-menu');
    if (menu) {
        menu.hidden = true;
    }
}

function gererSaisieMention(textarea) {
    const composer = textarea.closest('.comment-composer');
    const menu = composer?.querySelector('.mention-menu');

    if (!menu || W.opt.enablementions === false) {
        return;
    }

    const context = trouverContexteMention(textarea);

    if (!context) {
        menu.hidden = true;
        return;
    }

    menu.hidden = false;
    menu.dataset.mentionStart = String(context.start);
    filtrerMenuMentions(menu, context.query);
}

function gererTouchesMention(textarea, event) {
    const composer = textarea.closest('.comment-composer');
    const menu = composer?.querySelector('.mention-menu');

    if (!menu || menu.hidden) {
        return;
    }

    const visibleOptions = Array.from(
        menu.querySelectorAll('.mention-option:not([hidden])')
    );

    if (event.key === 'Escape') {
        event.preventDefault();
        menu.hidden = true;
        textarea.focus();
        return;
    }

    if (event.key === 'Enter' && visibleOptions.length === 1) {
        event.preventDefault();
        visibleOptions[0].click();
    }
}

function filtrerMenuMentions(menu, query) {
    const normalized = valeurTexte(query)
        .trim()
        .toLocaleLowerCase(W.cultureFull);

    menu.querySelectorAll('.mention-option').forEach((option) => {
        option.hidden =
            normalized !== '' &&
            !valeurTexte(option.dataset.search).includes(normalized);
    });
}

function trouverContexteMention(textarea) {
    const caret = Number(textarea.selectionStart);
    const before = textarea.value.slice(0, caret);
    const match = before.match(/(?:^|\s)@([^@\n]*)$/);

    if (!match) {
        return null;
    }

    const query = match[1];
    return {
        query,
        start: caret - query.length - 1,
        end: caret
    };
}

function selectionnerMentionCommentaire(button, memberId, event) {
    event?.preventDefault();
    event?.stopPropagation();

    const composer = button.closest('.comment-composer');
    const textarea = composer?.querySelector('.comment-input');
    const menu = composer?.querySelector('.mention-menu');
    const person = RESPONSABLES_BY_ID.get(Number(memberId));

    if (!composer || !textarea || !person) {
        return;
    }

    const context = trouverContexteMention(textarea);
    const token = `@${person.label}`;

    if (context) {
        textarea.setRangeText(
            `${token} `,
            context.start,
            context.end,
            'end'
        );
    } else {
        const separator =
            textarea.value &&
            !/\s$/.test(textarea.value)
                ? ' '
                : '';

        textarea.setRangeText(
            `${separator}${token} `,
            textarea.selectionStart,
            textarea.selectionEnd,
            'end'
        );
    }

    if (!composer._selectedMentions) {
        composer._selectedMentions = new Map();
    }

    composer._selectedMentions.set(person.id, {
        id: person.id,
        name: person.label,
        email: person.email || ''
    });

    afficherMentionsSelectionnees(composer);
    if (menu) {
        menu.hidden = true;
    }

    textarea.focus();
    ajusterTextarea(textarea);
}

function afficherMentionsSelectionnees(composer) {
    const container = composer.querySelector(
        '.comment-selected-mentions'
    );

    if (!container) {
        return;
    }

    const mentions = Array.from(
        composer._selectedMentions?.values?.() || []
    );

    container.innerHTML = mentions.map((mention) => `
        <span class="selected-mention-chip">
            @${echapperHtml(mention.name)}
            <button
                type="button"
                onclick="retirerMentionCommentaire(this, ${Number(mention.id)}, event)"
                aria-label="Retirer ${echapperAttribut(mention.name)}"
            >×</button>
        </span>
    `).join('');
}

function retirerMentionCommentaire(button, memberId, event) {
    event?.preventDefault();
    event?.stopPropagation();

    const composer = button.closest('.comment-composer');
    const textarea = composer?.querySelector('.comment-input');
    const person = RESPONSABLES_BY_ID.get(Number(memberId));

    composer?._selectedMentions?.delete(Number(memberId));

    if (textarea && person) {
        const token = `@${person.label}`;
        textarea.value = textarea.value
            .replaceAll(token, '')
            .replace(/[ \t]{2,}/g, ' ')
            .trimStart();

        ajusterTextarea(textarea);
    }

    if (composer) {
        afficherMentionsSelectionnees(composer);
    }
}

function construireListeCommentaires(comments, rowId) {
    if (comments.length === 0) {
        return '<div class="section-empty">Aucun commentaire</div>';
    }

    return comments.map((comment) => `
        <article
            class="comment-card"
            data-comment-id="${echapperAttribut(comment.id)}"
        >
            <div class="comment-header">
                <strong>${echapperHtml(
                    comment.author === COMMENT_AUTHOR_PLACEHOLDER
                        ? 'Nom Grist non configuré'
                        : (comment.author || 'Anonyme')
                )}</strong>
                <span>${echapperHtml(formatDateTime(comment.createdAt))}</span>
                <button
                    type="button"
                    onclick="supprimerCommentaire(
                        ${Number(rowId)},
                        '${echapperJs(comment.id)}',
                        event
                    )"
                    title="Supprimer le commentaire"
                >×</button>
            </div>
            <div class="comment-body">
                ${construireCorpsCommentaire(comment)}
            </div>
        </article>
    `).join('');
}

function construireCorpsCommentaire(comment) {
    let html = echapperHtml(comment.text).replace(/\n/g, '<br>');

    const mentions = normaliserMentionsCommentaire(comment.mentions)
        .sort((a, b) => b.name.length - a.name.length);

    mentions.forEach((mention) => {
        const escapedToken = echapperHtml(`@${mention.name}`);
        const badge = `
            <span
                class="comment-mention"
                title="${echapperAttribut(
                    mention.email || mention.name
                )}"
            >${escapedToken}</span>
        `;

        html = html.split(escapedToken).join(badge);
    });

    return html;
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
                text: valeurTexte(comment?.text),
                mentions: normaliserMentionsCommentaire(
                    comment?.mentions
                )
            }))
            .filter((comment) => comment.text.trim());
    } catch (_) {
        return [{
            id: 'legacy-text',
            author: 'Ancien commentaire',
            createdAt: '',
            text: raw,
            mentions: []
        }];
    }
}

function normaliserMentionsCommentaire(rawMentions) {
    return normaliserTableau(rawMentions)
        .map((mention) => ({
            id: Number(mention?.id) || 0,
            name: valeurTexte(
                mention?.name || mention?.label
            ).trim(),
            email: normaliserEmail(mention?.email)
        }))
        .filter((mention) => mention.name);
}

async function ajouterCommentaire(rowId, button, event) {
    event?.preventDefault();
    event?.stopPropagation();

    const section = button.closest('.comments-section');
    const composer = section?.querySelector('.comment-composer');
    const textarea = composer?.querySelector('.comment-input');
    const text = valeurTexte(textarea?.value).trim();

    if (!text) {
        afficherStatutSection(
            'comments',
            rowId,
            'error',
            'Écrivez un commentaire.'
        );
        textarea?.focus();
        return;
    }

    const selectedMentions = Array.from(
        composer?._selectedMentions?.values?.() || []
    ).filter((mention) =>
        text.includes(`@${mention.name}`)
    );

    button.disabled = true;
    afficherStatutSection(
        'comments',
        rowId,
        'saving',
        'Enregistrement…'
    );

    const comment = {
        id: genererIdentifiant(),
        author: COMMENT_AUTHOR_PLACEHOLDER,
        createdAt: new Date().toISOString(),
        text,
        mentions: selectedMentions
    };

    try {
        const savedComments = await mettreAJourCommentairesEnFile(
            rowId,
            (comments) => [...comments, comment]
        );

        const savedComment = savedComments.find(
            (item) => item.id === comment.id
        );

        if (
            !savedComment ||
            savedComment.author === COMMENT_AUTHOR_PLACEHOLDER
        ) {
            throw new Error(
                'La formule user.Name n’a pas remplacé le nom temporaire.'
            );
        }

        let notificationResult = {
            prepared: 0,
            missingEmails: []
        };

        if (
            W.opt.enablementions !== false &&
            savedComment.mentions.length > 0
        ) {
            notificationResult =
                await preparerNotificationsMentions(
                    rowId,
                    savedComment
                );
        }

        if (textarea) {
            textarea.value = '';
            ajusterTextarea(textarea);
        }

        if (composer) {
            composer._selectedMentions = new Map();
            afficherMentionsSelectionnees(composer);
            const menu = composer.querySelector('.mention-menu');
            if (menu) {
                menu.hidden = true;
            }
        }

        rafraichirCommentaires(rowId);

        const messages = [
            `Commentaire ajouté par ${savedComment.author}.`
        ];

        if (notificationResult.prepared > 0) {
            messages.push(
                `${notificationResult.prepared} notification(s) transmise(s) à l’automatisation.`
            );
        }

        if (notificationResult.missingEmails.length > 0) {
            messages.push(
                `E-mail manquant pour : ${notificationResult.missingEmails.join(', ')}.`
            );
        }

        afficherStatutSection(
            'comments',
            rowId,
            notificationResult.missingEmails.length > 0
                ? 'warning'
                : 'saved',
            messages.join(' ')
        );
    } catch (error) {
        console.error(
            'Erreur pendant l’ajout du commentaire :',
            error
        );

        rafraichirCommentaires(rowId);
        afficherStatutSection(
            'comments',
            rowId,
            'error',
            valeurTexte(error?.message) ||
            'Impossible d’ajouter le commentaire.'
        );
    } finally {
        button.disabled = false;
    }
}

async function preparerNotificationsMentions(rowId, comment) {
    const mentions = normaliserMentionsCommentaire(comment.mentions);
    const missingEmails = mentions
        .filter((mention) => !mention.email)
        .map((mention) => mention.name);

    const recipients = [
        ...new Map(
            mentions
                .filter((mention) => mention.email)
                .map((mention) => [mention.email, mention])
        ).values()
    ];

    if (recipients.length === 0) {
        return {
            prepared: 0,
            missingEmails
        };
    }

    const tableId = valeurTexte(
        W.opt.mentionnotificationtable ||
        'Notifications_Kanban'
    ).trim();

    if (!tableId) {
        throw new Error(
            'Renseignez la table des notifications dans la configuration du widget.'
        );
    }

    const todo = trouverRecord(rowId);
    const taskName =
        valeurTexte(todo?.DESCRIPTION).trim() ||
        `Tâche #${Number(rowId)}`;

    const notificationTable = grist.getTable(tableId);

    const records = recipients.map((recipient) => ({
        fields: {
            Destinataire_email: recipient.email,
            Destinataire_nom: recipient.name,
            Tache_id: Number(rowId),
            Tache: taskName,
            Auteur: comment.author,
            Commentaire: comment.text,
            Commentaire_id: comment.id,
            Cree_le: new Date().toISOString()
        }
    }));

    try {
        await notificationTable.create(records);
    } catch (error) {
        throw new Error(
            `Le commentaire est enregistré, mais la table « ${tableId} » ` +
            'est absente ou mal configurée. Consultez le guide des notifications.'
        );
    }

    return {
        prepared: records.length,
        missingEmails
    };
}

async function supprimerCommentaire(rowId, commentId, event) {
    event?.preventDefault();
    event?.stopPropagation();

    try {
        afficherStatutSection(
            'comments',
            rowId,
            'saving',
            'Suppression…'
        );

        await mettreAJourCommentairesEnFile(
            rowId,
            (comments) =>
                comments.filter(
                    (comment) => comment.id !== commentId
                )
        );

        rafraichirCommentaires(rowId);
        afficherStatutSection(
            'comments',
            rowId,
            'saved',
            'Commentaire supprimé.'
        );
    } catch (error) {
        console.error(
            'Erreur pendant la suppression du commentaire :',
            error
        );

        afficherStatutSection(
            'comments',
            rowId,
            'error',
            'Impossible de supprimer le commentaire.'
        );
    }
}

async function mettreAJourCommentairesEnFile(rowId, transform) {
    const resolvedRowId = Number(rowId);
    const previous =
        COMMENT_SAVE_QUEUES.get(resolvedRowId) ||
        Promise.resolve();

    const next = previous
        .catch(() => undefined)
        .then(async () => {
            const record = trouverRecord(resolvedRowId);
            const current = parserCommentaires(
                record?.COMMENTAIRES
            );
            const updated = transform(current);
            const serialized = JSON.stringify(updated);
            const tracking = construireChampsSuivi();

            await W.updateRecords(
                W.formatRecord(resolvedRowId, {
                    COMMENTAIRES: serialized,
                    ...tracking
                })
            );

            const refreshed =
                await rechargerCommentairesDepuisGrist(
                    resolvedRowId
                );

            if (record) {
                record.COMMENTAIRES =
                    JSON.stringify(refreshed);
            }

            return refreshed;
        })
        .finally(() => {
            if (
                COMMENT_SAVE_QUEUES.get(resolvedRowId) === next
            ) {
                COMMENT_SAVE_QUEUES.delete(resolvedRowId);
            }
        });

    COMMENT_SAVE_QUEUES.set(resolvedRowId, next);
    return next;
}

async function rechargerCommentairesDepuisGrist(rowId) {
    const actualColumnId = W.map?.COMMENTAIRES;

    if (!actualColumnId || Array.isArray(actualColumnId)) {
        throw new Error(
            'La colonne Commentaires n’est pas correctement mappée.'
        );
    }

    const rawValue = await lireValeurBruteCellule(
        rowId,
        actualColumnId
    );
    const comments = parserCommentaires(rawValue);
    const record = trouverRecord(rowId);

    if (record) {
        record.COMMENTAIRES = valeurTexte(rawValue);
    }

    return comments;
}

function rafraichirCommentaires(rowId) {
    const record = trouverRecord(rowId);
    const comments = parserCommentaires(
        record?.COMMENTAIRES
    );
    const list = document.getElementById(
        `comments-list-${Number(rowId)}`
    );
    const section = list?.closest('.comments-section');

    if (list) {
        list.innerHTML =
            construireListeCommentaires(comments, rowId);
    }

    const subtitle =
        section?.querySelector('.detail-section-header p');

    if (subtitle) {
        subtitle.textContent =
            `${comments.length} commentaire(s)`;
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

        const data = {
            [field]: value,
            ...(field === 'DERNIERE_MISE_A_JOUR' || field === 'MODIFIE_PAR' ? {} : construireChampsSuivi())
        };

        await W.updateRecords(W.formatRecord(todoId, data));

        const record = trouverRecord(todoId);
        if (record) {
            record[field] = value;
            if (data.DERNIERE_MISE_A_JOUR) {
                record.DERNIERE_MISE_A_JOUR = data.DERNIERE_MISE_A_JOUR;
            }
            if (data.MODIFIE_PAR) {
                record.MODIFIE_PAR = data.MODIFIE_PAR;
            }
        }
    } catch (error) {
        console.error(T('Error during update:'), error);
        throw error;
    }
}

function construireChampsSuivi() {
    const data = {};

    if (W.map?.DERNIERE_MISE_A_JOUR && !W.col.DERNIERE_MISE_A_JOUR.getIsFormula()) {
        data.DERNIERE_MISE_A_JOUR = new Date().toISOString();
    }

    if (W.map?.MODIFIE_PAR && !W.col.MODIFIE_PAR.getIsFormula()) {
        data.MODIFIE_PAR = COMMENT_AUTHOR_PLACEHOLDER;
    }

    return data;
}

async function mettreAJourDateTechnique(rowId) {
    const data = construireChampsSuivi();
    if (Object.keys(data).length === 0) {
        return;
    }

    try {
        await W.updateRecords(W.formatRecord(rowId, data));
        const record = trouverRecord(rowId);
        if (record) {
            Object.assign(record, data);
        }
    } catch (error) {
        console.warn('Données enregistrées, mais informations de suivi non modifiées :', error);
    }
}

async function creerNouvelleTache(status) {
    try {
        const data = {DESCRIPTION: '', STATUT: status};
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
    if (W.opt.confirmdelete !== false && !confirm(T('Are you sure you want to delete this task?'))) {
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

    const dirtyNotes = popup.querySelector(
        '.notes-field.is-editing.is-dirty'
    );

    if (
        dirtyNotes &&
        !window.confirm(
            'Les modifications des notes ne sont pas enregistrées. Fermer quand même ?'
        )
    ) {
        return;
    }

    trouverCarteParId(
        popup.dataset.currentTodo
    )?.classList.remove('active');

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
    if (W?.opt?.autoclosemenus !== false) {
        fermerTousLesMenusMultiples(openedDropdown);
    }

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

    const labels = normaliserListeTexte(todo?.RESPONSABLE).filter((value) => value !== '#KeyError');
    const available = [...RESPONSABLES];

    return labels.flatMap((label) => {
        const index = available.findIndex((person) => person.label === label);
        if (index < 0) return [];
        const [person] = available.splice(index, 1);
        return [person.id];
    });
}

function obtenirResponsables(todo) {
    const ids = obtenirIdsResponsables(todo);
    if (ids.length > 0) {
        return ids.map((id) => RESPONSABLES_BY_ID.get(id)).filter(Boolean);
    }

    return normaliserListeTexte(todo?.RESPONSABLE)
        .filter((label) => label !== '#KeyError')
        .map((label) => ({
            id: 0,
            label,
            initials: calculerInitiales(label),
            avatarColor: couleurAvatar(label)
        }));
}

function obtenirLibellesResponsables(todo) {
    return obtenirResponsables(todo).map((person) => person.label);
}

function obtenirIdsEtiquettes(todo) {
    const directIds = normaliserIdsRefList(todo?.ETIQUETTES_id);
    if (directIds.length > 0) {
        return directIds;
    }

    const labels = normaliserListeTexte(todo?.ETIQUETTES).filter((value) => value !== '#KeyError');
    const available = [...ETIQUETTES];

    return labels.flatMap((label) => {
        const index = available.findIndex((item) => item.label === label);
        if (index < 0) return [];
        const [item] = available.splice(index, 1);
        return [item.id];
    });
}

function obtenirEtiquettes(todo) {
    const ids = obtenirIdsEtiquettes(todo);
    if (ids.length > 0) {
        return ids.map((id) => ETIQUETTES_BY_ID.get(id)).filter(Boolean);
    }

    return normaliserListeTexte(todo?.ETIQUETTES)
        .filter((label) => label !== '#KeyError')
        .map((label) => {
            const color = couleurEtiquetteParDefaut(label);
            return {
                id: 0,
                label,
                color,
                textColor: couleurTexteContraste(color)
            };
        });
}

function normaliserIdsRefList(value) {
    return normaliserIdsListe(value);
}

function normaliserIdsListe(value) {
    let values = normaliserTableau(value);

    if (values[0] === 'L') {
        values = values.slice(1);
    } else if (values[0] === 'r') {
        values = normaliserTableau(values[2]);
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

function normaliserEmail(value) {
    const email = valeurTexte(value).trim().toLowerCase();
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? email
        : '';
}

function construireInfoCreation(todo) {
    const lines = [];

    const createdDate = W.map?.CREE_LE && todo.CREE_LE ? formatDateTime(todo.CREE_LE) : '';
    const createdBy = W.map?.CREE_PAR ? valeurTexte(todo.CREE_PAR).trim() : '';

    if (createdDate || createdBy) {
        const createdParts = ['Créé'];
        if (createdDate) createdParts.push(`le ${createdDate}`);
        if (createdBy) createdParts.push(`par ${createdBy}`);
        lines.push(`<div>${echapperHtml(createdParts.join(' '))}</div>`);
    }

    const modifiedDate = W.map?.DERNIERE_MISE_A_JOUR && todo.DERNIERE_MISE_A_JOUR
        ? formatDateTime(todo.DERNIERE_MISE_A_JOUR)
        : '';
    const rawModifiedBy = W.map?.MODIFIE_PAR ? valeurTexte(todo.MODIFIE_PAR).trim() : '';
    const modifiedBy = rawModifiedBy === COMMENT_AUTHOR_PLACEHOLDER
        ? 'Nom Grist non configuré'
        : rawModifiedBy;

    if (modifiedDate || modifiedBy) {
        const modifiedParts = ['Modifié'];
        if (modifiedDate) modifiedParts.push(`le ${modifiedDate}`);
        if (modifiedBy) modifiedParts.push(`par ${modifiedBy}`);
        lines.push(`<div>${echapperHtml(modifiedParts.join(' '))}</div>`);
    }

    return lines.join('');
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
window.ajouterCommentaire = ajouterCommentaire;
window.supprimerCommentaire = supprimerCommentaire;
window.ajusterTextarea = ajusterTextarea;
window.previsualiserCouleur = previsualiserCouleur;
window.mettreAJourCouleur = mettreAJourCouleur;
window.reinitialiserCouleur = reinitialiserCouleur;

window.activerEditionNotes = activerEditionNotes;
window.annulerEditionNotes = annulerEditionNotes;
window.enregistrerEtFermerNotes = enregistrerEtFermerNotes;
window.appliquerFormatBlocNotes = appliquerFormatBlocNotes;
window.appliquerCommandeNotes = appliquerCommandeNotes;
window.appliquerBaliseSelectionNotes = appliquerBaliseSelectionNotes;
window.creerLienNotes = creerLienNotes;
window.nettoyerCollageNotes = nettoyerCollageNotes;
window.marquerNotesModifiees = marquerNotesModifiees;
window.mettreAJourEtatBarreNotes = mettreAJourEtatBarreNotes;
window.gererRaccourcisNotes = gererRaccourcisNotes;

window.ouvrirMenuMentions = ouvrirMenuMentions;
window.fermerMenuMentions = fermerMenuMentions;
window.gererSaisieMention = gererSaisieMention;
window.gererTouchesMention = gererTouchesMention;
window.selectionnerMentionCommentaire = selectionnerMentionCommentaire;
window.retirerMentionCommentaire = retirerMentionCommentaire;
