// ========== KANBAN2 — VERSION 9.0.1 ==========
// Correctif de la refonte technique : références Grist et état centralisé réparés.
// Compatible avec WidgetSDK 1.2.0.62.

'use strict';

let widget;
let translate;

const DEADLINE_PRIORITE = new Date('3000-01-01');
const BACKCOLOR = '#DCDCDC';
const TEXTCOLOR = '#000000';
const ATTACHMENT_TOKEN_MAX_AGE = 2 * 60 * 1000;
const MAX_ATTACHMENT_SIZE = 50 * 1024 * 1024;
const COMMENT_AUTHOR_PLACEHOLDER = '__GRIST_USER_NAME__';

/**
 * État unique du widget. Aucune donnée métier n’est stockée dans le DOM.
 */
const STATE = {
    records: [],
    people: {
        items: [],
        byId: new Map(),
        loadedFor: null
    },
    labels: {
        items: [],
        byId: new Map(),
        loadedFor: null
    },
    attachments: {
        meta: new Map(),
        metaLoaded: false,
        readToken: null,
        readTokenAt: 0
    },
    notesTimers: new Map(),
    config: {
        saveTimer: null,
        saving: false
    }
};

/** Files d’écriture sérialisées par ressource et par carte. */
const SAVE_QUEUES = {
    people: new Map(),
    labels: new Map(),
    checklists: new Map(),
    links: new Map(),
    comments: new Map(),
    notes: new Map()
};

const ETIQUETTE_COLOR_PALETTE = Object.freeze({
    'vert clair': {
        background: '#BAF3DB',
        text: '#000000'
    },
    'jaune clair': {
        background: '#F5E989',
        text: '#000000'
    },
    'orange clair': {
        background: '#FCE4A6',
        text: '#000000'
    },
    'rouge clair': {
        background: '#FFD5D2',
        text: '#000000'
    },
    'violet clair': {
        background: '#EED7FC',
        text: '#000000'
    },
    'bleu clair': {
        background: '#CFE1FD',
        text: '#000000'
    },
    'bleu ciel clair': {
        background: '#C6EDFB',
        text: '#000000'
    },
    'vert citron clair': {
        background: '#D3F1A7',
        text: '#000000'
    },
    'rose clair': {
        background: '#FDD0EC',
        text: '#000000'
    },
    'noir clair': {
        background: '#DDDEE1',
        text: '#000000'
    },

    'vert': {
        background: '#4BCE97',
        text: '#000000'
    },
    'jaune': {
        background: '#EED12B',
        text: '#000000'
    },
    'orange': {
        background: '#FCA700',
        text: '#000000'
    },
    'rouge': {
        background: '#F87168',
        text: '#000000'
    },
    'violet': {
        background: '#C97CF4',
        text: '#000000'
    },
    'bleu': {
        background: '#669DF1',
        text: '#000000'
    },
    'bleu ciel': {
        background: '#6CC3E0',
        text: '#000000'
    },
    'vert citron': {
        background: '#94C748',
        text: '#000000'
    },
    'rose': {
        background: '#E774BB',
        text: '#000000'
    },
    'noir': {
        background: '#8C8F97',
        text: '#000000'
    }
});

// ========== INITIALISATION ==========

