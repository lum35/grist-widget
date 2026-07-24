(function(c){typeof define=="function"&&define.amd?define(c):c()})((function(){"use strict";let c,y;const K=new Date("3000-01-01"),be="#DCDCDC",Je="#000000",Vt=120*1e3,Gt=50*1024*1024,z="__GRIST_USER_NAME__";let M=[],I=[],C=new Map,ge=null,J=[],P=new Map,ve=null,Ee=new Map,ne=!1,W=null,Be=0;const se=new Map,re=new Map,ie=new Map,ae=new Map,oe=new Map,ce=new Map;let je=null,ye=!1;window.addEventListener("load",async()=>{c=new WidgetSDK,y=await c.loadTranslations(["widget.js"]),c.configureOptions([WidgetSDK.newItem("columns",null,"Colonnes du Kanban","Réglez le comportement de chaque statut.","1 — Colonnes",{columnId:"STATUT",template:[WidgetSDK.newItem("addbutton",!0,"Autoriser l’ajout","Afficher un bouton pour créer une carte dans cette colonne."),WidgetSDK.newItem("isdone",!1,"Colonne terminée","Considérer les cartes de cette colonne comme terminées."),WidgetSDK.newItem("useconfetti",!1,"Confettis","Afficher des confettis lorsqu’une carte arrive dans cette colonne."),WidgetSDK.newItem("hidecolumn",!1,"Masquer la colonne","Ne pas afficher cette colonne dans le Kanban.")]}),WidgetSDK.newItem("cardrotation",!1,"Inclinaison des cartes","Incliner légèrement les cartes. Désactivé par défaut.","2 — Affichage des cartes"),WidgetSDK.newItem("compact",!1,"Mode compact","Réduire les espacements et la hauteur des cartes.","2 — Affichage des cartes"),WidgetSDK.newItem("showlabels",!0,"Afficher les étiquettes","Afficher les étiquettes colorées sur les cartes.","2 — Affichage des cartes"),WidgetSDK.newItem("showmembers",!0,"Afficher les membres","Afficher les bulles d’initiales des membres sur les cartes.","2 — Affichage des cartes"),WidgetSDK.newItem("showresponsables",!0,"Afficher les responsables","Afficher les responsables avec une bordure renforcée sur les cartes.","2 — Affichage des cartes"),WidgetSDK.newItem("showdeadline",!0,"Afficher l’échéance","Afficher la date limite sur les cartes.","2 — Affichage des cartes"),WidgetSDK.newItem("showindicators",!0,"Afficher les indicateurs","Afficher le nombre de pièces jointes et de commentaires.","2 — Affichage des cartes"),WidgetSDK.newItem("showchecklistprogress",!0,"Afficher la progression checklist","Afficher le nombre d’éléments cochés sur les cartes.","2 — Affichage des cartes"),WidgetSDK.newItem("defaultcardcolor","#FFFFD1","Couleur par défaut","Couleur utilisée lorsqu’aucune couleur personnalisée n’est enregistrée.","2 — Affichage des cartes"),WidgetSDK.newItem("showchecklist",!0,"Checklist","Afficher la checklist avancée dans la fiche.","3 — Fiche descriptive"),WidgetSDK.newItem("showattachments",!0,"Pièces jointes","Afficher la section des pièces jointes dans la fiche.","3 — Fiche descriptive"),WidgetSDK.newItem("showcomments",!0,"Commentaires","Afficher la section des commentaires dans la fiche.","3 — Fiche descriptive"),WidgetSDK.newItem("enablementions",!0,"Mentions @ visuelles","Permettre de mentionner les membres dans les commentaires. Cette version ne déclenche aucun e-mail automatique.","3 — Fiche descriptive"),WidgetSDK.newItem("showmetadata",!0,"Informations de suivi","Afficher les lignes « Créé le » et « Modifié le » en bas de la fiche.","3 — Fiche descriptive"),WidgetSDK.newItem("autoclosemenus",!0,"Fermer les menus automatiquement","Fermer les sélecteurs multiples lorsqu’on clique ailleurs.","3 — Fiche descriptive"),WidgetSDK.newItem("readonly",!1,"Lecture seule","Désactiver toutes les modifications depuis le widget.","4 — Comportement"),WidgetSDK.newItem("hideedit",!1,"Masquer la fiche","Ne pas ouvrir la fiche descriptive lors d’un clic sur une carte.","4 — Comportement"),WidgetSDK.newItem("gristeditcard",!1,"Double-clic vers la fiche Grist","Ouvrir la fiche native de Grist lors d’un double-clic.","4 — Comportement"),WidgetSDK.newItem("confirmdelete",!0,"Confirmer les suppressions","Demander une confirmation avant de supprimer une tâche.","4 — Comportement")],"#config-view","#main-view",{onOptChange:Ae,onOptLoad:Ae}),c.initMetaData(),c.ready({requiredAccess:"full",allowSelectBy:!0,columns:[{name:"STATUT",title:"Statut",description:"Colonne du Kanban",type:"Choice",strictType:!0},{name:"DESCRIPTION",title:"Nom de la tâche",description:"Nom principal de la tâche",type:"Any"},{name:"DESCRIPTION_DISPLAY",title:"Affichage de la tâche",description:"Contenu personnalisé facultatif affiché sur la carte",type:"Any",optional:!0},{name:"NOTES",title:"Notes",description:"Notes enrichies enregistrées en HTML sécurisé",type:"Text",strictType:!0,optional:!0},{name:"DEADLINE",title:"Échéance",description:"Date limite de la carte",type:"Date",optional:!0},{name:"ORDRE",title:"Ordre manuel",description:"Nombre utilisé pour conserver exactement la position des cartes",type:"Numeric",strictType:!0,optional:!0},{name:"MEMBRES",title:"Membres",description:"Toutes les personnes qui participent à la carte",type:"RefList",strictType:!0,optional:!0},{name:"RESPONSABLE",title:"Responsables",description:"Responsables principaux de la carte",type:"RefList",strictType:!0,optional:!0},{name:"ETIQUETTES",title:"Étiquettes",description:"Étiquettes multiples référencées depuis une table dédiée",type:"RefList",strictType:!0,optional:!0},{name:"CHECKLIST",title:"Checklist",description:"Checklists titrées stockées en JSON",type:"Text",strictType:!0,optional:!0},{name:"PIECES_JOINTES",title:"Pièces jointes",description:"Fichiers et images associés à la tâche",type:"Attachments",strictType:!0,optional:!0},{name:"LIENS",title:"Liens",description:"Liens avec texte d’affichage stockés en JSON",type:"Text",strictType:!0,optional:!0},{name:"COMMENTAIRES",title:"Commentaires",description:"Commentaires du widget stockés en JSON",type:"Text",strictType:!0,optional:!0},{name:"COULEUR",title:"Couleur de carte",description:"Code hexadécimal choisi depuis le widget",type:"Text",strictType:!0,optional:!0},{name:"CREE_PAR",title:"Créé par",type:"Any",optional:!0},{name:"CREE_LE",title:"Date de création",type:"DateTime",optional:!0},{name:"DERNIERE_MISE_A_JOUR",title:"Dernière mise à jour",description:"Date technique affichée dans le suivi",type:"DateTime",optional:!0},{name:"MODIFIE_PAR",title:"Modifié par",description:"Nom de la dernière personne ayant modifié la tâche",type:"Text",strictType:!0,optional:!0}]}),c.onRecords(le,{expandRefs:!1,keepEncoded:!1,mapRef:!0}),c.isLoaded().then(()=>{c.initDone=!0}),grist.on("message",async e=>{e.mappingsChange&&await tn()}),As(),Zt()});async function He(e=!1){const t=c?.map?.MEMBRES?"MEMBRES":c?.map?.RESPONSABLE?"RESPONSABLE":null;if(!t||!c?.col?.[t]){Se();return}const n=c.col[t],s=`${t}:${n.type}:${n.visibleCol}`;if(!(!e&&ge===s&&I.length>0))try{const r=await ze(n),i=r.dataColumns,a=we(i,["initiales","initiale","initials","abreviation","abréviation","sigle"])||We(i,r.visibleColumnId),o=we(i,["email","e-mail","mail","courriel","adresseemail","adresse_email","adressemail","adresse_mail"]),l=a&&Array.isArray(r.table[a])?r.table[a]:[],d=o&&Array.isArray(r.table[o])?r.table[o]:[];I=r.ids.map((p,b)=>{const v=u(r.labels[b]).trim(),h=Xt(l[b])||Ve(v),k=Bt(d[b]);return{id:Number(p),label:v,initials:h,email:k,avatarColor:Ge(v||p)}}).filter(p=>Number.isInteger(p.id)&&p.id>0&&p.label&&p.label!=="#KeyError").sort((p,b)=>p.label.localeCompare(b.label,c.cultureFull,{sensitivity:"base"})),C=new Map(I.map(p=>[p.id,p])),ge=s}catch(r){Se(),console.error("Impossible de charger la table des membres :",r)}}function Se(){I=[],C=new Map,ge=null}async function Ke(e=!1){if(!c?.map?.ETIQUETTES||!c?.col?.ETIQUETTES){Ce();return}const t=c.col.ETIQUETTES,n=`${t.type}:${t.visibleCol}`;if(!(!e&&ve===n&&J.length>0))try{const s=await ze(t),r=s.dataColumns,i=we(r,["couleur","color","hex","codecouleur","code_couleur"])||We(r,s.visibleColumnId),a=i&&Array.isArray(s.table[i])?s.table[i]:[];J=s.ids.map((o,l)=>{const d=u(s.labels[l]).trim(),b=S(a[l])||Xe(d||o);return{id:Number(o),label:d,color:b,textColor:Ye(b)}}).filter(o=>Number.isInteger(o.id)&&o.id>0&&o.label&&o.label!=="#KeyError").sort((o,l)=>o.label.localeCompare(l.label,c.cultureFull,{sensitivity:"base"})),P=new Map(J.map(o=>[o.id,o])),ve=n}catch(s){Ce(),console.error("Impossible de charger la table des étiquettes :",s)}}function Ce(){J=[],P=new Map,ve=null}async function ze(e){const[t,n]=u(e?.type).split(":");if(t!=="RefList"||!n||!e?.visibleCol)throw new Error("La colonne doit être une Liste de références avec une colonne visible configurée.");const[s,r]=await Promise.all([grist.docApi.fetchTable(n),e.getMeta(e.visibleCol)]),i=r?.colId;if(!i||!Array.isArray(s?.id)||!Array.isArray(s?.[i]))throw new Error(`La colonne visible de la table ${n} est introuvable.`);const a=Object.keys(s).filter(o=>Array.isArray(s[o])&&o!=="id"&&o!=="manualSort"&&!o.startsWith("gristHelper_"));return{tableId:n,table:s,ids:s.id,labels:s[i],visibleColumnId:i,dataColumns:a}}function we(e,t){const n=new Set(t.map(Qe));return e.find(s=>n.has(Qe(s)))||null}function We(e,t){const n=e.indexOf(t);return n>=0&&e[n+1]||null}function Qe(e){return u(e).normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]/gi,"").toLowerCase()}function Xt(e){return u(e).trim().replace(/\s+/g,"").slice(0,4).toUpperCase()}function Ve(e){const t=u(e).trim().split(/\s+/).filter(Boolean);return t.length===0?"?":t.length===1?t[0].slice(0,2).toUpperCase():`${t[0][0]||""}${t[t.length-1][0]||""}`.toUpperCase()}function Ge(e){let t=0;for(const s of u(e))t=(t<<5)-t+s.charCodeAt(0),t|=0;return`hsl(${Math.abs(t)%360} 58% 42%)`}function Xe(e){let t=0;for(const s of u(e))t=(t<<5)-t+s.charCodeAt(0),t|=0;const n=Math.abs(t)%360;return Yt(n,62,72)}function Yt(e,t,n){t/=100,n/=100;const s=(1-Math.abs(2*n-1))*t,r=s*(1-Math.abs(e/60%2-1)),i=n-s/2;let a=0,o=0,l=0;return e<60?[a,o,l]=[s,r,0]:e<120?[a,o,l]=[r,s,0]:e<180?[a,o,l]=[0,s,r]:e<240?[a,o,l]=[0,r,s]:e<300?[a,o,l]=[r,0,s]:[a,o,l]=[s,0,r],`#${[a,o,l].map(d=>Math.round((d+i)*255).toString(16).padStart(2,"0")).join("")}`.toUpperCase()}function Ye(e){const t=S(e)||"#DDE3EA",n=parseInt(t.slice(1,3),16),s=parseInt(t.slice(3,5),16),r=parseInt(t.slice(5,7),16);return(.2126*n+.7152*s+.0722*r)/255>.58?"#1F2937":"#FFFFFF"}async function $e(e=!1){if(!(ne&&!e)){Ee=new Map,ne=!0;try{const t=await grist.docApi.fetchTable("_grist_Attachments");(Array.isArray(t?.id)?t.id:[]).forEach((s,r)=>{const i=Number(s);if(!Number.isInteger(i)||i<=0)return;const a=u(t.fileName?.[r])||`Pièce jointe ${i}`,o=u(t.fileExt?.[r])||Kt(a),l=u(t.fileType?.[r]),d=Number(t.fileSize?.[r])||0;Ee.set(i,{id:i,fileName:a,fileExt:o,fileType:l,fileSize:d,imageWidth:Number(t.imageWidth?.[r])||0,imageHeight:Number(t.imageHeight?.[r])||0})})}catch(t){console.warn("Métadonnées des pièces jointes indisponibles :",t)}}}async function le(e){M=Array.isArray(e)?e:[],await Promise.all([He(),Ke()]);const t=document.getElementById("conteneur-kanban");if(!t)return;t.innerHTML="";const n=await c.col.STATUT.getChoices();if(!Array.isArray(n)||n.length===0){t.innerHTML=`<div class="kanban-message">${f(y("No choice available in the Status column"))}</div>`;return}n.forEach((s,r)=>{const i=nn(s,r);i&&t.appendChild(i)}),M.forEach(s=>{const r=u(s.STATUT),i=Array.from(t.querySelectorAll(".contenu-colonne")).find(a=>a.dataset.statut===r);i&&i.insertBefore(sn(s),i.firstChild)}),ln(),document.querySelectorAll(".colonne-kanban").forEach(Ne)}function Zt(){const e=document.getElementById("config-view");!e||e.dataset.autosaveInstalled==="true"||(e.dataset.autosaveInstalled="true",e.addEventListener("input",t=>{t.target.matches("input, textarea, select")&&ke()}),e.addEventListener("change",t=>{t.target.matches("input, textarea, select")&&ke()}),e.addEventListener("click",t=>{t.target.closest(".config-switch")&&window.setTimeout(ke,0)}))}function ke(){window.clearTimeout(je),ue("saving","Sauvegarde…"),je=window.setTimeout(en,350)}async function en(){if(!(ye||!c?._parameters||!c?._config||c._config.style.display==="none")){ye=!0;try{c.opt=await c.readOptionValues(c._parameters,c._config,c.opt),await grist.widgetApi.setOption("options",JSON.parse(JSON.stringify(c.opt))),await Ae(),ue("saved","Enregistré"),window.setTimeout(()=>{ue("","")},1400)}catch(e){console.error("Impossible de sauvegarder automatiquement la configuration :",e),ue("error","Échec de la sauvegarde")}finally{ye=!1}}}function ue(e,t){const n=document.getElementById("config-view");if(!n||n.style.display==="none")return;let s=n.querySelector(".config-autosave-status");!s&&t&&(s=document.createElement("div"),s.className="config-autosave-status",s.setAttribute("aria-live","polite"),n.appendChild(s)),s&&(s.className=`config-autosave-status${e?` ${e}`:""}`,s.textContent=t,s.hidden=!t)}async function Ae(){await c.isMapped(),await le(M)}async function tn(){Se(),Ce(),ne=!1,W=null,await Promise.all([He(!0),Ke(!0)]),await le(M)}function nn(e,t){const n=qt(t);if(n.hidecolumn)return null;const s=u(e),r=document.createElement("section");r.className=`colonne-kanban${!n.addbutton&&!c.opt.compact?" colonne-nobouton":""}`,r.id=s,localStorage.getItem(xt(s))==="true"&&r.classList.add("collapsed");const i=c.col.STATUT.getColor(s)??be,a=c.col.STATUT.getTextColor(s)??Je,o=Vs(s);return r.innerHTML=`
        <div class="entete-colonne" style="background-color:${i};color:${a}">
            <div class="titre-statut">${f(s)} <span class="compteur-colonne">(0)</span></div>
            <div class="actions-colonne">
                ${n.addbutton&&!c.opt.readonly?`<button type="button" class="bouton-ajouter-entete ${c.opt.compact?"compact":""}" onclick="creerNouvelleTache(decodeURIComponent('${o}'))" aria-label="${m(y("Add a new task"))}">+</button>`:""}
                <button type="button" class="bouton-toggle" onclick="toggleColonne(this.closest('.colonne-kanban'), event)" aria-label="Replier ou déplier">⇄</button>
            </div>
        </div>
        ${n.addbutton&&!c.opt.readonly?`<button type="button" class="bouton-ajouter ${c.opt.compact?"compact":""}" onclick="creerNouvelleTache(decodeURIComponent('${o}'))">+ ${f(y("Add a new task"))}</button>`:""}
        <div class="contenu-colonne" data-statut="${m(s)}" data-isdone="${n.isdone?"true":"false"}"></div>
    `,r}function sn(e){const t=document.createElement("article"),n=c.opt.cardrotation===!0;t.className=`carte${n?"":" norotate"}${c.opt.compact?" compact":""}`,t.dataset.todoId=String(e.id),t.dataset.lastUpdate=Ht(e.DERNIERE_MISE_A_JOUR),t.dataset.deadline=Ht(e.DEADLINE),t.dataset.order=pn(e.ORDRE),cn(t,e.COULEUR);const s=e.DEADLINE?jt(e.DEADLINE):"",r=Ot(e),i=_t(e),a=Ut(e),o=x(e.CHECKLIST).flatMap(te=>te.items||[]),l=o.filter(te=>te.done).length,d=$(e.PIECES_JOINTES).length,p=me(e.LIENS).length,b=X(e.COMMENTAIRES).length,v=e.DESCRIPTION_DISPLAY?String(e.DESCRIPTION_DISPLAY):f(u(e.DESCRIPTION)||y("No description")),h=a.map(te=>on(te)).join(""),k=rn(r,i),U=xe(e.STATUT),A=pe(e.DEADLINE),Ue=A!==null&&A<Date.now()&&A<K.getTime(),he=c.opt.showlabels!==!1,ee=c.opt.showmembers!==!1,Xs=c.opt.showresponsables!==!1,Ys=c.opt.showdeadline!==!1,zt=c.opt.showindicators!==!1,Zs=c.opt.showchecklistprogress!==!1,Wt=(ee||Xs)&&k,Qt=`
        ${Zs&&o.length?`<span title="${l} élément(s) terminé(s) sur ${o.length}">☑ ${l}/${o.length}</span>`:""}
        ${zt&&d+p?`<span title="${d} fichier(s) et ${p} lien(s)">📎 ${d+p}</span>`:""}
        ${zt&&b?`<span title="${b} commentaire(s)">💬 ${b}</span>`:""}
    `;return t.innerHTML=`
        ${he&&h?`<div class="etiquettes-list">${h}</div>`:""}
        <div class="description">${v}</div>
        ${Ys&&s?`<div class="deadline${Ue?" late":""} truncate">📅 ${f(s)}</div>`:""}
        ${Wt||Qt.trim()?`<div class="card-footer">
                <div class="card-indicators">${Qt}</div>
                ${Wt?`<div class="card-team-stack" aria-label="Équipe de la carte">${k}</div>`:""}
               </div>`:""}
        ${U?.isdone?`<div class="tampon-termine" style="color:${c.col.STATUT.getColor(e.STATUT)??be};">${f(u(e.STATUT))}</div>`:""}
    `,t.addEventListener("click",()=>{grist.setCursorPos({rowId:e.id}),c.opt.hideedit||Q(e)}),t.addEventListener("dblclick",()=>{grist.setCursorPos({rowId:e.id}),c.opt.gristeditcard?grist.commandApi.run("viewAsCard"):c.opt.hideedit||Q(e)}),t}function rn(e,t){const n=new Set(t.map(a=>Number(a.id)).filter(a=>Number.isInteger(a)&&a>0)),s=[...t.map(a=>({...a,role:"responsable"})),...e.filter(a=>!n.has(Number(a.id))).map(a=>({...a,role:"membre"}))],r=s.slice(0,6),i=s.length-r.length;return[...r.map(a=>an(a,a.role)),i>0?`<span class="card-team-more" title="${i} autre(s) membre(s)">+${i}</span>`:""].join("")}function an(e,t="membre"){const n=t==="responsable",s=n?"Responsable":"Membre";return`
        <span
            class="responsable-avatar ${n?"responsable-avatar-principal":"membre-avatar"}"
            style="background:${m(e.avatarColor)}"
            title="${m(`${s} : ${e.label}`)}"
            aria-label="${m(`${s} : ${e.label}`)}"
        >${f(e.initials)}</span>
    `}function on(e){return`
        <span
            class="etiquette-badge"
            style="background:${m(e.color)};color:${m(e.textColor)}"
            title="${m(e.label)}"
        >${f(e.label)}</span>
    `}function cn(e,t){const n=S(t)||S(c.opt?.defaultcardcolor)||"#FFFFD1";e.style.backgroundColor=n}function ln(){document.querySelectorAll(".contenu-colonne").forEach(e=>{mn(e),!(c.opt.readonly||typeof Sortable!="function")&&new Sortable(e,{group:"kanban-todo",animation:150,ghostClass:"carte-fantome",chosenClass:"carte-selectionnee",onEnd:async t=>{const n=t.to.dataset.statut,s=t.from.dataset.statut,r=Number(t.item.dataset.todoId),i=Array.from(t.to.querySelectorAll(".carte")).map(o=>Number(o.dataset.todoId)),a=t.from===t.to?[]:Array.from(t.from.querySelectorAll(".carte")).map(o=>Number(o.dataset.todoId));try{n!==s&&await N(r,"STATUT",n),c.map?.ORDRE&&!c.col.ORDRE.getIsFormula()?await un(i,a):(await Ze(t.to),t.from!==t.to&&await Ze(t.from))}catch(o){console.error(y("Error during status update:"),o),await le(M)}Ne(t.to.closest(".colonne-kanban")),t.from!==t.to&&Ne(t.from.closest(".colonne-kanban"))}})})}async function un(e,t=[]){const n=[],s=new Set;[e,t].forEach(r=>{const i=O(r).map(Number).filter(o=>Number.isInteger(o)&&o>0),a=i.join(",");i.length>0&&!s.has(a)&&(s.add(a),n.push(i))});for(const r of n)await dn(r)}async function dn(e){if(!c.map?.ORDRE||c.col.ORDRE.getIsFormula())return;const t=e.map((n,s)=>{const r=(s+1)*1e3,i=g(n),a=F(n);return i&&(i.ORDRE=r),a&&(a.dataset.order=String(r)),c.formatRecord(n,{ORDRE:r})});t.length>0&&await c.updateRecords(t)}async function Ze(e){if(!c.map?.DEADLINE||!e)return;const n=Array.from(e.querySelectorAll(".carte")).filter(i=>{const a=pe(i.dataset.deadline);return a===null||a>=K.getTime()});if(n.length===0)return;let s=K.getFullYear();const r=n.map(i=>{const a=`${s}-01-01`;return s+=1,i.dataset.deadline=a,c.formatRecord(i.dataset.todoId,{DEADLINE:a})});await c.updateRecords(r)}function mn(e){if(!e)return;const t=e.dataset.isdone==="true",n=Array.from(e.children);n.sort((s,r)=>{let i=0;return c.map?.ORDRE?i=et(s.dataset.order)-et(r.dataset.order):c.map?.DEADLINE&&(t?i=fe(r.dataset.lastUpdate,0)-fe(s.dataset.lastUpdate,0):i=fe(s.dataset.deadline,Number.MAX_SAFE_INTEGER)-fe(r.dataset.deadline,Number.MAX_SAFE_INTEGER)),i!==0?i:(Number(s.dataset.todoId)||0)-(Number(r.dataset.todoId)||0)}),n.forEach(s=>e.appendChild(s))}function pn(e){const t=Number(e);return Number.isFinite(t)?String(t):""}function et(e){const t=Number(e);return Number.isFinite(t)?t:Number.MAX_SAFE_INTEGER}function Ne(e){if(!e)return;const t=e.querySelector(".contenu-colonne"),n=e.querySelector(".compteur-colonne");t&&n&&(n.textContent=`(${t.children.length})`)}async function Q(e){const t=document.getElementById("popup-todo");if(!t)return;if(c.opt.readonly){Y();return}document.querySelector(".carte.active")?.classList.remove("active"),F(e.id)?.classList.add("active");const n=xe(e.STATUT),s=c.col.STATUT.getColor(e.STATUT)??be,r=c.col.STATUT.getTextColor(e.STATUT)??Je;t.style.setProperty("--task-status-color",s),t.style.setProperty("--task-status-text",r),t.style.borderLeftColor="transparent",t.dataset.statut=u(e.STATUT),t.dataset.isdone=n?.isdone?"true":"false",t.dataset.currentTodo=String(e.id);const i=t.querySelector(".popup-title"),a=t.querySelector(".popup-content"),o=t.querySelector(".popup-header"),l=t.querySelector(".bouton-fermer");if(i&&(i.textContent=""),o&&(o.style.backgroundColor="",o.style.color=""),l&&(l.style.color=""),!a)return;const d=c.map?.NOTES?c.col.NOTES.getIsFormula():!1,p=c.col.DESCRIPTION.getIsFormula(),b=wn(e),v=c.opt.showmetadata!==!1?zs(e):"",h=c.map?.NOTES?xn(e,d):"",k=c.map?.COMMENTAIRES&&c.opt.showcomments!==!1?Ts(e):"",U=!!(h||b.checklists||k),A=!!b.context;a.innerHTML=`
        <div class="task-detail-shell task-detail-v8" data-row-id="${Number(e.id)}">
            <section class="task-hero">
                <div class="task-hero-accent" aria-hidden="true"></div>
                <div class="task-hero-copy">
                    <div class="task-title-meta">
                        <span
                            class="task-status-pill"
                            style="background:${m(s)};color:${m(r)}"
                        >${f(u(e.STATUT))}</span>
                        ${n?.isdone?'<span class="task-completed-pill">✓ Terminée</span>':'<span class="task-type-caption">Carte de travail</span>'}
                    </div>
                    <textarea
                        class="task-detail-title auto-expand"
                        aria-label="Nom de la tâche"
                        placeholder="Nom de la tâche"
                        oninput="ajusterTextarea(this)"
                        onchange="mettreAJourTitreFiche(${Number(e.id)}, this, event)"
                        ${p?"disabled":""}
                    >${f(u(e.DESCRIPTION))}</textarea>
                </div>
            </section>

            <div class="task-actions-dock">
                ${fn()}
            </div>
            ${hn(e)}

            <div class="task-detail-layout${A?" has-context":" no-context"}">
                ${A?`
                    <aside class="task-context-column" aria-label="Détails de la carte">
                        <div class="task-column-heading">
                            <span class="task-column-heading-icon">◫</span>
                            <div>
                                <strong>Détails</strong>
                                <small>Informations actives de la carte</small>
                            </div>
                        </div>
                        ${b.context}
                    </aside>
                `:""}

                ${U?`
                    <main class="task-main-column">
                        ${h}
                        ${b.checklists}
                        ${k}
                    </main>
                `:""}
            </div>

            ${v?`<div class="task-detail-metadata">${v}</div>`:""}

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
    `,a.querySelectorAll(".auto-expand").forEach(H),t.classList.add("visible"),t.classList.remove("task-panel-open"),vt(a),c.map?.PIECES_JOINTES&&$(e.PIECES_JOINTES).length>0&&await ys(e.id)}function fn(e){const t=!!(c.map?.CHECKLIST&&!c.col.CHECKLIST.getIsFormula()),n=!!(c.map?.MEMBRES&&!c.col.MEMBRES.getIsFormula()||c.map?.RESPONSABLE&&!c.col.RESPONSABLE.getIsFormula()),s=!!(c.map?.PIECES_JOINTES&&!c.col.PIECES_JOINTES.getIsFormula()||c.map?.LIENS&&!c.col.LIENS.getIsFormula());return`
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
                ${t?"":"disabled"}
            ><span>☑</span><strong>Checklist</strong></button>

            <button
                type="button"
                class="task-quick-button"
                data-panel-trigger="people"
                aria-expanded="false"
                onclick="ouvrirPanneauFiche('people', event)"
                ${n?"":"disabled"}
            ><span>👥</span><strong>Membres</strong></button>

            <button
                type="button"
                class="task-quick-button"
                data-panel-trigger="resources"
                aria-expanded="false"
                onclick="ouvrirPanneauFiche('resources', event)"
                ${s?"":"disabled"}
            ><span>📎</span><strong>Pièce jointe</strong></button>
        </nav>
    `}function hn(e){return`
        <div class="task-action-layer">
            <div class="task-action-panels">${[bn(),c.map?.ETIQUETTES?gn(e):"",c.map?.DEADLINE?vn(e):"",c.map?.CHECKLIST?En(e):"",c.map?.MEMBRES||c.map?.RESPONSABLE?yn(e):"",c.map?.PIECES_JOINTES||c.map?.LIENS?Sn(e):"",c.map?.COULEUR?Cn(e):""].filter(Boolean).join("")}</div>
        </div>
    `}function bn(e){const t=[];return c.map?.ETIQUETTES&&t.push(["🏷️","Étiquettes","labels"]),c.map?.DEADLINE&&t.push(["📅","Dates","date"]),c.map?.CHECKLIST&&t.push(["☑","Checklist","checklist"]),(c.map?.MEMBRES||c.map?.RESPONSABLE)&&t.push(["👥","Membres","people"]),(c.map?.PIECES_JOINTES||c.map?.LIENS)&&t.push(["📎","Pièce jointe","resources"]),c.map?.COULEUR&&t.push(["🎨","Couleur de carte","color"]),`
        <section class="task-action-panel task-add-menu" data-panel="add" hidden>
            <div class="task-panel-heading">
                <div><strong>Ajouter à la carte</strong><span>Choisissez un élément</span></div>
                <button type="button" onclick="fermerPanneauxFiche(event)" aria-label="Fermer">×</button>
            </div>
            <div class="task-add-grid">
                ${t.map(([n,s,r])=>`
                    <button
                        type="button"
                        onclick="ouvrirPanneauFiche('${r}', event, true)"
                    ><span>${n}</span><strong>${f(s)}</strong></button>
                `).join("")||'<div class="section-empty">Aucun champ supplémentaire n’est mappé.</div>'}
            </div>
        </section>
    `}function gn(e){const t=new Set(Oe(e)),n=c.col.ETIQUETTES.getIsFormula();return`
        <section class="task-action-panel" data-panel="labels" hidden>
            <div class="task-panel-heading">
                <div><strong>Étiquettes</strong><span>Sélectionnez les étiquettes actives</span></div>
                <button type="button" onclick="fermerPanneauxFiche(event)" aria-label="Fermer">×</button>
            </div>
            <div class="task-panel-search">
                <input type="search" placeholder="Rechercher une étiquette…" oninput="filtrerPanneauFiche(this)">
            </div>
            <div class="task-panel-options" data-row-id="${Number(e.id)}">
                ${J.map(s=>`
                    <label class="task-check-option" data-search="${m(s.label.toLocaleLowerCase(c.cultureFull))}">
                        <input
                            type="checkbox"
                            value="${s.id}"
                            ${t.has(s.id)?"checked":""}
                            onchange="enregistrerEtiquettesDepuisPanneau(${Number(e.id)}, this.closest('.task-action-panel'), event)"
                            ${n?"disabled":""}
                        >
                        <span class="task-option-label-color" style="background:${m(s.color)};color:${m(s.textColor)}">${f(s.label)}</span>
                    </label>
                `).join("")||'<div class="section-empty">Aucune étiquette disponible.</div>'}
            </div>
            <div class="task-panel-status section-status" aria-live="polite"></div>
        </section>
    `}function vn(e){const t=c.col.DEADLINE.getIsFormula();return`
        <section class="task-action-panel" data-panel="date" hidden>
            <div class="task-panel-heading">
                <div><strong>Date limite</strong><span>Ajoutez ou modifiez l’échéance de la carte</span></div>
                <button type="button" onclick="fermerPanneauxFiche(event)" aria-label="Fermer">×</button>
            </div>
            <div class="task-date-editor">
                <input
                    type="date"
                    value="${m(Ws(e.DEADLINE))}"
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
    `}function En(e){const t=c.col.CHECKLIST.getIsFormula();return`
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
    `}function yn(e){const t=new Set(Hs(e)),n=new Set(Ks(e)),s=!c.map?.MEMBRES||c.col.MEMBRES.getIsFormula(),r=!c.map?.RESPONSABLE||c.col.RESPONSABLE.getIsFormula();return`
        <section class="task-action-panel task-people-panel" data-panel="people" hidden>
            <div class="task-panel-heading">
                <div>
                    <strong>Équipe de la carte</strong>
                    <span>Attribuez un rôle à chaque personne sans dupliquer les listes</span>
                </div>
                <button type="button" onclick="fermerPanneauxFiche(event)" aria-label="Fermer">×</button>
            </div>

            <div class="task-panel-search">
                <input
                    type="search"
                    placeholder="Rechercher une personne…"
                    oninput="filtrerPanneauFiche(this)"
                >
            </div>

            <div class="task-people-legend" aria-hidden="true">
                <span>Personne</span>
                <span>Membre</span>
                <span>Responsable</span>
            </div>

            <div class="task-people-roster">
                ${I.map(i=>`
                    <div
                        class="task-person-row"
                        data-search="${m(`${i.label} ${i.email||""}`.toLocaleLowerCase(c.cultureFull))}"
                    >
                        <div class="task-person-identity">
                            <span
                                class="task-person-avatar"
                                style="background:${m(i.avatarColor)}"
                            >${f(i.initials)}</span>
                            <span class="task-person-copy">
                                <strong>${f(i.label)}</strong>
                                ${i.email?`<small>${f(i.email)}</small>`:""}
                            </span>
                        </div>

                        <label class="person-role-toggle">
                            <input
                                type="checkbox"
                                data-role="MEMBRES"
                                value="${i.id}"
                                ${t.has(i.id)?"checked":""}
                                onchange="enregistrerRolePersonneDepuisPanneau(
                                    ${Number(e.id)},
                                    'MEMBRES',
                                    this.closest('.task-action-panel'),
                                    event
                                )"
                                ${s?"disabled":""}
                            >
                            <span>Membre</span>
                        </label>

                        <label class="person-role-toggle person-role-toggle-responsable">
                            <input
                                type="checkbox"
                                data-role="RESPONSABLE"
                                value="${i.id}"
                                ${n.has(i.id)?"checked":""}
                                onchange="enregistrerRolePersonneDepuisPanneau(
                                    ${Number(e.id)},
                                    'RESPONSABLE',
                                    this.closest('.task-action-panel'),
                                    event
                                )"
                                ${r?"disabled":""}
                            >
                            <span>Responsable</span>
                        </label>
                    </div>
                `).join("")||'<div class="section-empty">Aucune personne disponible dans la table Membres.</div>'}
            </div>

            <div class="task-panel-status section-status" aria-live="polite"></div>
        </section>
    `}function Sn(e){const t=!!(c.map?.PIECES_JOINTES&&!c.col.PIECES_JOINTES.getIsFormula()),n=!!(c.map?.LIENS&&!c.col.LIENS.getIsFormula());return`
        <section class="task-action-panel" data-panel="resources" hidden>
            <div class="task-panel-heading">
                <div><strong>Pièce jointe ou lien</strong><span>Ajoutez un fichier Grist ou un lien personnalisé</span></div>
                <button type="button" onclick="fermerPanneauxFiche(event)" aria-label="Fermer">×</button>
            </div>

            <div class="resource-add-tabs">
                ${t?`
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
                            onchange="ajouterPiecesJointes(${Number(e.id)}, this, event)"
                        >
                    </div>
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
    `}function Cn(e){const t=S(e.COULEUR),n=t||S(c.opt?.defaultcardcolor)||"#FFFFD1",s=c.col.COULEUR.getIsFormula();return`
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
                    ${s?"disabled":""}
                >
                <input
                    type="text"
                    class="field-input color-value"
                    value="${m(t||"")}"
                    placeholder="#FFFFD1"
                    maxlength="7"
                    onchange="mettreAJourCouleurFiche(${Number(e.id)}, this.value, this, event)"
                    ${s?"disabled":""}
                >
                <button
                    type="button"
                    onclick="mettreAJourCouleurFiche(${Number(e.id)}, '', this, event)"
                    ${s?"disabled":""}
                >Réinitialiser</button>
            </div>
            <div class="task-panel-status section-status color-status" aria-live="polite"></div>
        </section>
    `}function wn(e){const t=[],n=Ut(e),s=Ot(e),r=_t(e),i=S(e.COULEUR),a=x(e.CHECKLIST),o=$(e.PIECES_JOINTES),l=me(e.LIENS);n.length>0&&t.push($n(e,n)),e.DEADLINE&&t.push(kn(e)),(s.length>0||r.length>0)&&t.push(An(e,s,r)),i&&t.push(Nn(e,i));const d=[];return t.length>0&&d.push(`<div class="task-property-grid">${t.join("")}</div>`),(o.length>0||l.length>0)&&c.opt.showattachments!==!1&&d.push(bs(e,o,l)),{context:d.join(""),checklists:a.length>0&&c.opt.showchecklist!==!1?is(e,a):""}}function $n(e,t){return`
        <section class="task-property-card task-label-property">
            <div class="task-property-heading">
                <span>Étiquettes</span>
            </div>
            <div class="task-property-content task-label-chips">
                ${t.map(n=>`
                    <span
                        class="etiquette-active"
                        style="background:${m(n.color)};color:${m(n.textColor)}"
                    >
                        <span>${f(n.label)}</span>
                        ${c.col.ETIQUETTES.getIsFormula()?"":`
                            <button
                                type="button"
                                onclick="retirerEtiquetteFiche(
                                    ${Number(e.id)},
                                    ${Number(n.id)},
                                    event
                                )"
                                aria-label="Retirer ${m(n.label)}"
                            >×</button>
                        `}
                    </span>
                `).join("")}
                ${c.col.ETIQUETTES.getIsFormula()?"":`
                    <button
                        type="button"
                        class="task-label-inline-add"
                        onclick="ouvrirPanneauFiche('labels', event, true)"
                        aria-label="Ajouter une étiquette"
                        title="Ajouter une étiquette"
                    >+</button>
                `}
            </div>
        </section>
    `}function kn(e){const t=pe(e.DEADLINE),n=t!==null&&t<Date.now();return`
        <section
            class="task-property-card task-date-property${n?" is-late":""}"
            onclick="ouvrirPanneauFiche('date', event, true)"
        >
            <div class="task-property-heading">
                <span>Date limite</span>
                <button type="button" aria-label="Modifier la date">✎</button>
            </div>
            <div class="task-property-content task-date-summary">
                <span class="task-property-icon">📅</span>
                <div>
                    <strong>${f(jt(e.DEADLINE))}</strong>
                    <small>${n?"Échéance dépassée":"Échéance planifiée"}</small>
                </div>
            </div>
        </section>
    `}function An(e,t,n){const s=new Set(n.map(o=>Number(o.id))),r=t.filter(o=>!s.has(Number(o.id))),i=n.map(o=>`
        <span
            class="team-person-chip team-person-chip-responsable"
            title="Responsable : ${m(o.label)}"
        >
            <span
                class="team-person-chip-avatar"
                style="background:${m(o.avatarColor)}"
            >${f(o.initials)}</span>
            <span class="team-person-chip-name">${f(o.label)}</span>
            <small>Responsable</small>
        </span>
    `).join(""),a=r.map(o=>`
        <span
            class="team-person-chip"
            title="Membre : ${m(o.label)}"
        >
            <span
                class="team-person-chip-avatar"
                style="background:${m(o.avatarColor)}"
            >${f(o.initials)}</span>
            <span class="team-person-chip-name">${f(o.label)}</span>
        </span>
    `).join("");return`
        <section class="task-property-card task-people-property">
            <div class="task-property-heading">
                <span>Équipe</span>
                <button
                    type="button"
                    onclick="ouvrirPanneauFiche('people', event, true)"
                    aria-label="Modifier l’équipe"
                >✎</button>
            </div>
            <div class="task-property-content team-summary-list">
                ${i}
                ${a}
                <button
                    type="button"
                    class="team-inline-add"
                    onclick="ouvrirPanneauFiche('people', event, true)"
                    aria-label="Ajouter un membre ou un responsable"
                >+</button>
            </div>
        </section>
    `}function Nn(e,t){return`
        <section
            class="task-property-card task-color-property"
            onclick="ouvrirPanneauFiche('color', event, true)"
        >
            <div class="task-property-heading">
                <span>Couleur</span>
                <button type="button" aria-label="Modifier la couleur">✎</button>
            </div>
            <div class="task-property-content task-color-summary">
                <span style="background:${m(t)}"></span>
                <div>
                    <strong>Couleur personnalisée</strong>
                    <small>${f(t)}</small>
                </div>
            </div>
        </section>
    `}function tt(e,t,n=!1){t?.preventDefault(),t?.stopPropagation();const s=document.getElementById("popup-todo"),r=s?.querySelector(`.task-action-panel[data-panel="${e}"]`);if(!s||!r)return;const i=!r.hidden;if(s.querySelectorAll(".task-action-panel").forEach(a=>{a.hidden=!0}),s.querySelectorAll(".task-quick-button").forEach(a=>{a.classList.remove("active"),a.setAttribute("aria-expanded","false")}),!i||n){r.hidden=!1,s.classList.add("task-panel-open");const a=s.querySelector(`[data-panel-trigger="${e}"]`);a?.classList.add("active"),a?.setAttribute("aria-expanded","true"),window.setTimeout(()=>{r.querySelector('input:not([type="checkbox"]):not([type="file"]), textarea, button')?.focus()},0)}else B(t)}function B(e){e?.preventDefault(),e?.stopPropagation();const t=document.getElementById("popup-todo");t?.querySelectorAll(".task-action-panel").forEach(n=>{n.hidden=!0}),t?.querySelectorAll(".task-quick-button").forEach(n=>{n.classList.remove("active"),n.setAttribute("aria-expanded","false")}),t?.classList.remove("task-panel-open")}function Tn(e){const t=e.closest(".task-action-panel"),n=u(e.value).trim().toLocaleLowerCase(c.cultureFull);t?.querySelectorAll("[data-search]").forEach(s=>{s.hidden=n!==""&&!u(s.dataset.search).includes(n)})}async function w(e,t=""){const n=document.getElementById("popup-todo"),r=n?.querySelector(".popup-content")?.scrollTop||0,i=g(e);if(!i)return;await Q(i);const a=n?.querySelector(".popup-content");a&&(a.scrollTop=r),t&&tt(t,null,!0)}async function In(e,t,n){const s=u(t?.value).trim();await N(e,"DESCRIPTION",s,n);const r=F(e)?.querySelector(".description");r&&(r.textContent=s||y("No description"))}async function Ln(e,t,n,s,r){const a=r?.target?.closest(".task-action-panel")?.querySelector(".task-panel-status");try{a&&(a.className="task-panel-status section-status saving",a.textContent="Enregistrement…"),await N(e,t,n,r),await w(e,s)}catch{a&&(a.className="task-panel-status section-status error",a.textContent="Impossible d’enregistrer.")}}async function Rn(e,t,n){n?.stopPropagation();const s=t?.querySelector(".task-panel-status"),r=Array.from(t.querySelectorAll('input[type="checkbox"]:checked')).map(i=>Number(i.value)).filter(i=>P.has(i));try{s&&(s.className="task-panel-status section-status saving",s.textContent="Enregistrement…"),await G(e,"ETIQUETTES",r),Ie(e,r),await w(e,"labels")}catch{s&&(s.className="task-panel-status section-status error",s.textContent="Impossible d’enregistrer les étiquettes.")}}async function Dn(e,t,n){n?.preventDefault(),n?.stopPropagation();const s=g(e),r=Oe(s).filter(i=>i!==Number(t));await G(e,"ETIQUETTES",r),Ie(e,r),await w(e)}async function Mn(e,t,n,s){s?.stopPropagation();const r=n?.querySelector(".task-panel-status"),i=Array.from(n?.querySelectorAll(`input[data-role="${t}"]:checked`)||[]).map(a=>Number(a.value)).filter(a=>C.has(a));try{r&&(r.className="task-panel-status section-status saving",r.textContent="Enregistrement…"),await G(e,t,i),lt(e,t,i),r&&(r.className="task-panel-status section-status saved",r.textContent=t==="RESPONSABLE"?"Responsables enregistrés.":"Membres enregistrés."),await w(e,"people")}catch(a){console.error("Impossible d’enregistrer le rôle :",a),r&&(r.className="task-panel-status section-status error",r.textContent="Impossible d’enregistrer ce rôle.")}}function Pn(e,t,n){n.key==="Enter"&&(n.preventDefault(),nt(e,t,n))}async function nt(e,t,n){n?.preventDefault(),n?.stopPropagation();const s=t.closest(".task-action-panel"),r=s?.querySelector(".new-checklist-title"),i=s?.querySelector(".task-panel-status"),a=u(r?.value).trim();if(!a){i&&(i.className="task-panel-status section-status error",i.textContent="Saisissez un titre."),r?.focus();return}await D(e,o=>[...o,{id:_(),title:a,items:[],createdAt:new Date().toISOString()}]),await w(e)}async function qn(e,t,n,s){const i=n?.closest(".task-action-panel")?.querySelector(".task-panel-status"),a=u(t).trim(),o=S(a);if(a&&!o){i&&(i.className="task-panel-status section-status error",i.textContent="Utilisez un code hexadécimal valide.");return}try{i&&(i.className="task-panel-status section-status saving",i.textContent="Enregistrement…"),await N(e,"COULEUR",o||null,s);const l=F(e);l&&(l.style.backgroundColor=o||S(c.opt?.defaultcardcolor)||"#FFFFD1"),await w(e,"color")}catch{i&&(i.className="task-panel-status section-status error",i.textContent="Impossible d’enregistrer la couleur.")}}function xn(e,t){const n=Number(e.id),s=Un(e.NOTES),r=at(s).trim().length>0,i=t?"disabled":"",a=[["bold","<strong>B</strong>","Gras"],["italic","<em>I</em>","Italique"],["underline","<u>U</u>","Souligné"],["strikeThrough","<s>S</s>","Barré"],["insertUnorderedList","• Liste","Liste à puces"],["insertOrderedList","1. Liste","Liste numérotée"],["insertHorizontalRule","―","Ligne de séparation"],["removeFormat","Tx","Effacer la mise en forme"],["undo","↶","Annuler"],["redo","↷","Rétablir"]].map(([o,l,d])=>`
        <button
            type="button"
            class="notes-tool"
            data-command="${o}"
            onmousedown="event.preventDefault()"
            onclick="appliquerCommandeNotes(this, '${o}', null, event)"
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
                    ${i}
                >✏️ Modifier</button>
            </div>

            <div
                class="notes-display${r?"":" empty"}"
                tabindex="0"
            >${r?s:"Aucune note pour cette tâche."}</div>

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

                    ${a}

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
                >${s}</div>

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
    `}function Fn(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".notes-field"),s=n?.querySelector(".notes-edit-panel"),r=n?.querySelector(".notes-display"),i=n?.querySelector(".notes-editor");!n||!s||!r||!i||n.dataset.disabled==="true"||(n._originalNotesHtml=V(i.innerHTML),n.classList.add("is-editing"),n.classList.remove("is-dirty"),r.hidden=!0,s.hidden=!1,e.hidden=!0,document.execCommand("defaultParagraphSeparator",!1,"p"),i.focus(),zn(i),j(i),q(Number(n.dataset.rowId),"",""))}function On(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".notes-field"),s=n?.querySelector(".notes-editor");!n||!s||(s.innerHTML=n._originalNotesHtml||"",st(n,!1))}async function _n(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".notes-field"),s=n?.querySelector(".notes-editor"),r=Number(n?.dataset?.rowId);if(!(!n||!s||!Number.isInteger(r)||r<=0)){e.disabled=!0;try{const i=await Wn(r,s);n._originalNotesHtml=i,st(n,!0)}finally{e.disabled=!1}}}function st(e,t){const n=e.querySelector(".notes-edit-panel"),s=e.querySelector(".notes-display"),r=e.querySelector(".notes-editor"),i=e.querySelector(".notes-edit-button");if(t&&s&&r){const a=V(r.innerHTML).trim(),o=at(a).trim().length>0;s.innerHTML=o?a:"Aucune note pour cette tâche.",s.classList.toggle("empty",!o)}e.classList.remove("is-editing","is-dirty"),n&&(n.hidden=!0),s&&(s.hidden=!1),i&&(i.hidden=!1),q(Number(e.dataset.rowId),"","")}function Un(e){const t=u(e).trim();if(!t)return"";const s=/<\/?[a-z][\s\S]*>/i.test(t)?t:f(t).replace(/\r?\n/g,"<br>");return V(s)}function V(e){const t=document.createElement("template");t.innerHTML=u(e);const n=new Set(["B","STRONG","I","EM","U","S","STRIKE","A","UL","OL","LI","P","DIV","BR","BLOCKQUOTE","H2","H3","SPAN","CODE","PRE","HR","MARK"]),s=new Set(["SCRIPT","STYLE","IFRAME","OBJECT","EMBED","FORM","INPUT","BUTTON","SVG","MATH","META","LINK"]),r=i=>{Array.from(i.childNodes).forEach(a=>{if(a.nodeType===Node.ELEMENT_NODE){if(s.has(a.tagName)){a.remove();return}if(!n.has(a.tagName)){r(a),a.replaceWith(...Array.from(a.childNodes));return}if(Array.from(a.attributes).forEach(o=>{a.tagName==="A"&&["href","target","rel"].includes(o.name.toLowerCase())||a.removeAttribute(o.name)}),a.tagName==="A"){const o=it(a.getAttribute("href"));if(!o){a.replaceWith(...Array.from(a.childNodes));return}a.setAttribute("href",o),a.setAttribute("target","_blank"),a.setAttribute("rel","noopener noreferrer")}r(a)}else a.nodeType!==Node.TEXT_NODE&&a.remove()})};return r(t.content),t.innerHTML}function Jn(e,t){t?.preventDefault(),t?.stopPropagation();const s=e.closest(".notes-field")?.querySelector(".notes-editor");!s||s.contentEditable!=="true"||(s.focus(),document.execCommand("formatBlock",!1,e.value||"p"),L(s),j(s))}function Bn(e,t,n,s){s?.preventDefault(),s?.stopPropagation();const i=e.closest(".notes-field")?.querySelector(".notes-editor");!i||i.contentEditable!=="true"||(i.focus(),document.execCommand(t,!1,n),L(i),j(i))}function jn(e,t,n){n?.preventDefault(),n?.stopPropagation();const r=e.closest(".notes-field")?.querySelector(".notes-editor"),i=window.getSelection();if(!r||r.contentEditable!=="true"||!i||i.rangeCount===0)return;r.focus();const a=i.getRangeAt(0);if(!r.contains(a.commonAncestorContainer))return;const o=a.toString(),l=t==="mark"?"mark":"code";o?document.execCommand("insertHTML",!1,`<${l}>${f(o)}</${l}>`):document.execCommand("insertHTML",!1,`<${l}>&#8203;</${l}>`),L(r),j(r)}function rt(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".notes-field"),s=n?.querySelector(".notes-editor");if(!s||s.contentEditable!=="true")return;s.focus();const r=window.prompt("Adresse du lien :","https://");if(r===null)return;const i=it(r);if(!i){q(Number(n.dataset.rowId),"error","Adresse de lien invalide.");return}const a=window.getSelection();!a||a.isCollapsed?document.execCommand("insertHTML",!1,`<a href="${m(i)}" target="_blank" rel="noopener noreferrer">${f(i)}</a>`):document.execCommand("createLink",!1,i),L(s),j(s)}function it(e){const t=u(e).trim();if(!t)return"";const n=/^(https?:|mailto:|tel:)/i.test(t)?t:`https://${t}`;try{const s=new URL(n);return["http:","https:","mailto:","tel:"].includes(s.protocol)?s.href:""}catch{return""}}function Hn(e,t){if(!t?.clipboardData)return;t.preventDefault();const n=t.clipboardData.getData("text/html"),s=t.clipboardData.getData("text/plain"),r=n?V(n):f(s).replace(/\r?\n/g,"<br>");document.execCommand("insertHTML",!1,r),L(e)}function L(e){const t=e?.closest(".notes-field");t&&(t.classList.add("is-dirty"),q(Number(t.dataset.rowId),"saving","Modifications non enregistrées"))}function j(e){const t=e?.closest(".notes-field");if(!t||!t.classList.contains("is-editing"))return;t.querySelectorAll(".notes-tool[data-command]").forEach(s=>{let r=!1;try{r=document.queryCommandState(s.dataset.command)}catch{r=!1}s.classList.toggle("active",r),s.setAttribute("aria-pressed",r?"true":"false")});const n=t.querySelector(".notes-format-select");if(n){let s="p";try{s=u(document.queryCommandValue("formatBlock")).replace(/[<>]/g,"").toLowerCase()||"p"}catch{s="p"}Array.from(n.options).some(r=>r.value===s)?n.value=s:n.value="p"}}function Kn(e,t){if(!(t.ctrlKey||t.metaKey))return;const n=t.key.toLowerCase();if(n==="k"){t.preventDefault();const s=e.closest(".notes-field")?.querySelector(".notes-tool-link");s&&rt(s,t)}t.shiftKey&&n==="7"&&(t.preventDefault(),document.execCommand("insertOrderedList"),L(e)),t.shiftKey&&n==="8"&&(t.preventDefault(),document.execCommand("insertUnorderedList"),L(e))}function zn(e){const t=document.createRange(),n=window.getSelection();t.selectNodeContents(e),t.collapse(!1),n?.removeAllRanges(),n?.addRange(t)}function at(e){const t=document.createElement("template");return t.innerHTML=u(e),t.content.textContent||""}async function Wn(e,t){if(!t)return"";const n=Number(e),s=V(t.innerHTML).trim(),r=ce.get(n)||Promise.resolve();q(n,"saving","Enregistrement…");const i=r.catch(()=>{}).then(()=>N(n,"NOTES",s||null)).then(()=>(t.innerHTML=s,q(n,"saved","Enregistré"),s)).catch(a=>{throw q(n,"error","Échec de l’enregistrement"),console.error("Erreur pendant l’enregistrement des notes :",a),a}).finally(()=>{ce.get(n)===i&&ce.delete(n)});return ce.set(n,i),i}function q(e,t,n){const s=document.getElementById(`notes-status-${Number(e)}`);s&&(s.className=`section-status notes-status${t?` ${t}`:""}`,s.textContent=n)}function S(e){const t=u(e).trim();if(!t)return"";const n=t.startsWith("#")?t:`#${t}`;return/^#[0-9a-f]{3}$/i.test(n)?`#${n[1]}${n[1]}${n[2]}${n[2]}${n[3]}${n[3]}`.toUpperCase():/^#[0-9a-f]{6}$/i.test(n)?n.toUpperCase():""}function Qn(e,t,n){const s=S(t);if(!s)return;const r=F(e);r&&(r.style.backgroundColor=s);const i=n?.closest(".color-field");if(i){const a=i.querySelector(".color-picker"),o=i.querySelector(".color-value");a&&n!==a&&(a.value=s),o&&n!==o&&(o.value=s)}}async function ot(e,t,n,s){s?.stopPropagation();const r=n?.closest(".color-field"),i=r?.querySelector(".color-status"),a=u(t).trim(),o=S(a);if(a&&!o){i&&(i.className="section-status color-status error",i.textContent="Utilisez un code hexadécimal, par exemple #FFFFD1.");return}try{i&&(i.className="section-status color-status saving",i.textContent="Enregistrement…"),await N(e,"COULEUR",o||null,s);const l=F(e);if(l&&(o?l.style.backgroundColor=o:l.style.backgroundColor=S(c.opt?.defaultcardcolor)||"#FFFFD1"),r){const d=r.querySelector(".color-picker"),p=r.querySelector(".color-value");d&&(d.value=o||S(c.opt?.defaultcardcolor)||"#FFFFD1"),p&&(p.value=o||"")}i&&(i.className="section-status color-status saved",i.textContent="Enregistré",window.setTimeout(()=>{i.className="section-status color-status",i.textContent=""},1200))}catch(l){i&&(i.className="section-status color-status error",i.textContent="Impossible d’enregistrer la couleur."),console.error("Erreur pendant l’enregistrement de la couleur :",l)}}function Vn(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".color-field"),s=Number(n?.dataset?.rowId);if(!n||!Number.isInteger(s)||s<=0)return;const r=n.querySelector(".color-value");r&&(r.value=""),ot(s,"",e,t)}function Gn(e,t,n){const s=Z(e);return s.length===0?"Choisir…":s.length===1?s[0]:`${s.length} ${n||`${t}s`}`}function Xn(e){const t=e.closest(".multi-dropdown");if(!t)return;const n=e.value.trim().toLocaleLowerCase(c.cultureFull);t.querySelectorAll(".multi-option").forEach(s=>{const r=s.querySelector('input[type="checkbox"]'),i=s.dataset.hideWhenSelected==="true"&&r?.checked,a=n!==""&&!u(s.dataset.search).includes(n);s.hidden=!!(i||a)}),ut(t)}function Yn(e,t,n,s,r){r?.preventDefault(),r?.stopPropagation();const i=e.closest(".multi-dropdown");i&&(i.querySelectorAll('input[type="checkbox"]:checked').forEach(a=>{a.checked=!1}),ct(Number(i.dataset.rowId),t,i,n,s,r))}async function ct(e,t,n,s,r,i){i?.stopPropagation();const a=Number(e||n?.dataset?.rowId);if(!Number.isInteger(a)||a<=0||!n)return;const o=Array.from(n.querySelectorAll('input[type="checkbox"]:checked')).map(h=>Number(h.value)).filter(h=>Number.isInteger(h)&&h>0&&C.has(h)),l=o.map(h=>C.get(h)?.label).filter(Boolean),d=n.querySelector("summary");d&&(d.textContent=Gn(l,s,r)),R(n,"saving","Enregistrement…");const p=`${t}:${a}`,v=(se.get(p)||Promise.resolve()).catch(()=>{}).then(()=>G(a,t,o)).then(()=>{lt(a,t,o),R(n,"saved","Enregistré"),window.setTimeout(()=>R(n,"",""),1200)}).catch(h=>{R(n,"error","Échec de l’enregistrement"),console.error(`Erreur lors de l’enregistrement de ${t} :`,h)}).finally(()=>{se.get(p)===v&&se.delete(p)});se.set(p,v),await v}function lt(e,t,n){const s=g(e);s&&(s[`${t}_id`]=[...n],s[t]=n.map(r=>C.get(r)?.label).filter(Boolean))}function Zn(e,t,n){return e.length?e.map(s=>`
        <span
            class="etiquette-active"
            style="background:${m(s.color)};color:${m(s.textColor)}"
            title="${m(s.label)}"
        >
            <span>${f(s.label)}</span>
            ${`
                <button
                    type="button"
                    onclick="retirerEtiquetteActive(
                        ${Number(t)},
                        ${Number(s.id)},
                        this,
                        event
                    )"
                    title="Retirer ${m(s.label)}"
                    aria-label="Retirer ${m(s.label)}"
                >×</button>
            `}
        </span>
    `).join(""):'<span class="etiquettes-empty">Aucune étiquette</span>'}function es(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".multi-dropdown");n&&(n.querySelectorAll('input[type="checkbox"]:checked').forEach(s=>{s.checked=!1}),Te(Number(n.dataset.rowId),n,t))}function ts(e,t,n,s){s?.preventDefault(),s?.stopPropagation();const i=n.closest(".field-etiquettes")?.querySelector(".etiquettes-dropdown");if(!i)return;const a=i.querySelector(`input[type="checkbox"][value="${Number(t)}"]`);a&&(a.checked=!1),Te(Number(e),i,s)}async function Te(e,t,n){n?.stopPropagation();const s=Number(e||t?.dataset?.rowId);if(!Number.isInteger(s)||s<=0||!t)return;const r=Array.from(t.querySelectorAll('input[type="checkbox"]:checked')).map(o=>Number(o.value)).filter(o=>Number.isInteger(o)&&o>0&&P.has(o));ns(t,s,r),R(t,"saving","Enregistrement…");const a=(re.get(s)||Promise.resolve()).catch(()=>{}).then(()=>G(s,"ETIQUETTES",r)).then(()=>{Ie(s,r),R(t,"saved","Enregistré"),window.setTimeout(()=>R(t,"",""),1200)}).catch(o=>{R(t,"error","Échec de l’enregistrement"),console.error("Erreur lors de l’enregistrement des étiquettes :",o)}).finally(()=>{re.get(s)===a&&re.delete(s)});re.set(s,a),await a}function ns(e,t,n){const r=e.closest(".field-etiquettes")?.querySelector(".etiquettes-actives"),i=new Set(n),a=n.map(o=>P.get(o)).filter(Boolean);r&&(r.innerHTML=Zn(a,t)),e.querySelectorAll(".etiquette-option").forEach(o=>{const l=o.querySelector('input[type="checkbox"]'),d=i.has(Number(l?.value));l&&(l.checked=d),o.hidden=d}),ut(e)}function ut(e){if(!e?.classList.contains("etiquettes-dropdown"))return;const t=e.querySelector(".multi-all-selected"),n=Array.from(e.querySelectorAll(".etiquette-option")).filter(s=>!s.hidden);t&&(t.hidden=n.length>0)}function Ie(e,t){const n=g(e);n&&(n.ETIQUETTES_id=[...t],n.ETIQUETTES=t.map(s=>P.get(s)?.label).filter(Boolean))}async function G(e,t,n){const s=c.map?.[t];if(!s||Array.isArray(s))throw new Error(`La colonne ${t} n’est pas correctement mappée.`);const r=[...new Set(O(n).map(Number).filter(d=>Number.isInteger(d)&&d>0))],i=await grist.getTable().getTableId(),a=r.length>0?["L",...r]:null;await grist.docApi.applyUserActions([["UpdateRecord",i,Number(e),{[s]:a}]]);const o=await dt(e,s),l=ss(o);if(!rs(r,l))throw new Error(`Vérification d’écriture échouée pour ${t}. Valeur envoyée : ${JSON.stringify(a)} ; valeur relue : ${JSON.stringify(o)}`);await Mt(e)}async function dt(e,t){const n=await grist.getTable().getTableId(),s=await grist.docApi.fetchTable(n),r=O(s?.id).findIndex(i=>Number(i)===Number(e));if(r<0)throw new Error(`Ligne ${e} introuvable dans la table ${n}.`);return s?.[t]?.[r]}function ss(e){return e==null||e===""?[]:!Array.isArray(e)||e[0]==="E"?[]:e[0]==="L"?$(e.slice(1)):e[0]==="r"?$(e[2]):$(e)}function rs(e,t){const n=[...new Set(e.map(Number))].sort((r,i)=>r-i),s=[...new Set(t.map(Number))].sort((r,i)=>r-i);return n.length===s.length&&n.every((r,i)=>r===s[i])}function R(e,t,n){const s=e?.querySelector(".multi-status");s&&(s.className=`multi-status${t?` ${t}`:""}`,s.textContent=n)}function x(e){const t=u(e).trim();if(!t)return[];try{const n=JSON.parse(t);if(!Array.isArray(n))return[];if(n.length>0&&n.every(r=>!Array.isArray(r?.items))){const r=n.map((i,a)=>pt(i,a));return r.length>0?[{id:"legacy-checklist",title:"Checklist",items:r,createdAt:""}]:[]}return n.map((r,i)=>mt(r,i)).filter(r=>r.title||r.items.length>0)}catch(n){return console.warn("Checklists illisibles, valeur ignorée :",n),[]}}function mt(e,t=0){const n=Array.isArray(e?.items)?e.items.map((s,r)=>pt(s,r)):[];return{id:u(e?.id)||`checklist-${t}-${_()}`,title:u(e?.title||e?.name).trim()||`Checklist ${t+1}`,items:n,createdAt:u(e?.createdAt)}}function pt(e,t=0){return{id:u(e?.id)||`item-${t}-${_()}`,text:u(e?.text).trim(),done:!!e?.done,memberIds:[...new Set($(e?.memberIds||e?.members||[]))],dueDate:ft(e?.dueDate),createdAt:u(e?.createdAt)}}function ft(e){const t=u(e).trim();return/^\d{4}-\d{2}-\d{2}$/.test(t)?t:""}function is(e,t=x(e.CHECKLIST)){if(!t.length)return"";const n=c.col.CHECKLIST.getIsFormula();return`
        <div class="checklists-stack" data-row-id="${Number(e.id)}">
            ${t.map(s=>ht(s,e.id,n)).join("")}
        </div>
    `}function ht(e,t,n){const s=e.items.filter(i=>i.done).length,r=e.items.length>0?Math.round(s/e.items.length*100):0;return`
        <section
            class="detail-section checklist-section"
            data-row-id="${Number(t)}"
            data-checklist-id="${m(e.id)}"
            data-disabled="${n?"true":"false"}"
        >
            <div class="checklist-title-row">
                <div class="checklist-title-main">
                    <span class="task-section-icon task-section-icon-checklist">☑</span>
                    <input
                        type="text"
                        class="checklist-title-input"
                        value="${m(e.title)}"
                        onchange="renommerChecklist(${Number(t)}, '${E(e.id)}', this.value, event)"
                        ${n?"disabled":""}
                    >
                </div>
                <div class="checklist-title-actions">
                    <span class="checklist-progress-percent">${r}%</span>
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

            <div class="checklist-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${r}">
                <span style="width:${r}%"></span>
            </div>

            <div class="checklist-subtitle">
                <span>${s}/${e.items.length} terminé(s)</span>
            </div>

            <div
                class="checklist-items"
                data-row-id="${Number(t)}"
                data-checklist-id="${m(e.id)}"
            >
                ${e.items.length?e.items.map(i=>as(i,e.id,t,n)).join(""):'<div class="section-empty checklist-empty">Cette checklist est vide.</div>'}
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
                id="checklist-status-${Number(t)}-${Et(e.id)}"
                class="section-status checklist-status"
                aria-live="polite"
            ></div>
        </section>
    `}function as(e,t,n,s){const r=e.memberIds.map(a=>C.get(a)).filter(Boolean),i=!e.done&&e.dueDate&&new Date(`${e.dueDate}T23:59:59`).getTime()<Date.now();return`
        <article
            class="checklist-item${e.done?" done":""}${i?" overdue":""}"
            data-item-id="${m(e.id)}"
        >
            ${s?"":`
                <button type="button" class="checklist-drag-handle" title="Déplacer" aria-label="Déplacer">⋮⋮</button>
            `}

            <label class="checklist-check">
                <input
                    type="checkbox"
                    ${e.done?"checked":""}
                    onchange="mettreAJourItemChecklist(${Number(n)}, '${E(t)}', '${E(e.id)}', 'done', this.checked, this, event)"
                    ${s?"disabled":""}
                >
                <span aria-hidden="true"></span>
            </label>

            <div class="checklist-item-content">
                <textarea
                    class="checklist-item-text auto-expand"
                    rows="1"
                    oninput="ajusterTextarea(this)"
                    onchange="mettreAJourItemChecklist(${Number(n)}, '${E(t)}', '${E(e.id)}', 'text', this.value, this, event)"
                    ${s?"disabled":""}
                >${f(e.text)}</textarea>

                <div class="checklist-item-meta">
                    <label class="checklist-due${i?" overdue":""}" title="${i?"Échéance dépassée":"Date limite"}">
                        <span>📅</span>
                        <input
                            type="date"
                            value="${m(e.dueDate)}"
                            onchange="mettreAJourItemChecklist(${Number(n)}, '${E(t)}', '${E(e.id)}', 'dueDate', this.value, this, event)"
                            ${s?"disabled":""}
                        >
                    </label>

                    ${os(e,t,n,r,s)}
                </div>
            </div>

            ${s?"":`
                <button
                    type="button"
                    class="checklist-delete"
                    onclick="supprimerItemChecklist(${Number(n)}, '${E(t)}', '${E(e.id)}', event)"
                    title="Supprimer l’élément"
                    aria-label="Supprimer l’élément"
                >×</button>
            `}
        </article>
    `}function os(e,t,n,s,r){const i=new Set(e.memberIds),a=bt(s);return r?`<div class="checklist-assignees readonly">${a}</div>`:`
        <details class="checklist-assignees">
            <summary>${a}</summary>
            <div class="checklist-assignees-menu">
                <div class="multi-toolbar">
                    <input type="search" class="multi-search" placeholder="Rechercher…" oninput="filtrerOptionsChecklist(this)" onclick="event.stopPropagation()">
                </div>
                <div class="multi-options">
                    ${I.map(o=>`
                        <label class="multi-option checklist-person-option" data-search="${m(o.label.toLocaleLowerCase(c.cultureFull))}">
                            <input
                                type="checkbox"
                                value="${o.id}"
                                ${i.has(o.id)?"checked":""}
                                onchange="mettreAJourAssignationsItemChecklist(${Number(n)}, '${E(t)}', '${E(e.id)}', this.closest('.checklist-assignees'), event)"
                            >
                            <span class="responsable-option-avatar" style="background:${m(o.avatarColor)}">${f(o.initials)}</span>
                            <span class="responsable-option-name">${f(o.label)}</span>
                        </label>
                    `).join("")||'<div class="multi-empty">Aucun membre disponible</div>'}
                </div>
            </div>
        </details>
    `}function bt(e){return e.length?`
            <span class="checklist-assignee-avatars">
                ${e.slice(0,4).map(t=>`
                    <span class="checklist-assignee-avatar" style="background:${m(t.avatarColor)}" title="${m(t.label)}">${f(t.initials)}</span>
                `).join("")}
                ${e.length>4?`<span class="checklist-assignee-more">+${e.length-4}</span>`:""}
            </span>
        `:'<span class="checklist-assignee-placeholder">👤 Attribuer</span>'}function cs(e){const t=e.closest(".checklist-assignees"),n=e.value.trim().toLocaleLowerCase(c.cultureFull);t?.querySelectorAll(".checklist-person-option").forEach(s=>{s.hidden=n!==""&&!u(s.dataset.search).includes(n)})}function ls(e,t,n,s){s.key==="Enter"&&(s.preventDefault(),gt(e,t,n,s))}async function gt(e,t,n,s){s?.preventDefault(),s?.stopPropagation();const i=n.closest(".checklist-section")?.querySelector(".checklist-add-input"),a=u(i?.value).trim();if(!a){i?.focus(),de(e,t,"error","Saisissez un intitulé.");return}i&&(i.value="");const o=await D(e,l=>l.map(d=>d.id===t?{...d,items:[...d.items,{id:_(),text:a,done:!1,memberIds:[],dueDate:"",createdAt:new Date().toISOString()}]}:d));Le(e,t,o)}async function us(e,t,n,s){s?.stopPropagation();const r=u(n).trim()||"Checklist";await D(e,i=>i.map(a=>a.id===t?{...a,title:r}:a))}async function ds(e,t,n,s,r,i,a){a?.stopPropagation();const o=s==="done"?!!r:s==="dueDate"?ft(r):u(r).trim(),l=await D(e,d=>d.map(p=>p.id===t?{...p,items:p.items.map(b=>b.id===n?{...b,[s]:o}:b)}:p));if(s==="text"){de(e,t,"saved","Élément enregistré.");return}Le(e,t,l)}async function ms(e,t,n,s,r){r?.stopPropagation();const i=Array.from(s.querySelectorAll('input[type="checkbox"]:checked')).map(l=>Number(l.value)).filter(l=>C.has(l));await D(e,l=>l.map(d=>d.id===t?{...d,items:d.items.map(p=>p.id===n?{...p,memberIds:i}:p)}:d));const a=i.map(l=>C.get(l)).filter(Boolean),o=s.querySelector("summary");o&&(o.innerHTML=bt(a)),de(e,t,"saved","Attribution enregistrée.")}async function ps(e,t,n,s){s?.preventDefault(),s?.stopPropagation();const r=g(e),a=x(r?.CHECKLIST).find(l=>l.id===t)?.items.find(l=>l.id===n);if(a?.text&&!window.confirm(`Supprimer « ${a.text} » ?`))return;const o=await D(e,l=>l.map(d=>d.id===t?{...d,items:d.items.filter(p=>p.id!==n)}:d));Le(e,t,o)}async function fs(e,t,n){n?.preventDefault(),n?.stopPropagation();const s=g(e),r=x(s?.CHECKLIST).find(i=>i.id===t);window.confirm(`Supprimer la checklist « ${r?.title||"Checklist"} » et tous ses éléments ?`)&&(await D(e,i=>i.filter(a=>a.id!==t)),await w(e))}async function D(e,t){const n=Number(e),r=(ie.get(n)||Promise.resolve()).catch(()=>{}).then(async()=>{const i=g(n),a=x(i?.CHECKLIST),o=t(a).map((l,d)=>mt(l,d));return await N(n,"CHECKLIST",JSON.stringify(o)),i&&(i.CHECKLIST=JSON.stringify(o)),o}).finally(()=>{ie.get(n)===r&&ie.delete(n)});return ie.set(n,r),r}function Le(e,t,n=null){const s=g(e),i=(n||x(s?.CHECKLIST)).find(d=>d.id===t),a=document.querySelector(`.checklist-section[data-row-id="${Number(e)}"][data-checklist-id="${hs(t)}"]`);if(!a||!i){w(e);return}const o=document.createElement("div");o.innerHTML=ht(i,e,c.col.CHECKLIST.getIsFormula());const l=o.firstElementChild;a.replaceWith(l),l.querySelectorAll(".auto-expand").forEach(H),vt(l.parentElement)}function de(e,t,n,s){const r=document.getElementById(`checklist-status-${Number(e)}-${Et(t)}`);r&&(r.className=`section-status checklist-status${n?` ${n}`:""}`,r.textContent=s)}function vt(e=document){typeof Sortable!="function"||c.opt.readonly||e.querySelectorAll('.checklist-section[data-disabled="false"] .checklist-items').forEach(t=>{t.dataset.sortableReady!=="true"&&(t.dataset.sortableReady="true",new Sortable(t,{animation:140,handle:".checklist-drag-handle",ghostClass:"checklist-item-ghost",chosenClass:"checklist-item-chosen",onEnd:async()=>{const n=Number(t.dataset.rowId),s=t.dataset.checklistId,r=Array.from(t.querySelectorAll(".checklist-item")).map(i=>i.dataset.itemId);await D(n,i=>i.map(a=>{if(a.id!==s)return a;const o=new Map(a.items.map(l=>[l.id,l]));return{...a,items:r.map(l=>o.get(l)).filter(Boolean)}})),de(n,s,"saved","Ordre enregistré.")}}))})}function Et(e){return u(e).replace(/[^a-zA-Z0-9_-]/g,"_")}function hs(e){return window.CSS?.escape?window.CSS.escape(u(e)):u(e).replace(/["\\]/g,"\\$&")}function bs(e,t=$(e.PIECES_JOINTES),n=me(e.LIENS)){return`
        <section class="detail-section resources-section" data-row-id="${Number(e.id)}">
            <div class="detail-section-header resource-section-header">
                <div class="task-section-heading-copy">
                    <span class="task-section-icon task-section-icon-resources">📎</span>
                    <div>
                        <h3>Ressources</h3>
                        <p>${t.length+n.length} fichier(s) ou lien(s)</p>
                    </div>
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
                        ${n.map(s=>gs(e.id,s)).join("")}
                    </div>
                </div>
            `:""}
        </section>
    `}function me(e){const t=u(e).trim();if(!t)return[];try{const n=JSON.parse(t);return Array.isArray(n)?n.map((s,r)=>({id:u(s?.id)||`link-${r}`,label:u(s?.label||s?.text).trim(),url:Re(s?.url),createdAt:u(s?.createdAt)})).filter(s=>s.label&&s.url):[]}catch(n){return console.warn("Liens illisibles, valeur ignorée :",n),[]}}function Re(e){const t=u(e).trim();if(!t)return"";const n=/^(https?:)/i.test(t)?t:`https://${t}`;try{const s=new URL(n);return["http:","https:"].includes(s.protocol)?s.href:""}catch{return""}}function gs(e,t){let n="";try{n=new URL(t.url).hostname}catch{n=t.url}return`
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
    `}async function vs(e,t,n){n?.preventDefault(),n?.stopPropagation();const s=t.closest(".task-action-panel"),r=s?.querySelector(".resource-link-label"),i=s?.querySelector(".resource-link-url"),a=s?.querySelector(".task-panel-status"),o=u(r?.value).trim(),l=Re(i?.value);if(!o||!l){a&&(a.className="task-panel-status section-status error",a.textContent="Renseignez un texte d’affichage et une adresse valide."),(o?i:r)?.focus();return}try{a&&(a.className="task-panel-status section-status saving",a.textContent="Enregistrement…"),await yt(e,d=>[...d,{id:_(),label:o,url:l,createdAt:new Date().toISOString()}]),await w(e,"resources")}catch{a&&(a.className="task-panel-status section-status error",a.textContent="Impossible d’ajouter le lien.")}}async function Es(e,t,n){n?.preventDefault(),n?.stopPropagation(),await yt(e,s=>s.filter(r=>r.id!==t)),await w(e)}async function yt(e,t){const n=Number(e),r=(ae.get(n)||Promise.resolve()).catch(()=>{}).then(async()=>{const i=g(n),a=me(i?.LIENS),o=t(a).map(l=>({id:u(l.id)||_(),label:u(l.label).trim(),url:Re(l.url),createdAt:u(l.createdAt)||new Date().toISOString()})).filter(l=>l.label&&l.url);return await N(n,"LIENS",JSON.stringify(o)),i&&(i.LIENS=JSON.stringify(o)),o}).finally(()=>{ae.get(n)===r&&ae.delete(n)});return ae.set(n,r),r}async function ys(e){const t=document.getElementById(`attachments-list-${Number(e)}`);if(!t)return;const n=g(e),s=$(n?.PIECES_JOINTES);if(s.length===0){t.innerHTML='<div class="section-empty">Aucune pièce jointe</div>';return}t.innerHTML='<div class="section-loading">Chargement des aperçus…</div>';try{const[r]=await Promise.all([De(!0),$e()]);t.innerHTML=s.map(i=>St(e,i,r)).join("")}catch(r){console.error("Impossible d’afficher les pièces jointes :",r),t.innerHTML=s.map(i=>St(e,i,null)).join("")}}function St(e,t,n){const s=kt(t),r=n?$t(n,t):"",i=At(s),a=i==="image"&&r?`<img src="${m(r)}" alt="${m(s.fileName)}" loading="lazy">`:`<div class="attachment-file-icon">${Nt(i)}</div>`;return`
        <article class="attachment-card">
            <button type="button" class="attachment-preview" onclick="ouvrirPieceJointe(${Number(e)}, ${Number(t)}, event)" title="Ouvrir ${m(s.fileName)}">
                ${a}
            </button>
            <div class="attachment-info">
                <div class="attachment-name" title="${m(s.fileName)}">${f(s.fileName)}</div>
                <div class="attachment-meta">${f(Qs(s.fileSize))}</div>
            </div>
            <div class="attachment-actions">
                <button type="button" onclick="ouvrirPieceJointe(${Number(e)}, ${Number(t)}, event)" title="Visualiser">👁</button>
                ${c.map?.PIECES_JOINTES&&!c.col.PIECES_JOINTES.getIsFormula()?`<button type="button" onclick="retirerPieceJointe(${Number(e)}, ${Number(t)}, event)" title="Retirer de la tâche">×</button>`:""}
            </div>
        </article>
    `}function Ss(e,t){t?.preventDefault(),t?.stopPropagation();const s=e?.closest(".task-action-panel")?.querySelector(".resource-file-input");!s||s.disabled||s.click()}function Cs(e){const t=[],n=s=>{if(s!=null){if(typeof s=="number"||typeof s=="string"){const r=Number(s);Number.isInteger(r)&&r>0&&t.push(r);return}if(Array.isArray(s)){const r=s[0]==="L"?1:0;s.slice(r).forEach(n);return}typeof s=="object"&&["id","ids","attachmentId","attachmentIds","attachments","recordIds","result"].forEach(r=>{Object.prototype.hasOwnProperty.call(s,r)&&n(s[r])})}};return n(e),[...new Set(t)]}async function ws(e,t,n){n?.preventDefault(),n?.stopPropagation();const s=t?.closest(".task-action-panel"),r=s?.querySelector(".task-panel-status"),i=s?.querySelector(".resource-file-button"),a=Array.from(t?.files||[]);if(a.length===0)return;const o=(d,p)=>{r&&(r.className=`task-panel-status section-status${d?` ${d}`:""}`,r.textContent=p)},l=a.find(d=>d.size>Gt);if(l){o("error",`${l.name} dépasse la limite de 50 Mo.`),t.value="";return}t.disabled=!0,i&&(i.disabled=!0),o("saving",`Envoi de ${a.length} fichier(s)…`);try{const d=await De(!1),p=new FormData;a.forEach(ee=>{p.append("upload",ee,ee.name)});const b=`${d.baseUrl}/attachments?auth=${encodeURIComponent(d.token)}`,v=await fetch(b,{method:"POST",body:p,headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}),h=await v.text();let k=h;if(h)try{k=JSON.parse(h)}catch{k=h}if(!v.ok)throw new Error(`Upload refusé par Grist (${v.status}).`);const U=Cs(k);if(U.length===0)throw new Error("Le fichier a été envoyé, mais aucun identifiant de pièce jointe n’a été retourné.");const A=g(e),Ue=$(A?.PIECES_JOINTES),he=[...new Set([...Ue,...U])];await Ct(e,he),A&&(A.PIECES_JOINTES=[...he]),ne=!1,W=null,await $e(!0),o("saved",`${U.length} pièce(s) jointe(s) ajoutée(s).`),B(),await w(e)}catch(d){console.error("Erreur pendant l’ajout des pièces jointes :",d),o("error",d?.message||"Échec de l’envoi.")}finally{t.value="",t.disabled=!1,i&&(i.disabled=!1)}}async function $s(e,t,n){n?.preventDefault(),n?.stopPropagation();const s=g(e),i=$(s?.PIECES_JOINTES).filter(a=>a!==Number(t));try{T("attachments",e,"saving","Mise à jour…"),await Ct(e,i),s&&(s.PIECES_JOINTES=[...i]),await w(e)}catch(a){console.error("Erreur pendant le retrait de la pièce jointe :",a),T("attachments",e,"error","Impossible de retirer la pièce jointe.")}}async function Ct(e,t){const n=c.map?.PIECES_JOINTES;if(!n||Array.isArray(n))throw new Error("La colonne Pièces jointes n’est pas correctement mappée.");await grist.getTable().update({id:Number(e),fields:{[n]:["L",...t]}}),await Mt(e)}async function ks(e,t,n){n?.preventDefault(),n?.stopPropagation();try{const[s]=await Promise.all([De(!0),$e()]),r=kt(t),i=$t(s,t);Ns(r,i)}catch(s){console.error("Impossible d’ouvrir la pièce jointe :",s),window.alert("Impossible d’ouvrir cette pièce jointe.")}}function As(){if(document.getElementById("attachment-viewer"))return;const e=document.createElement("div");e.id="attachment-viewer",e.className="attachment-viewer",e.setAttribute("aria-hidden","true"),e.innerHTML=`
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
    `,document.body.appendChild(e)}function Ns(e,t){const n=document.getElementById("attachment-viewer"),s=document.getElementById("attachment-viewer-content"),r=document.getElementById("attachment-viewer-title"),i=document.getElementById("attachment-viewer-download");if(!n||!s||!r||!i)return;r.textContent=e.fileName,i.href=t;const a=At(e);a==="image"?s.innerHTML=`<img src="${m(t)}" alt="${m(e.fileName)}">`:a==="pdf"?s.innerHTML=`<iframe src="${m(t)}" title="${m(e.fileName)}"></iframe>`:a==="video"?s.innerHTML=`<video src="${m(t)}" controls autoplay></video>`:a==="audio"?s.innerHTML=`<div class="attachment-generic-preview"><div class="attachment-large-icon">🎵</div><audio src="${m(t)}" controls autoplay></audio></div>`:s.innerHTML=`<div class="attachment-generic-preview"><div class="attachment-large-icon">${Nt(a)}</div><p>Ce format ne dispose pas d’un aperçu intégré.</p><a href="${m(t)}" target="_blank" rel="noopener">Ouvrir ou télécharger le fichier</a></div>`,n.classList.add("visible"),n.setAttribute("aria-hidden","false")}function wt(e){e?.preventDefault(),e?.stopPropagation();const t=document.getElementById("attachment-viewer");if(!t)return;t.classList.remove("visible"),t.setAttribute("aria-hidden","true");const n=document.getElementById("attachment-viewer-content");n&&(n.innerHTML="")}async function De(e=!0){if(e&&W&&Date.now()-Be<Vt)return W;const t=await grist.docApi.getAccessToken({readOnly:e});return e&&(W=t,Be=Date.now()),t}function $t(e,t){return`${e.baseUrl}/attachments/${Number(t)}/download?auth=${encodeURIComponent(e.token)}`}function kt(e){return Ee.get(Number(e))||{id:Number(e),fileName:`Pièce jointe ${Number(e)}`,fileExt:"",fileType:"",fileSize:0,imageWidth:0,imageHeight:0}}function At(e){const t=u(e.fileExt||Kt(e.fileName)).toLowerCase().replace(/^\./,""),n=u(e.fileType).toLowerCase();return n.startsWith("image/")||["png","jpg","jpeg","gif","webp","svg","bmp","avif"].includes(t)?"image":n==="application/pdf"||t==="pdf"?"pdf":n.startsWith("video/")||["mp4","webm","mov","m4v","ogv"].includes(t)?"video":n.startsWith("audio/")||["mp3","wav","ogg","m4a","aac","flac"].includes(t)?"audio":["doc","docx","odt"].includes(t)?"document":["xls","xlsx","ods","csv"].includes(t)?"tableur":["ppt","pptx","odp"].includes(t)?"presentation":["zip","rar","7z","tar","gz"].includes(t)?"archive":"file"}function Nt(e){return{image:"🖼️",pdf:"📕",video:"🎬",audio:"🎵",document:"📄",tableur:"📊",presentation:"📽️",archive:"🗜️",file:"📎"}[e]||"📎"}function Ts(e){const t=X(e.COMMENTAIRES),n=c.opt.enablementions!==!1;return`
        <section
            class="detail-section comments-section"
            data-row-id="${Number(e.id)}"
        >
            <div class="detail-section-header comments-header">
                <div class="task-section-heading-copy">
                    <span class="task-section-icon task-section-icon-comments">💬</span>
                    <div>
                        <h3>Commentaires</h3>
                        <p>${t.length} commentaire(s) · échangez avec l’équipe</p>
                    </div>
                </div>
            </div>

            <div
                id="comments-list-${Number(e.id)}"
                class="comments-list"
            >
                ${Lt(t,e.id)}
            </div>

            <div class="comment-composer">
                <div class="comment-input-wrapper">
                    <textarea
                        class="comment-input"
                        placeholder="Écrire un commentaire${n?" — utilisez @ pour mentionner quelqu’un":""}…"
                        oninput="ajusterTextarea(this); gererSaisieMention(this)"
                        onkeydown="gererTouchesMention(this, event)"
                    ></textarea>

                    ${n?Is():""}
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
    `}function Is(){return`
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
                ${I.map(t=>`
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
    `}function Ls(e,t){t?.preventDefault(),t?.stopPropagation();const s=e.closest(".comment-composer")?.querySelector(".mention-menu");s&&(s.hidden=!1,Tt(s,""))}function Rs(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".mention-menu");n&&(n.hidden=!0)}function Ds(e){const n=e.closest(".comment-composer")?.querySelector(".mention-menu");if(!n||c.opt.enablementions===!1)return;const s=It(e);if(!s){n.hidden=!0;return}n.hidden=!1,n.dataset.mentionStart=String(s.start),Tt(n,s.query)}function Ms(e,t){const s=e.closest(".comment-composer")?.querySelector(".mention-menu");if(!s||s.hidden)return;const r=Array.from(s.querySelectorAll(".mention-option:not([hidden])"));if(t.key==="Escape"){t.preventDefault(),s.hidden=!0,e.focus();return}t.key==="Enter"&&r.length===1&&(t.preventDefault(),r[0].click())}function Tt(e,t){const n=u(t).trim().toLocaleLowerCase(c.cultureFull);e.querySelectorAll(".mention-option").forEach(s=>{s.hidden=n!==""&&!u(s.dataset.search).includes(n)})}function It(e){const t=Number(e.selectionStart),s=e.value.slice(0,t).match(/(?:^|\s)@([^@\n]*)$/);if(!s)return null;const r=s[1];return{query:r,start:t-r.length-1,end:t}}function Ps(e,t,n){n?.preventDefault(),n?.stopPropagation();const s=e.closest(".comment-composer"),r=s?.querySelector(".comment-input"),i=s?.querySelector(".mention-menu"),a=C.get(Number(t));if(!s||!r||!a)return;const o=It(r),l=`@${a.label}`;if(o)r.setRangeText(`${l} `,o.start,o.end,"end");else{const d=r.value&&!/\s$/.test(r.value)?" ":"";r.setRangeText(`${d}${l} `,r.selectionStart,r.selectionEnd,"end")}s._selectedMentions||(s._selectedMentions=new Map),s._selectedMentions.set(a.id,{id:a.id,name:a.label,email:a.email||""}),Me(s),i&&(i.hidden=!0),r.focus(),H(r)}function Me(e){const t=e.querySelector(".comment-selected-mentions");if(!t)return;const n=Array.from(e._selectedMentions?.values?.()||[]);t.innerHTML=n.map(s=>`
        <span class="selected-mention-chip">
            @${f(s.name)}
            <button
                type="button"
                onclick="retirerMentionCommentaire(this, ${Number(s.id)}, event)"
                aria-label="Retirer ${m(s.name)}"
            >×</button>
        </span>
    `).join("")}function qs(e,t,n){n?.preventDefault(),n?.stopPropagation();const s=e.closest(".comment-composer"),r=s?.querySelector(".comment-input"),i=C.get(Number(t));if(s?._selectedMentions?.delete(Number(t)),r&&i){const a=`@${i.label}`;r.value=r.value.replaceAll(a,"").replace(/[ \t]{2,}/g," ").trimStart(),H(r)}s&&Me(s)}function Lt(e,t){return e.length===0?'<div class="section-empty">Aucun commentaire</div>':e.map(n=>`
        <article
            class="comment-card"
            data-comment-id="${m(n.id)}"
        >
            <div class="comment-header">
                <strong>${f(n.author===z?"Nom Grist non configuré":n.author||"Anonyme")}</strong>
                <span>${f(_e(n.createdAt))}</span>
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
                ${xs(n)}
            </div>
        </article>
    `).join("")}function xs(e){let t=f(e.text).replace(/\n/g,"<br>");return Rt(e.mentions).sort((s,r)=>r.name.length-s.name.length).forEach(s=>{const r=f(`@${s.name}`),i=`
            <span
                class="comment-mention"
                title="${m(s.email||s.name)}"
            >${r}</span>
        `;t=t.split(r).join(i)}),t}function X(e){const t=u(e).trim();if(!t)return[];try{const n=JSON.parse(t);if(!Array.isArray(n))throw new Error("Format non tableau");return n.map((s,r)=>({id:u(s?.id)||`legacy-${r}`,author:u(s?.author)||"Anonyme",createdAt:u(s?.createdAt),text:u(s?.text),mentions:Rt(s?.mentions)})).filter(s=>s.text.trim())}catch{return[{id:"legacy-text",author:"Ancien commentaire",createdAt:"",text:t,mentions:[]}]}}function Rt(e){return O(e).map(t=>({id:Number(t?.id)||0,name:u(t?.name||t?.label).trim(),email:Bt(t?.email)})).filter(t=>t.name)}async function Fs(e,t,n){n?.preventDefault(),n?.stopPropagation();const r=t.closest(".comments-section")?.querySelector(".comment-composer"),i=r?.querySelector(".comment-input"),a=u(i?.value).trim();if(!a){T("comments",e,"error","Écrivez un commentaire."),i?.focus();return}const o=Array.from(r?._selectedMentions?.values?.()||[]).filter(d=>a.includes(`@${d.name}`));t.disabled=!0,T("comments",e,"saving","Enregistrement…");const l={id:_(),author:z,createdAt:new Date().toISOString(),text:a,mentions:o};try{const p=(await Dt(e,h=>[...h,l])).find(h=>h.id===l.id);if(!p||p.author===z)throw new Error("La formule user.Name n’a pas remplacé le nom temporaire.");if(i&&(i.value="",H(i)),r){r._selectedMentions=new Map,Me(r);const h=r.querySelector(".mention-menu");h&&(h.hidden=!0)}Pe(e);const b=p.mentions.length,v=b>0?`Commentaire ajouté par ${p.author}. ${b} mention(s) visuelle(s), sans envoi d’e-mail.`:`Commentaire ajouté par ${p.author}.`;T("comments",e,"saved",v)}catch(d){console.error("Erreur pendant l’ajout du commentaire :",d),Pe(e),T("comments",e,"error",u(d?.message)||"Impossible d’ajouter le commentaire.")}finally{t.disabled=!1}}async function Os(e,t,n){n?.preventDefault(),n?.stopPropagation();try{T("comments",e,"saving","Suppression…"),await Dt(e,s=>s.filter(r=>r.id!==t)),Pe(e),T("comments",e,"saved","Commentaire supprimé.")}catch(s){console.error("Erreur pendant la suppression du commentaire :",s),T("comments",e,"error","Impossible de supprimer le commentaire.")}}async function Dt(e,t){const n=Number(e),r=(oe.get(n)||Promise.resolve()).catch(()=>{}).then(async()=>{const i=g(n),a=X(i?.COMMENTAIRES),o=t(a),l=JSON.stringify(o),d=qe();await c.updateRecords(c.formatRecord(n,{COMMENTAIRES:l,...d}));const p=await _s(n);return i&&(i.COMMENTAIRES=JSON.stringify(p)),p}).finally(()=>{oe.get(n)===r&&oe.delete(n)});return oe.set(n,r),r}async function _s(e){const t=c.map?.COMMENTAIRES;if(!t||Array.isArray(t))throw new Error("La colonne Commentaires n’est pas correctement mappée.");const n=await dt(e,t),s=X(n),r=g(e);return r&&(r.COMMENTAIRES=u(n)),s}function Pe(e){const t=g(e),n=X(t?.COMMENTAIRES),s=document.getElementById(`comments-list-${Number(e)}`),r=s?.closest(".comments-section");s&&(s.innerHTML=Lt(n,e));const i=r?.querySelector(".detail-section-header p");i&&(i.textContent=`${n.length} commentaire(s)`)}async function N(e,t,n,s){s?.stopPropagation();try{t==="STATUT"&&xe(n)?.useconfetti&&Gs();const r={[t]:n,...t==="DERNIERE_MISE_A_JOUR"||t==="MODIFIE_PAR"?{}:qe()};await c.updateRecords(c.formatRecord(e,r));const i=g(e);i&&(i[t]=n,r.DERNIERE_MISE_A_JOUR&&(i.DERNIERE_MISE_A_JOUR=r.DERNIERE_MISE_A_JOUR),r.MODIFIE_PAR&&(i.MODIFIE_PAR=r.MODIFIE_PAR))}catch(r){throw console.error(y("Error during update:"),r),r}}function qe(){const e={};return c.map?.DERNIERE_MISE_A_JOUR&&!c.col.DERNIERE_MISE_A_JOUR.getIsFormula()&&(e.DERNIERE_MISE_A_JOUR=new Date().toISOString()),c.map?.MODIFIE_PAR&&!c.col.MODIFIE_PAR.getIsFormula()&&(e.MODIFIE_PAR=z),e}async function Mt(e){const t=qe();if(Object.keys(t).length!==0)try{await c.updateRecords(c.formatRecord(e,t));const n=g(e);n&&Object.assign(n,t)}catch(n){console.warn("Données enregistrées, mais informations de suivi non modifiées :",n)}}async function Us(e){try{const t={DESCRIPTION:"",STATUT:e};c.map?.DERNIERE_MISE_A_JOUR&&!c.col.DERNIERE_MISE_A_JOUR.getIsFormula()&&(t.DERNIERE_MISE_A_JOUR=new Date().toISOString()),c.map?.CREE_LE&&!c.col.CREE_LE.getIsFormula()&&(t.CREE_LE=new Date().toISOString()),c.map?.COMMENTAIRES&&!c.col.COMMENTAIRES.getIsFormula()&&(t.COMMENTAIRES="[]"),c.map?.CHECKLIST&&!c.col.CHECKLIST.getIsFormula()&&(t.CHECKLIST="[]"),c.map?.LIENS&&!c.col.LIENS.getIsFormula()&&(t.LIENS="[]"),c.map?.ORDRE&&!c.col.ORDRE.getIsFormula()&&(t.ORDRE=js(e));const n=await c.createRecords({fields:t});if(n?.id>0){grist.setCursorPos({rowId:n.id});const s=await c.fetchSelectedRecord(n.id);c.opt.hideedit||Q(s)}}catch(t){console.error(y("Error on creation:"),t)}}async function Js(e,t){if(t?.stopPropagation(),!(c.opt.confirmdelete!==!1&&!confirm(y("Are you sure you want to delete this task?"))))try{await c.destroyRecords(e),Y()}catch(n){console.error(y("Error on delete:"),n)}}function Y(){const e=document.getElementById("popup-todo");!e||e.querySelector(".notes-field.is-editing.is-dirty")&&!window.confirm("Les modifications des notes ne sont pas enregistrées. Fermer quand même ?")||(F(e.dataset.currentTodo)?.classList.remove("active"),B(),e.classList.remove("visible"),Pt())}function Bs(e,t){if(t?.stopPropagation(),!e)return;e.classList.toggle("collapsed");const n=e.querySelector(".titre-statut")?.childNodes?.[0]?.textContent?.trim()||e.id;localStorage.setItem(xt(n),String(e.classList.contains("collapsed")))}function H(e){e&&(e.style.height="",e.style.height=`${Math.max(e.scrollHeight,42)}px`)}function Pt(e=null){document.querySelectorAll(".multi-dropdown[open], .checklist-assignees[open]").forEach(t=>{t!==e&&t.removeAttribute("open")})}document.addEventListener("keydown",e=>{if(e.key!=="Escape")return;if(document.getElementById("attachment-viewer")?.classList.contains("visible")){wt(e);return}const n=document.querySelector(".multi-dropdown[open], .checklist-assignees[open]");if(n){n.removeAttribute("open");return}if(document.querySelector(".task-action-panel:not([hidden])")){B(e);return}Y()}),document.addEventListener("click",e=>{const t=e.target.closest(".multi-dropdown, .checklist-assignees");c?.opt?.autoclosemenus!==!1&&Pt(t);const n=document.getElementById("popup-todo");if(!n?.classList.contains("visible"))return;e.target.closest(".task-action-panel, .task-quick-button")||B();const r=n.contains(e.target),i=!!e.target.closest(".carte"),a=!!e.target.closest("#attachment-viewer");!r&&!i&&!a&&Y()});function g(e){return M.find(t=>Number(t.id)===Number(e))||null}function F(e){return Array.from(document.querySelectorAll(".carte")).find(t=>Number(t.dataset.todoId)===Number(e))||null}function qt(e){return{addbutton:!1,isdone:!1,useconfetti:!1,hidecolumn:!1,...(Array.isArray(c.opt?.columns)?c.opt.columns:[])[e]||{}}}function xe(e){const n=(c.valuesList?.columns||[]).indexOf(e);return n>=0?qt(n):null}function xt(e){return`column-todo-${u(e)}`}function js(e){const t=M.filter(n=>u(n.STATUT)===u(e)).map(n=>Number(n.ORDRE)).filter(Number.isFinite);return t.length>0?Math.max(...t)+1e3:1e3}function Fe(e,t){const n=Jt(e?.[`${t}_id`]);if(n.length>0)return n;const s=Z(e?.[t]).filter(i=>i!=="#KeyError"),r=[...I];return s.flatMap(i=>{const a=r.findIndex(l=>l.label===i);if(a<0)return[];const[o]=r.splice(a,1);return[o.id]})}function Ft(e,t){const n=Fe(e,t);return n.length>0?n.map(s=>C.get(s)).filter(Boolean):Z(e?.[t]).filter(s=>s!=="#KeyError").map(s=>({id:0,label:s,initials:Ve(s),avatarColor:Ge(s)}))}function Hs(e){return Fe(e,"MEMBRES")}function Ot(e){return Ft(e,"MEMBRES")}function Ks(e){return Fe(e,"RESPONSABLE")}function _t(e){return Ft(e,"RESPONSABLE")}function Oe(e){const t=Jt(e?.ETIQUETTES_id);if(t.length>0)return t;const n=Z(e?.ETIQUETTES).filter(r=>r!=="#KeyError"),s=[...J];return n.flatMap(r=>{const i=s.findIndex(o=>o.label===r);if(i<0)return[];const[a]=s.splice(i,1);return[a.id]})}function Ut(e){const t=Oe(e);return t.length>0?t.map(n=>P.get(n)).filter(Boolean):Z(e?.ETIQUETTES).filter(n=>n!=="#KeyError").map(n=>{const s=Xe(n);return{id:0,label:n,color:s,textColor:Ye(s)}})}function Jt(e){return $(e)}function $(e){let t=O(e);return t[0]==="L"?t=t.slice(1):t[0]==="r"&&(t=O(t[2])),[...new Set(t.flatMap(n=>Array.isArray(n)?n:[n]).map(Number).filter(n=>Number.isInteger(n)&&n>0))]}function Z(e){let t=O(e);return t[0]==="L"&&(t=t.slice(1)),[...new Set(t.flatMap(n=>Array.isArray(n)?n:[n]).map(u).map(n=>n.trim()).filter(Boolean))]}function O(e){return e==null||e===""?[]:Array.isArray(e)?e:[e]}function u(e){return e==null?"":String(e)}function Bt(e){const t=u(e).trim().toLowerCase();return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)?t:""}function zs(e){const t=[],n=c.map?.CREE_LE&&e.CREE_LE?_e(e.CREE_LE):"",s=c.map?.CREE_PAR?u(e.CREE_PAR).trim():"";if(n||s){const o=["Créé"];n&&o.push(`le ${n}`),s&&o.push(`par ${s}`),t.push(`<div>${f(o.join(" "))}</div>`)}const r=c.map?.DERNIERE_MISE_A_JOUR&&e.DERNIERE_MISE_A_JOUR?_e(e.DERNIERE_MISE_A_JOUR):"",i=c.map?.MODIFIE_PAR?u(e.MODIFIE_PAR).trim():"",a=i===z?"Nom Grist non configuré":i;if(r||a){const o=["Modifié"];r&&o.push(`le ${r}`),a&&o.push(`par ${a}`),t.push(`<div>${f(o.join(" "))}</div>`)}return t.join("")}function T(e,t,n,s){const r=document.getElementById(`${e}-status-${Number(t)}`);r&&(r.className=`section-status${n?` ${n}`:""}`,r.textContent=s)}function jt(e){if(!e)return"";const t=new Date(e);if(Number.isNaN(t.getTime())||t>=K)return"";const n=String(t.getDate()).padStart(2,"0"),s=t.toLocaleDateString(c.cultureFull,{month:"short"});return`${n} ${s} ${t.getFullYear()}`}function _e(e){if(!e)return"";const t=new Date(e);return Number.isNaN(t.getTime())?"":t.toLocaleString(c.cultureFull,{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}function Ws(e){if(!e)return"";const t=new Date(e);return Number.isNaN(t.getTime())||t>=K?"":t.toISOString().split("T")[0]}function Ht(e){if(!e)return"";const t=new Date(e);return Number.isNaN(t.getTime())?u(e):t.toISOString()}function pe(e){if(!e)return null;const t=new Date(e).getTime();return Number.isNaN(t)?null:t}function fe(e,t){return pe(e)??t}function Qs(e){const t=Number(e)||0;if(t<=0)return"";const n=["o","Ko","Mo","Go"],s=Math.min(Math.floor(Math.log(t)/Math.log(1024)),n.length-1);return`${(t/1024**s).toFixed(s===0?0:1)} ${n[s]}`}function Kt(e){const t=u(e).match(/(\.[^.]+)$/);return t?t[1]:""}function _(){return globalThis.crypto?.randomUUID?crypto.randomUUID():`comment-${Date.now()}-${Math.random().toString(16).slice(2)}`}function f(e){return u(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function m(e){return f(e).replace(/`/g,"&#096;")}function E(e){return u(e).replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/\r/g,"\\r").replace(/\n/g,"\\n")}function Vs(e){return encodeURIComponent(u(e)).replace(/'/g,"%27")}function Gs(){if(typeof confetti!="function")return;const e=2e3,t=Date.now()+e,n={startVelocity:30,spread:360,ticks:60,zIndex:1500},s=(i,a)=>Math.random()*(a-i)+i,r=window.setInterval(()=>{const i=t-Date.now();if(i<=0){window.clearInterval(r);return}const a=50*(i/e);confetti({...n,particleCount:a,origin:{x:s(.1,.3),y:Math.random()-.2}}),confetti({...n,particleCount:a,origin:{x:s(.7,.9),y:Math.random()-.2}})},250)}window.toggleColonne=Bs,window.togglePopupTodo=Q,window.fermerPopup=Y,window.mettreAJourChamp=N,window.creerNouvelleTache=Us,window.supprimerTodo=Js,window.mettreAJourChampPersonnes=ct,window.filtrerOptionsMultiples=Xn,window.viderChampPersonnes=Yn,window.mettreAJourEtiquettes=Te,window.viderEtiquettes=es,window.retirerEtiquetteActive=ts,window.ouvrirPanneauFiche=tt,window.fermerPanneauxFiche=B,window.filtrerPanneauFiche=Tn,window.mettreAJourTitreFiche=In,window.mettreAJourProprieteFiche=Ln,window.enregistrerEtiquettesDepuisPanneau=Rn,window.retirerEtiquetteFiche=Dn,window.enregistrerRolePersonneDepuisPanneau=Mn,window.gererCreationChecklistClavier=Pn,window.ajouterChecklistAvecTitre=nt,window.mettreAJourCouleurFiche=qn,window.gererAjoutItemChecklistClavier=ls,window.ajouterItemChecklist=gt,window.renommerChecklist=us,window.mettreAJourItemChecklist=ds,window.mettreAJourAssignationsItemChecklist=ms,window.supprimerItemChecklist=ps,window.supprimerChecklist=fs,window.filtrerOptionsChecklist=cs,window.ajouterLienFiche=vs,window.retirerLienFiche=Es,window.declencherSelecteurPiecesJointes=Ss,window.ajouterPiecesJointes=ws,window.retirerPieceJointe=$s,window.ouvrirPieceJointe=ks,window.fermerLecteurPieceJointe=wt,window.ajouterCommentaire=Fs,window.supprimerCommentaire=Os,window.ajusterTextarea=H,window.previsualiserCouleur=Qn,window.mettreAJourCouleur=ot,window.reinitialiserCouleur=Vn,window.activerEditionNotes=Fn,window.annulerEditionNotes=On,window.enregistrerEtFermerNotes=_n,window.appliquerFormatBlocNotes=Jn,window.appliquerCommandeNotes=Bn,window.appliquerBaliseSelectionNotes=jn,window.creerLienNotes=rt,window.nettoyerCollageNotes=Hn,window.marquerNotesModifiees=L,window.mettreAJourEtatBarreNotes=j,window.gererRaccourcisNotes=Kn,window.ouvrirMenuMentions=Ls,window.fermerMenuMentions=Rs,window.gererSaisieMention=Ds,window.gererTouchesMention=Ms,window.selectionnerMentionCommentaire=Ps,window.retirerMentionCommentaire=qs}));
