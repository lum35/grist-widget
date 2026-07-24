(function(a){typeof define=="function"&&define.amd?define(a):a()})((function(){"use strict";let a,v;const P=new Date("3000-01-01"),Z="#DCDCDC",ye="#000000",dt=120*1e3,mt=50*1024*1024,k="__GRIST_USER_NAME__";let M=[],C=[],S=new Map,ee=null,R=[],I=new Map,te=null,ne=new Map,J=!1,B=null,we=0;const j=new Map,H=new Map,K=new Map,W=new Map;let Se=null,oe=!1;window.addEventListener("load",async()=>{a=new WidgetSDK,v=await a.loadTranslations(["widget.js"]),a.configureOptions([WidgetSDK.newItem("columns",null,"Colonnes du Kanban","Réglez le comportement de chaque statut.","1 — Colonnes",{columnId:"STATUT",template:[WidgetSDK.newItem("addbutton",!0,"Autoriser l’ajout","Afficher un bouton pour créer une carte dans cette colonne."),WidgetSDK.newItem("isdone",!1,"Colonne terminée","Considérer les cartes de cette colonne comme terminées."),WidgetSDK.newItem("useconfetti",!1,"Confettis","Afficher des confettis lorsqu’une carte arrive dans cette colonne."),WidgetSDK.newItem("hidecolumn",!1,"Masquer la colonne","Ne pas afficher cette colonne dans le Kanban.")]}),WidgetSDK.newItem("rotation",!0,"Inclinaison des cartes","Donner un léger effet post-it aux cartes.","2 — Affichage des cartes"),WidgetSDK.newItem("compact",!1,"Mode compact","Réduire les espacements et la hauteur des cartes.","2 — Affichage des cartes"),WidgetSDK.newItem("showlabels",!0,"Afficher les étiquettes","Afficher les étiquettes colorées sur les cartes.","2 — Affichage des cartes"),WidgetSDK.newItem("showmembers",!0,"Afficher les responsables","Afficher les bulles d’initiales sur les cartes.","2 — Affichage des cartes"),WidgetSDK.newItem("showdeadline",!0,"Afficher l’échéance","Afficher la date limite sur les cartes.","2 — Affichage des cartes"),WidgetSDK.newItem("showindicators",!0,"Afficher les indicateurs","Afficher le nombre de pièces jointes et de commentaires.","2 — Affichage des cartes"),WidgetSDK.newItem("defaultcardcolor","#FFFFD1","Couleur par défaut","Couleur utilisée lorsqu’aucune couleur personnalisée n’est enregistrée.","2 — Affichage des cartes"),WidgetSDK.newItem("showattachments",!0,"Pièces jointes","Afficher la section des pièces jointes dans la fiche.","3 — Fiche descriptive"),WidgetSDK.newItem("showcomments",!0,"Commentaires","Afficher la section des commentaires dans la fiche.","3 — Fiche descriptive"),WidgetSDK.newItem("enablementions",!0,"Mentions @","Permettre de mentionner les membres dans les commentaires.","3 — Fiche descriptive"),WidgetSDK.newItem("mentionnotificationtable","Notifications_Kanban","Table des notifications","Table utilisée pour préparer un e-mail par personne mentionnée. L’envoi réel est réalisé par une Automatisation Grist.","3 — Fiche descriptive"),WidgetSDK.newItem("showmetadata",!0,"Informations de suivi","Afficher les lignes « Créé le » et « Modifié le » en bas de la fiche.","3 — Fiche descriptive"),WidgetSDK.newItem("autoclosemenus",!0,"Fermer les menus automatiquement","Fermer les sélecteurs multiples lorsqu’on clique ailleurs.","3 — Fiche descriptive"),WidgetSDK.newItem("readonly",!1,"Lecture seule","Désactiver toutes les modifications depuis le widget.","4 — Comportement"),WidgetSDK.newItem("hideedit",!1,"Masquer la fiche","Ne pas ouvrir la fiche descriptive lors d’un clic sur une carte.","4 — Comportement"),WidgetSDK.newItem("gristeditcard",!1,"Double-clic vers la fiche Grist","Ouvrir la fiche native de Grist lors d’un double-clic.","4 — Comportement"),WidgetSDK.newItem("confirmdelete",!0,"Confirmer les suppressions","Demander une confirmation avant de supprimer une tâche.","4 — Comportement")],"#config-view","#main-view",{onOptChange:le,onOptLoad:le}),a.initMetaData(),a.ready({requiredAccess:"full",allowSelectBy:!0,columns:[{name:"STATUT",title:"Statut",description:"Colonne du Kanban",type:"Choice",strictType:!0},{name:"DESCRIPTION",title:"Nom de la tâche",description:"Nom principal de la tâche",type:"Any"},{name:"DESCRIPTION_DISPLAY",title:"Affichage de la tâche",description:"Contenu personnalisé facultatif affiché sur la carte",type:"Any",optional:!0},{name:"NOTES",title:"Notes",description:"Notes enrichies enregistrées en HTML sécurisé",type:"Text",strictType:!0,optional:!0},{name:"DEADLINE",title:"Échéance",description:"Date limite ou ordre de priorité",type:"Date",optional:!0},{name:"RESPONSABLE",title:"Responsables",description:"Personnes responsables de la tâche",type:"RefList",strictType:!0,optional:!0},{name:"ETIQUETTES",title:"Étiquettes",description:"Étiquettes multiples référencées depuis une table dédiée",type:"RefList",strictType:!0,optional:!0},{name:"PIECES_JOINTES",title:"Pièces jointes",description:"Fichiers et images associés à la tâche",type:"Attachments",strictType:!0,optional:!0},{name:"COMMENTAIRES",title:"Commentaires",description:"Commentaires du widget stockés en JSON",type:"Text",strictType:!0,optional:!0},{name:"COULEUR",title:"Couleur de carte",description:"Code hexadécimal choisi depuis le widget",type:"Text",strictType:!0,optional:!0},{name:"CREE_PAR",title:"Créé par",type:"Any",optional:!0},{name:"CREE_LE",title:"Date de création",type:"DateTime",optional:!0},{name:"DERNIERE_MISE_A_JOUR",title:"Dernière mise à jour",description:"Date technique affichée dans le suivi",type:"DateTime",optional:!0},{name:"MODIFIE_PAR",title:"Modifié par",description:"Nom de la dernière personne ayant modifié la tâche",type:"Text",strictType:!0,optional:!0}]}),a.onRecords(z,{expandRefs:!1,keepEncoded:!1,mapRef:!0}),a.isLoaded().then(()=>{a.initDone=!0}),grist.on("message",async e=>{e.mappingsChange&&await bt()}),Yt(),ht()});async function Ne(e=!1){if(!a?.map?.RESPONSABLE||!a?.col?.RESPONSABLE){re();return}const t=a.col.RESPONSABLE,n=`${t.type}:${t.visibleCol}`;if(!(!e&&ee===n&&C.length>0))try{const o=await Ae(t),r=o.dataColumns,i=se(r,["initiales","initiale","initials","abreviation","abréviation","sigle"])||Ce(r,o.visibleColumnId),s=se(r,["email","e-mail","mail","courriel","adresseemail","adresse_email","adressemail","adresse_mail"]),c=i&&Array.isArray(o.table[i])?o.table[i]:[],l=s&&Array.isArray(o.table[s])?o.table[s]:[];C=o.ids.map((u,m)=>{const h=d(o.labels[m]).trim(),g=pt(c[m])||$e(h),b=ct(l[m]);return{id:Number(u),label:h,initials:g,email:b,avatarColor:Me(h||u)}}).filter(u=>Number.isInteger(u.id)&&u.id>0&&u.label&&u.label!=="#KeyError").sort((u,m)=>u.label.localeCompare(m.label,a.cultureFull,{sensitivity:"base"})),S=new Map(C.map(u=>[u.id,u])),ee=n}catch(o){re(),console.error("Impossible de charger la table des responsables :",o)}}function re(){C=[],S=new Map,ee=null}async function Te(e=!1){if(!a?.map?.ETIQUETTES||!a?.col?.ETIQUETTES){ie();return}const t=a.col.ETIQUETTES,n=`${t.type}:${t.visibleCol}`;if(!(!e&&te===n&&R.length>0))try{const o=await Ae(t),r=o.dataColumns,i=se(r,["couleur","color","hex","codecouleur","code_couleur"])||Ce(r,o.visibleColumnId),s=i&&Array.isArray(o.table[i])?o.table[i]:[];R=o.ids.map((c,l)=>{const u=d(o.labels[l]).trim(),h=w(s[l])||Re(u||c);return{id:Number(c),label:u,color:h,textColor:De(h)}}).filter(c=>Number.isInteger(c.id)&&c.id>0&&c.label&&c.label!=="#KeyError").sort((c,l)=>c.label.localeCompare(l.label,a.cultureFull,{sensitivity:"base"})),I=new Map(R.map(c=>[c.id,c])),te=n}catch(o){ie(),console.error("Impossible de charger la table des étiquettes :",o)}}function ie(){R=[],I=new Map,te=null}async function Ae(e){const[t,n]=d(e?.type).split(":");if(t!=="RefList"||!n||!e?.visibleCol)throw new Error("La colonne doit être une Liste de références avec une colonne visible configurée.");const[o,r]=await Promise.all([grist.docApi.fetchTable(n),e.getMeta(e.visibleCol)]),i=r?.colId;if(!i||!Array.isArray(o?.id)||!Array.isArray(o?.[i]))throw new Error(`La colonne visible de la table ${n} est introuvable.`);const s=Object.keys(o).filter(c=>Array.isArray(o[c])&&c!=="id"&&c!=="manualSort"&&!c.startsWith("gristHelper_"));return{tableId:n,table:o,ids:o.id,labels:o[i],visibleColumnId:i,dataColumns:s}}function se(e,t){const n=new Set(t.map(Ie));return e.find(o=>n.has(Ie(o)))||null}function Ce(e,t){const n=e.indexOf(t);return n>=0&&e[n+1]||null}function Ie(e){return d(e).normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]/gi,"").toLowerCase()}function pt(e){return d(e).trim().replace(/\s+/g,"").slice(0,4).toUpperCase()}function $e(e){const t=d(e).trim().split(/\s+/).filter(Boolean);return t.length===0?"?":t.length===1?t[0].slice(0,2).toUpperCase():`${t[0][0]||""}${t[t.length-1][0]||""}`.toUpperCase()}function Me(e){let t=0;for(const o of d(e))t=(t<<5)-t+o.charCodeAt(0),t|=0;return`hsl(${Math.abs(t)%360} 58% 42%)`}function Re(e){let t=0;for(const o of d(e))t=(t<<5)-t+o.charCodeAt(0),t|=0;const n=Math.abs(t)%360;return ft(n,62,72)}function ft(e,t,n){t/=100,n/=100;const o=(1-Math.abs(2*n-1))*t,r=o*(1-Math.abs(e/60%2-1)),i=n-o/2;let s=0,c=0,l=0;return e<60?[s,c,l]=[o,r,0]:e<120?[s,c,l]=[r,o,0]:e<180?[s,c,l]=[0,o,r]:e<240?[s,c,l]=[0,r,o]:e<300?[s,c,l]=[r,0,o]:[s,c,l]=[o,0,r],`#${[s,c,l].map(u=>Math.round((u+i)*255).toString(16).padStart(2,"0")).join("")}`.toUpperCase()}function De(e){const t=w(e)||"#DDE3EA",n=parseInt(t.slice(1,3),16),o=parseInt(t.slice(3,5),16),r=parseInt(t.slice(5,7),16);return(.2126*n+.7152*o+.0722*r)/255>.58?"#1F2937":"#FFFFFF"}async function ae(e=!1){if(!(J&&!e)){ne=new Map,J=!0;try{const t=await grist.docApi.fetchTable("_grist_Attachments");(Array.isArray(t?.id)?t.id:[]).forEach((o,r)=>{const i=Number(o);if(!Number.isInteger(i)||i<=0)return;const s=d(t.fileName?.[r])||`Pièce jointe ${i}`,c=d(t.fileExt?.[r])||ut(s),l=d(t.fileType?.[r]),u=Number(t.fileSize?.[r])||0;ne.set(i,{id:i,fileName:s,fileExt:c,fileType:l,fileSize:u,imageWidth:Number(t.imageWidth?.[r])||0,imageHeight:Number(t.imageHeight?.[r])||0})})}catch(t){console.warn("Métadonnées des pièces jointes indisponibles :",t)}}}async function z(e){M=Array.isArray(e)?e:[],await Promise.all([Ne(),Te()]);const t=document.getElementById("conteneur-kanban");if(!t)return;t.innerHTML="";const n=await a.col.STATUT.getChoices();if(!Array.isArray(n)||n.length===0){t.innerHTML=`<div class="kanban-message">${f(v("No choice available in the Status column"))}</div>`;return}n.forEach((o,r)=>{const i=Et(o,r);i&&t.appendChild(i)}),M.forEach(o=>{const r=d(o.STATUT),i=Array.from(t.querySelectorAll(".contenu-colonne")).find(s=>s.dataset.statut===r);i&&i.insertBefore(vt(o),i.firstChild)}),St(),document.querySelectorAll(".colonne-kanban").forEach(ue)}function ht(){const e=document.getElementById("config-view");!e||e.dataset.autosaveInstalled==="true"||(e.dataset.autosaveInstalled="true",e.addEventListener("input",t=>{t.target.matches("input, textarea, select")&&ce()}),e.addEventListener("change",t=>{t.target.matches("input, textarea, select")&&ce()}),e.addEventListener("click",t=>{t.target.closest(".config-switch")&&window.setTimeout(ce,0)}))}function ce(){window.clearTimeout(Se),V("saving","Sauvegarde…"),Se=window.setTimeout(gt,350)}async function gt(){if(!(oe||!a?._parameters||!a?._config||a._config.style.display==="none")){oe=!0;try{a.opt=await a.readOptionValues(a._parameters,a._config,a.opt),await grist.widgetApi.setOption("options",JSON.parse(JSON.stringify(a.opt))),await le(),V("saved","Enregistré"),window.setTimeout(()=>{V("","")},1400)}catch(e){console.error("Impossible de sauvegarder automatiquement la configuration :",e),V("error","Échec de la sauvegarde")}finally{oe=!1}}}function V(e,t){const n=document.getElementById("config-view");if(!n||n.style.display==="none")return;let o=n.querySelector(".config-autosave-status");!o&&t&&(o=document.createElement("div"),o.className="config-autosave-status",o.setAttribute("aria-live","polite"),n.appendChild(o)),o&&(o.className=`config-autosave-status${e?` ${e}`:""}`,o.textContent=t,o.hidden=!t)}async function le(){await a.isMapped(),await z(M)}async function bt(){re(),ie(),J=!1,B=null,await Promise.all([Ne(!0),Te(!0)]),await z(M)}function Et(e,t){const n=rt(t);if(n.hidecolumn)return null;const o=d(e),r=document.createElement("section");r.className=`colonne-kanban${!n.addbutton&&!a.opt.compact?" colonne-nobouton":""}`,r.id=o,localStorage.getItem(it(o))==="true"&&r.classList.add("collapsed");const i=a.col.STATUT.getColor(o)??Z,s=a.col.STATUT.getTextColor(o)??ye,c=An(o);return r.innerHTML=`
        <div class="entete-colonne" style="background-color:${i};color:${s}">
            <div class="titre-statut">${f(o)} <span class="compteur-colonne">(0)</span></div>
            <div class="actions-colonne">
                ${n.addbutton&&!a.opt.readonly?`<button type="button" class="bouton-ajouter-entete ${a.opt.compact?"compact":""}" onclick="creerNouvelleTache(decodeURIComponent('${c}'))" aria-label="${p(v("Add a new task"))}">+</button>`:""}
                <button type="button" class="bouton-toggle" onclick="toggleColonne(this.closest('.colonne-kanban'), event)" aria-label="Replier ou déplier">⇄</button>
            </div>
        </div>
        ${n.addbutton&&!a.opt.readonly?`<button type="button" class="bouton-ajouter ${a.opt.compact?"compact":""}" onclick="creerNouvelleTache(decodeURIComponent('${c}'))">+ ${f(v("Add a new task"))}</button>`:""}
        <div class="contenu-colonne" data-statut="${p(o)}" data-isdone="${n.isdone?"true":"false"}"></div>
    `,r}function vt(e){const t=document.createElement("article");t.className=`carte${a.opt.rotation?"":" norotate"}${a.opt.compact?" compact":""}`,t.dataset.todoId=String(e.id),t.dataset.lastUpdate=lt(e.DERNIERE_MISE_A_JOUR),t.dataset.deadline=lt(e.DEADLINE),wt(t,e.COULEUR);const n=e.DEADLINE?yn(e.DEADLINE):"",o=bn(e),r=En(e),i=N(e.PIECES_JOINTES).length,s=x(e.COMMENTAIRES).length,c=e.DESCRIPTION_DISPLAY?String(e.DESCRIPTION_DISPLAY):f(d(e.DESCRIPTION)||v("No description")),l=r.map(O=>yt(O)).join(""),u=o.map(O=>`
            <span
                class="responsable-avatar"
                style="background:${p(O.avatarColor)}"
                title="${p(O.label)}"
                aria-label="${p(O.label)}"
            >${f(O.initials)}</span>
        `).join(""),m=ge(e.STATUT),h=ve(e.DEADLINE),g=h!==null&&h<Date.now()&&h<P.getTime(),b=a.opt.showlabels!==!1,In=a.opt.showmembers!==!1,$n=a.opt.showdeadline!==!1,Mn=a.opt.showindicators!==!1;return t.innerHTML=`
        ${b&&l?`<div class="etiquettes-list">${l}</div>`:""}
        <div class="description">${c}</div>
        ${$n&&n?`<div class="deadline${g?" late":""} truncate">📅 ${f(n)}</div>`:""}
        ${In&&o.length?`<div class="responsables-list" aria-label="Responsables">${u}</div>`:""}
        ${Mn&&(i||s)?`<div class="card-indicators">
                ${i?`<span title="${i} pièce(s) jointe(s)">📎 ${i}</span>`:""}
                ${s?`<span title="${s} commentaire(s)">💬 ${s}</span>`:""}
               </div>`:""}
        ${m?.isdone?`<div class="tampon-termine" style="color:${a.col.STATUT.getColor(e.STATUT)??Z};">${f(d(e.STATUT))}</div>`:""}
    `,t.addEventListener("click",()=>{grist.setCursorPos({rowId:e.id}),a.opt.hideedit||G(e)}),t.addEventListener("dblclick",()=>{grist.setCursorPos({rowId:e.id}),a.opt.gristeditcard?grist.commandApi.run("viewAsCard"):a.opt.hideedit||G(e)}),t}function yt(e){return`
        <span
            class="etiquette-badge"
            style="background:${p(e.color)};color:${p(e.textColor)}"
            title="${p(e.label)}"
        >${f(e.label)}</span>
    `}function wt(e,t){const n=w(t)||w(a.opt?.defaultcardcolor)||"#FFFFD1";e.style.backgroundColor=n}function St(){document.querySelectorAll(".contenu-colonne").forEach(e=>{Le(e),!(a.opt.readonly||typeof Sortable!="function")&&new Sortable(e,{group:"kanban-todo",animation:150,ghostClass:"carte-fantome",chosenClass:"carte-selectionnee",onEnd:async t=>{const n=t.to.dataset.statut,o=t.from.dataset.statut,r=t.item.dataset.todoId;try{n!==o?await Q(r,"STATUT",n):t.oldIndex!==t.newIndex&&await Nt(t.to)}catch(i){console.error(v("Error during status update:"),i),await z(M)}Le(t.to),ue(t.to.closest(".colonne-kanban")),t.from!==t.to&&ue(t.from.closest(".colonne-kanban"))}})})}async function Nt(e){if(!a.map?.DEADLINE)return;const n=Array.from(e.querySelectorAll(".carte")).filter(i=>{const s=ve(i.dataset.deadline);return s===null||s>=P.getTime()});if(n.length===0)return;let o=P.getFullYear();const r=n.map(i=>{const s=`${o}-01-01`;return o+=1,i.dataset.deadline=s,a.formatRecord(i.dataset.todoId,{DEADLINE:s})});await a.updateRecords(r)}function Le(e){if(!e)return;const t=e.dataset.isdone==="true",n=Array.from(e.children);n.sort((o,r)=>{let i=0;return a.map?.DEADLINE&&(t?i=Y(r.dataset.lastUpdate,0)-Y(o.dataset.lastUpdate,0):i=Y(o.dataset.deadline,Number.MAX_SAFE_INTEGER)-Y(r.dataset.deadline,Number.MAX_SAFE_INTEGER)),i!==0?i:(Number(o.dataset.todoId)||0)-(Number(r.dataset.todoId)||0)}),n.forEach(o=>e.appendChild(o))}function ue(e){if(!e)return;const t=e.querySelector(".contenu-colonne"),n=e.querySelector(".compteur-colonne");t&&n&&(n.textContent=`(${t.children.length})`)}async function G(e){const t=document.getElementById("popup-todo");if(!t)return;if(a.opt.readonly){U();return}document.querySelector(".carte.active")?.classList.remove("active"),X(e.id)?.classList.add("active");const n=ge(e.STATUT),o=a.col.STATUT.getColor(e.STATUT)??Z,r=a.col.STATUT.getTextColor(e.STATUT)??ye;t.style.borderLeftColor=o,t.dataset.statut=d(e.STATUT),t.dataset.isdone=n?.isdone?"true":"false",t.dataset.currentTodo=String(e.id);const i=t.querySelector(".popup-title"),s=t.querySelector(".popup-content"),c=t.querySelector(".popup-header"),l=t.querySelector(".bouton-fermer");if(i&&(i.textContent=d(e.DESCRIPTION)||v("New task")),c&&(c.style.backgroundColor=o,c.style.color=r),l&&(l.style.color=r),!s)return;const u=[],m=a.col.DESCRIPTION.getIsFormula(),h=a.map?.NOTES?a.col.NOTES.getIsFormula():!1;u.push(`
        <div class="field field-wide">
            <label class="field-label">Nom de la tâche</label>
            <textarea
                class="field-textarea auto-expand task-title-input"
                onchange="mettreAJourChamp(${Number(e.id)}, 'DESCRIPTION', this.value, event)"
                oninput="ajusterTextarea(this)"
                ${m?"disabled":""}
            >${f(d(e.DESCRIPTION))}</textarea>
        </div>
    `),a.map?.NOTES&&u.push(Tt(e,h)),a.map?.ETIQUETTES&&u.push(jt(e)),a.map?.RESPONSABLE&&u.push(Ut(e.id,st(e),a.map.RESPONSABLE,a.col.RESPONSABLE.getIsFormula())),a.map?.DEADLINE&&u.push(`
            <div class="field">
                <label class="field-label">Échéance</label>
                <input
                    type="date"
                    class="field-input"
                    value="${p(wn(e.DEADLINE))}"
                    onchange="mettreAJourChamp(${Number(e.id)}, 'DEADLINE', this.value || null, event)"
                    ${a.col.DEADLINE.getIsFormula()?"disabled":""}
                >
            </div>
        `),a.map?.COULEUR&&u.push(kt(e));let g=`<div class="form-grid">${u.join("")}</div>`;a.map?.PIECES_JOINTES&&a.opt.showattachments!==!1&&(g+=Vt(e)),a.map?.COMMENTAIRES&&a.opt.showcomments!==!1&&(g+=en(e));const b=a.opt.showmetadata!==!1?vn(e):"";b&&(g+=`<div class="info-creation">${b}</div>`),g+=`
        <div class="popup-actions">
            <button
                type="button"
                class="popup-action-button bouton-supprimer"
                onclick="supprimerTodo(${Number(e.id)}, event)"
                title="${p(v("Remove the task"))}"
                aria-label="${p(v("Remove the task"))}"
            >🗑️</button>
        </div>
    `,s.innerHTML=g,s.querySelectorAll(".auto-expand").forEach(F),t.classList.add("visible"),a.map?.PIECES_JOINTES&&a.opt.showattachments!==!1&&await de(e.id)}function Tt(e,t){const n=Number(e.id),o=$t(e.NOTES),r=ke(o).trim().length>0,i=t?"disabled":"",s=[["bold","<strong>B</strong>","Gras"],["italic","<em>I</em>","Italique"],["underline","<u>U</u>","Souligné"],["strikeThrough","<s>S</s>","Barré"],["insertUnorderedList","• Liste","Liste à puces"],["insertOrderedList","1. Liste","Liste numérotée"],["insertHorizontalRule","―","Ligne de séparation"],["removeFormat","Tx","Effacer la mise en forme"],["undo","↶","Annuler"],["redo","↷","Rétablir"]].map(([c,l,u])=>`
        <button
            type="button"
            class="notes-tool"
            data-command="${c}"
            onmousedown="event.preventDefault()"
            onclick="appliquerCommandeNotes(this, '${c}', null, event)"
            title="${p(u)}"
            aria-label="${p(u)}"
            ${i}
        >${l}</button>
    `).join("");return`
        <div
            class="field field-wide notes-field"
            data-row-id="${n}"
            data-disabled="${t?"true":"false"}"
        >
            <div class="notes-heading">
                <label class="field-label">Notes</label>
                <button
                    type="button"
                    class="notes-edit-button"
                    onclick="activerEditionNotes(this, event)"
                    ${i}
                >✏️ Modifier</button>
            </div>

            <div
                class="notes-display${r?"":" empty"}"
                tabindex="0"
            >${r?o:"Aucune note pour cette tâche."}</div>

            <div class="notes-edit-panel" hidden>
                <div class="notes-toolbar" role="toolbar" aria-label="Mise en forme des notes">
                    <label class="sr-only" for="notes-format-${n}">Style du paragraphe</label>
                    <select
                        id="notes-format-${n}"
                        class="notes-format-select"
                        onchange="appliquerFormatBlocNotes(this, event)"
                        title="Style du paragraphe"
                        ${i}
                    >
                        <option value="p">Paragraphe</option>
                        <option value="h2">Titre</option>
                        <option value="h3">Sous-titre</option>
                        <option value="blockquote">Citation</option>
                        <option value="pre">Bloc de code</option>
                    </select>

                    <span class="notes-toolbar-separator" aria-hidden="true"></span>

                    ${s}

                    <button
                        type="button"
                        class="notes-tool"
                        onmousedown="event.preventDefault()"
                        onclick="appliquerBaliseSelectionNotes(this, 'code', event)"
                        title="Code dans la ligne"
                        aria-label="Code dans la ligne"
                        ${i}
                    >&lt;/&gt;</button>

                    <button
                        type="button"
                        class="notes-tool"
                        onmousedown="event.preventDefault()"
                        onclick="appliquerBaliseSelectionNotes(this, 'mark', event)"
                        title="Surligner"
                        aria-label="Surligner"
                        ${i}
                    >🖍</button>

                    <button
                        type="button"
                        class="notes-tool notes-tool-link"
                        onmousedown="event.preventDefault()"
                        onclick="creerLienNotes(this, event)"
                        title="Ajouter ou modifier un lien"
                        aria-label="Ajouter ou modifier un lien"
                        ${i}
                    >🔗 Lien</button>

                    <button
                        type="button"
                        class="notes-tool"
                        data-command="unlink"
                        onmousedown="event.preventDefault()"
                        onclick="appliquerCommandeNotes(this, 'unlink', null, event)"
                        title="Retirer le lien"
                        aria-label="Retirer le lien"
                        ${i}
                    >⛓̸</button>
                </div>

                <div
                    class="notes-editor"
                    contenteditable="${t?"false":"true"}"
                    data-placeholder="Ajoutez des notes…"
                    oninput="marquerNotesModifiees(this)"
                    onpaste="nettoyerCollageNotes(this, event)"
                    onkeyup="mettreAJourEtatBarreNotes(this)"
                    onmouseup="mettreAJourEtatBarreNotes(this)"
                    onkeydown="gererRaccourcisNotes(this, event)"
                    role="textbox"
                    aria-multiline="true"
                >${o}</div>

                <div class="notes-edit-footer">
                    <div
                        id="notes-status-${n}"
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
    `}function At(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".notes-field"),o=n?.querySelector(".notes-edit-panel"),r=n?.querySelector(".notes-display"),i=n?.querySelector(".notes-editor");!n||!o||!r||!i||n.dataset.disabled==="true"||(n._originalNotesHtml=q(i.innerHTML),n.classList.add("is-editing"),n.classList.remove("is-dirty"),r.hidden=!0,o.hidden=!1,e.hidden=!0,document.execCommand("defaultParagraphSeparator",!1,"p"),i.focus(),Ot(i),D(i),$(Number(n.dataset.rowId),"",""))}function Ct(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".notes-field"),o=n?.querySelector(".notes-editor");!n||!o||(o.innerHTML=n._originalNotesHtml||"",_e(n,!1))}async function It(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".notes-field"),o=n?.querySelector(".notes-editor"),r=Number(n?.dataset?.rowId);if(!(!n||!o||!Number.isInteger(r)||r<=0)){e.disabled=!0;try{const i=await Pt(r,o);n._originalNotesHtml=i,_e(n,!0)}finally{e.disabled=!1}}}function _e(e,t){const n=e.querySelector(".notes-edit-panel"),o=e.querySelector(".notes-display"),r=e.querySelector(".notes-editor"),i=e.querySelector(".notes-edit-button");if(t&&o&&r){const s=q(r.innerHTML).trim(),c=ke(s).trim().length>0;o.innerHTML=c?s:"Aucune note pour cette tâche.",o.classList.toggle("empty",!c)}e.classList.remove("is-editing","is-dirty"),n&&(n.hidden=!0),o&&(o.hidden=!1),i&&(i.hidden=!1),$(Number(e.dataset.rowId),"","")}function $t(e){const t=d(e).trim();if(!t)return"";const o=/<\/?[a-z][\s\S]*>/i.test(t)?t:f(t).replace(/\r?\n/g,"<br>");return q(o)}function q(e){const t=document.createElement("template");t.innerHTML=d(e);const n=new Set(["B","STRONG","I","EM","U","S","STRIKE","A","UL","OL","LI","P","DIV","BR","BLOCKQUOTE","H2","H3","SPAN","CODE","PRE","HR","MARK"]),o=new Set(["SCRIPT","STYLE","IFRAME","OBJECT","EMBED","FORM","INPUT","BUTTON","SVG","MATH","META","LINK"]),r=i=>{Array.from(i.childNodes).forEach(s=>{if(s.nodeType===Node.ELEMENT_NODE){if(o.has(s.tagName)){s.remove();return}if(!n.has(s.tagName)){r(s),s.replaceWith(...Array.from(s.childNodes));return}if(Array.from(s.attributes).forEach(c=>{s.tagName==="A"&&["href","target","rel"].includes(c.name.toLowerCase())||s.removeAttribute(c.name)}),s.tagName==="A"){const c=Pe(s.getAttribute("href"));if(!c){s.replaceWith(...Array.from(s.childNodes));return}s.setAttribute("href",c),s.setAttribute("target","_blank"),s.setAttribute("rel","noopener noreferrer")}r(s)}else s.nodeType!==Node.TEXT_NODE&&s.remove()})};return r(t.content),t.innerHTML}function Mt(e,t){t?.preventDefault(),t?.stopPropagation();const o=e.closest(".notes-field")?.querySelector(".notes-editor");!o||o.contentEditable!=="true"||(o.focus(),document.execCommand("formatBlock",!1,e.value||"p"),T(o),D(o))}function Rt(e,t,n,o){o?.preventDefault(),o?.stopPropagation();const i=e.closest(".notes-field")?.querySelector(".notes-editor");!i||i.contentEditable!=="true"||(i.focus(),document.execCommand(t,!1,n),T(i),D(i))}function Dt(e,t,n){n?.preventDefault(),n?.stopPropagation();const r=e.closest(".notes-field")?.querySelector(".notes-editor"),i=window.getSelection();if(!r||r.contentEditable!=="true"||!i||i.rangeCount===0)return;r.focus();const s=i.getRangeAt(0);if(!r.contains(s.commonAncestorContainer))return;const c=s.toString(),l=t==="mark"?"mark":"code";c?document.execCommand("insertHTML",!1,`<${l}>${f(c)}</${l}>`):document.execCommand("insertHTML",!1,`<${l}>&#8203;</${l}>`),T(r),D(r)}function Oe(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".notes-field"),o=n?.querySelector(".notes-editor");if(!o||o.contentEditable!=="true")return;o.focus();const r=window.prompt("Adresse du lien :","https://");if(r===null)return;const i=Pe(r);if(!i){$(Number(n.dataset.rowId),"error","Adresse de lien invalide.");return}const s=window.getSelection();!s||s.isCollapsed?document.execCommand("insertHTML",!1,`<a href="${p(i)}" target="_blank" rel="noopener noreferrer">${f(i)}</a>`):document.execCommand("createLink",!1,i),T(o),D(o)}function Pe(e){const t=d(e).trim();if(!t)return"";const n=/^(https?:|mailto:|tel:)/i.test(t)?t:`https://${t}`;try{const o=new URL(n);return["http:","https:","mailto:","tel:"].includes(o.protocol)?o.href:""}catch{return""}}function Lt(e,t){if(!t?.clipboardData)return;t.preventDefault();const n=t.clipboardData.getData("text/html"),o=t.clipboardData.getData("text/plain"),r=n?q(n):f(o).replace(/\r?\n/g,"<br>");document.execCommand("insertHTML",!1,r),T(e)}function T(e){const t=e?.closest(".notes-field");t&&(t.classList.add("is-dirty"),$(Number(t.dataset.rowId),"saving","Modifications non enregistrées"))}function D(e){const t=e?.closest(".notes-field");if(!t||!t.classList.contains("is-editing"))return;t.querySelectorAll(".notes-tool[data-command]").forEach(o=>{let r=!1;try{r=document.queryCommandState(o.dataset.command)}catch{r=!1}o.classList.toggle("active",r),o.setAttribute("aria-pressed",r?"true":"false")});const n=t.querySelector(".notes-format-select");if(n){let o="p";try{o=d(document.queryCommandValue("formatBlock")).replace(/[<>]/g,"").toLowerCase()||"p"}catch{o="p"}Array.from(n.options).some(r=>r.value===o)?n.value=o:n.value="p"}}function _t(e,t){if(!(t.ctrlKey||t.metaKey))return;const n=t.key.toLowerCase();if(n==="k"){t.preventDefault();const o=e.closest(".notes-field")?.querySelector(".notes-tool-link");o&&Oe(o,t)}t.shiftKey&&n==="7"&&(t.preventDefault(),document.execCommand("insertOrderedList"),T(e)),t.shiftKey&&n==="8"&&(t.preventDefault(),document.execCommand("insertUnorderedList"),T(e))}function Ot(e){const t=document.createRange(),n=window.getSelection();t.selectNodeContents(e),t.collapse(!1),n?.removeAllRanges(),n?.addRange(t)}function ke(e){const t=document.createElement("template");return t.innerHTML=d(e),t.content.textContent||""}async function Pt(e,t){if(!t)return"";const n=Number(e),o=q(t.innerHTML).trim(),r=W.get(n)||Promise.resolve();$(n,"saving","Enregistrement…");const i=r.catch(()=>{}).then(()=>Q(n,"NOTES",o||null)).then(()=>(t.innerHTML=o,$(n,"saved","Enregistré"),o)).catch(s=>{throw $(n,"error","Échec de l’enregistrement"),console.error("Erreur pendant l’enregistrement des notes :",s),s}).finally(()=>{W.get(n)===i&&W.delete(n)});return W.set(n,i),i}function $(e,t,n){const o=document.getElementById(`notes-status-${Number(e)}`);o&&(o.className=`section-status notes-status${t?` ${t}`:""}`,o.textContent=n)}function kt(e){const t=w(e.COULEUR),n=t||w(a.opt?.defaultcardcolor)||"#FFFFD1",o=a.col.COULEUR.getIsFormula();return`
        <div class="field color-field" data-row-id="${Number(e.id)}">
            <label class="field-label">Couleur de la carte</label>
            <div class="color-picker-row">
                <input
                    type="color"
                    class="color-picker"
                    value="${p(n)}"
                    oninput="previsualiserCouleur(${Number(e.id)}, this.value, this)"
                    onchange="mettreAJourCouleur(${Number(e.id)}, this.value, this, event)"
                    ${o?"disabled":""}
                    aria-label="Choisir une couleur"
                >
                <input
                    type="text"
                    class="field-input color-value"
                    value="${p(t||"")}"
                    placeholder="#FFFFD1"
                    maxlength="7"
                    oninput="previsualiserCouleur(${Number(e.id)}, this.value, this)"
                    onchange="mettreAJourCouleur(${Number(e.id)}, this.value, this, event)"
                    ${o?"disabled":""}
                >
                <button
                    type="button"
                    class="color-reset"
                    onclick="reinitialiserCouleur(this, event)"
                    ${o?"disabled":""}
                    title="Utiliser la couleur par défaut"
                >Réinitialiser</button>
            </div>
            <div class="section-status color-status" aria-live="polite"></div>
        </div>
    `}function w(e){const t=d(e).trim();if(!t)return"";const n=t.startsWith("#")?t:`#${t}`;return/^#[0-9a-f]{3}$/i.test(n)?`#${n[1]}${n[1]}${n[2]}${n[2]}${n[3]}${n[3]}`.toUpperCase():/^#[0-9a-f]{6}$/i.test(n)?n.toUpperCase():""}function qt(e,t,n){const o=w(t);if(!o)return;const r=X(e);r&&(r.style.backgroundColor=o);const i=n?.closest(".color-field");if(i){const s=i.querySelector(".color-picker"),c=i.querySelector(".color-value");s&&n!==s&&(s.value=o),c&&n!==c&&(c.value=o)}}async function qe(e,t,n,o){o?.stopPropagation();const r=n?.closest(".color-field"),i=r?.querySelector(".color-status"),s=d(t).trim(),c=w(s);if(s&&!c){i&&(i.className="section-status color-status error",i.textContent="Utilisez un code hexadécimal, par exemple #FFFFD1.");return}try{i&&(i.className="section-status color-status saving",i.textContent="Enregistrement…"),await Q(e,"COULEUR",c||null,o);const l=X(e);if(l&&(c?l.style.backgroundColor=c:l.style.backgroundColor=w(a.opt?.defaultcardcolor)||"#FFFFD1"),r){const u=r.querySelector(".color-picker"),m=r.querySelector(".color-value");u&&(u.value=c||w(a.opt?.defaultcardcolor)||"#FFFFD1"),m&&(m.value=c||"")}i&&(i.className="section-status color-status saved",i.textContent="Enregistré",window.setTimeout(()=>{i.className="section-status color-status",i.textContent=""},1200))}catch(l){i&&(i.className="section-status color-status error",i.textContent="Impossible d’enregistrer la couleur."),console.error("Erreur pendant l’enregistrement de la couleur :",l)}}function xt(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".color-field"),o=Number(n?.dataset?.rowId);if(!n||!Number.isInteger(o)||o<=0)return;const r=n.querySelector(".color-value");r&&(r.value=""),qe(o,"",e,t)}function Ut(e,t,n,o){const r=new Set(be(t)),i=C.map(c=>`
        <label class="multi-option responsable-option" data-search="${p(c.label.toLocaleLowerCase(a.cultureFull))}">
            <input
                type="checkbox"
                value="${c.id}"
                ${r.has(c.id)?"checked":""}
                onchange="mettreAJourChampResponsables(${Number(e)}, this.closest('.multi-dropdown'), event)"
                ${o?"disabled":""}
            >
            <span class="responsable-option-avatar" style="background:${p(c.avatarColor)}">${f(c.initials)}</span>
            <span class="responsable-option-name">${f(c.label)}</span>
        </label>
    `).join(""),s=[...r].map(c=>S.get(c)?.label).filter(Boolean);return`
        <div class="field field-responsables">
            <label class="field-label">${f(n)}</label>
            <details class="multi-dropdown responsables-dropdown" data-row-id="${Number(e)}">
                <summary>${f(xe(s))}</summary>
                <div class="multi-dropdown-menu">
                    <div class="multi-toolbar">
                        <input
                            type="search"
                            class="multi-search"
                            placeholder="Rechercher…"
                            oninput="filtrerOptionsMultiples(this)"
                            onclick="event.stopPropagation()"
                            ${o?"disabled":""}
                        >
                        <button type="button" class="multi-clear" onclick="viderResponsables(this, event)" ${o?"disabled":""}>Effacer</button>
                    </div>
                    <div class="multi-options">${i||'<div class="multi-empty">Aucun membre disponible</div>'}</div>
                    <div class="multi-status" aria-live="polite"></div>
                </div>
            </details>
        </div>
    `}function xe(e){const t=L(e);return t.length===0?"Choisir…":t.length===1?t[0]:`${t.length} responsables`}function Ft(e){const t=e.closest(".multi-dropdown");if(!t)return;const n=e.value.trim().toLocaleLowerCase(a.cultureFull);t.querySelectorAll(".multi-option").forEach(o=>{o.hidden=n!==""&&!d(o.dataset.search).includes(n)})}function Jt(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".multi-dropdown");n&&(n.querySelectorAll('input[type="checkbox"]:checked').forEach(o=>{o.checked=!1}),Ue(Number(n.dataset.rowId),n,t))}async function Ue(e,t,n){n?.stopPropagation();const o=Number(e||t?.dataset?.rowId);if(!Number.isInteger(o)||o<=0||!t)return;const r=Array.from(t.querySelectorAll('input[type="checkbox"]:checked')).map(l=>Number(l.value)).filter(l=>Number.isInteger(l)&&l>0&&S.has(l)),i=r.map(l=>S.get(l).label);t.querySelector("summary").textContent=xe(i),A(t,"saving","Enregistrement…");const c=(j.get(o)||Promise.resolve()).catch(()=>{}).then(()=>Be(o,"RESPONSABLE",r)).then(()=>{Bt(o,r),A(t,"saved","Enregistré"),window.setTimeout(()=>A(t,"",""),1200)}).catch(l=>{A(t,"error","Échec de l’enregistrement"),console.error("Erreur lors de l’enregistrement des responsables :",l)}).finally(()=>{j.get(o)===c&&j.delete(o)});j.set(o,c),await c}function Bt(e,t){const n=y(e);n&&(n.RESPONSABLE_id=[...t],n.RESPONSABLE=t.map(o=>S.get(o)?.label).filter(Boolean))}function jt(e){const t=new Set(at(e)),n=a.col.ETIQUETTES.getIsFormula(),o=R.map(i=>`
        <label class="multi-option etiquette-option" data-search="${p(i.label.toLocaleLowerCase(a.cultureFull))}">
            <input
                type="checkbox"
                value="${i.id}"
                ${t.has(i.id)?"checked":""}
                onchange="mettreAJourEtiquettes(${Number(e.id)}, this.closest('.multi-dropdown'), event)"
                ${n?"disabled":""}
            >
            <span
                class="etiquette-preview"
                style="background:${p(i.color)};color:${p(i.textColor)}"
            >${f(i.label)}</span>
        </label>
    `).join(""),r=[...t].map(i=>I.get(i)?.label).filter(Boolean);return`
        <div class="field field-etiquettes">
            <label class="field-label">Étiquettes</label>
            <details class="multi-dropdown etiquettes-dropdown" data-row-id="${Number(e.id)}">
                <summary>${f(Fe(r))}</summary>
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
                    <div class="multi-options">${o||'<div class="multi-empty">Ajoutez des lignes dans la table référencée par Étiquettes</div>'}</div>
                    <div class="multi-status" aria-live="polite"></div>
                </div>
            </details>
        </div>
    `}function Fe(e){const t=L(e);return t.length===0?"Choisir…":t.length===1?t[0]:`${t.length} étiquettes`}function Ht(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".multi-dropdown");n&&(n.querySelectorAll('input[type="checkbox"]:checked').forEach(o=>{o.checked=!1}),Je(Number(n.dataset.rowId),n,t))}async function Je(e,t,n){n?.stopPropagation();const o=Number(e||t?.dataset?.rowId);if(!Number.isInteger(o)||o<=0||!t)return;const r=Array.from(t.querySelectorAll('input[type="checkbox"]:checked')).map(l=>Number(l.value)).filter(l=>Number.isInteger(l)&&l>0&&I.has(l)),i=r.map(l=>I.get(l).label);t.querySelector("summary").textContent=Fe(i),A(t,"saving","Enregistrement…");const c=(H.get(o)||Promise.resolve()).catch(()=>{}).then(()=>Be(o,"ETIQUETTES",r)).then(()=>{Kt(o,r),A(t,"saved","Enregistré"),window.setTimeout(()=>A(t,"",""),1200)}).catch(l=>{A(t,"error","Échec de l’enregistrement"),console.error("Erreur lors de l’enregistrement des étiquettes :",l)}).finally(()=>{H.get(o)===c&&H.delete(o)});H.set(o,c),await c}function Kt(e,t){const n=y(e);n&&(n.ETIQUETTES_id=[...t],n.ETIQUETTES=t.map(o=>I.get(o)?.label).filter(Boolean))}async function Be(e,t,n){const o=a.map?.[t];if(!o||Array.isArray(o))throw new Error(`La colonne ${t} n’est pas correctement mappée.`);const r=[...new Set(_(n).map(Number).filter(u=>Number.isInteger(u)&&u>0))],i=await grist.getTable().getTableId(),s=r.length>0?["L",...r]:null;await grist.docApi.applyUserActions([["UpdateRecord",i,Number(e),{[o]:s}]]);const c=await je(e,o),l=Wt(c);if(!zt(r,l))throw new Error(`Vérification d’écriture échouée pour ${t}. Valeur envoyée : ${JSON.stringify(s)} ; valeur relue : ${JSON.stringify(c)}`);await nt(e)}async function je(e,t){const n=await grist.getTable().getTableId(),o=await grist.docApi.fetchTable(n),r=_(o?.id).findIndex(i=>Number(i)===Number(e));if(r<0)throw new Error(`Ligne ${e} introuvable dans la table ${n}.`);return o?.[t]?.[r]}function Wt(e){return e==null||e===""?[]:!Array.isArray(e)||e[0]==="E"?[]:e[0]==="L"?N(e.slice(1)):e[0]==="r"?N(e[2]):N(e)}function zt(e,t){const n=[...new Set(e.map(Number))].sort((r,i)=>r-i),o=[...new Set(t.map(Number))].sort((r,i)=>r-i);return n.length===o.length&&n.every((r,i)=>r===o[i])}function A(e,t,n){const o=e?.querySelector(".multi-status");o&&(o.className=`multi-status${t?` ${t}`:""}`,o.textContent=n)}function Vt(e){const t=a.col.PIECES_JOINTES.getIsFormula();return`
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
    `}async function de(e){const t=document.getElementById(`attachments-list-${Number(e)}`);if(!t)return;const n=y(e),o=N(n?.PIECES_JOINTES);if(o.length===0){t.innerHTML='<div class="section-empty">Aucune pièce jointe</div>';return}t.innerHTML='<div class="section-loading">Chargement des aperçus…</div>';try{const[r]=await Promise.all([ze(!0),ae()]);t.innerHTML=o.map(i=>He(e,i,r)).join("")}catch(r){console.error("Impossible d’afficher les pièces jointes :",r),t.innerHTML=o.map(i=>He(e,i,null)).join("")}}function He(e,t,n){const o=Ge(t),r=n?Ve(n,t):"",i=Qe(o),s=i==="image"&&r?`<img src="${p(r)}" alt="${p(o.fileName)}" loading="lazy">`:`<div class="attachment-file-icon">${Xe(i)}</div>`;return`
        <article class="attachment-card">
            <button type="button" class="attachment-preview" onclick="ouvrirPieceJointe(${Number(e)}, ${Number(t)}, event)" title="Ouvrir ${p(o.fileName)}">
                ${s}
            </button>
            <div class="attachment-info">
                <div class="attachment-name" title="${p(o.fileName)}">${f(o.fileName)}</div>
                <div class="attachment-meta">${f(Sn(o.fileSize))}</div>
            </div>
            <div class="attachment-actions">
                <button type="button" onclick="ouvrirPieceJointe(${Number(e)}, ${Number(t)}, event)" title="Visualiser">👁</button>
                <button type="button" onclick="retirerPieceJointe(${Number(e)}, ${Number(t)}, event)" title="Retirer de la tâche">×</button>
            </div>
        </article>
    `}async function Gt(e,t,n){n?.stopPropagation();const o=Array.from(t?.files||[]);if(o.length===0)return;const r=o.find(i=>i.size>mt);if(r){E("attachments",e,"error",`${r.name} dépasse 50 Mo.`),t.value="";return}t.disabled=!0,E("attachments",e,"saving",`Envoi de ${o.length} fichier(s)…`);try{const i=await grist.docApi.getAccessToken({readOnly:!1}),s=new FormData;o.forEach(b=>s.append("upload",b,b.name));const c=await fetch(`${i.baseUrl}/attachments?auth=${encodeURIComponent(i.token)}`,{method:"POST",body:s,headers:{"X-Requested-With":"XMLHttpRequest"}});if(!c.ok)throw new Error(`Upload échoué (${c.status} ${c.statusText})`);const l=await c.json(),u=N(l);if(u.length===0)throw new Error("Grist n’a retourné aucun identifiant de pièce jointe.");const m=y(e),h=N(m?.PIECES_JOINTES),g=[...new Set([...h,...u])];await Ke(e,g),m&&(m.PIECES_JOINTES=[...g]),J=!1,await ae(!0),await de(e),E("attachments",e,"saved","Pièce(s) jointe(s) ajoutée(s).")}catch(i){console.error("Erreur pendant l’ajout des pièces jointes :",i),E("attachments",e,"error",i.message||"Échec de l’envoi.")}finally{t.value="",t.disabled=!1}}async function Qt(e,t,n){n?.preventDefault(),n?.stopPropagation();const o=y(e),i=N(o?.PIECES_JOINTES).filter(s=>s!==Number(t));try{E("attachments",e,"saving","Mise à jour…"),await Ke(e,i),o&&(o.PIECES_JOINTES=[...i]),await de(e),E("attachments",e,"saved","Pièce jointe retirée de la tâche.")}catch(s){console.error("Erreur pendant le retrait de la pièce jointe :",s),E("attachments",e,"error","Impossible de retirer la pièce jointe.")}}async function Ke(e,t){const n=a.map?.PIECES_JOINTES;if(!n||Array.isArray(n))throw new Error("La colonne Pièces jointes n’est pas correctement mappée.");await grist.getTable().update({id:Number(e),fields:{[n]:["L",...t]}}),await nt(e)}async function Xt(e,t,n){n?.preventDefault(),n?.stopPropagation();try{const[o]=await Promise.all([ze(!0),ae()]),r=Ge(t),i=Ve(o,t);Zt(r,i)}catch(o){console.error("Impossible d’ouvrir la pièce jointe :",o),window.alert("Impossible d’ouvrir cette pièce jointe.")}}function Yt(){if(document.getElementById("attachment-viewer"))return;const e=document.createElement("div");e.id="attachment-viewer",e.className="attachment-viewer",e.setAttribute("aria-hidden","true"),e.innerHTML=`
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
    `,document.body.appendChild(e)}function Zt(e,t){const n=document.getElementById("attachment-viewer"),o=document.getElementById("attachment-viewer-content"),r=document.getElementById("attachment-viewer-title"),i=document.getElementById("attachment-viewer-download");if(!n||!o||!r||!i)return;r.textContent=e.fileName,i.href=t;const s=Qe(e);s==="image"?o.innerHTML=`<img src="${p(t)}" alt="${p(e.fileName)}">`:s==="pdf"?o.innerHTML=`<iframe src="${p(t)}" title="${p(e.fileName)}"></iframe>`:s==="video"?o.innerHTML=`<video src="${p(t)}" controls autoplay></video>`:s==="audio"?o.innerHTML=`<div class="attachment-generic-preview"><div class="attachment-large-icon">🎵</div><audio src="${p(t)}" controls autoplay></audio></div>`:o.innerHTML=`<div class="attachment-generic-preview"><div class="attachment-large-icon">${Xe(s)}</div><p>Ce format ne dispose pas d’un aperçu intégré.</p><a href="${p(t)}" target="_blank" rel="noopener">Ouvrir ou télécharger le fichier</a></div>`,n.classList.add("visible"),n.setAttribute("aria-hidden","false")}function We(e){e?.preventDefault(),e?.stopPropagation();const t=document.getElementById("attachment-viewer");if(!t)return;t.classList.remove("visible"),t.setAttribute("aria-hidden","true");const n=document.getElementById("attachment-viewer-content");n&&(n.innerHTML="")}async function ze(e=!0){if(e&&B&&Date.now()-we<dt)return B;const t=await grist.docApi.getAccessToken({readOnly:e});return e&&(B=t,we=Date.now()),t}function Ve(e,t){return`${e.baseUrl}/attachments/${Number(t)}/download?auth=${encodeURIComponent(e.token)}`}function Ge(e){return ne.get(Number(e))||{id:Number(e),fileName:`Pièce jointe ${Number(e)}`,fileExt:"",fileType:"",fileSize:0,imageWidth:0,imageHeight:0}}function Qe(e){const t=d(e.fileExt||ut(e.fileName)).toLowerCase().replace(/^\./,""),n=d(e.fileType).toLowerCase();return n.startsWith("image/")||["png","jpg","jpeg","gif","webp","svg","bmp","avif"].includes(t)?"image":n==="application/pdf"||t==="pdf"?"pdf":n.startsWith("video/")||["mp4","webm","mov","m4v","ogv"].includes(t)?"video":n.startsWith("audio/")||["mp3","wav","ogg","m4a","aac","flac"].includes(t)?"audio":["doc","docx","odt"].includes(t)?"document":["xls","xlsx","ods","csv"].includes(t)?"tableur":["ppt","pptx","odp"].includes(t)?"presentation":["zip","rar","7z","tar","gz"].includes(t)?"archive":"file"}function Xe(e){return{image:"🖼️",pdf:"📕",video:"🎬",audio:"🎵",document:"📄",tableur:"📊",presentation:"📽️",archive:"🗜️",file:"📎"}[e]||"📎"}function en(e){const t=x(e.COMMENTAIRES),n=a.opt.enablementions!==!1;return`
        <section
            class="detail-section comments-section"
            data-row-id="${Number(e.id)}"
        >
            <div class="detail-section-header">
                <div>
                    <h3>💬 Commentaires</h3>
                    <p>${t.length} commentaire(s)</p>
                </div>
            </div>

            <div
                id="comments-list-${Number(e.id)}"
                class="comments-list"
            >
                ${et(t,e.id)}
            </div>

            <div class="comment-composer">
                <div class="comment-input-wrapper">
                    <textarea
                        class="comment-input"
                        placeholder="Écrire un commentaire${n?" — utilisez @ pour mentionner quelqu’un":""}…"
                        oninput="ajusterTextarea(this); gererSaisieMention(this)"
                        onkeydown="gererTouchesMention(this, event)"
                    ></textarea>

                    ${n?tn():""}
                </div>

                ${n?`
                    <div class="comment-mention-tools">
                        <button
                            type="button"
                            class="comment-mention-button"
                            onclick="ouvrirMenuMentions(this, event)"
                        >@ Mentionner</button>
                        <div class="comment-selected-mentions"></div>
                    </div>
                `:""}

                <div class="comment-grist-author">
                    Le nom de l’auteur est renseigné par Grist avec
                    <code>user.Name</code>.
                    ${n?"Les e-mails sont préparés dans la table de notifications configurée.":""}
                </div>

                <div class="comment-composer-footer">
                    <div
                        id="comments-status-${Number(e.id)}"
                        class="section-status"
                        aria-live="polite"
                    ></div>
                    <button
                        type="button"
                        onclick="ajouterCommentaire(${Number(e.id)}, this, event)"
                    >Commenter</button>
                </div>
            </div>
        </section>
    `}function tn(){return`
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
                ${C.map(t=>`
        <button
            type="button"
            class="mention-option"
            data-member-id="${t.id}"
            data-search="${p(`${t.label} ${t.email||""}`.toLocaleLowerCase(a.cultureFull))}"
            onclick="selectionnerMentionCommentaire(this, ${t.id}, event)"
        >
            <span
                class="mention-option-avatar"
                style="background:${p(t.avatarColor)}"
            >${f(t.initials)}</span>
            <span class="mention-option-text">
                <strong>${f(t.label)}</strong>
                <small>${t.email?f(t.email):"E-mail manquant dans la table Membres"}</small>
            </span>
        </button>
    `).join("")||'<div class="section-empty">Aucun membre disponible</div>'}
            </div>
        </div>
    `}function nn(e,t){t?.preventDefault(),t?.stopPropagation();const o=e.closest(".comment-composer")?.querySelector(".mention-menu");o&&(o.hidden=!1,Ye(o,""))}function on(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".mention-menu");n&&(n.hidden=!0)}function rn(e){const n=e.closest(".comment-composer")?.querySelector(".mention-menu");if(!n||a.opt.enablementions===!1)return;const o=Ze(e);if(!o){n.hidden=!0;return}n.hidden=!1,n.dataset.mentionStart=String(o.start),Ye(n,o.query)}function sn(e,t){const o=e.closest(".comment-composer")?.querySelector(".mention-menu");if(!o||o.hidden)return;const r=Array.from(o.querySelectorAll(".mention-option:not([hidden])"));if(t.key==="Escape"){t.preventDefault(),o.hidden=!0,e.focus();return}t.key==="Enter"&&r.length===1&&(t.preventDefault(),r[0].click())}function Ye(e,t){const n=d(t).trim().toLocaleLowerCase(a.cultureFull);e.querySelectorAll(".mention-option").forEach(o=>{o.hidden=n!==""&&!d(o.dataset.search).includes(n)})}function Ze(e){const t=Number(e.selectionStart),o=e.value.slice(0,t).match(/(?:^|\s)@([^@\n]*)$/);if(!o)return null;const r=o[1];return{query:r,start:t-r.length-1,end:t}}function an(e,t,n){n?.preventDefault(),n?.stopPropagation();const o=e.closest(".comment-composer"),r=o?.querySelector(".comment-input"),i=o?.querySelector(".mention-menu"),s=S.get(Number(t));if(!o||!r||!s)return;const c=Ze(r),l=`@${s.label}`;if(c)r.setRangeText(`${l} `,c.start,c.end,"end");else{const u=r.value&&!/\s$/.test(r.value)?" ":"";r.setRangeText(`${u}${l} `,r.selectionStart,r.selectionEnd,"end")}o._selectedMentions||(o._selectedMentions=new Map),o._selectedMentions.set(s.id,{id:s.id,name:s.label,email:s.email||""}),me(o),i&&(i.hidden=!0),r.focus(),F(r)}function me(e){const t=e.querySelector(".comment-selected-mentions");if(!t)return;const n=Array.from(e._selectedMentions?.values?.()||[]);t.innerHTML=n.map(o=>`
        <span class="selected-mention-chip">
            @${f(o.name)}
            <button
                type="button"
                onclick="retirerMentionCommentaire(this, ${Number(o.id)}, event)"
                aria-label="Retirer ${p(o.name)}"
            >×</button>
        </span>
    `).join("")}function cn(e,t,n){n?.preventDefault(),n?.stopPropagation();const o=e.closest(".comment-composer"),r=o?.querySelector(".comment-input"),i=S.get(Number(t));if(o?._selectedMentions?.delete(Number(t)),r&&i){const s=`@${i.label}`;r.value=r.value.replaceAll(s,"").replace(/[ \t]{2,}/g," ").trimStart(),F(r)}o&&me(o)}function et(e,t){return e.length===0?'<div class="section-empty">Aucun commentaire</div>':e.map(n=>`
        <article
            class="comment-card"
            data-comment-id="${p(n.id)}"
        >
            <div class="comment-header">
                <strong>${f(n.author===k?"Nom Grist non configuré":n.author||"Anonyme")}</strong>
                <span>${f(Ee(n.createdAt))}</span>
                <button
                    type="button"
                    onclick="supprimerCommentaire(
                        ${Number(t)},
                        '${Tn(n.id)}',
                        event
                    )"
                    title="Supprimer le commentaire"
                >×</button>
            </div>
            <div class="comment-body">
                ${ln(n)}
            </div>
        </article>
    `).join("")}function ln(e){let t=f(e.text).replace(/\n/g,"<br>");return pe(e.mentions).sort((o,r)=>r.name.length-o.name.length).forEach(o=>{const r=f(`@${o.name}`),i=`
            <span
                class="comment-mention"
                title="${p(o.email||o.name)}"
            >${r}</span>
        `;t=t.split(r).join(i)}),t}function x(e){const t=d(e).trim();if(!t)return[];try{const n=JSON.parse(t);if(!Array.isArray(n))throw new Error("Format non tableau");return n.map((o,r)=>({id:d(o?.id)||`legacy-${r}`,author:d(o?.author)||"Anonyme",createdAt:d(o?.createdAt),text:d(o?.text),mentions:pe(o?.mentions)})).filter(o=>o.text.trim())}catch{return[{id:"legacy-text",author:"Ancien commentaire",createdAt:"",text:t,mentions:[]}]}}function pe(e){return _(e).map(t=>({id:Number(t?.id)||0,name:d(t?.name||t?.label).trim(),email:ct(t?.email)})).filter(t=>t.name)}async function un(e,t,n){n?.preventDefault(),n?.stopPropagation();const r=t.closest(".comments-section")?.querySelector(".comment-composer"),i=r?.querySelector(".comment-input"),s=d(i?.value).trim();if(!s){E("comments",e,"error","Écrivez un commentaire."),i?.focus();return}const c=Array.from(r?._selectedMentions?.values?.()||[]).filter(u=>s.includes(`@${u.name}`));t.disabled=!0,E("comments",e,"saving","Enregistrement…");const l={id:Nn(),author:k,createdAt:new Date().toISOString(),text:s,mentions:c};try{const m=(await tt(e,b=>[...b,l])).find(b=>b.id===l.id);if(!m||m.author===k)throw new Error("La formule user.Name n’a pas remplacé le nom temporaire.");let h={prepared:0,missingEmails:[]};if(a.opt.enablementions!==!1&&m.mentions.length>0&&(h=await dn(e,m)),i&&(i.value="",F(i)),r){r._selectedMentions=new Map,me(r);const b=r.querySelector(".mention-menu");b&&(b.hidden=!0)}fe(e);const g=[`Commentaire ajouté par ${m.author}.`];h.prepared>0&&g.push(`${h.prepared} notification(s) transmise(s) à l’automatisation.`),h.missingEmails.length>0&&g.push(`E-mail manquant pour : ${h.missingEmails.join(", ")}.`),E("comments",e,h.missingEmails.length>0?"warning":"saved",g.join(" "))}catch(u){console.error("Erreur pendant l’ajout du commentaire :",u),fe(e),E("comments",e,"error",d(u?.message)||"Impossible d’ajouter le commentaire.")}finally{t.disabled=!1}}async function dn(e,t){const n=pe(t.mentions),o=n.filter(m=>!m.email).map(m=>m.name),r=[...new Map(n.filter(m=>m.email).map(m=>[m.email,m])).values()];if(r.length===0)return{prepared:0,missingEmails:o};const i=d(a.opt.mentionnotificationtable||"Notifications_Kanban").trim();if(!i)throw new Error("Renseignez la table des notifications dans la configuration du widget.");const s=y(e),c=d(s?.DESCRIPTION).trim()||`Tâche #${Number(e)}`,l=grist.getTable(i),u=r.map(m=>({fields:{Destinataire_email:m.email,Destinataire_nom:m.name,Tache_id:Number(e),Tache:c,Auteur:t.author,Commentaire:t.text,Commentaire_id:t.id,Cree_le:new Date().toISOString()}}));try{await l.create(u)}catch{throw new Error(`Le commentaire est enregistré, mais la table « ${i} » est absente ou mal configurée. Consultez le guide des notifications.`)}return{prepared:u.length,missingEmails:o}}async function mn(e,t,n){n?.preventDefault(),n?.stopPropagation();try{E("comments",e,"saving","Suppression…"),await tt(e,o=>o.filter(r=>r.id!==t)),fe(e),E("comments",e,"saved","Commentaire supprimé.")}catch(o){console.error("Erreur pendant la suppression du commentaire :",o),E("comments",e,"error","Impossible de supprimer le commentaire.")}}async function tt(e,t){const n=Number(e),r=(K.get(n)||Promise.resolve()).catch(()=>{}).then(async()=>{const i=y(n),s=x(i?.COMMENTAIRES),c=t(s),l=JSON.stringify(c),u=he();await a.updateRecords(a.formatRecord(n,{COMMENTAIRES:l,...u}));const m=await pn(n);return i&&(i.COMMENTAIRES=JSON.stringify(m)),m}).finally(()=>{K.get(n)===r&&K.delete(n)});return K.set(n,r),r}async function pn(e){const t=a.map?.COMMENTAIRES;if(!t||Array.isArray(t))throw new Error("La colonne Commentaires n’est pas correctement mappée.");const n=await je(e,t),o=x(n),r=y(e);return r&&(r.COMMENTAIRES=d(n)),o}function fe(e){const t=y(e),n=x(t?.COMMENTAIRES),o=document.getElementById(`comments-list-${Number(e)}`),r=o?.closest(".comments-section");o&&(o.innerHTML=et(n,e));const i=r?.querySelector(".detail-section-header p");i&&(i.textContent=`${n.length} commentaire(s)`)}async function Q(e,t,n,o){o?.stopPropagation();try{t==="STATUT"&&ge(n)?.useconfetti&&Cn();const r={[t]:n,...t==="DERNIERE_MISE_A_JOUR"||t==="MODIFIE_PAR"?{}:he()};await a.updateRecords(a.formatRecord(e,r));const i=y(e);i&&(i[t]=n,r.DERNIERE_MISE_A_JOUR&&(i.DERNIERE_MISE_A_JOUR=r.DERNIERE_MISE_A_JOUR),r.MODIFIE_PAR&&(i.MODIFIE_PAR=r.MODIFIE_PAR))}catch(r){throw console.error(v("Error during update:"),r),r}}function he(){const e={};return a.map?.DERNIERE_MISE_A_JOUR&&!a.col.DERNIERE_MISE_A_JOUR.getIsFormula()&&(e.DERNIERE_MISE_A_JOUR=new Date().toISOString()),a.map?.MODIFIE_PAR&&!a.col.MODIFIE_PAR.getIsFormula()&&(e.MODIFIE_PAR=k),e}async function nt(e){const t=he();if(Object.keys(t).length!==0)try{await a.updateRecords(a.formatRecord(e,t));const n=y(e);n&&Object.assign(n,t)}catch(n){console.warn("Données enregistrées, mais informations de suivi non modifiées :",n)}}async function fn(e){try{const t={DESCRIPTION:"",STATUT:e};a.map?.DERNIERE_MISE_A_JOUR&&!a.col.DERNIERE_MISE_A_JOUR.getIsFormula()&&(t.DERNIERE_MISE_A_JOUR=new Date().toISOString()),a.map?.CREE_LE&&!a.col.CREE_LE.getIsFormula()&&(t.CREE_LE=new Date().toISOString()),a.map?.COMMENTAIRES&&!a.col.COMMENTAIRES.getIsFormula()&&(t.COMMENTAIRES="[]");const n=await a.createRecords({fields:t});if(n?.id>0){grist.setCursorPos({rowId:n.id});const o=await a.fetchSelectedRecord(n.id);a.opt.hideedit||G(o)}}catch(t){console.error(v("Error on creation:"),t)}}async function hn(e,t){if(t?.stopPropagation(),!(a.opt.confirmdelete!==!1&&!confirm(v("Are you sure you want to delete this task?"))))try{await a.destroyRecords(e),U()}catch(n){console.error(v("Error on delete:"),n)}}function U(){const e=document.getElementById("popup-todo");!e||e.querySelector(".notes-field.is-editing.is-dirty")&&!window.confirm("Les modifications des notes ne sont pas enregistrées. Fermer quand même ?")||(X(e.dataset.currentTodo)?.classList.remove("active"),e.classList.remove("visible"),ot())}function gn(e,t){if(t?.stopPropagation(),!e)return;e.classList.toggle("collapsed");const n=e.querySelector(".titre-statut")?.childNodes?.[0]?.textContent?.trim()||e.id;localStorage.setItem(it(n),String(e.classList.contains("collapsed")))}function F(e){e&&(e.style.height="",e.style.height=`${Math.max(e.scrollHeight,42)}px`)}function ot(e=null){document.querySelectorAll(".multi-dropdown[open]").forEach(t=>{t!==e&&t.removeAttribute("open")})}document.addEventListener("keydown",e=>{if(e.key!=="Escape")return;if(document.getElementById("attachment-viewer")?.classList.contains("visible")){We(e);return}const n=document.querySelector(".multi-dropdown[open]");n?n.removeAttribute("open"):U()}),document.addEventListener("click",e=>{const t=e.target.closest(".multi-dropdown");a?.opt?.autoclosemenus!==!1&&ot(t);const n=document.getElementById("popup-todo");if(!n?.classList.contains("visible"))return;const o=n.contains(e.target),r=!!e.target.closest(".carte"),i=!!e.target.closest("#attachment-viewer");!o&&!r&&!i&&U()});function y(e){return M.find(t=>Number(t.id)===Number(e))||null}function X(e){return Array.from(document.querySelectorAll(".carte")).find(t=>Number(t.dataset.todoId)===Number(e))||null}function rt(e){return{addbutton:!1,isdone:!1,useconfetti:!1,hidecolumn:!1,...(Array.isArray(a.opt?.columns)?a.opt.columns:[])[e]||{}}}function ge(e){const n=(a.valuesList?.columns||[]).indexOf(e);return n>=0?rt(n):null}function it(e){return`column-todo-${d(e)}`}function st(e){const t=be(e?.RESPONSABLE_id);if(t.length>0)return t;const n=L(e?.RESPONSABLE).filter(r=>r!=="#KeyError"),o=[...C];return n.flatMap(r=>{const i=o.findIndex(c=>c.label===r);if(i<0)return[];const[s]=o.splice(i,1);return[s.id]})}function bn(e){const t=st(e);return t.length>0?t.map(n=>S.get(n)).filter(Boolean):L(e?.RESPONSABLE).filter(n=>n!=="#KeyError").map(n=>({id:0,label:n,initials:$e(n),avatarColor:Me(n)}))}function at(e){const t=be(e?.ETIQUETTES_id);if(t.length>0)return t;const n=L(e?.ETIQUETTES).filter(r=>r!=="#KeyError"),o=[...R];return n.flatMap(r=>{const i=o.findIndex(c=>c.label===r);if(i<0)return[];const[s]=o.splice(i,1);return[s.id]})}function En(e){const t=at(e);return t.length>0?t.map(n=>I.get(n)).filter(Boolean):L(e?.ETIQUETTES).filter(n=>n!=="#KeyError").map(n=>{const o=Re(n);return{id:0,label:n,color:o,textColor:De(o)}})}function be(e){return N(e)}function N(e){let t=_(e);return t[0]==="L"?t=t.slice(1):t[0]==="r"&&(t=_(t[2])),[...new Set(t.flatMap(n=>Array.isArray(n)?n:[n]).map(Number).filter(n=>Number.isInteger(n)&&n>0))]}function L(e){let t=_(e);return t[0]==="L"&&(t=t.slice(1)),[...new Set(t.flatMap(n=>Array.isArray(n)?n:[n]).map(d).map(n=>n.trim()).filter(Boolean))]}function _(e){return e==null||e===""?[]:Array.isArray(e)?e:[e]}function d(e){return e==null?"":String(e)}function ct(e){const t=d(e).trim().toLowerCase();return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)?t:""}function vn(e){const t=[],n=a.map?.CREE_LE&&e.CREE_LE?Ee(e.CREE_LE):"",o=a.map?.CREE_PAR?d(e.CREE_PAR).trim():"";if(n||o){const c=["Créé"];n&&c.push(`le ${n}`),o&&c.push(`par ${o}`),t.push(`<div>${f(c.join(" "))}</div>`)}const r=a.map?.DERNIERE_MISE_A_JOUR&&e.DERNIERE_MISE_A_JOUR?Ee(e.DERNIERE_MISE_A_JOUR):"",i=a.map?.MODIFIE_PAR?d(e.MODIFIE_PAR).trim():"",s=i===k?"Nom Grist non configuré":i;if(r||s){const c=["Modifié"];r&&c.push(`le ${r}`),s&&c.push(`par ${s}`),t.push(`<div>${f(c.join(" "))}</div>`)}return t.join("")}function E(e,t,n,o){const r=document.getElementById(`${e}-status-${Number(t)}`);r&&(r.className=`section-status${n?` ${n}`:""}`,r.textContent=o)}function yn(e){if(!e)return"";const t=new Date(e);if(Number.isNaN(t.getTime())||t>=P)return"";const n=String(t.getDate()).padStart(2,"0"),o=t.toLocaleDateString(a.cultureFull,{month:"short"});return`${n} ${o} ${t.getFullYear()}`}function Ee(e){if(!e)return"";const t=new Date(e);return Number.isNaN(t.getTime())?"":t.toLocaleString(a.cultureFull,{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}function wn(e){if(!e)return"";const t=new Date(e);return Number.isNaN(t.getTime())||t>=P?"":t.toISOString().split("T")[0]}function lt(e){if(!e)return"";const t=new Date(e);return Number.isNaN(t.getTime())?d(e):t.toISOString()}function ve(e){if(!e)return null;const t=new Date(e).getTime();return Number.isNaN(t)?null:t}function Y(e,t){return ve(e)??t}function Sn(e){const t=Number(e)||0;if(t<=0)return"";const n=["o","Ko","Mo","Go"],o=Math.min(Math.floor(Math.log(t)/Math.log(1024)),n.length-1);return`${(t/1024**o).toFixed(o===0?0:1)} ${n[o]}`}function ut(e){const t=d(e).match(/(\.[^.]+)$/);return t?t[1]:""}function Nn(){return globalThis.crypto?.randomUUID?crypto.randomUUID():`comment-${Date.now()}-${Math.random().toString(16).slice(2)}`}function f(e){return d(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function p(e){return f(e).replace(/`/g,"&#096;")}function Tn(e){return d(e).replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/\r/g,"\\r").replace(/\n/g,"\\n")}function An(e){return encodeURIComponent(d(e)).replace(/'/g,"%27")}function Cn(){if(typeof confetti!="function")return;const e=2e3,t=Date.now()+e,n={startVelocity:30,spread:360,ticks:60,zIndex:1500},o=(i,s)=>Math.random()*(s-i)+i,r=window.setInterval(()=>{const i=t-Date.now();if(i<=0){window.clearInterval(r);return}const s=50*(i/e);confetti({...n,particleCount:s,origin:{x:o(.1,.3),y:Math.random()-.2}}),confetti({...n,particleCount:s,origin:{x:o(.7,.9),y:Math.random()-.2}})},250)}window.toggleColonne=gn,window.togglePopupTodo=G,window.fermerPopup=U,window.mettreAJourChamp=Q,window.creerNouvelleTache=fn,window.supprimerTodo=hn,window.mettreAJourChampResponsables=Ue,window.filtrerOptionsMultiples=Ft,window.viderResponsables=Jt,window.mettreAJourEtiquettes=Je,window.viderEtiquettes=Ht,window.ajouterPiecesJointes=Gt,window.retirerPieceJointe=Qt,window.ouvrirPieceJointe=Xt,window.fermerLecteurPieceJointe=We,window.ajouterCommentaire=un,window.supprimerCommentaire=mn,window.ajusterTextarea=F,window.previsualiserCouleur=qt,window.mettreAJourCouleur=qe,window.reinitialiserCouleur=xt,window.activerEditionNotes=At,window.annulerEditionNotes=Ct,window.enregistrerEtFermerNotes=It,window.appliquerFormatBlocNotes=Mt,window.appliquerCommandeNotes=Rt,window.appliquerBaliseSelectionNotes=Dt,window.creerLienNotes=Oe,window.nettoyerCollageNotes=Lt,window.marquerNotesModifiees=T,window.mettreAJourEtatBarreNotes=D,window.gererRaccourcisNotes=_t,window.ouvrirMenuMentions=nn,window.fermerMenuMentions=on,window.gererSaisieMention=rn,window.gererTouchesMention=sn,window.selectionnerMentionCommentaire=an,window.retirerMentionCommentaire=cn}));