window.addEventListener('load', async () => {
    widget = new WidgetSDK();
    translate = await widget.loadTranslations(['widget.js']);

    widget.configureOptions(
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

            WidgetSDK.newItem('cardrotation', false, 'Inclinaison des cartes', 'Incliner légèrement les cartes. Désactivé par défaut.', '2 — Affichage des cartes'),
            WidgetSDK.newItem('compact', false, 'Mode compact', 'Réduire les espacements et la hauteur des cartes.', '2 — Affichage des cartes'),
            WidgetSDK.newItem('showlabels', true, 'Afficher les étiquettes', 'Afficher les étiquettes colorées sur les cartes.', '2 — Affichage des cartes'),
            WidgetSDK.newItem('showmembers', true, 'Afficher les membres', 'Afficher les bulles d’initiales des membres sur les cartes.', '2 — Affichage des cartes'),
            WidgetSDK.newItem('showresponsables', true, 'Afficher les responsables', 'Afficher les responsables avec une bordure renforcée sur les cartes.', '2 — Affichage des cartes'),
            WidgetSDK.newItem('showdeadline', true, 'Afficher l’échéance', 'Afficher la date limite sur les cartes.', '2 — Affichage des cartes'),
            WidgetSDK.newItem('showindicators', true, 'Afficher les indicateurs', 'Afficher le nombre de pièces jointes et de commentaires.', '2 — Affichage des cartes'),
            WidgetSDK.newItem('showchecklistprogress', true, 'Afficher la progression checklist', 'Afficher le nombre d’éléments cochés sur les cartes.', '2 — Affichage des cartes'),
            WidgetSDK.newItem('defaultcardcolor', '#FFFFD1', 'Couleur par défaut', 'Couleur utilisée lorsqu’aucune couleur personnalisée n’est enregistrée.', '2 — Affichage des cartes'),

            WidgetSDK.newItem('showchecklist', true, 'Checklist', 'Afficher la checklist avancée dans la fiche.', '3 — Fiche descriptive'),
            WidgetSDK.newItem('showattachments', true, 'Pièces jointes', 'Afficher la section des pièces jointes dans la fiche.', '3 — Fiche descriptive'),
            WidgetSDK.newItem('showcomments', true, 'Commentaires', 'Afficher la section des commentaires dans la fiche.', '3 — Fiche descriptive'),
            WidgetSDK.newItem('showmetadata', true, 'Informations de suivi', 'Afficher les lignes « Créé le » et « Modifié le » en bas de la fiche.', '3 — Fiche descriptive'),
            WidgetSDK.newItem('autoclosemenus', true, 'Fermer les menus automatiquement', 'Fermer les sélecteurs multiples lorsqu’on clique ailleurs.', '3 — Fiche descriptive'),

            WidgetSDK.newItem('readonly', false, 'Lecture seule', 'Désactiver toutes les modifications depuis le widget.', '4 — Comportement'),
            WidgetSDK.newItem('hideedit', false, 'Masquer la fiche', 'Ne pas ouvrir la fiche descriptive lors d’un clic sur une carte.', '4 — Comportement'),
            WidgetSDK.newItem('gristeditcard', false, 'Double-clic vers la fiche Grist', 'Ouvrir la fiche native de Grist lors d’un double-clic.', '4 — Comportement'),
            WidgetSDK.newItem(
                'archivestatus',
                'Archives',
                'Liste d’archives',
                'Nom du statut dans lequel déplacer les cartes archivées.',
                '4 — Comportement'
            )
        ],
        '#config-view',
        '#main-view',
        {onOptChange: optionsChanged, onOptLoad: optionsChanged}
    );

    widget.initMetaData();

    widget.ready({
        requiredAccess: 'full',
        allowSelectBy: true,
        columns: [
            {name: 'STATUT', title: 'Statut', description: 'Colonne du Kanban', type: 'Choice', strictType: true},
            {name: 'DESCRIPTION', title: 'Nom de la tâche', description: 'Nom principal de la tâche', type: 'Any'},
            {name: 'DESCRIPTION_DISPLAY', title: 'Affichage de la tâche', description: 'Contenu personnalisé facultatif affiché sur la carte', type: 'Any', optional: true},
            {name: 'NOTES', title: 'Notes', description: 'Notes enrichies enregistrées en HTML sécurisé', type: 'Text', strictType: true, optional: true},
            {name: 'DEADLINE', title: 'Échéance', description: 'Date limite de la carte', type: 'Date', optional: true},
            {name: 'ORDRE', title: 'Ordre manuel', description: 'Nombre utilisé pour conserver exactement la position des cartes', type: 'Numeric', strictType: true, optional: true},
            {name: 'MEMBRES', title: 'Membres', description: 'Toutes les personnes qui participent à la carte', type: 'RefList', strictType: true, optional: true},
            {name: 'RESPONSABLE', title: 'Responsables', description: 'Responsables principaux de la carte', type: 'RefList', strictType: true, optional: true},
            {name: 'ETIQUETTES', title: 'Étiquettes', description: 'Étiquettes multiples référencées depuis une table dédiée', type: 'RefList', strictType: true, optional: true},
            {name: 'CHECKLIST', title: 'Checklist', description: 'Checklists titrées stockées en JSON', type: 'Text', strictType: true, optional: true},
            {name: 'PIECES_JOINTES', title: 'Pièces jointes', description: 'Fichiers et images associés à la tâche', type: 'Attachments', strictType: true, optional: true},
            {name: 'LIENS', title: 'Liens', description: 'Liens avec texte d’affichage stockés en JSON', type: 'Text', strictType: true, optional: true},
            {name: 'COMMENTAIRES', title: 'Commentaires', description: 'Commentaires du widget stockés en JSON', type: 'Text', strictType: true, optional: true},
            {name: 'COULEUR', title: 'Couleur de carte', description: 'Code hexadécimal choisi depuis le widget', type: 'Text', strictType: true, optional: true},
            {name: 'CREE_PAR', title: 'Créé par', type: 'Any', optional: true},
            {name: 'CREE_LE', title: 'Date de création', type: 'DateTime', optional: true},
            {name: 'DERNIERE_MISE_A_JOUR', title: 'Dernière mise à jour', description: 'Date technique affichée dans le suivi', type: 'DateTime', optional: true},
            {name: 'MODIFIE_PAR', title: 'Modifié par', description: 'Nom de la dernière personne ayant modifié la tâche', type: 'Text', strictType: true, optional: true}
        ]
    });

    // mapRef:true fournit les libellés et les rowId pour MEMBRES, RESPONSABLE et ETIQUETTES.
    widget.onRecords(afficherKanban, {
        expandRefs: false,
        keepEncoded: false,
        mapRef: true
    });

    widget.isLoaded().then(() => {
        widget.initDone = true;
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

async function chargerPersonnes(force = false) {
    const directoryMappingKey = widget?.map?.MEMBRES
        ? 'MEMBRES'
        : (widget?.map?.RESPONSABLE ? 'RESPONSABLE' : null);

    if (!directoryMappingKey || !widget?.col?.[directoryMappingKey]) {
        viderCachePersonnes();
        return;
    }

    const colMeta = widget.col[directoryMappingKey];
    const cacheKey = `${directoryMappingKey}:${colMeta.type}:${colMeta.visibleCol}`;

    if (
        !force &&
        STATE.people.loadedFor === cacheKey &&
        STATE.people.items.length > 0
    ) {
        return;
    }

    try {
        const reference = await chargerTableReference(colMeta);
        const dataColumns = reference.dataColumns;

        const initialsColumnId = trouverColonneParNoms(
            dataColumns,
            ['initiales', 'initiale', 'initials', 'abreviation', 'abréviation', 'sigle']
        ) || colonneSuivante(dataColumns, reference.visibleColumnId);

        const initialsValues = initialsColumnId && Array.isArray(reference.table[initialsColumnId])
            ? reference.table[initialsColumnId]
            : [];

        STATE.people.items = reference.ids
            .map((rowId, index) => {
                const label = valeurTexte(reference.labels[index]).trim();
                const initials = nettoyerInitiales(initialsValues[index]) || calculerInitiales(label);

                return {
                    id: Number(rowId),
                    label,
                    initials,
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
                a.label.localeCompare(b.label, widget?.cultureFull || 'fr-FR', {sensitivity: 'base'})
            );

        STATE.people.byId = new Map(
            STATE.people.items.map((person) => [person.id, person])
        );
        STATE.people.loadedFor = cacheKey;
    } catch (error) {
        viderCachePersonnes();
        console.error('Impossible de charger la table des membres :', error);
    }
}

function viderCachePersonnes() {
    STATE.people.items = [];
    STATE.people.byId = new Map();
    STATE.people.loadedFor = null;
}

async function chargerEtiquettes(force = false) {
    if (!widget?.map?.ETIQUETTES || !widget?.col?.ETIQUETTES) {
        viderCacheEtiquettes();
        return;
    }

    const colMeta = widget.col.ETIQUETTES;
    const cacheKey = `${colMeta.type}:${colMeta.visibleCol}`;

    if (!force && STATE.labels.loadedFor === cacheKey && STATE.labels.items.length > 0) {
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

        STATE.labels.items = reference.ids
            .map((rowId, index) => {
                const label = valeurTexte(reference.labels[index]).trim();
                const colorChoice = valeurTexte(colorValues[index]).trim();
                const paletteColor = obtenirCouleurEtiquetteDepuisChoix(
                    colorChoice
                );
                const explicitHex = normaliserCouleur(colorChoice);
                const color =
                    paletteColor?.background ||
                    explicitHex ||
                    couleurEtiquetteParDefaut(label || rowId);
                const textColor =
                    paletteColor?.text ||
                    couleurTexteContraste(color);

                return {
                    id: Number(rowId),
                    label,
                    color,
                    textColor,
                    colorChoice
                };
            })
            .filter((item) => Number.isInteger(item.id) && item.id > 0 && item.label && item.label !== '#KeyError')
            .sort((a, b) => a.label.localeCompare(b.label, widget?.cultureFull || 'fr-FR', {sensitivity: 'base'}));

        STATE.labels.byId = new Map(STATE.labels.items.map((item) => [item.id, item]));
        STATE.labels.loadedFor = cacheKey;
    } catch (error) {
        viderCacheEtiquettes();
        console.error('Impossible de charger la table des étiquettes :', error);
    }
}

function viderCacheEtiquettes() {
    STATE.labels.items = [];
    STATE.labels.byId = new Map();
    STATE.labels.loadedFor = null;
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

function normaliserNomCouleurEtiquette(value) {
    return valeurTexte(value)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .replace(/\s+/g, ' ')
        .toLocaleLowerCase('fr-FR');
}

function obtenirCouleurEtiquetteDepuisChoix(value) {
    const key = normaliserNomCouleurEtiquette(value);
    return ETIQUETTE_COLOR_PALETTE[key] || null;
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
    if (STATE.attachments.metaLoaded && !force) {
        return;
    }

    STATE.attachments.meta = new Map();
    STATE.attachments.metaLoaded = true;

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

            STATE.attachments.meta.set(id, {
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
    STATE.records = Array.isArray(records) ? records : [];

    await Promise.all([
        chargerPersonnes(),
        chargerEtiquettes()
    ]);

    const container = document.getElementById('conteneur-kanban');
    if (!container) {
        return;
    }

    container.innerHTML = '';

    const statuses = await widget.col.STATUT.getChoices();
    if (!Array.isArray(statuses) || statuses.length === 0) {
        container.innerHTML = `<div class="kanban-message">${echapperHtml(translate('No choice available in the Status column'))}</div>`;
        return;
    }

    statuses.forEach((status, index) => {
        const column = creerColonneKanban(status, index);
        if (column) {
            container.appendChild(column);
        }
    });

    STATE.records.forEach((todo) => {
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
    window.clearTimeout(STATE.config.saveTimer);
    afficherEtatSauvegardeConfiguration('saving', 'Sauvegarde…');

    STATE.config.saveTimer = window.setTimeout(
        sauvegarderConfigurationSansFermer,
        350
    );
}

async function sauvegarderConfigurationSansFermer() {
    if (
        STATE.config.saving ||
        !widget?._parameters ||
        !widget?._config ||
        widget._config.style.display === 'none'
    ) {
        return;
    }

    STATE.config.saving = true;

    try {
        widget.opt = await widget.readOptionValues(
            widget._parameters,
            widget._config,
            widget.opt
        );

        // Même stockage Grist que le bouton « Appliquer » du WidgetSDK.
        await grist.widgetApi.setOption(
            'options',
            JSON.parse(JSON.stringify(widget.opt))
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
        STATE.config.saving = false;
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
    await widget.isMapped();
    await afficherKanban(STATE.records);
}

async function mappingChanged() {
    viderCachePersonnes();
    viderCacheEtiquettes();
    STATE.attachments.metaLoaded = false;
    STATE.attachments.readToken = null;

    await Promise.all([
        chargerPersonnes(true),
        chargerEtiquettes(true)
    ]);

    await afficherKanban(STATE.records);
}

function creerColonneKanban(status, index) {
    const option = getColumnOption(index);
    if (option.hidecolumn) {
        return null;
    }

    const statusText = valeurTexte(status);
    const column = document.createElement('section');
    column.className = `colonne-kanban${(!option.addbutton && !widget.opt.compact) ? ' colonne-nobouton' : ''}`;
    column.id = statusText;

    if (localStorage.getItem(getColumnStorageKey(statusText)) === 'true') {
        column.classList.add('collapsed');
    }

    const background = widget.col.STATUT.getColor(statusText) ?? BACKCOLOR;
    const color = widget.col.STATUT.getTextColor(statusText) ?? TEXTCOLOR;
    const encodedStatus = encoderAttribut(statusText);

    column.innerHTML = `
        <div class="entete-colonne" style="background-color:${background};color:${color}">
            <div class="titre-statut">${echapperHtml(statusText)} <span class="compteur-colonne">(0)</span></div>
            <div class="actions-colonne">
                ${(option.addbutton && !widget.opt.readonly)
                    ? `<button type="button" class="bouton-ajouter-entete ${widget.opt.compact ? 'compact' : ''}" onclick="creerNouvelleTache(decodeURIComponent('${encodedStatus}'))" aria-label="${echapperAttribut(translate('Add a new task'))}">+</button>`
                    : ''}
                <button type="button" class="bouton-toggle" onclick="toggleColonne(this.closest('.colonne-kanban'), event)" aria-label="Replier ou déplier">⇄</button>
            </div>
        </div>
        ${(option.addbutton && !widget.opt.readonly)
            ? `<button type="button" class="bouton-ajouter ${widget.opt.compact ? 'compact' : ''}" onclick="creerNouvelleTache(decodeURIComponent('${encodedStatus}'))">+ ${echapperHtml(translate('Add a new task'))}</button>`
            : ''}
        <div class="contenu-colonne" data-statut="${echapperAttribut(statusText)}" data-isdone="${option.isdone ? 'true' : 'false'}"></div>
    `;

    return column;
}

function creerCarteTodo(todo) {
    const card = document.createElement('article');
    const rotateCards = widget.opt.cardrotation === true;
    card.className = `carte${rotateCards ? '' : ' norotate'}${widget.opt.compact ? ' compact' : ''}`;
    card.dataset.todoId = String(todo.id);
    card.dataset.lastUpdate = serialiserDate(todo.DERNIERE_MISE_A_JOUR);
    card.dataset.deadline = serialiserDate(todo.DEADLINE);
    card.dataset.order = valeurOrdreCarte(todo.ORDRE);

    appliquerCouleurCarte(card, todo.COULEUR);

    const deadline = todo.DEADLINE ? formatDate(todo.DEADLINE) : '';
    const membres = obtenirMembres(todo);
    const responsables = obtenirResponsables(todo);
    const etiquettes = obtenirEtiquettes(todo);
    const checklist = parserChecklists(todo.CHECKLIST)
        .flatMap((group) => group.items || []);
    const checklistDone = checklist.filter((item) => item.done).length;
    const attachmentCount = normaliserIdsListe(todo.PIECES_JOINTES).length;
    const linkCount = parserLiens(todo.LIENS).length;
    const commentCount = parserCommentaires(todo.COMMENTAIRES).length;

    const description = todo.DESCRIPTION_DISPLAY
        ? String(todo.DESCRIPTION_DISPLAY)
        : echapperHtml(valeurTexte(todo.DESCRIPTION) || translate('No description'));

    const labelsHtml = etiquettes
        .map((item) => construireBadgeEtiquette(item))
        .join('');

    const teamHtml = construireEquipeCarte(membres, responsables);

    const columnOption = getColumnOptionByStatus(todo.STATUT);
    const deadlineTimestamp = toTimestamp(todo.DEADLINE);
    const isLate = deadlineTimestamp !== null
        && deadlineTimestamp < Date.now()
        && deadlineTimestamp < DEADLINE_PRIORITE.getTime();

    const showLabels = widget.opt.showlabels !== false;
    const showMembers = widget.opt.showmembers !== false;
    const showResponsables = widget.opt.showresponsables !== false;
    const showDeadline = widget.opt.showdeadline !== false;
    const showIndicators = widget.opt.showindicators !== false;
    const showChecklistProgress = widget.opt.showchecklistprogress !== false;
    const showTeam = (showMembers || showResponsables) && teamHtml;

    const indicatorsHtml = `
        ${(showChecklistProgress && checklist.length)
            ? `<span title="${checklistDone} élément(s) terminé(s) sur ${checklist.length}">☑ ${checklistDone}/${checklist.length}</span>`
            : ''}
        ${(showIndicators && (attachmentCount + linkCount))
            ? `<span title="${attachmentCount} fichier(s) et ${linkCount} lien(s)">📎 ${attachmentCount + linkCount}</span>`
            : ''}
        ${(showIndicators && commentCount)
            ? `<span title="${commentCount} commentaire(s)">💬 ${commentCount}</span>`
            : ''}
    `;

    card.innerHTML = `
        ${(showLabels && labelsHtml) ? `<div class="etiquettes-list">${labelsHtml}</div>` : ''}
        <div class="description">${description}</div>
        ${(showDeadline && deadline) ? `<div class="deadline${isLate ? ' late' : ''} truncate">📅 ${echapperHtml(deadline)}</div>` : ''}
        ${((showTeam) || indicatorsHtml.trim())
            ? `<div class="card-footer">
                <div class="card-indicators">${indicatorsHtml}</div>
                ${showTeam ? `<div class="card-team-stack" aria-label="Équipe de la carte">${teamHtml}</div>` : ''}
               </div>`
            : ''}
        ${columnOption?.isdone
            ? `<div class="tampon-termine" style="color:${widget.col.STATUT.getColor(todo.STATUT) ?? BACKCOLOR};">${echapperHtml(valeurTexte(todo.STATUT))}</div>`
            : ''}
    `;

    card.addEventListener('click', () => {
        grist.setCursorPos({rowId: todo.id});
        if (!widget.opt.hideedit) {
            togglePopupTodo(todo);
        }
    });

    card.addEventListener('dblclick', () => {
        grist.setCursorPos({rowId: todo.id});
        if (widget.opt.gristeditcard) {
            grist.commandApi.run('viewAsCard');
        } else if (!widget.opt.hideedit) {
            togglePopupTodo(todo);
        }
    });

    return card;
}

function construireEquipeCarte(membres, responsables) {
    const responsibleIds = new Set(
        responsables
            .map((person) => Number(person.id))
            .filter((id) => Number.isInteger(id) && id > 0)
    );

    const merged = [
        ...responsables.map((person) => ({...person, role: 'responsable'})),
        ...membres
            .filter((person) => !responsibleIds.has(Number(person.id)))
            .map((person) => ({...person, role: 'membre'}))
    ];

    const visible = merged.slice(0, 6);
    const remaining = merged.length - visible.length;

    return [
        ...visible.map((person) => construireAvatarCarte(person, person.role)),
        remaining > 0
            ? `<span class="card-team-more" title="${remaining} autre(s) membre(s)">+${remaining}</span>`
            : ''
    ].join('');
}

function construireAvatarCarte(person, role = 'membre') {
    const isResponsible = role === 'responsable';
    const roleLabel = isResponsible ? 'Responsable' : 'Membre';

    return `
        <span
            class="responsable-avatar ${isResponsible ? 'responsable-avatar-principal' : 'membre-avatar'}"
            style="background:${echapperAttribut(person.avatarColor)}"
            title="${echapperAttribut(`${roleLabel} : ${person.label}`)}"
            aria-label="${echapperAttribut(`${roleLabel} : ${person.label}`)}"
        >${echapperHtml(person.initials)}</span>
    `;
}

function construireBadgeEtiquette(item) {
    return `
        <span
            class="etiquette-badge"
            style="background:${echapperAttribut(item.color)};color:${echapperAttribut(item.textColor)}"
            title="${echapperAttribut(item.colorChoice ? `${item.label} — ${item.colorChoice}` : item.label)}"
        >${echapperHtml(item.label)}</span>
    `;
}

function appliquerCouleurCarte(card, rawColor) {
    const color = normaliserCouleur(rawColor)
        || normaliserCouleur(widget.opt?.defaultcardcolor)
        || '#FFFFD1';
    card.style.backgroundColor = color;
}

// ========== GLISSER-DÉPOSER ET TRI ==========

function initialiserTriEtGlisserDeposer() {
    document.querySelectorAll('.contenu-colonne').forEach((column) => {
        trierTodo(column);

        if (widget.opt.readonly || typeof Sortable !== 'function') {
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
                const cardId = Number(event.item.dataset.todoId);

                const targetIds = Array.from(
                    event.to.querySelectorAll('.carte')
                ).map((card) => Number(card.dataset.todoId));

                const sourceIds = event.from === event.to
                    ? []
                    : Array.from(
                        event.from.querySelectorAll('.carte')
                    ).map((card) => Number(card.dataset.todoId));

                try {
                    if (targetStatus !== sourceStatus) {
                        await mettreAJourChamp(cardId, 'STATUT', targetStatus);
                    }

                    if (
                        widget.map?.ORDRE &&
                        !widget.col.ORDRE.getIsFormula()
                    ) {
                        await sauvegarderOrdreListes(
                            targetIds,
                            sourceIds
                        );
                    } else {
                        /*
                         * Compatibilité avec les anciennes tables.
                         * Pour conserver exactement la position après rechargement,
                         * il faut mapper une colonne numérique sur ORDRE.
                         */
                        await mettreAJourOrdreParDeadline(event.to);
                        if (event.from !== event.to) {
                            await mettreAJourOrdreParDeadline(event.from);
                        }
                    }
                } catch (error) {
                    console.error(translate('Error during status update:'), error);
                    await afficherKanban(STATE.records);
                }

                mettreAJourCompteur(event.to.closest('.colonne-kanban'));
                if (event.from !== event.to) {
                    mettreAJourCompteur(event.from.closest('.colonne-kanban'));
                }
            }
        });
    });
}

async function sauvegarderOrdreListes(targetIds, sourceIds = []) {
    const uniqueLists = [];
    const seen = new Set();

    [targetIds, sourceIds].forEach((ids) => {
        const normalized = normaliserTableau(ids)
            .map(Number)
            .filter((id) => Number.isInteger(id) && id > 0);

        const key = normalized.join(',');
        if (normalized.length > 0 && !seen.has(key)) {
            seen.add(key);
            uniqueLists.push(normalized);
        }
    });

    for (const ids of uniqueLists) {
        await sauvegarderOrdreIds(ids);
    }
}

async function sauvegarderOrdreIds(ids) {
    if (
        !widget.map?.ORDRE ||
        widget.col.ORDRE.getIsFormula()
    ) {
        return;
    }

    const records = ids.map((rowId, index) => {
        const order = (index + 1) * 1000;
        const record = trouverRecord(rowId);
        const card = trouverCarteParId(rowId);

        if (record) {
            record.ORDRE = order;
        }
        if (card) {
            card.dataset.order = String(order);
        }

        return widget.formatRecord(rowId, {ORDRE: order});
    });

    if (records.length > 0) {
        await widget.updateRecords(records);
    }
}

async function mettreAJourOrdreParDeadline(column) {
    if (!widget.map?.DEADLINE || !column) {
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
        return widget.formatRecord(card.dataset.todoId, {DEADLINE: deadline});
    });

    await widget.updateRecords(records);
}

function trierTodo(container) {
    if (!container) {
        return;
    }

    const isDone = container.dataset.isdone === 'true';
    const cards = Array.from(container.children);

    cards.sort((a, b) => {
        let delta = 0;

        if (widget.map?.ORDRE) {
            delta = ordreTriCarte(a.dataset.order)
                - ordreTriCarte(b.dataset.order);
        } else if (widget.map?.DEADLINE) {
            if (isDone) {
                delta = toSortableTimestamp(b.dataset.lastUpdate, 0)
                    - toSortableTimestamp(a.dataset.lastUpdate, 0);
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

function valeurOrdreCarte(value) {
    const number = Number(value);
    return Number.isFinite(number) ? String(number) : '';
}

function ordreTriCarte(value) {
    const number = Number(value);
    return Number.isFinite(number)
        ? number
        : Number.MAX_SAFE_INTEGER;
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

    if (widget.opt.readonly) {
        fermerPopup();
        return;
    }

    document.querySelector('.carte.active')?.classList.remove('active');
    trouverCarteParId(todo.id)?.classList.add('active');

    const columnOption = getColumnOptionByStatus(todo.STATUT);
    const statusChoices = await widget.col.STATUT.getChoices();
    const background = widget.col.STATUT.getColor(todo.STATUT) ?? BACKCOLOR;
    const color = widget.col.STATUT.getTextColor(todo.STATUT) ?? TEXTCOLOR;

    popup.style.setProperty('--task-status-color', background);
    popup.style.setProperty('--task-status-text', color);
    popup.style.borderLeftColor = 'transparent';
    popup.dataset.statut = valeurTexte(todo.STATUT);
    popup.dataset.isdone = columnOption?.isdone ? 'true' : 'false';
    popup.dataset.currentTodo = String(todo.id);

    const title = popup.querySelector('.popup-title');
    const content = popup.querySelector('.popup-content');
    const header = popup.querySelector('.popup-header');
    const closeButton = popup.querySelector('.bouton-fermer');

    if (title) title.textContent = '';
    if (header) {
        header.style.backgroundColor = '';
        header.style.color = '';
    }
    if (closeButton) closeButton.style.color = '';
    if (!content) return;

    const notesDisabled = widget.map?.NOTES ? widget.col.NOTES.getIsFormula() : false;
    const descriptionDisabled = widget.col.DESCRIPTION.getIsFormula();
    const dynamicContent = construireContenuDynamiqueFiche(todo);
    const metadata = widget.opt.showmetadata !== false
        ? construireInfoCreation(todo)
        : '';

    const notesHtml = widget.map?.NOTES
        ? construireEditeurNotes(todo, notesDisabled)
        : '';
    const commentsHtml = widget.map?.COMMENTAIRES && widget.opt.showcomments !== false
        ? construireSectionCommentaires(todo)
        : '';

    const hasMainContent = Boolean(
        notesHtml || dynamicContent.checklists || commentsHtml
    );
    const hasContext = Boolean(dynamicContent.context);

    content.innerHTML = `
        <div class="task-detail-shell task-detail-v8" data-row-id="${Number(todo.id)}">
            <section class="task-hero">
                <div class="task-hero-accent" aria-hidden="true"></div>
                <div class="task-hero-copy">
                    <div class="task-title-meta">
                        <label
                            class="task-status-selector"
                            style="--status-background:${echapperAttribut(background)};--status-color:${echapperAttribut(color)}"
                            title="Changer la liste de la carte"
                        >
                            <span class="task-status-selector-icon" aria-hidden="true">▾</span>
                            <select
                                class="task-status-select"
                                aria-label="Liste de la carte"
                                onchange="changerStatutDepuisFiche(
                                    ${Number(todo.id)},
                                    this,
                                    event
                                )"
                            >
                                ${statusChoices.map((status) => `
                                    <option
                                        value="${echapperAttribut(status)}"
                                        ${valeurTexte(status) === valeurTexte(todo.STATUT) ? 'selected' : ''}
                                    >${echapperHtml(valeurTexte(status))}</option>
                                `).join('')}
                            </select>
                        </label>

                        ${columnOption?.isdone
                            ? '<span class="task-completed-pill">✓ Terminée</span>'
                            : ''
                        }
                    </div>
                    <textarea
                        class="task-detail-title auto-expand"
                        aria-label="Nom de la tâche"
                        placeholder="Nom de la tâche"
                        oninput="ajusterTextarea(this)"
                        onchange="mettreAJourTitreFiche(${Number(todo.id)}, this, event)"
                        ${descriptionDisabled ? 'disabled' : ''}
                    >${echapperHtml(valeurTexte(todo.DESCRIPTION))}</textarea>
                </div>
            </section>

            <div class="task-actions-dock">
                ${construireBarreActionsFiche(todo)}
            </div>
            ${construirePanneauxActionsFiche(todo)}

            ${hasContext ? `
                <div class="task-inline-context" aria-label="Informations actives de la carte">
                    ${dynamicContent.context}
                </div>
            ` : ''}

            ${hasMainContent ? `
                <main class="task-main-column task-main-column-full">
                    ${notesHtml}
                    ${dynamicContent.checklists}
                    ${commentsHtml}
                </main>
            ` : ''}

            ${metadata
                ? `<div class="task-detail-metadata">${metadata}</div>`
                : ''
            }

            <div class="popup-actions">
                <button
                    type="button"
                    class="popup-action-button bouton-archiver"
                    onclick="ouvrirPopupArchivage(${Number(todo.id)}, event)"
                    title="Archiver la tâche"
                    aria-label="Archiver la tâche"
                >🗃️</button>
            </div>
        </div>
    `;

    content.querySelectorAll('.auto-expand').forEach(ajusterTextarea);
    popup.classList.add('visible');
    popup.classList.remove('task-panel-open');

    initialiserChecklistsSortables(content);

    if (
        widget.map?.PIECES_JOINTES &&
        normaliserIdsListe(todo.PIECES_JOINTES).length > 0
    ) {
        await rafraichirPiecesJointes(todo.id);
    }
}

function construireBarreActionsFiche(todo) {
    const canChecklist = Boolean(widget.map?.CHECKLIST && !widget.col.CHECKLIST.getIsFormula());
    const canPeople = Boolean(
        (widget.map?.MEMBRES && !widget.col.MEMBRES.getIsFormula()) ||
        (widget.map?.RESPONSABLE && !widget.col.RESPONSABLE.getIsFormula())
    );
    const canResources = Boolean(
        (widget.map?.PIECES_JOINTES && !widget.col.PIECES_JOINTES.getIsFormula()) ||
        (widget.map?.LIENS && !widget.col.LIENS.getIsFormula())
    );

    return `
        <nav class="task-quick-actions" aria-label="Actions rapides">
            <button
                type="button"
                class="task-quick-button"
                data-panel-trigger="add"
                aria-expanded="false"
                onclick="ouvrirPanneauFiche('add', event)"
            ><span>＋</span><strong>Ajouter</strong></button>

            <button
                type="button"
                class="task-quick-button"
                data-panel-trigger="checklist"
                aria-expanded="false"
                onclick="ouvrirPanneauFiche('checklist', event)"
                ${canChecklist ? '' : 'disabled'}
            ><span>☑</span><strong>Checklist</strong></button>

            <button
                type="button"
                class="task-quick-button"
                data-panel-trigger="people"
                aria-expanded="false"
                onclick="ouvrirPanneauFiche('people', event)"
                ${canPeople ? '' : 'disabled'}
            ><span>👥</span><strong>Membres</strong></button>

            <button
                type="button"
                class="task-quick-button"
                data-panel-trigger="resources"
                aria-expanded="false"
                onclick="ouvrirPanneauFiche('resources', event)"
                ${canResources ? '' : 'disabled'}
            ><span>📎</span><strong>Pièce jointe</strong></button>
        </nav>
    `;
}

function construirePanneauxActionsFiche(todo) {
    const panels = [
        construireMenuAjouterFiche(todo),
        widget.map?.ETIQUETTES ? construirePanneauEtiquettesFiche(todo) : '',
        widget.map?.DEADLINE ? construirePanneauDateFiche(todo) : '',
        widget.map?.CHECKLIST ? construirePanneauNouvelleChecklist(todo) : '',
        (widget.map?.MEMBRES || widget.map?.RESPONSABLE) ? construirePanneauPersonnesFiche(todo) : '',
        (widget.map?.PIECES_JOINTES || widget.map?.LIENS) ? construirePanneauRessourcesFiche(todo) : '',
        widget.map?.COULEUR ? construirePanneauCouleurFiche(todo) : ''
    ].filter(Boolean).join('');

    return `
        <div class="task-action-layer">
            <div class="task-action-panels">${panels}</div>
        </div>
    `;
}

function construireMenuAjouterFiche(todo) {
    const entries = [];

    if (widget.map?.ETIQUETTES) {
        entries.push(['🏷️', 'Étiquettes', 'labels']);
    }
    if (widget.map?.DEADLINE) {
        entries.push(['📅', 'Dates', 'date']);
    }
    if (widget.map?.CHECKLIST) {
        entries.push(['☑', 'Checklist', 'checklist']);
    }
    if (widget.map?.MEMBRES || widget.map?.RESPONSABLE) {
        entries.push(['👥', 'Membres', 'people']);
    }
    if (widget.map?.PIECES_JOINTES || widget.map?.LIENS) {
        entries.push(['📎', 'Pièce jointe', 'resources']);
    }
    if (widget.map?.COULEUR) {
        entries.push(['🎨', 'Couleur de carte', 'color']);
    }

    return `
        <section class="task-action-panel task-add-menu" data-panel="add" hidden>
            <div class="task-panel-heading">
                <div><strong>Ajouter à la carte</strong><span>Choisissez un élément</span></div>
                <button type="button" onclick="fermerPanneauxFiche(event)" aria-label="Fermer">×</button>
            </div>
            <div class="task-add-grid">
                ${entries.map(([icon, label, panel]) => `
                    <button
                        type="button"
                        onclick="ouvrirPanneauFiche('${panel}', event, true)"
                    ><span>${icon}</span><strong>${echapperHtml(label)}</strong></button>
                `).join('') || '<div class="section-empty">Aucun champ supplémentaire n’est mappé.</div>'}
            </div>
        </section>
    `;
}

function construirePanneauEtiquettesFiche(todo) {
    const selected = new Set(obtenirIdsEtiquettes(todo));
    const disabled = widget.col.ETIQUETTES.getIsFormula();

    return `
        <section class="task-action-panel" data-panel="labels" hidden>
            <div class="task-panel-heading">
                <div><strong>Étiquettes</strong><span>Sélectionnez les étiquettes actives</span></div>
                <button type="button" onclick="fermerPanneauxFiche(event)" aria-label="Fermer">×</button>
            </div>
            <div class="task-panel-search">
                <input type="search" placeholder="Rechercher une étiquette…" oninput="filtrerPanneauFiche(this)">
            </div>
            <div class="task-panel-options" data-row-id="${Number(todo.id)}">
                ${STATE.labels.items.map((item) => `
                    <label class="task-check-option" data-search="${echapperAttribut(item.label.toLocaleLowerCase(widget.cultureFull))}">
                        <input
                            type="checkbox"
                            value="${item.id}"
                            ${selected.has(item.id) ? 'checked' : ''}
                            onchange="enregistrerEtiquettesDepuisPanneau(${Number(todo.id)}, this.closest('.task-action-panel'), event)"
                            ${disabled ? 'disabled' : ''}
                        >
                        <span class="task-option-label-color" style="background:${echapperAttribut(item.color)};color:${echapperAttribut(item.textColor)}">${echapperHtml(item.label)}</span>
                    </label>
                `).join('') || '<div class="section-empty">Aucune étiquette disponible.</div>'}
            </div>
            <div class="task-panel-status section-status" aria-live="polite"></div>
        </section>
    `;
}

function construirePanneauDateFiche(todo) {
    const disabled = widget.col.DEADLINE.getIsFormula();
    return `
        <section class="task-action-panel" data-panel="date" hidden>
            <div class="task-panel-heading">
                <div><strong>Date limite</strong><span>Ajoutez ou modifiez l’échéance de la carte</span></div>
                <button type="button" onclick="fermerPanneauxFiche(event)" aria-label="Fermer">×</button>
            </div>
            <div class="task-date-editor">
                <input
                    type="date"
                    value="${echapperAttribut(formatDateForInput(todo.DEADLINE))}"
                    onchange="mettreAJourProprieteFiche(${Number(todo.id)}, 'DEADLINE', this.value || null, 'date', event)"
                    ${disabled ? 'disabled' : ''}
                >
                <button
                    type="button"
                    onclick="mettreAJourProprieteFiche(${Number(todo.id)}, 'DEADLINE', null, 'date', event)"
                    ${disabled ? 'disabled' : ''}
                >Retirer la date</button>
            </div>
            <div class="task-panel-status section-status" aria-live="polite"></div>
        </section>
    `;
}

function construirePanneauNouvelleChecklist(todo) {
    const disabled = widget.col.CHECKLIST.getIsFormula();
    return `
        <section class="task-action-panel" data-panel="checklist" hidden>
            <div class="task-panel-heading">
                <div><strong>Nouvelle checklist</strong><span>Donnez-lui un titre avant de l’ajouter</span></div>
                <button type="button" onclick="fermerPanneauxFiche(event)" aria-label="Fermer">×</button>
            </div>
            <div class="task-create-checklist">
                <input
                    type="text"
                    class="new-checklist-title"
                    placeholder="Ex. Préparation de l’événement"
                    onkeydown="gererCreationChecklistClavier(${Number(todo.id)}, this, event)"
                    ${disabled ? 'disabled' : ''}
                >
                <button
                    type="button"
                    onclick="ajouterChecklistAvecTitre(${Number(todo.id)}, this, event)"
                    ${disabled ? 'disabled' : ''}
                >Ajouter la checklist</button>
            </div>
            <div class="task-panel-status section-status" aria-live="polite"></div>
        </section>
    `;
}

function construirePanneauPersonnesFiche(todo) {
    const selectedMembers = new Set(obtenirIdsMembres(todo));
    const selectedResponsables = new Set(obtenirIdsResponsables(todo));
    const membersDisabled =
        !widget.map?.MEMBRES ||
        widget.col.MEMBRES.getIsFormula();
    const responsablesDisabled =
        !widget.map?.RESPONSABLE ||
        widget.col.RESPONSABLE.getIsFormula();

    const orderedPeople = [...STATE.people.items].sort((a, b) => {
        const rankA = selectedResponsables.has(a.id)
            ? 0
            : selectedMembers.has(a.id)
                ? 1
                : 2;
        const rankB = selectedResponsables.has(b.id)
            ? 0
            : selectedMembers.has(b.id)
                ? 1
                : 2;

        return rankA !== rankB
            ? rankA - rankB
            : a.label.localeCompare(
                b.label,
                widget.cultureFull,
                {sensitivity: 'base'}
            );
    });

    return `
        <section
            class="task-action-panel task-people-panel"
            data-panel="people"
            data-row-id="${Number(todo.id)}"
            hidden
        >
            <div class="task-panel-heading">
                <div>
                    <strong>Équipe de la carte</strong>
                    <span>
                        Les changements sont enregistrés dès que vous cliquez
                        sur un rôle.
                    </span>
                </div>
                <button
                    type="button"
                    onclick="fermerPanneauxFiche(event)"
                    aria-label="Fermer"
                >×</button>
            </div>

            <div class="task-panel-search">
                <input
                    type="search"
                    placeholder="Rechercher une personne…"
                    oninput="filtrerPanneauFiche(this)"
                >
            </div>

            <div class="task-people-selection-summary" aria-live="polite">
                <span data-team-count="MEMBRES">
                    ${selectedMembers.size} membre(s)
                </span>
                <span data-team-count="RESPONSABLE">
                    ${selectedResponsables.size} responsable(s)
                </span>
            </div>

            <div class="task-people-roster">
                ${orderedPeople.map((person) => {
                    const isMember = selectedMembers.has(person.id);
                    const isResponsible = selectedResponsables.has(person.id);

                    return `
                        <article
                            class="task-person-card${isMember || isResponsible ? ' is-selected' : ''}"
                            data-search="${echapperAttribut(
                                person.label.toLocaleLowerCase(widget.cultureFull)
                            )}"
                            data-person-name="${echapperAttribut(person.label)}"
                        >
                            <div class="task-person-identity">
                                <span
                                    class="task-person-avatar"
                                    style="background:${echapperAttribut(person.avatarColor)}"
                                >${echapperHtml(person.initials)}</span>

                                <span class="task-person-copy">
                                    <strong>${echapperHtml(person.label)}</strong>
                                </span>
                            </div>

                            <div
                                class="task-person-role-actions"
                                aria-label="Rôles de ${echapperAttribut(person.label)}"
                            >
                                <button
                                    type="button"
                                    class="task-person-role-button task-person-role-member${isMember ? ' active' : ''}"
                                    data-role="MEMBRES"
                                    data-person-id="${person.id}"
                                    aria-pressed="${isMember ? 'true' : 'false'}"
                                    onclick="basculerRolePersonnePanneau(this, event)"
                                    ${membersDisabled ? 'disabled' : ''}
                                >
                                    <span aria-hidden="true">👤</span>
                                    <strong>Membre</strong>
                                </button>

                                <button
                                    type="button"
                                    class="task-person-role-button task-person-role-responsable${isResponsible ? ' active' : ''}"
                                    data-role="RESPONSABLE"
                                    data-person-id="${person.id}"
                                    aria-pressed="${isResponsible ? 'true' : 'false'}"
                                    onclick="basculerRolePersonnePanneau(this, event)"
                                    ${responsablesDisabled ? 'disabled' : ''}
                                >
                                    <span aria-hidden="true">◆</span>
                                    <strong>Responsable</strong>
                                </button>
                            </div>
                        </article>
                    `;
                }).join('') || `
                    <div class="section-empty">
                        Aucune personne disponible dans la table Membres.
                    </div>
                `}
            </div>

            <div
                class="task-panel-status task-people-live-status section-status"
                aria-live="polite"
            ></div>
        </section>
    `;
}

function construirePanneauRessourcesFiche(todo) {
    const canFiles = Boolean(widget.map?.PIECES_JOINTES && !widget.col.PIECES_JOINTES.getIsFormula());
    const canLinks = Boolean(widget.map?.LIENS && !widget.col.LIENS.getIsFormula());

    return `
        <section class="task-action-panel" data-panel="resources" hidden>
            <div class="task-panel-heading">
                <div><strong>Pièce jointe ou lien</strong><span>Ajoutez un fichier Grist ou un lien personnalisé</span></div>
                <button type="button" onclick="fermerPanneauxFiche(event)" aria-label="Fermer">×</button>
            </div>

            <div class="resource-add-tabs">
                ${canFiles ? `
                    <div class="resource-file-drop">
                        <span>📤</span>
                        <strong>Ajouter un fichier</strong>
                        <small>Image, PDF, document… 50 Mo maximum</small>
                        <button
                            type="button"
                            class="resource-file-button"
                            onclick="declencherSelecteurPiecesJointes(this, event)"
                        >Choisir un ou plusieurs fichiers</button>
                        <input
                            type="file"
                            class="resource-file-input"
                            multiple
                            hidden
                            onchange="ajouterPiecesJointes(${Number(todo.id)}, this, event)"
                        >
                    </div>
                ` : ''}

                ${canLinks ? `
                    <div class="resource-link-form">
                        <label>
                            <span>Texte d’affichage</span>
                            <input type="text" class="resource-link-label" placeholder="Ex. Brief du projet">
                        </label>
                        <label>
                            <span>Adresse du lien</span>
                            <input type="url" class="resource-link-url" placeholder="https://…">
                        </label>
                        <button type="button" onclick="ajouterLienFiche(${Number(todo.id)}, this, event)">Ajouter le lien</button>
                    </div>
                ` : ''}
            </div>
            <div class="task-panel-status section-status" id="attachments-status-${Number(todo.id)}" aria-live="polite"></div>
        </section>
    `;
}

function construirePanneauCouleurFiche(todo) {
    const current = normaliserCouleur(todo.COULEUR);
    const pickerValue = current || normaliserCouleur(widget.opt?.defaultcardcolor) || '#FFFFD1';
    const disabled = widget.col.COULEUR.getIsFormula();

    return `
        <section class="task-action-panel" data-panel="color" hidden>
            <div class="task-panel-heading">
                <div><strong>Couleur de la carte</strong><span>Choisissez une couleur personnalisée</span></div>
                <button type="button" onclick="fermerPanneauxFiche(event)" aria-label="Fermer">×</button>
            </div>
            <div class="task-color-editor color-field" data-row-id="${Number(todo.id)}">
                <input
                    type="color"
                    class="color-picker"
                    value="${echapperAttribut(pickerValue)}"
                    oninput="previsualiserCouleur(${Number(todo.id)}, this.value, this)"
                    onchange="mettreAJourCouleurFiche(${Number(todo.id)}, this.value, this, event)"
                    ${disabled ? 'disabled' : ''}
                >
                <input
                    type="text"
                    class="field-input color-value"
                    value="${echapperAttribut(current || '')}"
                    placeholder="#FFFFD1"
                    maxlength="7"
                    onchange="mettreAJourCouleurFiche(${Number(todo.id)}, this.value, this, event)"
                    ${disabled ? 'disabled' : ''}
                >
                <button
                    type="button"
                    onclick="mettreAJourCouleurFiche(${Number(todo.id)}, '', this, event)"
                    ${disabled ? 'disabled' : ''}
                >Réinitialiser</button>
            </div>
            <div class="task-panel-status section-status color-status" aria-live="polite"></div>
        </section>
    `;
}

function construireContenuDynamiqueFiche(todo) {
    const properties = [];
    const etiquettes = obtenirEtiquettes(todo);
    const membres = obtenirMembres(todo);
    const responsables = obtenirResponsables(todo);
    const customColor = normaliserCouleur(todo.COULEUR);
    const checklists = parserChecklists(todo.CHECKLIST);
    const attachmentIds = normaliserIdsListe(todo.PIECES_JOINTES);
    const links = parserLiens(todo.LIENS);

    if (etiquettes.length > 0) {
        properties.push(construireResumeEtiquettesFiche(todo, etiquettes));
    }
    if (todo.DEADLINE) {
        properties.push(construireResumeDateFiche(todo));
    }
    if (membres.length > 0 || responsables.length > 0) {
        properties.push(
            construireResumePersonnesFiche(todo, membres, responsables)
        );
    }
    if (customColor) {
        properties.push(construireResumeCouleurFiche(todo, customColor));
    }

    const contextBlocks = [];
    if (properties.length > 0) {
        contextBlocks.push(
            `<div class="task-property-grid">${properties.join('')}</div>`
        );
    }
    if (
        (attachmentIds.length > 0 || links.length > 0) &&
        widget.opt.showattachments !== false
    ) {
        contextBlocks.push(
            construireSectionRessources(todo, attachmentIds, links)
        );
    }

    return {
        context: contextBlocks.join(''),
        checklists: checklists.length > 0 && widget.opt.showchecklist !== false
            ? construireSectionsChecklists(todo, checklists)
            : ''
    };
}

function construireResumeEtiquettesFiche(todo, etiquettes) {
    return `
        <section class="task-compact-meta task-compact-labels">
            <span class="task-compact-meta-title">Étiquettes</span>
            <div class="task-compact-meta-content task-label-chips">
                ${etiquettes.map((item) => `
                    <span
                        class="etiquette-active"
                        style="background:${echapperAttribut(item.color)};color:${echapperAttribut(item.textColor)}"
                    >
                        <span>${echapperHtml(item.label)}</span>
                        ${widget.col.ETIQUETTES.getIsFormula() ? '' : `
                            <button
                                type="button"
                                onclick="retirerEtiquetteFiche(
                                    ${Number(todo.id)},
                                    ${Number(item.id)},
                                    event
                                )"
                                aria-label="Retirer ${echapperAttribut(item.label)}"
                            >×</button>
                        `}
                    </span>
                `).join('')}
                ${widget.col.ETIQUETTES.getIsFormula() ? '' : `
                    <button
                        type="button"
                        class="task-compact-add task-label-inline-add"
                        onclick="ouvrirPanneauFiche('labels', event, true)"
                        aria-label="Ajouter une étiquette"
                        title="Ajouter une étiquette"
                    >+</button>
                `}
            </div>
        </section>
    `;
}

function construireResumeDateFiche(todo) {
    const timestamp = toTimestamp(todo.DEADLINE);
    const isLate = timestamp !== null && timestamp < Date.now();

    return `
        <button
            type="button"
            class="task-compact-meta task-compact-date${isLate ? ' is-late' : ''}"
            onclick="ouvrirPanneauFiche('date', event, true)"
            title="Modifier la date limite"
        >
            <span class="task-compact-meta-title">Date</span>
            <span class="task-compact-date-value">
                <span aria-hidden="true">📅</span>
                <strong>${echapperHtml(formatDate(todo.DEADLINE))}</strong>
                ${isLate ? '<small>En retard</small>' : ''}
            </span>
        </button>
    `;
}

function construireResumePersonnesFiche(todo, membres, responsables) {
    const responsibleIds = new Set(
        responsables
            .map((person) => Number(person.id))
            .filter((id) => Number.isInteger(id) && id > 0)
    );

    const merged = [
        ...responsables.map((person) => ({
            ...person,
            role: 'responsable'
        })),
        ...membres
            .filter((person) =>
                !responsibleIds.has(Number(person.id))
            )
            .map((person) => ({
                ...person,
                role: 'membre'
            }))
    ];

    return `
        <section class="task-compact-meta task-compact-team">
            <span class="task-compact-meta-title">Équipe</span>
            <div class="task-compact-team-avatars">
                ${merged.map((person) => `
                    <span
                        class="task-compact-avatar${person.role === 'responsable' ? ' is-responsable' : ''}"
                        style="background:${echapperAttribut(person.avatarColor)}"
                        title="${echapperAttribut(
                            `${person.role === 'responsable' ? 'Responsable' : 'Membre'} : ${person.label}`
                        )}"
                    >${echapperHtml(person.initials)}</span>
                `).join('')}
                <button
                    type="button"
                    class="task-compact-add"
                    onclick="ouvrirPanneauFiche('people', event, true)"
                    aria-label="Ajouter un membre ou un responsable"
                    title="Modifier l’équipe"
                >+</button>
            </div>
        </section>
    `;
}

function construireResumeCouleurFiche(todo, color) {
    return `
        <button
            type="button"
            class="task-compact-meta task-compact-color"
            onclick="ouvrirPanneauFiche('color', event, true)"
            title="Modifier la couleur de la carte"
        >
            <span class="task-compact-meta-title">Couleur</span>
            <span
                class="task-compact-color-dot"
                style="background:${echapperAttribut(color)}"
                aria-hidden="true"
            ></span>
            <span class="task-compact-color-code">${echapperHtml(color)}</span>
        </button>
    `;
}

function ouvrirPanneauFiche(panelName, event, forceOpen = false) {
    event?.preventDefault();
    event?.stopPropagation();

    const popup = document.getElementById('popup-todo');
    const target = popup?.querySelector(
        `.task-action-panel[data-panel="${panelName}"]`
    );
    if (!popup || !target) {
        return;
    }

    const isAlreadyOpen = !target.hidden;
    popup.querySelectorAll('.task-action-panel').forEach((panel) => {
        panel.hidden = true;
    });
    popup.querySelectorAll('.task-quick-button').forEach((button) => {
        button.classList.remove('active');
        button.setAttribute('aria-expanded', 'false');
    });

    if (!isAlreadyOpen || forceOpen) {
        target.hidden = false;
        popup.classList.add('task-panel-open');

        if (panelName === 'people') {
            trierCartesPersonnesPanneau(target);
        }

        const trigger = popup.querySelector(
            `[data-panel-trigger="${panelName}"]`
        );
        trigger?.classList.add('active');
        trigger?.setAttribute('aria-expanded', 'true');

        window.setTimeout(() => {
            target.querySelector(
                'input:not([type="checkbox"]):not([type="file"]), textarea, button'
            )?.focus();
        }, 0);
    } else {
        fermerPanneauxFiche(event);
    }
}

function fermerPanneauxFiche(event) {
    event?.preventDefault();
    event?.stopPropagation();

    const popup = document.getElementById('popup-todo');
    popup?.querySelectorAll('.task-action-panel').forEach((panel) => {
        panel.hidden = true;
    });
    popup?.querySelectorAll('.task-quick-button').forEach((button) => {
        button.classList.remove('active');
        button.setAttribute('aria-expanded', 'false');
    });

    popup?.classList.remove('task-panel-open');
}

function normaliserTexteRecherche(value) {
    return valeurTexte(value)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toLocaleLowerCase(widget.cultureFull);
}

function filtrerPanneauFiche(input) {
    const panel = input?.closest('.task-action-panel');
    if (!panel) {
        return;
    }

    const query = normaliserTexteRecherche(input.value);

    panel.querySelectorAll('[data-search]').forEach((option) => {
        const haystack = normaliserTexteRecherche(option.dataset.search);
        const visible = query === '' || haystack.includes(query);
        option.hidden = !visible;
        option.style.display = visible ? '' : 'none';
    });
}

async function rafraichirFicheCourante(rowId, panelName = '') {
    const popup = document.getElementById('popup-todo');
    const content = popup?.querySelector('.popup-content');
    const scrollTop = content?.scrollTop || 0;
    const record = trouverRecord(rowId);
    if (!record) {
        return;
    }

    await togglePopupTodo(record);
    const refreshedContent = popup?.querySelector('.popup-content');
    if (refreshedContent) {
        refreshedContent.scrollTop = scrollTop;
    }
    if (panelName) {
        ouvrirPanneauFiche(panelName, null, true);
    }
}

async function changerStatutDepuisFiche(
    rowId,
    select,
    event
) {
    event?.preventDefault();
    event?.stopPropagation();

    const newStatus = valeurTexte(select?.value).trim();
    const record = trouverRecord(rowId);

    if (
        !newStatus ||
        !record ||
        newStatus === valeurTexte(record.STATUT)
    ) {
        return;
    }

    const previousStatus = valeurTexte(record.STATUT);
    select.disabled = true;

    try {
        const columnInfo = getColumnOptionByStatus(newStatus);
        if (columnInfo?.useconfetti) {
            triggerConfetti();
        }

        const data = {
            STATUT: newStatus,
            ...construireChampsSuivi()
        };

        if (
            widget.map?.ORDRE &&
            !widget.col.ORDRE.getIsFormula()
        ) {
            data.ORDRE = prochainOrdrePourStatut(newStatus);
        }

        await widget.updateRecords(widget.formatRecord(rowId, data));
        Object.assign(record, data);

        await afficherKanban(STATE.records);
        await rafraichirFicheCourante(rowId);
    } catch (error) {
        console.error('Impossible de changer la liste de la carte :', error);
        select.value = previousStatus;
        select.disabled = false;
    }
}

async function mettreAJourTitreFiche(rowId, input, event) {
    const value = valeurTexte(input?.value).trim();
    await mettreAJourChamp(rowId, 'DESCRIPTION', value, event);
    const cardDescription = trouverCarteParId(rowId)?.querySelector('.description');
    if (cardDescription) {
        cardDescription.textContent = value || translate('No description');
    }
}

async function mettreAJourProprieteFiche(rowId, field, value, panelName, event) {
    const panel = event?.target?.closest('.task-action-panel');
    const status = panel?.querySelector('.task-panel-status');
    try {
        if (status) {
            status.className = 'task-panel-status section-status saving';
            status.textContent = 'Enregistrement…';
        }
        await mettreAJourChamp(rowId, field, value, event);
        await rafraichirFicheCourante(rowId, panelName);
    } catch (error) {
        if (status) {
            status.className = 'task-panel-status section-status error';
            status.textContent = 'Impossible d’enregistrer.';
        }
    }
}

async function enregistrerEtiquettesDepuisPanneau(rowId, panel, event) {
    event?.stopPropagation();
    const status = panel?.querySelector('.task-panel-status');
    const ids = Array.from(panel.querySelectorAll('input[type="checkbox"]:checked'))
        .map((input) => Number(input.value))
        .filter((id) => STATE.labels.byId.has(id));

    try {
        if (status) {
            status.className = 'task-panel-status section-status saving';
            status.textContent = 'Enregistrement…';
        }
        await ecrireReferenceMultiple(rowId, 'ETIQUETTES', ids);
        mettreAJourEtiquettesLocales(rowId, ids);
        await rafraichirFicheCourante(rowId, 'labels');
    } catch (error) {
        if (status) {
            status.className = 'task-panel-status section-status error';
            status.textContent = 'Impossible d’enregistrer les étiquettes.';
        }
    }
}

async function retirerEtiquetteFiche(rowId, labelId, event) {
    event?.preventDefault();
    event?.stopPropagation();
    const record = trouverRecord(rowId);
    const ids = obtenirIdsEtiquettes(record).filter((id) => id !== Number(labelId));
    await ecrireReferenceMultiple(rowId, 'ETIQUETTES', ids);
    mettreAJourEtiquettesLocales(rowId, ids);
    await rafraichirFicheCourante(rowId);
}

async function basculerRolePersonnePanneau(button, event) {
    event?.preventDefault();
    event?.stopPropagation();

    if (!button || button.disabled) {
        return;
    }

    const panel = button.closest('.task-action-panel');
    const card = button.closest('.task-person-card');
    const personId = Number(button.dataset.personId);
    const role = valeurTexte(button.dataset.role);
    const active = !button.classList.contains('active');

    const memberButton = panel?.querySelector(
        `.task-person-role-button[data-role="MEMBRES"][data-person-id="${personId}"]`
    );
    const responsableButton = panel?.querySelector(
        `.task-person-role-button[data-role="RESPONSABLE"][data-person-id="${personId}"]`
    );

    definirEtatBoutonRole(button, active);

    if (role === 'RESPONSABLE') {
        /*
         * Responsable et membre évoluent ensemble :
         * cocher Responsable ajoute aussi Membre ;
         * décocher Responsable retire aussi Membre.
         */
        definirEtatBoutonRole(memberButton, active);
    } else if (
        role === 'MEMBRES' &&
        !active &&
        responsableButton?.classList.contains('active')
    ) {
        definirEtatBoutonRole(responsableButton, false);
    }

    const selected = Boolean(
        memberButton?.classList.contains('active') ||
        responsableButton?.classList.contains('active')
    );
    card?.classList.toggle('is-selected', selected);

    mettreAJourCompteursEquipePanneau(panel);
    await enregistrerEquipeInstantanement(
        Number(panel?.dataset.rowId),
        panel
    );
}

function definirEtatBoutonRole(button, active) {
    if (!button || button.disabled) {
        return;
    }

    button.classList.toggle('active', Boolean(active));
    button.setAttribute(
        'aria-pressed',
        active ? 'true' : 'false'
    );
}

function mettreAJourCompteursEquipePanneau(panel) {
    if (!panel) {
        return;
    }

    ['MEMBRES', 'RESPONSABLE'].forEach((role) => {
        const count = panel.querySelectorAll(
            `.task-person-role-button[data-role="${role}"].active`
        ).length;

        const target = panel.querySelector(
            `[data-team-count="${role}"]`
        );

        if (target) {
            target.textContent = role === 'MEMBRES'
                ? `${count} membre(s)`
                : `${count} responsable(s)`;
        }
    });
}

async function enregistrerEquipeInstantanement(rowId, panel) {
    if (
        !Number.isInteger(Number(rowId)) ||
        !panel
    ) {
        return;
    }

    const resolvedRowId = Number(rowId);
    const memberIds = Array.from(
        panel.querySelectorAll(
            '.task-person-role-button[data-role="MEMBRES"].active'
        )
    )
        .map((button) => Number(button.dataset.personId))
        .filter((id) =>
            Number.isInteger(id) &&
            STATE.people.byId.has(id)
        );

    const responsableIds = Array.from(
        panel.querySelectorAll(
            '.task-person-role-button[data-role="RESPONSABLE"].active'
        )
    )
        .map((button) => Number(button.dataset.personId))
        .filter((id) =>
            Number.isInteger(id) &&
            STATE.people.byId.has(id)
        );

    const status = panel.querySelector('.task-panel-status');
    const queueKey = `team:${resolvedRowId}`;
    const previous =
        SAVE_QUEUES.people.get(queueKey) ||
        Promise.resolve();

    if (status) {
        status.className =
            'task-panel-status task-people-live-status section-status saving';
        status.textContent = 'Enregistrement…';
    }

    const next = previous
        .catch(() => undefined)
        .then(async () => {
            if (
                widget.map?.MEMBRES &&
                !widget.col.MEMBRES.getIsFormula()
            ) {
                await ecrireReferenceMultiple(
                    resolvedRowId,
                    'MEMBRES',
                    memberIds
                );
                mettreAJourPersonnesLocales(
                    resolvedRowId,
                    'MEMBRES',
                    memberIds
                );
            }

            if (
                widget.map?.RESPONSABLE &&
                !widget.col.RESPONSABLE.getIsFormula()
            ) {
                await ecrireReferenceMultiple(
                    resolvedRowId,
                    'RESPONSABLE',
                    responsableIds
                );
                mettreAJourPersonnesLocales(
                    resolvedRowId,
                    'RESPONSABLE',
                    responsableIds
                );
            }

            mettreAJourResumeEquipeCompact(resolvedRowId);

            if (status?.isConnected) {
                status.className =
                    'task-panel-status task-people-live-status section-status saved';
                status.textContent = 'Équipe enregistrée.';
            }
        })
        .catch((error) => {
            console.error(
                'Impossible d’enregistrer l’équipe :',
                error
            );

            if (status?.isConnected) {
                status.className =
                    'task-panel-status task-people-live-status section-status error';
                status.textContent =
                    'Impossible d’enregistrer l’équipe.';
            }
        })
        .finally(() => {
            if (
                SAVE_QUEUES.people.get(queueKey) === next
            ) {
                SAVE_QUEUES.people.delete(queueKey);
            }
        });

    SAVE_QUEUES.people.set(queueKey, next);
    await next;
}

function mettreAJourResumeEquipeCompact(rowId) {
    const record = trouverRecord(rowId);
    const shell = document.querySelector(
        `.task-detail-shell[data-row-id="${Number(rowId)}"]`
    );

    if (!record || !shell) {
        return;
    }

    const membres = obtenirMembres(record);
    const responsables = obtenirResponsables(record);
    const current = shell.querySelector('.task-compact-team');

    if (membres.length === 0 && responsables.length === 0) {
        current?.remove();
        return;
    }

    const wrapper = document.createElement('div');
    wrapper.innerHTML =
        construireResumePersonnesFiche(
            record,
            membres,
            responsables
        );
    const replacement = wrapper.firstElementChild;

    if (current) {
        current.replaceWith(replacement);
        return;
    }

    let inlineContext = shell.querySelector(
        '.task-inline-context'
    );

    if (!inlineContext) {
        inlineContext = document.createElement('div');
        inlineContext.className = 'task-inline-context';

        const mainColumn = shell.querySelector(
            '.task-main-column-full'
        );
        mainColumn?.before(inlineContext);
    }

    let grid = inlineContext.querySelector(
        '.task-property-grid'
    );

    if (!grid) {
        grid = document.createElement('div');
        grid.className = 'task-property-grid';
        inlineContext.prepend(grid);
    }

    grid.appendChild(replacement);
}

function trierCartesPersonnesPanneau(panel) {
    const roster = panel?.querySelector(
        '.task-people-roster'
    );

    if (!roster) {
        return;
    }

    const cards = Array.from(
        roster.querySelectorAll('.task-person-card')
    );

    cards.sort((a, b) => {
        const rank = (card) => {
            if (
                card.querySelector(
                    '.task-person-role-responsable.active'
                )
            ) {
                return 0;
            }
            if (
                card.querySelector(
                    '.task-person-role-member.active'
                )
            ) {
                return 1;
            }
            return 2;
        };

        const rankA = rank(a);
        const rankB = rank(b);

        return rankA !== rankB
            ? rankA - rankB
            : valeurTexte(a.dataset.personName)
                .localeCompare(
                    valeurTexte(b.dataset.personName),
                    widget.cultureFull,
                    {sensitivity: 'base'}
                );
    });

    cards.forEach((card) => roster.appendChild(card));
}

function gererCreationChecklistClavier(rowId, input, event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        ajouterChecklistAvecTitre(rowId, input, event);
    }
}

async function ajouterChecklistAvecTitre(rowId, trigger, event) {
    event?.preventDefault();
    event?.stopPropagation();
    const panel = trigger.closest('.task-action-panel');
    const input = panel?.querySelector('.new-checklist-title');
    const status = panel?.querySelector('.task-panel-status');
    const title = valeurTexte(input?.value).trim();

    if (!title) {
        if (status) {
            status.className = 'task-panel-status section-status error';
            status.textContent = 'Saisissez un titre.';
        }
        input?.focus();
        return;
    }

    await enregistrerChecklistsEnFile(
        rowId,
        (checklists) => [
            ...checklists,
            {
                id: genererIdentifiant(),
                title,
                items: [],
                createdAt: new Date().toISOString()
            }
        ]
    );
    await rafraichirFicheCourante(rowId);
}

async function mettreAJourCouleurFiche(rowId, value, source, event) {
    const panel = source?.closest('.task-action-panel');
    const status = panel?.querySelector('.task-panel-status');
    const raw = valeurTexte(value).trim();
    const color = normaliserCouleur(raw);

    if (raw && !color) {
        if (status) {
            status.className = 'task-panel-status section-status error';
            status.textContent = 'Utilisez un code hexadécimal valide.';
        }
        return;
    }

    try {
        if (status) {
            status.className = 'task-panel-status section-status saving';
            status.textContent = 'Enregistrement…';
        }
        await mettreAJourChamp(rowId, 'COULEUR', color || null, event);
        const card = trouverCarteParId(rowId);
        if (card) {
            card.style.backgroundColor = color || normaliserCouleur(widget.opt?.defaultcardcolor) || '#FFFFD1';
        }
        await rafraichirFicheCourante(rowId, 'color');
    } catch (error) {
        if (status) {
            status.className = 'task-panel-status section-status error';
            status.textContent = 'Impossible d’enregistrer la couleur.';
        }
    }
}

// ========== NOTES ==========

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
                <div class="task-section-heading-copy">
                    <span class="task-section-icon task-section-icon-notes">≡</span>
                    <div>
                        <label class="field-label">Notes</label>
                        <small>Contexte, consignes et informations utiles</small>
                    </div>
                </div>
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
    const previous = SAVE_QUEUES.notes.get(resolvedRowId) || Promise.resolve();

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
            if (SAVE_QUEUES.notes.get(resolvedRowId) === next) {
                SAVE_QUEUES.notes.delete(resolvedRowId);
            }
        });

    SAVE_QUEUES.notes.set(resolvedRowId, next);
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

// ========== MEMBRES, STATE.people.items ET ÉTIQUETTES (REFLIST) ==========






function mettreAJourPersonnesLocales(
    rowId,
    mappingKey,
    ids
) {
    const record = trouverRecord(rowId);
    if (!record) return;

    record[`${mappingKey}_id`] = [...ids];
    record[mappingKey] = ids
        .map((id) => STATE.people.byId.get(id)?.label)
        .filter(Boolean);
}








function mettreAJourEtiquettesLocales(rowId, ids) {
    const record = trouverRecord(rowId);
    if (!record) return;

    record.ETIQUETTES_id = [...ids];
    record.ETIQUETTES = ids
        .map((id) => STATE.labels.byId.get(id)?.label)
        .filter(Boolean);
}

async function ecrireReferenceMultiple(rowId, mappingKey, ids) {
    const actualColumnId = widget.map?.[mappingKey];
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

// ========== CHECKLISTS TITRÉES ========== 

function parserChecklists(rawValue) {
    const raw = valeurTexte(rawValue).trim();
    if (!raw) {
        return [];
    }

    try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) {
            return [];
        }

        // Migration automatique de l’ancien format : tableau direct d’éléments.
        const looksLikeLegacyItems = parsed.length > 0 && parsed.every((item) => !Array.isArray(item?.items));
        if (looksLikeLegacyItems) {
            const legacyItems = parsed.map((item, index) => normaliserItemChecklist(item, index));
            return legacyItems.length > 0
                ? [{
                    id: 'legacy-checklist',
                    title: 'Checklist',
                    items: legacyItems,
                    createdAt: ''
                }]
                : [];
        }

        return parsed
            .map((checklist, index) => normaliserChecklist(checklist, index))
            .filter((checklist) => checklist.title || checklist.items.length > 0);
    } catch (error) {
        console.warn('Checklists illisibles, valeur ignorée :', error);
        return [];
    }
}

function normaliserChecklist(checklist, index = 0) {
    const items = Array.isArray(checklist?.items)
        ? checklist.items.map((item, itemIndex) => normaliserItemChecklist(item, itemIndex))
        : [];

    return {
        id: valeurTexte(checklist?.id) || `checklist-${index}-${genererIdentifiant()}`,
        title: valeurTexte(checklist?.title || checklist?.name).trim() || `Checklist ${index + 1}`,
        items,
        createdAt: valeurTexte(checklist?.createdAt)
    };
}

function normaliserItemChecklist(item, index = 0) {
    return {
        id: valeurTexte(item?.id) || `item-${index}-${genererIdentifiant()}`,
        text: valeurTexte(item?.text).trim(),
        done: Boolean(item?.done),
        memberIds: [...new Set(normaliserIdsListe(item?.memberIds || item?.members || []))],
        dueDate: normaliserDateChecklist(item?.dueDate),
        createdAt: valeurTexte(item?.createdAt)
    };
}

function normaliserDateChecklist(value) {
    const raw = valeurTexte(value).trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(raw) ? raw : '';
}

function construireSectionsChecklists(todo, checklists = parserChecklists(todo.CHECKLIST)) {
    if (!checklists.length) {
        return '';
    }

    const disabled = widget.col.CHECKLIST.getIsFormula();
    return `
        <div class="checklists-stack" data-row-id="${Number(todo.id)}">
            ${checklists.map((checklist) => construireBlocChecklist(checklist, todo.id, disabled)).join('')}
        </div>
    `;
}

function construireBlocChecklist(checklist, rowId, disabled) {
    const doneCount = checklist.items.filter((item) => item.done).length;
    const progress = checklist.items.length > 0
        ? Math.round((doneCount / checklist.items.length) * 100)
        : 0;

    return `
        <section
            class="detail-section checklist-section checklist-section-compact"
            data-row-id="${Number(rowId)}"
            data-checklist-id="${echapperAttribut(checklist.id)}"
            data-disabled="${disabled ? 'true' : 'false'}"
        >
            <div class="checklist-title-row">
                <div class="checklist-title-main">
                    <span class="task-section-icon task-section-icon-checklist">☑</span>
                    <input
                        type="text"
                        class="checklist-title-input"
                        value="${echapperAttribut(checklist.title)}"
                        onchange="renommerChecklist(${Number(rowId)}, '${echapperJs(checklist.id)}', this.value, event)"
                        ${disabled ? 'disabled' : ''}
                    >
                </div>
                <div class="checklist-title-actions">
                    <span class="checklist-compact-count">
                        ${doneCount}/${checklist.items.length}
                    </span>
                    <span class="checklist-progress-percent">${progress}%</span>
                    ${disabled ? '' : `
                        <button
                            type="button"
                            class="checklist-delete-list"
                            onclick="supprimerChecklist(${Number(rowId)}, '${echapperJs(checklist.id)}', event)"
                            title="Supprimer cette checklist"
                            aria-label="Supprimer cette checklist"
                        >×</button>
                    `}
                </div>
            </div>

            <div
                class="checklist-progress checklist-progress-compact"
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow="${progress}"
            >
                <span style="width:${progress}%"></span>
            </div>

            <div
                class="checklist-items"
                data-row-id="${Number(rowId)}"
                data-checklist-id="${echapperAttribut(checklist.id)}"
            >
                ${checklist.items.length
                    ? checklist.items
                        .map((item) =>
                            construireItemChecklist(
                                item,
                                checklist.id,
                                rowId,
                                disabled
                            )
                        )
                        .join('')
                    : '<div class="section-empty checklist-empty">Cette checklist est vide.</div>'
                }
            </div>

            ${disabled ? '' : `
                <div class="checklist-add-zone">
                    <button
                        type="button"
                        class="checklist-add-trigger"
                        onclick="ouvrirAjoutItemChecklist(this, event)"
                    >＋ Ajouter un élément</button>

                    <div class="checklist-add-composer" hidden>
                        <input
                            type="text"
                            class="checklist-add-input"
                            placeholder="Nom de l’élément…"
                            onkeydown="gererAjoutItemChecklistClavier(
                                ${Number(rowId)},
                                '${echapperJs(checklist.id)}',
                                this,
                                event
                            )"
                        >
                        <div class="checklist-add-actions">
                            <button
                                type="button"
                                class="checklist-add-confirm"
                                onclick="ajouterItemChecklist(
                                    ${Number(rowId)},
                                    '${echapperJs(checklist.id)}',
                                    this,
                                    event
                                )"
                            >Ajouter</button>
                            <button
                                type="button"
                                class="checklist-add-cancel"
                                onclick="fermerAjoutItemChecklist(this, event)"
                            >Annuler</button>
                        </div>
                    </div>
                </div>
            `}

            <div
                id="checklist-status-${Number(rowId)}-${encoderIdentifiantDom(checklist.id)}"
                class="section-status checklist-status"
                aria-live="polite"
            ></div>
        </section>
    `;
}

function construireItemChecklist(item, checklistId, rowId, disabled) {
    const assignedPeople = item.memberIds
        .map((id) => STATE.people.byId.get(id))
        .filter(Boolean);

    const overdue =
        !item.done &&
        item.dueDate &&
        new Date(`${item.dueDate}T23:59:59`).getTime() < Date.now();

    const dateTitle = item.dueDate
        ? `${overdue ? 'Échéance dépassée' : 'Date limite'} : ${formatDate(item.dueDate)}`
        : 'Ajouter une date limite';

    return `
        <article
            class="checklist-item checklist-item-compact${item.done ? ' done' : ''}${overdue ? ' overdue' : ''}"
            data-item-id="${echapperAttribut(item.id)}"
        >
            ${disabled ? '' : `
                <button
                    type="button"
                    class="checklist-drag-handle"
                    title="Déplacer"
                    aria-label="Déplacer"
                >⋮⋮</button>
            `}

            <label class="checklist-check">
                <input
                    type="checkbox"
                    ${item.done ? 'checked' : ''}
                    onchange="mettreAJourItemChecklist(
                        ${Number(rowId)},
                        '${echapperJs(checklistId)}',
                        '${echapperJs(item.id)}',
                        'done',
                        this.checked,
                        this,
                        event
                    )"
                    ${disabled ? 'disabled' : ''}
                >
                <span aria-hidden="true"></span>
            </label>

            <textarea
                class="checklist-item-text auto-expand"
                rows="1"
                oninput="ajusterTextarea(this)"
                onchange="mettreAJourItemChecklist(
                    ${Number(rowId)},
                    '${echapperJs(checklistId)}',
                    '${echapperJs(item.id)}',
                    'text',
                    this.value,
                    this,
                    event
                )"
                ${disabled ? 'disabled' : ''}
            >${echapperHtml(item.text)}</textarea>

            <div class="checklist-item-actions">
                ${construireDateItemChecklist(
                    item,
                    checklistId,
                    rowId,
                    disabled,
                    overdue,
                    dateTitle
                )}

                ${construireAssignationItemChecklist(
                    item,
                    checklistId,
                    rowId,
                    assignedPeople,
                    disabled
                )}

                ${disabled ? '' : `
                    <button
                        type="button"
                        class="checklist-delete"
                        onclick="supprimerItemChecklist(
                            ${Number(rowId)},
                            '${echapperJs(checklistId)}',
                            '${echapperJs(item.id)}',
                            event
                        )"
                        title="Supprimer l’élément"
                        aria-label="Supprimer l’élément"
                    >×</button>
                `}
            </div>
        </article>
    `;
}

function construireDateItemChecklist(
    item,
    checklistId,
    rowId,
    disabled,
    overdue,
    dateTitle
) {
    const summary = `
        <span class="checklist-date-summary-icon" aria-hidden="true">📅</span>
        ${item.dueDate
            ? `<span class="checklist-date-summary-value">${echapperHtml(
                formatDateChecklistCompact(item.dueDate)
            )}</span>`
            : ''
        }
    `;

    if (disabled) {
        return `
            <div
                class="checklist-date-picker readonly${overdue ? ' overdue' : ''}${item.dueDate ? ' has-date' : ''}"
                title="${echapperAttribut(dateTitle)}"
            >
                <span class="checklist-date-summary">${summary}</span>
            </div>
        `;
    }

    return `
        <details
            class="checklist-date-picker${overdue ? ' overdue' : ''}${item.dueDate ? ' has-date' : ''}"
        >
            <summary
                class="checklist-date-summary"
                title="${echapperAttribut(dateTitle)}"
                aria-label="${echapperAttribut(dateTitle)}"
            >${summary}</summary>

            <div
                class="checklist-date-menu"
                onclick="event.stopPropagation()"
            >
                <label class="checklist-date-field">
                    <span>Date limite</span>
                    <input
                        type="date"
                        value="${echapperAttribut(item.dueDate)}"
                        onchange="mettreAJourDateChecklistDepuisMenu(
                            ${Number(rowId)},
                            '${echapperJs(checklistId)}',
                            '${echapperJs(item.id)}',
                            this,
                            event
                        )"
                    >
                </label>

                <div class="checklist-date-quick-actions">
                    <button
                        type="button"
                        onclick="definirDateChecklistRapide(
                            ${Number(rowId)},
                            '${echapperJs(checklistId)}',
                            '${echapperJs(item.id)}',
                            0,
                            event
                        )"
                    >Aujourd’hui</button>

                    <button
                        type="button"
                        onclick="definirDateChecklistRapide(
                            ${Number(rowId)},
                            '${echapperJs(checklistId)}',
                            '${echapperJs(item.id)}',
                            1,
                            event
                        )"
                    >Demain</button>

                    ${item.dueDate ? `
                        <button
                            type="button"
                            class="checklist-date-remove"
                            onclick="effacerDateChecklist(
                                ${Number(rowId)},
                                '${echapperJs(checklistId)}',
                                '${echapperJs(item.id)}',
                                event
                            )"
                        >Retirer</button>
                    ` : ''}
                </div>
            </div>
        </details>
    `;
}

async function mettreAJourDateChecklistDepuisMenu(
    rowId,
    checklistId,
    itemId,
    input,
    event
) {
    event?.stopPropagation();

    await mettreAJourItemChecklist(
        rowId,
        checklistId,
        itemId,
        'dueDate',
        input?.value || '',
        input,
        event
    );
}

async function definirDateChecklistRapide(
    rowId,
    checklistId,
    itemId,
    offsetDays,
    event
) {
    event?.preventDefault();
    event?.stopPropagation();

    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + Number(offsetDays || 0));

    const value = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0')
    ].join('-');

    await mettreAJourItemChecklist(
        rowId,
        checklistId,
        itemId,
        'dueDate',
        value,
        null,
        event
    );
}

