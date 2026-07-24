(function(c){typeof define=="function"&&define.amd?define(c):c()})((function(){"use strict";let c,y;const q=new Date("3000-01-01"),ie="#DCDCDC",Re="#000000",Dt=120*1e3,Lt=50*1024*1024,P="__GRIST_USER_NAME__";let I=[],N=[],S=new Map,oe=null,L=[],k=new Map,se=null,ae=new Map,K=!1,W=null,De=0;const z=new Map,V=new Map,G=new Map,Q=new Map,X=new Map;let Le=null,ce=!1;window.addEventListener("load",async()=>{c=new WidgetSDK,y=await c.loadTranslations(["widget.js"]),c.configureOptions([WidgetSDK.newItem("columns",null,"Colonnes du Kanban","Réglez le comportement de chaque statut.","1 — Colonnes",{columnId:"STATUT",template:[WidgetSDK.newItem("addbutton",!0,"Autoriser l’ajout","Afficher un bouton pour créer une carte dans cette colonne."),WidgetSDK.newItem("isdone",!1,"Colonne terminée","Considérer les cartes de cette colonne comme terminées."),WidgetSDK.newItem("useconfetti",!1,"Confettis","Afficher des confettis lorsqu’une carte arrive dans cette colonne."),WidgetSDK.newItem("hidecolumn",!1,"Masquer la colonne","Ne pas afficher cette colonne dans le Kanban.")]}),WidgetSDK.newItem("rotation",!0,"Inclinaison des cartes","Donner un léger effet post-it aux cartes.","2 — Affichage des cartes"),WidgetSDK.newItem("compact",!1,"Mode compact","Réduire les espacements et la hauteur des cartes.","2 — Affichage des cartes"),WidgetSDK.newItem("showlabels",!0,"Afficher les étiquettes","Afficher les étiquettes colorées sur les cartes.","2 — Affichage des cartes"),WidgetSDK.newItem("showmembers",!0,"Afficher les membres","Afficher les bulles d’initiales des membres sur les cartes.","2 — Affichage des cartes"),WidgetSDK.newItem("showresponsables",!0,"Afficher les responsables","Afficher les responsables avec une bordure renforcée sur les cartes.","2 — Affichage des cartes"),WidgetSDK.newItem("showdeadline",!0,"Afficher l’échéance","Afficher la date limite sur les cartes.","2 — Affichage des cartes"),WidgetSDK.newItem("showindicators",!0,"Afficher les indicateurs","Afficher le nombre de pièces jointes et de commentaires.","2 — Affichage des cartes"),WidgetSDK.newItem("showchecklistprogress",!0,"Afficher la progression checklist","Afficher le nombre d’éléments cochés sur les cartes.","2 — Affichage des cartes"),WidgetSDK.newItem("defaultcardcolor","#FFFFD1","Couleur par défaut","Couleur utilisée lorsqu’aucune couleur personnalisée n’est enregistrée.","2 — Affichage des cartes"),WidgetSDK.newItem("showchecklist",!0,"Checklist","Afficher la checklist avancée dans la fiche.","3 — Fiche descriptive"),WidgetSDK.newItem("showattachments",!0,"Pièces jointes","Afficher la section des pièces jointes dans la fiche.","3 — Fiche descriptive"),WidgetSDK.newItem("showcomments",!0,"Commentaires","Afficher la section des commentaires dans la fiche.","3 — Fiche descriptive"),WidgetSDK.newItem("enablementions",!0,"Mentions @ visuelles","Permettre de mentionner les membres dans les commentaires. Cette version ne déclenche aucun e-mail automatique.","3 — Fiche descriptive"),WidgetSDK.newItem("showmetadata",!0,"Informations de suivi","Afficher les lignes « Créé le » et « Modifié le » en bas de la fiche.","3 — Fiche descriptive"),WidgetSDK.newItem("autoclosemenus",!0,"Fermer les menus automatiquement","Fermer les sélecteurs multiples lorsqu’on clique ailleurs.","3 — Fiche descriptive"),WidgetSDK.newItem("readonly",!1,"Lecture seule","Désactiver toutes les modifications depuis le widget.","4 — Comportement"),WidgetSDK.newItem("hideedit",!1,"Masquer la fiche","Ne pas ouvrir la fiche descriptive lors d’un clic sur une carte.","4 — Comportement"),WidgetSDK.newItem("gristeditcard",!1,"Double-clic vers la fiche Grist","Ouvrir la fiche native de Grist lors d’un double-clic.","4 — Comportement"),WidgetSDK.newItem("confirmdelete",!0,"Confirmer les suppressions","Demander une confirmation avant de supprimer une tâche.","4 — Comportement")],"#config-view","#main-view",{onOptChange:fe,onOptLoad:fe}),c.initMetaData(),c.ready({requiredAccess:"full",allowSelectBy:!0,columns:[{name:"STATUT",title:"Statut",description:"Colonne du Kanban",type:"Choice",strictType:!0},{name:"DESCRIPTION",title:"Nom de la tâche",description:"Nom principal de la tâche",type:"Any"},{name:"DESCRIPTION_DISPLAY",title:"Affichage de la tâche",description:"Contenu personnalisé facultatif affiché sur la carte",type:"Any",optional:!0},{name:"NOTES",title:"Notes",description:"Notes enrichies enregistrées en HTML sécurisé",type:"Text",strictType:!0,optional:!0},{name:"DEADLINE",title:"Échéance",description:"Date limite de la carte",type:"Date",optional:!0},{name:"ORDRE",title:"Ordre manuel",description:"Nombre utilisé pour conserver exactement la position des cartes",type:"Numeric",strictType:!0,optional:!0},{name:"MEMBRES",title:"Membres",description:"Toutes les personnes qui participent à la carte",type:"RefList",strictType:!0,optional:!0},{name:"RESPONSABLE",title:"Responsables",description:"Responsables principaux de la carte",type:"RefList",strictType:!0,optional:!0},{name:"ETIQUETTES",title:"Étiquettes",description:"Étiquettes multiples référencées depuis une table dédiée",type:"RefList",strictType:!0,optional:!0},{name:"CHECKLIST",title:"Checklist",description:"Checklist avancée stockée en JSON",type:"Text",strictType:!0,optional:!0},{name:"PIECES_JOINTES",title:"Pièces jointes",description:"Fichiers et images associés à la tâche",type:"Attachments",strictType:!0,optional:!0},{name:"COMMENTAIRES",title:"Commentaires",description:"Commentaires du widget stockés en JSON",type:"Text",strictType:!0,optional:!0},{name:"COULEUR",title:"Couleur de carte",description:"Code hexadécimal choisi depuis le widget",type:"Text",strictType:!0,optional:!0},{name:"CREE_PAR",title:"Créé par",type:"Any",optional:!0},{name:"CREE_LE",title:"Date de création",type:"DateTime",optional:!0},{name:"DERNIERE_MISE_A_JOUR",title:"Dernière mise à jour",description:"Date technique affichée dans le suivi",type:"DateTime",optional:!0},{name:"MODIFIE_PAR",title:"Modifié par",description:"Nom de la dernière personne ayant modifié la tâche",type:"Text",strictType:!0,optional:!0}]}),c.onRecords(Y,{expandRefs:!1,keepEncoded:!1,mapRef:!0}),c.isLoaded().then(()=>{c.initDone=!0}),grist.on("message",async e=>{e.mappingsChange&&await xt()}),Dn(),Pt()});async function Oe(e=!1){const t=c?.map?.MEMBRES?"MEMBRES":c?.map?.RESPONSABLE?"RESPONSABLE":null;if(!t||!c?.col?.[t]){le();return}const n=c.col[t],r=`${t}:${n.type}:${n.visibleCol}`;if(!(!e&&oe===r&&N.length>0))try{const i=await Pe(n),o=i.dataColumns,s=de(o,["initiales","initiale","initials","abreviation","abréviation","sigle"])||_e(o,i.visibleColumnId),a=de(o,["email","e-mail","mail","courriel","adresseemail","adresse_email","adressemail","adresse_mail"]),u=s&&Array.isArray(i.table[s])?i.table[s]:[],m=a&&Array.isArray(i.table[a])?i.table[a]:[];N=i.ids.map((d,b)=>{const g=l(i.labels[b]).trim(),h=Ot(u[b])||Fe(g),ke=Nt(m[b]);return{id:Number(d),label:g,initials:h,email:ke,avatarColor:Ue(g||d)}}).filter(d=>Number.isInteger(d.id)&&d.id>0&&d.label&&d.label!=="#KeyError").sort((d,b)=>d.label.localeCompare(b.label,c.cultureFull,{sensitivity:"base"})),S=new Map(N.map(d=>[d.id,d])),oe=r}catch(i){le(),console.error("Impossible de charger la table des membres :",i)}}function le(){N=[],S=new Map,oe=null}async function qe(e=!1){if(!c?.map?.ETIQUETTES||!c?.col?.ETIQUETTES){ue();return}const t=c.col.ETIQUETTES,n=`${t.type}:${t.visibleCol}`;if(!(!e&&se===n&&L.length>0))try{const r=await Pe(t),i=r.dataColumns,o=de(i,["couleur","color","hex","codecouleur","code_couleur"])||_e(i,r.visibleColumnId),s=o&&Array.isArray(r.table[o])?r.table[o]:[];L=r.ids.map((a,u)=>{const m=l(r.labels[u]).trim(),b=A(s[u])||Je(m||a);return{id:Number(a),label:m,color:b,textColor:Be(b)}}).filter(a=>Number.isInteger(a.id)&&a.id>0&&a.label&&a.label!=="#KeyError").sort((a,u)=>a.label.localeCompare(u.label,c.cultureFull,{sensitivity:"base"})),k=new Map(L.map(a=>[a.id,a])),se=n}catch(r){ue(),console.error("Impossible de charger la table des étiquettes :",r)}}function ue(){L=[],k=new Map,se=null}async function Pe(e){const[t,n]=l(e?.type).split(":");if(t!=="RefList"||!n||!e?.visibleCol)throw new Error("La colonne doit être une Liste de références avec une colonne visible configurée.");const[r,i]=await Promise.all([grist.docApi.fetchTable(n),e.getMeta(e.visibleCol)]),o=i?.colId;if(!o||!Array.isArray(r?.id)||!Array.isArray(r?.[o]))throw new Error(`La colonne visible de la table ${n} est introuvable.`);const s=Object.keys(r).filter(a=>Array.isArray(r[a])&&a!=="id"&&a!=="manualSort"&&!a.startsWith("gristHelper_"));return{tableId:n,table:r,ids:r.id,labels:r[o],visibleColumnId:o,dataColumns:s}}function de(e,t){const n=new Set(t.map(xe));return e.find(r=>n.has(xe(r)))||null}function _e(e,t){const n=e.indexOf(t);return n>=0&&e[n+1]||null}function xe(e){return l(e).normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]/gi,"").toLowerCase()}function Ot(e){return l(e).trim().replace(/\s+/g,"").slice(0,4).toUpperCase()}function Fe(e){const t=l(e).trim().split(/\s+/).filter(Boolean);return t.length===0?"?":t.length===1?t[0].slice(0,2).toUpperCase():`${t[0][0]||""}${t[t.length-1][0]||""}`.toUpperCase()}function Ue(e){let t=0;for(const r of l(e))t=(t<<5)-t+r.charCodeAt(0),t|=0;return`hsl(${Math.abs(t)%360} 58% 42%)`}function Je(e){let t=0;for(const r of l(e))t=(t<<5)-t+r.charCodeAt(0),t|=0;const n=Math.abs(t)%360;return qt(n,62,72)}function qt(e,t,n){t/=100,n/=100;const r=(1-Math.abs(2*n-1))*t,i=r*(1-Math.abs(e/60%2-1)),o=n-r/2;let s=0,a=0,u=0;return e<60?[s,a,u]=[r,i,0]:e<120?[s,a,u]=[i,r,0]:e<180?[s,a,u]=[0,r,i]:e<240?[s,a,u]=[0,i,r]:e<300?[s,a,u]=[i,0,r]:[s,a,u]=[r,0,i],`#${[s,a,u].map(m=>Math.round((m+o)*255).toString(16).padStart(2,"0")).join("")}`.toUpperCase()}function Be(e){const t=A(e)||"#DDE3EA",n=parseInt(t.slice(1,3),16),r=parseInt(t.slice(3,5),16),i=parseInt(t.slice(5,7),16);return(.2126*n+.7152*r+.0722*i)/255>.58?"#1F2937":"#FFFFFF"}async function me(e=!1){if(!(K&&!e)){ae=new Map,K=!0;try{const t=await grist.docApi.fetchTable("_grist_Attachments");(Array.isArray(t?.id)?t.id:[]).forEach((r,i)=>{const o=Number(r);if(!Number.isInteger(o)||o<=0)return;const s=l(t.fileName?.[i])||`Pièce jointe ${o}`,a=l(t.fileExt?.[i])||Tt(s),u=l(t.fileType?.[i]),m=Number(t.fileSize?.[i])||0;ae.set(o,{id:o,fileName:s,fileExt:a,fileType:u,fileSize:m,imageWidth:Number(t.imageWidth?.[i])||0,imageHeight:Number(t.imageHeight?.[i])||0})})}catch(t){console.warn("Métadonnées des pièces jointes indisponibles :",t)}}}async function Y(e){I=Array.isArray(e)?e:[],await Promise.all([Oe(),qe()]);const t=document.getElementById("conteneur-kanban");if(!t)return;t.innerHTML="";const n=await c.col.STATUT.getChoices();if(!Array.isArray(n)||n.length===0){t.innerHTML=`<div class="kanban-message">${f(y("No choice available in the Status column"))}</div>`;return}n.forEach((r,i)=>{const o=Ft(r,i);o&&t.appendChild(o)}),I.forEach(r=>{const i=l(r.STATUT),o=Array.from(t.querySelectorAll(".contenu-colonne")).find(s=>s.dataset.statut===i);o&&o.insertBefore(Ut(r),o.firstChild)}),jt(),document.querySelectorAll(".colonne-kanban").forEach(he)}function Pt(){const e=document.getElementById("config-view");!e||e.dataset.autosaveInstalled==="true"||(e.dataset.autosaveInstalled="true",e.addEventListener("input",t=>{t.target.matches("input, textarea, select")&&pe()}),e.addEventListener("change",t=>{t.target.matches("input, textarea, select")&&pe()}),e.addEventListener("click",t=>{t.target.closest(".config-switch")&&window.setTimeout(pe,0)}))}function pe(){window.clearTimeout(Le),Z("saving","Sauvegarde…"),Le=window.setTimeout(_t,350)}async function _t(){if(!(ce||!c?._parameters||!c?._config||c._config.style.display==="none")){ce=!0;try{c.opt=await c.readOptionValues(c._parameters,c._config,c.opt),await grist.widgetApi.setOption("options",JSON.parse(JSON.stringify(c.opt))),await fe(),Z("saved","Enregistré"),window.setTimeout(()=>{Z("","")},1400)}catch(e){console.error("Impossible de sauvegarder automatiquement la configuration :",e),Z("error","Échec de la sauvegarde")}finally{ce=!1}}}function Z(e,t){const n=document.getElementById("config-view");if(!n||n.style.display==="none")return;let r=n.querySelector(".config-autosave-status");!r&&t&&(r=document.createElement("div"),r.className="config-autosave-status",r.setAttribute("aria-live","polite"),n.appendChild(r)),r&&(r.className=`config-autosave-status${e?` ${e}`:""}`,r.textContent=t,r.hidden=!t)}async function fe(){await c.isMapped(),await Y(I)}async function xt(){le(),ue(),K=!1,W=null,await Promise.all([Oe(!0),qe(!0)]),await Y(I)}function Ft(e,t){const n=wt(t);if(n.hidecolumn)return null;const r=l(e),i=document.createElement("section");i.className=`colonne-kanban${!n.addbutton&&!c.opt.compact?" colonne-nobouton":""}`,i.id=r,localStorage.getItem(St(r))==="true"&&i.classList.add("collapsed");const o=c.col.STATUT.getColor(r)??ie,s=c.col.STATUT.getTextColor(r)??Re,a=or(r);return i.innerHTML=`
        <div class="entete-colonne" style="background-color:${o};color:${s}">
            <div class="titre-statut">${f(r)} <span class="compteur-colonne">(0)</span></div>
            <div class="actions-colonne">
                ${n.addbutton&&!c.opt.readonly?`<button type="button" class="bouton-ajouter-entete ${c.opt.compact?"compact":""}" onclick="creerNouvelleTache(decodeURIComponent('${a}'))" aria-label="${p(y("Add a new task"))}">+</button>`:""}
                <button type="button" class="bouton-toggle" onclick="toggleColonne(this.closest('.colonne-kanban'), event)" aria-label="Replier ou déplier">⇄</button>
            </div>
        </div>
        ${n.addbutton&&!c.opt.readonly?`<button type="button" class="bouton-ajouter ${c.opt.compact?"compact":""}" onclick="creerNouvelleTache(decodeURIComponent('${a}'))">+ ${f(y("Add a new task"))}</button>`:""}
        <div class="contenu-colonne" data-statut="${p(r)}" data-isdone="${n.isdone?"true":"false"}"></div>
    `,i}function Ut(e){const t=document.createElement("article");t.className=`carte${c.opt.rotation?"":" norotate"}${c.opt.compact?" compact":""}`,t.dataset.todoId=String(e.id),t.dataset.lastUpdate=$t(e.DERNIERE_MISE_A_JOUR),t.dataset.deadline=$t(e.DEADLINE),t.dataset.order=zt(e.ORDRE),Bt(t,e.COULEUR);const n=e.DEADLINE?nr(e.DEADLINE):"",r=Xn(e),i=Zn(e),o=er(e),s=te(e.CHECKLIST),a=s.filter(D=>D.done).length,u=C(e.PIECES_JOINTES).length,m=F(e.COMMENTAIRES).length,d=e.DESCRIPTION_DISPLAY?String(e.DESCRIPTION_DISPLAY):f(l(e.DESCRIPTION)||y("No description")),b=o.map(D=>Jt(D)).join(""),g=r.map(D=>je(D,"member")).join(""),h=i.map(D=>je(D,"responsable")).join(""),ke=Ce(e.STATUT),Me=Te(e.DEADLINE),ar=Me!==null&&Me<Date.now()&&Me<q.getTime(),cr=c.opt.showlabels!==!1,It=c.opt.showmembers!==!1,kt=c.opt.showresponsables!==!1,lr=c.opt.showdeadline!==!1,Mt=c.opt.showindicators!==!1,ur=c.opt.showchecklistprogress!==!1,dr=`
        ${kt&&i.length?`<div class="card-people-group card-responsables" aria-label="Responsables">${h}</div>`:""}
        ${It&&r.length?`<div class="card-people-group card-membres" aria-label="Membres">${g}</div>`:""}
    `,Rt=`
        ${ur&&s.length?`<span title="${a} élément(s) terminé(s) sur ${s.length}">☑ ${a}/${s.length}</span>`:""}
        ${Mt&&u?`<span title="${u} pièce(s) jointe(s)">📎 ${u}</span>`:""}
        ${Mt&&m?`<span title="${m} commentaire(s)">💬 ${m}</span>`:""}
    `;return t.innerHTML=`
        ${cr&&b?`<div class="etiquettes-list">${b}</div>`:""}
        <div class="description">${d}</div>
        ${lr&&n?`<div class="deadline${ar?" late":""} truncate">📅 ${f(n)}</div>`:""}
        ${It&&r.length||kt&&i.length||Rt.trim()?`<div class="card-footer">
                <div class="card-indicators">${Rt}</div>
                <div class="card-people">${dr}</div>
               </div>`:""}
        ${ke?.isdone?`<div class="tampon-termine" style="color:${c.col.STATUT.getColor(e.STATUT)??ie};">${f(l(e.STATUT))}</div>`:""}
    `,t.addEventListener("click",()=>{grist.setCursorPos({rowId:e.id}),c.opt.hideedit||ee(e)}),t.addEventListener("dblclick",()=>{grist.setCursorPos({rowId:e.id}),c.opt.gristeditcard?grist.commandApi.run("viewAsCard"):c.opt.hideedit||ee(e)}),t}function je(e,t="member"){const n=t==="responsable"?"Responsable":"Membre";return`
        <span
            class="responsable-avatar ${t==="responsable"?"responsable-avatar-principal":"membre-avatar"}"
            style="background:${p(e.avatarColor)}"
            title="${p(`${n} : ${e.label}`)}"
            aria-label="${p(`${n} : ${e.label}`)}"
        >${f(e.initials)}</span>
    `}function Jt(e){return`
        <span
            class="etiquette-badge"
            style="background:${p(e.color)};color:${p(e.textColor)}"
            title="${p(e.label)}"
        >${f(e.label)}</span>
    `}function Bt(e,t){const n=A(t)||A(c.opt?.defaultcardcolor)||"#FFFFD1";e.style.backgroundColor=n}function jt(){document.querySelectorAll(".contenu-colonne").forEach(e=>{Wt(e),!(c.opt.readonly||typeof Sortable!="function")&&new Sortable(e,{group:"kanban-todo",animation:150,ghostClass:"carte-fantome",chosenClass:"carte-selectionnee",onEnd:async t=>{const n=t.to.dataset.statut,r=t.from.dataset.statut,i=Number(t.item.dataset.todoId),o=Array.from(t.to.querySelectorAll(".carte")).map(a=>Number(a.dataset.todoId)),s=t.from===t.to?[]:Array.from(t.from.querySelectorAll(".carte")).map(a=>Number(a.dataset.todoId));try{n!==r&&await U(i,"STATUT",n),c.map?.ORDRE&&!c.col.ORDRE.getIsFormula()?await Ht(o,s):(await He(t.to),t.from!==t.to&&await He(t.from))}catch(a){console.error(y("Error during status update:"),a),await Y(I)}he(t.to.closest(".colonne-kanban")),t.from!==t.to&&he(t.from.closest(".colonne-kanban"))}})})}async function Ht(e,t=[]){const n=[],r=new Set;[e,t].forEach(i=>{const o=R(i).map(Number).filter(a=>Number.isInteger(a)&&a>0),s=o.join(",");o.length>0&&!r.has(s)&&(r.add(s),n.push(o))});for(const i of n)await Kt(i)}async function Kt(e){if(!c.map?.ORDRE||c.col.ORDRE.getIsFormula())return;const t=e.map((n,r)=>{const i=(r+1)*1e3,o=E(n),s=j(n);return o&&(o.ORDRE=i),s&&(s.dataset.order=String(i)),c.formatRecord(n,{ORDRE:i})});t.length>0&&await c.updateRecords(t)}async function He(e){if(!c.map?.DEADLINE||!e)return;const n=Array.from(e.querySelectorAll(".carte")).filter(o=>{const s=Te(o.dataset.deadline);return s===null||s>=q.getTime()});if(n.length===0)return;let r=q.getFullYear();const i=n.map(o=>{const s=`${r}-01-01`;return r+=1,o.dataset.deadline=s,c.formatRecord(o.dataset.todoId,{DEADLINE:s})});await c.updateRecords(i)}function Wt(e){if(!e)return;const t=e.dataset.isdone==="true",n=Array.from(e.children);n.sort((r,i)=>{let o=0;return c.map?.ORDRE?o=Ke(r.dataset.order)-Ke(i.dataset.order):c.map?.DEADLINE&&(t?o=re(i.dataset.lastUpdate,0)-re(r.dataset.lastUpdate,0):o=re(r.dataset.deadline,Number.MAX_SAFE_INTEGER)-re(i.dataset.deadline,Number.MAX_SAFE_INTEGER)),o!==0?o:(Number(r.dataset.todoId)||0)-(Number(i.dataset.todoId)||0)}),n.forEach(r=>e.appendChild(r))}function zt(e){const t=Number(e);return Number.isFinite(t)?String(t):""}function Ke(e){const t=Number(e);return Number.isFinite(t)?t:Number.MAX_SAFE_INTEGER}function he(e){if(!e)return;const t=e.querySelector(".contenu-colonne"),n=e.querySelector(".compteur-colonne");t&&n&&(n.textContent=`(${t.children.length})`)}async function ee(e){const t=document.getElementById("popup-todo");if(!t)return;if(c.opt.readonly){J();return}document.querySelector(".carte.active")?.classList.remove("active"),j(e.id)?.classList.add("active");const n=Ce(e.STATUT),r=c.col.STATUT.getColor(e.STATUT)??ie,i=c.col.STATUT.getTextColor(e.STATUT)??Re;t.style.borderLeftColor=r,t.dataset.statut=l(e.STATUT),t.dataset.isdone=n?.isdone?"true":"false",t.dataset.currentTodo=String(e.id);const o=t.querySelector(".popup-title"),s=t.querySelector(".popup-content"),a=t.querySelector(".popup-header"),u=t.querySelector(".bouton-fermer");if(o&&(o.textContent=l(e.DESCRIPTION)||y("New task")),a&&(a.style.backgroundColor=r,a.style.color=i),u&&(u.style.color=i),!s)return;const m=[],d=c.col.DESCRIPTION.getIsFormula(),b=c.map?.NOTES?c.col.NOTES.getIsFormula():!1;m.push(`
        <div class="field field-wide">
            <label class="field-label">Nom de la tâche</label>
            <textarea
                class="field-textarea auto-expand task-title-input"
                onchange="mettreAJourChamp(${Number(e.id)}, 'DESCRIPTION', this.value, event)"
                oninput="ajusterTextarea(this)"
                ${d?"disabled":""}
            >${f(l(e.DESCRIPTION))}</textarea>
        </div>
    `),c.map?.NOTES&&m.push(Vt(e,b)),c.map?.ETIQUETTES&&m.push(pn(e)),c.map?.MEMBRES&&m.push(Xe(e.id,Qn(e),"MEMBRES","Membres","membre","membres",c.col.MEMBRES.getIsFormula())),c.map?.RESPONSABLE&&m.push(Xe(e.id,Yn(e),"RESPONSABLE","Responsables","responsable","responsables",c.col.RESPONSABLE.getIsFormula())),c.map?.DEADLINE&&m.push(`
            <div class="field">
                <label class="field-label">Échéance</label>
                <input
                    type="date"
                    class="field-input"
                    value="${p(rr(e.DEADLINE))}"
                    onchange="mettreAJourChamp(${Number(e.id)}, 'DEADLINE', this.value || null, event)"
                    ${c.col.DEADLINE.getIsFormula()?"disabled":""}
                >
            </div>
        `),c.map?.COULEUR&&m.push(an(e));let g=`<div class="form-grid">${m.join("")}</div>`;c.map?.CHECKLIST&&c.opt.showchecklist!==!1&&(g+=rt(e)),c.map?.PIECES_JOINTES&&c.opt.showattachments!==!1&&(g+=In(e)),c.map?.COMMENTAIRES&&c.opt.showcomments!==!1&&(g+=On(e));const h=c.opt.showmetadata!==!1?tr(e):"";h&&(g+=`<div class="info-creation">${h}</div>`),g+=`
        <div class="popup-actions">
            <button
                type="button"
                class="popup-action-button bouton-supprimer"
                onclick="supprimerTodo(${Number(e.id)}, event)"
                title="${p(y("Remove the task"))}"
                aria-label="${p(y("Remove the task"))}"
            >🗑️</button>
        </div>
    `,s.innerHTML=g,s.querySelectorAll(".auto-expand").forEach(B),s.querySelectorAll(".etiquettes-dropdown").forEach(be),t.classList.add("visible"),c.map?.CHECKLIST&&c.opt.showchecklist!==!1&&ot(s),c.map?.PIECES_JOINTES&&c.opt.showattachments!==!1&&await ve(e.id)}function Vt(e,t){const n=Number(e.id),r=Yt(e.NOTES),i=Ge(r).trim().length>0,o=t?"disabled":"",s=[["bold","<strong>B</strong>","Gras"],["italic","<em>I</em>","Italique"],["underline","<u>U</u>","Souligné"],["strikeThrough","<s>S</s>","Barré"],["insertUnorderedList","• Liste","Liste à puces"],["insertOrderedList","1. Liste","Liste numérotée"],["insertHorizontalRule","―","Ligne de séparation"],["removeFormat","Tx","Effacer la mise en forme"],["undo","↶","Annuler"],["redo","↷","Rétablir"]].map(([a,u,m])=>`
        <button
            type="button"
            class="notes-tool"
            data-command="${a}"
            onmousedown="event.preventDefault()"
            onclick="appliquerCommandeNotes(this, '${a}', null, event)"
            title="${p(m)}"
            aria-label="${p(m)}"
            ${o}
        >${u}</button>
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
                    ${o}
                >✏️ Modifier</button>
            </div>

            <div
                class="notes-display${i?"":" empty"}"
                tabindex="0"
            >${i?r:"Aucune note pour cette tâche."}</div>

            <div class="notes-edit-panel" hidden>
                <div class="notes-toolbar" role="toolbar" aria-label="Mise en forme des notes">
                    <label class="sr-only" for="notes-format-${n}">Style du paragraphe</label>
                    <select
                        id="notes-format-${n}"
                        class="notes-format-select"
                        onchange="appliquerFormatBlocNotes(this, event)"
                        title="Style du paragraphe"
                        ${o}
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
                        ${o}
                    >&lt;/&gt;</button>

                    <button
                        type="button"
                        class="notes-tool"
                        onmousedown="event.preventDefault()"
                        onclick="appliquerBaliseSelectionNotes(this, 'mark', event)"
                        title="Surligner"
                        aria-label="Surligner"
                        ${o}
                    >🖍</button>

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
                        data-command="unlink"
                        onmousedown="event.preventDefault()"
                        onclick="appliquerCommandeNotes(this, 'unlink', null, event)"
                        title="Retirer le lien"
                        aria-label="Retirer le lien"
                        ${o}
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
                >${r}</div>

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
    `}function Gt(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".notes-field"),r=n?.querySelector(".notes-edit-panel"),i=n?.querySelector(".notes-display"),o=n?.querySelector(".notes-editor");!n||!r||!i||!o||n.dataset.disabled==="true"||(n._originalNotesHtml=_(o.innerHTML),n.classList.add("is-editing"),n.classList.remove("is-dirty"),i.hidden=!0,r.hidden=!1,e.hidden=!0,document.execCommand("defaultParagraphSeparator",!1,"p"),o.focus(),on(o),O(o),M(Number(n.dataset.rowId),"",""))}function Qt(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".notes-field"),r=n?.querySelector(".notes-editor");!n||!r||(r.innerHTML=n._originalNotesHtml||"",We(n,!1))}async function Xt(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".notes-field"),r=n?.querySelector(".notes-editor"),i=Number(n?.dataset?.rowId);if(!(!n||!r||!Number.isInteger(i)||i<=0)){e.disabled=!0;try{const o=await sn(i,r);n._originalNotesHtml=o,We(n,!0)}finally{e.disabled=!1}}}function We(e,t){const n=e.querySelector(".notes-edit-panel"),r=e.querySelector(".notes-display"),i=e.querySelector(".notes-editor"),o=e.querySelector(".notes-edit-button");if(t&&r&&i){const s=_(i.innerHTML).trim(),a=Ge(s).trim().length>0;r.innerHTML=a?s:"Aucune note pour cette tâche.",r.classList.toggle("empty",!a)}e.classList.remove("is-editing","is-dirty"),n&&(n.hidden=!0),r&&(r.hidden=!1),o&&(o.hidden=!1),M(Number(e.dataset.rowId),"","")}function Yt(e){const t=l(e).trim();if(!t)return"";const r=/<\/?[a-z][\s\S]*>/i.test(t)?t:f(t).replace(/\r?\n/g,"<br>");return _(r)}function _(e){const t=document.createElement("template");t.innerHTML=l(e);const n=new Set(["B","STRONG","I","EM","U","S","STRIKE","A","UL","OL","LI","P","DIV","BR","BLOCKQUOTE","H2","H3","SPAN","CODE","PRE","HR","MARK"]),r=new Set(["SCRIPT","STYLE","IFRAME","OBJECT","EMBED","FORM","INPUT","BUTTON","SVG","MATH","META","LINK"]),i=o=>{Array.from(o.childNodes).forEach(s=>{if(s.nodeType===Node.ELEMENT_NODE){if(r.has(s.tagName)){s.remove();return}if(!n.has(s.tagName)){i(s),s.replaceWith(...Array.from(s.childNodes));return}if(Array.from(s.attributes).forEach(a=>{s.tagName==="A"&&["href","target","rel"].includes(a.name.toLowerCase())||s.removeAttribute(a.name)}),s.tagName==="A"){const a=Ve(s.getAttribute("href"));if(!a){s.replaceWith(...Array.from(s.childNodes));return}s.setAttribute("href",a),s.setAttribute("target","_blank"),s.setAttribute("rel","noopener noreferrer")}i(s)}else s.nodeType!==Node.TEXT_NODE&&s.remove()})};return i(t.content),t.innerHTML}function Zt(e,t){t?.preventDefault(),t?.stopPropagation();const r=e.closest(".notes-field")?.querySelector(".notes-editor");!r||r.contentEditable!=="true"||(r.focus(),document.execCommand("formatBlock",!1,e.value||"p"),$(r),O(r))}function en(e,t,n,r){r?.preventDefault(),r?.stopPropagation();const o=e.closest(".notes-field")?.querySelector(".notes-editor");!o||o.contentEditable!=="true"||(o.focus(),document.execCommand(t,!1,n),$(o),O(o))}function tn(e,t,n){n?.preventDefault(),n?.stopPropagation();const i=e.closest(".notes-field")?.querySelector(".notes-editor"),o=window.getSelection();if(!i||i.contentEditable!=="true"||!o||o.rangeCount===0)return;i.focus();const s=o.getRangeAt(0);if(!i.contains(s.commonAncestorContainer))return;const a=s.toString(),u=t==="mark"?"mark":"code";a?document.execCommand("insertHTML",!1,`<${u}>${f(a)}</${u}>`):document.execCommand("insertHTML",!1,`<${u}>&#8203;</${u}>`),$(i),O(i)}function ze(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".notes-field"),r=n?.querySelector(".notes-editor");if(!r||r.contentEditable!=="true")return;r.focus();const i=window.prompt("Adresse du lien :","https://");if(i===null)return;const o=Ve(i);if(!o){M(Number(n.dataset.rowId),"error","Adresse de lien invalide.");return}const s=window.getSelection();!s||s.isCollapsed?document.execCommand("insertHTML",!1,`<a href="${p(o)}" target="_blank" rel="noopener noreferrer">${f(o)}</a>`):document.execCommand("createLink",!1,o),$(r),O(r)}function Ve(e){const t=l(e).trim();if(!t)return"";const n=/^(https?:|mailto:|tel:)/i.test(t)?t:`https://${t}`;try{const r=new URL(n);return["http:","https:","mailto:","tel:"].includes(r.protocol)?r.href:""}catch{return""}}function nn(e,t){if(!t?.clipboardData)return;t.preventDefault();const n=t.clipboardData.getData("text/html"),r=t.clipboardData.getData("text/plain"),i=n?_(n):f(r).replace(/\r?\n/g,"<br>");document.execCommand("insertHTML",!1,i),$(e)}function $(e){const t=e?.closest(".notes-field");t&&(t.classList.add("is-dirty"),M(Number(t.dataset.rowId),"saving","Modifications non enregistrées"))}function O(e){const t=e?.closest(".notes-field");if(!t||!t.classList.contains("is-editing"))return;t.querySelectorAll(".notes-tool[data-command]").forEach(r=>{let i=!1;try{i=document.queryCommandState(r.dataset.command)}catch{i=!1}r.classList.toggle("active",i),r.setAttribute("aria-pressed",i?"true":"false")});const n=t.querySelector(".notes-format-select");if(n){let r="p";try{r=l(document.queryCommandValue("formatBlock")).replace(/[<>]/g,"").toLowerCase()||"p"}catch{r="p"}Array.from(n.options).some(i=>i.value===r)?n.value=r:n.value="p"}}function rn(e,t){if(!(t.ctrlKey||t.metaKey))return;const n=t.key.toLowerCase();if(n==="k"){t.preventDefault();const r=e.closest(".notes-field")?.querySelector(".notes-tool-link");r&&ze(r,t)}t.shiftKey&&n==="7"&&(t.preventDefault(),document.execCommand("insertOrderedList"),$(e)),t.shiftKey&&n==="8"&&(t.preventDefault(),document.execCommand("insertUnorderedList"),$(e))}function on(e){const t=document.createRange(),n=window.getSelection();t.selectNodeContents(e),t.collapse(!1),n?.removeAllRanges(),n?.addRange(t)}function Ge(e){const t=document.createElement("template");return t.innerHTML=l(e),t.content.textContent||""}async function sn(e,t){if(!t)return"";const n=Number(e),r=_(t.innerHTML).trim(),i=X.get(n)||Promise.resolve();M(n,"saving","Enregistrement…");const o=i.catch(()=>{}).then(()=>U(n,"NOTES",r||null)).then(()=>(t.innerHTML=r,M(n,"saved","Enregistré"),r)).catch(s=>{throw M(n,"error","Échec de l’enregistrement"),console.error("Erreur pendant l’enregistrement des notes :",s),s}).finally(()=>{X.get(n)===o&&X.delete(n)});return X.set(n,o),o}function M(e,t,n){const r=document.getElementById(`notes-status-${Number(e)}`);r&&(r.className=`section-status notes-status${t?` ${t}`:""}`,r.textContent=n)}function an(e){const t=A(e.COULEUR),n=t||A(c.opt?.defaultcardcolor)||"#FFFFD1",r=c.col.COULEUR.getIsFormula();return`
        <div class="field color-field" data-row-id="${Number(e.id)}">
            <label class="field-label">Couleur de la carte</label>
            <div class="color-picker-row">
                <input
                    type="color"
                    class="color-picker"
                    value="${p(n)}"
                    oninput="previsualiserCouleur(${Number(e.id)}, this.value, this)"
                    onchange="mettreAJourCouleur(${Number(e.id)}, this.value, this, event)"
                    ${r?"disabled":""}
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
    `}function A(e){const t=l(e).trim();if(!t)return"";const n=t.startsWith("#")?t:`#${t}`;return/^#[0-9a-f]{3}$/i.test(n)?`#${n[1]}${n[1]}${n[2]}${n[2]}${n[3]}${n[3]}`.toUpperCase():/^#[0-9a-f]{6}$/i.test(n)?n.toUpperCase():""}function cn(e,t,n){const r=A(t);if(!r)return;const i=j(e);i&&(i.style.backgroundColor=r);const o=n?.closest(".color-field");if(o){const s=o.querySelector(".color-picker"),a=o.querySelector(".color-value");s&&n!==s&&(s.value=r),a&&n!==a&&(a.value=r)}}async function Qe(e,t,n,r){r?.stopPropagation();const i=n?.closest(".color-field"),o=i?.querySelector(".color-status"),s=l(t).trim(),a=A(s);if(s&&!a){o&&(o.className="section-status color-status error",o.textContent="Utilisez un code hexadécimal, par exemple #FFFFD1.");return}try{o&&(o.className="section-status color-status saving",o.textContent="Enregistrement…"),await U(e,"COULEUR",a||null,r);const u=j(e);if(u&&(a?u.style.backgroundColor=a:u.style.backgroundColor=A(c.opt?.defaultcardcolor)||"#FFFFD1"),i){const m=i.querySelector(".color-picker"),d=i.querySelector(".color-value");m&&(m.value=a||A(c.opt?.defaultcardcolor)||"#FFFFD1"),d&&(d.value=a||"")}o&&(o.className="section-status color-status saved",o.textContent="Enregistré",window.setTimeout(()=>{o.className="section-status color-status",o.textContent=""},1200))}catch(u){o&&(o.className="section-status color-status error",o.textContent="Impossible d’enregistrer la couleur."),console.error("Erreur pendant l’enregistrement de la couleur :",u)}}function ln(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".color-field"),r=Number(n?.dataset?.rowId);if(!n||!Number.isInteger(r)||r<=0)return;const i=n.querySelector(".color-value");i&&(i.value=""),Qe(r,"",e,t)}function Xe(e,t,n,r,i,o,s){const a=new Set(Ne(t)),u=N.map(d=>`
        <label
            class="multi-option personne-option"
            data-search="${p(`${d.label} ${d.email||""}`.toLocaleLowerCase(c.cultureFull))}"
        >
            <input
                type="checkbox"
                value="${d.id}"
                ${a.has(d.id)?"checked":""}
                onchange="mettreAJourChampPersonnes(
                    ${Number(e)},
                    '${w(n)}',
                    this.closest('.multi-dropdown'),
                    '${w(i)}',
                    '${w(o)}',
                    event
                )"
                ${s?"disabled":""}
            >
            <span
                class="responsable-option-avatar"
                style="background:${p(d.avatarColor)}"
            >${f(d.initials)}</span>
            <span class="responsable-option-name">
                ${f(d.label)}
            </span>
        </label>
    `).join(""),m=[...a].map(d=>S.get(d)?.label).filter(Boolean);return`
        <div class="field field-responsables">
            <label class="field-label">${f(r)}</label>
            <details
                class="multi-dropdown personnes-dropdown"
                data-row-id="${Number(e)}"
                data-mapping-key="${p(n)}"
            >
                <summary>
                    ${f(Ye(m,i,o))}
                </summary>
                <div class="multi-dropdown-menu">
                    <div class="multi-toolbar">
                        <input
                            type="search"
                            class="multi-search"
                            placeholder="Rechercher…"
                            oninput="filtrerOptionsMultiples(this)"
                            onclick="event.stopPropagation()"
                            ${s?"disabled":""}
                        >
                        <button
                            type="button"
                            class="multi-clear"
                            onclick="viderChampPersonnes(
                                this,
                                '${w(n)}',
                                '${w(i)}',
                                '${w(o)}',
                                event
                            )"
                            ${s?"disabled":""}
                        >Effacer</button>
                    </div>
                    <div class="multi-options">
                        ${u||'<div class="multi-empty">Aucun membre disponible</div>'}
                    </div>
                    <div class="multi-status" aria-live="polite"></div>
                </div>
            </details>
        </div>
    `}function Ye(e,t,n){const r=H(e);return r.length===0?"Choisir…":r.length===1?r[0]:`${r.length} ${n||`${t}s`}`}function un(e){const t=e.closest(".multi-dropdown");if(!t)return;const n=e.value.trim().toLocaleLowerCase(c.cultureFull);t.querySelectorAll(".multi-option").forEach(r=>{const i=r.querySelector('input[type="checkbox"]'),o=r.dataset.hideWhenSelected==="true"&&i?.checked,s=n!==""&&!l(r.dataset.search).includes(n);r.hidden=!!(o||s)}),be(t)}function dn(e,t,n,r,i){i?.preventDefault(),i?.stopPropagation();const o=e.closest(".multi-dropdown");o&&(o.querySelectorAll('input[type="checkbox"]:checked').forEach(s=>{s.checked=!1}),Ze(Number(o.dataset.rowId),t,o,n,r,i))}async function Ze(e,t,n,r,i,o){o?.stopPropagation();const s=Number(e||n?.dataset?.rowId);if(!Number.isInteger(s)||s<=0||!n)return;const a=Array.from(n.querySelectorAll('input[type="checkbox"]:checked')).map(h=>Number(h.value)).filter(h=>Number.isInteger(h)&&h>0&&S.has(h)),u=a.map(h=>S.get(h)?.label).filter(Boolean),m=n.querySelector("summary");m&&(m.textContent=Ye(u,r,i)),T(n,"saving","Enregistrement…");const d=`${t}:${s}`,g=(z.get(d)||Promise.resolve()).catch(()=>{}).then(()=>tt(s,t,a)).then(()=>{mn(s,t,a),T(n,"saved","Enregistré"),window.setTimeout(()=>T(n,"",""),1200)}).catch(h=>{T(n,"error","Échec de l’enregistrement"),console.error(`Erreur lors de l’enregistrement de ${t} :`,h)}).finally(()=>{z.get(d)===g&&z.delete(d)});z.set(d,g),await g}function mn(e,t,n){const r=E(e);r&&(r[`${t}_id`]=[...n],r[t]=n.map(i=>S.get(i)?.label).filter(Boolean))}function pn(e){const t=At(e),n=new Set(t),r=c.col.ETIQUETTES.getIsFormula(),i=t.map(s=>k.get(s)).filter(Boolean),o=L.map(s=>`
        <label
            class="multi-option etiquette-option"
            data-hide-when-selected="true"
            data-search="${p(s.label.toLocaleLowerCase(c.cultureFull))}"
            ${n.has(s.id)?"hidden":""}
        >
            <input
                type="checkbox"
                value="${s.id}"
                ${n.has(s.id)?"checked":""}
                onchange="mettreAJourEtiquettes(
                    ${Number(e.id)},
                    this.closest('.multi-dropdown'),
                    event
                )"
                ${r?"disabled":""}
            >
            <span
                class="etiquette-preview"
                style="background:${p(s.color)};color:${p(s.textColor)}"
            >${f(s.label)}</span>
        </label>
    `).join("");return`
        <div
            class="field field-etiquettes"
            data-row-id="${Number(e.id)}"
        >
            <div class="etiquettes-field-header">
                <label class="field-label">Étiquettes</label>
                ${r?"":`
                    <details
                        class="multi-dropdown etiquettes-dropdown etiquettes-picker"
                        data-row-id="${Number(e.id)}"
                    >
                        <summary
                            class="etiquettes-add-button"
                            title="Ajouter une étiquette"
                            aria-label="Ajouter une étiquette"
                        >+</summary>
                        <div class="multi-dropdown-menu">
                            <div class="multi-toolbar">
                                <input
                                    type="search"
                                    class="multi-search"
                                    placeholder="Rechercher une étiquette…"
                                    oninput="filtrerOptionsMultiples(this)"
                                    onclick="event.stopPropagation()"
                                >
                                <button
                                    type="button"
                                    class="multi-clear"
                                    onclick="viderEtiquettes(this, event)"
                                >Tout retirer</button>
                            </div>
                            <div class="multi-options">
                                ${o||'<div class="multi-empty">Ajoutez des lignes dans la table référencée par Étiquettes</div>'}
                                <div class="multi-all-selected" hidden>
                                    Toutes les étiquettes sont déjà actives.
                                </div>
                            </div>
                            <div
                                class="multi-status"
                                aria-live="polite"
                            ></div>
                        </div>
                    </details>
                `}
            </div>

            <div class="etiquettes-actives">
                ${et(i,e.id,r)}
            </div>
        </div>
    `}function et(e,t,n){return e.length?e.map(r=>`
        <span
            class="etiquette-active"
            style="background:${p(r.color)};color:${p(r.textColor)}"
            title="${p(r.label)}"
        >
            <span>${f(r.label)}</span>
            ${n?"":`
                <button
                    type="button"
                    onclick="retirerEtiquetteActive(
                        ${Number(t)},
                        ${Number(r.id)},
                        this,
                        event
                    )"
                    title="Retirer ${p(r.label)}"
                    aria-label="Retirer ${p(r.label)}"
                >×</button>
            `}
        </span>
    `).join(""):'<span class="etiquettes-empty">Aucune étiquette</span>'}function fn(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".multi-dropdown");n&&(n.querySelectorAll('input[type="checkbox"]:checked').forEach(r=>{r.checked=!1}),ge(Number(n.dataset.rowId),n,t))}function hn(e,t,n,r){r?.preventDefault(),r?.stopPropagation();const o=n.closest(".field-etiquettes")?.querySelector(".etiquettes-dropdown");if(!o)return;const s=o.querySelector(`input[type="checkbox"][value="${Number(t)}"]`);s&&(s.checked=!1),ge(Number(e),o,r)}async function ge(e,t,n){n?.stopPropagation();const r=Number(e||t?.dataset?.rowId);if(!Number.isInteger(r)||r<=0||!t)return;const i=Array.from(t.querySelectorAll('input[type="checkbox"]:checked')).map(a=>Number(a.value)).filter(a=>Number.isInteger(a)&&a>0&&k.has(a));gn(t,r,i),T(t,"saving","Enregistrement…");const s=(V.get(r)||Promise.resolve()).catch(()=>{}).then(()=>tt(r,"ETIQUETTES",i)).then(()=>{bn(r,i),T(t,"saved","Enregistré"),window.setTimeout(()=>T(t,"",""),1200)}).catch(a=>{T(t,"error","Échec de l’enregistrement"),console.error("Erreur lors de l’enregistrement des étiquettes :",a)}).finally(()=>{V.get(r)===s&&V.delete(r)});V.set(r,s),await s}function gn(e,t,n){const i=e.closest(".field-etiquettes")?.querySelector(".etiquettes-actives"),o=new Set(n),s=n.map(a=>k.get(a)).filter(Boolean);i&&(i.innerHTML=et(s,t,!1)),e.querySelectorAll(".etiquette-option").forEach(a=>{const u=a.querySelector('input[type="checkbox"]'),m=o.has(Number(u?.value));u&&(u.checked=m),a.hidden=m}),be(e)}function be(e){if(!e?.classList.contains("etiquettes-dropdown"))return;const t=e.querySelector(".multi-all-selected"),n=Array.from(e.querySelectorAll(".etiquette-option")).filter(r=>!r.hidden);t&&(t.hidden=n.length>0)}function bn(e,t){const n=E(e);n&&(n.ETIQUETTES_id=[...t],n.ETIQUETTES=t.map(r=>k.get(r)?.label).filter(Boolean))}async function tt(e,t,n){const r=c.map?.[t];if(!r||Array.isArray(r))throw new Error(`La colonne ${t} n’est pas correctement mappée.`);const i=[...new Set(R(n).map(Number).filter(m=>Number.isInteger(m)&&m>0))],o=await grist.getTable().getTableId(),s=i.length>0?["L",...i]:null;await grist.docApi.applyUserActions([["UpdateRecord",o,Number(e),{[r]:s}]]);const a=await nt(e,r),u=En(a);if(!vn(i,u))throw new Error(`Vérification d’écriture échouée pour ${t}. Valeur envoyée : ${JSON.stringify(s)} ; valeur relue : ${JSON.stringify(a)}`);await vt(e)}async function nt(e,t){const n=await grist.getTable().getTableId(),r=await grist.docApi.fetchTable(n),i=R(r?.id).findIndex(o=>Number(o)===Number(e));if(i<0)throw new Error(`Ligne ${e} introuvable dans la table ${n}.`);return r?.[t]?.[i]}function En(e){return e==null||e===""?[]:!Array.isArray(e)||e[0]==="E"?[]:e[0]==="L"?C(e.slice(1)):e[0]==="r"?C(e[2]):C(e)}function vn(e,t){const n=[...new Set(e.map(Number))].sort((i,o)=>i-o),r=[...new Set(t.map(Number))].sort((i,o)=>i-o);return n.length===r.length&&n.every((i,o)=>i===r[o])}function T(e,t,n){const r=e?.querySelector(".multi-status");r&&(r.className=`multi-status${t?` ${t}`:""}`,r.textContent=n)}function te(e){const t=l(e).trim();if(!t)return[];try{const n=JSON.parse(t);return Array.isArray(n)?n.map((r,i)=>({id:l(r?.id)||`legacy-${i}`,text:l(r?.text).trim(),done:!!r?.done,memberIds:C(r?.memberIds||r?.members||[]),dueDate:Ee(r?.dueDate),createdAt:l(r?.createdAt)})).filter(r=>r.text||r.id):[]}catch(n){return console.warn("Checklist illisible, valeur ignorée :",n),[]}}function Ee(e){const t=l(e).trim();return/^\d{4}-\d{2}-\d{2}$/.test(t)?t:""}function rt(e){const t=te(e.CHECKLIST),n=c.col.CHECKLIST.getIsFormula(),r=t.filter(o=>o.done).length,i=t.length>0?Math.round(r/t.length*100):0;return`
        <section
            class="detail-section checklist-section"
            data-row-id="${Number(e.id)}"
            data-disabled="${n?"true":"false"}"
        >
            <div class="detail-section-header checklist-header">
                <div>
                    <h3>☑ Checklist</h3>
                    <p>
                        <span class="checklist-progress-text">
                            ${r}/${t.length} terminé(s)
                        </span>
                    </p>
                </div>
                <span
                    class="checklist-progress-percent"
                    aria-label="${i}% terminé"
                >${i}%</span>
            </div>

            <div
                class="checklist-progress"
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow="${i}"
            >
                <span style="width:${i}%"></span>
            </div>

            ${n?"":`
                <div class="checklist-add">
                    <input
                        type="text"
                        class="checklist-add-input"
                        placeholder="Ajouter un élément…"
                        onkeydown="gererAjoutChecklistClavier(
                            ${Number(e.id)},
                            this,
                            event
                        )"
                    >
                    <button
                        type="button"
                        onclick="ajouterElementChecklist(
                            ${Number(e.id)},
                            this,
                            event
                        )"
                    >Ajouter</button>
                </div>
            `}

            <div
                id="checklist-status-${Number(e.id)}"
                class="section-status checklist-status"
                aria-live="polite"
            ></div>

            <div
                class="checklist-items"
                data-row-id="${Number(e.id)}"
            >
                ${t.length?t.map(o=>yn(o,e.id,n)).join(""):'<div class="section-empty checklist-empty">Aucun élément dans la checklist</div>'}
            </div>
        </section>
    `}function yn(e,t,n){const r=e.memberIds.map(o=>S.get(o)).filter(Boolean),i=!e.done&&e.dueDate&&new Date(`${e.dueDate}T23:59:59`).getTime()<Date.now();return`
        <article
            class="checklist-item${e.done?" done":""}${i?" overdue":""}"
            data-item-id="${p(e.id)}"
        >
            ${n?"":`
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
                    ${e.done?"checked":""}
                    onchange="mettreAJourElementChecklist(
                        ${Number(t)},
                        '${w(e.id)}',
                        'done',
                        this.checked,
                        event
                    )"
                    ${n?"disabled":""}
                >
                <span aria-hidden="true"></span>
            </label>

            <div class="checklist-item-content">
                <textarea
                    class="checklist-item-text auto-expand"
                    rows="1"
                    oninput="ajusterTextarea(this)"
                    onchange="mettreAJourElementChecklist(
                        ${Number(t)},
                        '${w(e.id)}',
                        'text',
                        this.value,
                        event
                    )"
                    ${n?"disabled":""}
                >${f(e.text)}</textarea>

                <div class="checklist-item-meta">
                    <label
                        class="checklist-due${i?" overdue":""}"
                        title="${i?"Échéance dépassée":"Date limite"}"
                    >
                        <span>📅</span>
                        <input
                            type="date"
                            value="${p(e.dueDate)}"
                            onchange="mettreAJourElementChecklist(
                                ${Number(t)},
                                '${w(e.id)}',
                                'dueDate',
                                this.value,
                                event
                            )"
                            ${n?"disabled":""}
                        >
                    </label>

                    ${wn(e,t,r,n)}
                </div>
            </div>

            ${n?"":`
                <button
                    type="button"
                    class="checklist-delete"
                    onclick="supprimerElementChecklist(
                        ${Number(t)},
                        '${w(e.id)}',
                        event
                    )"
                    title="Supprimer l’élément"
                    aria-label="Supprimer l’élément"
                >×</button>
            `}
        </article>
    `}function wn(e,t,n,r){const i=new Set(e.memberIds),o=n.length?`
            <span class="checklist-assignee-avatars">
                ${n.slice(0,4).map(a=>`
                        <span
                            class="checklist-assignee-avatar"
                            style="background:${p(a.avatarColor)}"
                            title="${p(a.label)}"
                        >${f(a.initials)}</span>
                    `).join("")}
                ${n.length>4?`<span class="checklist-assignee-more">+${n.length-4}</span>`:""}
            </span>
        `:'<span class="checklist-assignee-placeholder">👤 Attribuer</span>';if(r)return`
            <div class="checklist-assignees readonly">
                ${o}
            </div>
        `;const s=N.map(a=>`
        <label
            class="multi-option checklist-person-option"
            data-search="${p(a.label.toLocaleLowerCase(c.cultureFull))}"
        >
            <input
                type="checkbox"
                value="${a.id}"
                ${i.has(a.id)?"checked":""}
                onchange="mettreAJourAssignationsChecklist(
                    ${Number(t)},
                    '${w(e.id)}',
                    this.closest('.checklist-assignees'),
                    event
                )"
            >
            <span
                class="responsable-option-avatar"
                style="background:${p(a.avatarColor)}"
            >${f(a.initials)}</span>
            <span class="responsable-option-name">
                ${f(a.label)}
            </span>
        </label>
    `).join("");return`
        <details class="checklist-assignees">
            <summary>${o}</summary>
            <div class="checklist-assignees-menu">
                <div class="multi-toolbar">
                    <input
                        type="search"
                        class="multi-search"
                        placeholder="Rechercher…"
                        oninput="filtrerOptionsChecklist(this)"
                        onclick="event.stopPropagation()"
                    >
                </div>
                <div class="multi-options">
                    ${s||'<div class="multi-empty">Aucun membre disponible</div>'}
                </div>
            </div>
        </details>
    `}function Sn(e){const t=e.closest(".checklist-assignees"),n=e.value.trim().toLocaleLowerCase(c.cultureFull);t?.querySelectorAll(".checklist-person-option").forEach(r=>{r.hidden=n!==""&&!l(r.dataset.search).includes(n)})}function Cn(e,t,n){n.key==="Enter"&&(n.preventDefault(),it(e,t,n))}async function it(e,t,n){n?.preventDefault(),n?.stopPropagation();const i=t.closest(".checklist-section")?.querySelector(".checklist-add-input"),o=l(i?.value).trim();if(!o){i?.focus(),ne(e,"error","Saisissez un intitulé.");return}i&&(i.value=""),await x(e,s=>[...s,{id:Ie(),text:o,done:!1,memberIds:[],dueDate:"",createdAt:new Date().toISOString()}],!0,"Élément ajouté.")}async function An(e,t,n,r,i){i?.stopPropagation();const o=n==="done"?!!r:n==="dueDate"?Ee(r):l(r).trim();await x(e,s=>s.map(a=>a.id===t?{...a,[n]:o}:a),!0,"Checklist enregistrée.")}async function Nn(e,t,n,r){r?.stopPropagation();const i=Array.from(n.querySelectorAll('input[type="checkbox"]:checked')).map(o=>Number(o.value)).filter(o=>Number.isInteger(o)&&S.has(o));await x(e,o=>o.map(s=>s.id===t?{...s,memberIds:i}:s),!0,"Attribution enregistrée.")}async function $n(e,t,n){n?.preventDefault(),n?.stopPropagation();const r=E(e),i=te(r?.CHECKLIST).find(o=>o.id===t);i?.text&&!window.confirm(`Supprimer « ${i.text} » de la checklist ?`)||await x(e,o=>o.filter(s=>s.id!==t),!0,"Élément supprimé.")}async function x(e,t,n=!0,r="Checklist enregistrée."){const i=Number(e),o=G.get(i)||Promise.resolve();ne(i,"saving","Enregistrement…");const s=o.catch(()=>{}).then(async()=>{const a=E(i),u=te(a?.CHECKLIST),m=t(u).map(d=>({id:l(d.id)||Ie(),text:l(d.text).trim(),done:!!d.done,memberIds:[...new Set(C(d.memberIds))],dueDate:Ee(d.dueDate),createdAt:l(d.createdAt)||new Date().toISOString()}));return await U(i,"CHECKLIST",JSON.stringify(m)),m}).then(a=>(n&&Tn(i,a),ne(i,"saved",r),a)).catch(a=>{throw ne(i,"error","Impossible d’enregistrer la checklist."),console.error("Erreur pendant l’enregistrement de la checklist :",a),a}).finally(()=>{G.get(i)===s&&G.delete(i)});return G.set(i,s),s}function Tn(e,t=null){const n=document.querySelector(`.checklist-section[data-row-id="${Number(e)}"]`),r=E(e);if(!n||!r)return;t&&(r.CHECKLIST=JSON.stringify(t));const i=document.createElement("div");i.innerHTML=rt(r);const o=i.firstElementChild;n.replaceWith(o),ot(o.parentElement)}function ne(e,t,n){const r=document.getElementById(`checklist-status-${Number(e)}`);r&&(r.className=`section-status checklist-status${t?` ${t}`:""}`,r.textContent=n)}function ot(e=document){typeof Sortable!="function"||c.opt.readonly||e.querySelectorAll('.checklist-section[data-disabled="false"] .checklist-items').forEach(t=>{t.dataset.sortableReady!=="true"&&(t.dataset.sortableReady="true",new Sortable(t,{animation:140,handle:".checklist-drag-handle",ghostClass:"checklist-item-ghost",chosenClass:"checklist-item-chosen",onEnd:async()=>{const n=Number(t.dataset.rowId),r=Array.from(t.querySelectorAll(".checklist-item")).map(i=>i.dataset.itemId);await x(n,i=>{const o=new Map(i.map(s=>[s.id,s]));return r.map(s=>o.get(s)).filter(Boolean)},!0,"Ordre de la checklist enregistré.")}}))})}function In(e){const t=c.col.PIECES_JOINTES.getIsFormula();return`
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
    `}async function ve(e){const t=document.getElementById(`attachments-list-${Number(e)}`);if(!t)return;const n=E(e),r=C(n?.PIECES_JOINTES);if(r.length===0){t.innerHTML='<div class="section-empty">Aucune pièce jointe</div>';return}t.innerHTML='<div class="section-loading">Chargement des aperçus…</div>';try{const[i]=await Promise.all([lt(!0),me()]);t.innerHTML=r.map(o=>st(e,o,i)).join("")}catch(i){console.error("Impossible d’afficher les pièces jointes :",i),t.innerHTML=r.map(o=>st(e,o,null)).join("")}}function st(e,t,n){const r=dt(t),i=n?ut(n,t):"",o=mt(r),s=o==="image"&&i?`<img src="${p(i)}" alt="${p(r.fileName)}" loading="lazy">`:`<div class="attachment-file-icon">${pt(o)}</div>`;return`
        <article class="attachment-card">
            <button type="button" class="attachment-preview" onclick="ouvrirPieceJointe(${Number(e)}, ${Number(t)}, event)" title="Ouvrir ${p(r.fileName)}">
                ${s}
            </button>
            <div class="attachment-info">
                <div class="attachment-name" title="${p(r.fileName)}">${f(r.fileName)}</div>
                <div class="attachment-meta">${f(ir(r.fileSize))}</div>
            </div>
            <div class="attachment-actions">
                <button type="button" onclick="ouvrirPieceJointe(${Number(e)}, ${Number(t)}, event)" title="Visualiser">👁</button>
                <button type="button" onclick="retirerPieceJointe(${Number(e)}, ${Number(t)}, event)" title="Retirer de la tâche">×</button>
            </div>
        </article>
    `}async function kn(e,t,n){n?.stopPropagation();const r=Array.from(t?.files||[]);if(r.length===0)return;const i=r.find(o=>o.size>Lt);if(i){v("attachments",e,"error",`${i.name} dépasse 50 Mo.`),t.value="";return}t.disabled=!0,v("attachments",e,"saving",`Envoi de ${r.length} fichier(s)…`);try{const o=await grist.docApi.getAccessToken({readOnly:!1}),s=new FormData;r.forEach(h=>s.append("upload",h,h.name));const a=await fetch(`${o.baseUrl}/attachments?auth=${encodeURIComponent(o.token)}`,{method:"POST",body:s,headers:{"X-Requested-With":"XMLHttpRequest"}});if(!a.ok)throw new Error(`Upload échoué (${a.status} ${a.statusText})`);const u=await a.json(),m=C(u);if(m.length===0)throw new Error("Grist n’a retourné aucun identifiant de pièce jointe.");const d=E(e),b=C(d?.PIECES_JOINTES),g=[...new Set([...b,...m])];await at(e,g),d&&(d.PIECES_JOINTES=[...g]),K=!1,await me(!0),await ve(e),v("attachments",e,"saved","Pièce(s) jointe(s) ajoutée(s).")}catch(o){console.error("Erreur pendant l’ajout des pièces jointes :",o),v("attachments",e,"error",o.message||"Échec de l’envoi.")}finally{t.value="",t.disabled=!1}}async function Mn(e,t,n){n?.preventDefault(),n?.stopPropagation();const r=E(e),o=C(r?.PIECES_JOINTES).filter(s=>s!==Number(t));try{v("attachments",e,"saving","Mise à jour…"),await at(e,o),r&&(r.PIECES_JOINTES=[...o]),await ve(e),v("attachments",e,"saved","Pièce jointe retirée de la tâche.")}catch(s){console.error("Erreur pendant le retrait de la pièce jointe :",s),v("attachments",e,"error","Impossible de retirer la pièce jointe.")}}async function at(e,t){const n=c.map?.PIECES_JOINTES;if(!n||Array.isArray(n))throw new Error("La colonne Pièces jointes n’est pas correctement mappée.");await grist.getTable().update({id:Number(e),fields:{[n]:["L",...t]}}),await vt(e)}async function Rn(e,t,n){n?.preventDefault(),n?.stopPropagation();try{const[r]=await Promise.all([lt(!0),me()]),i=dt(t),o=ut(r,t);Ln(i,o)}catch(r){console.error("Impossible d’ouvrir la pièce jointe :",r),window.alert("Impossible d’ouvrir cette pièce jointe.")}}function Dn(){if(document.getElementById("attachment-viewer"))return;const e=document.createElement("div");e.id="attachment-viewer",e.className="attachment-viewer",e.setAttribute("aria-hidden","true"),e.innerHTML=`
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
    `,document.body.appendChild(e)}function Ln(e,t){const n=document.getElementById("attachment-viewer"),r=document.getElementById("attachment-viewer-content"),i=document.getElementById("attachment-viewer-title"),o=document.getElementById("attachment-viewer-download");if(!n||!r||!i||!o)return;i.textContent=e.fileName,o.href=t;const s=mt(e);s==="image"?r.innerHTML=`<img src="${p(t)}" alt="${p(e.fileName)}">`:s==="pdf"?r.innerHTML=`<iframe src="${p(t)}" title="${p(e.fileName)}"></iframe>`:s==="video"?r.innerHTML=`<video src="${p(t)}" controls autoplay></video>`:s==="audio"?r.innerHTML=`<div class="attachment-generic-preview"><div class="attachment-large-icon">🎵</div><audio src="${p(t)}" controls autoplay></audio></div>`:r.innerHTML=`<div class="attachment-generic-preview"><div class="attachment-large-icon">${pt(s)}</div><p>Ce format ne dispose pas d’un aperçu intégré.</p><a href="${p(t)}" target="_blank" rel="noopener">Ouvrir ou télécharger le fichier</a></div>`,n.classList.add("visible"),n.setAttribute("aria-hidden","false")}function ct(e){e?.preventDefault(),e?.stopPropagation();const t=document.getElementById("attachment-viewer");if(!t)return;t.classList.remove("visible"),t.setAttribute("aria-hidden","true");const n=document.getElementById("attachment-viewer-content");n&&(n.innerHTML="")}async function lt(e=!0){if(e&&W&&Date.now()-De<Dt)return W;const t=await grist.docApi.getAccessToken({readOnly:e});return e&&(W=t,De=Date.now()),t}function ut(e,t){return`${e.baseUrl}/attachments/${Number(t)}/download?auth=${encodeURIComponent(e.token)}`}function dt(e){return ae.get(Number(e))||{id:Number(e),fileName:`Pièce jointe ${Number(e)}`,fileExt:"",fileType:"",fileSize:0,imageWidth:0,imageHeight:0}}function mt(e){const t=l(e.fileExt||Tt(e.fileName)).toLowerCase().replace(/^\./,""),n=l(e.fileType).toLowerCase();return n.startsWith("image/")||["png","jpg","jpeg","gif","webp","svg","bmp","avif"].includes(t)?"image":n==="application/pdf"||t==="pdf"?"pdf":n.startsWith("video/")||["mp4","webm","mov","m4v","ogv"].includes(t)?"video":n.startsWith("audio/")||["mp3","wav","ogg","m4a","aac","flac"].includes(t)?"audio":["doc","docx","odt"].includes(t)?"document":["xls","xlsx","ods","csv"].includes(t)?"tableur":["ppt","pptx","odp"].includes(t)?"presentation":["zip","rar","7z","tar","gz"].includes(t)?"archive":"file"}function pt(e){return{image:"🖼️",pdf:"📕",video:"🎬",audio:"🎵",document:"📄",tableur:"📊",presentation:"📽️",archive:"🗜️",file:"📎"}[e]||"📎"}function On(e){const t=F(e.COMMENTAIRES),n=c.opt.enablementions!==!1;return`
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
                ${gt(t,e.id)}
            </div>

            <div class="comment-composer">
                <div class="comment-input-wrapper">
                    <textarea
                        class="comment-input"
                        placeholder="Écrire un commentaire${n?" — utilisez @ pour mentionner quelqu’un":""}…"
                        oninput="ajusterTextarea(this); gererSaisieMention(this)"
                        onkeydown="gererTouchesMention(this, event)"
                    ></textarea>

                    ${n?qn():""}
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
                    ${n?"Les mentions sont visuelles uniquement et n’envoient pas d’e-mail automatique.":""}
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
    `}function qn(){return`
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
                ${N.map(t=>`
        <button
            type="button"
            class="mention-option"
            data-member-id="${t.id}"
            data-search="${p(`${t.label} ${t.email||""}`.toLocaleLowerCase(c.cultureFull))}"
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
    `}function Pn(e,t){t?.preventDefault(),t?.stopPropagation();const r=e.closest(".comment-composer")?.querySelector(".mention-menu");r&&(r.hidden=!1,ft(r,""))}function _n(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".mention-menu");n&&(n.hidden=!0)}function xn(e){const n=e.closest(".comment-composer")?.querySelector(".mention-menu");if(!n||c.opt.enablementions===!1)return;const r=ht(e);if(!r){n.hidden=!0;return}n.hidden=!1,n.dataset.mentionStart=String(r.start),ft(n,r.query)}function Fn(e,t){const r=e.closest(".comment-composer")?.querySelector(".mention-menu");if(!r||r.hidden)return;const i=Array.from(r.querySelectorAll(".mention-option:not([hidden])"));if(t.key==="Escape"){t.preventDefault(),r.hidden=!0,e.focus();return}t.key==="Enter"&&i.length===1&&(t.preventDefault(),i[0].click())}function ft(e,t){const n=l(t).trim().toLocaleLowerCase(c.cultureFull);e.querySelectorAll(".mention-option").forEach(r=>{r.hidden=n!==""&&!l(r.dataset.search).includes(n)})}function ht(e){const t=Number(e.selectionStart),r=e.value.slice(0,t).match(/(?:^|\s)@([^@\n]*)$/);if(!r)return null;const i=r[1];return{query:i,start:t-i.length-1,end:t}}function Un(e,t,n){n?.preventDefault(),n?.stopPropagation();const r=e.closest(".comment-composer"),i=r?.querySelector(".comment-input"),o=r?.querySelector(".mention-menu"),s=S.get(Number(t));if(!r||!i||!s)return;const a=ht(i),u=`@${s.label}`;if(a)i.setRangeText(`${u} `,a.start,a.end,"end");else{const m=i.value&&!/\s$/.test(i.value)?" ":"";i.setRangeText(`${m}${u} `,i.selectionStart,i.selectionEnd,"end")}r._selectedMentions||(r._selectedMentions=new Map),r._selectedMentions.set(s.id,{id:s.id,name:s.label,email:s.email||""}),ye(r),o&&(o.hidden=!0),i.focus(),B(i)}function ye(e){const t=e.querySelector(".comment-selected-mentions");if(!t)return;const n=Array.from(e._selectedMentions?.values?.()||[]);t.innerHTML=n.map(r=>`
        <span class="selected-mention-chip">
            @${f(r.name)}
            <button
                type="button"
                onclick="retirerMentionCommentaire(this, ${Number(r.id)}, event)"
                aria-label="Retirer ${p(r.name)}"
            >×</button>
        </span>
    `).join("")}function Jn(e,t,n){n?.preventDefault(),n?.stopPropagation();const r=e.closest(".comment-composer"),i=r?.querySelector(".comment-input"),o=S.get(Number(t));if(r?._selectedMentions?.delete(Number(t)),i&&o){const s=`@${o.label}`;i.value=i.value.replaceAll(s,"").replace(/[ \t]{2,}/g," ").trimStart(),B(i)}r&&ye(r)}function gt(e,t){return e.length===0?'<div class="section-empty">Aucun commentaire</div>':e.map(n=>`
        <article
            class="comment-card"
            data-comment-id="${p(n.id)}"
        >
            <div class="comment-header">
                <strong>${f(n.author===P?"Nom Grist non configuré":n.author||"Anonyme")}</strong>
                <span>${f($e(n.createdAt))}</span>
                <button
                    type="button"
                    onclick="supprimerCommentaire(
                        ${Number(t)},
                        '${w(n.id)}',
                        event
                    )"
                    title="Supprimer le commentaire"
                >×</button>
            </div>
            <div class="comment-body">
                ${Bn(n)}
            </div>
        </article>
    `).join("")}function Bn(e){let t=f(e.text).replace(/\n/g,"<br>");return bt(e.mentions).sort((r,i)=>i.name.length-r.name.length).forEach(r=>{const i=f(`@${r.name}`),o=`
            <span
                class="comment-mention"
                title="${p(r.email||r.name)}"
            >${i}</span>
        `;t=t.split(i).join(o)}),t}function F(e){const t=l(e).trim();if(!t)return[];try{const n=JSON.parse(t);if(!Array.isArray(n))throw new Error("Format non tableau");return n.map((r,i)=>({id:l(r?.id)||`legacy-${i}`,author:l(r?.author)||"Anonyme",createdAt:l(r?.createdAt),text:l(r?.text),mentions:bt(r?.mentions)})).filter(r=>r.text.trim())}catch{return[{id:"legacy-text",author:"Ancien commentaire",createdAt:"",text:t,mentions:[]}]}}function bt(e){return R(e).map(t=>({id:Number(t?.id)||0,name:l(t?.name||t?.label).trim(),email:Nt(t?.email)})).filter(t=>t.name)}async function jn(e,t,n){n?.preventDefault(),n?.stopPropagation();const i=t.closest(".comments-section")?.querySelector(".comment-composer"),o=i?.querySelector(".comment-input"),s=l(o?.value).trim();if(!s){v("comments",e,"error","Écrivez un commentaire."),o?.focus();return}const a=Array.from(i?._selectedMentions?.values?.()||[]).filter(m=>s.includes(`@${m.name}`));t.disabled=!0,v("comments",e,"saving","Enregistrement…");const u={id:Ie(),author:P,createdAt:new Date().toISOString(),text:s,mentions:a};try{const d=(await Et(e,h=>[...h,u])).find(h=>h.id===u.id);if(!d||d.author===P)throw new Error("La formule user.Name n’a pas remplacé le nom temporaire.");if(o&&(o.value="",B(o)),i){i._selectedMentions=new Map,ye(i);const h=i.querySelector(".mention-menu");h&&(h.hidden=!0)}we(e);const b=d.mentions.length,g=b>0?`Commentaire ajouté par ${d.author}. ${b} mention(s) visuelle(s), sans envoi d’e-mail.`:`Commentaire ajouté par ${d.author}.`;v("comments",e,"saved",g)}catch(m){console.error("Erreur pendant l’ajout du commentaire :",m),we(e),v("comments",e,"error",l(m?.message)||"Impossible d’ajouter le commentaire.")}finally{t.disabled=!1}}async function Hn(e,t,n){n?.preventDefault(),n?.stopPropagation();try{v("comments",e,"saving","Suppression…"),await Et(e,r=>r.filter(i=>i.id!==t)),we(e),v("comments",e,"saved","Commentaire supprimé.")}catch(r){console.error("Erreur pendant la suppression du commentaire :",r),v("comments",e,"error","Impossible de supprimer le commentaire.")}}async function Et(e,t){const n=Number(e),i=(Q.get(n)||Promise.resolve()).catch(()=>{}).then(async()=>{const o=E(n),s=F(o?.COMMENTAIRES),a=t(s),u=JSON.stringify(a),m=Se();await c.updateRecords(c.formatRecord(n,{COMMENTAIRES:u,...m}));const d=await Kn(n);return o&&(o.COMMENTAIRES=JSON.stringify(d)),d}).finally(()=>{Q.get(n)===i&&Q.delete(n)});return Q.set(n,i),i}async function Kn(e){const t=c.map?.COMMENTAIRES;if(!t||Array.isArray(t))throw new Error("La colonne Commentaires n’est pas correctement mappée.");const n=await nt(e,t),r=F(n),i=E(e);return i&&(i.COMMENTAIRES=l(n)),r}function we(e){const t=E(e),n=F(t?.COMMENTAIRES),r=document.getElementById(`comments-list-${Number(e)}`),i=r?.closest(".comments-section");r&&(r.innerHTML=gt(n,e));const o=i?.querySelector(".detail-section-header p");o&&(o.textContent=`${n.length} commentaire(s)`)}async function U(e,t,n,r){r?.stopPropagation();try{t==="STATUT"&&Ce(n)?.useconfetti&&sr();const i={[t]:n,...t==="DERNIERE_MISE_A_JOUR"||t==="MODIFIE_PAR"?{}:Se()};await c.updateRecords(c.formatRecord(e,i));const o=E(e);o&&(o[t]=n,i.DERNIERE_MISE_A_JOUR&&(o.DERNIERE_MISE_A_JOUR=i.DERNIERE_MISE_A_JOUR),i.MODIFIE_PAR&&(o.MODIFIE_PAR=i.MODIFIE_PAR))}catch(i){throw console.error(y("Error during update:"),i),i}}function Se(){const e={};return c.map?.DERNIERE_MISE_A_JOUR&&!c.col.DERNIERE_MISE_A_JOUR.getIsFormula()&&(e.DERNIERE_MISE_A_JOUR=new Date().toISOString()),c.map?.MODIFIE_PAR&&!c.col.MODIFIE_PAR.getIsFormula()&&(e.MODIFIE_PAR=P),e}async function vt(e){const t=Se();if(Object.keys(t).length!==0)try{await c.updateRecords(c.formatRecord(e,t));const n=E(e);n&&Object.assign(n,t)}catch(n){console.warn("Données enregistrées, mais informations de suivi non modifiées :",n)}}async function Wn(e){try{const t={DESCRIPTION:"",STATUT:e};c.map?.DERNIERE_MISE_A_JOUR&&!c.col.DERNIERE_MISE_A_JOUR.getIsFormula()&&(t.DERNIERE_MISE_A_JOUR=new Date().toISOString()),c.map?.CREE_LE&&!c.col.CREE_LE.getIsFormula()&&(t.CREE_LE=new Date().toISOString()),c.map?.COMMENTAIRES&&!c.col.COMMENTAIRES.getIsFormula()&&(t.COMMENTAIRES="[]"),c.map?.CHECKLIST&&!c.col.CHECKLIST.getIsFormula()&&(t.CHECKLIST="[]"),c.map?.ORDRE&&!c.col.ORDRE.getIsFormula()&&(t.ORDRE=Gn(e));const n=await c.createRecords({fields:t});if(n?.id>0){grist.setCursorPos({rowId:n.id});const r=await c.fetchSelectedRecord(n.id);c.opt.hideedit||ee(r)}}catch(t){console.error(y("Error on creation:"),t)}}async function zn(e,t){if(t?.stopPropagation(),!(c.opt.confirmdelete!==!1&&!confirm(y("Are you sure you want to delete this task?"))))try{await c.destroyRecords(e),J()}catch(n){console.error(y("Error on delete:"),n)}}function J(){const e=document.getElementById("popup-todo");!e||e.querySelector(".notes-field.is-editing.is-dirty")&&!window.confirm("Les modifications des notes ne sont pas enregistrées. Fermer quand même ?")||(j(e.dataset.currentTodo)?.classList.remove("active"),e.classList.remove("visible"),yt())}function Vn(e,t){if(t?.stopPropagation(),!e)return;e.classList.toggle("collapsed");const n=e.querySelector(".titre-statut")?.childNodes?.[0]?.textContent?.trim()||e.id;localStorage.setItem(St(n),String(e.classList.contains("collapsed")))}function B(e){e&&(e.style.height="",e.style.height=`${Math.max(e.scrollHeight,42)}px`)}function yt(e=null){document.querySelectorAll(".multi-dropdown[open], .checklist-assignees[open]").forEach(t=>{t!==e&&t.removeAttribute("open")})}document.addEventListener("keydown",e=>{if(e.key!=="Escape")return;if(document.getElementById("attachment-viewer")?.classList.contains("visible")){ct(e);return}const n=document.querySelector(".multi-dropdown[open], .checklist-assignees[open]");n?n.removeAttribute("open"):J()}),document.addEventListener("click",e=>{const t=e.target.closest(".multi-dropdown, .checklist-assignees");c?.opt?.autoclosemenus!==!1&&yt(t);const n=document.getElementById("popup-todo");if(!n?.classList.contains("visible"))return;const r=n.contains(e.target),i=!!e.target.closest(".carte"),o=!!e.target.closest("#attachment-viewer");!r&&!i&&!o&&J()});function E(e){return I.find(t=>Number(t.id)===Number(e))||null}function j(e){return Array.from(document.querySelectorAll(".carte")).find(t=>Number(t.dataset.todoId)===Number(e))||null}function wt(e){return{addbutton:!1,isdone:!1,useconfetti:!1,hidecolumn:!1,...(Array.isArray(c.opt?.columns)?c.opt.columns:[])[e]||{}}}function Ce(e){const n=(c.valuesList?.columns||[]).indexOf(e);return n>=0?wt(n):null}function St(e){return`column-todo-${l(e)}`}function Gn(e){const t=I.filter(n=>l(n.STATUT)===l(e)).map(n=>Number(n.ORDRE)).filter(Number.isFinite);return t.length>0?Math.max(...t)+1e3:1e3}function Ae(e,t){const n=Ne(e?.[`${t}_id`]);if(n.length>0)return n;const r=H(e?.[t]).filter(o=>o!=="#KeyError"),i=[...N];return r.flatMap(o=>{const s=i.findIndex(u=>u.label===o);if(s<0)return[];const[a]=i.splice(s,1);return[a.id]})}function Ct(e,t){const n=Ae(e,t);return n.length>0?n.map(r=>S.get(r)).filter(Boolean):H(e?.[t]).filter(r=>r!=="#KeyError").map(r=>({id:0,label:r,initials:Fe(r),avatarColor:Ue(r)}))}function Qn(e){return Ae(e,"MEMBRES")}function Xn(e){return Ct(e,"MEMBRES")}function Yn(e){return Ae(e,"RESPONSABLE")}function Zn(e){return Ct(e,"RESPONSABLE")}function At(e){const t=Ne(e?.ETIQUETTES_id);if(t.length>0)return t;const n=H(e?.ETIQUETTES).filter(i=>i!=="#KeyError"),r=[...L];return n.flatMap(i=>{const o=r.findIndex(a=>a.label===i);if(o<0)return[];const[s]=r.splice(o,1);return[s.id]})}function er(e){const t=At(e);return t.length>0?t.map(n=>k.get(n)).filter(Boolean):H(e?.ETIQUETTES).filter(n=>n!=="#KeyError").map(n=>{const r=Je(n);return{id:0,label:n,color:r,textColor:Be(r)}})}function Ne(e){return C(e)}function C(e){let t=R(e);return t[0]==="L"?t=t.slice(1):t[0]==="r"&&(t=R(t[2])),[...new Set(t.flatMap(n=>Array.isArray(n)?n:[n]).map(Number).filter(n=>Number.isInteger(n)&&n>0))]}function H(e){let t=R(e);return t[0]==="L"&&(t=t.slice(1)),[...new Set(t.flatMap(n=>Array.isArray(n)?n:[n]).map(l).map(n=>n.trim()).filter(Boolean))]}function R(e){return e==null||e===""?[]:Array.isArray(e)?e:[e]}function l(e){return e==null?"":String(e)}function Nt(e){const t=l(e).trim().toLowerCase();return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)?t:""}function tr(e){const t=[],n=c.map?.CREE_LE&&e.CREE_LE?$e(e.CREE_LE):"",r=c.map?.CREE_PAR?l(e.CREE_PAR).trim():"";if(n||r){const a=["Créé"];n&&a.push(`le ${n}`),r&&a.push(`par ${r}`),t.push(`<div>${f(a.join(" "))}</div>`)}const i=c.map?.DERNIERE_MISE_A_JOUR&&e.DERNIERE_MISE_A_JOUR?$e(e.DERNIERE_MISE_A_JOUR):"",o=c.map?.MODIFIE_PAR?l(e.MODIFIE_PAR).trim():"",s=o===P?"Nom Grist non configuré":o;if(i||s){const a=["Modifié"];i&&a.push(`le ${i}`),s&&a.push(`par ${s}`),t.push(`<div>${f(a.join(" "))}</div>`)}return t.join("")}function v(e,t,n,r){const i=document.getElementById(`${e}-status-${Number(t)}`);i&&(i.className=`section-status${n?` ${n}`:""}`,i.textContent=r)}function nr(e){if(!e)return"";const t=new Date(e);if(Number.isNaN(t.getTime())||t>=q)return"";const n=String(t.getDate()).padStart(2,"0"),r=t.toLocaleDateString(c.cultureFull,{month:"short"});return`${n} ${r} ${t.getFullYear()}`}function $e(e){if(!e)return"";const t=new Date(e);return Number.isNaN(t.getTime())?"":t.toLocaleString(c.cultureFull,{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}function rr(e){if(!e)return"";const t=new Date(e);return Number.isNaN(t.getTime())||t>=q?"":t.toISOString().split("T")[0]}function $t(e){if(!e)return"";const t=new Date(e);return Number.isNaN(t.getTime())?l(e):t.toISOString()}function Te(e){if(!e)return null;const t=new Date(e).getTime();return Number.isNaN(t)?null:t}function re(e,t){return Te(e)??t}function ir(e){const t=Number(e)||0;if(t<=0)return"";const n=["o","Ko","Mo","Go"],r=Math.min(Math.floor(Math.log(t)/Math.log(1024)),n.length-1);return`${(t/1024**r).toFixed(r===0?0:1)} ${n[r]}`}function Tt(e){const t=l(e).match(/(\.[^.]+)$/);return t?t[1]:""}function Ie(){return globalThis.crypto?.randomUUID?crypto.randomUUID():`comment-${Date.now()}-${Math.random().toString(16).slice(2)}`}function f(e){return l(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function p(e){return f(e).replace(/`/g,"&#096;")}function w(e){return l(e).replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/\r/g,"\\r").replace(/\n/g,"\\n")}function or(e){return encodeURIComponent(l(e)).replace(/'/g,"%27")}function sr(){if(typeof confetti!="function")return;const e=2e3,t=Date.now()+e,n={startVelocity:30,spread:360,ticks:60,zIndex:1500},r=(o,s)=>Math.random()*(s-o)+o,i=window.setInterval(()=>{const o=t-Date.now();if(o<=0){window.clearInterval(i);return}const s=50*(o/e);confetti({...n,particleCount:s,origin:{x:r(.1,.3),y:Math.random()-.2}}),confetti({...n,particleCount:s,origin:{x:r(.7,.9),y:Math.random()-.2}})},250)}window.toggleColonne=Vn,window.togglePopupTodo=ee,window.fermerPopup=J,window.mettreAJourChamp=U,window.creerNouvelleTache=Wn,window.supprimerTodo=zn,window.mettreAJourChampPersonnes=Ze,window.filtrerOptionsMultiples=un,window.viderChampPersonnes=dn,window.mettreAJourEtiquettes=ge,window.viderEtiquettes=fn,window.retirerEtiquetteActive=hn,window.gererAjoutChecklistClavier=Cn,window.ajouterElementChecklist=it,window.mettreAJourElementChecklist=An,window.mettreAJourAssignationsChecklist=Nn,window.supprimerElementChecklist=$n,window.filtrerOptionsChecklist=Sn,window.ajouterPiecesJointes=kn,window.retirerPieceJointe=Mn,window.ouvrirPieceJointe=Rn,window.fermerLecteurPieceJointe=ct,window.ajouterCommentaire=jn,window.supprimerCommentaire=Hn,window.ajusterTextarea=B,window.previsualiserCouleur=cn,window.mettreAJourCouleur=Qe,window.reinitialiserCouleur=ln,window.activerEditionNotes=Gt,window.annulerEditionNotes=Qt,window.enregistrerEtFermerNotes=Xt,window.appliquerFormatBlocNotes=Zt,window.appliquerCommandeNotes=en,window.appliquerBaliseSelectionNotes=tn,window.creerLienNotes=ze,window.nettoyerCollageNotes=nn,window.marquerNotesModifiees=$,window.mettreAJourEtatBarreNotes=O,window.gererRaccourcisNotes=rn,window.ouvrirMenuMentions=Pn,window.fermerMenuMentions=_n,window.gererSaisieMention=xn,window.gererTouchesMention=Fn,window.selectionnerMentionCommentaire=Un,window.retirerMentionCommentaire=Jn}));
