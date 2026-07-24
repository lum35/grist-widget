(function(c){typeof define=="function"&&define.amd?define(c):c()})((function(){"use strict";let c,y;const B=new Date("3000-01-01"),ue="#DCDCDC",Fe="#000000",Qt=120*1e3,Vt=50*1024*1024,j="__GRIST_USER_NAME__";let R=[],T=[],w=new Map,de=null,_=[],M=new Map,me=null,pe=new Map,G=!1,X=null,Oe=0;const Y=new Map,Z=new Map,ee=new Map,te=new Map,ne=new Map,re=new Map;let xe=null,fe=!1;window.addEventListener("load",async()=>{c=new WidgetSDK,y=await c.loadTranslations(["widget.js"]),c.configureOptions([WidgetSDK.newItem("columns",null,"Colonnes du Kanban","Réglez le comportement de chaque statut.","1 — Colonnes",{columnId:"STATUT",template:[WidgetSDK.newItem("addbutton",!0,"Autoriser l’ajout","Afficher un bouton pour créer une carte dans cette colonne."),WidgetSDK.newItem("isdone",!1,"Colonne terminée","Considérer les cartes de cette colonne comme terminées."),WidgetSDK.newItem("useconfetti",!1,"Confettis","Afficher des confettis lorsqu’une carte arrive dans cette colonne."),WidgetSDK.newItem("hidecolumn",!1,"Masquer la colonne","Ne pas afficher cette colonne dans le Kanban.")]}),WidgetSDK.newItem("rotation",!0,"Inclinaison des cartes","Donner un léger effet post-it aux cartes.","2 — Affichage des cartes"),WidgetSDK.newItem("compact",!1,"Mode compact","Réduire les espacements et la hauteur des cartes.","2 — Affichage des cartes"),WidgetSDK.newItem("showlabels",!0,"Afficher les étiquettes","Afficher les étiquettes colorées sur les cartes.","2 — Affichage des cartes"),WidgetSDK.newItem("showmembers",!0,"Afficher les membres","Afficher les bulles d’initiales des membres sur les cartes.","2 — Affichage des cartes"),WidgetSDK.newItem("showresponsables",!0,"Afficher les responsables","Afficher les responsables avec une bordure renforcée sur les cartes.","2 — Affichage des cartes"),WidgetSDK.newItem("showdeadline",!0,"Afficher l’échéance","Afficher la date limite sur les cartes.","2 — Affichage des cartes"),WidgetSDK.newItem("showindicators",!0,"Afficher les indicateurs","Afficher le nombre de pièces jointes et de commentaires.","2 — Affichage des cartes"),WidgetSDK.newItem("showchecklistprogress",!0,"Afficher la progression checklist","Afficher le nombre d’éléments cochés sur les cartes.","2 — Affichage des cartes"),WidgetSDK.newItem("defaultcardcolor","#FFFFD1","Couleur par défaut","Couleur utilisée lorsqu’aucune couleur personnalisée n’est enregistrée.","2 — Affichage des cartes"),WidgetSDK.newItem("showchecklist",!0,"Checklist","Afficher la checklist avancée dans la fiche.","3 — Fiche descriptive"),WidgetSDK.newItem("showattachments",!0,"Pièces jointes","Afficher la section des pièces jointes dans la fiche.","3 — Fiche descriptive"),WidgetSDK.newItem("showcomments",!0,"Commentaires","Afficher la section des commentaires dans la fiche.","3 — Fiche descriptive"),WidgetSDK.newItem("enablementions",!0,"Mentions @ visuelles","Permettre de mentionner les membres dans les commentaires. Cette version ne déclenche aucun e-mail automatique.","3 — Fiche descriptive"),WidgetSDK.newItem("showmetadata",!0,"Informations de suivi","Afficher les lignes « Créé le » et « Modifié le » en bas de la fiche.","3 — Fiche descriptive"),WidgetSDK.newItem("autoclosemenus",!0,"Fermer les menus automatiquement","Fermer les sélecteurs multiples lorsqu’on clique ailleurs.","3 — Fiche descriptive"),WidgetSDK.newItem("readonly",!1,"Lecture seule","Désactiver toutes les modifications depuis le widget.","4 — Comportement"),WidgetSDK.newItem("hideedit",!1,"Masquer la fiche","Ne pas ouvrir la fiche descriptive lors d’un clic sur une carte.","4 — Comportement"),WidgetSDK.newItem("gristeditcard",!1,"Double-clic vers la fiche Grist","Ouvrir la fiche native de Grist lors d’un double-clic.","4 — Comportement"),WidgetSDK.newItem("confirmdelete",!0,"Confirmer les suppressions","Demander une confirmation avant de supprimer une tâche.","4 — Comportement")],"#config-view","#main-view",{onOptChange:ye,onOptLoad:ye}),c.initMetaData(),c.ready({requiredAccess:"full",allowSelectBy:!0,columns:[{name:"STATUT",title:"Statut",description:"Colonne du Kanban",type:"Choice",strictType:!0},{name:"DESCRIPTION",title:"Nom de la tâche",description:"Nom principal de la tâche",type:"Any"},{name:"DESCRIPTION_DISPLAY",title:"Affichage de la tâche",description:"Contenu personnalisé facultatif affiché sur la carte",type:"Any",optional:!0},{name:"NOTES",title:"Notes",description:"Notes enrichies enregistrées en HTML sécurisé",type:"Text",strictType:!0,optional:!0},{name:"DEADLINE",title:"Échéance",description:"Date limite de la carte",type:"Date",optional:!0},{name:"ORDRE",title:"Ordre manuel",description:"Nombre utilisé pour conserver exactement la position des cartes",type:"Numeric",strictType:!0,optional:!0},{name:"MEMBRES",title:"Membres",description:"Toutes les personnes qui participent à la carte",type:"RefList",strictType:!0,optional:!0},{name:"RESPONSABLE",title:"Responsables",description:"Responsables principaux de la carte",type:"RefList",strictType:!0,optional:!0},{name:"ETIQUETTES",title:"Étiquettes",description:"Étiquettes multiples référencées depuis une table dédiée",type:"RefList",strictType:!0,optional:!0},{name:"CHECKLIST",title:"Checklist",description:"Checklists titrées stockées en JSON",type:"Text",strictType:!0,optional:!0},{name:"PIECES_JOINTES",title:"Pièces jointes",description:"Fichiers et images associés à la tâche",type:"Attachments",strictType:!0,optional:!0},{name:"LIENS",title:"Liens",description:"Liens avec texte d’affichage stockés en JSON",type:"Text",strictType:!0,optional:!0},{name:"COMMENTAIRES",title:"Commentaires",description:"Commentaires du widget stockés en JSON",type:"Text",strictType:!0,optional:!0},{name:"COULEUR",title:"Couleur de carte",description:"Code hexadécimal choisi depuis le widget",type:"Text",strictType:!0,optional:!0},{name:"CREE_PAR",title:"Créé par",type:"Any",optional:!0},{name:"CREE_LE",title:"Date de création",type:"DateTime",optional:!0},{name:"DERNIERE_MISE_A_JOUR",title:"Dernière mise à jour",description:"Date technique affichée dans le suivi",type:"DateTime",optional:!0},{name:"MODIFIE_PAR",title:"Modifié par",description:"Nom de la dernière personne ayant modifié la tâche",type:"Text",strictType:!0,optional:!0}]}),c.onRecords(se,{expandRefs:!1,keepEncoded:!1,mapRef:!0}),c.isLoaded().then(()=>{c.initDone=!0}),grist.on("message",async e=>{e.mappingsChange&&await en()}),Sr(),Yt()});async function _e(e=!1){const t=c?.map?.MEMBRES?"MEMBRES":c?.map?.RESPONSABLE?"RESPONSABLE":null;if(!t||!c?.col?.[t]){he();return}const n=c.col[t],r=`${t}:${n.type}:${n.visibleCol}`;if(!(!e&&de===r&&T.length>0))try{const s=await Je(n),i=s.dataColumns,o=be(i,["initiales","initiale","initials","abreviation","abréviation","sigle"])||Be(i,s.visibleColumnId),a=be(i,["email","e-mail","mail","courriel","adresseemail","adresse_email","adressemail","adresse_mail"]),l=o&&Array.isArray(s.table[o])?s.table[o]:[],d=a&&Array.isArray(s.table[a])?s.table[a]:[];T=s.ids.map((p,h)=>{const b=u(s.labels[h]).trim(),g=Gt(l[h])||He(b),le=Ut(d[h]);return{id:Number(p),label:b,initials:g,email:le,avatarColor:Ke(b||p)}}).filter(p=>Number.isInteger(p.id)&&p.id>0&&p.label&&p.label!=="#KeyError").sort((p,h)=>p.label.localeCompare(h.label,c.cultureFull,{sensitivity:"base"})),w=new Map(T.map(p=>[p.id,p])),de=r}catch(s){he(),console.error("Impossible de charger la table des membres :",s)}}function he(){T=[],w=new Map,de=null}async function Ue(e=!1){if(!c?.map?.ETIQUETTES||!c?.col?.ETIQUETTES){ge();return}const t=c.col.ETIQUETTES,n=`${t.type}:${t.visibleCol}`;if(!(!e&&me===n&&_.length>0))try{const r=await Je(t),s=r.dataColumns,i=be(s,["couleur","color","hex","codecouleur","code_couleur"])||Be(s,r.visibleColumnId),o=i&&Array.isArray(r.table[i])?r.table[i]:[];_=r.ids.map((a,l)=>{const d=u(r.labels[l]).trim(),h=S(o[l])||ze(d||a);return{id:Number(a),label:d,color:h,textColor:We(h)}}).filter(a=>Number.isInteger(a.id)&&a.id>0&&a.label&&a.label!=="#KeyError").sort((a,l)=>a.label.localeCompare(l.label,c.cultureFull,{sensitivity:"base"})),M=new Map(_.map(a=>[a.id,a])),me=n}catch(r){ge(),console.error("Impossible de charger la table des étiquettes :",r)}}function ge(){_=[],M=new Map,me=null}async function Je(e){const[t,n]=u(e?.type).split(":");if(t!=="RefList"||!n||!e?.visibleCol)throw new Error("La colonne doit être une Liste de références avec une colonne visible configurée.");const[r,s]=await Promise.all([grist.docApi.fetchTable(n),e.getMeta(e.visibleCol)]),i=s?.colId;if(!i||!Array.isArray(r?.id)||!Array.isArray(r?.[i]))throw new Error(`La colonne visible de la table ${n} est introuvable.`);const o=Object.keys(r).filter(a=>Array.isArray(r[a])&&a!=="id"&&a!=="manualSort"&&!a.startsWith("gristHelper_"));return{tableId:n,table:r,ids:r.id,labels:r[i],visibleColumnId:i,dataColumns:o}}function be(e,t){const n=new Set(t.map(je));return e.find(r=>n.has(je(r)))||null}function Be(e,t){const n=e.indexOf(t);return n>=0&&e[n+1]||null}function je(e){return u(e).normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]/gi,"").toLowerCase()}function Gt(e){return u(e).trim().replace(/\s+/g,"").slice(0,4).toUpperCase()}function He(e){const t=u(e).trim().split(/\s+/).filter(Boolean);return t.length===0?"?":t.length===1?t[0].slice(0,2).toUpperCase():`${t[0][0]||""}${t[t.length-1][0]||""}`.toUpperCase()}function Ke(e){let t=0;for(const r of u(e))t=(t<<5)-t+r.charCodeAt(0),t|=0;return`hsl(${Math.abs(t)%360} 58% 42%)`}function ze(e){let t=0;for(const r of u(e))t=(t<<5)-t+r.charCodeAt(0),t|=0;const n=Math.abs(t)%360;return Xt(n,62,72)}function Xt(e,t,n){t/=100,n/=100;const r=(1-Math.abs(2*n-1))*t,s=r*(1-Math.abs(e/60%2-1)),i=n-r/2;let o=0,a=0,l=0;return e<60?[o,a,l]=[r,s,0]:e<120?[o,a,l]=[s,r,0]:e<180?[o,a,l]=[0,r,s]:e<240?[o,a,l]=[0,s,r]:e<300?[o,a,l]=[s,0,r]:[o,a,l]=[r,0,s],`#${[o,a,l].map(d=>Math.round((d+i)*255).toString(16).padStart(2,"0")).join("")}`.toUpperCase()}function We(e){const t=S(e)||"#DDE3EA",n=parseInt(t.slice(1,3),16),r=parseInt(t.slice(3,5),16),s=parseInt(t.slice(5,7),16);return(.2126*n+.7152*r+.0722*s)/255>.58?"#1F2937":"#FFFFFF"}async function ve(e=!1){if(!(G&&!e)){pe=new Map,G=!0;try{const t=await grist.docApi.fetchTable("_grist_Attachments");(Array.isArray(t?.id)?t.id:[]).forEach((r,s)=>{const i=Number(r);if(!Number.isInteger(i)||i<=0)return;const o=u(t.fileName?.[s])||`Pièce jointe ${i}`,a=u(t.fileExt?.[s])||jt(o),l=u(t.fileType?.[s]),d=Number(t.fileSize?.[s])||0;pe.set(i,{id:i,fileName:o,fileExt:a,fileType:l,fileSize:d,imageWidth:Number(t.imageWidth?.[s])||0,imageHeight:Number(t.imageHeight?.[s])||0})})}catch(t){console.warn("Métadonnées des pièces jointes indisponibles :",t)}}}async function se(e){R=Array.isArray(e)?e:[],await Promise.all([_e(),Ue()]);const t=document.getElementById("conteneur-kanban");if(!t)return;t.innerHTML="";const n=await c.col.STATUT.getChoices();if(!Array.isArray(n)||n.length===0){t.innerHTML=`<div class="kanban-message">${f(y("No choice available in the Status column"))}</div>`;return}n.forEach((r,s)=>{const i=tn(r,s);i&&t.appendChild(i)}),R.forEach(r=>{const s=u(r.STATUT),i=Array.from(t.querySelectorAll(".contenu-colonne")).find(o=>o.dataset.statut===s);i&&i.insertBefore(nn(r),i.firstChild)}),on(),document.querySelectorAll(".colonne-kanban").forEach(Ce)}function Yt(){const e=document.getElementById("config-view");!e||e.dataset.autosaveInstalled==="true"||(e.dataset.autosaveInstalled="true",e.addEventListener("input",t=>{t.target.matches("input, textarea, select")&&Ee()}),e.addEventListener("change",t=>{t.target.matches("input, textarea, select")&&Ee()}),e.addEventListener("click",t=>{t.target.closest(".config-switch")&&window.setTimeout(Ee,0)}))}function Ee(){window.clearTimeout(xe),ie("saving","Sauvegarde…"),xe=window.setTimeout(Zt,350)}async function Zt(){if(!(fe||!c?._parameters||!c?._config||c._config.style.display==="none")){fe=!0;try{c.opt=await c.readOptionValues(c._parameters,c._config,c.opt),await grist.widgetApi.setOption("options",JSON.parse(JSON.stringify(c.opt))),await ye(),ie("saved","Enregistré"),window.setTimeout(()=>{ie("","")},1400)}catch(e){console.error("Impossible de sauvegarder automatiquement la configuration :",e),ie("error","Échec de la sauvegarde")}finally{fe=!1}}}function ie(e,t){const n=document.getElementById("config-view");if(!n||n.style.display==="none")return;let r=n.querySelector(".config-autosave-status");!r&&t&&(r=document.createElement("div"),r.className="config-autosave-status",r.setAttribute("aria-live","polite"),n.appendChild(r)),r&&(r.className=`config-autosave-status${e?` ${e}`:""}`,r.textContent=t,r.hidden=!t)}async function ye(){await c.isMapped(),await se(R)}async function en(){he(),ge(),G=!1,X=null,await Promise.all([_e(!0),Ue(!0)]),await se(R)}function tn(e,t){const n=Mt(t);if(n.hidecolumn)return null;const r=u(e),s=document.createElement("section");s.className=`colonne-kanban${!n.addbutton&&!c.opt.compact?" colonne-nobouton":""}`,s.id=r,localStorage.getItem(Pt(r))==="true"&&s.classList.add("collapsed");const i=c.col.STATUT.getColor(r)??ue,o=c.col.STATUT.getTextColor(r)??Fe,a=Hr(r);return s.innerHTML=`
        <div class="entete-colonne" style="background-color:${i};color:${o}">
            <div class="titre-statut">${f(r)} <span class="compteur-colonne">(0)</span></div>
            <div class="actions-colonne">
                ${n.addbutton&&!c.opt.readonly?`<button type="button" class="bouton-ajouter-entete ${c.opt.compact?"compact":""}" onclick="creerNouvelleTache(decodeURIComponent('${a}'))" aria-label="${m(y("Add a new task"))}">+</button>`:""}
                <button type="button" class="bouton-toggle" onclick="toggleColonne(this.closest('.colonne-kanban'), event)" aria-label="Replier ou déplier">⇄</button>
            </div>
        </div>
        ${n.addbutton&&!c.opt.readonly?`<button type="button" class="bouton-ajouter ${c.opt.compact?"compact":""}" onclick="creerNouvelleTache(decodeURIComponent('${a}'))">+ ${f(y("Add a new task"))}</button>`:""}
        <div class="contenu-colonne" data-statut="${m(r)}" data-isdone="${n.isdone?"true":"false"}"></div>
    `,s}function nn(e){const t=document.createElement("article");t.className=`carte${c.opt.rotation?"":" norotate"}${c.opt.compact?" compact":""}`,t.dataset.todoId=String(e.id),t.dataset.lastUpdate=Bt(e.DERNIERE_MISE_A_JOUR),t.dataset.deadline=Bt(e.DEADLINE),t.dataset.order=un(e.ORDRE),sn(t,e.COULEUR);const n=e.DEADLINE?Jt(e.DEADLINE):"",r=Ft(e),s=Ot(e),i=xt(e),a=q(e.CHECKLIST).flatMap(k=>k.items),l=a.filter(k=>k.done).length,d=ae(e.LIENS),h=C(e.PIECES_JOINTES).length+d.length,b=W(e.COMMENTAIRES).length,g=e.DESCRIPTION_DISPLAY?String(e.DESCRIPTION_DISPLAY):f(u(e.DESCRIPTION)||y("No description")),le=i.map(k=>rn(k)).join(""),zr=r.map(k=>Se(k,"member")).join(""),Wr=s.map(k=>Se(k,"responsable")).join(""),Qr=Le(e.STATUT),qe=Pe(e.DEADLINE),Vr=qe!==null&&qe<Date.now()&&qe<B.getTime(),Gr=c.opt.showlabels!==!1,Ht=c.opt.showmembers!==!1,Kt=c.opt.showresponsables!==!1,Xr=c.opt.showdeadline!==!1,zt=c.opt.showindicators!==!1,Yr=c.opt.showchecklistprogress!==!1,Zr=`
        ${Kt&&s.length?`<div class="card-people-group card-responsables" aria-label="Responsables">${Wr}</div>`:""}
        ${Ht&&r.length?`<div class="card-people-group card-membres" aria-label="Membres">${zr}</div>`:""}
    `,Wt=`
        ${Yr&&a.length?`<span title="${l} élément(s) terminé(s) sur ${a.length}">☑ ${l}/${a.length}</span>`:""}
        ${zt&&h?`<span title="${h} ressource(s)">📎 ${h}</span>`:""}
        ${zt&&b?`<span title="${b} commentaire(s)">💬 ${b}</span>`:""}
    `;return t.innerHTML=`
        ${Gr&&le?`<div class="etiquettes-list">${le}</div>`:""}
        <div class="description">${g}</div>
        ${Xr&&n?`<div class="deadline${Vr?" late":""} truncate">📅 ${f(n)}</div>`:""}
        ${Ht&&r.length||Kt&&s.length||Wt.trim()?`<div class="card-footer">
                <div class="card-indicators">${Wt}</div>
                <div class="card-people">${Zr}</div>
               </div>`:""}
        ${Qr?.isdone?`<div class="tampon-termine" style="color:${c.col.STATUT.getColor(e.STATUT)??ue};">${f(u(e.STATUT))}</div>`:""}
    `,t.addEventListener("click",()=>{grist.setCursorPos({rowId:e.id}),c.opt.hideedit||H(e)}),t.addEventListener("dblclick",()=>{grist.setCursorPos({rowId:e.id}),c.opt.gristeditcard?grist.commandApi.run("viewAsCard"):c.opt.hideedit||H(e)}),t}function Se(e,t="member"){const n=t==="responsable"?"Responsable":"Membre";return`
        <span
            class="responsable-avatar ${t==="responsable"?"responsable-avatar-principal":"membre-avatar"}"
            style="background:${m(e.avatarColor)}"
            title="${m(`${n} : ${e.label}`)}"
            aria-label="${m(`${n} : ${e.label}`)}"
        >${f(e.initials)}</span>
    `}function rn(e){return`
        <span
            class="etiquette-badge"
            style="background:${m(e.color)};color:${m(e.textColor)}"
            title="${m(e.label)}"
        >${f(e.label)}</span>
    `}function sn(e,t){const n=S(t)||S(c.opt?.defaultcardcolor)||"#FFFFD1";e.style.backgroundColor=n}function on(){document.querySelectorAll(".contenu-colonne").forEach(e=>{ln(e),!(c.opt.readonly||typeof Sortable!="function")&&new Sortable(e,{group:"kanban-todo",animation:150,ghostClass:"carte-fantome",chosenClass:"carte-selectionnee",onEnd:async t=>{const n=t.to.dataset.statut,r=t.from.dataset.statut,s=Number(t.item.dataset.todoId),i=Array.from(t.to.querySelectorAll(".carte")).map(a=>Number(a.dataset.todoId)),o=t.from===t.to?[]:Array.from(t.from.querySelectorAll(".carte")).map(a=>Number(a.dataset.todoId));try{n!==r&&await N(s,"STATUT",n),c.map?.ORDRE&&!c.col.ORDRE.getIsFormula()?await an(i,o):(await Qe(t.to),t.from!==t.to&&await Qe(t.from))}catch(a){console.error(y("Error during status update:"),a),await se(R)}Ce(t.to.closest(".colonne-kanban")),t.from!==t.to&&Ce(t.from.closest(".colonne-kanban"))}})})}async function an(e,t=[]){const n=[],r=new Set;[e,t].forEach(s=>{const i=O(s).map(Number).filter(a=>Number.isInteger(a)&&a>0),o=i.join(",");i.length>0&&!r.has(o)&&(r.add(o),n.push(i))});for(const s of n)await cn(s)}async function cn(e){if(!c.map?.ORDRE||c.col.ORDRE.getIsFormula())return;const t=e.map((n,r)=>{const s=(r+1)*1e3,i=v(n),o=F(n);return i&&(i.ORDRE=s),o&&(o.dataset.order=String(s)),c.formatRecord(n,{ORDRE:s})});t.length>0&&await c.updateRecords(t)}async function Qe(e){if(!c.map?.DEADLINE||!e)return;const n=Array.from(e.querySelectorAll(".carte")).filter(i=>{const o=Pe(i.dataset.deadline);return o===null||o>=B.getTime()});if(n.length===0)return;let r=B.getFullYear();const s=n.map(i=>{const o=`${r}-01-01`;return r+=1,i.dataset.deadline=o,c.formatRecord(i.dataset.todoId,{DEADLINE:o})});await c.updateRecords(s)}function ln(e){if(!e)return;const t=e.dataset.isdone==="true",n=Array.from(e.children);n.sort((r,s)=>{let i=0;return c.map?.ORDRE?i=Ve(r.dataset.order)-Ve(s.dataset.order):c.map?.DEADLINE&&(t?i=ce(s.dataset.lastUpdate,0)-ce(r.dataset.lastUpdate,0):i=ce(r.dataset.deadline,Number.MAX_SAFE_INTEGER)-ce(s.dataset.deadline,Number.MAX_SAFE_INTEGER)),i!==0?i:(Number(r.dataset.todoId)||0)-(Number(s.dataset.todoId)||0)}),n.forEach(r=>e.appendChild(r))}function un(e){const t=Number(e);return Number.isFinite(t)?String(t):""}function Ve(e){const t=Number(e);return Number.isFinite(t)?t:Number.MAX_SAFE_INTEGER}function Ce(e){if(!e)return;const t=e.querySelector(".contenu-colonne"),n=e.querySelector(".compteur-colonne");t&&n&&(n.textContent=`(${t.children.length})`)}async function H(e){const t=document.getElementById("popup-todo");if(!t)return;if(c.opt.readonly){Q();return}document.querySelector(".carte.active")?.classList.remove("active"),F(e.id)?.classList.add("active");const n=Le(e.STATUT),r=c.col.STATUT.getColor(e.STATUT)??ue,s=c.col.STATUT.getTextColor(e.STATUT)??Fe;t.style.setProperty("--task-status-color",r),t.style.setProperty("--task-status-text",s),t.style.borderLeftColor="transparent",t.dataset.statut=u(e.STATUT),t.dataset.isdone=n?.isdone?"true":"false",t.dataset.currentTodo=String(e.id);const i=t.querySelector(".popup-title"),o=t.querySelector(".popup-content"),a=t.querySelector(".popup-header"),l=t.querySelector(".bouton-fermer");if(i&&(i.textContent=""),a&&(a.style.backgroundColor="",a.style.color=""),l&&(l.style.color=""),!o)return;const d=c.map?.NOTES?c.col.NOTES.getIsFormula():!1,p=c.col.DESCRIPTION.getIsFormula(),h=yn(e),b=c.opt.showmetadata!==!1?Jr(e):"";let g=`
        <div class="task-detail-shell" data-row-id="${Number(e.id)}">
            <section class="task-title-zone">
                <div class="task-title-meta">
                    <span
                        class="task-status-pill"
                        style="background:${m(r)};color:${m(s)}"
                    >${f(u(e.STATUT))}</span>
                </div>
                <textarea
                    class="task-detail-title auto-expand"
                    aria-label="Nom de la tâche"
                    placeholder="Nom de la tâche"
                    oninput="ajusterTextarea(this)"
                    onchange="mettreAJourTitreFiche(${Number(e.id)}, this, event)"
                    ${p?"disabled":""}
                >${f(u(e.DESCRIPTION))}</textarea>
            </section>

            ${dn()}
            ${mn(e)}

            ${h?`<div id="task-dynamic-${Number(e.id)}" class="task-dynamic-content">${h}</div>`:`<div id="task-dynamic-${Number(e.id)}" class="task-dynamic-content" hidden></div>`}

            ${c.map?.NOTES?Mn(e,d):""}

            ${c.map?.COMMENTAIRES&&c.opt.showcomments!==!1?wr(e):""}

            ${b?`<div class="task-detail-metadata">${b}</div>`:""}

            <div class="popup-actions">
                <button
                    type="button"
                    class="popup-action-button bouton-supprimer"
                    onclick="supprimerTodo(${Number(e.id)}, event)"
                    title="${m(y("Remove the task"))}"
                    aria-label="${m(y("Remove the task"))}"
                >🗑️</button>
            </div>
        </div>
    `;o.innerHTML=g,o.querySelectorAll(".auto-expand").forEach(J),t.classList.add("visible"),ht(o),c.map?.PIECES_JOINTES&&C(e.PIECES_JOINTES).length>0&&await br(e.id)}function dn(e){const t=!!(c.map?.CHECKLIST&&!c.col.CHECKLIST.getIsFormula()),n=!!(c.map?.MEMBRES&&!c.col.MEMBRES.getIsFormula()||c.map?.RESPONSABLE&&!c.col.RESPONSABLE.getIsFormula()),r=!!(c.map?.PIECES_JOINTES&&!c.col.PIECES_JOINTES.getIsFormula()||c.map?.LIENS&&!c.col.LIENS.getIsFormula());return`
        <nav class="task-quick-actions" aria-label="Actions rapides">
            <button
                type="button"
                class="task-quick-button"
                data-panel-trigger="add"
                onclick="ouvrirPanneauFiche('add', event)"
            ><span>＋</span><strong>Ajouter</strong></button>

            <button
                type="button"
                class="task-quick-button"
                data-panel-trigger="checklist"
                onclick="ouvrirPanneauFiche('checklist', event)"
                ${t?"":"disabled"}
            ><span>☑</span><strong>Checklist</strong></button>

            <button
                type="button"
                class="task-quick-button"
                data-panel-trigger="people"
                onclick="ouvrirPanneauFiche('people', event)"
                ${n?"":"disabled"}
            ><span>👥</span><strong>Membres</strong></button>

            <button
                type="button"
                class="task-quick-button"
                data-panel-trigger="resources"
                onclick="ouvrirPanneauFiche('resources', event)"
                ${r?"":"disabled"}
            ><span>📎</span><strong>Pièce jointe</strong></button>
        </nav>
    `}function mn(e){return`<div class="task-action-panels">${[pn(),c.map?.ETIQUETTES?fn(e):"",c.map?.DEADLINE?hn(e):"",c.map?.CHECKLIST?gn(e):"",c.map?.MEMBRES||c.map?.RESPONSABLE?bn(e):"",c.map?.PIECES_JOINTES||c.map?.LIENS?vn(e):"",c.map?.COULEUR?En(e):""].filter(Boolean).join("")}</div>`}function pn(e){const t=[];return c.map?.ETIQUETTES&&t.push(["🏷️","Étiquettes","labels"]),c.map?.DEADLINE&&t.push(["📅","Dates","date"]),c.map?.CHECKLIST&&t.push(["☑","Checklist","checklist"]),(c.map?.MEMBRES||c.map?.RESPONSABLE)&&t.push(["👥","Membres","people"]),(c.map?.PIECES_JOINTES||c.map?.LIENS)&&t.push(["📎","Pièce jointe","resources"]),c.map?.COULEUR&&t.push(["🎨","Couleur de carte","color"]),`
        <section class="task-action-panel task-add-menu" data-panel="add" hidden>
            <div class="task-panel-heading">
                <div><strong>Ajouter à la carte</strong><span>Choisissez un élément</span></div>
                <button type="button" onclick="fermerPanneauxFiche(event)" aria-label="Fermer">×</button>
            </div>
            <div class="task-add-grid">
                ${t.map(([n,r,s])=>`
                    <button
                        type="button"
                        onclick="ouvrirPanneauFiche('${s}', event, true)"
                    ><span>${n}</span><strong>${f(r)}</strong></button>
                `).join("")||'<div class="section-empty">Aucun champ supplémentaire n’est mappé.</div>'}
            </div>
        </section>
    `}function fn(e){const t=new Set(Re(e)),n=c.col.ETIQUETTES.getIsFormula();return`
        <section class="task-action-panel" data-panel="labels" hidden>
            <div class="task-panel-heading">
                <div><strong>Étiquettes</strong><span>Sélectionnez les étiquettes actives</span></div>
                <button type="button" onclick="fermerPanneauxFiche(event)" aria-label="Fermer">×</button>
            </div>
            <div class="task-panel-search">
                <input type="search" placeholder="Rechercher une étiquette…" oninput="filtrerPanneauFiche(this)">
            </div>
            <div class="task-panel-options" data-row-id="${Number(e.id)}">
                ${_.map(r=>`
                    <label class="task-check-option" data-search="${m(r.label.toLocaleLowerCase(c.cultureFull))}">
                        <input
                            type="checkbox"
                            value="${r.id}"
                            ${t.has(r.id)?"checked":""}
                            onchange="enregistrerEtiquettesDepuisPanneau(${Number(e.id)}, this.closest('.task-action-panel'), event)"
                            ${n?"disabled":""}
                        >
                        <span class="task-option-label-color" style="background:${m(r.color)};color:${m(r.textColor)}">${f(r.label)}</span>
                    </label>
                `).join("")||'<div class="section-empty">Aucune étiquette disponible.</div>'}
            </div>
            <div class="task-panel-status section-status" aria-live="polite"></div>
        </section>
    `}function hn(e){const t=c.col.DEADLINE.getIsFormula();return`
        <section class="task-action-panel" data-panel="date" hidden>
            <div class="task-panel-heading">
                <div><strong>Date limite</strong><span>Ajoutez ou modifiez l’échéance de la carte</span></div>
                <button type="button" onclick="fermerPanneauxFiche(event)" aria-label="Fermer">×</button>
            </div>
            <div class="task-date-editor">
                <input
                    type="date"
                    value="${m(Br(e.DEADLINE))}"
                    onchange="mettreAJourProprieteFiche(${Number(e.id)}, 'DEADLINE', this.value || null, 'date', event)"
                    ${t?"disabled":""}
                >
                <button
                    type="button"
                    onclick="mettreAJourProprieteFiche(${Number(e.id)}, 'DEADLINE', null, 'date', event)"
                    ${t?"disabled":""}
                >Retirer la date</button>
            </div>
            <div class="task-panel-status section-status" aria-live="polite"></div>
        </section>
    `}function gn(e){const t=c.col.CHECKLIST.getIsFormula();return`
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
                    onkeydown="gererCreationChecklistClavier(${Number(e.id)}, this, event)"
                    ${t?"disabled":""}
                >
                <button
                    type="button"
                    onclick="ajouterChecklistAvecTitre(${Number(e.id)}, this, event)"
                    ${t?"disabled":""}
                >Ajouter la checklist</button>
            </div>
            <div class="task-panel-status section-status" aria-live="polite"></div>
        </section>
    `}function bn(e){const t=[];return c.map?.MEMBRES&&t.push(Ge(e,"MEMBRES","Membres de la carte",_r(e),c.col.MEMBRES.getIsFormula())),c.map?.RESPONSABLE&&t.push(Ge(e,"RESPONSABLE","Responsables de la carte",Ur(e),c.col.RESPONSABLE.getIsFormula())),`
        <section class="task-action-panel" data-panel="people" hidden>
            <div class="task-panel-heading">
                <div><strong>Membres et responsables</strong><span>Définissez qui participe et qui pilote la carte</span></div>
                <button type="button" onclick="fermerPanneauxFiche(event)" aria-label="Fermer">×</button>
            </div>
            <div class="task-panel-search">
                <input type="search" placeholder="Rechercher une personne…" oninput="filtrerPanneauFiche(this)">
            </div>
            <div class="task-people-editors">${t.join("")}</div>
            <div class="task-panel-status section-status" aria-live="polite"></div>
        </section>
    `}function Ge(e,t,n,r,s){const i=new Set(r);return`
        <div class="task-people-editor" data-mapping-key="${m(t)}" data-row-id="${Number(e.id)}">
            <h4>${f(n)}</h4>
            <div class="task-panel-options">
                ${T.map(o=>`
                    <label class="task-check-option task-person-option" data-search="${m(`${o.label} ${o.email||""}`.toLocaleLowerCase(c.cultureFull))}">
                        <input
                            type="checkbox"
                            value="${o.id}"
                            ${i.has(o.id)?"checked":""}
                            onchange="enregistrerPersonnesDepuisPanneau(${Number(e.id)}, '${E(t)}', this.closest('.task-people-editor'), event)"
                            ${s?"disabled":""}
                        >
                        <span class="responsable-option-avatar" style="background:${m(o.avatarColor)}">${f(o.initials)}</span>
                        <span class="task-person-name">${f(o.label)}</span>
                    </label>
                `).join("")||'<div class="section-empty">Aucun membre disponible.</div>'}
            </div>
        </div>
    `}function vn(e){const t=!!(c.map?.PIECES_JOINTES&&!c.col.PIECES_JOINTES.getIsFormula()),n=!!(c.map?.LIENS&&!c.col.LIENS.getIsFormula());return`
        <section class="task-action-panel" data-panel="resources" hidden>
            <div class="task-panel-heading">
                <div><strong>Pièce jointe ou lien</strong><span>Ajoutez un fichier Grist ou un lien personnalisé</span></div>
                <button type="button" onclick="fermerPanneauxFiche(event)" aria-label="Fermer">×</button>
            </div>

            <div class="resource-add-tabs">
                ${t?`
                    <label class="resource-file-drop">
                        <span>📤</span>
                        <strong>Ajouter un fichier</strong>
                        <small>Image, PDF, document… 50 Mo maximum</small>
                        <input
                            type="file"
                            multiple
                            onchange="ajouterPiecesJointes(${Number(e.id)}, this, event)"
                        >
                    </label>
                `:""}

                ${n?`
                    <div class="resource-link-form">
                        <label>
                            <span>Texte d’affichage</span>
                            <input type="text" class="resource-link-label" placeholder="Ex. Brief du projet">
                        </label>
                        <label>
                            <span>Adresse du lien</span>
                            <input type="url" class="resource-link-url" placeholder="https://…">
                        </label>
                        <button type="button" onclick="ajouterLienFiche(${Number(e.id)}, this, event)">Ajouter le lien</button>
                    </div>
                `:""}
            </div>
            <div class="task-panel-status section-status" id="attachments-status-${Number(e.id)}" aria-live="polite"></div>
        </section>
    `}function En(e){const t=S(e.COULEUR),n=t||S(c.opt?.defaultcardcolor)||"#FFFFD1",r=c.col.COULEUR.getIsFormula();return`
        <section class="task-action-panel" data-panel="color" hidden>
            <div class="task-panel-heading">
                <div><strong>Couleur de la carte</strong><span>Choisissez une couleur personnalisée</span></div>
                <button type="button" onclick="fermerPanneauxFiche(event)" aria-label="Fermer">×</button>
            </div>
            <div class="task-color-editor color-field" data-row-id="${Number(e.id)}">
                <input
                    type="color"
                    class="color-picker"
                    value="${m(n)}"
                    oninput="previsualiserCouleur(${Number(e.id)}, this.value, this)"
                    onchange="mettreAJourCouleurFiche(${Number(e.id)}, this.value, this, event)"
                    ${r?"disabled":""}
                >
                <input
                    type="text"
                    class="field-input color-value"
                    value="${m(t||"")}"
                    placeholder="#FFFFD1"
                    maxlength="7"
                    onchange="mettreAJourCouleurFiche(${Number(e.id)}, this.value, this, event)"
                    ${r?"disabled":""}
                >
                <button
                    type="button"
                    onclick="mettreAJourCouleurFiche(${Number(e.id)}, '', this, event)"
                    ${r?"disabled":""}
                >Réinitialiser</button>
            </div>
            <div class="task-panel-status section-status color-status" aria-live="polite"></div>
        </section>
    `}function yn(e){const t=[],n=xt(e),r=Ft(e),s=Ot(e),i=S(e.COULEUR),o=q(e.CHECKLIST),a=C(e.PIECES_JOINTES),l=ae(e.LIENS);n.length>0&&t.push(Sn(e,n)),e.DEADLINE&&t.push(Cn(e)),(r.length>0||s.length>0)&&t.push(wn(e,r,s)),i&&t.push(An(e,i));const d=[];return t.length>0&&d.push(`<div class="task-property-grid">${t.join("")}</div>`),o.length>0&&c.opt.showchecklist!==!1&&d.push(nr(e,o)),(a.length>0||l.length>0)&&c.opt.showattachments!==!1&&d.push(pr(e,a,l)),d.join("")}function Sn(e,t){return`
        <section class="task-property-card task-label-property">
            <div class="task-property-heading">
                <span>Étiquettes</span>
                <button type="button" onclick="ouvrirPanneauFiche('labels', event, true)" aria-label="Ajouter une étiquette">+</button>
            </div>
            <div class="task-property-content task-label-chips">
                ${t.map(n=>`
                    <span class="etiquette-active" style="background:${m(n.color)};color:${m(n.textColor)}">
                        <span>${f(n.label)}</span>
                        ${c.col.ETIQUETTES.getIsFormula()?"":`
                            <button type="button" onclick="retirerEtiquetteFiche(${Number(e.id)}, ${Number(n.id)}, event)" aria-label="Retirer ${m(n.label)}">×</button>
                        `}
                    </span>
                `).join("")}
            </div>
        </section>
    `}function Cn(e){return`
        <section class="task-property-card task-date-property" onclick="ouvrirPanneauFiche('date', event, true)">
            <div class="task-property-heading"><span>Date limite</span><button type="button" aria-label="Modifier la date">✎</button></div>
            <div class="task-property-content"><strong>📅 ${f(Jt(e.DEADLINE))}</strong></div>
        </section>
    `}function wn(e,t,n){const r=(s,i,o)=>i.length?`
        <div class="task-people-summary-group">
            <span>${f(s)}</span>
            <div class="task-people-summary-avatars">
                ${i.map(a=>Se(a,o)).join("")}
            </div>
        </div>
    `:"";return`
        <section class="task-property-card task-people-property">
            <div class="task-property-heading"><span>Membres</span><button type="button" onclick="ouvrirPanneauFiche('people', event, true)" aria-label="Modifier les membres">✎</button></div>
            <div class="task-property-content task-people-summary">
                ${r("Responsables",n,"responsable")}
                ${r("Membres",t,"member")}
            </div>
        </section>
    `}function An(e,t){return`
        <section class="task-property-card task-color-property" onclick="ouvrirPanneauFiche('color', event, true)">
            <div class="task-property-heading"><span>Couleur</span><button type="button" aria-label="Modifier la couleur">✎</button></div>
            <div class="task-property-content task-color-summary">
                <span style="background:${m(t)}"></span>
                <strong>${f(t)}</strong>
            </div>
        </section>
    `}function Xe(e,t,n=!1){t?.preventDefault(),t?.stopPropagation();const r=document.getElementById("popup-todo"),s=r?.querySelector(`.task-action-panel[data-panel="${e}"]`);if(!r||!s)return;const i=!s.hidden;r.querySelectorAll(".task-action-panel").forEach(o=>{o.hidden=!0}),r.querySelectorAll(".task-quick-button").forEach(o=>{o.classList.remove("active")}),(!i||n)&&(s.hidden=!1,r.querySelector(`[data-panel-trigger="${e}"]`)?.classList.add("active"),window.setTimeout(()=>{s.querySelector('input:not([type="checkbox"]):not([type="file"]), textarea, button')?.focus()},0))}function Ye(e){e?.preventDefault(),e?.stopPropagation();const t=document.getElementById("popup-todo");t?.querySelectorAll(".task-action-panel").forEach(n=>{n.hidden=!0}),t?.querySelectorAll(".task-quick-button").forEach(n=>{n.classList.remove("active")})}function $n(e){const t=e.closest(".task-action-panel"),n=u(e.value).trim().toLocaleLowerCase(c.cultureFull);t?.querySelectorAll("[data-search]").forEach(r=>{r.hidden=n!==""&&!u(r.dataset.search).includes(n)})}async function A(e,t=""){const n=document.getElementById("popup-todo"),s=n?.querySelector(".popup-content")?.scrollTop||0,i=v(e);if(!i)return;await H(i);const o=n?.querySelector(".popup-content");o&&(o.scrollTop=s),t&&Xe(t,null,!0)}async function Nn(e,t,n){const r=u(t?.value).trim();await N(e,"DESCRIPTION",r,n);const s=F(e)?.querySelector(".description");s&&(s.textContent=r||y("No description"))}async function kn(e,t,n,r,s){const o=s?.target?.closest(".task-action-panel")?.querySelector(".task-panel-status");try{o&&(o.className="task-panel-status section-status saving",o.textContent="Enregistrement…"),await N(e,t,n,s),await A(e,r)}catch{o&&(o.className="task-panel-status section-status error",o.textContent="Impossible d’enregistrer.")}}async function Tn(e,t,n){n?.stopPropagation();const r=t?.querySelector(".task-panel-status"),s=Array.from(t.querySelectorAll('input[type="checkbox"]:checked')).map(i=>Number(i.value)).filter(i=>M.has(i));try{r&&(r.className="task-panel-status section-status saving",r.textContent="Enregistrement…"),await z(e,"ETIQUETTES",s),Ae(e,s),await A(e,"labels")}catch{r&&(r.className="task-panel-status section-status error",r.textContent="Impossible d’enregistrer les étiquettes.")}}async function In(e,t,n){n?.preventDefault(),n?.stopPropagation();const r=v(e),s=Re(r).filter(i=>i!==Number(t));await z(e,"ETIQUETTES",s),Ae(e,s),await A(e)}async function Ln(e,t,n,r){r?.stopPropagation();const i=n.closest(".task-action-panel")?.querySelector(".task-panel-status"),o=Array.from(n.querySelectorAll('input[type="checkbox"]:checked')).map(a=>Number(a.value)).filter(a=>w.has(a));try{i&&(i.className="task-panel-status section-status saving",i.textContent="Enregistrement…"),await z(e,t,o),ot(e,t,o),await A(e,"people")}catch{i&&(i.className="task-panel-status section-status error",i.textContent="Impossible d’enregistrer les personnes.")}}function Dn(e,t,n){n.key==="Enter"&&(n.preventDefault(),Ze(e,t,n))}async function Ze(e,t,n){n?.preventDefault(),n?.stopPropagation();const r=t.closest(".task-action-panel"),s=r?.querySelector(".new-checklist-title"),i=r?.querySelector(".task-panel-status"),o=u(s?.value).trim();if(!o){i&&(i.className="task-panel-status section-status error",i.textContent="Saisissez un titre."),s?.focus();return}await D(e,a=>[...a,{id:x(),title:o,items:[],createdAt:new Date().toISOString()}]),await A(e)}async function Rn(e,t,n,r){const i=n?.closest(".task-action-panel")?.querySelector(".task-panel-status"),o=u(t).trim(),a=S(o);if(o&&!a){i&&(i.className="task-panel-status section-status error",i.textContent="Utilisez un code hexadécimal valide.");return}try{i&&(i.className="task-panel-status section-status saving",i.textContent="Enregistrement…"),await N(e,"COULEUR",a||null,r);const l=F(e);l&&(l.style.backgroundColor=a||S(c.opt?.defaultcardcolor)||"#FFFFD1"),await A(e,"color")}catch{i&&(i.className="task-panel-status section-status error",i.textContent="Impossible d’enregistrer la couleur.")}}function Mn(e,t){const n=Number(e.id),r=On(e.NOTES),s=rt(r).trim().length>0,i=t?"disabled":"",o=[["bold","<strong>B</strong>","Gras"],["italic","<em>I</em>","Italique"],["underline","<u>U</u>","Souligné"],["strikeThrough","<s>S</s>","Barré"],["insertUnorderedList","• Liste","Liste à puces"],["insertOrderedList","1. Liste","Liste numérotée"],["insertHorizontalRule","―","Ligne de séparation"],["removeFormat","Tx","Effacer la mise en forme"],["undo","↶","Annuler"],["redo","↷","Rétablir"]].map(([a,l,d])=>`
        <button
            type="button"
            class="notes-tool"
            data-command="${a}"
            onmousedown="event.preventDefault()"
            onclick="appliquerCommandeNotes(this, '${a}', null, event)"
            title="${m(d)}"
            aria-label="${m(d)}"
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
                class="notes-display${s?"":" empty"}"
                tabindex="0"
            >${s?r:"Aucune note pour cette tâche."}</div>

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

                    ${o}

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
    `}function Pn(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".notes-field"),r=n?.querySelector(".notes-edit-panel"),s=n?.querySelector(".notes-display"),i=n?.querySelector(".notes-editor");!n||!r||!s||!i||n.dataset.disabled==="true"||(n._originalNotesHtml=K(i.innerHTML),n.classList.add("is-editing"),n.classList.remove("is-dirty"),s.hidden=!0,r.hidden=!1,e.hidden=!0,document.execCommand("defaultParagraphSeparator",!1,"p"),i.focus(),jn(i),U(i),P(Number(n.dataset.rowId),"",""))}function qn(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".notes-field"),r=n?.querySelector(".notes-editor");!n||!r||(r.innerHTML=n._originalNotesHtml||"",et(n,!1))}async function Fn(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".notes-field"),r=n?.querySelector(".notes-editor"),s=Number(n?.dataset?.rowId);if(!(!n||!r||!Number.isInteger(s)||s<=0)){e.disabled=!0;try{const i=await Hn(s,r);n._originalNotesHtml=i,et(n,!0)}finally{e.disabled=!1}}}function et(e,t){const n=e.querySelector(".notes-edit-panel"),r=e.querySelector(".notes-display"),s=e.querySelector(".notes-editor"),i=e.querySelector(".notes-edit-button");if(t&&r&&s){const o=K(s.innerHTML).trim(),a=rt(o).trim().length>0;r.innerHTML=a?o:"Aucune note pour cette tâche.",r.classList.toggle("empty",!a)}e.classList.remove("is-editing","is-dirty"),n&&(n.hidden=!0),r&&(r.hidden=!1),i&&(i.hidden=!1),P(Number(e.dataset.rowId),"","")}function On(e){const t=u(e).trim();if(!t)return"";const r=/<\/?[a-z][\s\S]*>/i.test(t)?t:f(t).replace(/\r?\n/g,"<br>");return K(r)}function K(e){const t=document.createElement("template");t.innerHTML=u(e);const n=new Set(["B","STRONG","I","EM","U","S","STRIKE","A","UL","OL","LI","P","DIV","BR","BLOCKQUOTE","H2","H3","SPAN","CODE","PRE","HR","MARK"]),r=new Set(["SCRIPT","STYLE","IFRAME","OBJECT","EMBED","FORM","INPUT","BUTTON","SVG","MATH","META","LINK"]),s=i=>{Array.from(i.childNodes).forEach(o=>{if(o.nodeType===Node.ELEMENT_NODE){if(r.has(o.tagName)){o.remove();return}if(!n.has(o.tagName)){s(o),o.replaceWith(...Array.from(o.childNodes));return}if(Array.from(o.attributes).forEach(a=>{o.tagName==="A"&&["href","target","rel"].includes(a.name.toLowerCase())||o.removeAttribute(a.name)}),o.tagName==="A"){const a=nt(o.getAttribute("href"));if(!a){o.replaceWith(...Array.from(o.childNodes));return}o.setAttribute("href",a),o.setAttribute("target","_blank"),o.setAttribute("rel","noopener noreferrer")}s(o)}else o.nodeType!==Node.TEXT_NODE&&o.remove()})};return s(t.content),t.innerHTML}function xn(e,t){t?.preventDefault(),t?.stopPropagation();const r=e.closest(".notes-field")?.querySelector(".notes-editor");!r||r.contentEditable!=="true"||(r.focus(),document.execCommand("formatBlock",!1,e.value||"p"),I(r),U(r))}function _n(e,t,n,r){r?.preventDefault(),r?.stopPropagation();const i=e.closest(".notes-field")?.querySelector(".notes-editor");!i||i.contentEditable!=="true"||(i.focus(),document.execCommand(t,!1,n),I(i),U(i))}function Un(e,t,n){n?.preventDefault(),n?.stopPropagation();const s=e.closest(".notes-field")?.querySelector(".notes-editor"),i=window.getSelection();if(!s||s.contentEditable!=="true"||!i||i.rangeCount===0)return;s.focus();const o=i.getRangeAt(0);if(!s.contains(o.commonAncestorContainer))return;const a=o.toString(),l=t==="mark"?"mark":"code";a?document.execCommand("insertHTML",!1,`<${l}>${f(a)}</${l}>`):document.execCommand("insertHTML",!1,`<${l}>&#8203;</${l}>`),I(s),U(s)}function tt(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".notes-field"),r=n?.querySelector(".notes-editor");if(!r||r.contentEditable!=="true")return;r.focus();const s=window.prompt("Adresse du lien :","https://");if(s===null)return;const i=nt(s);if(!i){P(Number(n.dataset.rowId),"error","Adresse de lien invalide.");return}const o=window.getSelection();!o||o.isCollapsed?document.execCommand("insertHTML",!1,`<a href="${m(i)}" target="_blank" rel="noopener noreferrer">${f(i)}</a>`):document.execCommand("createLink",!1,i),I(r),U(r)}function nt(e){const t=u(e).trim();if(!t)return"";const n=/^(https?:|mailto:|tel:)/i.test(t)?t:`https://${t}`;try{const r=new URL(n);return["http:","https:","mailto:","tel:"].includes(r.protocol)?r.href:""}catch{return""}}function Jn(e,t){if(!t?.clipboardData)return;t.preventDefault();const n=t.clipboardData.getData("text/html"),r=t.clipboardData.getData("text/plain"),s=n?K(n):f(r).replace(/\r?\n/g,"<br>");document.execCommand("insertHTML",!1,s),I(e)}function I(e){const t=e?.closest(".notes-field");t&&(t.classList.add("is-dirty"),P(Number(t.dataset.rowId),"saving","Modifications non enregistrées"))}function U(e){const t=e?.closest(".notes-field");if(!t||!t.classList.contains("is-editing"))return;t.querySelectorAll(".notes-tool[data-command]").forEach(r=>{let s=!1;try{s=document.queryCommandState(r.dataset.command)}catch{s=!1}r.classList.toggle("active",s),r.setAttribute("aria-pressed",s?"true":"false")});const n=t.querySelector(".notes-format-select");if(n){let r="p";try{r=u(document.queryCommandValue("formatBlock")).replace(/[<>]/g,"").toLowerCase()||"p"}catch{r="p"}Array.from(n.options).some(s=>s.value===r)?n.value=r:n.value="p"}}function Bn(e,t){if(!(t.ctrlKey||t.metaKey))return;const n=t.key.toLowerCase();if(n==="k"){t.preventDefault();const r=e.closest(".notes-field")?.querySelector(".notes-tool-link");r&&tt(r,t)}t.shiftKey&&n==="7"&&(t.preventDefault(),document.execCommand("insertOrderedList"),I(e)),t.shiftKey&&n==="8"&&(t.preventDefault(),document.execCommand("insertUnorderedList"),I(e))}function jn(e){const t=document.createRange(),n=window.getSelection();t.selectNodeContents(e),t.collapse(!1),n?.removeAllRanges(),n?.addRange(t)}function rt(e){const t=document.createElement("template");return t.innerHTML=u(e),t.content.textContent||""}async function Hn(e,t){if(!t)return"";const n=Number(e),r=K(t.innerHTML).trim(),s=re.get(n)||Promise.resolve();P(n,"saving","Enregistrement…");const i=s.catch(()=>{}).then(()=>N(n,"NOTES",r||null)).then(()=>(t.innerHTML=r,P(n,"saved","Enregistré"),r)).catch(o=>{throw P(n,"error","Échec de l’enregistrement"),console.error("Erreur pendant l’enregistrement des notes :",o),o}).finally(()=>{re.get(n)===i&&re.delete(n)});return re.set(n,i),i}function P(e,t,n){const r=document.getElementById(`notes-status-${Number(e)}`);r&&(r.className=`section-status notes-status${t?` ${t}`:""}`,r.textContent=n)}function S(e){const t=u(e).trim();if(!t)return"";const n=t.startsWith("#")?t:`#${t}`;return/^#[0-9a-f]{3}$/i.test(n)?`#${n[1]}${n[1]}${n[2]}${n[2]}${n[3]}${n[3]}`.toUpperCase():/^#[0-9a-f]{6}$/i.test(n)?n.toUpperCase():""}function Kn(e,t,n){const r=S(t);if(!r)return;const s=F(e);s&&(s.style.backgroundColor=r);const i=n?.closest(".color-field");if(i){const o=i.querySelector(".color-picker"),a=i.querySelector(".color-value");o&&n!==o&&(o.value=r),a&&n!==a&&(a.value=r)}}async function st(e,t,n,r){r?.stopPropagation();const s=n?.closest(".color-field"),i=s?.querySelector(".color-status"),o=u(t).trim(),a=S(o);if(o&&!a){i&&(i.className="section-status color-status error",i.textContent="Utilisez un code hexadécimal, par exemple #FFFFD1.");return}try{i&&(i.className="section-status color-status saving",i.textContent="Enregistrement…"),await N(e,"COULEUR",a||null,r);const l=F(e);if(l&&(a?l.style.backgroundColor=a:l.style.backgroundColor=S(c.opt?.defaultcardcolor)||"#FFFFD1"),s){const d=s.querySelector(".color-picker"),p=s.querySelector(".color-value");d&&(d.value=a||S(c.opt?.defaultcardcolor)||"#FFFFD1"),p&&(p.value=a||"")}i&&(i.className="section-status color-status saved",i.textContent="Enregistré",window.setTimeout(()=>{i.className="section-status color-status",i.textContent=""},1200))}catch(l){i&&(i.className="section-status color-status error",i.textContent="Impossible d’enregistrer la couleur."),console.error("Erreur pendant l’enregistrement de la couleur :",l)}}function zn(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".color-field"),r=Number(n?.dataset?.rowId);if(!n||!Number.isInteger(r)||r<=0)return;const s=n.querySelector(".color-value");s&&(s.value=""),st(r,"",e,t)}function Wn(e,t,n){const r=V(e);return r.length===0?"Choisir…":r.length===1?r[0]:`${r.length} ${n||`${t}s`}`}function Qn(e){const t=e.closest(".multi-dropdown");if(!t)return;const n=e.value.trim().toLocaleLowerCase(c.cultureFull);t.querySelectorAll(".multi-option").forEach(r=>{const s=r.querySelector('input[type="checkbox"]'),i=r.dataset.hideWhenSelected==="true"&&s?.checked,o=n!==""&&!u(r.dataset.search).includes(n);r.hidden=!!(i||o)}),at(t)}function Vn(e,t,n,r,s){s?.preventDefault(),s?.stopPropagation();const i=e.closest(".multi-dropdown");i&&(i.querySelectorAll('input[type="checkbox"]:checked').forEach(o=>{o.checked=!1}),it(Number(i.dataset.rowId),t,i,n,r,s))}async function it(e,t,n,r,s,i){i?.stopPropagation();const o=Number(e||n?.dataset?.rowId);if(!Number.isInteger(o)||o<=0||!n)return;const a=Array.from(n.querySelectorAll('input[type="checkbox"]:checked')).map(g=>Number(g.value)).filter(g=>Number.isInteger(g)&&g>0&&w.has(g)),l=a.map(g=>w.get(g)?.label).filter(Boolean),d=n.querySelector("summary");d&&(d.textContent=Wn(l,r,s)),L(n,"saving","Enregistrement…");const p=`${t}:${o}`,b=(Y.get(p)||Promise.resolve()).catch(()=>{}).then(()=>z(o,t,a)).then(()=>{ot(o,t,a),L(n,"saved","Enregistré"),window.setTimeout(()=>L(n,"",""),1200)}).catch(g=>{L(n,"error","Échec de l’enregistrement"),console.error(`Erreur lors de l’enregistrement de ${t} :`,g)}).finally(()=>{Y.get(p)===b&&Y.delete(p)});Y.set(p,b),await b}function ot(e,t,n){const r=v(e);r&&(r[`${t}_id`]=[...n],r[t]=n.map(s=>w.get(s)?.label).filter(Boolean))}function Gn(e,t,n){return e.length?e.map(r=>`
        <span
            class="etiquette-active"
            style="background:${m(r.color)};color:${m(r.textColor)}"
            title="${m(r.label)}"
        >
            <span>${f(r.label)}</span>
            ${`
                <button
                    type="button"
                    onclick="retirerEtiquetteActive(
                        ${Number(t)},
                        ${Number(r.id)},
                        this,
                        event
                    )"
                    title="Retirer ${m(r.label)}"
                    aria-label="Retirer ${m(r.label)}"
                >×</button>
            `}
        </span>
    `).join(""):'<span class="etiquettes-empty">Aucune étiquette</span>'}function Xn(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".multi-dropdown");n&&(n.querySelectorAll('input[type="checkbox"]:checked').forEach(r=>{r.checked=!1}),we(Number(n.dataset.rowId),n,t))}function Yn(e,t,n,r){r?.preventDefault(),r?.stopPropagation();const i=n.closest(".field-etiquettes")?.querySelector(".etiquettes-dropdown");if(!i)return;const o=i.querySelector(`input[type="checkbox"][value="${Number(t)}"]`);o&&(o.checked=!1),we(Number(e),i,r)}async function we(e,t,n){n?.stopPropagation();const r=Number(e||t?.dataset?.rowId);if(!Number.isInteger(r)||r<=0||!t)return;const s=Array.from(t.querySelectorAll('input[type="checkbox"]:checked')).map(a=>Number(a.value)).filter(a=>Number.isInteger(a)&&a>0&&M.has(a));Zn(t,r,s),L(t,"saving","Enregistrement…");const o=(Z.get(r)||Promise.resolve()).catch(()=>{}).then(()=>z(r,"ETIQUETTES",s)).then(()=>{Ae(r,s),L(t,"saved","Enregistré"),window.setTimeout(()=>L(t,"",""),1200)}).catch(a=>{L(t,"error","Échec de l’enregistrement"),console.error("Erreur lors de l’enregistrement des étiquettes :",a)}).finally(()=>{Z.get(r)===o&&Z.delete(r)});Z.set(r,o),await o}function Zn(e,t,n){const s=e.closest(".field-etiquettes")?.querySelector(".etiquettes-actives"),i=new Set(n),o=n.map(a=>M.get(a)).filter(Boolean);s&&(s.innerHTML=Gn(o,t)),e.querySelectorAll(".etiquette-option").forEach(a=>{const l=a.querySelector('input[type="checkbox"]'),d=i.has(Number(l?.value));l&&(l.checked=d),a.hidden=d}),at(e)}function at(e){if(!e?.classList.contains("etiquettes-dropdown"))return;const t=e.querySelector(".multi-all-selected"),n=Array.from(e.querySelectorAll(".etiquette-option")).filter(r=>!r.hidden);t&&(t.hidden=n.length>0)}function Ae(e,t){const n=v(e);n&&(n.ETIQUETTES_id=[...t],n.ETIQUETTES=t.map(r=>M.get(r)?.label).filter(Boolean))}async function z(e,t,n){const r=c.map?.[t];if(!r||Array.isArray(r))throw new Error(`La colonne ${t} n’est pas correctement mappée.`);const s=[...new Set(O(n).map(Number).filter(d=>Number.isInteger(d)&&d>0))],i=await grist.getTable().getTableId(),o=s.length>0?["L",...s]:null;await grist.docApi.applyUserActions([["UpdateRecord",i,Number(e),{[r]:o}]]);const a=await ct(e,r),l=er(a);if(!tr(s,l))throw new Error(`Vérification d’écriture échouée pour ${t}. Valeur envoyée : ${JSON.stringify(o)} ; valeur relue : ${JSON.stringify(a)}`);await Dt(e)}async function ct(e,t){const n=await grist.getTable().getTableId(),r=await grist.docApi.fetchTable(n),s=O(r?.id).findIndex(i=>Number(i)===Number(e));if(s<0)throw new Error(`Ligne ${e} introuvable dans la table ${n}.`);return r?.[t]?.[s]}function er(e){return e==null||e===""?[]:!Array.isArray(e)||e[0]==="E"?[]:e[0]==="L"?C(e.slice(1)):e[0]==="r"?C(e[2]):C(e)}function tr(e,t){const n=[...new Set(e.map(Number))].sort((s,i)=>s-i),r=[...new Set(t.map(Number))].sort((s,i)=>s-i);return n.length===r.length&&n.every((s,i)=>s===r[i])}function L(e,t,n){const r=e?.querySelector(".multi-status");r&&(r.className=`multi-status${t?` ${t}`:""}`,r.textContent=n)}function q(e){const t=u(e).trim();if(!t)return[];try{const n=JSON.parse(t);if(!Array.isArray(n))return[];if(n.length>0&&n.every(s=>!Array.isArray(s?.items))){const s=n.map((i,o)=>ut(i,o));return s.length>0?[{id:"legacy-checklist",title:"Checklist",items:s,createdAt:""}]:[]}return n.map((s,i)=>lt(s,i)).filter(s=>s.title||s.items.length>0)}catch(n){return console.warn("Checklists illisibles, valeur ignorée :",n),[]}}function lt(e,t=0){const n=Array.isArray(e?.items)?e.items.map((r,s)=>ut(r,s)):[];return{id:u(e?.id)||`checklist-${t}-${x()}`,title:u(e?.title||e?.name).trim()||`Checklist ${t+1}`,items:n,createdAt:u(e?.createdAt)}}function ut(e,t=0){return{id:u(e?.id)||`item-${t}-${x()}`,text:u(e?.text).trim(),done:!!e?.done,memberIds:[...new Set(C(e?.memberIds||e?.members||[]))],dueDate:dt(e?.dueDate),createdAt:u(e?.createdAt)}}function dt(e){const t=u(e).trim();return/^\d{4}-\d{2}-\d{2}$/.test(t)?t:""}function nr(e,t=q(e.CHECKLIST)){if(!t.length)return"";const n=c.col.CHECKLIST.getIsFormula();return`
        <div class="checklists-stack" data-row-id="${Number(e.id)}">
            ${t.map(r=>mt(r,e.id,n)).join("")}
        </div>
    `}function mt(e,t,n){const r=e.items.filter(i=>i.done).length,s=e.items.length>0?Math.round(r/e.items.length*100):0;return`
        <section
            class="detail-section checklist-section"
            data-row-id="${Number(t)}"
            data-checklist-id="${m(e.id)}"
            data-disabled="${n?"true":"false"}"
        >
            <div class="checklist-title-row">
                <div class="checklist-title-main">
                    <span class="checklist-title-icon">☑</span>
                    <input
                        type="text"
                        class="checklist-title-input"
                        value="${m(e.title)}"
                        onchange="renommerChecklist(${Number(t)}, '${E(e.id)}', this.value, event)"
                        ${n?"disabled":""}
                    >
                </div>
                <div class="checklist-title-actions">
                    <span class="checklist-progress-percent">${s}%</span>
                    ${n?"":`
                        <button
                            type="button"
                            class="checklist-delete-list"
                            onclick="supprimerChecklist(${Number(t)}, '${E(e.id)}', event)"
                            title="Supprimer cette checklist"
                            aria-label="Supprimer cette checklist"
                        >×</button>
                    `}
                </div>
            </div>

            <div class="checklist-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${s}">
                <span style="width:${s}%"></span>
            </div>

            <div class="checklist-subtitle">
                <span>${r}/${e.items.length} terminé(s)</span>
            </div>

            <div
                class="checklist-items"
                data-row-id="${Number(t)}"
                data-checklist-id="${m(e.id)}"
            >
                ${e.items.length?e.items.map(i=>rr(i,e.id,t,n)).join(""):'<div class="section-empty checklist-empty">Cette checklist est vide.</div>'}
            </div>

            ${n?"":`
                <div class="checklist-add">
                    <input
                        type="text"
                        class="checklist-add-input"
                        placeholder="Ajouter un élément…"
                        onkeydown="gererAjoutItemChecklistClavier(${Number(t)}, '${E(e.id)}', this, event)"
                    >
                    <button
                        type="button"
                        onclick="ajouterItemChecklist(${Number(t)}, '${E(e.id)}', this, event)"
                    >Ajouter</button>
                </div>
            `}

            <div
                id="checklist-status-${Number(t)}-${gt(e.id)}"
                class="section-status checklist-status"
                aria-live="polite"
            ></div>
        </section>
    `}function rr(e,t,n,r){const s=e.memberIds.map(o=>w.get(o)).filter(Boolean),i=!e.done&&e.dueDate&&new Date(`${e.dueDate}T23:59:59`).getTime()<Date.now();return`
        <article
            class="checklist-item${e.done?" done":""}${i?" overdue":""}"
            data-item-id="${m(e.id)}"
        >
            ${r?"":`
                <button type="button" class="checklist-drag-handle" title="Déplacer" aria-label="Déplacer">⋮⋮</button>
            `}

            <label class="checklist-check">
                <input
                    type="checkbox"
                    ${e.done?"checked":""}
                    onchange="mettreAJourItemChecklist(${Number(n)}, '${E(t)}', '${E(e.id)}', 'done', this.checked, this, event)"
                    ${r?"disabled":""}
                >
                <span aria-hidden="true"></span>
            </label>

            <div class="checklist-item-content">
                <textarea
                    class="checklist-item-text auto-expand"
                    rows="1"
                    oninput="ajusterTextarea(this)"
                    onchange="mettreAJourItemChecklist(${Number(n)}, '${E(t)}', '${E(e.id)}', 'text', this.value, this, event)"
                    ${r?"disabled":""}
                >${f(e.text)}</textarea>

                <div class="checklist-item-meta">
                    <label class="checklist-due${i?" overdue":""}" title="${i?"Échéance dépassée":"Date limite"}">
                        <span>📅</span>
                        <input
                            type="date"
                            value="${m(e.dueDate)}"
                            onchange="mettreAJourItemChecklist(${Number(n)}, '${E(t)}', '${E(e.id)}', 'dueDate', this.value, this, event)"
                            ${r?"disabled":""}
                        >
                    </label>

                    ${sr(e,t,n,s,r)}
                </div>
            </div>

            ${r?"":`
                <button
                    type="button"
                    class="checklist-delete"
                    onclick="supprimerItemChecklist(${Number(n)}, '${E(t)}', '${E(e.id)}', event)"
                    title="Supprimer l’élément"
                    aria-label="Supprimer l’élément"
                >×</button>
            `}
        </article>
    `}function sr(e,t,n,r,s){const i=new Set(e.memberIds),o=pt(r);return s?`<div class="checklist-assignees readonly">${o}</div>`:`
        <details class="checklist-assignees">
            <summary>${o}</summary>
            <div class="checklist-assignees-menu">
                <div class="multi-toolbar">
                    <input type="search" class="multi-search" placeholder="Rechercher…" oninput="filtrerOptionsChecklist(this)" onclick="event.stopPropagation()">
                </div>
                <div class="multi-options">
                    ${T.map(a=>`
                        <label class="multi-option checklist-person-option" data-search="${m(a.label.toLocaleLowerCase(c.cultureFull))}">
                            <input
                                type="checkbox"
                                value="${a.id}"
                                ${i.has(a.id)?"checked":""}
                                onchange="mettreAJourAssignationsItemChecklist(${Number(n)}, '${E(t)}', '${E(e.id)}', this.closest('.checklist-assignees'), event)"
                            >
                            <span class="responsable-option-avatar" style="background:${m(a.avatarColor)}">${f(a.initials)}</span>
                            <span class="responsable-option-name">${f(a.label)}</span>
                        </label>
                    `).join("")||'<div class="multi-empty">Aucun membre disponible</div>'}
                </div>
            </div>
        </details>
    `}function pt(e){return e.length?`
            <span class="checklist-assignee-avatars">
                ${e.slice(0,4).map(t=>`
                    <span class="checklist-assignee-avatar" style="background:${m(t.avatarColor)}" title="${m(t.label)}">${f(t.initials)}</span>
                `).join("")}
                ${e.length>4?`<span class="checklist-assignee-more">+${e.length-4}</span>`:""}
            </span>
        `:'<span class="checklist-assignee-placeholder">👤 Attribuer</span>'}function ir(e){const t=e.closest(".checklist-assignees"),n=e.value.trim().toLocaleLowerCase(c.cultureFull);t?.querySelectorAll(".checklist-person-option").forEach(r=>{r.hidden=n!==""&&!u(r.dataset.search).includes(n)})}function or(e,t,n,r){r.key==="Enter"&&(r.preventDefault(),ft(e,t,n,r))}async function ft(e,t,n,r){r?.preventDefault(),r?.stopPropagation();const i=n.closest(".checklist-section")?.querySelector(".checklist-add-input"),o=u(i?.value).trim();if(!o){i?.focus(),oe(e,t,"error","Saisissez un intitulé.");return}i&&(i.value="");const a=await D(e,l=>l.map(d=>d.id===t?{...d,items:[...d.items,{id:x(),text:o,done:!1,memberIds:[],dueDate:"",createdAt:new Date().toISOString()}]}:d));$e(e,t,a)}async function ar(e,t,n,r){r?.stopPropagation();const s=u(n).trim()||"Checklist";await D(e,i=>i.map(o=>o.id===t?{...o,title:s}:o))}async function cr(e,t,n,r,s,i,o){o?.stopPropagation();const a=r==="done"?!!s:r==="dueDate"?dt(s):u(s).trim(),l=await D(e,d=>d.map(p=>p.id===t?{...p,items:p.items.map(h=>h.id===n?{...h,[r]:a}:h)}:p));if(r==="text"){oe(e,t,"saved","Élément enregistré.");return}$e(e,t,l)}async function lr(e,t,n,r,s){s?.stopPropagation();const i=Array.from(r.querySelectorAll('input[type="checkbox"]:checked')).map(l=>Number(l.value)).filter(l=>w.has(l));await D(e,l=>l.map(d=>d.id===t?{...d,items:d.items.map(p=>p.id===n?{...p,memberIds:i}:p)}:d));const o=i.map(l=>w.get(l)).filter(Boolean),a=r.querySelector("summary");a&&(a.innerHTML=pt(o)),oe(e,t,"saved","Attribution enregistrée.")}async function ur(e,t,n,r){r?.preventDefault(),r?.stopPropagation();const s=v(e),o=q(s?.CHECKLIST).find(l=>l.id===t)?.items.find(l=>l.id===n);if(o?.text&&!window.confirm(`Supprimer « ${o.text} » ?`))return;const a=await D(e,l=>l.map(d=>d.id===t?{...d,items:d.items.filter(p=>p.id!==n)}:d));$e(e,t,a)}async function dr(e,t,n){n?.preventDefault(),n?.stopPropagation();const r=v(e),s=q(r?.CHECKLIST).find(i=>i.id===t);window.confirm(`Supprimer la checklist « ${s?.title||"Checklist"} » et tous ses éléments ?`)&&(await D(e,i=>i.filter(o=>o.id!==t)),await A(e))}async function D(e,t){const n=Number(e),s=(ee.get(n)||Promise.resolve()).catch(()=>{}).then(async()=>{const i=v(n),o=q(i?.CHECKLIST),a=t(o).map((l,d)=>lt(l,d));return await N(n,"CHECKLIST",JSON.stringify(a)),i&&(i.CHECKLIST=JSON.stringify(a)),a}).finally(()=>{ee.get(n)===s&&ee.delete(n)});return ee.set(n,s),s}function $e(e,t,n=null){const r=v(e),i=(n||q(r?.CHECKLIST)).find(d=>d.id===t),o=document.querySelector(`.checklist-section[data-row-id="${Number(e)}"][data-checklist-id="${mr(t)}"]`);if(!o||!i){A(e);return}const a=document.createElement("div");a.innerHTML=mt(i,e,c.col.CHECKLIST.getIsFormula());const l=a.firstElementChild;o.replaceWith(l),l.querySelectorAll(".auto-expand").forEach(J),ht(l.parentElement)}function oe(e,t,n,r){const s=document.getElementById(`checklist-status-${Number(e)}-${gt(t)}`);s&&(s.className=`section-status checklist-status${n?` ${n}`:""}`,s.textContent=r)}function ht(e=document){typeof Sortable!="function"||c.opt.readonly||e.querySelectorAll('.checklist-section[data-disabled="false"] .checklist-items').forEach(t=>{t.dataset.sortableReady!=="true"&&(t.dataset.sortableReady="true",new Sortable(t,{animation:140,handle:".checklist-drag-handle",ghostClass:"checklist-item-ghost",chosenClass:"checklist-item-chosen",onEnd:async()=>{const n=Number(t.dataset.rowId),r=t.dataset.checklistId,s=Array.from(t.querySelectorAll(".checklist-item")).map(i=>i.dataset.itemId);await D(n,i=>i.map(o=>{if(o.id!==r)return o;const a=new Map(o.items.map(l=>[l.id,l]));return{...o,items:s.map(l=>a.get(l)).filter(Boolean)}})),oe(n,r,"saved","Ordre enregistré.")}}))})}function gt(e){return u(e).replace(/[^a-zA-Z0-9_-]/g,"_")}function mr(e){return window.CSS?.escape?window.CSS.escape(u(e)):u(e).replace(/["\\]/g,"\\$&")}function pr(e,t=C(e.PIECES_JOINTES),n=ae(e.LIENS)){return`
        <section class="detail-section resources-section" data-row-id="${Number(e.id)}">
            <div class="detail-section-header resource-section-header">
                <div>
                    <h3>📎 Pièces jointes et liens</h3>
                    <p>${t.length+n.length} ressource(s)</p>
                </div>
                <button type="button" class="section-edit-button" onclick="ouvrirPanneauFiche('resources', event, true)">Ajouter</button>
            </div>

            ${t.length>0?`
                <div class="resource-subsection">
                    <h4>Fichiers</h4>
                    <div id="attachments-list-${Number(e.id)}" class="attachments-grid">
                        <div class="section-loading">Chargement des pièces jointes…</div>
                    </div>
                </div>
            `:""}

            ${n.length>0?`
                <div class="resource-subsection">
                    <h4>Liens</h4>
                    <div class="resource-links-list">
                        ${n.map(r=>fr(e.id,r)).join("")}
                    </div>
                </div>
            `:""}
        </section>
    `}function ae(e){const t=u(e).trim();if(!t)return[];try{const n=JSON.parse(t);return Array.isArray(n)?n.map((r,s)=>({id:u(r?.id)||`link-${s}`,label:u(r?.label||r?.text).trim(),url:Ne(r?.url),createdAt:u(r?.createdAt)})).filter(r=>r.label&&r.url):[]}catch(n){return console.warn("Liens illisibles, valeur ignorée :",n),[]}}function Ne(e){const t=u(e).trim();if(!t)return"";const n=/^(https?:)/i.test(t)?t:`https://${t}`;try{const r=new URL(n);return["http:","https:"].includes(r.protocol)?r.href:""}catch{return""}}function fr(e,t){let n="";try{n=new URL(t.url).hostname}catch{n=t.url}return`
        <article class="resource-link-card">
            <a href="${m(t.url)}" target="_blank" rel="noopener noreferrer" class="resource-link-main">
                <span class="resource-link-icon">🔗</span>
                <span class="resource-link-text">
                    <strong>${f(t.label)}</strong>
                    <small>${f(n)}</small>
                </span>
            </a>
            ${c.map?.LIENS&&!c.col.LIENS.getIsFormula()?`
                <button
                    type="button"
                    onclick="retirerLienFiche(${Number(e)}, '${E(t.id)}', event)"
                    title="Retirer ce lien"
                    aria-label="Retirer ce lien"
                >×</button>
            `:""}
        </article>
    `}async function hr(e,t,n){n?.preventDefault(),n?.stopPropagation();const r=t.closest(".task-action-panel"),s=r?.querySelector(".resource-link-label"),i=r?.querySelector(".resource-link-url"),o=r?.querySelector(".task-panel-status"),a=u(s?.value).trim(),l=Ne(i?.value);if(!a||!l){o&&(o.className="task-panel-status section-status error",o.textContent="Renseignez un texte d’affichage et une adresse valide."),(a?i:s)?.focus();return}try{o&&(o.className="task-panel-status section-status saving",o.textContent="Enregistrement…"),await bt(e,d=>[...d,{id:x(),label:a,url:l,createdAt:new Date().toISOString()}]),await A(e,"resources")}catch{o&&(o.className="task-panel-status section-status error",o.textContent="Impossible d’ajouter le lien.")}}async function gr(e,t,n){n?.preventDefault(),n?.stopPropagation(),await bt(e,r=>r.filter(s=>s.id!==t)),await A(e)}async function bt(e,t){const n=Number(e),s=(te.get(n)||Promise.resolve()).catch(()=>{}).then(async()=>{const i=v(n),o=ae(i?.LIENS),a=t(o).map(l=>({id:u(l.id)||x(),label:u(l.label).trim(),url:Ne(l.url),createdAt:u(l.createdAt)||new Date().toISOString()})).filter(l=>l.label&&l.url);return await N(n,"LIENS",JSON.stringify(a)),i&&(i.LIENS=JSON.stringify(a)),a}).finally(()=>{te.get(n)===s&&te.delete(n)});return te.set(n,s),s}async function br(e){const t=document.getElementById(`attachments-list-${Number(e)}`);if(!t)return;const n=v(e),r=C(n?.PIECES_JOINTES);if(r.length===0){t.innerHTML='<div class="section-empty">Aucune pièce jointe</div>';return}t.innerHTML='<div class="section-loading">Chargement des aperçus…</div>';try{const[s]=await Promise.all([St(!0),ve()]);t.innerHTML=r.map(i=>vt(e,i,s)).join("")}catch(s){console.error("Impossible d’afficher les pièces jointes :",s),t.innerHTML=r.map(i=>vt(e,i,null)).join("")}}function vt(e,t,n){const r=wt(t),s=n?Ct(n,t):"",i=At(r),o=i==="image"&&s?`<img src="${m(s)}" alt="${m(r.fileName)}" loading="lazy">`:`<div class="attachment-file-icon">${$t(i)}</div>`;return`
        <article class="attachment-card">
            <button type="button" class="attachment-preview" onclick="ouvrirPieceJointe(${Number(e)}, ${Number(t)}, event)" title="Ouvrir ${m(r.fileName)}">
                ${o}
            </button>
            <div class="attachment-info">
                <div class="attachment-name" title="${m(r.fileName)}">${f(r.fileName)}</div>
                <div class="attachment-meta">${f(jr(r.fileSize))}</div>
            </div>
            <div class="attachment-actions">
                <button type="button" onclick="ouvrirPieceJointe(${Number(e)}, ${Number(t)}, event)" title="Visualiser">👁</button>
                ${c.map?.PIECES_JOINTES&&!c.col.PIECES_JOINTES.getIsFormula()?`<button type="button" onclick="retirerPieceJointe(${Number(e)}, ${Number(t)}, event)" title="Retirer de la tâche">×</button>`:""}
            </div>
        </article>
    `}async function vr(e,t,n){n?.stopPropagation();const r=Array.from(t?.files||[]);if(r.length===0)return;const s=r.find(i=>i.size>Vt);if(s){$("attachments",e,"error",`${s.name} dépasse 50 Mo.`),t.value="";return}t.disabled=!0,$("attachments",e,"saving",`Envoi de ${r.length} fichier(s)…`);try{const i=await grist.docApi.getAccessToken({readOnly:!1}),o=new FormData;r.forEach(g=>o.append("upload",g,g.name));const a=await fetch(`${i.baseUrl}/attachments?auth=${encodeURIComponent(i.token)}`,{method:"POST",body:o,headers:{"X-Requested-With":"XMLHttpRequest"}});if(!a.ok)throw new Error(`Upload échoué (${a.status} ${a.statusText})`);const l=await a.json(),d=C(l);if(d.length===0)throw new Error("Grist n’a retourné aucun identifiant de pièce jointe.");const p=v(e),h=C(p?.PIECES_JOINTES),b=[...new Set([...h,...d])];await Et(e,b),p&&(p.PIECES_JOINTES=[...b]),G=!1,await ve(!0),await A(e,"resources")}catch(i){console.error("Erreur pendant l’ajout des pièces jointes :",i),$("attachments",e,"error",i.message||"Échec de l’envoi.")}finally{t.value="",t.disabled=!1}}async function Er(e,t,n){n?.preventDefault(),n?.stopPropagation();const r=v(e),i=C(r?.PIECES_JOINTES).filter(o=>o!==Number(t));try{$("attachments",e,"saving","Mise à jour…"),await Et(e,i),r&&(r.PIECES_JOINTES=[...i]),await A(e)}catch(o){console.error("Erreur pendant le retrait de la pièce jointe :",o),$("attachments",e,"error","Impossible de retirer la pièce jointe.")}}async function Et(e,t){const n=c.map?.PIECES_JOINTES;if(!n||Array.isArray(n))throw new Error("La colonne Pièces jointes n’est pas correctement mappée.");await grist.getTable().update({id:Number(e),fields:{[n]:["L",...t]}}),await Dt(e)}async function yr(e,t,n){n?.preventDefault(),n?.stopPropagation();try{const[r]=await Promise.all([St(!0),ve()]),s=wt(t),i=Ct(r,t);Cr(s,i)}catch(r){console.error("Impossible d’ouvrir la pièce jointe :",r),window.alert("Impossible d’ouvrir cette pièce jointe.")}}function Sr(){if(document.getElementById("attachment-viewer"))return;const e=document.createElement("div");e.id="attachment-viewer",e.className="attachment-viewer",e.setAttribute("aria-hidden","true"),e.innerHTML=`
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
    `,document.body.appendChild(e)}function Cr(e,t){const n=document.getElementById("attachment-viewer"),r=document.getElementById("attachment-viewer-content"),s=document.getElementById("attachment-viewer-title"),i=document.getElementById("attachment-viewer-download");if(!n||!r||!s||!i)return;s.textContent=e.fileName,i.href=t;const o=At(e);o==="image"?r.innerHTML=`<img src="${m(t)}" alt="${m(e.fileName)}">`:o==="pdf"?r.innerHTML=`<iframe src="${m(t)}" title="${m(e.fileName)}"></iframe>`:o==="video"?r.innerHTML=`<video src="${m(t)}" controls autoplay></video>`:o==="audio"?r.innerHTML=`<div class="attachment-generic-preview"><div class="attachment-large-icon">🎵</div><audio src="${m(t)}" controls autoplay></audio></div>`:r.innerHTML=`<div class="attachment-generic-preview"><div class="attachment-large-icon">${$t(o)}</div><p>Ce format ne dispose pas d’un aperçu intégré.</p><a href="${m(t)}" target="_blank" rel="noopener">Ouvrir ou télécharger le fichier</a></div>`,n.classList.add("visible"),n.setAttribute("aria-hidden","false")}function yt(e){e?.preventDefault(),e?.stopPropagation();const t=document.getElementById("attachment-viewer");if(!t)return;t.classList.remove("visible"),t.setAttribute("aria-hidden","true");const n=document.getElementById("attachment-viewer-content");n&&(n.innerHTML="")}async function St(e=!0){if(e&&X&&Date.now()-Oe<Qt)return X;const t=await grist.docApi.getAccessToken({readOnly:e});return e&&(X=t,Oe=Date.now()),t}function Ct(e,t){return`${e.baseUrl}/attachments/${Number(t)}/download?auth=${encodeURIComponent(e.token)}`}function wt(e){return pe.get(Number(e))||{id:Number(e),fileName:`Pièce jointe ${Number(e)}`,fileExt:"",fileType:"",fileSize:0,imageWidth:0,imageHeight:0}}function At(e){const t=u(e.fileExt||jt(e.fileName)).toLowerCase().replace(/^\./,""),n=u(e.fileType).toLowerCase();return n.startsWith("image/")||["png","jpg","jpeg","gif","webp","svg","bmp","avif"].includes(t)?"image":n==="application/pdf"||t==="pdf"?"pdf":n.startsWith("video/")||["mp4","webm","mov","m4v","ogv"].includes(t)?"video":n.startsWith("audio/")||["mp3","wav","ogg","m4a","aac","flac"].includes(t)?"audio":["doc","docx","odt"].includes(t)?"document":["xls","xlsx","ods","csv"].includes(t)?"tableur":["ppt","pptx","odp"].includes(t)?"presentation":["zip","rar","7z","tar","gz"].includes(t)?"archive":"file"}function $t(e){return{image:"🖼️",pdf:"📕",video:"🎬",audio:"🎵",document:"📄",tableur:"📊",presentation:"📽️",archive:"🗜️",file:"📎"}[e]||"📎"}function wr(e){const t=W(e.COMMENTAIRES),n=c.opt.enablementions!==!1;return`
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
                ${Tt(t,e.id)}
            </div>

            <div class="comment-composer">
                <div class="comment-input-wrapper">
                    <textarea
                        class="comment-input"
                        placeholder="Écrire un commentaire${n?" — utilisez @ pour mentionner quelqu’un":""}…"
                        oninput="ajusterTextarea(this); gererSaisieMention(this)"
                        onkeydown="gererTouchesMention(this, event)"
                    ></textarea>

                    ${n?Ar():""}
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
    `}function Ar(){return`
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
                ${T.map(t=>`
        <button
            type="button"
            class="mention-option"
            data-member-id="${t.id}"
            data-search="${m(`${t.label} ${t.email||""}`.toLocaleLowerCase(c.cultureFull))}"
            onclick="selectionnerMentionCommentaire(this, ${t.id}, event)"
        >
            <span
                class="mention-option-avatar"
                style="background:${m(t.avatarColor)}"
            >${f(t.initials)}</span>
            <span class="mention-option-text">
                <strong>${f(t.label)}</strong>
                <small>${t.email?f(t.email):"E-mail manquant dans la table Membres"}</small>
            </span>
        </button>
    `).join("")||'<div class="section-empty">Aucun membre disponible</div>'}
            </div>
        </div>
    `}function $r(e,t){t?.preventDefault(),t?.stopPropagation();const r=e.closest(".comment-composer")?.querySelector(".mention-menu");r&&(r.hidden=!1,Nt(r,""))}function Nr(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".mention-menu");n&&(n.hidden=!0)}function kr(e){const n=e.closest(".comment-composer")?.querySelector(".mention-menu");if(!n||c.opt.enablementions===!1)return;const r=kt(e);if(!r){n.hidden=!0;return}n.hidden=!1,n.dataset.mentionStart=String(r.start),Nt(n,r.query)}function Tr(e,t){const r=e.closest(".comment-composer")?.querySelector(".mention-menu");if(!r||r.hidden)return;const s=Array.from(r.querySelectorAll(".mention-option:not([hidden])"));if(t.key==="Escape"){t.preventDefault(),r.hidden=!0,e.focus();return}t.key==="Enter"&&s.length===1&&(t.preventDefault(),s[0].click())}function Nt(e,t){const n=u(t).trim().toLocaleLowerCase(c.cultureFull);e.querySelectorAll(".mention-option").forEach(r=>{r.hidden=n!==""&&!u(r.dataset.search).includes(n)})}function kt(e){const t=Number(e.selectionStart),r=e.value.slice(0,t).match(/(?:^|\s)@([^@\n]*)$/);if(!r)return null;const s=r[1];return{query:s,start:t-s.length-1,end:t}}function Ir(e,t,n){n?.preventDefault(),n?.stopPropagation();const r=e.closest(".comment-composer"),s=r?.querySelector(".comment-input"),i=r?.querySelector(".mention-menu"),o=w.get(Number(t));if(!r||!s||!o)return;const a=kt(s),l=`@${o.label}`;if(a)s.setRangeText(`${l} `,a.start,a.end,"end");else{const d=s.value&&!/\s$/.test(s.value)?" ":"";s.setRangeText(`${d}${l} `,s.selectionStart,s.selectionEnd,"end")}r._selectedMentions||(r._selectedMentions=new Map),r._selectedMentions.set(o.id,{id:o.id,name:o.label,email:o.email||""}),ke(r),i&&(i.hidden=!0),s.focus(),J(s)}function ke(e){const t=e.querySelector(".comment-selected-mentions");if(!t)return;const n=Array.from(e._selectedMentions?.values?.()||[]);t.innerHTML=n.map(r=>`
        <span class="selected-mention-chip">
            @${f(r.name)}
            <button
                type="button"
                onclick="retirerMentionCommentaire(this, ${Number(r.id)}, event)"
                aria-label="Retirer ${m(r.name)}"
            >×</button>
        </span>
    `).join("")}function Lr(e,t,n){n?.preventDefault(),n?.stopPropagation();const r=e.closest(".comment-composer"),s=r?.querySelector(".comment-input"),i=w.get(Number(t));if(r?._selectedMentions?.delete(Number(t)),s&&i){const o=`@${i.label}`;s.value=s.value.replaceAll(o,"").replace(/[ \t]{2,}/g," ").trimStart(),J(s)}r&&ke(r)}function Tt(e,t){return e.length===0?'<div class="section-empty">Aucun commentaire</div>':e.map(n=>`
        <article
            class="comment-card"
            data-comment-id="${m(n.id)}"
        >
            <div class="comment-header">
                <strong>${f(n.author===j?"Nom Grist non configuré":n.author||"Anonyme")}</strong>
                <span>${f(Me(n.createdAt))}</span>
                <button
                    type="button"
                    onclick="supprimerCommentaire(
                        ${Number(t)},
                        '${E(n.id)}',
                        event
                    )"
                    title="Supprimer le commentaire"
                >×</button>
            </div>
            <div class="comment-body">
                ${Dr(n)}
            </div>
        </article>
    `).join("")}function Dr(e){let t=f(e.text).replace(/\n/g,"<br>");return It(e.mentions).sort((r,s)=>s.name.length-r.name.length).forEach(r=>{const s=f(`@${r.name}`),i=`
            <span
                class="comment-mention"
                title="${m(r.email||r.name)}"
            >${s}</span>
        `;t=t.split(s).join(i)}),t}function W(e){const t=u(e).trim();if(!t)return[];try{const n=JSON.parse(t);if(!Array.isArray(n))throw new Error("Format non tableau");return n.map((r,s)=>({id:u(r?.id)||`legacy-${s}`,author:u(r?.author)||"Anonyme",createdAt:u(r?.createdAt),text:u(r?.text),mentions:It(r?.mentions)})).filter(r=>r.text.trim())}catch{return[{id:"legacy-text",author:"Ancien commentaire",createdAt:"",text:t,mentions:[]}]}}function It(e){return O(e).map(t=>({id:Number(t?.id)||0,name:u(t?.name||t?.label).trim(),email:Ut(t?.email)})).filter(t=>t.name)}async function Rr(e,t,n){n?.preventDefault(),n?.stopPropagation();const s=t.closest(".comments-section")?.querySelector(".comment-composer"),i=s?.querySelector(".comment-input"),o=u(i?.value).trim();if(!o){$("comments",e,"error","Écrivez un commentaire."),i?.focus();return}const a=Array.from(s?._selectedMentions?.values?.()||[]).filter(d=>o.includes(`@${d.name}`));t.disabled=!0,$("comments",e,"saving","Enregistrement…");const l={id:x(),author:j,createdAt:new Date().toISOString(),text:o,mentions:a};try{const p=(await Lt(e,g=>[...g,l])).find(g=>g.id===l.id);if(!p||p.author===j)throw new Error("La formule user.Name n’a pas remplacé le nom temporaire.");if(i&&(i.value="",J(i)),s){s._selectedMentions=new Map,ke(s);const g=s.querySelector(".mention-menu");g&&(g.hidden=!0)}Te(e);const h=p.mentions.length,b=h>0?`Commentaire ajouté par ${p.author}. ${h} mention(s) visuelle(s), sans envoi d’e-mail.`:`Commentaire ajouté par ${p.author}.`;$("comments",e,"saved",b)}catch(d){console.error("Erreur pendant l’ajout du commentaire :",d),Te(e),$("comments",e,"error",u(d?.message)||"Impossible d’ajouter le commentaire.")}finally{t.disabled=!1}}async function Mr(e,t,n){n?.preventDefault(),n?.stopPropagation();try{$("comments",e,"saving","Suppression…"),await Lt(e,r=>r.filter(s=>s.id!==t)),Te(e),$("comments",e,"saved","Commentaire supprimé.")}catch(r){console.error("Erreur pendant la suppression du commentaire :",r),$("comments",e,"error","Impossible de supprimer le commentaire.")}}async function Lt(e,t){const n=Number(e),s=(ne.get(n)||Promise.resolve()).catch(()=>{}).then(async()=>{const i=v(n),o=W(i?.COMMENTAIRES),a=t(o),l=JSON.stringify(a),d=Ie();await c.updateRecords(c.formatRecord(n,{COMMENTAIRES:l,...d}));const p=await Pr(n);return i&&(i.COMMENTAIRES=JSON.stringify(p)),p}).finally(()=>{ne.get(n)===s&&ne.delete(n)});return ne.set(n,s),s}async function Pr(e){const t=c.map?.COMMENTAIRES;if(!t||Array.isArray(t))throw new Error("La colonne Commentaires n’est pas correctement mappée.");const n=await ct(e,t),r=W(n),s=v(e);return s&&(s.COMMENTAIRES=u(n)),r}function Te(e){const t=v(e),n=W(t?.COMMENTAIRES),r=document.getElementById(`comments-list-${Number(e)}`),s=r?.closest(".comments-section");r&&(r.innerHTML=Tt(n,e));const i=s?.querySelector(".detail-section-header p");i&&(i.textContent=`${n.length} commentaire(s)`)}async function N(e,t,n,r){r?.stopPropagation();try{t==="STATUT"&&Le(n)?.useconfetti&&Kr();const s={[t]:n,...t==="DERNIERE_MISE_A_JOUR"||t==="MODIFIE_PAR"?{}:Ie()};await c.updateRecords(c.formatRecord(e,s));const i=v(e);i&&(i[t]=n,s.DERNIERE_MISE_A_JOUR&&(i.DERNIERE_MISE_A_JOUR=s.DERNIERE_MISE_A_JOUR),s.MODIFIE_PAR&&(i.MODIFIE_PAR=s.MODIFIE_PAR))}catch(s){throw console.error(y("Error during update:"),s),s}}function Ie(){const e={};return c.map?.DERNIERE_MISE_A_JOUR&&!c.col.DERNIERE_MISE_A_JOUR.getIsFormula()&&(e.DERNIERE_MISE_A_JOUR=new Date().toISOString()),c.map?.MODIFIE_PAR&&!c.col.MODIFIE_PAR.getIsFormula()&&(e.MODIFIE_PAR=j),e}async function Dt(e){const t=Ie();if(Object.keys(t).length!==0)try{await c.updateRecords(c.formatRecord(e,t));const n=v(e);n&&Object.assign(n,t)}catch(n){console.warn("Données enregistrées, mais informations de suivi non modifiées :",n)}}async function qr(e){try{const t={DESCRIPTION:"",STATUT:e};c.map?.DERNIERE_MISE_A_JOUR&&!c.col.DERNIERE_MISE_A_JOUR.getIsFormula()&&(t.DERNIERE_MISE_A_JOUR=new Date().toISOString()),c.map?.CREE_LE&&!c.col.CREE_LE.getIsFormula()&&(t.CREE_LE=new Date().toISOString()),c.map?.COMMENTAIRES&&!c.col.COMMENTAIRES.getIsFormula()&&(t.COMMENTAIRES="[]"),c.map?.CHECKLIST&&!c.col.CHECKLIST.getIsFormula()&&(t.CHECKLIST="[]"),c.map?.LIENS&&!c.col.LIENS.getIsFormula()&&(t.LIENS="[]"),c.map?.ORDRE&&!c.col.ORDRE.getIsFormula()&&(t.ORDRE=xr(e));const n=await c.createRecords({fields:t});if(n?.id>0){grist.setCursorPos({rowId:n.id});const r=await c.fetchSelectedRecord(n.id);c.opt.hideedit||H(r)}}catch(t){console.error(y("Error on creation:"),t)}}async function Fr(e,t){if(t?.stopPropagation(),!(c.opt.confirmdelete!==!1&&!confirm(y("Are you sure you want to delete this task?"))))try{await c.destroyRecords(e),Q()}catch(n){console.error(y("Error on delete:"),n)}}function Q(){const e=document.getElementById("popup-todo");!e||e.querySelector(".notes-field.is-editing.is-dirty")&&!window.confirm("Les modifications des notes ne sont pas enregistrées. Fermer quand même ?")||(F(e.dataset.currentTodo)?.classList.remove("active"),e.classList.remove("visible"),Rt())}function Or(e,t){if(t?.stopPropagation(),!e)return;e.classList.toggle("collapsed");const n=e.querySelector(".titre-statut")?.childNodes?.[0]?.textContent?.trim()||e.id;localStorage.setItem(Pt(n),String(e.classList.contains("collapsed")))}function J(e){e&&(e.style.height="",e.style.height=`${Math.max(e.scrollHeight,42)}px`)}function Rt(e=null){document.querySelectorAll(".multi-dropdown[open], .checklist-assignees[open]").forEach(t=>{t!==e&&t.removeAttribute("open")})}document.addEventListener("keydown",e=>{if(e.key!=="Escape")return;if(document.getElementById("attachment-viewer")?.classList.contains("visible")){yt(e);return}const n=document.querySelector(".multi-dropdown[open], .checklist-assignees[open]");if(n){n.removeAttribute("open");return}if(document.querySelector(".task-action-panel:not([hidden])")){Ye(e);return}Q()}),document.addEventListener("click",e=>{const t=e.target.closest(".multi-dropdown, .checklist-assignees");c?.opt?.autoclosemenus!==!1&&Rt(t);const n=document.getElementById("popup-todo");if(!n?.classList.contains("visible"))return;e.target.closest(".task-action-panel, .task-quick-button")||(n.querySelectorAll(".task-action-panel").forEach(a=>{a.hidden=!0}),n.querySelectorAll(".task-quick-button").forEach(a=>{a.classList.remove("active")}));const s=n.contains(e.target),i=!!e.target.closest(".carte"),o=!!e.target.closest("#attachment-viewer");!s&&!i&&!o&&Q()});function v(e){return R.find(t=>Number(t.id)===Number(e))||null}function F(e){return Array.from(document.querySelectorAll(".carte")).find(t=>Number(t.dataset.todoId)===Number(e))||null}function Mt(e){return{addbutton:!1,isdone:!1,useconfetti:!1,hidecolumn:!1,...(Array.isArray(c.opt?.columns)?c.opt.columns:[])[e]||{}}}function Le(e){const n=(c.valuesList?.columns||[]).indexOf(e);return n>=0?Mt(n):null}function Pt(e){return`column-todo-${u(e)}`}function xr(e){const t=R.filter(n=>u(n.STATUT)===u(e)).map(n=>Number(n.ORDRE)).filter(Number.isFinite);return t.length>0?Math.max(...t)+1e3:1e3}function De(e,t){const n=_t(e?.[`${t}_id`]);if(n.length>0)return n;const r=V(e?.[t]).filter(i=>i!=="#KeyError"),s=[...T];return r.flatMap(i=>{const o=s.findIndex(l=>l.label===i);if(o<0)return[];const[a]=s.splice(o,1);return[a.id]})}function qt(e,t){const n=De(e,t);return n.length>0?n.map(r=>w.get(r)).filter(Boolean):V(e?.[t]).filter(r=>r!=="#KeyError").map(r=>({id:0,label:r,initials:He(r),avatarColor:Ke(r)}))}function _r(e){return De(e,"MEMBRES")}function Ft(e){return qt(e,"MEMBRES")}function Ur(e){return De(e,"RESPONSABLE")}function Ot(e){return qt(e,"RESPONSABLE")}function Re(e){const t=_t(e?.ETIQUETTES_id);if(t.length>0)return t;const n=V(e?.ETIQUETTES).filter(s=>s!=="#KeyError"),r=[..._];return n.flatMap(s=>{const i=r.findIndex(a=>a.label===s);if(i<0)return[];const[o]=r.splice(i,1);return[o.id]})}function xt(e){const t=Re(e);return t.length>0?t.map(n=>M.get(n)).filter(Boolean):V(e?.ETIQUETTES).filter(n=>n!=="#KeyError").map(n=>{const r=ze(n);return{id:0,label:n,color:r,textColor:We(r)}})}function _t(e){return C(e)}function C(e){let t=O(e);return t[0]==="L"?t=t.slice(1):t[0]==="r"&&(t=O(t[2])),[...new Set(t.flatMap(n=>Array.isArray(n)?n:[n]).map(Number).filter(n=>Number.isInteger(n)&&n>0))]}function V(e){let t=O(e);return t[0]==="L"&&(t=t.slice(1)),[...new Set(t.flatMap(n=>Array.isArray(n)?n:[n]).map(u).map(n=>n.trim()).filter(Boolean))]}function O(e){return e==null||e===""?[]:Array.isArray(e)?e:[e]}function u(e){return e==null?"":String(e)}function Ut(e){const t=u(e).trim().toLowerCase();return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)?t:""}function Jr(e){const t=[],n=c.map?.CREE_LE&&e.CREE_LE?Me(e.CREE_LE):"",r=c.map?.CREE_PAR?u(e.CREE_PAR).trim():"";if(n||r){const a=["Créé"];n&&a.push(`le ${n}`),r&&a.push(`par ${r}`),t.push(`<div>${f(a.join(" "))}</div>`)}const s=c.map?.DERNIERE_MISE_A_JOUR&&e.DERNIERE_MISE_A_JOUR?Me(e.DERNIERE_MISE_A_JOUR):"",i=c.map?.MODIFIE_PAR?u(e.MODIFIE_PAR).trim():"",o=i===j?"Nom Grist non configuré":i;if(s||o){const a=["Modifié"];s&&a.push(`le ${s}`),o&&a.push(`par ${o}`),t.push(`<div>${f(a.join(" "))}</div>`)}return t.join("")}function $(e,t,n,r){const s=document.getElementById(`${e}-status-${Number(t)}`);s&&(s.className=`section-status${n?` ${n}`:""}`,s.textContent=r)}function Jt(e){if(!e)return"";const t=new Date(e);if(Number.isNaN(t.getTime())||t>=B)return"";const n=String(t.getDate()).padStart(2,"0"),r=t.toLocaleDateString(c.cultureFull,{month:"short"});return`${n} ${r} ${t.getFullYear()}`}function Me(e){if(!e)return"";const t=new Date(e);return Number.isNaN(t.getTime())?"":t.toLocaleString(c.cultureFull,{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}function Br(e){if(!e)return"";const t=new Date(e);return Number.isNaN(t.getTime())||t>=B?"":t.toISOString().split("T")[0]}function Bt(e){if(!e)return"";const t=new Date(e);return Number.isNaN(t.getTime())?u(e):t.toISOString()}function Pe(e){if(!e)return null;const t=new Date(e).getTime();return Number.isNaN(t)?null:t}function ce(e,t){return Pe(e)??t}function jr(e){const t=Number(e)||0;if(t<=0)return"";const n=["o","Ko","Mo","Go"],r=Math.min(Math.floor(Math.log(t)/Math.log(1024)),n.length-1);return`${(t/1024**r).toFixed(r===0?0:1)} ${n[r]}`}function jt(e){const t=u(e).match(/(\.[^.]+)$/);return t?t[1]:""}function x(){return globalThis.crypto?.randomUUID?crypto.randomUUID():`comment-${Date.now()}-${Math.random().toString(16).slice(2)}`}function f(e){return u(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function m(e){return f(e).replace(/`/g,"&#096;")}function E(e){return u(e).replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/\r/g,"\\r").replace(/\n/g,"\\n")}function Hr(e){return encodeURIComponent(u(e)).replace(/'/g,"%27")}function Kr(){if(typeof confetti!="function")return;const e=2e3,t=Date.now()+e,n={startVelocity:30,spread:360,ticks:60,zIndex:1500},r=(i,o)=>Math.random()*(o-i)+i,s=window.setInterval(()=>{const i=t-Date.now();if(i<=0){window.clearInterval(s);return}const o=50*(i/e);confetti({...n,particleCount:o,origin:{x:r(.1,.3),y:Math.random()-.2}}),confetti({...n,particleCount:o,origin:{x:r(.7,.9),y:Math.random()-.2}})},250)}window.toggleColonne=Or,window.togglePopupTodo=H,window.fermerPopup=Q,window.mettreAJourChamp=N,window.creerNouvelleTache=qr,window.supprimerTodo=Fr,window.mettreAJourChampPersonnes=it,window.filtrerOptionsMultiples=Qn,window.viderChampPersonnes=Vn,window.mettreAJourEtiquettes=we,window.viderEtiquettes=Xn,window.retirerEtiquetteActive=Yn,window.ouvrirPanneauFiche=Xe,window.fermerPanneauxFiche=Ye,window.filtrerPanneauFiche=$n,window.mettreAJourTitreFiche=Nn,window.mettreAJourProprieteFiche=kn,window.enregistrerEtiquettesDepuisPanneau=Tn,window.retirerEtiquetteFiche=In,window.enregistrerPersonnesDepuisPanneau=Ln,window.gererCreationChecklistClavier=Dn,window.ajouterChecklistAvecTitre=Ze,window.mettreAJourCouleurFiche=Rn,window.gererAjoutItemChecklistClavier=or,window.ajouterItemChecklist=ft,window.renommerChecklist=ar,window.mettreAJourItemChecklist=cr,window.mettreAJourAssignationsItemChecklist=lr,window.supprimerItemChecklist=ur,window.supprimerChecklist=dr,window.filtrerOptionsChecklist=ir,window.ajouterLienFiche=hr,window.retirerLienFiche=gr,window.ajouterPiecesJointes=vr,window.retirerPieceJointe=Er,window.ouvrirPieceJointe=yr,window.fermerLecteurPieceJointe=yt,window.ajouterCommentaire=Rr,window.supprimerCommentaire=Mr,window.ajusterTextarea=J,window.previsualiserCouleur=Kn,window.mettreAJourCouleur=st,window.reinitialiserCouleur=zn,window.activerEditionNotes=Pn,window.annulerEditionNotes=qn,window.enregistrerEtFermerNotes=Fn,window.appliquerFormatBlocNotes=xn,window.appliquerCommandeNotes=_n,window.appliquerBaliseSelectionNotes=Un,window.creerLienNotes=tt,window.nettoyerCollageNotes=Jn,window.marquerNotesModifiees=I,window.mettreAJourEtatBarreNotes=U,window.gererRaccourcisNotes=Bn,window.ouvrirMenuMentions=$r,window.fermerMenuMentions=Nr,window.gererSaisieMention=kr,window.gererTouchesMention=Tr,window.selectionnerMentionCommentaire=Ir,window.retirerMentionCommentaire=Lr}));