async function effacerDateChecklist(
    rowId,
    checklistId,
    itemId,
    event
) {
    event?.preventDefault();
    event?.stopPropagation();

    await mettreAJourItemChecklist(
        rowId,
        checklistId,
        itemId,
        'dueDate',
        '',
        null,
        event
    );
}

function construireAssignationItemChecklist(item, checklistId, rowId, assignedPeople, disabled) {
    const selected = new Set(item.memberIds);
    const summary = construireResumeAssignationChecklist(assignedPeople);

    if (disabled) {
        return `<div class="checklist-assignees readonly">${summary}</div>`;
    }

    return `
        <details class="checklist-assignees">
            <summary>${summary}</summary>
            <div class="checklist-assignees-menu">
                <div class="multi-toolbar">
                    <input type="search" class="multi-search" placeholder="Rechercher…" oninput="filtrerOptionsChecklist(this)" onclick="event.stopPropagation()">
                </div>
                <div class="multi-options">
                    ${STATE.people.items.map((person) => `
                        <label class="multi-option checklist-person-option" data-search="${echapperAttribut(person.label.toLocaleLowerCase(widget.cultureFull))}">
                            <input
                                type="checkbox"
                                value="${person.id}"
                                ${selected.has(person.id) ? 'checked' : ''}
                                onchange="mettreAJourAssignationsItemChecklist(${Number(rowId)}, '${echapperJs(checklistId)}', '${echapperJs(item.id)}', this.closest('.checklist-assignees'), event)"
                            >
                            <span class="responsable-option-avatar" style="background:${echapperAttribut(person.avatarColor)}">${echapperHtml(person.initials)}</span>
                            <span class="responsable-option-name">${echapperHtml(person.label)}</span>
                        </label>
                    `).join('') || '<div class="multi-empty">Aucun membre disponible</div>'}
                </div>
            </div>
        </details>
    `;
}

