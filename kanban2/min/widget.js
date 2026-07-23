let r, g;
const C = /* @__PURE__ */ new Date("3000-01-01"), K = "#DCDCDC", ae = "#000000", Oe = 120 * 1e3, _e = 50 * 1024 * 1024;
let I = [], w = [], A = /* @__PURE__ */ new Map(), B = null, $ = [], F = /* @__PURE__ */ new Map(), k = !1, M = null, Z = 0;
const L = /* @__PURE__ */ new Map(), O = /* @__PURE__ */ new Map(), _ = /* @__PURE__ */ new Map();
window.addEventListener("load", async () => {
  r = new WidgetSDK(), g = await r.loadTranslations(["widget.js"]);
  const e = `If empty, the widget uses the column properties to build the list. Otherwise, provide either:
• A list separated by ";"
• A table or column reference starting with "$" ($TableID or $TableID.ColumnID)`;
  r.configureOptions(
    [
      WidgetSDK.newItem(
        "columns",
        null,
        "Behavior",
        "Configure the behavior of each column",
        "Columns",
        {
          columnId: "STATUT",
          template: [
            WidgetSDK.newItem("addbutton", !0, "Can add card", "Display a button to add a card."),
            WidgetSDK.newItem("isdone", !1, "Is done", "Cards in this column are considered completed."),
            WidgetSDK.newItem("useconfetti", !1, "Use confetti", "Display confetti when a card enters this column."),
            WidgetSDK.newItem("hidecolumn", !1, "Hide", "Hide this column.")
          ]
        }
      ),
      WidgetSDK.newItem(
        "ref",
        "",
        "References",
        "List of task references available.",
        "Cards options",
        { description: e, columnId: "REFERENCE_PROJET", type: "lookup" }
      ),
      WidgetSDK.newItem(
        "cardcolor",
        "",
        "Card color",
        "List of colors available for card backgrounds.",
        "Cards options",
        { description: e, columnId: "COULEUR", type: "lookup" }
      ),
      WidgetSDK.newItem("rotation", !0, "Tilt", "Randomly tilt cards.", "Display"),
      WidgetSDK.newItem("compact", !1, "Compact", "Use a compact rendering.", "Display"),
      WidgetSDK.newItem("readonly", !1, "Read only", "Disable all edits.", "Display"),
      WidgetSDK.newItem("hideedit", !1, "Hide editing form", "Do not open the editing form when clicking a card.", "Display"),
      WidgetSDK.newItem("gristeditcard", !1, "Grist Record Card", "Open the Grist record card on double click.", "Display")
    ],
    "#config-view",
    "#main-view",
    { onOptChange: ee, onOptLoad: ee }
  ), r.initMetaData(), r.ready({
    requiredAccess: "full",
    allowSelectBy: !0,
    columns: [
      { name: "STATUT", title: "Statut", description: "Colonne du Kanban", type: "Choice", strictType: !0 },
      { name: "DESCRIPTION", title: "Nom de la tâche", description: "Nom principal de la tâche", type: "Any" },
      { name: "DESCRIPTION_DISPLAY", title: "Affichage de la tâche", description: "Contenu personnalisé facultatif affiché sur la carte", type: "Any", optional: !0 },
      { name: "NOTES", title: "Notes", description: "Notes détaillées de la tâche", type: "Any", optional: !0 },
      { name: "DEADLINE", title: "Échéance", description: "Date limite ou ordre de priorité", type: "Date", optional: !0 },
      { name: "REFERENCE_PROJET", title: "Référence projet", description: "Référence facultative associée à la tâche", type: "Any", optional: !0 },
      { name: "RESPONSABLE", title: "Responsables", description: "Personnes responsables de la tâche", type: "RefList", strictType: !0, optional: !0 },
      { name: "ETIQUETTES", title: "Étiquettes", description: "Étiquettes multiples de type Trello", type: "ChoiceList", strictType: !0, optional: !0 },
      { name: "PIECES_JOINTES", title: "Pièces jointes", description: "Fichiers et images associés à la tâche", type: "Attachments", strictType: !0, optional: !0 },
      { name: "COMMENTAIRES", title: "Commentaires", description: "Commentaires du widget stockés en JSON", type: "Text", strictType: !0, optional: !0 },
      { name: "COULEUR", title: "Couleur de carte", description: "Couleur de fond facultative", type: "Choice,Text", optional: !0 },
      { name: "CREE_PAR", title: "Créé par", type: "Any", optional: !0 },
      { name: "CREE_LE", title: "Date de création", type: "DateTime", optional: !0 },
      { name: "DERNIERE_MISE_A_JOUR", title: "Dernière mise à jour", description: "Champ technique non affiché", type: "DateTime", optional: !0 }
    ]
  }), r.onRecords(q, {
    expandRefs: !1,
    keepEncoded: !1,
    mapRef: !0
  }), r.isLoaded().then(() => {
    r.initDone = !0;
  }), grist.on("message", async (t) => {
    t.mappingsChange && await Pe();
  }), Ve();
});
async function oe(e = !1) {
  if (!r?.map?.RESPONSABLE || !r?.col?.RESPONSABLE) {
    U();
    return;
  }
  const t = r.col.RESPONSABLE, [n, i] = String(t.type || "").split(":");
  if (n !== "RefList" || !i || !t.visibleCol) {
    U();
    return;
  }
  const a = `${i}:${t.visibleCol}`;
  if (!(!e && B === a && w.length > 0))
    try {
      const [o, s] = await Promise.all([
        grist.docApi.fetchTable(i),
        t.getMeta(t.visibleCol)
      ]), c = s?.colId, d = Array.isArray(o?.id) ? o.id : [], f = c && Array.isArray(o?.[c]) ? o[c] : [], h = d.map((p, E) => ({
        id: Number(p),
        label: l(f[E]).trim()
      })).filter((p) => Number.isInteger(p.id) && p.id > 0 && p.label && p.label !== "#KeyError").sort((p, E) => p.label.localeCompare(E.label, r.cultureFull, { sensitivity: "base" }));
      w = h, A = new Map(h.map((p) => [p.id, p])), B = a;
    } catch (o) {
      U(), console.error("Impossible de charger la table des responsables :", o);
    }
}
function U() {
  w = [], A = /* @__PURE__ */ new Map(), B = null;
}
async function se() {
  if ($ = [], !(!r?.map?.ETIQUETTES || !r?.col?.ETIQUETTES))
    try {
      $ = [...new Set((await r.col.ETIQUETTES.getChoices() || []).map(l).filter(Boolean))];
    } catch (e) {
      console.error("Impossible de charger les étiquettes :", e);
    }
}
async function W(e = !1) {
  if (!(k && !e)) {
    F = /* @__PURE__ */ new Map(), k = !0;
    try {
      const t = await grist.docApi.fetchTable("_grist_Attachments");
      (Array.isArray(t?.id) ? t.id : []).forEach((i, a) => {
        const o = Number(i);
        if (!Number.isInteger(o) || o <= 0)
          return;
        const s = l(t.fileName?.[a]) || `Pièce jointe ${o}`, c = l(t.fileExt?.[a]) || Le(s), d = l(t.fileType?.[a]), f = Number(t.fileSize?.[a]) || 0;
        F.set(o, {
          id: o,
          fileName: s,
          fileExt: c,
          fileType: d,
          fileSize: f,
          imageWidth: Number(t.imageWidth?.[a]) || 0,
          imageHeight: Number(t.imageHeight?.[a]) || 0
        });
      });
    } catch (t) {
      console.warn("Métadonnées des pièces jointes indisponibles :", t);
    }
  }
}
async function q(e) {
  I = Array.isArray(e) ? e : [], await Promise.all([
    oe(),
    se()
  ]);
  const t = document.getElementById("conteneur-kanban");
  if (!t)
    return;
  t.innerHTML = "";
  const n = await r.col.STATUT.getChoices();
  if (!Array.isArray(n) || n.length === 0) {
    t.innerHTML = `<div class="kanban-message">${m(g("No choice available in the Status column"))}</div>`;
    return;
  }
  n.forEach((i, a) => {
    const o = Me(i, a);
    o && t.appendChild(o);
  }), I.forEach((i) => {
    const a = l(i.STATUT), o = Array.from(t.querySelectorAll(".contenu-colonne")).find((s) => s.dataset.statut === a);
    o && o.insertBefore(Ue(i), o.firstChild);
  }), xe(), document.querySelectorAll(".colonne-kanban").forEach(H);
}
async function ee() {
  await r.isMapped(), await q(I);
}
async function Pe() {
  U(), $ = [], k = !1, M = null, await Promise.all([
    oe(!0),
    se()
  ]), await q(I);
}
function Me(e, t) {
  const n = Re(t);
  if (n.hidecolumn)
    return null;
  const i = l(e), a = document.createElement("section");
  a.className = `colonne-kanban${!n.addbutton && !r.opt.compact ? " colonne-nobouton" : ""}`, a.id = i, localStorage.getItem(Ce(i)) === "true" && a.classList.add("collapsed");
  const o = r.col.STATUT.getColor(i) ?? K, s = r.col.STATUT.getTextColor(i) ?? ae, c = mt(i);
  return a.innerHTML = `
        <div class="entete-colonne" style="background-color:${o};color:${s}">
            <div class="titre-statut">${m(i)} <span class="compteur-colonne">(0)</span></div>
            <div class="actions-colonne">
                ${n.addbutton && !r.opt.readonly ? `<button type="button" class="bouton-ajouter-entete ${r.opt.compact ? "compact" : ""}" onclick="creerNouvelleTache(decodeURIComponent('${c}'))" aria-label="${u(g("Add a new task"))}">+</button>` : ""}
                <button type="button" class="bouton-toggle" onclick="toggleColonne(this.closest('.colonne-kanban'), event)" aria-label="Replier ou déplier">⇄</button>
            </div>
        </div>
        ${n.addbutton && !r.opt.readonly ? `<button type="button" class="bouton-ajouter ${r.opt.compact ? "compact" : ""}" onclick="creerNouvelleTache(decodeURIComponent('${c}'))">+ ${m(g("Add a new task"))}</button>` : ""}
        <div class="contenu-colonne" data-statut="${u(i)}" data-isdone="${n.isdone ? "true" : "false"}"></div>
    `, a;
}
function Ue(e) {
  const t = document.createElement("article");
  t.className = `carte${r.opt.rotation ? "" : " norotate"}${r.opt.compact ? " compact" : ""}`, t.dataset.todoId = String(e.id), t.dataset.lastUpdate = re(e.DERNIERE_MISE_A_JOUR), t.dataset.deadline = re(e.DEADLINE), ke(t, e.COULEUR);
  const n = l(e.REFERENCE_PROJET), i = e.DEADLINE ? De(e.DEADLINE) : "", a = we(e), o = R(e.ETIQUETTES), s = N(e.PIECES_JOINTES).length, c = j(e.COMMENTAIRES).length, d = e.DESCRIPTION_DISPLAY ? String(e.DESCRIPTION_DISPLAY) : m(l(e.DESCRIPTION) || g("No description")), f = o.map((T) => Je(T)).join(""), h = a.map((T) => `<span class="responsable-badge">${m(T)}</span>`).join(""), p = X(e.STATUT), E = V(e.DEADLINE), S = E !== null && E < Date.now() && E < C.getTime();
  return t.innerHTML = `
        ${n ? `<div class="projet-ref truncate">#${m(n)}</div>` : ""}
        ${f ? `<div class="etiquettes-list">${f}</div>` : n ? '<div class="card-spacer"></div>' : ""}
        <div class="description">${d}</div>
        ${i ? `<div class="deadline${S ? " late" : ""} truncate">📅 ${m(i)}</div>` : ""}
        ${a.length ? `<div class="responsables-list">${h}</div>` : ""}
        ${s || c ? `<div class="card-indicators">
                ${s ? `<span title="${s} pièce(s) jointe(s)">📎 ${s}</span>` : ""}
                ${c ? `<span title="${c} commentaire(s)">💬 ${c}</span>` : ""}
               </div>` : ""}
        ${p?.isdone ? `<div class="tampon-termine" style="color:${r.col.STATUT.getColor(e.STATUT) ?? K};">${m(l(e.STATUT))}</div>` : ""}
    `, t.addEventListener("click", () => {
    grist.setCursorPos({ rowId: e.id }), r.opt.hideedit || x(e);
  }), t.addEventListener("dblclick", () => {
    grist.setCursorPos({ rowId: e.id }), r.opt.gristeditcard ? grist.commandApi.run("viewAsCard") : r.opt.hideedit || x(e);
  }), t;
}
function Je(e) {
  const t = r.col?.ETIQUETTES?.getColor(e) || "rgba(0, 0, 0, 0.08)", n = r.col?.ETIQUETTES?.getTextColor(e) || "#273142";
  return `<span class="etiquette-badge" style="background:${u(t)};color:${u(n)}">${m(e)}</span>`;
}
function ke(e, t) {
  if (!t || !r.map?.COULEUR || !r.col?.COULEUR)
    return;
  let n = "";
  if (r.col.COULEUR.type === "Choice")
    n = r.col.COULEUR.getColor(t) || "";
  else {
    const i = l(t).trim();
    /^#?[0-9a-f]{3,8}$/i.test(i) ? n = i.startsWith("#") ? i : `#${i}` : /^[a-z]+$/i.test(i) && (n = i);
  }
  n && (e.style.backgroundColor = n);
}
function xe() {
  document.querySelectorAll(".contenu-colonne").forEach((e) => {
    te(e), !(r.opt.readonly || typeof Sortable != "function") && new Sortable(e, {
      group: "kanban-todo",
      animation: 150,
      ghostClass: "carte-fantome",
      chosenClass: "carte-selectionnee",
      onEnd: async (t) => {
        const n = t.to.dataset.statut, i = t.from.dataset.statut, a = t.item.dataset.todoId;
        try {
          n !== i ? await Ae(a, "STATUT", n) : t.oldIndex !== t.newIndex && await qe(t.to);
        } catch (o) {
          console.error(g("Error during status update:"), o), await q(I);
        }
        te(t.to), H(t.to.closest(".colonne-kanban")), t.from !== t.to && H(t.from.closest(".colonne-kanban"));
      }
    });
  });
}
async function qe(e) {
  if (!r.map?.DEADLINE)
    return;
  const n = Array.from(e.querySelectorAll(".carte")).filter((o) => {
    const s = V(o.dataset.deadline);
    return s === null || s >= C.getTime();
  });
  if (n.length === 0)
    return;
  let i = C.getFullYear();
  const a = n.map((o) => {
    const s = `${i}-01-01`;
    return i += 1, o.dataset.deadline = s, r.formatRecord(o.dataset.todoId, { DEADLINE: s });
  });
  await r.updateRecords(a);
}
function te(e) {
  if (!e)
    return;
  const t = e.dataset.isdone === "true", n = Array.from(e.children);
  n.sort((i, a) => {
    let o = 0;
    return r.map?.DEADLINE && (t ? o = P(a.dataset.lastUpdate, 0) - P(i.dataset.lastUpdate, 0) : o = P(i.dataset.deadline, Number.MAX_SAFE_INTEGER) - P(a.dataset.deadline, Number.MAX_SAFE_INTEGER)), o !== 0 ? o : (Number(i.dataset.todoId) || 0) - (Number(a.dataset.todoId) || 0);
  }), n.forEach((i) => e.appendChild(i));
}
function H(e) {
  if (!e)
    return;
  const t = e.querySelector(".contenu-colonne"), n = e.querySelector(".compteur-colonne");
  t && n && (n.textContent = `(${t.children.length})`);
}
async function x(e) {
  const t = document.getElementById("popup-todo");
  if (!t)
    return;
  if (r.opt.readonly) {
    D();
    return;
  }
  document.querySelector(".carte.active")?.classList.remove("active"), Ne(e.id)?.classList.add("active");
  const n = X(e.STATUT), i = r.col.STATUT.getColor(e.STATUT) ?? K, a = r.col.STATUT.getTextColor(e.STATUT) ?? ae;
  t.style.borderLeftColor = i, t.dataset.statut = l(e.STATUT), t.dataset.isdone = n?.isdone ? "true" : "false", t.dataset.currentTodo = String(e.id);
  const o = t.querySelector(".popup-title"), s = t.querySelector(".popup-content"), c = t.querySelector(".popup-header"), d = t.querySelector(".bouton-fermer");
  if (o && (o.textContent = l(e.DESCRIPTION) || g("New task")), c && (c.style.backgroundColor = i, c.style.color = a), d && (d.style.color = a), !s)
    return;
  const f = r.col.DESCRIPTION.getIsFormula(), h = r.map?.NOTES ? r.col.NOTES.getIsFormula() : !1;
  let p = `
        <div class="task-main-fields">
            <div class="field field-primary">
                <label class="field-label">Nom de la tâche</label>
                <textarea
                    class="field-textarea auto-expand task-title-input"
                    onchange="mettreAJourChamp(${Number(e.id)}, 'DESCRIPTION', this.value, event)"
                    oninput="ajusterTextarea(this)"
                    ${f ? "disabled" : ""}
                >${m(l(e.DESCRIPTION))}</textarea>
            </div>
            ${r.map?.NOTES ? `<div class="field field-primary">
                    <label class="field-label">Notes</label>
                    <textarea
                        class="field-textarea auto-expand notes-input"
                        onchange="mettreAJourChamp(${Number(e.id)}, 'NOTES', this.value, event)"
                        oninput="ajusterTextarea(this)"
                        ${h ? "disabled" : ""}
                    >${m(l(e.NOTES))}</textarea>
                  </div>` : ""}
        </div>
    `;
  const E = [];
  r.map?.ETIQUETTES && E.push(We(e)), r.map?.RESPONSABLE && E.push(je(
    e.id,
    ot(e),
    r.map.RESPONSABLE,
    r.col.RESPONSABLE.getIsFormula()
  )), r.map?.DEADLINE && E.push(`
            <div class="field">
                <label class="field-label">Échéance</label>
                <input
                    type="date"
                    class="field-input"
                    value="${u(lt(e.DEADLINE))}"
                    onchange="mettreAJourChamp(${Number(e.id)}, 'DEADLINE', this.value || null, event)"
                    ${r.col.DEADLINE.getIsFormula() ? "disabled" : ""}
                >
            </div>
        `), r.map?.REFERENCE_PROJET && E.push(ne(
    e.id,
    e.REFERENCE_PROJET,
    r.valuesList.ref,
    "Référence projet",
    "REFERENCE_PROJET",
    r.col.REFERENCE_PROJET.getIsFormula()
  )), r.map?.COULEUR && E.push(ne(
    e.id,
    e.COULEUR,
    r.valuesList.cardcolor,
    "Couleur de carte",
    "COULEUR",
    r.col.COULEUR.getIsFormula()
  ));
  for (let T = 0; T < E.length; T += 2)
    p += `<div class="field-row">${E[T]}${E[T + 1] || ""}</div>`;
  r.map?.PIECES_JOINTES && (p += ze(e)), r.map?.COMMENTAIRES && (p += et(e));
  const S = st(e);
  S && (p += `<div class="info-creation">${S}</div>`), p += `
        <div class="popup-actions">
            <button
                type="button"
                class="popup-action-button bouton-supprimer"
                onclick="supprimerTodo(${Number(e.id)}, event)"
                title="${u(g("Remove the task"))}"
                aria-label="${u(g("Remove the task"))}"
            >🗑️</button>
        </div>
    `, s.innerHTML = p, s.querySelectorAll(".auto-expand").forEach(G), t.classList.add("visible"), r.map?.PIECES_JOINTES && await Q(e.id);
}
function ne(e, t, n, i, a, o) {
  const s = l(t), c = [...new Set(R(n))], d = m(i);
  if (c.length > 0 && c.length < 20) {
    const f = c.map((h) => `
            <option value="${u(h)}" ${h === s ? "selected" : ""}>${m(h)}</option>
        `).join("");
    return `
            <div class="field">
                <label class="field-label">${d}</label>
                <select
                    class="field-select"
                    onchange="mettreAJourChamp(${Number(e)}, '${J(a)}', this.value || null, event)"
                    ${o ? "disabled" : ""}
                >
                    <option value=""></option>
                    ${f}
                </select>
            </div>
        `;
  }
  if (c.length >= 20) {
    const f = `list-${a}-${e}`.replace(/[^a-zA-Z0-9_-]/g, "-"), h = c.map((p) => `<option value="${u(p)}"></option>`).join("");
    return `
            <div class="field">
                <label class="field-label">${d}</label>
                <input
                    type="text"
                    list="${f}"
                    class="field-input"
                    value="${u(s)}"
                    onchange="mettreAJourChamp(${Number(e)}, '${J(a)}', this.value || null, event)"
                    ${o ? "disabled" : ""}
                >
                <datalist id="${f}">${h}</datalist>
            </div>
        `;
  }
  return `
        <div class="field">
            <label class="field-label">${d}</label>
            <input
                type="text"
                class="field-input"
                value="${u(s)}"
                onchange="mettreAJourChamp(${Number(e)}, '${J(a)}', this.value || null, event)"
                ${o ? "disabled" : ""}
            >
        </div>
    `;
}
function je(e, t, n, i) {
  const a = new Set(Y(t)), o = w.map((c) => `
        <label class="multi-option" data-search="${u(c.label.toLocaleLowerCase(r.cultureFull))}">
            <input
                type="checkbox"
                value="${c.id}"
                data-label="${u(c.label)}"
                ${a.has(c.id) ? "checked" : ""}
                onchange="mettreAJourChampResponsables(${Number(e)}, this.closest('.multi-dropdown'), event)"
                ${i ? "disabled" : ""}
            >
            <span>${m(c.label)}</span>
        </label>
    `).join(""), s = [...a].map((c) => A.get(c)?.label).filter(Boolean);
  return `
        <div class="field field-responsables">
            <label class="field-label">${m(n)}</label>
            <details class="multi-dropdown responsables-dropdown" data-row-id="${Number(e)}">
                <summary>${m(ce(s))}</summary>
                <div class="multi-dropdown-menu">
                    <div class="multi-toolbar">
                        <input
                            type="search"
                            class="multi-search"
                            placeholder="Rechercher…"
                            oninput="filtrerOptionsMultiples(this)"
                            onclick="event.stopPropagation()"
                            ${i ? "disabled" : ""}
                        >
                        <button type="button" class="multi-clear" onclick="viderResponsables(this, event)" ${i ? "disabled" : ""}>Effacer</button>
                    </div>
                    <div class="multi-options">${o || '<div class="multi-empty">Aucun membre disponible</div>'}</div>
                    <div class="multi-status" aria-live="polite"></div>
                </div>
            </details>
        </div>
    `;
}
function ce(e) {
  const t = R(e);
  return t.length === 0 ? "Choisir…" : t.length === 1 ? t[0] : `${t.length} responsables`;
}
function Be(e) {
  const t = e.closest(".multi-dropdown");
  if (!t)
    return;
  const n = e.value.trim().toLocaleLowerCase(r.cultureFull);
  t.querySelectorAll(".multi-option").forEach((i) => {
    i.hidden = n !== "" && !l(i.dataset.search).includes(n);
  });
}
function Fe(e, t) {
  t?.preventDefault(), t?.stopPropagation();
  const n = e.closest(".multi-dropdown");
  n && (n.querySelectorAll('input[type="checkbox"]:checked').forEach((i) => {
    i.checked = !1;
  }), le(Number(n.dataset.rowId), n, t));
}
async function le(e, t, n) {
  n?.stopPropagation();
  const i = Number(e || t?.dataset?.rowId);
  if (!Number.isInteger(i) || i <= 0 || !t)
    return;
  const a = Array.from(t.querySelectorAll('input[type="checkbox"]:checked')).map((d) => Number(d.value)).filter((d) => Number.isInteger(d) && d > 0 && A.has(d)), o = a.map((d) => A.get(d).label);
  t.querySelector("summary").textContent = ce(o), y(t, "saving", "Enregistrement…");
  const c = (L.get(i) || Promise.resolve()).catch(() => {
  }).then(() => He(i, a)).then(() => {
    Ke(i, a), y(t, "saved", "Enregistré"), window.setTimeout(() => y(t, "", ""), 1200);
  }).catch((d) => {
    y(t, "error", "Échec de l’enregistrement"), console.error("Erreur lors de l’enregistrement des responsables :", d);
  }).finally(() => {
    L.get(i) === c && L.delete(i);
  });
  L.set(i, c), await c;
}
async function He(e, t) {
  const n = r.map?.RESPONSABLE;
  if (!n || Array.isArray(n))
    throw new Error("La colonne Responsable n’est pas correctement mappée.");
  await grist.getTable().update({
    id: Number(e),
    fields: { [n]: [...t] }
  }), await z(e);
}
function Ke(e, t) {
  const n = v(e);
  n && (n.RESPONSABLE_id = [...t], n.RESPONSABLE = t.map((i) => A.get(i)?.label).filter(Boolean));
}
function We(e) {
  const t = new Set(R(e.ETIQUETTES)), n = $.map((i) => {
    const a = r.col.ETIQUETTES.getColor(i) || "#dfe3e8", o = r.col.ETIQUETTES.getTextColor(i) || "#273142";
    return `
            <label class="multi-option etiquette-option" data-search="${u(i.toLocaleLowerCase(r.cultureFull))}">
                <input
                    type="checkbox"
                    value="${u(i)}"
                    ${t.has(i) ? "checked" : ""}
                    onchange="mettreAJourEtiquettes(${Number(e.id)}, this.closest('.multi-dropdown'), event)"
                    ${r.col.ETIQUETTES.getIsFormula() ? "disabled" : ""}
                >
                <span class="etiquette-preview" style="background:${u(a)};color:${u(o)}">${m(i)}</span>
            </label>
        `;
  }).join("");
  return `
        <div class="field field-etiquettes">
            <label class="field-label">Étiquettes</label>
            <details class="multi-dropdown etiquettes-dropdown" data-row-id="${Number(e.id)}">
                <summary>${m(ue([...t]))}</summary>
                <div class="multi-dropdown-menu">
                    <div class="multi-toolbar">
                        <input type="search" class="multi-search" placeholder="Rechercher…" oninput="filtrerOptionsMultiples(this)" onclick="event.stopPropagation()">
                        <button type="button" class="multi-clear" onclick="viderEtiquettes(this, event)">Effacer</button>
                    </div>
                    <div class="multi-options">${n || '<div class="multi-empty">Ajoutez des choix dans la colonne Étiquettes de Grist</div>'}</div>
                    <div class="multi-status" aria-live="polite"></div>
                </div>
            </details>
        </div>
    `;
}
function ue(e) {
  const t = R(e);
  return t.length === 0 ? "Choisir…" : t.length === 1 ? t[0] : `${t.length} étiquettes`;
}
function Qe(e, t) {
  t?.preventDefault(), t?.stopPropagation();
  const n = e.closest(".multi-dropdown");
  n?.querySelectorAll('input[type="checkbox"]:checked').forEach((i) => {
    i.checked = !1;
  }), n && de(Number(n.dataset.rowId), n, t);
}
async function de(e, t, n) {
  n?.stopPropagation();
  const i = Number(e || t?.dataset?.rowId);
  if (!Number.isInteger(i) || i <= 0 || !t)
    return;
  const a = Array.from(t.querySelectorAll('input[type="checkbox"]:checked')).map((c) => l(c.value)).filter((c) => $.includes(c));
  t.querySelector("summary").textContent = ue(a), y(t, "saving", "Enregistrement…");
  const s = (O.get(i) || Promise.resolve()).catch(() => {
  }).then(async () => {
    const c = r.map?.ETIQUETTES;
    if (!c || Array.isArray(c))
      throw new Error("La colonne Étiquettes n’est pas correctement mappée.");
    await grist.getTable().update({
      id: i,
      fields: { [c]: ["L", ...a] }
    }), await z(i);
  }).then(() => {
    const c = v(i);
    c && (c.ETIQUETTES = [...a]), y(t, "saved", "Enregistré"), window.setTimeout(() => y(t, "", ""), 1200);
  }).catch((c) => {
    y(t, "error", "Échec de l’enregistrement"), console.error("Erreur lors de l’enregistrement des étiquettes :", c);
  }).finally(() => {
    O.get(i) === s && O.delete(i);
  });
  O.set(i, s), await s;
}
function y(e, t, n) {
  const i = e?.querySelector(".multi-status");
  i && (i.className = `multi-status${t ? ` ${t}` : ""}`, i.textContent = n);
}
function ze(e) {
  const t = r.col.PIECES_JOINTES.getIsFormula();
  return `
        <section class="detail-section attachments-section" data-row-id="${Number(e.id)}">
            <div class="detail-section-header">
                <div>
                    <h3>📎 Pièces jointes</h3>
                    <p>Images, PDF et autres fichiers</p>
                </div>
                <label class="attachment-upload-button ${t ? "disabled" : ""}">
                    <span>Ajouter</span>
                    <input
                        type="file"
                        multiple
                        onchange="ajouterPiecesJointes(${Number(e.id)}, this, event)"
                        ${t ? "disabled" : ""}
                    >
                </label>
            </div>
            <div id="attachments-status-${Number(e.id)}" class="section-status" aria-live="polite"></div>
            <div id="attachments-list-${Number(e.id)}" class="attachments-grid">
                <div class="section-loading">Chargement des pièces jointes…</div>
            </div>
        </section>
    `;
}
async function Q(e) {
  const t = document.getElementById(`attachments-list-${Number(e)}`);
  if (!t)
    return;
  const n = v(e), i = N(n?.PIECES_JOINTES);
  if (i.length === 0) {
    t.innerHTML = '<div class="section-empty">Aucune pièce jointe</div>';
    return;
  }
  t.innerHTML = '<div class="section-loading">Chargement des aperçus…</div>';
  try {
    const [a] = await Promise.all([
      fe(!0),
      W()
    ]);
    t.innerHTML = i.map((o) => ie(e, o, a)).join("");
  } catch (a) {
    console.error("Impossible d’afficher les pièces jointes :", a), t.innerHTML = i.map((o) => ie(e, o, null)).join("");
  }
}
function ie(e, t, n) {
  const i = he(t), a = n ? Ee(n, t) : "", o = ge(i), s = o === "image" && a ? `<img src="${u(a)}" alt="${u(i.fileName)}" loading="lazy">` : `<div class="attachment-file-icon">${be(o)}</div>`;
  return `
        <article class="attachment-card">
            <button type="button" class="attachment-preview" onclick="ouvrirPieceJointe(${Number(e)}, ${Number(t)}, event)" title="Ouvrir ${u(i.fileName)}">
                ${s}
            </button>
            <div class="attachment-info">
                <div class="attachment-name" title="${u(i.fileName)}">${m(i.fileName)}</div>
                <div class="attachment-meta">${m(ut(i.fileSize))}</div>
            </div>
            <div class="attachment-actions">
                <button type="button" onclick="ouvrirPieceJointe(${Number(e)}, ${Number(t)}, event)" title="Visualiser">👁</button>
                <button type="button" onclick="retirerPieceJointe(${Number(e)}, ${Number(t)}, event)" title="Retirer de la tâche">×</button>
            </div>
        </article>
    `;
}
async function Ge(e, t, n) {
  n?.stopPropagation();
  const i = Array.from(t?.files || []);
  if (i.length === 0)
    return;
  const a = i.find((o) => o.size > _e);
  if (a) {
    b("attachments", e, "error", `${a.name} dépasse 50 Mo.`), t.value = "";
    return;
  }
  t.disabled = !0, b("attachments", e, "saving", `Envoi de ${i.length} fichier(s)…`);
  try {
    const o = await grist.docApi.getAccessToken({ readOnly: !1 }), s = new FormData();
    i.forEach((S) => s.append("upload", S, S.name));
    const c = await fetch(`${o.baseUrl}/attachments?auth=${encodeURIComponent(o.token)}`, {
      method: "POST",
      body: s,
      headers: { "X-Requested-With": "XMLHttpRequest" }
    });
    if (!c.ok)
      throw new Error(`Upload échoué (${c.status} ${c.statusText})`);
    const d = await c.json(), f = N(d);
    if (f.length === 0)
      throw new Error("Grist n’a retourné aucun identifiant de pièce jointe.");
    const h = v(e), p = N(h?.PIECES_JOINTES), E = [.../* @__PURE__ */ new Set([...p, ...f])];
    await me(e, E), h && (h.PIECES_JOINTES = [...E]), k = !1, await W(!0), await Q(e), b("attachments", e, "saved", "Pièce(s) jointe(s) ajoutée(s).");
  } catch (o) {
    console.error("Erreur pendant l’ajout des pièces jointes :", o), b("attachments", e, "error", o.message || "Échec de l’envoi.");
  } finally {
    t.value = "", t.disabled = !1;
  }
}
async function Xe(e, t, n) {
  n?.preventDefault(), n?.stopPropagation();
  const i = v(e), o = N(i?.PIECES_JOINTES).filter((s) => s !== Number(t));
  try {
    b("attachments", e, "saving", "Mise à jour…"), await me(e, o), i && (i.PIECES_JOINTES = [...o]), await Q(e), b("attachments", e, "saved", "Pièce jointe retirée de la tâche.");
  } catch (s) {
    console.error("Erreur pendant le retrait de la pièce jointe :", s), b("attachments", e, "error", "Impossible de retirer la pièce jointe.");
  }
}
async function me(e, t) {
  const n = r.map?.PIECES_JOINTES;
  if (!n || Array.isArray(n))
    throw new Error("La colonne Pièces jointes n’est pas correctement mappée.");
  await grist.getTable().update({
    id: Number(e),
    fields: { [n]: ["L", ...t] }
  }), await z(e);
}
async function Ye(e, t, n) {
  n?.preventDefault(), n?.stopPropagation();
  try {
    const [i] = await Promise.all([
      fe(!0),
      W()
    ]), a = he(t), o = Ee(i, t);
    Ze(a, o);
  } catch (i) {
    console.error("Impossible d’ouvrir la pièce jointe :", i), window.alert("Impossible d’ouvrir cette pièce jointe.");
  }
}
function Ve() {
  if (document.getElementById("attachment-viewer"))
    return;
  const e = document.createElement("div");
  e.id = "attachment-viewer", e.className = "attachment-viewer", e.setAttribute("aria-hidden", "true"), e.innerHTML = `
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
    `, document.body.appendChild(e);
}
function Ze(e, t) {
  const n = document.getElementById("attachment-viewer"), i = document.getElementById("attachment-viewer-content"), a = document.getElementById("attachment-viewer-title"), o = document.getElementById("attachment-viewer-download");
  if (!n || !i || !a || !o)
    return;
  a.textContent = e.fileName, o.href = t;
  const s = ge(e);
  s === "image" ? i.innerHTML = `<img src="${u(t)}" alt="${u(e.fileName)}">` : s === "pdf" ? i.innerHTML = `<iframe src="${u(t)}" title="${u(e.fileName)}"></iframe>` : s === "video" ? i.innerHTML = `<video src="${u(t)}" controls autoplay></video>` : s === "audio" ? i.innerHTML = `<div class="attachment-generic-preview"><div class="attachment-large-icon">🎵</div><audio src="${u(t)}" controls autoplay></audio></div>` : i.innerHTML = `<div class="attachment-generic-preview"><div class="attachment-large-icon">${be(s)}</div><p>Ce format ne dispose pas d’un aperçu intégré.</p><a href="${u(t)}" target="_blank" rel="noopener">Ouvrir ou télécharger le fichier</a></div>`, n.classList.add("visible"), n.setAttribute("aria-hidden", "false");
}
function pe(e) {
  e?.preventDefault(), e?.stopPropagation();
  const t = document.getElementById("attachment-viewer");
  if (!t)
    return;
  t.classList.remove("visible"), t.setAttribute("aria-hidden", "true");
  const n = document.getElementById("attachment-viewer-content");
  n && (n.innerHTML = "");
}
async function fe(e = !0) {
  if (e && M && Date.now() - Z < Oe)
    return M;
  const t = await grist.docApi.getAccessToken({ readOnly: e });
  return e && (M = t, Z = Date.now()), t;
}
function Ee(e, t) {
  return `${e.baseUrl}/attachments/${Number(t)}/download?auth=${encodeURIComponent(e.token)}`;
}
function he(e) {
  return F.get(Number(e)) || {
    id: Number(e),
    fileName: `Pièce jointe ${Number(e)}`,
    fileExt: "",
    fileType: "",
    fileSize: 0,
    imageWidth: 0,
    imageHeight: 0
  };
}
function ge(e) {
  const t = l(e.fileExt || Le(e.fileName)).toLowerCase().replace(/^\./, ""), n = l(e.fileType).toLowerCase();
  return n.startsWith("image/") || ["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp", "avif"].includes(t) ? "image" : n === "application/pdf" || t === "pdf" ? "pdf" : n.startsWith("video/") || ["mp4", "webm", "mov", "m4v", "ogv"].includes(t) ? "video" : n.startsWith("audio/") || ["mp3", "wav", "ogg", "m4a", "aac", "flac"].includes(t) ? "audio" : ["doc", "docx", "odt"].includes(t) ? "document" : ["xls", "xlsx", "ods", "csv"].includes(t) ? "tableur" : ["ppt", "pptx", "odp"].includes(t) ? "presentation" : ["zip", "rar", "7z", "tar", "gz"].includes(t) ? "archive" : "file";
}
function be(e) {
  return {
    image: "🖼️",
    pdf: "📕",
    video: "🎬",
    audio: "🎵",
    document: "📄",
    tableur: "📊",
    presentation: "📽️",
    archive: "🗜️",
    file: "📎"
  }[e] || "📎";
}
function et(e) {
  const t = j(e.COMMENTAIRES), n = localStorage.getItem("kanban2-comment-author") || "";
  return `
        <section class="detail-section comments-section" data-row-id="${Number(e.id)}">
            <div class="detail-section-header">
                <div>
                    <h3>💬 Commentaires</h3>
                    <p>${t.length} commentaire(s)</p>
                </div>
            </div>
            <div id="comments-list-${Number(e.id)}" class="comments-list">
                ${ve(t, e.id)}
            </div>
            <div class="comment-composer">
                <input
                    type="text"
                    class="comment-author"
                    value="${u(n)}"
                    placeholder="Votre nom"
                    onchange="memoriserAuteurCommentaire(this.value)"
                >
                <textarea class="comment-input" placeholder="Écrire un commentaire…" oninput="ajusterTextarea(this)"></textarea>
                <div class="comment-composer-footer">
                    <div id="comments-status-${Number(e.id)}" class="section-status" aria-live="polite"></div>
                    <button type="button" onclick="ajouterCommentaire(${Number(e.id)}, this, event)">Commenter</button>
                </div>
            </div>
        </section>
    `;
}
function ve(e, t) {
  return e.length === 0 ? '<div class="section-empty">Aucun commentaire</div>' : e.map((n) => `
        <article class="comment-card" data-comment-id="${u(n.id)}">
            <div class="comment-header">
                <strong>${m(n.author || "Anonyme")}</strong>
                <span>${m(ct(n.createdAt))}</span>
                <button type="button" onclick="supprimerCommentaire(${Number(t)}, '${J(n.id)}', event)" title="Supprimer le commentaire">×</button>
            </div>
            <div class="comment-body">${m(n.text).replace(/\n/g, "<br>")}</div>
        </article>
    `).join("");
}
function j(e) {
  const t = l(e).trim();
  if (!t)
    return [];
  try {
    const n = JSON.parse(t);
    if (!Array.isArray(n))
      throw new Error("Format non tableau");
    return n.map((i, a) => ({
      id: l(i?.id) || `legacy-${a}`,
      author: l(i?.author) || "Anonyme",
      createdAt: l(i?.createdAt),
      text: l(i?.text)
    })).filter((i) => i.text.trim());
  } catch {
    return [{
      id: "legacy-text",
      author: "Ancien commentaire",
      createdAt: "",
      text: t
    }];
  }
}
function Te(e) {
  localStorage.setItem("kanban2-comment-author", l(e).trim());
}
async function tt(e, t, n) {
  n?.preventDefault(), n?.stopPropagation();
  const i = t.closest(".comments-section"), a = i?.querySelector(".comment-input"), o = i?.querySelector(".comment-author"), s = l(a?.value).trim(), c = l(o?.value).trim() || "Anonyme";
  if (!s) {
    b("comments", e, "error", "Écrivez un commentaire."), a?.focus();
    return;
  }
  Te(c), t.disabled = !0, b("comments", e, "saving", "Enregistrement…");
  const d = {
    id: dt(),
    author: c,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    text: s
  };
  try {
    await ye(e, (f) => [...f, d]), a && (a.value = "", G(a)), Se(e), b("comments", e, "saved", "Commentaire ajouté.");
  } catch (f) {
    console.error("Erreur pendant l’ajout du commentaire :", f), b("comments", e, "error", "Impossible d’ajouter le commentaire.");
  } finally {
    t.disabled = !1;
  }
}
async function nt(e, t, n) {
  n?.preventDefault(), n?.stopPropagation();
  try {
    b("comments", e, "saving", "Suppression…"), await ye(e, (i) => i.filter((a) => a.id !== t)), Se(e), b("comments", e, "saved", "Commentaire supprimé.");
  } catch (i) {
    console.error("Erreur pendant la suppression du commentaire :", i), b("comments", e, "error", "Impossible de supprimer le commentaire.");
  }
}
async function ye(e, t) {
  const n = Number(e), a = (_.get(n) || Promise.resolve()).catch(() => {
  }).then(async () => {
    const o = v(n), s = j(o?.COMMENTAIRES), c = t(s), d = JSON.stringify(c);
    await r.updateRecords(r.formatRecord(n, {
      COMMENTAIRES: d,
      ...r.map?.DERNIERE_MISE_A_JOUR && !r.col.DERNIERE_MISE_A_JOUR.getIsFormula() ? { DERNIERE_MISE_A_JOUR: (/* @__PURE__ */ new Date()).toISOString() } : {}
    })), o && (o.COMMENTAIRES = d);
  }).finally(() => {
    _.get(n) === a && _.delete(n);
  });
  return _.set(n, a), a;
}
function Se(e) {
  const t = v(e), n = j(t?.COMMENTAIRES), i = document.getElementById(`comments-list-${Number(e)}`), a = i?.closest(".comments-section");
  i && (i.innerHTML = ve(n, e));
  const o = a?.querySelector(".detail-section-header p");
  o && (o.textContent = `${n.length} commentaire(s)`);
}
async function Ae(e, t, n, i) {
  i?.stopPropagation();
  try {
    t === "STATUT" && X(n)?.useconfetti && pt();
    const a = { [t]: n };
    r.map?.DERNIERE_MISE_A_JOUR && t !== "DERNIERE_MISE_A_JOUR" && !r.col.DERNIERE_MISE_A_JOUR.getIsFormula() && (a.DERNIERE_MISE_A_JOUR = (/* @__PURE__ */ new Date()).toISOString()), await r.updateRecords(r.formatRecord(e, a));
    const o = v(e);
    o && (o[t] = n, a.DERNIERE_MISE_A_JOUR && (o.DERNIERE_MISE_A_JOUR = a.DERNIERE_MISE_A_JOUR));
  } catch (a) {
    throw console.error(g("Error during update:"), a), a;
  }
}
async function z(e) {
  if (!(!r.map?.DERNIERE_MISE_A_JOUR || r.col.DERNIERE_MISE_A_JOUR.getIsFormula()))
    try {
      const t = (/* @__PURE__ */ new Date()).toISOString();
      await r.updateRecords(r.formatRecord(e, { DERNIERE_MISE_A_JOUR: t }));
      const n = v(e);
      n && (n.DERNIERE_MISE_A_JOUR = t);
    } catch (t) {
      console.warn("Données enregistrées, mais date technique non modifiée :", t);
    }
}
async function it(e) {
  try {
    const t = { DESCRIPTION: "", STATUT: e };
    r.map?.REFERENCE_PROJET && !r.col.REFERENCE_PROJET.getIsFormula() && (t.REFERENCE_PROJET = null), r.map?.DERNIERE_MISE_A_JOUR && !r.col.DERNIERE_MISE_A_JOUR.getIsFormula() && (t.DERNIERE_MISE_A_JOUR = (/* @__PURE__ */ new Date()).toISOString()), r.map?.CREE_LE && !r.col.CREE_LE.getIsFormula() && (t.CREE_LE = (/* @__PURE__ */ new Date()).toISOString()), r.map?.COMMENTAIRES && !r.col.COMMENTAIRES.getIsFormula() && (t.COMMENTAIRES = "[]");
    const n = await r.createRecords({ fields: t });
    if (n?.id > 0) {
      grist.setCursorPos({ rowId: n.id });
      const i = await r.fetchSelectedRecord(n.id);
      r.opt.hideedit || x(i);
    }
  } catch (t) {
    console.error(g("Error on creation:"), t);
  }
}
async function rt(e, t) {
  if (t?.stopPropagation(), !!confirm(g("Are you sure you want to delete this task?")))
    try {
      await r.destroyRecords(e), D();
    } catch (n) {
      console.error(g("Error on delete:"), n);
    }
}
function D() {
  const e = document.getElementById("popup-todo");
  e && (Ne(e.dataset.currentTodo)?.classList.remove("active"), e.classList.remove("visible"), Ie());
}
function at(e, t) {
  if (t?.stopPropagation(), !e)
    return;
  e.classList.toggle("collapsed");
  const n = e.querySelector(".titre-statut")?.childNodes?.[0]?.textContent?.trim() || e.id;
  localStorage.setItem(Ce(n), String(e.classList.contains("collapsed")));
}
function G(e) {
  e && (e.style.height = "", e.style.height = `${Math.max(e.scrollHeight, 42)}px`);
}
function Ie(e = null) {
  document.querySelectorAll(".multi-dropdown[open]").forEach((t) => {
    t !== e && t.removeAttribute("open");
  });
}
document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape")
    return;
  if (document.getElementById("attachment-viewer")?.classList.contains("visible")) {
    pe(e);
    return;
  }
  const n = document.querySelector(".multi-dropdown[open]");
  n ? n.removeAttribute("open") : D();
});
document.addEventListener("click", (e) => {
  const t = e.target.closest(".multi-dropdown");
  Ie(t);
  const n = document.getElementById("popup-todo");
  if (!n?.classList.contains("visible"))
    return;
  const i = n.contains(e.target), a = !!e.target.closest(".carte"), o = !!e.target.closest("#attachment-viewer");
  !i && !a && !o && D();
});
function v(e) {
  return I.find((t) => Number(t.id) === Number(e)) || null;
}
function Ne(e) {
  return Array.from(document.querySelectorAll(".carte")).find((t) => Number(t.dataset.todoId) === Number(e)) || null;
}
function Re(e) {
  return {
    addbutton: !1,
    isdone: !1,
    useconfetti: !1,
    hidecolumn: !1,
    ...(Array.isArray(r.opt?.columns) ? r.opt.columns : [])[e] || {}
  };
}
function X(e) {
  const n = (r.valuesList?.columns || []).indexOf(e);
  return n >= 0 ? Re(n) : null;
}
function Ce(e) {
  return `column-todo-${l(e)}`;
}
function ot(e) {
  const t = Y(e?.RESPONSABLE_id);
  if (t.length > 0)
    return t;
  const n = we(e), i = [...w];
  return n.flatMap((a) => {
    const o = i.findIndex((c) => c.label === a);
    if (o < 0)
      return [];
    const [s] = i.splice(o, 1);
    return [s.id];
  });
}
function we(e) {
  const t = R(e?.RESPONSABLE).filter((n) => n !== "#KeyError");
  return t.length > 0 ? t : Y(e?.RESPONSABLE_id).map((n) => A.get(n)?.label).filter(Boolean);
}
function Y(e) {
  return N(e);
}
function N(e) {
  let t = $e(e);
  return t[0] === "L" && (t = t.slice(1)), [...new Set(t.flatMap((n) => Array.isArray(n) ? n : [n]).map(Number).filter((n) => Number.isInteger(n) && n > 0))];
}
function R(e) {
  let t = $e(e);
  return t[0] === "L" && (t = t.slice(1)), [...new Set(t.flatMap((n) => Array.isArray(n) ? n : [n]).map(l).map((n) => n.trim()).filter(Boolean))];
}
function $e(e) {
  return e == null || e === "" ? [] : Array.isArray(e) ? e : [e];
}
function l(e) {
  return e == null ? "" : String(e);
}
function st(e) {
  const t = !!(r.map?.CREE_LE && e.CREE_LE), n = !!(r.map?.CREE_PAR && e.CREE_PAR);
  if (!t && !n)
    return "";
  const i = [m(g("Created"))];
  return t && i.push(m(g("on %on", { on: De(e.CREE_LE) }))), n && i.push(m(g("by %by", { by: l(e.CREE_PAR) }))), i.join(" ");
}
function b(e, t, n, i) {
  const a = document.getElementById(`${e}-status-${Number(t)}`);
  a && (a.className = `section-status${n ? ` ${n}` : ""}`, a.textContent = i);
}
function De(e) {
  if (!e) return "";
  const t = new Date(e);
  if (Number.isNaN(t.getTime()) || t >= C) return "";
  const n = String(t.getDate()).padStart(2, "0"), i = t.toLocaleDateString(r.cultureFull, { month: "short" });
  return `${n} ${i} ${t.getFullYear()}`;
}
function ct(e) {
  if (!e) return "";
  const t = new Date(e);
  return Number.isNaN(t.getTime()) ? "" : t.toLocaleString(r.cultureFull, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
function lt(e) {
  if (!e) return "";
  const t = new Date(e);
  return Number.isNaN(t.getTime()) || t >= C ? "" : t.toISOString().split("T")[0];
}
function re(e) {
  if (!e) return "";
  const t = new Date(e);
  return Number.isNaN(t.getTime()) ? l(e) : t.toISOString();
}
function V(e) {
  if (!e) return null;
  const t = new Date(e).getTime();
  return Number.isNaN(t) ? null : t;
}
function P(e, t) {
  return V(e) ?? t;
}
function ut(e) {
  const t = Number(e) || 0;
  if (t <= 0) return "";
  const n = ["o", "Ko", "Mo", "Go"], i = Math.min(Math.floor(Math.log(t) / Math.log(1024)), n.length - 1);
  return `${(t / 1024 ** i).toFixed(i === 0 ? 0 : 1)} ${n[i]}`;
}
function Le(e) {
  const t = l(e).match(/(\.[^.]+)$/);
  return t ? t[1] : "";
}
function dt() {
  return globalThis.crypto?.randomUUID ? crypto.randomUUID() : `comment-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
function m(e) {
  return l(e).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function u(e) {
  return m(e).replace(/`/g, "&#096;");
}
function J(e) {
  return l(e).replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(/\r/g, "\\r").replace(/\n/g, "\\n");
}
function mt(e) {
  return encodeURIComponent(l(e)).replace(/'/g, "%27");
}
function pt() {
  if (typeof confetti != "function") return;
  const e = 2e3, t = Date.now() + e, n = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1500 }, i = (o, s) => Math.random() * (s - o) + o, a = window.setInterval(() => {
    const o = t - Date.now();
    if (o <= 0) {
      window.clearInterval(a);
      return;
    }
    const s = 50 * (o / e);
    confetti({ ...n, particleCount: s, origin: { x: i(0.1, 0.3), y: Math.random() - 0.2 } }), confetti({ ...n, particleCount: s, origin: { x: i(0.7, 0.9), y: Math.random() - 0.2 } });
  }, 250);
}
window.toggleColonne = at;
window.togglePopupTodo = x;
window.fermerPopup = D;
window.mettreAJourChamp = Ae;
window.creerNouvelleTache = it;
window.supprimerTodo = rt;
window.mettreAJourChampResponsables = le;
window.filtrerOptionsMultiples = Be;
window.viderResponsables = Fe;
window.mettreAJourEtiquettes = de;
window.viderEtiquettes = Qe;
window.ajouterPiecesJointes = Ge;
window.retirerPieceJointe = Xe;
window.ouvrirPieceJointe = Ye;
window.fermerLecteurPieceJointe = pe;
window.memoriserAuteurCommentaire = Te;
window.ajouterCommentaire = tt;
window.supprimerCommentaire = nt;
window.ajusterTextarea = G;
