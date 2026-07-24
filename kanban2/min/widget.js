(function(a){typeof define=="function"&&define.amd?define(a):a()})((function(){"use strict";let a,E;const M=new Date("3000-01-01"),V="#DCDCDC",pe="#000000",et=120*1e3,tt=50*1024*1024,O="__GRIST_USER_NAME__";let I=[],C=[],A=new Map,X=null,$=[],S=new Map,Y=null,Z=new Map,U=!1,x=null,fe=0;const q=new Map,F=new Map,J=new Map,j=new Map,B=new Map;window.addEventListener("load",async()=>{a=new WidgetSDK,E=await a.loadTranslations(["widget.js"]),a.configureOptions([WidgetSDK.newItem("columns",null,"Colonnes du Kanban","Réglez le comportement de chaque statut.","1 — Colonnes",{columnId:"STATUT",template:[WidgetSDK.newItem("addbutton",!0,"Autoriser l’ajout","Afficher un bouton pour créer une carte dans cette colonne."),WidgetSDK.newItem("isdone",!1,"Colonne terminée","Considérer les cartes de cette colonne comme terminées."),WidgetSDK.newItem("useconfetti",!1,"Confettis","Afficher des confettis lorsqu’une carte arrive dans cette colonne."),WidgetSDK.newItem("hidecolumn",!1,"Masquer la colonne","Ne pas afficher cette colonne dans le Kanban.")]}),WidgetSDK.newItem("rotation",!0,"Inclinaison des cartes","Donner un léger effet post-it aux cartes.","2 — Affichage des cartes"),WidgetSDK.newItem("compact",!1,"Mode compact","Réduire les espacements et la hauteur des cartes.","2 — Affichage des cartes"),WidgetSDK.newItem("showlabels",!0,"Afficher les étiquettes","Afficher les étiquettes colorées sur les cartes.","2 — Affichage des cartes"),WidgetSDK.newItem("showmembers",!0,"Afficher les responsables","Afficher les bulles d’initiales sur les cartes.","2 — Affichage des cartes"),WidgetSDK.newItem("showdeadline",!0,"Afficher l’échéance","Afficher la date limite sur les cartes.","2 — Affichage des cartes"),WidgetSDK.newItem("showindicators",!0,"Afficher les indicateurs","Afficher le nombre de pièces jointes et de commentaires.","2 — Affichage des cartes"),WidgetSDK.newItem("defaultcardcolor","#FFFFD1","Couleur par défaut","Couleur utilisée lorsqu’aucune couleur personnalisée n’est enregistrée.","2 — Affichage des cartes"),WidgetSDK.newItem("showattachments",!0,"Pièces jointes","Afficher la section des pièces jointes dans la fiche.","3 — Fiche descriptive"),WidgetSDK.newItem("showcomments",!0,"Commentaires","Afficher la section des commentaires dans la fiche.","3 — Fiche descriptive"),WidgetSDK.newItem("showmetadata",!0,"Informations de suivi","Afficher les lignes « Créé le » et « Modifié le » en bas de la fiche.","3 — Fiche descriptive"),WidgetSDK.newItem("autoclosemenus",!0,"Fermer les menus automatiquement","Fermer les sélecteurs multiples lorsqu’on clique ailleurs.","3 — Fiche descriptive"),WidgetSDK.newItem("readonly",!1,"Lecture seule","Désactiver toutes les modifications depuis le widget.","4 — Comportement"),WidgetSDK.newItem("hideedit",!1,"Masquer la fiche","Ne pas ouvrir la fiche descriptive lors d’un clic sur une carte.","4 — Comportement"),WidgetSDK.newItem("gristeditcard",!1,"Double-clic vers la fiche Grist","Ouvrir la fiche native de Grist lors d’un double-clic.","4 — Comportement"),WidgetSDK.newItem("confirmdelete",!0,"Confirmer les suppressions","Demander une confirmation avant de supprimer une tâche.","4 — Comportement")],"#config-view","#main-view",{onOptChange:Ne,onOptLoad:Ne}),a.initMetaData(),a.ready({requiredAccess:"full",allowSelectBy:!0,columns:[{name:"STATUT",title:"Statut",description:"Colonne du Kanban",type:"Choice",strictType:!0},{name:"DESCRIPTION",title:"Nom de la tâche",description:"Nom principal de la tâche",type:"Any"},{name:"DESCRIPTION_DISPLAY",title:"Affichage de la tâche",description:"Contenu personnalisé facultatif affiché sur la carte",type:"Any",optional:!0},{name:"NOTES",title:"Notes",description:"Notes enrichies enregistrées en HTML sécurisé",type:"Text",strictType:!0,optional:!0},{name:"DEADLINE",title:"Échéance",description:"Date limite ou ordre de priorité",type:"Date",optional:!0},{name:"RESPONSABLE",title:"Responsables",description:"Personnes responsables de la tâche",type:"RefList",strictType:!0,optional:!0},{name:"ETIQUETTES",title:"Étiquettes",description:"Étiquettes multiples référencées depuis une table dédiée",type:"RefList",strictType:!0,optional:!0},{name:"PIECES_JOINTES",title:"Pièces jointes",description:"Fichiers et images associés à la tâche",type:"Attachments",strictType:!0,optional:!0},{name:"COMMENTAIRES",title:"Commentaires",description:"Commentaires du widget stockés en JSON",type:"Text",strictType:!0,optional:!0},{name:"COULEUR",title:"Couleur de carte",description:"Code hexadécimal choisi depuis le widget",type:"Text",strictType:!0,optional:!0},{name:"CREE_PAR",title:"Créé par",type:"Any",optional:!0},{name:"CREE_LE",title:"Date de création",type:"DateTime",optional:!0},{name:"DERNIERE_MISE_A_JOUR",title:"Dernière mise à jour",description:"Date technique affichée dans le suivi",type:"DateTime",optional:!0},{name:"MODIFIE_PAR",title:"Modifié par",description:"Nom de la dernière personne ayant modifié la tâche",type:"Text",strictType:!0,optional:!0}]}),a.onRecords(H,{expandRefs:!1,keepEncoded:!1,mapRef:!0}),a.isLoaded().then(()=>{a.initDone=!0}),grist.on("message",async e=>{e.mappingsChange&&await it()}),Ot()});async function he(e=!1){if(!a?.map?.RESPONSABLE||!a?.col?.RESPONSABLE){ee();return}const t=a.col.RESPONSABLE,n=`${t.type}:${t.visibleCol}`;if(!(!e&&X===n&&C.length>0))try{const r=await be(t),o=r.dataColumns,i=ge(o,["initiales","initiale","initials","abreviation","abréviation","sigle"])||ve(o,r.visibleColumnId),c=i&&Array.isArray(r.table[i])?r.table[i]:[];C=r.ids.map((s,l)=>{const d=u(r.labels[l]).trim(),f=nt(c[l])||Te(d);return{id:Number(s),label:d,initials:f,avatarColor:ye(d||s)}}).filter(s=>Number.isInteger(s.id)&&s.id>0&&s.label&&s.label!=="#KeyError").sort((s,l)=>s.label.localeCompare(l.label,a.cultureFull,{sensitivity:"base"})),A=new Map(C.map(s=>[s.id,s])),X=n}catch(r){ee(),console.error("Impossible de charger la table des responsables :",r)}}function ee(){C=[],A=new Map,X=null}async function Ee(e=!1){if(!a?.map?.ETIQUETTES||!a?.col?.ETIQUETTES){te();return}const t=a.col.ETIQUETTES,n=`${t.type}:${t.visibleCol}`;if(!(!e&&Y===n&&$.length>0))try{const r=await be(t),o=r.dataColumns,i=ge(o,["couleur","color","hex","codecouleur","code_couleur"])||ve(o,r.visibleColumnId),c=i&&Array.isArray(r.table[i])?r.table[i]:[];$=r.ids.map((s,l)=>{const d=u(r.labels[l]).trim(),v=b(c[l])||Ae(d||s);return{id:Number(s),label:d,color:v,textColor:Se(v)}}).filter(s=>Number.isInteger(s.id)&&s.id>0&&s.label&&s.label!=="#KeyError").sort((s,l)=>s.label.localeCompare(l.label,a.cultureFull,{sensitivity:"base"})),S=new Map($.map(s=>[s.id,s])),Y=n}catch(r){te(),console.error("Impossible de charger la table des étiquettes :",r)}}function te(){$=[],S=new Map,Y=null}async function be(e){const[t,n]=u(e?.type).split(":");if(t!=="RefList"||!n||!e?.visibleCol)throw new Error("La colonne doit être une Liste de références avec une colonne visible configurée.");const[r,o]=await Promise.all([grist.docApi.fetchTable(n),e.getMeta(e.visibleCol)]),i=o?.colId;if(!i||!Array.isArray(r?.id)||!Array.isArray(r?.[i]))throw new Error(`La colonne visible de la table ${n} est introuvable.`);const c=Object.keys(r).filter(s=>Array.isArray(r[s])&&s!=="id"&&s!=="manualSort"&&!s.startsWith("gristHelper_"));return{tableId:n,table:r,ids:r.id,labels:r[i],visibleColumnId:i,dataColumns:c}}function ge(e,t){const n=new Set(t.map(we));return e.find(r=>n.has(we(r)))||null}function ve(e,t){const n=e.indexOf(t);return n>=0&&e[n+1]||null}function we(e){return u(e).normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]/gi,"").toLowerCase()}function nt(e){return u(e).trim().replace(/\s+/g,"").slice(0,4).toUpperCase()}function Te(e){const t=u(e).trim().split(/\s+/).filter(Boolean);return t.length===0?"?":t.length===1?t[0].slice(0,2).toUpperCase():`${t[0][0]||""}${t[t.length-1][0]||""}`.toUpperCase()}function ye(e){let t=0;for(const r of u(e))t=(t<<5)-t+r.charCodeAt(0),t|=0;return`hsl(${Math.abs(t)%360} 58% 42%)`}function Ae(e){let t=0;for(const r of u(e))t=(t<<5)-t+r.charCodeAt(0),t|=0;const n=Math.abs(t)%360;return rt(n,62,72)}function rt(e,t,n){t/=100,n/=100;const r=(1-Math.abs(2*n-1))*t,o=r*(1-Math.abs(e/60%2-1)),i=n-r/2;let c=0,s=0,l=0;return e<60?[c,s,l]=[r,o,0]:e<120?[c,s,l]=[o,r,0]:e<180?[c,s,l]=[0,r,o]:e<240?[c,s,l]=[0,o,r]:e<300?[c,s,l]=[o,0,r]:[c,s,l]=[r,0,o],`#${[c,s,l].map(d=>Math.round((d+i)*255).toString(16).padStart(2,"0")).join("")}`.toUpperCase()}function Se(e){const t=b(e)||"#DDE3EA",n=parseInt(t.slice(1,3),16),r=parseInt(t.slice(3,5),16),o=parseInt(t.slice(5,7),16);return(.2126*n+.7152*r+.0722*o)/255>.58?"#1F2937":"#FFFFFF"}async function ne(e=!1){if(!(U&&!e)){Z=new Map,U=!0;try{const t=await grist.docApi.fetchTable("_grist_Attachments");(Array.isArray(t?.id)?t.id:[]).forEach((r,o)=>{const i=Number(r);if(!Number.isInteger(i)||i<=0)return;const c=u(t.fileName?.[o])||`Pièce jointe ${i}`,s=u(t.fileExt?.[o])||Ze(c),l=u(t.fileType?.[o]),d=Number(t.fileSize?.[o])||0;Z.set(i,{id:i,fileName:c,fileExt:s,fileType:l,fileSize:d,imageWidth:Number(t.imageWidth?.[o])||0,imageHeight:Number(t.imageHeight?.[o])||0})})}catch(t){console.warn("Métadonnées des pièces jointes indisponibles :",t)}}}async function H(e){I=Array.isArray(e)?e:[],await Promise.all([he(),Ee()]);const t=document.getElementById("conteneur-kanban");if(!t)return;t.innerHTML="";const n=await a.col.STATUT.getChoices();if(!Array.isArray(n)||n.length===0){t.innerHTML=`<div class="kanban-message">${p(E("No choice available in the Status column"))}</div>`;return}n.forEach((r,o)=>{const i=ot(r,o);i&&t.appendChild(i)}),I.forEach(r=>{const o=u(r.STATUT),i=Array.from(t.querySelectorAll(".contenu-colonne")).find(c=>c.dataset.statut===o);i&&i.insertBefore(st(r),i.firstChild)}),lt(),document.querySelectorAll(".colonne-kanban").forEach(re)}async function Ne(){await a.isMapped(),await H(I)}async function it(){ee(),te(),U=!1,x=null,await Promise.all([he(!0),Ee(!0)]),await H(I)}function ot(e,t){const n=Qe(t);if(n.hidecolumn)return null;const r=u(e),o=document.createElement("section");o.className=`colonne-kanban${!n.addbutton&&!a.opt.compact?" colonne-nobouton":""}`,o.id=r,localStorage.getItem(Ge(r))==="true"&&o.classList.add("collapsed");const i=a.col.STATUT.getColor(r)??V,c=a.col.STATUT.getTextColor(r)??pe,s=Vt(r);return o.innerHTML=`
        <div class="entete-colonne" style="background-color:${i};color:${c}">
            <div class="titre-statut">${p(r)} <span class="compteur-colonne">(0)</span></div>
            <div class="actions-colonne">
                ${n.addbutton&&!a.opt.readonly?`<button type="button" class="bouton-ajouter-entete ${a.opt.compact?"compact":""}" onclick="creerNouvelleTache(decodeURIComponent('${s}'))" aria-label="${m(E("Add a new task"))}">+</button>`:""}
                <button type="button" class="bouton-toggle" onclick="toggleColonne(this.closest('.colonne-kanban'), event)" aria-label="Replier ou déplier">⇄</button>
            </div>
        </div>
        ${n.addbutton&&!a.opt.readonly?`<button type="button" class="bouton-ajouter ${a.opt.compact?"compact":""}" onclick="creerNouvelleTache(decodeURIComponent('${s}'))">+ ${p(E("Add a new task"))}</button>`:""}
        <div class="contenu-colonne" data-statut="${m(r)}" data-isdone="${n.isdone?"true":"false"}"></div>
    `,o}function st(e){const t=document.createElement("article");t.className=`carte${a.opt.rotation?"":" norotate"}${a.opt.compact?" compact":""}`,t.dataset.todoId=String(e.id),t.dataset.lastUpdate=Ye(e.DERNIERE_MISE_A_JOUR),t.dataset.deadline=Ye(e.DEADLINE),ct(t,e.COULEUR);const n=e.DEADLINE?Kt(e.DEADLINE):"",r=jt(e),o=Bt(e),i=T(e.PIECES_JOINTES).length,c=_(e.COMMENTAIRES).length,s=e.DESCRIPTION_DISPLAY?String(e.DESCRIPTION_DISPLAY):p(u(e.DESCRIPTION)||E("No description")),l=o.map(L=>at(L)).join(""),d=r.map(L=>`
            <span
                class="responsable-avatar"
                style="background:${m(L.avatarColor)}"
                title="${m(L.label)}"
                aria-label="${m(L.label)}"
            >${p(L.initials)}</span>
        `).join(""),f=le(e.STATUT),v=me(e.DEADLINE),w=v!==null&&v<Date.now()&&v<M.getTime(),N=a.opt.showlabels!==!1,Yt=a.opt.showmembers!==!1,Zt=a.opt.showdeadline!==!1,en=a.opt.showindicators!==!1;return t.innerHTML=`
        ${N&&l?`<div class="etiquettes-list">${l}</div>`:""}
        <div class="description">${s}</div>
        ${Zt&&n?`<div class="deadline${w?" late":""} truncate">📅 ${p(n)}</div>`:""}
        ${Yt&&r.length?`<div class="responsables-list" aria-label="Responsables">${d}</div>`:""}
        ${en&&(i||c)?`<div class="card-indicators">
                ${i?`<span title="${i} pièce(s) jointe(s)">📎 ${i}</span>`:""}
                ${c?`<span title="${c} commentaire(s)">💬 ${c}</span>`:""}
               </div>`:""}
        ${f?.isdone?`<div class="tampon-termine" style="color:${a.col.STATUT.getColor(e.STATUT)??V};">${p(u(e.STATUT))}</div>`:""}
    `,t.addEventListener("click",()=>{grist.setCursorPos({rowId:e.id}),a.opt.hideedit||K(e)}),t.addEventListener("dblclick",()=>{grist.setCursorPos({rowId:e.id}),a.opt.gristeditcard?grist.commandApi.run("viewAsCard"):a.opt.hideedit||K(e)}),t}function at(e){return`
        <span
            class="etiquette-badge"
            style="background:${m(e.color)};color:${m(e.textColor)}"
            title="${m(e.label)}"
        >${p(e.label)}</span>
    `}function ct(e,t){const n=b(t)||b(a.opt?.defaultcardcolor)||"#FFFFD1";e.style.backgroundColor=n}function lt(){document.querySelectorAll(".contenu-colonne").forEach(e=>{Ie(e),!(a.opt.readonly||typeof Sortable!="function")&&new Sortable(e,{group:"kanban-todo",animation:150,ghostClass:"carte-fantome",chosenClass:"carte-selectionnee",onEnd:async t=>{const n=t.to.dataset.statut,r=t.from.dataset.statut,o=t.item.dataset.todoId;try{n!==r?await z(o,"STATUT",n):t.oldIndex!==t.newIndex&&await ut(t.to)}catch(i){console.error(E("Error during status update:"),i),await H(I)}Ie(t.to),re(t.to.closest(".colonne-kanban")),t.from!==t.to&&re(t.from.closest(".colonne-kanban"))}})})}async function ut(e){if(!a.map?.DEADLINE)return;const n=Array.from(e.querySelectorAll(".carte")).filter(i=>{const c=me(i.dataset.deadline);return c===null||c>=M.getTime()});if(n.length===0)return;let r=M.getFullYear();const o=n.map(i=>{const c=`${r}-01-01`;return r+=1,i.dataset.deadline=c,a.formatRecord(i.dataset.todoId,{DEADLINE:c})});await a.updateRecords(o)}function Ie(e){if(!e)return;const t=e.dataset.isdone==="true",n=Array.from(e.children);n.sort((r,o)=>{let i=0;return a.map?.DEADLINE&&(t?i=G(o.dataset.lastUpdate,0)-G(r.dataset.lastUpdate,0):i=G(r.dataset.deadline,Number.MAX_SAFE_INTEGER)-G(o.dataset.deadline,Number.MAX_SAFE_INTEGER)),i!==0?i:(Number(r.dataset.todoId)||0)-(Number(o.dataset.todoId)||0)}),n.forEach(r=>e.appendChild(r))}function re(e){if(!e)return;const t=e.querySelector(".contenu-colonne"),n=e.querySelector(".compteur-colonne");t&&n&&(n.textContent=`(${t.children.length})`)}async function K(e){const t=document.getElementById("popup-todo");if(!t)return;if(a.opt.readonly){P();return}document.querySelector(".carte.active")?.classList.remove("active"),Q(e.id)?.classList.add("active");const n=le(e.STATUT),r=a.col.STATUT.getColor(e.STATUT)??V,o=a.col.STATUT.getTextColor(e.STATUT)??pe;t.style.borderLeftColor=r,t.dataset.statut=u(e.STATUT),t.dataset.isdone=n?.isdone?"true":"false",t.dataset.currentTodo=String(e.id);const i=t.querySelector(".popup-title"),c=t.querySelector(".popup-content"),s=t.querySelector(".popup-header"),l=t.querySelector(".bouton-fermer");if(i&&(i.textContent=u(e.DESCRIPTION)||E("New task")),s&&(s.style.backgroundColor=r,s.style.color=o),l&&(l.style.color=o),!c)return;const d=[],f=a.col.DESCRIPTION.getIsFormula(),v=a.map?.NOTES?a.col.NOTES.getIsFormula():!1;d.push(`
        <div class="field field-wide">
            <label class="field-label">Nom de la tâche</label>
            <textarea
                class="field-textarea auto-expand task-title-input"
                onchange="mettreAJourChamp(${Number(e.id)}, 'DESCRIPTION', this.value, event)"
                oninput="ajusterTextarea(this)"
                ${f?"disabled":""}
            >${p(u(e.DESCRIPTION))}</textarea>
        </div>
    `),a.map?.NOTES&&d.push(dt(e,v)),a.map?.ETIQUETTES&&d.push(St(e)),a.map?.RESPONSABLE&&d.push(wt(e.id,Ve(e),a.map.RESPONSABLE,a.col.RESPONSABLE.getIsFormula())),a.map?.DEADLINE&&d.push(`
            <div class="field">
                <label class="field-label">Échéance</label>
                <input
                    type="date"
                    class="field-input"
                    value="${m(Wt(e.DEADLINE))}"
                    onchange="mettreAJourChamp(${Number(e.id)}, 'DEADLINE', this.value || null, event)"
                    ${a.col.DEADLINE.getIsFormula()?"disabled":""}
                >
            </div>
        `),a.map?.COULEUR&&d.push(bt(e));let w=`<div class="form-grid">${d.join("")}</div>`;a.map?.PIECES_JOINTES&&a.opt.showattachments!==!1&&(w+=Rt(e)),a.map?.COMMENTAIRES&&a.opt.showcomments!==!1&&(w+=Pt(e));const N=a.opt.showmetadata!==!1?Ht(e):"";N&&(w+=`<div class="info-creation">${N}</div>`),w+=`
        <div class="popup-actions">
            <button
                type="button"
                class="popup-action-button bouton-supprimer"
                onclick="supprimerTodo(${Number(e.id)}, event)"
                title="${m(E("Remove the task"))}"
                aria-label="${m(E("Remove the task"))}"
            >🗑️</button>
        </div>
    `,c.innerHTML=w,c.querySelectorAll(".auto-expand").forEach(ce),t.classList.add("visible"),a.map?.PIECES_JOINTES&&a.opt.showattachments!==!1&&await oe(e.id)}function dt(e,t){const n=Number(e.id),r=mt(e.NOTES),o=t?"disabled":"",i=t?"false":"true",c=[["bold","<strong>B</strong>","Gras"],["italic","<em>I</em>","Italique"],["underline","<u>U</u>","Souligné"],["strikeThrough","<s>S</s>","Barré"],["insertUnorderedList","• Liste","Liste à puces"],["insertOrderedList","1. Liste","Liste numérotée"],["formatBlock","❝","Citation","blockquote"],["removeFormat","Tx","Effacer la mise en forme"],["undo","↶","Annuler"],["redo","↷","Rétablir"]].map(([s,l,d,f])=>`
        <button
            type="button"
            class="notes-tool"
            onmousedown="event.preventDefault()"
            onclick="appliquerCommandeNotes(this, '${s}', ${f?`'${f}'`:"null"}, event)"
            title="${m(d)}"
            aria-label="${m(d)}"
            ${o}
        >${l}</button>
    `).join("");return`
        <div class="field field-wide notes-field" data-row-id="${n}">
            <label class="field-label">Notes</label>
            <div class="notes-toolbar" role="toolbar" aria-label="Mise en forme des notes">
                ${c}
                <button
                    type="button"
                    class="notes-tool notes-tool-link"
                    onmousedown="event.preventDefault()"
                    onclick="creerLienNotes(this, event)"
                    title="Ajouter ou modifier un lien"
                    aria-label="Ajouter ou modifier un lien"
                    ${o}
                >🔗 Lien</button>
                <button
                    type="button"
                    class="notes-tool"
                    onmousedown="event.preventDefault()"
                    onclick="appliquerCommandeNotes(this, 'unlink', null, event)"
                    title="Retirer le lien"
                    aria-label="Retirer le lien"
                    ${o}
                >⛓̸</button>
            </div>
            <div
                class="notes-editor"
                contenteditable="${i}"
                data-placeholder="Ajoutez des notes…"
                oninput="planifierEnregistrementNotes(${n}, this)"
                onblur="enregistrerNotesImmediatement(${n}, this)"
                onpaste="nettoyerCollageNotes(this, event)"
                role="textbox"
                aria-multiline="true"
            >${r}</div>
            <div id="notes-status-${n}" class="section-status notes-status" aria-live="polite"></div>
        </div>
    `}function mt(e){const t=u(e).trim();if(!t)return"";const r=/<\/?[a-z][\s\S]*>/i.test(t)?t:p(t).replace(/\r?\n/g,"<br>");return ie(r)}function ie(e){const t=document.createElement("template");t.innerHTML=u(e);const n=new Set(["B","STRONG","I","EM","U","S","STRIKE","A","UL","OL","LI","P","DIV","BR","BLOCKQUOTE","H2","H3","SPAN"]),r=o=>{Array.from(o.childNodes).forEach(i=>{if(i.nodeType===Node.ELEMENT_NODE){if(new Set(["SCRIPT","STYLE","IFRAME","OBJECT","EMBED","FORM","INPUT","BUTTON","SVG","MATH","META","LINK"]).has(i.tagName)){i.remove();return}if(!n.has(i.tagName)){r(i),i.replaceWith(...Array.from(i.childNodes));return}if(Array.from(i.attributes).forEach(s=>{i.tagName==="A"&&["href","target","rel"].includes(s.name.toLowerCase())||i.removeAttribute(s.name)}),i.tagName==="A"){const s=Ce(i.getAttribute("href"));if(!s){i.replaceWith(...Array.from(i.childNodes));return}i.setAttribute("href",s),i.setAttribute("target","_blank"),i.setAttribute("rel","noopener noreferrer")}r(i)}else i.nodeType!==Node.TEXT_NODE&&i.remove()})};return r(t.content),t.innerHTML}function pt(e,t,n,r){r?.preventDefault(),r?.stopPropagation();const o=e.closest(".notes-field"),i=o?.querySelector(".notes-editor");!i||i.contentEditable!=="true"||(i.focus(),document.execCommand(t,!1,n),W(Number(o.dataset.rowId),i))}function ft(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".notes-field"),r=n?.querySelector(".notes-editor");if(!r||r.contentEditable!=="true")return;r.focus();const o=window.prompt("Adresse du lien :","https://");if(o===null)return;const i=Ce(o);if(!i){R(Number(n.dataset.rowId),"error","Adresse de lien invalide.");return}const c=window.getSelection();if(!c||c.isCollapsed)document.execCommand("insertHTML",!1,`<a href="${m(i)}" target="_blank" rel="noopener noreferrer">${p(i)}</a>`);else{document.execCommand("createLink",!1,i);const s=c.anchorNode?.parentElement?.closest?.("a");s&&(s.target="_blank",s.rel="noopener noreferrer")}W(Number(n.dataset.rowId),r)}function Ce(e){const t=u(e).trim();if(!t)return"";const n=/^(https?:|mailto:|tel:)/i.test(t)?t:`https://${t}`;try{const r=new URL(n);return["http:","https:","mailto:","tel:"].includes(r.protocol)?r.href:""}catch{return""}}function ht(e,t){if(!t?.clipboardData)return;t.preventDefault();const n=t.clipboardData.getData("text/html"),r=t.clipboardData.getData("text/plain"),o=n?ie(n):p(r).replace(/\r?\n/g,"<br>");document.execCommand("insertHTML",!1,o);const i=e.closest(".notes-field");W(Number(i?.dataset?.rowId),e)}function W(e,t){const n=Number(e);window.clearTimeout(B.get(n)),R(n,"saving","Modifications en attente…");const r=window.setTimeout(()=>{$e(n,t)},700);B.set(n,r)}function Et(e,t){const n=Number(e);window.clearTimeout(B.get(n)),B.delete(n),$e(n,t)}async function $e(e,t){if(!t)return;const n=Number(e),r=ie(t.innerHTML).trim(),o=j.get(n)||Promise.resolve();R(n,"saving","Enregistrement…");const i=o.catch(()=>{}).then(()=>z(n,"NOTES",r||null)).then(()=>{t.innerHTML=r,R(n,"saved","Enregistré"),window.setTimeout(()=>R(n,"",""),1200)}).catch(c=>{R(n,"error","Échec de l’enregistrement"),console.error("Erreur pendant l’enregistrement des notes :",c)}).finally(()=>{j.get(n)===i&&j.delete(n)});j.set(n,i),await i}function R(e,t,n){const r=document.getElementById(`notes-status-${Number(e)}`);r&&(r.className=`section-status notes-status${t?` ${t}`:""}`,r.textContent=n)}function bt(e){const t=b(e.COULEUR),n=t||b(a.opt?.defaultcardcolor)||"#FFFFD1",r=a.col.COULEUR.getIsFormula();return`
        <div class="field color-field" data-row-id="${Number(e.id)}">
            <label class="field-label">Couleur de la carte</label>
            <div class="color-picker-row">
                <input
                    type="color"
                    class="color-picker"
                    value="${m(n)}"
                    oninput="previsualiserCouleur(${Number(e.id)}, this.value, this)"
                    onchange="mettreAJourCouleur(${Number(e.id)}, this.value, this, event)"
                    ${r?"disabled":""}
                    aria-label="Choisir une couleur"
                >
                <input
                    type="text"
                    class="field-input color-value"
                    value="${m(t||"")}"
                    placeholder="#FFFFD1"
                    maxlength="7"
                    oninput="previsualiserCouleur(${Number(e.id)}, this.value, this)"
                    onchange="mettreAJourCouleur(${Number(e.id)}, this.value, this, event)"
                    ${r?"disabled":""}
                >
                <button
                    type="button"
                    class="color-reset"
                    onclick="reinitialiserCouleur(this, event)"
                    ${r?"disabled":""}
                    title="Utiliser la couleur par défaut"
                >Réinitialiser</button>
            </div>
            <div class="section-status color-status" aria-live="polite"></div>
        </div>
    `}function b(e){const t=u(e).trim();if(!t)return"";const n=t.startsWith("#")?t:`#${t}`;return/^#[0-9a-f]{3}$/i.test(n)?`#${n[1]}${n[1]}${n[2]}${n[2]}${n[3]}${n[3]}`.toUpperCase():/^#[0-9a-f]{6}$/i.test(n)?n.toUpperCase():""}function gt(e,t,n){const r=b(t);if(!r)return;const o=Q(e);o&&(o.style.backgroundColor=r);const i=n?.closest(".color-field");if(i){const c=i.querySelector(".color-picker"),s=i.querySelector(".color-value");c&&n!==c&&(c.value=r),s&&n!==s&&(s.value=r)}}async function Re(e,t,n,r){r?.stopPropagation();const o=n?.closest(".color-field"),i=o?.querySelector(".color-status"),c=u(t).trim(),s=b(c);if(c&&!s){i&&(i.className="section-status color-status error",i.textContent="Utilisez un code hexadécimal, par exemple #FFFFD1.");return}try{i&&(i.className="section-status color-status saving",i.textContent="Enregistrement…"),await z(e,"COULEUR",s||null,r);const l=Q(e);if(l&&(s?l.style.backgroundColor=s:l.style.backgroundColor=b(a.opt?.defaultcardcolor)||"#FFFFD1"),o){const d=o.querySelector(".color-picker"),f=o.querySelector(".color-value");d&&(d.value=s||b(a.opt?.defaultcardcolor)||"#FFFFD1"),f&&(f.value=s||"")}i&&(i.className="section-status color-status saved",i.textContent="Enregistré",window.setTimeout(()=>{i.className="section-status color-status",i.textContent=""},1200))}catch(l){i&&(i.className="section-status color-status error",i.textContent="Impossible d’enregistrer la couleur."),console.error("Erreur pendant l’enregistrement de la couleur :",l)}}function vt(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".color-field"),r=Number(n?.dataset?.rowId);if(!n||!Number.isInteger(r)||r<=0)return;const o=n.querySelector(".color-value");o&&(o.value=""),Re(r,"",e,t)}function wt(e,t,n,r){const o=new Set(ue(t)),i=C.map(s=>`
        <label class="multi-option responsable-option" data-search="${m(s.label.toLocaleLowerCase(a.cultureFull))}">
            <input
                type="checkbox"
                value="${s.id}"
                ${o.has(s.id)?"checked":""}
                onchange="mettreAJourChampResponsables(${Number(e)}, this.closest('.multi-dropdown'), event)"
                ${r?"disabled":""}
            >
            <span class="responsable-option-avatar" style="background:${m(s.avatarColor)}">${p(s.initials)}</span>
            <span class="responsable-option-name">${p(s.label)}</span>
        </label>
    `).join(""),c=[...o].map(s=>A.get(s)?.label).filter(Boolean);return`
        <div class="field field-responsables">
            <label class="field-label">${p(n)}</label>
            <details class="multi-dropdown responsables-dropdown" data-row-id="${Number(e)}">
                <summary>${p(De(c))}</summary>
                <div class="multi-dropdown-menu">
                    <div class="multi-toolbar">
                        <input
                            type="search"
                            class="multi-search"
                            placeholder="Rechercher…"
                            oninput="filtrerOptionsMultiples(this)"
                            onclick="event.stopPropagation()"
                            ${r?"disabled":""}
                        >
                        <button type="button" class="multi-clear" onclick="viderResponsables(this, event)" ${r?"disabled":""}>Effacer</button>
                    </div>
                    <div class="multi-options">${i||'<div class="multi-empty">Aucun membre disponible</div>'}</div>
                    <div class="multi-status" aria-live="polite"></div>
                </div>
            </details>
        </div>
    `}function De(e){const t=D(e);return t.length===0?"Choisir…":t.length===1?t[0]:`${t.length} responsables`}function Tt(e){const t=e.closest(".multi-dropdown");if(!t)return;const n=e.value.trim().toLocaleLowerCase(a.cultureFull);t.querySelectorAll(".multi-option").forEach(r=>{r.hidden=n!==""&&!u(r.dataset.search).includes(n)})}function yt(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".multi-dropdown");n&&(n.querySelectorAll('input[type="checkbox"]:checked').forEach(r=>{r.checked=!1}),Le(Number(n.dataset.rowId),n,t))}async function Le(e,t,n){n?.stopPropagation();const r=Number(e||t?.dataset?.rowId);if(!Number.isInteger(r)||r<=0||!t)return;const o=Array.from(t.querySelectorAll('input[type="checkbox"]:checked')).map(l=>Number(l.value)).filter(l=>Number.isInteger(l)&&l>0&&A.has(l)),i=o.map(l=>A.get(l).label);t.querySelector("summary").textContent=De(i),y(t,"saving","Enregistrement…");const s=(q.get(r)||Promise.resolve()).catch(()=>{}).then(()=>_e(r,"RESPONSABLE",o)).then(()=>{At(r,o),y(t,"saved","Enregistré"),window.setTimeout(()=>y(t,"",""),1200)}).catch(l=>{y(t,"error","Échec de l’enregistrement"),console.error("Erreur lors de l’enregistrement des responsables :",l)}).finally(()=>{q.get(r)===s&&q.delete(r)});q.set(r,s),await s}function At(e,t){const n=g(e);n&&(n.RESPONSABLE_id=[...t],n.RESPONSABLE=t.map(r=>A.get(r)?.label).filter(Boolean))}function St(e){const t=new Set(Xe(e)),n=a.col.ETIQUETTES.getIsFormula(),r=$.map(i=>`
        <label class="multi-option etiquette-option" data-search="${m(i.label.toLocaleLowerCase(a.cultureFull))}">
            <input
                type="checkbox"
                value="${i.id}"
                ${t.has(i.id)?"checked":""}
                onchange="mettreAJourEtiquettes(${Number(e.id)}, this.closest('.multi-dropdown'), event)"
                ${n?"disabled":""}
            >
            <span
                class="etiquette-preview"
                style="background:${m(i.color)};color:${m(i.textColor)}"
            >${p(i.label)}</span>
        </label>
    `).join(""),o=[...t].map(i=>S.get(i)?.label).filter(Boolean);return`
        <div class="field field-etiquettes">
            <label class="field-label">Étiquettes</label>
            <details class="multi-dropdown etiquettes-dropdown" data-row-id="${Number(e.id)}">
                <summary>${p(Me(o))}</summary>
                <div class="multi-dropdown-menu">
                    <div class="multi-toolbar">
                        <input
                            type="search"
                            class="multi-search"
                            placeholder="Rechercher…"
                            oninput="filtrerOptionsMultiples(this)"
                            onclick="event.stopPropagation()"
                            ${n?"disabled":""}
                        >
                        <button type="button" class="multi-clear" onclick="viderEtiquettes(this, event)" ${n?"disabled":""}>Effacer</button>
                    </div>
                    <div class="multi-options">${r||'<div class="multi-empty">Ajoutez des lignes dans la table référencée par Étiquettes</div>'}</div>
                    <div class="multi-status" aria-live="polite"></div>
                </div>
            </details>
        </div>
    `}function Me(e){const t=D(e);return t.length===0?"Choisir…":t.length===1?t[0]:`${t.length} étiquettes`}function Nt(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".multi-dropdown");n&&(n.querySelectorAll('input[type="checkbox"]:checked').forEach(r=>{r.checked=!1}),Oe(Number(n.dataset.rowId),n,t))}async function Oe(e,t,n){n?.stopPropagation();const r=Number(e||t?.dataset?.rowId);if(!Number.isInteger(r)||r<=0||!t)return;const o=Array.from(t.querySelectorAll('input[type="checkbox"]:checked')).map(l=>Number(l.value)).filter(l=>Number.isInteger(l)&&l>0&&S.has(l)),i=o.map(l=>S.get(l).label);t.querySelector("summary").textContent=Me(i),y(t,"saving","Enregistrement…");const s=(F.get(r)||Promise.resolve()).catch(()=>{}).then(()=>_e(r,"ETIQUETTES",o)).then(()=>{It(r,o),y(t,"saved","Enregistré"),window.setTimeout(()=>y(t,"",""),1200)}).catch(l=>{y(t,"error","Échec de l’enregistrement"),console.error("Erreur lors de l’enregistrement des étiquettes :",l)}).finally(()=>{F.get(r)===s&&F.delete(r)});F.set(r,s),await s}function It(e,t){const n=g(e);n&&(n.ETIQUETTES_id=[...t],n.ETIQUETTES=t.map(r=>S.get(r)?.label).filter(Boolean))}async function _e(e,t,n){const r=a.map?.[t];if(!r||Array.isArray(r))throw new Error(`La colonne ${t} n’est pas correctement mappée.`);const o=[...new Set(k(n).map(Number).filter(d=>Number.isInteger(d)&&d>0))],i=await grist.getTable().getTableId(),c=o.length>0?["L",...o]:null;await grist.docApi.applyUserActions([["UpdateRecord",i,Number(e),{[r]:c}]]);const s=await Pe(e,r),l=Ct(s);if(!$t(o,l))throw new Error(`Vérification d’écriture échouée pour ${t}. Valeur envoyée : ${JSON.stringify(c)} ; valeur relue : ${JSON.stringify(s)}`);await We(e)}async function Pe(e,t){const n=await grist.getTable().getTableId(),r=await grist.docApi.fetchTable(n),o=k(r?.id).findIndex(i=>Number(i)===Number(e));if(o<0)throw new Error(`Ligne ${e} introuvable dans la table ${n}.`);return r?.[t]?.[o]}function Ct(e){return e==null||e===""?[]:!Array.isArray(e)||e[0]==="E"?[]:e[0]==="L"?T(e.slice(1)):e[0]==="r"?T(e[2]):T(e)}function $t(e,t){const n=[...new Set(e.map(Number))].sort((o,i)=>o-i),r=[...new Set(t.map(Number))].sort((o,i)=>o-i);return n.length===r.length&&n.every((o,i)=>o===r[i])}function y(e,t,n){const r=e?.querySelector(".multi-status");r&&(r.className=`multi-status${t?` ${t}`:""}`,r.textContent=n)}function Rt(e){const t=a.col.PIECES_JOINTES.getIsFormula();return`
        <section class="detail-section attachments-section" data-row-id="${Number(e.id)}">
            <div class="detail-section-header">
                <div>
                    <h3>📎 Pièces jointes</h3>
                    <p>Images, PDF et autres fichiers</p>
                </div>
                <label class="attachment-upload-button ${t?"disabled":""}">
                    <span>Ajouter</span>
                    <input
                        type="file"
                        multiple
                        onchange="ajouterPiecesJointes(${Number(e.id)}, this, event)"
                        ${t?"disabled":""}
                    >
                </label>
            </div>
            <div id="attachments-status-${Number(e.id)}" class="section-status" aria-live="polite"></div>
            <div id="attachments-list-${Number(e.id)}" class="attachments-grid">
                <div class="section-loading">Chargement des pièces jointes…</div>
            </div>
        </section>
    `}async function oe(e){const t=document.getElementById(`attachments-list-${Number(e)}`);if(!t)return;const n=g(e),r=T(n?.PIECES_JOINTES);if(r.length===0){t.innerHTML='<div class="section-empty">Aucune pièce jointe</div>';return}t.innerHTML='<div class="section-loading">Chargement des aperçus…</div>';try{const[o]=await Promise.all([qe(!0),ne()]);t.innerHTML=r.map(i=>ke(e,i,o)).join("")}catch(o){console.error("Impossible d’afficher les pièces jointes :",o),t.innerHTML=r.map(i=>ke(e,i,null)).join("")}}function ke(e,t,n){const r=Je(t),o=n?Fe(n,t):"",i=je(r),c=i==="image"&&o?`<img src="${m(o)}" alt="${m(r.fileName)}" loading="lazy">`:`<div class="attachment-file-icon">${Be(i)}</div>`;return`
        <article class="attachment-card">
            <button type="button" class="attachment-preview" onclick="ouvrirPieceJointe(${Number(e)}, ${Number(t)}, event)" title="Ouvrir ${m(r.fileName)}">
                ${c}
            </button>
            <div class="attachment-info">
                <div class="attachment-name" title="${m(r.fileName)}">${p(r.fileName)}</div>
                <div class="attachment-meta">${p(zt(r.fileSize))}</div>
            </div>
            <div class="attachment-actions">
                <button type="button" onclick="ouvrirPieceJointe(${Number(e)}, ${Number(t)}, event)" title="Visualiser">👁</button>
                <button type="button" onclick="retirerPieceJointe(${Number(e)}, ${Number(t)}, event)" title="Retirer de la tâche">×</button>
            </div>
        </article>
    `}async function Dt(e,t,n){n?.stopPropagation();const r=Array.from(t?.files||[]);if(r.length===0)return;const o=r.find(i=>i.size>tt);if(o){h("attachments",e,"error",`${o.name} dépasse 50 Mo.`),t.value="";return}t.disabled=!0,h("attachments",e,"saving",`Envoi de ${r.length} fichier(s)…`);try{const i=await grist.docApi.getAccessToken({readOnly:!1}),c=new FormData;r.forEach(N=>c.append("upload",N,N.name));const s=await fetch(`${i.baseUrl}/attachments?auth=${encodeURIComponent(i.token)}`,{method:"POST",body:c,headers:{"X-Requested-With":"XMLHttpRequest"}});if(!s.ok)throw new Error(`Upload échoué (${s.status} ${s.statusText})`);const l=await s.json(),d=T(l);if(d.length===0)throw new Error("Grist n’a retourné aucun identifiant de pièce jointe.");const f=g(e),v=T(f?.PIECES_JOINTES),w=[...new Set([...v,...d])];await Ue(e,w),f&&(f.PIECES_JOINTES=[...w]),U=!1,await ne(!0),await oe(e),h("attachments",e,"saved","Pièce(s) jointe(s) ajoutée(s).")}catch(i){console.error("Erreur pendant l’ajout des pièces jointes :",i),h("attachments",e,"error",i.message||"Échec de l’envoi.")}finally{t.value="",t.disabled=!1}}async function Lt(e,t,n){n?.preventDefault(),n?.stopPropagation();const r=g(e),i=T(r?.PIECES_JOINTES).filter(c=>c!==Number(t));try{h("attachments",e,"saving","Mise à jour…"),await Ue(e,i),r&&(r.PIECES_JOINTES=[...i]),await oe(e),h("attachments",e,"saved","Pièce jointe retirée de la tâche.")}catch(c){console.error("Erreur pendant le retrait de la pièce jointe :",c),h("attachments",e,"error","Impossible de retirer la pièce jointe.")}}async function Ue(e,t){const n=a.map?.PIECES_JOINTES;if(!n||Array.isArray(n))throw new Error("La colonne Pièces jointes n’est pas correctement mappée.");await grist.getTable().update({id:Number(e),fields:{[n]:["L",...t]}}),await We(e)}async function Mt(e,t,n){n?.preventDefault(),n?.stopPropagation();try{const[r]=await Promise.all([qe(!0),ne()]),o=Je(t),i=Fe(r,t);_t(o,i)}catch(r){console.error("Impossible d’ouvrir la pièce jointe :",r),window.alert("Impossible d’ouvrir cette pièce jointe.")}}function Ot(){if(document.getElementById("attachment-viewer"))return;const e=document.createElement("div");e.id="attachment-viewer",e.className="attachment-viewer",e.setAttribute("aria-hidden","true"),e.innerHTML=`
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
    `,document.body.appendChild(e)}function _t(e,t){const n=document.getElementById("attachment-viewer"),r=document.getElementById("attachment-viewer-content"),o=document.getElementById("attachment-viewer-title"),i=document.getElementById("attachment-viewer-download");if(!n||!r||!o||!i)return;o.textContent=e.fileName,i.href=t;const c=je(e);c==="image"?r.innerHTML=`<img src="${m(t)}" alt="${m(e.fileName)}">`:c==="pdf"?r.innerHTML=`<iframe src="${m(t)}" title="${m(e.fileName)}"></iframe>`:c==="video"?r.innerHTML=`<video src="${m(t)}" controls autoplay></video>`:c==="audio"?r.innerHTML=`<div class="attachment-generic-preview"><div class="attachment-large-icon">🎵</div><audio src="${m(t)}" controls autoplay></audio></div>`:r.innerHTML=`<div class="attachment-generic-preview"><div class="attachment-large-icon">${Be(c)}</div><p>Ce format ne dispose pas d’un aperçu intégré.</p><a href="${m(t)}" target="_blank" rel="noopener">Ouvrir ou télécharger le fichier</a></div>`,n.classList.add("visible"),n.setAttribute("aria-hidden","false")}function xe(e){e?.preventDefault(),e?.stopPropagation();const t=document.getElementById("attachment-viewer");if(!t)return;t.classList.remove("visible"),t.setAttribute("aria-hidden","true");const n=document.getElementById("attachment-viewer-content");n&&(n.innerHTML="")}async function qe(e=!0){if(e&&x&&Date.now()-fe<et)return x;const t=await grist.docApi.getAccessToken({readOnly:e});return e&&(x=t,fe=Date.now()),t}function Fe(e,t){return`${e.baseUrl}/attachments/${Number(t)}/download?auth=${encodeURIComponent(e.token)}`}function Je(e){return Z.get(Number(e))||{id:Number(e),fileName:`Pièce jointe ${Number(e)}`,fileExt:"",fileType:"",fileSize:0,imageWidth:0,imageHeight:0}}function je(e){const t=u(e.fileExt||Ze(e.fileName)).toLowerCase().replace(/^\./,""),n=u(e.fileType).toLowerCase();return n.startsWith("image/")||["png","jpg","jpeg","gif","webp","svg","bmp","avif"].includes(t)?"image":n==="application/pdf"||t==="pdf"?"pdf":n.startsWith("video/")||["mp4","webm","mov","m4v","ogv"].includes(t)?"video":n.startsWith("audio/")||["mp3","wav","ogg","m4a","aac","flac"].includes(t)?"audio":["doc","docx","odt"].includes(t)?"document":["xls","xlsx","ods","csv"].includes(t)?"tableur":["ppt","pptx","odp"].includes(t)?"presentation":["zip","rar","7z","tar","gz"].includes(t)?"archive":"file"}function Be(e){return{image:"🖼️",pdf:"📕",video:"🎬",audio:"🎵",document:"📄",tableur:"📊",presentation:"📽️",archive:"🗜️",file:"📎"}[e]||"📎"}function Pt(e){const t=_(e.COMMENTAIRES);return`
        <section class="detail-section comments-section" data-row-id="${Number(e.id)}">
            <div class="detail-section-header">
                <div>
                    <h3>💬 Commentaires</h3>
                    <p>${t.length} commentaire(s)</p>
                </div>
            </div>
            <div id="comments-list-${Number(e.id)}" class="comments-list">
                ${He(t,e.id)}
            </div>
            <div class="comment-composer">
                <textarea
                    class="comment-input"
                    placeholder="Écrire un commentaire…"
                    oninput="ajusterTextarea(this)"
                ></textarea>
                <div class="comment-grist-author">
                    Le nom est renseigné automatiquement par Grist avec <code>user.Name</code>.
                </div>
                <div class="comment-composer-footer">
                    <div id="comments-status-${Number(e.id)}" class="section-status" aria-live="polite"></div>
                    <button type="button" onclick="ajouterCommentaire(${Number(e.id)}, this, event)">Commenter</button>
                </div>
            </div>
        </section>
    `}function He(e,t){return e.length===0?'<div class="section-empty">Aucun commentaire</div>':e.map(n=>`
        <article class="comment-card" data-comment-id="${m(n.id)}">
            <div class="comment-header">
                <strong>${p(n.author===O?"Nom Grist non configuré":n.author||"Anonyme")}</strong>
                <span>${p(de(n.createdAt))}</span>
                <button type="button" onclick="supprimerCommentaire(${Number(t)}, '${Gt(n.id)}', event)" title="Supprimer le commentaire">×</button>
            </div>
            <div class="comment-body">${p(n.text).replace(/\n/g,"<br>")}</div>
        </article>
    `).join("")}function _(e){const t=u(e).trim();if(!t)return[];try{const n=JSON.parse(t);if(!Array.isArray(n))throw new Error("Format non tableau");return n.map((r,o)=>({id:u(r?.id)||`legacy-${o}`,author:u(r?.author)||"Anonyme",createdAt:u(r?.createdAt),text:u(r?.text)})).filter(r=>r.text.trim())}catch{return[{id:"legacy-text",author:"Ancien commentaire",createdAt:"",text:t}]}}async function kt(e,t,n){n?.preventDefault(),n?.stopPropagation();const o=t.closest(".comments-section")?.querySelector(".comment-input"),i=u(o?.value).trim();if(!i){h("comments",e,"error","Écrivez un commentaire."),o?.focus();return}t.disabled=!0,h("comments",e,"saving","Enregistrement…");const c={id:Qt(),author:O,createdAt:new Date().toISOString(),text:i};try{const l=(await Ke(e,d=>[...d,c])).find(d=>d.id===c.id);if(!l||l.author===O)throw new Error("La formule d’initialisation user.Name n’a pas remplacé le nom temporaire. Configurez la colonne Commentaires comme indiqué dans le README.");o&&(o.value="",ce(o)),se(e),h("comments",e,"saved",`Commentaire ajouté par ${l.author}.`)}catch(s){console.error("Erreur pendant l’ajout du commentaire :",s),se(e),h("comments",e,"error","Le commentaire a été envoyé, mais Grist n’a pas renseigné user.Name. Vérifiez la formule d’initialisation.")}finally{t.disabled=!1}}async function Ut(e,t,n){n?.preventDefault(),n?.stopPropagation();try{h("comments",e,"saving","Suppression…"),await Ke(e,r=>r.filter(o=>o.id!==t)),se(e),h("comments",e,"saved","Commentaire supprimé.")}catch(r){console.error("Erreur pendant la suppression du commentaire :",r),h("comments",e,"error","Impossible de supprimer le commentaire.")}}async function Ke(e,t){const n=Number(e),o=(J.get(n)||Promise.resolve()).catch(()=>{}).then(async()=>{const i=g(n),c=_(i?.COMMENTAIRES),s=t(c),l=JSON.stringify(s),d=ae();await a.updateRecords(a.formatRecord(n,{COMMENTAIRES:l,...d}));const f=await xt(n);return i&&(i.COMMENTAIRES=JSON.stringify(f)),f}).finally(()=>{J.get(n)===o&&J.delete(n)});return J.set(n,o),o}async function xt(e){const t=a.map?.COMMENTAIRES;if(!t||Array.isArray(t))throw new Error("La colonne Commentaires n’est pas correctement mappée.");const n=await Pe(e,t),r=_(n),o=g(e);return o&&(o.COMMENTAIRES=u(n)),r}function se(e){const t=g(e),n=_(t?.COMMENTAIRES),r=document.getElementById(`comments-list-${Number(e)}`),o=r?.closest(".comments-section");r&&(r.innerHTML=He(n,e));const i=o?.querySelector(".detail-section-header p");i&&(i.textContent=`${n.length} commentaire(s)`)}async function z(e,t,n,r){r?.stopPropagation();try{t==="STATUT"&&le(n)?.useconfetti&&Xt();const o={[t]:n,...t==="DERNIERE_MISE_A_JOUR"||t==="MODIFIE_PAR"?{}:ae()};await a.updateRecords(a.formatRecord(e,o));const i=g(e);i&&(i[t]=n,o.DERNIERE_MISE_A_JOUR&&(i.DERNIERE_MISE_A_JOUR=o.DERNIERE_MISE_A_JOUR),o.MODIFIE_PAR&&(i.MODIFIE_PAR=o.MODIFIE_PAR))}catch(o){throw console.error(E("Error during update:"),o),o}}function ae(){const e={};return a.map?.DERNIERE_MISE_A_JOUR&&!a.col.DERNIERE_MISE_A_JOUR.getIsFormula()&&(e.DERNIERE_MISE_A_JOUR=new Date().toISOString()),a.map?.MODIFIE_PAR&&!a.col.MODIFIE_PAR.getIsFormula()&&(e.MODIFIE_PAR=O),e}async function We(e){const t=ae();if(Object.keys(t).length!==0)try{await a.updateRecords(a.formatRecord(e,t));const n=g(e);n&&Object.assign(n,t)}catch(n){console.warn("Données enregistrées, mais informations de suivi non modifiées :",n)}}async function qt(e){try{const t={DESCRIPTION:"",STATUT:e};a.map?.DERNIERE_MISE_A_JOUR&&!a.col.DERNIERE_MISE_A_JOUR.getIsFormula()&&(t.DERNIERE_MISE_A_JOUR=new Date().toISOString()),a.map?.CREE_LE&&!a.col.CREE_LE.getIsFormula()&&(t.CREE_LE=new Date().toISOString()),a.map?.COMMENTAIRES&&!a.col.COMMENTAIRES.getIsFormula()&&(t.COMMENTAIRES="[]");const n=await a.createRecords({fields:t});if(n?.id>0){grist.setCursorPos({rowId:n.id});const r=await a.fetchSelectedRecord(n.id);a.opt.hideedit||K(r)}}catch(t){console.error(E("Error on creation:"),t)}}async function Ft(e,t){if(t?.stopPropagation(),!(a.opt.confirmdelete!==!1&&!confirm(E("Are you sure you want to delete this task?"))))try{await a.destroyRecords(e),P()}catch(n){console.error(E("Error on delete:"),n)}}function P(){const e=document.getElementById("popup-todo");e&&(Q(e.dataset.currentTodo)?.classList.remove("active"),e.classList.remove("visible"),ze())}function Jt(e,t){if(t?.stopPropagation(),!e)return;e.classList.toggle("collapsed");const n=e.querySelector(".titre-statut")?.childNodes?.[0]?.textContent?.trim()||e.id;localStorage.setItem(Ge(n),String(e.classList.contains("collapsed")))}function ce(e){e&&(e.style.height="",e.style.height=`${Math.max(e.scrollHeight,42)}px`)}function ze(e=null){document.querySelectorAll(".multi-dropdown[open]").forEach(t=>{t!==e&&t.removeAttribute("open")})}document.addEventListener("keydown",e=>{if(e.key!=="Escape")return;if(document.getElementById("attachment-viewer")?.classList.contains("visible")){xe(e);return}const n=document.querySelector(".multi-dropdown[open]");n?n.removeAttribute("open"):P()}),document.addEventListener("click",e=>{const t=e.target.closest(".multi-dropdown");a?.opt?.autoclosemenus!==!1&&ze(t);const n=document.getElementById("popup-todo");if(!n?.classList.contains("visible"))return;const r=n.contains(e.target),o=!!e.target.closest(".carte"),i=!!e.target.closest("#attachment-viewer");!r&&!o&&!i&&P()});function g(e){return I.find(t=>Number(t.id)===Number(e))||null}function Q(e){return Array.from(document.querySelectorAll(".carte")).find(t=>Number(t.dataset.todoId)===Number(e))||null}function Qe(e){return{addbutton:!1,isdone:!1,useconfetti:!1,hidecolumn:!1,...(Array.isArray(a.opt?.columns)?a.opt.columns:[])[e]||{}}}function le(e){const n=(a.valuesList?.columns||[]).indexOf(e);return n>=0?Qe(n):null}function Ge(e){return`column-todo-${u(e)}`}function Ve(e){const t=ue(e?.RESPONSABLE_id);if(t.length>0)return t;const n=D(e?.RESPONSABLE).filter(o=>o!=="#KeyError"),r=[...C];return n.flatMap(o=>{const i=r.findIndex(s=>s.label===o);if(i<0)return[];const[c]=r.splice(i,1);return[c.id]})}function jt(e){const t=Ve(e);return t.length>0?t.map(n=>A.get(n)).filter(Boolean):D(e?.RESPONSABLE).filter(n=>n!=="#KeyError").map(n=>({id:0,label:n,initials:Te(n),avatarColor:ye(n)}))}function Xe(e){const t=ue(e?.ETIQUETTES_id);if(t.length>0)return t;const n=D(e?.ETIQUETTES).filter(o=>o!=="#KeyError"),r=[...$];return n.flatMap(o=>{const i=r.findIndex(s=>s.label===o);if(i<0)return[];const[c]=r.splice(i,1);return[c.id]})}function Bt(e){const t=Xe(e);return t.length>0?t.map(n=>S.get(n)).filter(Boolean):D(e?.ETIQUETTES).filter(n=>n!=="#KeyError").map(n=>{const r=Ae(n);return{id:0,label:n,color:r,textColor:Se(r)}})}function ue(e){return T(e)}function T(e){let t=k(e);return t[0]==="L"?t=t.slice(1):t[0]==="r"&&(t=k(t[2])),[...new Set(t.flatMap(n=>Array.isArray(n)?n:[n]).map(Number).filter(n=>Number.isInteger(n)&&n>0))]}function D(e){let t=k(e);return t[0]==="L"&&(t=t.slice(1)),[...new Set(t.flatMap(n=>Array.isArray(n)?n:[n]).map(u).map(n=>n.trim()).filter(Boolean))]}function k(e){return e==null||e===""?[]:Array.isArray(e)?e:[e]}function u(e){return e==null?"":String(e)}function Ht(e){const t=[],n=a.map?.CREE_LE&&e.CREE_LE?de(e.CREE_LE):"",r=a.map?.CREE_PAR?u(e.CREE_PAR).trim():"";if(n||r){const s=["Créé"];n&&s.push(`le ${n}`),r&&s.push(`par ${r}`),t.push(`<div>${p(s.join(" "))}</div>`)}const o=a.map?.DERNIERE_MISE_A_JOUR&&e.DERNIERE_MISE_A_JOUR?de(e.DERNIERE_MISE_A_JOUR):"",i=a.map?.MODIFIE_PAR?u(e.MODIFIE_PAR).trim():"",c=i===O?"Nom Grist non configuré":i;if(o||c){const s=["Modifié"];o&&s.push(`le ${o}`),c&&s.push(`par ${c}`),t.push(`<div>${p(s.join(" "))}</div>`)}return t.join("")}function h(e,t,n,r){const o=document.getElementById(`${e}-status-${Number(t)}`);o&&(o.className=`section-status${n?` ${n}`:""}`,o.textContent=r)}function Kt(e){if(!e)return"";const t=new Date(e);if(Number.isNaN(t.getTime())||t>=M)return"";const n=String(t.getDate()).padStart(2,"0"),r=t.toLocaleDateString(a.cultureFull,{month:"short"});return`${n} ${r} ${t.getFullYear()}`}function de(e){if(!e)return"";const t=new Date(e);return Number.isNaN(t.getTime())?"":t.toLocaleString(a.cultureFull,{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}function Wt(e){if(!e)return"";const t=new Date(e);return Number.isNaN(t.getTime())||t>=M?"":t.toISOString().split("T")[0]}function Ye(e){if(!e)return"";const t=new Date(e);return Number.isNaN(t.getTime())?u(e):t.toISOString()}function me(e){if(!e)return null;const t=new Date(e).getTime();return Number.isNaN(t)?null:t}function G(e,t){return me(e)??t}function zt(e){const t=Number(e)||0;if(t<=0)return"";const n=["o","Ko","Mo","Go"],r=Math.min(Math.floor(Math.log(t)/Math.log(1024)),n.length-1);return`${(t/1024**r).toFixed(r===0?0:1)} ${n[r]}`}function Ze(e){const t=u(e).match(/(\.[^.]+)$/);return t?t[1]:""}function Qt(){return globalThis.crypto?.randomUUID?crypto.randomUUID():`comment-${Date.now()}-${Math.random().toString(16).slice(2)}`}function p(e){return u(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function m(e){return p(e).replace(/`/g,"&#096;")}function Gt(e){return u(e).replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/\r/g,"\\r").replace(/\n/g,"\\n")}function Vt(e){return encodeURIComponent(u(e)).replace(/'/g,"%27")}function Xt(){if(typeof confetti!="function")return;const e=2e3,t=Date.now()+e,n={startVelocity:30,spread:360,ticks:60,zIndex:1500},r=(i,c)=>Math.random()*(c-i)+i,o=window.setInterval(()=>{const i=t-Date.now();if(i<=0){window.clearInterval(o);return}const c=50*(i/e);confetti({...n,particleCount:c,origin:{x:r(.1,.3),y:Math.random()-.2}}),confetti({...n,particleCount:c,origin:{x:r(.7,.9),y:Math.random()-.2}})},250)}window.toggleColonne=Jt,window.togglePopupTodo=K,window.fermerPopup=P,window.mettreAJourChamp=z,window.creerNouvelleTache=qt,window.supprimerTodo=Ft,window.mettreAJourChampResponsables=Le,window.filtrerOptionsMultiples=Tt,window.viderResponsables=yt,window.mettreAJourEtiquettes=Oe,window.viderEtiquettes=Nt,window.ajouterPiecesJointes=Dt,window.retirerPieceJointe=Lt,window.ouvrirPieceJointe=Mt,window.fermerLecteurPieceJointe=xe,window.ajouterCommentaire=kt,window.supprimerCommentaire=Ut,window.ajusterTextarea=ce,window.previsualiserCouleur=gt,window.mettreAJourCouleur=Re,window.reinitialiserCouleur=vt,window.appliquerCommandeNotes=pt,window.creerLienNotes=ft,window.nettoyerCollageNotes=ht,window.planifierEnregistrementNotes=W,window.enregistrerNotesImmediatement=Et}));