function construireResumeAssignationChecklist(people) {
    return people.length
        ? `
            <span class="checklist-assignee-avatars">
                ${people.slice(0, 4).map((person) => `
                    <span class="checklist-assignee-avatar" style="background:${echapperAttribut(person.avatarColor)}" title="${echapperAttribut(person.label)}">${echapperHtml(person.initials)}</span>
                `).join('')}
                ${people.length > 4 ? `<span class="checklist-assignee-more">+${people.length - 4}</span>` : ''}
            </span>
        `
        : '<span class="checklist-assignee-placeholder">👤 Attribuer</span>';
}

function filtrerOptionsChecklist(input) {
    const details = input.closest('.checklist-assignees');
    const query = input.value.trim().toLocaleLowerCase(widget.cultureFull);
    details?.querySelectorAll('.checklist-person-option').forEach((option) => {
        option.hidden = query !== '' && !valeurTexte(option.dataset.search).includes(query);
    });
}

function ouvrirAjoutItemChecklist(button, event) {
    event?.preventDefault();
    event?.stopPropagation();

    const zone = button.closest('.checklist-add-zone');
    const composer = zone?.querySelector('.checklist-add-composer');
    const input = composer?.querySelector('.checklist-add-input');

    if (!zone || !composer) {
        return;
    }

    button.hidden = true;
    composer.hidden = false;
    input?.focus();
}

function fermerAjoutItemChecklist(button, event) {
    event?.preventDefault();
    event?.stopPropagation();

    const zone = button.closest('.checklist-add-zone');
    const composer = zone?.querySelector('.checklist-add-composer');
    const trigger = zone?.querySelector('.checklist-add-trigger');
    const input = composer?.querySelector('.checklist-add-input');

    if (!zone || !composer || !trigger) {
        return;
    }

    if (input) {
        input.value = '';
    }

    composer.hidden = true;
    trigger.hidden = false;
}

function gererAjoutItemChecklistClavier(rowId, checklistId, input, event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        ajouterItemChecklist(rowId, checklistId, input, event);
    }
}

async function ajouterItemChecklist(rowId, checklistId, trigger, event) {
    event?.preventDefault();
    event?.stopPropagation();
    const section = trigger.closest('.checklist-section');
    const input = section?.querySelector('.checklist-add-input');
    const text = valeurTexte(input?.value).trim();

    if (!text) {
        input?.focus();
        afficherStatutChecklist(rowId, checklistId, 'error', 'Saisissez un intitulé.');
        return;
    }

    if (input) {
        input.value = '';
    }

    const updated = await enregistrerChecklistsEnFile(rowId, (checklists) =>
        checklists.map((checklist) => checklist.id === checklistId
            ? {
                ...checklist,
                items: [
                    ...checklist.items,
                    {
                        id: genererIdentifiant(),
                        text,
                        done: false,
                        memberIds: [],
                        dueDate: '',
                        createdAt: new Date().toISOString()
                    }
                ]
            }
            : checklist
        )
    );

    rafraichirBlocChecklist(rowId, checklistId, updated);
}

async function renommerChecklist(rowId, checklistId, value, event) {
    event?.stopPropagation();
    const title = valeurTexte(value).trim() || 'Checklist';
    await enregistrerChecklistsEnFile(rowId, (checklists) =>
        checklists.map((checklist) => checklist.id === checklistId
            ? {...checklist, title}
            : checklist
        )
    );
}

async function mettreAJourItemChecklist(rowId, checklistId, itemId, field, value, source, event) {
    event?.stopPropagation();
    const normalizedValue = field === 'done'
        ? Boolean(value)
        : field === 'dueDate'
            ? normaliserDateChecklist(value)
            : valeurTexte(value).trim();

    const updated = await enregistrerChecklistsEnFile(rowId, (checklists) =>
        checklists.map((checklist) => checklist.id === checklistId
            ? {
                ...checklist,
                items: checklist.items.map((item) => item.id === itemId
                    ? {...item, [field]: normalizedValue}
                    : item
                )
            }
            : checklist
        )
    );

    if (field === 'text') {
        afficherStatutChecklist(rowId, checklistId, 'saved', 'Élément enregistré.');
        return;
    }

    rafraichirBlocChecklist(rowId, checklistId, updated);
}

async function mettreAJourAssignationsItemChecklist(rowId, checklistId, itemId, details, event) {
    event?.stopPropagation();
    const memberIds = Array.from(details.querySelectorAll('input[type="checkbox"]:checked'))
        .map((input) => Number(input.value))
        .filter((id) => STATE.people.byId.has(id));

    await enregistrerChecklistsEnFile(rowId, (checklists) =>
        checklists.map((checklist) => checklist.id === checklistId
            ? {
                ...checklist,
                items: checklist.items.map((item) => item.id === itemId
                    ? {...item, memberIds}
                    : item
                )
            }
            : checklist
        )
    );

    const people = memberIds.map((id) => STATE.people.byId.get(id)).filter(Boolean);
    const summary = details.querySelector('summary');
    if (summary) {
        summary.innerHTML = construireResumeAssignationChecklist(people);
    }
    afficherStatutChecklist(rowId, checklistId, 'saved', 'Attribution enregistrée.');
}

async function supprimerItemChecklist(rowId, checklistId, itemId, event) {
    event?.preventDefault();
    event?.stopPropagation();
    const record = trouverRecord(rowId);
    const checklist = parserChecklists(record?.CHECKLIST).find((item) => item.id === checklistId);
    const item = checklist?.items.find((candidate) => candidate.id === itemId);

    if (item?.text && !window.confirm(`Supprimer « ${item.text} » ?`)) {
        return;
    }

    const updated = await enregistrerChecklistsEnFile(rowId, (checklists) =>
        checklists.map((candidate) => candidate.id === checklistId
            ? {...candidate, items: candidate.items.filter((item) => item.id !== itemId)}
            : candidate
        )
    );
    rafraichirBlocChecklist(rowId, checklistId, updated);
}

async function supprimerChecklist(rowId, checklistId, event) {
    event?.preventDefault();
    event?.stopPropagation();
    const record = trouverRecord(rowId);
    const checklist = parserChecklists(record?.CHECKLIST).find((item) => item.id === checklistId);

    if (!window.confirm(`Supprimer la checklist « ${checklist?.title || 'Checklist'} » et tous ses éléments ?`)) {
        return;
    }

    await enregistrerChecklistsEnFile(rowId, (checklists) =>
        checklists.filter((candidate) => candidate.id !== checklistId)
    );
    await rafraichirFicheCourante(rowId);
}

async function enregistrerChecklistsEnFile(rowId, transform) {
    const resolvedRowId = Number(rowId);
    const previous = SAVE_QUEUES.checklists.get(resolvedRowId) || Promise.resolve();

    const next = previous
        .catch(() => undefined)
        .then(async () => {
            const record = trouverRecord(resolvedRowId);
            const current = parserChecklists(record?.CHECKLIST);
            const updated = transform(current).map((checklist, index) => normaliserChecklist(checklist, index));

            await mettreAJourChamp(resolvedRowId, 'CHECKLIST', JSON.stringify(updated));
            if (record) {
                record.CHECKLIST = JSON.stringify(updated);
            }
            return updated;
        })
        .finally(() => {
            if (SAVE_QUEUES.checklists.get(resolvedRowId) === next) {
                SAVE_QUEUES.checklists.delete(resolvedRowId);
            }
        });

    SAVE_QUEUES.checklists.set(resolvedRowId, next);
    return next;
}

function rafraichirBlocChecklist(rowId, checklistId, checklists = null) {
    const record = trouverRecord(rowId);
    const all = checklists || parserChecklists(record?.CHECKLIST);
    const checklist = all.find((item) => item.id === checklistId);
    const current = document.querySelector(`.checklist-section[data-row-id="${Number(rowId)}"][data-checklist-id="${echapperSelecteurCss(checklistId)}"]`);

    if (!current || !checklist) {
        rafraichirFicheCourante(rowId);
        return;
    }

    const wrapper = document.createElement('div');
    wrapper.innerHTML = construireBlocChecklist(checklist, rowId, widget.col.CHECKLIST.getIsFormula());
    const replacement = wrapper.firstElementChild;
    current.replaceWith(replacement);
    replacement.querySelectorAll('.auto-expand').forEach(ajusterTextarea);
    initialiserChecklistsSortables(replacement.parentElement);
}

function afficherStatutChecklist(rowId, checklistId, state, message) {
    const status = document.getElementById(`checklist-status-${Number(rowId)}-${encoderIdentifiantDom(checklistId)}`);
    if (!status) {
        return;
    }
    status.className = `section-status checklist-status${state ? ` ${state}` : ''}`;
    status.textContent = message;
}

function initialiserChecklistsSortables(root = document) {
    if (typeof Sortable !== 'function' || widget.opt.readonly) {
        return;
    }

    root.querySelectorAll('.checklist-section[data-disabled="false"] .checklist-items').forEach((list) => {
        if (list.dataset.sortableReady === 'true') {
            return;
        }
        list.dataset.sortableReady = 'true';

        new Sortable(list, {
            animation: 140,
            handle: '.checklist-drag-handle',
            ghostClass: 'checklist-item-ghost',
            chosenClass: 'checklist-item-chosen',
            onEnd: async () => {
                const rowId = Number(list.dataset.rowId);
                const checklistId = list.dataset.checklistId;
                const orderedIds = Array.from(list.querySelectorAll('.checklist-item')).map((item) => item.dataset.itemId);

                await enregistrerChecklistsEnFile(rowId, (checklists) =>
                    checklists.map((checklist) => {
                        if (checklist.id !== checklistId) {
                            return checklist;
                        }
                        const byId = new Map(checklist.items.map((item) => [item.id, item]));
                        return {
                            ...checklist,
                            items: orderedIds.map((id) => byId.get(id)).filter(Boolean)
                        };
                    })
                );
                afficherStatutChecklist(rowId, checklistId, 'saved', 'Ordre enregistré.');
            }
        });
    });
}

function encoderIdentifiantDom(value) {
    return valeurTexte(value).replace(/[^a-zA-Z0-9_-]/g, '_');
}

function echapperSelecteurCss(value) {
    if (window.CSS?.escape) {
        return window.CSS.escape(valeurTexte(value));
    }
    return valeurTexte(value).replace(/["\\]/g, '\\$&');
}

// ========== PIÈCES JOINTES ==========

function construireSectionRessources(todo, attachmentIds = normaliserIdsListe(todo.PIECES_JOINTES), links = parserLiens(todo.LIENS)) {
    return `
        <section class="detail-section resources-section" data-row-id="${Number(todo.id)}">
            <div class="detail-section-header resource-section-header">
                <div class="task-section-heading-copy">
                    <span class="task-section-icon task-section-icon-resources">📎</span>
                    <div>
                        <h3>Ressources</h3>
                        <p>${attachmentIds.length + links.length} fichier(s) ou lien(s)</p>
                    </div>
                </div>
                <button type="button" class="section-edit-button" onclick="ouvrirPanneauFiche('resources', event, true)">Ajouter</button>
            </div>

            ${attachmentIds.length > 0 ? `
                <div class="resource-subsection">
                    <h4>Fichiers</h4>
                    <div id="attachments-list-${Number(todo.id)}" class="attachments-grid">
                        <div class="section-loading">Chargement des pièces jointes…</div>
                    </div>
                </div>
            ` : ''}

            ${links.length > 0 ? `
                <div class="resource-subsection">
                    <h4>Liens</h4>
                    <div class="resource-links-list">
                        ${links.map((link) => construireCarteLien(todo.id, link)).join('')}
                    </div>
                </div>
            ` : ''}
        </section>
    `;
}

function parserLiens(rawValue) {
    const raw = valeurTexte(rawValue).trim();
    if (!raw) {
        return [];
    }

    try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) {
            return [];
        }
        return parsed
            .map((link, index) => ({
                id: valeurTexte(link?.id) || `link-${index}`,
                label: valeurTexte(link?.label || link?.text).trim(),
                url: normaliserUrlRessource(link?.url),
                createdAt: valeurTexte(link?.createdAt)
            }))
            .filter((link) => link.label && link.url);
    } catch (error) {
        console.warn('Liens illisibles, valeur ignorée :', error);
        return [];
    }
}

function normaliserUrlRessource(rawUrl) {
    const value = valeurTexte(rawUrl).trim();
    if (!value) {
        return '';
    }

    const candidate = /^(https?:)/i.test(value) ? value : `https://${value}`;
    try {
        const url = new URL(candidate);
        return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
    } catch (_) {
        return '';
    }
}

function construireCarteLien(rowId, link) {
    let hostname = '';
    try {
        hostname = new URL(link.url).hostname;
    } catch (_) {
        hostname = link.url;
    }

    return `
        <article class="resource-link-card">
            <a href="${echapperAttribut(link.url)}" target="_blank" rel="noopener noreferrer" class="resource-link-main">
                <span class="resource-link-icon">🔗</span>
                <span class="resource-link-text">
                    <strong>${echapperHtml(link.label)}</strong>
                    <small>${echapperHtml(hostname)}</small>
                </span>
            </a>
            ${(widget.map?.LIENS && !widget.col.LIENS.getIsFormula()) ? `
                <button
                    type="button"
                    onclick="retirerLienFiche(${Number(rowId)}, '${echapperJs(link.id)}', event)"
                    title="Retirer ce lien"
                    aria-label="Retirer ce lien"
                >×</button>
            ` : ''}
        </article>
    `;
}

async function ajouterLienFiche(rowId, button, event) {
    event?.preventDefault();
    event?.stopPropagation();
    const panel = button.closest('.task-action-panel');
    const labelInput = panel?.querySelector('.resource-link-label');
    const urlInput = panel?.querySelector('.resource-link-url');
    const status = panel?.querySelector('.task-panel-status');
    const label = valeurTexte(labelInput?.value).trim();
    const url = normaliserUrlRessource(urlInput?.value);

    if (!label || !url) {
        if (status) {
            status.className = 'task-panel-status section-status error';
            status.textContent = 'Renseignez un texte d’affichage et une adresse valide.';
        }
        (!label ? labelInput : urlInput)?.focus();
        return;
    }

    try {
        if (status) {
            status.className = 'task-panel-status section-status saving';
            status.textContent = 'Enregistrement…';
        }
        await enregistrerLiensEnFile(rowId, (links) => [
            ...links,
            {
                id: genererIdentifiant(),
                label,
                url,
                createdAt: new Date().toISOString()
            }
        ]);
        await rafraichirFicheCourante(rowId, 'resources');
    } catch (error) {
        if (status) {
            status.className = 'task-panel-status section-status error';
            status.textContent = 'Impossible d’ajouter le lien.';
        }
    }
}

async function retirerLienFiche(rowId, linkId, event) {
    event?.preventDefault();
    event?.stopPropagation();
    await enregistrerLiensEnFile(rowId, (links) => links.filter((link) => link.id !== linkId));
    await rafraichirFicheCourante(rowId);
}

async function enregistrerLiensEnFile(rowId, transform) {
    const resolvedRowId = Number(rowId);
    const previous = SAVE_QUEUES.links.get(resolvedRowId) || Promise.resolve();

    const next = previous
        .catch(() => undefined)
        .then(async () => {
            const record = trouverRecord(resolvedRowId);
            const current = parserLiens(record?.LIENS);
            const updated = transform(current)
                .map((link) => ({
                    id: valeurTexte(link.id) || genererIdentifiant(),
                    label: valeurTexte(link.label).trim(),
                    url: normaliserUrlRessource(link.url),
                    createdAt: valeurTexte(link.createdAt) || new Date().toISOString()
                }))
                .filter((link) => link.label && link.url);

            await mettreAJourChamp(resolvedRowId, 'LIENS', JSON.stringify(updated));
            if (record) {
                record.LIENS = JSON.stringify(updated);
            }
            return updated;
        })
        .finally(() => {
            if (SAVE_QUEUES.links.get(resolvedRowId) === next) {
                SAVE_QUEUES.links.delete(resolvedRowId);
            }
        });

    SAVE_QUEUES.links.set(resolvedRowId, next);
    return next;
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
                ${(widget.map?.PIECES_JOINTES && !widget.col.PIECES_JOINTES.getIsFormula())
                    ? `<button type="button" onclick="retirerPieceJointe(${Number(rowId)}, ${Number(attachmentId)}, event)" title="Retirer de la tâche">×</button>`
                    : ''}
            </div>
        </article>
    `;
}

function declencherSelecteurPiecesJointes(button, event) {
    event?.preventDefault();
    event?.stopPropagation();

    const panel = button?.closest('.task-action-panel');
    const input = panel?.querySelector('.resource-file-input');

    if (!input || input.disabled) {
        return;
    }

    input.click();
}

function extraireIdsPiecesJointesTeleversees(payload) {
    const collected = [];

    const visit = (value) => {
        if (value === null || value === undefined) {
            return;
        }

        if (typeof value === 'number' || typeof value === 'string') {
            const number = Number(value);
            if (Number.isInteger(number) && number > 0) {
                collected.push(number);
            }
            return;
        }

        if (Array.isArray(value)) {
            const start = value[0] === 'L' ? 1 : 0;
            value.slice(start).forEach(visit);
            return;
        }

        if (typeof value === 'object') {
            [
                'id',
                'ids',
                'attachmentId',
                'attachmentIds',
                'attachments',
                'recordIds',
                'result'
            ].forEach((key) => {
                if (Object.prototype.hasOwnProperty.call(value, key)) {
                    visit(value[key]);
                }
            });
        }
    };

    visit(payload);
    return [...new Set(collected)];
}

async function ajouterPiecesJointes(rowId, input, event) {
    event?.preventDefault();
    event?.stopPropagation();

    const panel = input?.closest('.task-action-panel');
    const status = panel?.querySelector('.task-panel-status');
    const chooseButton = panel?.querySelector('.resource-file-button');
    const files = Array.from(input?.files || []);

    if (files.length === 0) {
        return;
    }

    const setStatus = (state, message) => {
        if (!status) return;
        status.className =
            `task-panel-status section-status${state ? ` ${state}` : ''}`;
        status.textContent = message;
    };

    const tooLarge = files.find(
        (file) => file.size > MAX_ATTACHMENT_SIZE
    );

    if (tooLarge) {
        setStatus(
            'error',
            `${tooLarge.name} dépasse la limite de 50 Mo.`
        );
        input.value = '';
        return;
    }

    input.disabled = true;
    if (chooseButton) chooseButton.disabled = true;
    setStatus(
        'saving',
        `Envoi de ${files.length} fichier(s)…`
    );

    try {
        const tokenInfo = await obtenirTokenPiecesJointes(false);
        const formData = new FormData();

        files.forEach((file) => {
            formData.append('upload', file, file.name);
        });

        const uploadUrl =
            `${tokenInfo.baseUrl}/attachments?auth=${encodeURIComponent(tokenInfo.token)}`;

        const response = await fetch(uploadUrl, {
            method: 'POST',
            body: formData,
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json'
            }
        });

        const responseText = await response.text();
        let result = responseText;

        if (responseText) {
            try {
                result = JSON.parse(responseText);
            } catch (_) {
                result = responseText;
            }
        }

        if (!response.ok) {
            throw new Error(
                `Upload refusé par Grist (${response.status}).`
            );
        }

        const uploadedIds =
            extraireIdsPiecesJointesTeleversees(result);

        if (uploadedIds.length === 0) {
            throw new Error(
                'Le fichier a été envoyé, mais aucun identifiant de pièce jointe n’a été retourné.'
            );
        }

        const record = trouverRecord(rowId);
        const existingIds =
            normaliserIdsListe(record?.PIECES_JOINTES);
        const newIds = [
            ...new Set([...existingIds, ...uploadedIds])
        ];

        await enregistrerPiecesJointesDansGrist(
            rowId,
            newIds
        );

        if (record) {
            record.PIECES_JOINTES = [...newIds];
        }

        STATE.attachments.metaLoaded = false;
        STATE.attachments.readToken = null;
        await chargerMetaPiecesJointes(true);

        setStatus(
            'saved',
            `${uploadedIds.length} pièce(s) jointe(s) ajoutée(s).`
        );

        fermerPanneauxFiche();
        await rafraichirFicheCourante(rowId);
    } catch (error) {
        console.error(
            'Erreur pendant l’ajout des pièces jointes :',
            error
        );
        setStatus(
            'error',
            error?.message || 'Échec de l’envoi.'
        );
    } finally {
        input.value = '';
        input.disabled = false;
        if (chooseButton) chooseButton.disabled = false;
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
        await rafraichirFicheCourante(rowId);
    } catch (error) {
        console.error('Erreur pendant le retrait de la pièce jointe :', error);
        afficherStatutSection('attachments', rowId, 'error', 'Impossible de retirer la pièce jointe.');
    }
}

async function enregistrerPiecesJointesDansGrist(rowId, ids) {
    const actualColumnId = widget.map?.PIECES_JOINTES;
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
    if (readOnly && STATE.attachments.readToken && Date.now() - STATE.attachments.readTokenAt < ATTACHMENT_TOKEN_MAX_AGE) {
        return STATE.attachments.readToken;
    }

    const token = await grist.docApi.getAccessToken({readOnly});
    if (readOnly) {
        STATE.attachments.readToken = token;
        STATE.attachments.readTokenAt = Date.now();
    }
    return token;
}

function construireUrlPieceJointe(tokenInfo, attachmentId) {
    return `${tokenInfo.baseUrl}/attachments/${Number(attachmentId)}/download?auth=${encodeURIComponent(tokenInfo.token)}`;
}

function getAttachmentMeta(id) {
    return STATE.attachments.meta.get(Number(id)) || {
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

    return `
        <section
            class="detail-section comments-section"
            data-row-id="${Number(todo.id)}"
        >
            <div class="detail-section-header comments-header">
                <div class="task-section-heading-copy">
                    <span class="task-section-icon task-section-icon-comments">💬</span>
                    <div>
                        <h3>Commentaires</h3>
                        <p>${comments.length} commentaire(s) · échangez avec l’équipe</p>
                    </div>
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
                        placeholder="Écrire un commentaire…"
                        oninput="ajusterTextarea(this)"
                    ></textarea>
                </div>

                <div class="comment-grist-author">
                    Le nom de l’auteur est renseigné par Grist avec
                    <code>user.Name</code>.
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
    return echapperHtml(comment.text).replace(/\n/g, '<br>');
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
        return [{
            id: 'legacy-text',
            author: 'Ancien commentaire',
            createdAt: '',
            text: raw
        }];
    }
}

async function ajouterCommentaire(rowId, button, event) {
    event?.preventDefault();
    event?.stopPropagation();

    const section = button.closest('.comments-section');
    const textarea = section?.querySelector('.comment-input');
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
        text
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

        if (textarea) {
            textarea.value = '';
            ajusterTextarea(textarea);
        }

        rafraichirCommentaires(rowId);

        afficherStatutSection(
            'comments',
            rowId,
            'saved',
            `Commentaire ajouté par ${savedComment.author}.`
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
        SAVE_QUEUES.comments.get(resolvedRowId) ||
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

            await widget.updateRecords(
                widget.formatRecord(resolvedRowId, {
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
                SAVE_QUEUES.comments.get(resolvedRowId) === next
            ) {
                SAVE_QUEUES.comments.delete(resolvedRowId);
            }
        });

    SAVE_QUEUES.comments.set(resolvedRowId, next);
    return next;
}

async function rechargerCommentairesDepuisGrist(rowId) {
    const actualColumnId = widget.map?.COMMENTAIRES;

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

        await widget.updateRecords(widget.formatRecord(todoId, data));

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
        console.error(translate('Error during update:'), error);
        throw error;
    }
}

function construireChampsSuivi() {
    const data = {};

    if (widget.map?.DERNIERE_MISE_A_JOUR && !widget.col.DERNIERE_MISE_A_JOUR.getIsFormula()) {
        data.DERNIERE_MISE_A_JOUR = new Date().toISOString();
    }

    if (widget.map?.MODIFIE_PAR && !widget.col.MODIFIE_PAR.getIsFormula()) {
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
        await widget.updateRecords(widget.formatRecord(rowId, data));
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
        if (widget.map?.DERNIERE_MISE_A_JOUR && !widget.col.DERNIERE_MISE_A_JOUR.getIsFormula()) data.DERNIERE_MISE_A_JOUR = new Date().toISOString();
        if (widget.map?.CREE_LE && !widget.col.CREE_LE.getIsFormula()) data.CREE_LE = new Date().toISOString();
        if (widget.map?.COMMENTAIRES && !widget.col.COMMENTAIRES.getIsFormula()) data.COMMENTAIRES = '[]';
        if (widget.map?.CHECKLIST && !widget.col.CHECKLIST.getIsFormula()) data.CHECKLIST = '[]';
        if (widget.map?.LIENS && !widget.col.LIENS.getIsFormula()) data.LIENS = '[]';
        if (widget.map?.ORDRE && !widget.col.ORDRE.getIsFormula()) data.ORDRE = prochainOrdrePourStatut(status);

        const result = await widget.createRecords({fields: data});
        if (result?.id > 0) {
            grist.setCursorPos({rowId: result.id});
            const record = await widget.fetchSelectedRecord(result.id);
            if (!widget.opt.hideedit) {
                togglePopupTodo(record);
            }
        }
    } catch (error) {
        console.error(translate('Error on creation:'), error);
    }
}

function ouvrirPopupArchivage(todoId, event) {
    event?.preventDefault();
    event?.stopPropagation();

    fermerPanneauxFiche();

    const popup = document.getElementById('popup-todo');
    const record = trouverRecord(todoId);

    if (!popup || !record) {
        return;
    }

    fermerPopupArchivage();

    const overlay = document.createElement('div');
    overlay.id = 'archive-confirm-dialog';
    overlay.className = 'archive-confirm-overlay';
    overlay.setAttribute('role', 'presentation');

    overlay.innerHTML = `
        <section
            class="archive-confirm-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="archive-confirm-title"
        >
            <div class="archive-confirm-icon" aria-hidden="true">🗃️</div>

            <div class="archive-confirm-copy">
                <h3 id="archive-confirm-title">Archiver cette carte ?</h3>
                <p>
                    « ${echapperHtml(
                        valeurTexte(record.DESCRIPTION) ||
                        'Cette carte'
                    )} » sera déplacée dans la liste
                    <strong>${echapperHtml(
                        valeurTexte(widget.opt?.archivestatus).trim() ||
                        'Archives'
                    )}</strong>.
                </p>
                <small>
                    Les notes, checklists, membres, commentaires et pièces
                    jointes seront conservés.
                </small>
            </div>

            <div
                class="archive-confirm-status section-status"
                aria-live="polite"
            ></div>

            <div class="archive-confirm-actions">
                <button
                    type="button"
                    class="archive-confirm-cancel"
                    onclick="fermerPopupArchivage(event)"
                >Annuler</button>

                <button
                    type="button"
                    class="archive-confirm-submit"
                    onclick="confirmerArchivage(
                        ${Number(todoId)},
                        this,
                        event
                    )"
                >Archiver</button>
            </div>
        </section>
    `;

    overlay.addEventListener('click', (clickEvent) => {
        if (clickEvent.target === overlay) {
            fermerPopupArchivage(clickEvent);
        }
    });

    popup.appendChild(overlay);

    window.setTimeout(() => {
        overlay.querySelector(
            '.archive-confirm-submit'
        )?.focus();
    }, 0);
}

function fermerPopupArchivage(event) {
    event?.preventDefault();
    event?.stopPropagation();

    document.getElementById(
        'archive-confirm-dialog'
    )?.remove();
}

async function confirmerArchivage(todoId, button, event) {
    event?.preventDefault();
    event?.stopPropagation();

    const dialog = button?.closest('.archive-confirm-card');
    const status = dialog?.querySelector(
        '.archive-confirm-status'
    );
    const cancelButton = dialog?.querySelector(
        '.archive-confirm-cancel'
    );

    button.disabled = true;
    if (cancelButton) {
        cancelButton.disabled = true;
    }

    if (status) {
        status.className =
            'archive-confirm-status section-status saving';
        status.textContent = 'Archivage…';
    }

    try {
        const choices = await widget.col.STATUT.getChoices();
        const configuredStatus =
            valeurTexte(widget.opt?.archivestatus).trim() ||
            'Archives';

        const archiveStatus =
            choices.find((choice) =>
                valeurTexte(choice) === configuredStatus
            ) ||
            choices.find((choice) =>
                valeurTexte(choice)
                    .toLocaleLowerCase(widget.cultureFull) ===
                configuredStatus
                    .toLocaleLowerCase(widget.cultureFull)
            ) ||
            choices.find((choice) =>
                valeurTexte(choice)
                    .toLocaleLowerCase(widget.cultureFull)
                    .includes('archive')
            );

        if (!archiveStatus) {
            throw new Error(
                `Aucun statut « ${configuredStatus} » n’existe dans la colonne Statut.`
            );
        }

        const data = {
            STATUT: archiveStatus,
            ...construireChampsSuivi()
        };

        if (
            widget.map?.ORDRE &&
            !widget.col.ORDRE.getIsFormula()
        ) {
            data.ORDRE = prochainOrdrePourStatut(
                archiveStatus
            );
        }

        await widget.updateRecords(
            widget.formatRecord(todoId, data)
        );

        const record = trouverRecord(todoId);
        if (record) {
            Object.assign(record, data);
        }

        fermerPopupArchivage();
        fermerPopup();
        await afficherKanban(STATE.records);
    } catch (error) {
        console.error(
            'Impossible d’archiver la tâche :',
            error
        );

        if (status) {
            status.className =
                'archive-confirm-status section-status error';
            status.textContent =
                error?.message ||
                'Impossible d’archiver la tâche.';
        }

        button.disabled = false;
        if (cancelButton) {
            cancelButton.disabled = false;
        }
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

    fermerPanneauxFiche();
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
    document
        .querySelectorAll(
            '.multi-dropdown[open], .checklist-assignees[open], .checklist-date-picker[open]'
        )
        .forEach((details) => {
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

    const openedDropdown = document.querySelector('.multi-dropdown[open], .checklist-assignees[open], .checklist-date-picker[open]');
    if (openedDropdown) {
        openedDropdown.removeAttribute('open');
        return;
    }

    const openedPanel = document.querySelector('.task-action-panel:not([hidden])');
    if (openedPanel) {
        fermerPanneauxFiche(event);
        return;
    }

    fermerPopup();
});

document.addEventListener('click', (event) => {
    const openedDropdown = event.target.closest('.multi-dropdown, .checklist-assignees, .checklist-date-picker');
    if (widget?.opt?.autoclosemenus !== false) {
        fermerTousLesMenusMultiples(openedDropdown);
    }

    const popup = document.getElementById('popup-todo');
    if (!popup?.classList.contains('visible')) {
        return;
    }

    const insideActionUi = Boolean(
        event.target.closest('.task-action-panel, .task-quick-button')
    );
    if (!insideActionUi) {
        fermerPanneauxFiche();
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
    return STATE.records.find((item) => Number(item.id) === Number(rowId)) || null;
}

function trouverCarteParId(rowId) {
    return Array.from(document.querySelectorAll('.carte'))
        .find((card) => Number(card.dataset.todoId) === Number(rowId)) || null;
}

function getColumnOption(index) {
    const options = Array.isArray(widget.opt?.columns) ? widget.opt.columns : [];
    return {
        addbutton: false,
        isdone: false,
        useconfetti: false,
        hidecolumn: false,
        ...(options[index] || {})
    };
}

function getColumnOptionByStatus(status) {
    const statuses = widget.valuesList?.columns || [];
    const index = statuses.indexOf(status);
    return index >= 0 ? getColumnOption(index) : null;
}

function getColumnStorageKey(status) {
    return `column-todo-${valeurTexte(status)}`;
}

function prochainOrdrePourStatut(status) {
    const orders = STATE.records
        .filter((record) =>
            valeurTexte(record.STATUT) === valeurTexte(status)
        )
        .map((record) => Number(record.ORDRE))
        .filter(Number.isFinite);

    return orders.length > 0
        ? Math.max(...orders) + 1000
        : 1000;
}

function obtenirIdsPersonnes(todo, mappingKey) {
    const directIds = normaliserIdsRefList(
        todo?.[`${mappingKey}_id`]
    );

    if (directIds.length > 0) {
        return directIds;
    }

    const labels = normaliserListeTexte(
        todo?.[mappingKey]
    ).filter((value) => value !== '#KeyError');

    const available = [...STATE.people.items];

    return labels.flatMap((label) => {
        const index = available.findIndex(
            (person) => person.label === label
        );

        if (index < 0) {
            return [];
        }

        const [person] = available.splice(index, 1);
        return [person.id];
    });
}

function obtenirPersonnes(todo, mappingKey) {
    const ids = obtenirIdsPersonnes(
        todo,
        mappingKey
    );

    if (ids.length > 0) {
        return ids
            .map((id) => STATE.people.byId.get(id))
            .filter(Boolean);
    }

    return normaliserListeTexte(todo?.[mappingKey])
        .filter((label) => label !== '#KeyError')
        .map((label) => ({
            id: 0,
            label,
            initials: calculerInitiales(label),
            avatarColor: couleurAvatar(label)
        }));
}

function obtenirIdsMembres(todo) {
    return obtenirIdsPersonnes(todo, 'MEMBRES');
}

function obtenirMembres(todo) {
    return obtenirPersonnes(todo, 'MEMBRES');
}

function obtenirIdsResponsables(todo) {
    return obtenirIdsPersonnes(todo, 'RESPONSABLE');
}

function obtenirResponsables(todo) {
    return obtenirPersonnes(todo, 'RESPONSABLE');
}

function obtenirLibellesResponsables(todo) {
    return obtenirResponsables(todo)
        .map((person) => person.label);
}

function obtenirIdsEtiquettes(todo) {
    const directIds = normaliserIdsRefList(todo?.ETIQUETTES_id);
    if (directIds.length > 0) {
        return directIds;
    }

    const labels = normaliserListeTexte(todo?.ETIQUETTES).filter((value) => value !== '#KeyError');
    const available = [...STATE.labels.items];

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
        return ids.map((id) => STATE.labels.byId.get(id)).filter(Boolean);
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

function construireInfoCreation(todo) {
    const lines = [];

    const createdDate = widget.map?.CREE_LE && todo.CREE_LE ? formatDateTime(todo.CREE_LE) : '';
    const createdBy = widget.map?.CREE_PAR ? valeurTexte(todo.CREE_PAR).trim() : '';

    if (createdDate || createdBy) {
        const createdParts = ['Créé'];
        if (createdDate) createdParts.push(`le ${createdDate}`);
        if (createdBy) createdParts.push(`par ${createdBy}`);
        lines.push(`<div>${echapperHtml(createdParts.join(' '))}</div>`);
    }

    const modifiedDate = widget.map?.DERNIERE_MISE_A_JOUR && todo.DERNIERE_MISE_A_JOUR
        ? formatDateTime(todo.DERNIERE_MISE_A_JOUR)
        : '';
    const rawModifiedBy = widget.map?.MODIFIE_PAR ? valeurTexte(todo.MODIFIE_PAR).trim() : '';
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
    const month = date.toLocaleDateString(widget.cultureFull, {month: 'short'});
    return `${day} ${month} ${date.getFullYear()}`;
}

function formatDateChecklistCompact(dateValue) {
    if (!dateValue) {
        return '';
    }

    const raw = valeurTexte(dateValue).trim();
    const match = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (match) {
        return `${match[3]}/${match[2]}/${match[1]}`;
    }

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) {
        return '';
    }

    return date.toLocaleDateString(widget.cultureFull, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function formatDateTime(dateValue) {
    if (!dateValue) return '';
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleString(widget.cultureFull, {
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
    return date.toISOString().split('translate')[0];
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

// ========== API PUBLIQUE POUR LES ATTRIBUTS HTML ==========

Object.assign(window, {
    activerEditionNotes,
    ajouterChecklistAvecTitre,
    ajouterCommentaire,
    ajouterItemChecklist,
    ajouterLienFiche,
    ajouterPiecesJointes,
    ajusterTextarea,
    annulerEditionNotes,
    appliquerBaliseSelectionNotes,
    appliquerCommandeNotes,
    appliquerFormatBlocNotes,
    basculerRolePersonnePanneau,
    changerStatutDepuisFiche,
    confirmerArchivage,
    creerLienNotes,
    creerNouvelleTache,
    declencherSelecteurPiecesJointes,
    definirDateChecklistRapide,
    effacerDateChecklist,
    enregistrerEtFermerNotes,
    enregistrerEtiquettesDepuisPanneau,
    fermerAjoutItemChecklist,
    fermerLecteurPieceJointe,
    fermerPanneauxFiche,
    fermerPopup,
    fermerPopupArchivage,
    filtrerOptionsChecklist,
    filtrerPanneauFiche,
    gererAjoutItemChecklistClavier,
    gererCreationChecklistClavier,
    gererRaccourcisNotes,
    marquerNotesModifiees,
    mettreAJourAssignationsItemChecklist,
    mettreAJourCouleurFiche,
    mettreAJourDateChecklistDepuisMenu,
    mettreAJourEtatBarreNotes,
    mettreAJourItemChecklist,
    mettreAJourProprieteFiche,
    mettreAJourTitreFiche,
    nettoyerCollageNotes,
    ouvrirAjoutItemChecklist,
    ouvrirPanneauFiche,
    ouvrirPieceJointe,
    ouvrirPopupArchivage,
    previsualiserCouleur,
    renommerChecklist,
    retirerEtiquetteFiche,
    retirerLienFiche,
    retirerPieceJointe,
    supprimerChecklist,
    supprimerCommentaire,
    supprimerItemChecklist,
    toggleColonne
});
