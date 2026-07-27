(function(o){typeof define=="function"&&define.amd?define(o):o()})((function(){"use strict";let o,A;const Q=new Date("3000-01-01"),Ee="#DCDCDC",Ke="#000000",Zt=120*1e3,en=50*1024*1024,V="__GRIST_USER_NAME__";let $=[],L=[],y=new Map,ye=null,J=[],O=new Map,Se=null,Ce=new Map,ie=!1,G=null,ze=0;const oe=new Map,ce=new Map,le=new Map,ue=new Map,de=new Map,me=new Map;let We=null,we=!1;window.addEventListener("load",async()=>{o=new WidgetSDK,A=await o.loadTranslations(["widget.js"]),o.configureOptions([WidgetSDK.newItem("columns",null,"Colonnes du Kanban","Réglez le comportement de chaque statut.","1 — Colonnes",{columnId:"STATUT",template:[WidgetSDK.newItem("addbutton",!0,"Autoriser l’ajout","Afficher un bouton pour créer une carte dans cette colonne."),WidgetSDK.newItem("isdone",!1,"Colonne terminée","Considérer les cartes de cette colonne comme terminées."),WidgetSDK.newItem("useconfetti",!1,"Confettis","Afficher des confettis lorsqu’une carte arrive dans cette colonne."),WidgetSDK.newItem("hidecolumn",!1,"Masquer la colonne","Ne pas afficher cette colonne dans le Kanban.")]}),WidgetSDK.newItem("cardrotation",!1,"Inclinaison des cartes","Incliner légèrement les cartes. Désactivé par défaut.","2 — Affichage des cartes"),WidgetSDK.newItem("compact",!1,"Mode compact","Réduire les espacements et la hauteur des cartes.","2 — Affichage des cartes"),WidgetSDK.newItem("showlabels",!0,"Afficher les étiquettes","Afficher les étiquettes colorées sur les cartes.","2 — Affichage des cartes"),WidgetSDK.newItem("showmembers",!0,"Afficher les membres","Afficher les bulles d’initiales des membres sur les cartes.","2 — Affichage des cartes"),WidgetSDK.newItem("showresponsables",!0,"Afficher les responsables","Afficher les responsables avec une bordure renforcée sur les cartes.","2 — Affichage des cartes"),WidgetSDK.newItem("showdeadline",!0,"Afficher l’échéance","Afficher la date limite sur les cartes.","2 — Affichage des cartes"),WidgetSDK.newItem("showindicators",!0,"Afficher les indicateurs","Afficher le nombre de pièces jointes et de commentaires.","2 — Affichage des cartes"),WidgetSDK.newItem("showchecklistprogress",!0,"Afficher la progression checklist","Afficher le nombre d’éléments cochés sur les cartes.","2 — Affichage des cartes"),WidgetSDK.newItem("defaultcardcolor","#FFFFD1","Couleur par défaut","Couleur utilisée lorsqu’aucune couleur personnalisée n’est enregistrée.","2 — Affichage des cartes"),WidgetSDK.newItem("showchecklist",!0,"Checklist","Afficher la checklist avancée dans la fiche.","3 — Fiche descriptive"),WidgetSDK.newItem("showattachments",!0,"Pièces jointes","Afficher la section des pièces jointes dans la fiche.","3 — Fiche descriptive"),WidgetSDK.newItem("showcomments",!0,"Commentaires","Afficher la section des commentaires dans la fiche.","3 — Fiche descriptive"),WidgetSDK.newItem("enablementions",!0,"Mentions @ visuelles","Permettre de mentionner les membres dans les commentaires. Cette version ne déclenche aucun e-mail automatique.","3 — Fiche descriptive"),WidgetSDK.newItem("showmetadata",!0,"Informations de suivi","Afficher les lignes « Créé le » et « Modifié le » en bas de la fiche.","3 — Fiche descriptive"),WidgetSDK.newItem("autoclosemenus",!0,"Fermer les menus automatiquement","Fermer les sélecteurs multiples lorsqu’on clique ailleurs.","3 — Fiche descriptive"),WidgetSDK.newItem("readonly",!1,"Lecture seule","Désactiver toutes les modifications depuis le widget.","4 — Comportement"),WidgetSDK.newItem("hideedit",!1,"Masquer la fiche","Ne pas ouvrir la fiche descriptive lors d’un clic sur une carte.","4 — Comportement"),WidgetSDK.newItem("gristeditcard",!1,"Double-clic vers la fiche Grist","Ouvrir la fiche native de Grist lors d’un double-clic.","4 — Comportement"),WidgetSDK.newItem("archivestatus","Archives","Liste d’archives","Nom du statut dans lequel déplacer les cartes archivées.","4 — Comportement")],"#config-view","#main-view",{onOptChange:Ie,onOptLoad:Ie}),o.initMetaData(),o.ready({requiredAccess:"full",allowSelectBy:!0,columns:[{name:"STATUT",title:"Statut",description:"Colonne du Kanban",type:"Choice",strictType:!0},{name:"DESCRIPTION",title:"Nom de la tâche",description:"Nom principal de la tâche",type:"Any"},{name:"DESCRIPTION_DISPLAY",title:"Affichage de la tâche",description:"Contenu personnalisé facultatif affiché sur la carte",type:"Any",optional:!0},{name:"NOTES",title:"Notes",description:"Notes enrichies enregistrées en HTML sécurisé",type:"Text",strictType:!0,optional:!0},{name:"DEADLINE",title:"Échéance",description:"Date limite de la carte",type:"Date",optional:!0},{name:"ORDRE",title:"Ordre manuel",description:"Nombre utilisé pour conserver exactement la position des cartes",type:"Numeric",strictType:!0,optional:!0},{name:"MEMBRES",title:"Membres",description:"Toutes les personnes qui participent à la carte",type:"RefList",strictType:!0,optional:!0},{name:"RESPONSABLE",title:"Responsables",description:"Responsables principaux de la carte",type:"RefList",strictType:!0,optional:!0},{name:"ETIQUETTES",title:"Étiquettes",description:"Étiquettes multiples référencées depuis une table dédiée",type:"RefList",strictType:!0,optional:!0},{name:"CHECKLIST",title:"Checklist",description:"Checklists titrées stockées en JSON",type:"Text",strictType:!0,optional:!0},{name:"PIECES_JOINTES",title:"Pièces jointes",description:"Fichiers et images associés à la tâche",type:"Attachments",strictType:!0,optional:!0},{name:"LIENS",title:"Liens",description:"Liens avec texte d’affichage stockés en JSON",type:"Text",strictType:!0,optional:!0},{name:"COMMENTAIRES",title:"Commentaires",description:"Commentaires du widget stockés en JSON",type:"Text",strictType:!0,optional:!0},{name:"COULEUR",title:"Couleur de carte",description:"Code hexadécimal choisi depuis le widget",type:"Text",strictType:!0,optional:!0},{name:"CREE_PAR",title:"Créé par",type:"Any",optional:!0},{name:"CREE_LE",title:"Date de création",type:"DateTime",optional:!0},{name:"DERNIERE_MISE_A_JOUR",title:"Dernière mise à jour",description:"Date technique affichée dans le suivi",type:"DateTime",optional:!0},{name:"MODIFIE_PAR",title:"Modifié par",description:"Nom de la dernière personne ayant modifié la tâche",type:"Text",strictType:!0,optional:!0}]}),o.onRecords(H,{expandRefs:!1,keepEncoded:!1,mapRef:!0}),o.isLoaded().then(()=>{o.initDone=!0}),grist.on("message",async e=>{e.mappingsChange&&await an()}),qs(),sn()});async function Qe(e=!1){const t=o?.map?.MEMBRES?"MEMBRES":o?.map?.RESPONSABLE?"RESPONSABLE":null;if(!t||!o?.col?.[t]){ke();return}const n=o.col[t],s=`${t}:${n.type}:${n.visibleCol}`;if(!(!e&&ye===s&&L.length>0))try{const r=await Ge(n),a=r.dataColumns,i=$e(a,["initiales","initiale","initials","abreviation","abréviation","sigle"])||Xe(a,r.visibleColumnId),c=$e(a,["email","e-mail","mail","courriel","adresseemail","adresse_email","adressemail","adresse_mail"]),l=i&&Array.isArray(r.table[i])?r.table[i]:[],d=c&&Array.isArray(r.table[c])?r.table[c]:[];L=r.ids.map((p,g)=>{const v=u(r.labels[g]).trim(),h=tn(l[g])||Ze(v),k=zt(d[g]);return{id:Number(p),label:v,initials:h,email:k,avatarColor:et(v||p)}}).filter(p=>Number.isInteger(p.id)&&p.id>0&&p.label&&p.label!=="#KeyError").sort((p,g)=>p.label.localeCompare(g.label,o.cultureFull,{sensitivity:"base"})),y=new Map(L.map(p=>[p.id,p])),ye=s}catch(r){ke(),console.error("Impossible de charger la table des membres :",r)}}function ke(){L=[],y=new Map,ye=null}async function Ve(e=!1){if(!o?.map?.ETIQUETTES||!o?.col?.ETIQUETTES){Ae();return}const t=o.col.ETIQUETTES,n=`${t.type}:${t.visibleCol}`;if(!(!e&&Se===n&&J.length>0))try{const s=await Ge(t),r=s.dataColumns,a=$e(r,["couleur","color","hex","codecouleur","code_couleur"])||Xe(r,s.visibleColumnId),i=a&&Array.isArray(s.table[a])?s.table[a]:[];J=s.ids.map((c,l)=>{const d=u(s.labels[l]).trim(),g=C(i[l])||tt(d||c);return{id:Number(c),label:d,color:g,textColor:nt(g)}}).filter(c=>Number.isInteger(c.id)&&c.id>0&&c.label&&c.label!=="#KeyError").sort((c,l)=>c.label.localeCompare(l.label,o.cultureFull,{sensitivity:"base"})),O=new Map(J.map(c=>[c.id,c])),Se=n}catch(s){Ae(),console.error("Impossible de charger la table des étiquettes :",s)}}function Ae(){J=[],O=new Map,Se=null}async function Ge(e){const[t,n]=u(e?.type).split(":");if(t!=="RefList"||!n||!e?.visibleCol)throw new Error("La colonne doit être une Liste de références avec une colonne visible configurée.");const[s,r]=await Promise.all([grist.docApi.fetchTable(n),e.getMeta(e.visibleCol)]),a=r?.colId;if(!a||!Array.isArray(s?.id)||!Array.isArray(s?.[a]))throw new Error(`La colonne visible de la table ${n} est introuvable.`);const i=Object.keys(s).filter(c=>Array.isArray(s[c])&&c!=="id"&&c!=="manualSort"&&!c.startsWith("gristHelper_"));return{tableId:n,table:s,ids:s.id,labels:s[a],visibleColumnId:a,dataColumns:i}}function $e(e,t){const n=new Set(t.map(Ye));return e.find(s=>n.has(Ye(s)))||null}function Xe(e,t){const n=e.indexOf(t);return n>=0&&e[n+1]||null}function Ye(e){return u(e).normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]/gi,"").toLowerCase()}function tn(e){return u(e).trim().replace(/\s+/g,"").slice(0,4).toUpperCase()}function Ze(e){const t=u(e).trim().split(/\s+/).filter(Boolean);return t.length===0?"?":t.length===1?t[0].slice(0,2).toUpperCase():`${t[0][0]||""}${t[t.length-1][0]||""}`.toUpperCase()}function et(e){let t=0;for(const s of u(e))t=(t<<5)-t+s.charCodeAt(0),t|=0;return`hsl(${Math.abs(t)%360} 58% 42%)`}function tt(e){let t=0;for(const s of u(e))t=(t<<5)-t+s.charCodeAt(0),t|=0;const n=Math.abs(t)%360;return nn(n,62,72)}function nn(e,t,n){t/=100,n/=100;const s=(1-Math.abs(2*n-1))*t,r=s*(1-Math.abs(e/60%2-1)),a=n-s/2;let i=0,c=0,l=0;return e<60?[i,c,l]=[s,r,0]:e<120?[i,c,l]=[r,s,0]:e<180?[i,c,l]=[0,s,r]:e<240?[i,c,l]=[0,r,s]:e<300?[i,c,l]=[r,0,s]:[i,c,l]=[s,0,r],`#${[i,c,l].map(d=>Math.round((d+a)*255).toString(16).padStart(2,"0")).join("")}`.toUpperCase()}function nt(e){const t=C(e)||"#DDE3EA",n=parseInt(t.slice(1,3),16),s=parseInt(t.slice(3,5),16),r=parseInt(t.slice(5,7),16);return(.2126*n+.7152*s+.0722*r)/255>.58?"#1F2937":"#FFFFFF"}async function Ne(e=!1){if(!(ie&&!e)){Ce=new Map,ie=!0;try{const t=await grist.docApi.fetchTable("_grist_Attachments");(Array.isArray(t?.id)?t.id:[]).forEach((s,r)=>{const a=Number(s);if(!Number.isInteger(a)||a<=0)return;const i=u(t.fileName?.[r])||`Pièce jointe ${a}`,c=u(t.fileExt?.[r])||Qt(i),l=u(t.fileType?.[r]),d=Number(t.fileSize?.[r])||0;Ce.set(a,{id:a,fileName:i,fileExt:c,fileType:l,fileSize:d,imageWidth:Number(t.imageWidth?.[r])||0,imageHeight:Number(t.imageHeight?.[r])||0})})}catch(t){console.warn("Métadonnées des pièces jointes indisponibles :",t)}}}async function H(e){$=Array.isArray(e)?e:[],await Promise.all([Qe(),Ve()]);const t=document.getElementById("conteneur-kanban");if(!t)return;t.innerHTML="";const n=await o.col.STATUT.getChoices();if(!Array.isArray(n)||n.length===0){t.innerHTML=`<div class="kanban-message">${f(A("No choice available in the Status column"))}</div>`;return}n.forEach((s,r)=>{const a=on(s,r);a&&t.appendChild(a)}),$.forEach(s=>{const r=u(s.STATUT),a=Array.from(t.querySelectorAll(".contenu-colonne")).find(i=>i.dataset.statut===r);a&&a.insertBefore(cn(s),a.firstChild)}),pn(),document.querySelectorAll(".colonne-kanban").forEach(Le)}function sn(){const e=document.getElementById("config-view");!e||e.dataset.autosaveInstalled==="true"||(e.dataset.autosaveInstalled="true",e.addEventListener("input",t=>{t.target.matches("input, textarea, select")&&Te()}),e.addEventListener("change",t=>{t.target.matches("input, textarea, select")&&Te()}),e.addEventListener("click",t=>{t.target.closest(".config-switch")&&window.setTimeout(Te,0)}))}function Te(){window.clearTimeout(We),pe("saving","Sauvegarde…"),We=window.setTimeout(rn,350)}async function rn(){if(!(we||!o?._parameters||!o?._config||o._config.style.display==="none")){we=!0;try{o.opt=await o.readOptionValues(o._parameters,o._config,o.opt),await grist.widgetApi.setOption("options",JSON.parse(JSON.stringify(o.opt))),await Ie(),pe("saved","Enregistré"),window.setTimeout(()=>{pe("","")},1400)}catch(e){console.error("Impossible de sauvegarder automatiquement la configuration :",e),pe("error","Échec de la sauvegarde")}finally{we=!1}}}function pe(e,t){const n=document.getElementById("config-view");if(!n||n.style.display==="none")return;let s=n.querySelector(".config-autosave-status");!s&&t&&(s=document.createElement("div"),s.className="config-autosave-status",s.setAttribute("aria-live","polite"),n.appendChild(s)),s&&(s.className=`config-autosave-status${e?` ${e}`:""}`,s.textContent=t,s.hidden=!t)}async function Ie(){await o.isMapped(),await H($)}async function an(){ke(),Ae(),ie=!1,G=null,await Promise.all([Qe(!0),Ve(!0)]),await H($)}function on(e,t){const n=_t(t);if(n.hidecolumn)return null;const s=u(e),r=document.createElement("section");r.className=`colonne-kanban${!n.addbutton&&!o.opt.compact?" colonne-nobouton":""}`,r.id=s,localStorage.getItem(Bt(s))==="true"&&r.classList.add("collapsed");const a=o.col.STATUT.getColor(s)??Ee,i=o.col.STATUT.getTextColor(s)??Ke,c=ar(s);return r.innerHTML=`
        <div class="entete-colonne" style="background-color:${a};color:${i}">
            <div class="titre-statut">${f(s)} <span class="compteur-colonne">(0)</span></div>
            <div class="actions-colonne">
                ${n.addbutton&&!o.opt.readonly?`<button type="button" class="bouton-ajouter-entete ${o.opt.compact?"compact":""}" onclick="creerNouvelleTache(decodeURIComponent('${c}'))" aria-label="${m(A("Add a new task"))}">+</button>`:""}
                <button type="button" class="bouton-toggle" onclick="toggleColonne(this.closest('.colonne-kanban'), event)" aria-label="Replier ou déplier">⇄</button>
            </div>
        </div>
        ${n.addbutton&&!o.opt.readonly?`<button type="button" class="bouton-ajouter ${o.opt.compact?"compact":""}" onclick="creerNouvelleTache(decodeURIComponent('${c}'))">+ ${f(A("Add a new task"))}</button>`:""}
        <div class="contenu-colonne" data-statut="${m(s)}" data-isdone="${n.isdone?"true":"false"}"></div>
    `,r}function cn(e){const t=document.createElement("article"),n=o.opt.cardrotation===!0;t.className=`carte${n?"":" norotate"}${o.opt.compact?" compact":""}`,t.dataset.todoId=String(e.id),t.dataset.lastUpdate=Wt(e.DERNIERE_MISE_A_JOUR),t.dataset.deadline=Wt(e.DEADLINE),t.dataset.order=bn(e.ORDRE),mn(t,e.COULEUR);const s=e.DEADLINE?Je(e.DEADLINE):"",r=jt(e),a=Jt(e),i=Ht(e),c=_(e.CHECKLIST).flatMap(ae=>ae.items||[]),l=c.filter(ae=>ae.done).length,d=w(e.PIECES_JOINTES).length,p=he(e.LIENS).length,g=Z(e.COMMENTAIRES).length,v=e.DESCRIPTION_DISPLAY?String(e.DESCRIPTION_DISPLAY):f(u(e.DESCRIPTION)||A("No description")),h=i.map(ae=>dn(ae)).join(""),k=ln(r,a),P=ge(e.STATUT),I=be(e.DEADLINE),se=I!==null&&I<Date.now()&&I<Q.getTime(),q=o.opt.showlabels!==!1,re=o.opt.showmembers!==!1,ir=o.opt.showresponsables!==!1,or=o.opt.showdeadline!==!1,Gt=o.opt.showindicators!==!1,cr=o.opt.showchecklistprogress!==!1,Xt=(re||ir)&&k,Yt=`
        ${cr&&c.length?`<span title="${l} élément(s) terminé(s) sur ${c.length}">☑ ${l}/${c.length}</span>`:""}
        ${Gt&&d+p?`<span title="${d} fichier(s) et ${p} lien(s)">📎 ${d+p}</span>`:""}
        ${Gt&&g?`<span title="${g} commentaire(s)">💬 ${g}</span>`:""}
    `;return t.innerHTML=`
        ${q&&h?`<div class="etiquettes-list">${h}</div>`:""}
        <div class="description">${v}</div>
        ${or&&s?`<div class="deadline${se?" late":""} truncate">📅 ${f(s)}</div>`:""}
        ${Xt||Yt.trim()?`<div class="card-footer">
                <div class="card-indicators">${Yt}</div>
                ${Xt?`<div class="card-team-stack" aria-label="Équipe de la carte">${k}</div>`:""}
               </div>`:""}
        ${P?.isdone?`<div class="tampon-termine" style="color:${o.col.STATUT.getColor(e.STATUT)??Ee};">${f(u(e.STATUT))}</div>`:""}
    `,t.addEventListener("click",()=>{grist.setCursorPos({rowId:e.id}),o.opt.hideedit||X(e)}),t.addEventListener("dblclick",()=>{grist.setCursorPos({rowId:e.id}),o.opt.gristeditcard?grist.commandApi.run("viewAsCard"):o.opt.hideedit||X(e)}),t}function ln(e,t){const n=new Set(t.map(i=>Number(i.id)).filter(i=>Number.isInteger(i)&&i>0)),s=[...t.map(i=>({...i,role:"responsable"})),...e.filter(i=>!n.has(Number(i.id))).map(i=>({...i,role:"membre"}))],r=s.slice(0,6),a=s.length-r.length;return[...r.map(i=>un(i,i.role)),a>0?`<span class="card-team-more" title="${a} autre(s) membre(s)">+${a}</span>`:""].join("")}function un(e,t="membre"){const n=t==="responsable",s=n?"Responsable":"Membre";return`
        <span
            class="responsable-avatar ${n?"responsable-avatar-principal":"membre-avatar"}"
            style="background:${m(e.avatarColor)}"
            title="${m(`${s} : ${e.label}`)}"
            aria-label="${m(`${s} : ${e.label}`)}"
        >${f(e.initials)}</span>
    `}function dn(e){return`
        <span
            class="etiquette-badge"
            style="background:${m(e.color)};color:${m(e.textColor)}"
            title="${m(e.label)}"
        >${f(e.label)}</span>
    `}function mn(e,t){const n=C(t)||C(o.opt?.defaultcardcolor)||"#FFFFD1";e.style.backgroundColor=n}function pn(){document.querySelectorAll(".contenu-colonne").forEach(e=>{gn(e),!(o.opt.readonly||typeof Sortable!="function")&&new Sortable(e,{group:"kanban-todo",animation:150,ghostClass:"carte-fantome",chosenClass:"carte-selectionnee",onEnd:async t=>{const n=t.to.dataset.statut,s=t.from.dataset.statut,r=Number(t.item.dataset.todoId),a=Array.from(t.to.querySelectorAll(".carte")).map(c=>Number(c.dataset.todoId)),i=t.from===t.to?[]:Array.from(t.from.querySelectorAll(".carte")).map(c=>Number(c.dataset.todoId));try{n!==s&&await N(r,"STATUT",n),o.map?.ORDRE&&!o.col.ORDRE.getIsFormula()?await fn(a,i):(await st(t.to),t.from!==t.to&&await st(t.from))}catch(c){console.error(A("Error during status update:"),c),await H($)}Le(t.to.closest(".colonne-kanban")),t.from!==t.to&&Le(t.from.closest(".colonne-kanban"))}})})}async function fn(e,t=[]){const n=[],s=new Set;[e,t].forEach(r=>{const a=U(r).map(Number).filter(c=>Number.isInteger(c)&&c>0),i=a.join(",");a.length>0&&!s.has(i)&&(s.add(i),n.push(a))});for(const r of n)await hn(r)}async function hn(e){if(!o.map?.ORDRE||o.col.ORDRE.getIsFormula())return;const t=e.map((n,s)=>{const r=(s+1)*1e3,a=b(n),i=B(n);return a&&(a.ORDRE=r),i&&(i.dataset.order=String(r)),o.formatRecord(n,{ORDRE:r})});t.length>0&&await o.updateRecords(t)}async function st(e){if(!o.map?.DEADLINE||!e)return;const n=Array.from(e.querySelectorAll(".carte")).filter(a=>{const i=be(a.dataset.deadline);return i===null||i>=Q.getTime()});if(n.length===0)return;let s=Q.getFullYear();const r=n.map(a=>{const i=`${s}-01-01`;return s+=1,a.dataset.deadline=i,o.formatRecord(a.dataset.todoId,{DEADLINE:i})});await o.updateRecords(r)}function gn(e){if(!e)return;const t=e.dataset.isdone==="true",n=Array.from(e.children);n.sort((s,r)=>{let a=0;return o.map?.ORDRE?a=rt(s.dataset.order)-rt(r.dataset.order):o.map?.DEADLINE&&(t?a=ve(r.dataset.lastUpdate,0)-ve(s.dataset.lastUpdate,0):a=ve(s.dataset.deadline,Number.MAX_SAFE_INTEGER)-ve(r.dataset.deadline,Number.MAX_SAFE_INTEGER)),a!==0?a:(Number(s.dataset.todoId)||0)-(Number(r.dataset.todoId)||0)}),n.forEach(s=>e.appendChild(s))}function bn(e){const t=Number(e);return Number.isFinite(t)?String(t):""}function rt(e){const t=Number(e);return Number.isFinite(t)?t:Number.MAX_SAFE_INTEGER}function Le(e){if(!e)return;const t=e.querySelector(".contenu-colonne"),n=e.querySelector(".compteur-colonne");t&&n&&(n.textContent=`(${t.children.length})`)}async function X(e){const t=document.getElementById("popup-todo");if(!t)return;if(o.opt.readonly){te();return}document.querySelector(".carte.active")?.classList.remove("active"),B(e.id)?.classList.add("active");const n=ge(e.STATUT),s=await o.col.STATUT.getChoices(),r=o.col.STATUT.getColor(e.STATUT)??Ee,a=o.col.STATUT.getTextColor(e.STATUT)??Ke;t.style.setProperty("--task-status-color",r),t.style.setProperty("--task-status-text",a),t.style.borderLeftColor="transparent",t.dataset.statut=u(e.STATUT),t.dataset.isdone=n?.isdone?"true":"false",t.dataset.currentTodo=String(e.id);const i=t.querySelector(".popup-title"),c=t.querySelector(".popup-content"),l=t.querySelector(".popup-header"),d=t.querySelector(".bouton-fermer");if(i&&(i.textContent=""),l&&(l.style.backgroundColor="",l.style.color=""),d&&(d.style.color=""),!c)return;const p=o.map?.NOTES?o.col.NOTES.getIsFormula():!1,g=o.col.DESCRIPTION.getIsFormula(),v=Nn(e),h=o.opt.showmetadata!==!1?tr(e):"",k=o.map?.NOTES?Jn(e,p):"",P=o.map?.COMMENTAIRES&&o.opt.showcomments!==!1?Fs(e):"",I=!!(k||v.checklists||P),se=!!v.context;c.innerHTML=`
        <div class="task-detail-shell task-detail-v8" data-row-id="${Number(e.id)}">
            <section class="task-hero">
                <div class="task-hero-accent" aria-hidden="true"></div>
                <div class="task-hero-copy">
                    <div class="task-title-meta">
                        <label
                            class="task-status-selector"
                            style="--status-background:${m(r)};--status-color:${m(a)}"
                            title="Changer la liste de la carte"
                        >
                            <span class="task-status-selector-icon" aria-hidden="true">▾</span>
                            <select
                                class="task-status-select"
                                aria-label="Liste de la carte"
                                onchange="changerStatutDepuisFiche(
                                    ${Number(e.id)},
                                    this,
                                    event
                                )"
                            >
                                ${s.map(q=>`
                                    <option
                                        value="${m(q)}"
                                        ${u(q)===u(e.STATUT)?"selected":""}
                                    >${f(u(q))}</option>
                                `).join("")}
                            </select>
                        </label>

                        ${n?.isdone?'<span class="task-completed-pill">✓ Terminée</span>':""}
                    </div>
                    <textarea
                        class="task-detail-title auto-expand"
                        aria-label="Nom de la tâche"
                        placeholder="Nom de la tâche"
                        oninput="ajusterTextarea(this)"
                        onchange="mettreAJourTitreFiche(${Number(e.id)}, this, event)"
                        ${g?"disabled":""}
                    >${f(u(e.DESCRIPTION))}</textarea>
                </div>
            </section>

            <div class="task-actions-dock">
                ${vn()}
            </div>
            ${En(e)}

            ${se?`
                <div class="task-inline-context" aria-label="Informations actives de la carte">
                    ${v.context}
                </div>
            `:""}

            ${I?`
                <main class="task-main-column task-main-column-full">
                    ${k}
                    ${v.checklists}
                    ${P}
                </main>
            `:""}

            ${h?`<div class="task-detail-metadata">${h}</div>`:""}

            <div class="popup-actions">
                <button
                    type="button"
                    class="popup-action-button bouton-archiver"
                    onclick="archiverTodo(${Number(e.id)}, event)"
                    title="Archiver la tâche"
                    aria-label="Archiver la tâche"
                >🗃️</button>
            </div>
        </div>
    `,c.querySelectorAll(".auto-expand").forEach(W),t.classList.add("visible"),t.classList.remove("task-panel-open"),Ct(c),o.map?.PIECES_JOINTES&&w(e.PIECES_JOINTES).length>0&&await Is(e.id)}function vn(e){const t=!!(o.map?.CHECKLIST&&!o.col.CHECKLIST.getIsFormula()),n=!!(o.map?.MEMBRES&&!o.col.MEMBRES.getIsFormula()||o.map?.RESPONSABLE&&!o.col.RESPONSABLE.getIsFormula()),s=!!(o.map?.PIECES_JOINTES&&!o.col.PIECES_JOINTES.getIsFormula()||o.map?.LIENS&&!o.col.LIENS.getIsFormula());return`
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
    `}function En(e){return`
        <div class="task-action-layer">
            <div class="task-action-panels">${[yn(),o.map?.ETIQUETTES?Sn(e):"",o.map?.DEADLINE?Cn(e):"",o.map?.CHECKLIST?wn(e):"",o.map?.MEMBRES||o.map?.RESPONSABLE?kn(e):"",o.map?.PIECES_JOINTES||o.map?.LIENS?An(e):"",o.map?.COULEUR?$n(e):""].filter(Boolean).join("")}</div>
        </div>
    `}function yn(e){const t=[];return o.map?.ETIQUETTES&&t.push(["🏷️","Étiquettes","labels"]),o.map?.DEADLINE&&t.push(["📅","Dates","date"]),o.map?.CHECKLIST&&t.push(["☑","Checklist","checklist"]),(o.map?.MEMBRES||o.map?.RESPONSABLE)&&t.push(["👥","Membres","people"]),(o.map?.PIECES_JOINTES||o.map?.LIENS)&&t.push(["📎","Pièce jointe","resources"]),o.map?.COULEUR&&t.push(["🎨","Couleur de carte","color"]),`
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
    `}function Sn(e){const t=new Set(je(e)),n=o.col.ETIQUETTES.getIsFormula();return`
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
                    <label class="task-check-option" data-search="${m(s.label.toLocaleLowerCase(o.cultureFull))}">
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
    `}function Cn(e){const t=o.col.DEADLINE.getIsFormula();return`
        <section class="task-action-panel" data-panel="date" hidden>
            <div class="task-panel-heading">
                <div><strong>Date limite</strong><span>Ajoutez ou modifiez l’échéance de la carte</span></div>
                <button type="button" onclick="fermerPanneauxFiche(event)" aria-label="Fermer">×</button>
            </div>
            <div class="task-date-editor">
                <input
                    type="date"
                    value="${m(sr(e.DEADLINE))}"
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
    `}function wn(e){const t=o.col.CHECKLIST.getIsFormula();return`
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
    `}function kn(e){const t=new Set(Zs(e)),n=new Set(er(e)),s=!o.map?.MEMBRES||o.col.MEMBRES.getIsFormula(),r=!o.map?.RESPONSABLE||o.col.RESPONSABLE.getIsFormula();return`
        <section
            class="task-action-panel task-people-panel"
            data-panel="people"
            data-row-id="${Number(e.id)}"
            hidden
        >
            <div class="task-panel-heading">
                <div>
                    <strong>Équipe de la carte</strong>
                    <span>
                        Sélectionnez simplement le rôle de chaque personne,
                        puis enregistrez.
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
                    ${t.size} membre(s)
                </span>
                <span data-team-count="RESPONSABLE">
                    ${n.size} responsable(s)
                </span>
            </div>

            <div class="task-people-roster">
                ${L.map(a=>`
                    <article
                        class="task-person-card"
                        data-search="${m(`${a.label} ${a.email||""}`.toLocaleLowerCase(o.cultureFull))}"
                    >
                        <div class="task-person-identity">
                            <span
                                class="task-person-avatar"
                                style="background:${m(a.avatarColor)}"
                            >${f(a.initials)}</span>

                            <span class="task-person-copy">
                                <strong>${f(a.label)}</strong>
                                ${a.email?`<small>${f(a.email)}</small>`:""}
                            </span>
                        </div>

                        <div
                            class="task-person-role-actions"
                            aria-label="Rôles de ${m(a.label)}"
                        >
                            <button
                                type="button"
                                class="task-person-role-button task-person-role-member${t.has(a.id)?" active":""}"
                                data-role="MEMBRES"
                                data-person-id="${a.id}"
                                aria-pressed="${t.has(a.id)?"true":"false"}"
                                onclick="basculerRolePersonnePanneau(this, event)"
                                ${s?"disabled":""}
                            >
                                <span aria-hidden="true">👤</span>
                                <strong>Membre</strong>
                            </button>

                            <button
                                type="button"
                                class="task-person-role-button task-person-role-responsable${n.has(a.id)?" active":""}"
                                data-role="RESPONSABLE"
                                data-person-id="${a.id}"
                                aria-pressed="${n.has(a.id)?"true":"false"}"
                                onclick="basculerRolePersonnePanneau(this, event)"
                                ${r?"disabled":""}
                            >
                                <span aria-hidden="true">◆</span>
                                <strong>Responsable</strong>
                            </button>
                        </div>
                    </article>
                `).join("")||`
                    <div class="section-empty">
                        Aucune personne disponible dans la table Membres.
                    </div>
                `}
            </div>

            <div class="task-people-panel-footer">
                <div
                    class="task-panel-status section-status"
                    aria-live="polite"
                ></div>
                <button
                    type="button"
                    class="task-people-save-button"
                    onclick="enregistrerEquipeDepuisPanneau(
                        ${Number(e.id)},
                        this,
                        event
                    )"
                >Enregistrer l’équipe</button>
            </div>
        </section>
    `}function An(e){const t=!!(o.map?.PIECES_JOINTES&&!o.col.PIECES_JOINTES.getIsFormula()),n=!!(o.map?.LIENS&&!o.col.LIENS.getIsFormula());return`
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
    `}function $n(e){const t=C(e.COULEUR),n=t||C(o.opt?.defaultcardcolor)||"#FFFFD1",s=o.col.COULEUR.getIsFormula();return`
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
    `}function Nn(e){const t=[],n=Ht(e),s=jt(e),r=Jt(e),a=C(e.COULEUR),i=_(e.CHECKLIST),c=w(e.PIECES_JOINTES),l=he(e.LIENS);n.length>0&&t.push(Tn(e,n)),e.DEADLINE&&t.push(In(e)),(s.length>0||r.length>0)&&t.push(Ln(e,s,r)),a&&t.push(Rn(e,a));const d=[];return t.length>0&&d.push(`<div class="task-property-grid">${t.join("")}</div>`),(c.length>0||l.length>0)&&o.opt.showattachments!==!1&&d.push(As(e,c,l)),{context:d.join(""),checklists:i.length>0&&o.opt.showchecklist!==!1?ms(e,i):""}}function Tn(e,t){return`
        <section class="task-compact-meta task-compact-labels">
            <span class="task-compact-meta-title">Étiquettes</span>
            <div class="task-compact-meta-content task-label-chips">
                ${t.map(n=>`
                    <span
                        class="etiquette-active"
                        style="background:${m(n.color)};color:${m(n.textColor)}"
                    >
                        <span>${f(n.label)}</span>
                        ${o.col.ETIQUETTES.getIsFormula()?"":`
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
                ${o.col.ETIQUETTES.getIsFormula()?"":`
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
    `}function In(e){const t=be(e.DEADLINE),n=t!==null&&t<Date.now();return`
        <button
            type="button"
            class="task-compact-meta task-compact-date${n?" is-late":""}"
            onclick="ouvrirPanneauFiche('date', event, true)"
            title="Modifier la date limite"
        >
            <span class="task-compact-meta-title">Date</span>
            <span class="task-compact-date-value">
                <span aria-hidden="true">📅</span>
                <strong>${f(Je(e.DEADLINE))}</strong>
                ${n?"<small>En retard</small>":""}
            </span>
        </button>
    `}function Ln(e,t,n){const s=new Set(n.map(a=>Number(a.id)).filter(a=>Number.isInteger(a)&&a>0));return`
        <section class="task-compact-meta task-compact-team">
            <span class="task-compact-meta-title">Équipe</span>
            <div class="task-compact-team-avatars">
                ${[...n.map(a=>({...a,role:"responsable"})),...t.filter(a=>!s.has(Number(a.id))).map(a=>({...a,role:"membre"}))].map(a=>`
                    <span
                        class="task-compact-avatar${a.role==="responsable"?" is-responsable":""}"
                        style="background:${m(a.avatarColor)}"
                        title="${m(`${a.role==="responsable"?"Responsable":"Membre"} : ${a.label}`)}"
                    >${f(a.initials)}</span>
                `).join("")}
                <button
                    type="button"
                    class="task-compact-add"
                    onclick="ouvrirPanneauFiche('people', event, true)"
                    aria-label="Ajouter un membre ou un responsable"
                    title="Modifier l’équipe"
                >+</button>
            </div>
        </section>
    `}function Rn(e,t){return`
        <button
            type="button"
            class="task-compact-meta task-compact-color"
            onclick="ouvrirPanneauFiche('color', event, true)"
            title="Modifier la couleur de la carte"
        >
            <span class="task-compact-meta-title">Couleur</span>
            <span
                class="task-compact-color-dot"
                style="background:${m(t)}"
                aria-hidden="true"
            ></span>
            <span class="task-compact-color-code">${f(t)}</span>
        </button>
    `}function at(e,t,n=!1){t?.preventDefault(),t?.stopPropagation();const s=document.getElementById("popup-todo"),r=s?.querySelector(`.task-action-panel[data-panel="${e}"]`);if(!s||!r)return;const a=!r.hidden;if(s.querySelectorAll(".task-action-panel").forEach(i=>{i.hidden=!0}),s.querySelectorAll(".task-quick-button").forEach(i=>{i.classList.remove("active"),i.setAttribute("aria-expanded","false")}),!a||n){r.hidden=!1,s.classList.add("task-panel-open");const i=s.querySelector(`[data-panel-trigger="${e}"]`);i?.classList.add("active"),i?.setAttribute("aria-expanded","true"),window.setTimeout(()=>{r.querySelector('input:not([type="checkbox"]):not([type="file"]), textarea, button')?.focus()},0)}else F(t)}function F(e){e?.preventDefault(),e?.stopPropagation();const t=document.getElementById("popup-todo");t?.querySelectorAll(".task-action-panel").forEach(n=>{n.hidden=!0}),t?.querySelectorAll(".task-quick-button").forEach(n=>{n.classList.remove("active"),n.setAttribute("aria-expanded","false")}),t?.classList.remove("task-panel-open")}function it(e){return u(e).normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim().toLocaleLowerCase(o.cultureFull)}function Dn(e){const t=e?.closest(".task-action-panel");if(!t)return;const n=it(e.value);t.querySelectorAll("[data-search]").forEach(s=>{const r=it(s.dataset.search),a=n===""||r.includes(n);s.hidden=!a,s.style.display=a?"":"none"})}async function S(e,t=""){const n=document.getElementById("popup-todo"),r=n?.querySelector(".popup-content")?.scrollTop||0,a=b(e);if(!a)return;await X(a);const i=n?.querySelector(".popup-content");i&&(i.scrollTop=r),t&&at(t,null,!0)}async function Mn(e,t,n){n?.preventDefault(),n?.stopPropagation();const s=u(t?.value).trim(),r=b(e);if(!s||!r||s===u(r.STATUT))return;const a=u(r.STATUT);t.disabled=!0;try{ge(s)?.useconfetti&&Vt();const c={STATUT:s,...ee()};o.map?.ORDRE&&!o.col.ORDRE.getIsFormula()&&(c.ORDRE=Be(s)),await o.updateRecords(o.formatRecord(e,c)),Object.assign(r,c),await H($),await S(e)}catch(i){console.error("Impossible de changer la liste de la carte :",i),t.value=a,t.disabled=!1}}async function Pn(e,t,n){const s=u(t?.value).trim();await N(e,"DESCRIPTION",s,n);const r=B(e)?.querySelector(".description");r&&(r.textContent=s||A("No description"))}async function qn(e,t,n,s,r){const i=r?.target?.closest(".task-action-panel")?.querySelector(".task-panel-status");try{i&&(i.className="task-panel-status section-status saving",i.textContent="Enregistrement…"),await N(e,t,n,r),await S(e,s)}catch{i&&(i.className="task-panel-status section-status error",i.textContent="Impossible d’enregistrer.")}}async function On(e,t,n){n?.stopPropagation();const s=t?.querySelector(".task-panel-status"),r=Array.from(t.querySelectorAll('input[type="checkbox"]:checked')).map(a=>Number(a.value)).filter(a=>O.has(a));try{s&&(s.className="task-panel-status section-status saving",s.textContent="Enregistrement…"),await z(e,"ETIQUETTES",r),Pe(e,r),await S(e,"labels")}catch{s&&(s.className="task-panel-status section-status error",s.textContent="Impossible d’enregistrer les étiquettes.")}}async function Fn(e,t,n){n?.preventDefault(),n?.stopPropagation();const s=b(e),r=je(s).filter(a=>a!==Number(t));await z(e,"ETIQUETTES",r),Pe(e,r),await S(e)}function xn(e,t){if(t?.preventDefault(),t?.stopPropagation(),!e||e.disabled)return;const n=e.closest(".task-action-panel"),s=Number(e.dataset.personId),r=u(e.dataset.role),a=!e.classList.contains("active"),i=n?.querySelector(`.task-person-role-button[data-role="MEMBRES"][data-person-id="${s}"]`),c=n?.querySelector(`.task-person-role-button[data-role="RESPONSABLE"][data-person-id="${s}"]`);Re(e,a),r==="RESPONSABLE"?Re(i,a):r==="MEMBRES"&&!a&&c?.classList.contains("active")&&Re(c,!1),_n(n)}function Re(e,t){!e||e.disabled||(e.classList.toggle("active",!!t),e.setAttribute("aria-pressed",t?"true":"false"))}function _n(e){e&&["MEMBRES","RESPONSABLE"].forEach(t=>{const n=e.querySelectorAll(`.task-person-role-button[data-role="${t}"].active`).length,s=e.querySelector(`[data-team-count="${t}"]`);s&&(s.textContent=t==="MEMBRES"?`${n} membre(s)`:`${n} responsable(s)`)})}async function Bn(e,t,n){n?.preventDefault(),n?.stopPropagation();const s=t?.closest(".task-action-panel"),r=s?.querySelector(".task-panel-status");if(!s)return;const a=Array.from(s.querySelectorAll('.task-person-role-button[data-role="MEMBRES"].active')).map(c=>Number(c.dataset.personId)).filter(c=>Number.isInteger(c)&&y.has(c)),i=Array.from(s.querySelectorAll('.task-person-role-button[data-role="RESPONSABLE"].active')).map(c=>Number(c.dataset.personId)).filter(c=>Number.isInteger(c)&&y.has(c));t.disabled=!0;try{r&&(r.className="task-panel-status section-status saving",r.textContent="Enregistrement…"),o.map?.MEMBRES&&!o.col.MEMBRES.getIsFormula()&&(await z(e,"MEMBRES",a),De(e,"MEMBRES",a)),o.map?.RESPONSABLE&&!o.col.RESPONSABLE.getIsFormula()&&(await z(e,"RESPONSABLE",i),De(e,"RESPONSABLE",i)),r&&(r.className="task-panel-status section-status saved",r.textContent="Équipe enregistrée."),F(),await S(e)}catch(c){console.error("Impossible d’enregistrer l’équipe :",c),r&&(r.className="task-panel-status section-status error",r.textContent="Impossible d’enregistrer l’équipe.")}finally{t.disabled=!1}}function Un(e,t,n){n.key==="Enter"&&(n.preventDefault(),ot(e,t,n))}async function ot(e,t,n){n?.preventDefault(),n?.stopPropagation();const s=t.closest(".task-action-panel"),r=s?.querySelector(".new-checklist-title"),a=s?.querySelector(".task-panel-status"),i=u(r?.value).trim();if(!i){a&&(a.className="task-panel-status section-status error",a.textContent="Saisissez un titre."),r?.focus();return}await M(e,c=>[...c,{id:j(),title:i,items:[],createdAt:new Date().toISOString()}]),await S(e)}async function jn(e,t,n,s){const a=n?.closest(".task-action-panel")?.querySelector(".task-panel-status"),i=u(t).trim(),c=C(i);if(i&&!c){a&&(a.className="task-panel-status section-status error",a.textContent="Utilisez un code hexadécimal valide.");return}try{a&&(a.className="task-panel-status section-status saving",a.textContent="Enregistrement…"),await N(e,"COULEUR",c||null,s);const l=B(e);l&&(l.style.backgroundColor=c||C(o.opt?.defaultcardcolor)||"#FFFFD1"),await S(e,"color")}catch{a&&(a.className="task-panel-status section-status error",a.textContent="Impossible d’enregistrer la couleur.")}}function Jn(e,t){const n=Number(e.id),s=Wn(e.NOTES),r=dt(s).trim().length>0,a=t?"disabled":"",i=[["bold","<strong>B</strong>","Gras"],["italic","<em>I</em>","Italique"],["underline","<u>U</u>","Souligné"],["strikeThrough","<s>S</s>","Barré"],["insertUnorderedList","• Liste","Liste à puces"],["insertOrderedList","1. Liste","Liste numérotée"],["insertHorizontalRule","―","Ligne de séparation"],["removeFormat","Tx","Effacer la mise en forme"],["undo","↶","Annuler"],["redo","↷","Rétablir"]].map(([c,l,d])=>`
        <button
            type="button"
            class="notes-tool"
            data-command="${c}"
            onmousedown="event.preventDefault()"
            onclick="appliquerCommandeNotes(this, '${c}', null, event)"
            title="${m(d)}"
            aria-label="${m(d)}"
            ${a}
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
                    ${a}
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
                        ${a}
                    >
                        <option value="p">Paragraphe</option>
                        <option value="h2">Titre</option>
                        <option value="h3">Sous-titre</option>
                        <option value="blockquote">Citation</option>
                        <option value="pre">Bloc de code</option>
                    </select>

                    <span class="notes-toolbar-separator" aria-hidden="true"></span>

                    ${i}

                    <button
                        type="button"
                        class="notes-tool"
                        onmousedown="event.preventDefault()"
                        onclick="appliquerBaliseSelectionNotes(this, 'code', event)"
                        title="Code dans la ligne"
                        aria-label="Code dans la ligne"
                        ${a}
                    >&lt;/&gt;</button>

                    <button
                        type="button"
                        class="notes-tool"
                        onmousedown="event.preventDefault()"
                        onclick="appliquerBaliseSelectionNotes(this, 'mark', event)"
                        title="Surligner"
                        aria-label="Surligner"
                        ${a}
                    >🖍</button>

                    <button
                        type="button"
                        class="notes-tool notes-tool-link"
                        onmousedown="event.preventDefault()"
                        onclick="creerLienNotes(this, event)"
                        title="Ajouter ou modifier un lien"
                        aria-label="Ajouter ou modifier un lien"
                        ${a}
                    >🔗 Lien</button>

                    <button
                        type="button"
                        class="notes-tool"
                        data-command="unlink"
                        onmousedown="event.preventDefault()"
                        onclick="appliquerCommandeNotes(this, 'unlink', null, event)"
                        title="Retirer le lien"
                        aria-label="Retirer le lien"
                        ${a}
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
    `}function Hn(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".notes-field"),s=n?.querySelector(".notes-edit-panel"),r=n?.querySelector(".notes-display"),a=n?.querySelector(".notes-editor");!n||!s||!r||!a||n.dataset.disabled==="true"||(n._originalNotesHtml=Y(a.innerHTML),n.classList.add("is-editing"),n.classList.remove("is-dirty"),r.hidden=!0,s.hidden=!1,e.hidden=!0,document.execCommand("defaultParagraphSeparator",!1,"p"),a.focus(),Zn(a),K(a),x(Number(n.dataset.rowId),"",""))}function Kn(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".notes-field"),s=n?.querySelector(".notes-editor");!n||!s||(s.innerHTML=n._originalNotesHtml||"",ct(n,!1))}async function zn(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".notes-field"),s=n?.querySelector(".notes-editor"),r=Number(n?.dataset?.rowId);if(!(!n||!s||!Number.isInteger(r)||r<=0)){e.disabled=!0;try{const a=await es(r,s);n._originalNotesHtml=a,ct(n,!0)}finally{e.disabled=!1}}}function ct(e,t){const n=e.querySelector(".notes-edit-panel"),s=e.querySelector(".notes-display"),r=e.querySelector(".notes-editor"),a=e.querySelector(".notes-edit-button");if(t&&s&&r){const i=Y(r.innerHTML).trim(),c=dt(i).trim().length>0;s.innerHTML=c?i:"Aucune note pour cette tâche.",s.classList.toggle("empty",!c)}e.classList.remove("is-editing","is-dirty"),n&&(n.hidden=!0),s&&(s.hidden=!1),a&&(a.hidden=!1),x(Number(e.dataset.rowId),"","")}function Wn(e){const t=u(e).trim();if(!t)return"";const s=/<\/?[a-z][\s\S]*>/i.test(t)?t:f(t).replace(/\r?\n/g,"<br>");return Y(s)}function Y(e){const t=document.createElement("template");t.innerHTML=u(e);const n=new Set(["B","STRONG","I","EM","U","S","STRIKE","A","UL","OL","LI","P","DIV","BR","BLOCKQUOTE","H2","H3","SPAN","CODE","PRE","HR","MARK"]),s=new Set(["SCRIPT","STYLE","IFRAME","OBJECT","EMBED","FORM","INPUT","BUTTON","SVG","MATH","META","LINK"]),r=a=>{Array.from(a.childNodes).forEach(i=>{if(i.nodeType===Node.ELEMENT_NODE){if(s.has(i.tagName)){i.remove();return}if(!n.has(i.tagName)){r(i),i.replaceWith(...Array.from(i.childNodes));return}if(Array.from(i.attributes).forEach(c=>{i.tagName==="A"&&["href","target","rel"].includes(c.name.toLowerCase())||i.removeAttribute(c.name)}),i.tagName==="A"){const c=ut(i.getAttribute("href"));if(!c){i.replaceWith(...Array.from(i.childNodes));return}i.setAttribute("href",c),i.setAttribute("target","_blank"),i.setAttribute("rel","noopener noreferrer")}r(i)}else i.nodeType!==Node.TEXT_NODE&&i.remove()})};return r(t.content),t.innerHTML}function Qn(e,t){t?.preventDefault(),t?.stopPropagation();const s=e.closest(".notes-field")?.querySelector(".notes-editor");!s||s.contentEditable!=="true"||(s.focus(),document.execCommand("formatBlock",!1,e.value||"p"),R(s),K(s))}function Vn(e,t,n,s){s?.preventDefault(),s?.stopPropagation();const a=e.closest(".notes-field")?.querySelector(".notes-editor");!a||a.contentEditable!=="true"||(a.focus(),document.execCommand(t,!1,n),R(a),K(a))}function Gn(e,t,n){n?.preventDefault(),n?.stopPropagation();const r=e.closest(".notes-field")?.querySelector(".notes-editor"),a=window.getSelection();if(!r||r.contentEditable!=="true"||!a||a.rangeCount===0)return;r.focus();const i=a.getRangeAt(0);if(!r.contains(i.commonAncestorContainer))return;const c=i.toString(),l=t==="mark"?"mark":"code";c?document.execCommand("insertHTML",!1,`<${l}>${f(c)}</${l}>`):document.execCommand("insertHTML",!1,`<${l}>&#8203;</${l}>`),R(r),K(r)}function lt(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".notes-field"),s=n?.querySelector(".notes-editor");if(!s||s.contentEditable!=="true")return;s.focus();const r=window.prompt("Adresse du lien :","https://");if(r===null)return;const a=ut(r);if(!a){x(Number(n.dataset.rowId),"error","Adresse de lien invalide.");return}const i=window.getSelection();!i||i.isCollapsed?document.execCommand("insertHTML",!1,`<a href="${m(a)}" target="_blank" rel="noopener noreferrer">${f(a)}</a>`):document.execCommand("createLink",!1,a),R(s),K(s)}function ut(e){const t=u(e).trim();if(!t)return"";const n=/^(https?:|mailto:|tel:)/i.test(t)?t:`https://${t}`;try{const s=new URL(n);return["http:","https:","mailto:","tel:"].includes(s.protocol)?s.href:""}catch{return""}}function Xn(e,t){if(!t?.clipboardData)return;t.preventDefault();const n=t.clipboardData.getData("text/html"),s=t.clipboardData.getData("text/plain"),r=n?Y(n):f(s).replace(/\r?\n/g,"<br>");document.execCommand("insertHTML",!1,r),R(e)}function R(e){const t=e?.closest(".notes-field");t&&(t.classList.add("is-dirty"),x(Number(t.dataset.rowId),"saving","Modifications non enregistrées"))}function K(e){const t=e?.closest(".notes-field");if(!t||!t.classList.contains("is-editing"))return;t.querySelectorAll(".notes-tool[data-command]").forEach(s=>{let r=!1;try{r=document.queryCommandState(s.dataset.command)}catch{r=!1}s.classList.toggle("active",r),s.setAttribute("aria-pressed",r?"true":"false")});const n=t.querySelector(".notes-format-select");if(n){let s="p";try{s=u(document.queryCommandValue("formatBlock")).replace(/[<>]/g,"").toLowerCase()||"p"}catch{s="p"}Array.from(n.options).some(r=>r.value===s)?n.value=s:n.value="p"}}function Yn(e,t){if(!(t.ctrlKey||t.metaKey))return;const n=t.key.toLowerCase();if(n==="k"){t.preventDefault();const s=e.closest(".notes-field")?.querySelector(".notes-tool-link");s&&lt(s,t)}t.shiftKey&&n==="7"&&(t.preventDefault(),document.execCommand("insertOrderedList"),R(e)),t.shiftKey&&n==="8"&&(t.preventDefault(),document.execCommand("insertUnorderedList"),R(e))}function Zn(e){const t=document.createRange(),n=window.getSelection();t.selectNodeContents(e),t.collapse(!1),n?.removeAllRanges(),n?.addRange(t)}function dt(e){const t=document.createElement("template");return t.innerHTML=u(e),t.content.textContent||""}async function es(e,t){if(!t)return"";const n=Number(e),s=Y(t.innerHTML).trim(),r=me.get(n)||Promise.resolve();x(n,"saving","Enregistrement…");const a=r.catch(()=>{}).then(()=>N(n,"NOTES",s||null)).then(()=>(t.innerHTML=s,x(n,"saved","Enregistré"),s)).catch(i=>{throw x(n,"error","Échec de l’enregistrement"),console.error("Erreur pendant l’enregistrement des notes :",i),i}).finally(()=>{me.get(n)===a&&me.delete(n)});return me.set(n,a),a}function x(e,t,n){const s=document.getElementById(`notes-status-${Number(e)}`);s&&(s.className=`section-status notes-status${t?` ${t}`:""}`,s.textContent=n)}function C(e){const t=u(e).trim();if(!t)return"";const n=t.startsWith("#")?t:`#${t}`;return/^#[0-9a-f]{3}$/i.test(n)?`#${n[1]}${n[1]}${n[2]}${n[2]}${n[3]}${n[3]}`.toUpperCase():/^#[0-9a-f]{6}$/i.test(n)?n.toUpperCase():""}function ts(e,t,n){const s=C(t);if(!s)return;const r=B(e);r&&(r.style.backgroundColor=s);const a=n?.closest(".color-field");if(a){const i=a.querySelector(".color-picker"),c=a.querySelector(".color-value");i&&n!==i&&(i.value=s),c&&n!==c&&(c.value=s)}}async function mt(e,t,n,s){s?.stopPropagation();const r=n?.closest(".color-field"),a=r?.querySelector(".color-status"),i=u(t).trim(),c=C(i);if(i&&!c){a&&(a.className="section-status color-status error",a.textContent="Utilisez un code hexadécimal, par exemple #FFFFD1.");return}try{a&&(a.className="section-status color-status saving",a.textContent="Enregistrement…"),await N(e,"COULEUR",c||null,s);const l=B(e);if(l&&(c?l.style.backgroundColor=c:l.style.backgroundColor=C(o.opt?.defaultcardcolor)||"#FFFFD1"),r){const d=r.querySelector(".color-picker"),p=r.querySelector(".color-value");d&&(d.value=c||C(o.opt?.defaultcardcolor)||"#FFFFD1"),p&&(p.value=c||"")}a&&(a.className="section-status color-status saved",a.textContent="Enregistré",window.setTimeout(()=>{a.className="section-status color-status",a.textContent=""},1200))}catch(l){a&&(a.className="section-status color-status error",a.textContent="Impossible d’enregistrer la couleur."),console.error("Erreur pendant l’enregistrement de la couleur :",l)}}function ns(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".color-field"),s=Number(n?.dataset?.rowId);if(!n||!Number.isInteger(s)||s<=0)return;const r=n.querySelector(".color-value");r&&(r.value=""),mt(s,"",e,t)}function ss(e,t,n){const s=ne(e);return s.length===0?"Choisir…":s.length===1?s[0]:`${s.length} ${n||`${t}s`}`}function rs(e){const t=e.closest(".multi-dropdown");if(!t)return;const n=e.value.trim().toLocaleLowerCase(o.cultureFull);t.querySelectorAll(".multi-option").forEach(s=>{const r=s.querySelector('input[type="checkbox"]'),a=s.dataset.hideWhenSelected==="true"&&r?.checked,i=n!==""&&!u(s.dataset.search).includes(n);s.hidden=!!(a||i)}),ft(t)}function as(e,t,n,s,r){r?.preventDefault(),r?.stopPropagation();const a=e.closest(".multi-dropdown");a&&(a.querySelectorAll('input[type="checkbox"]:checked').forEach(i=>{i.checked=!1}),pt(Number(a.dataset.rowId),t,a,n,s,r))}async function pt(e,t,n,s,r,a){a?.stopPropagation();const i=Number(e||n?.dataset?.rowId);if(!Number.isInteger(i)||i<=0||!n)return;const c=Array.from(n.querySelectorAll('input[type="checkbox"]:checked')).map(h=>Number(h.value)).filter(h=>Number.isInteger(h)&&h>0&&y.has(h)),l=c.map(h=>y.get(h)?.label).filter(Boolean),d=n.querySelector("summary");d&&(d.textContent=ss(l,s,r)),D(n,"saving","Enregistrement…");const p=`${t}:${i}`,v=(oe.get(p)||Promise.resolve()).catch(()=>{}).then(()=>z(i,t,c)).then(()=>{De(i,t,c),D(n,"saved","Enregistré"),window.setTimeout(()=>D(n,"",""),1200)}).catch(h=>{D(n,"error","Échec de l’enregistrement"),console.error(`Erreur lors de l’enregistrement de ${t} :`,h)}).finally(()=>{oe.get(p)===v&&oe.delete(p)});oe.set(p,v),await v}function De(e,t,n){const s=b(e);s&&(s[`${t}_id`]=[...n],s[t]=n.map(r=>y.get(r)?.label).filter(Boolean))}function is(e,t,n){return e.length?e.map(s=>`
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
    `).join(""):'<span class="etiquettes-empty">Aucune étiquette</span>'}function os(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".multi-dropdown");n&&(n.querySelectorAll('input[type="checkbox"]:checked').forEach(s=>{s.checked=!1}),Me(Number(n.dataset.rowId),n,t))}function cs(e,t,n,s){s?.preventDefault(),s?.stopPropagation();const a=n.closest(".field-etiquettes")?.querySelector(".etiquettes-dropdown");if(!a)return;const i=a.querySelector(`input[type="checkbox"][value="${Number(t)}"]`);i&&(i.checked=!1),Me(Number(e),a,s)}async function Me(e,t,n){n?.stopPropagation();const s=Number(e||t?.dataset?.rowId);if(!Number.isInteger(s)||s<=0||!t)return;const r=Array.from(t.querySelectorAll('input[type="checkbox"]:checked')).map(c=>Number(c.value)).filter(c=>Number.isInteger(c)&&c>0&&O.has(c));ls(t,s,r),D(t,"saving","Enregistrement…");const i=(ce.get(s)||Promise.resolve()).catch(()=>{}).then(()=>z(s,"ETIQUETTES",r)).then(()=>{Pe(s,r),D(t,"saved","Enregistré"),window.setTimeout(()=>D(t,"",""),1200)}).catch(c=>{D(t,"error","Échec de l’enregistrement"),console.error("Erreur lors de l’enregistrement des étiquettes :",c)}).finally(()=>{ce.get(s)===i&&ce.delete(s)});ce.set(s,i),await i}function ls(e,t,n){const r=e.closest(".field-etiquettes")?.querySelector(".etiquettes-actives"),a=new Set(n),i=n.map(c=>O.get(c)).filter(Boolean);r&&(r.innerHTML=is(i,t)),e.querySelectorAll(".etiquette-option").forEach(c=>{const l=c.querySelector('input[type="checkbox"]'),d=a.has(Number(l?.value));l&&(l.checked=d),c.hidden=d}),ft(e)}function ft(e){if(!e?.classList.contains("etiquettes-dropdown"))return;const t=e.querySelector(".multi-all-selected"),n=Array.from(e.querySelectorAll(".etiquette-option")).filter(s=>!s.hidden);t&&(t.hidden=n.length>0)}function Pe(e,t){const n=b(e);n&&(n.ETIQUETTES_id=[...t],n.ETIQUETTES=t.map(s=>O.get(s)?.label).filter(Boolean))}async function z(e,t,n){const s=o.map?.[t];if(!s||Array.isArray(s))throw new Error(`La colonne ${t} n’est pas correctement mappée.`);const r=[...new Set(U(n).map(Number).filter(d=>Number.isInteger(d)&&d>0))],a=await grist.getTable().getTableId(),i=r.length>0?["L",...r]:null;await grist.docApi.applyUserActions([["UpdateRecord",a,Number(e),{[s]:i}]]);const c=await ht(e,s),l=us(c);if(!ds(r,l))throw new Error(`Vérification d’écriture échouée pour ${t}. Valeur envoyée : ${JSON.stringify(i)} ; valeur relue : ${JSON.stringify(c)}`);await Ft(e)}async function ht(e,t){const n=await grist.getTable().getTableId(),s=await grist.docApi.fetchTable(n),r=U(s?.id).findIndex(a=>Number(a)===Number(e));if(r<0)throw new Error(`Ligne ${e} introuvable dans la table ${n}.`);return s?.[t]?.[r]}function us(e){return e==null||e===""?[]:!Array.isArray(e)||e[0]==="E"?[]:e[0]==="L"?w(e.slice(1)):e[0]==="r"?w(e[2]):w(e)}function ds(e,t){const n=[...new Set(e.map(Number))].sort((r,a)=>r-a),s=[...new Set(t.map(Number))].sort((r,a)=>r-a);return n.length===s.length&&n.every((r,a)=>r===s[a])}function D(e,t,n){const s=e?.querySelector(".multi-status");s&&(s.className=`multi-status${t?` ${t}`:""}`,s.textContent=n)}function _(e){const t=u(e).trim();if(!t)return[];try{const n=JSON.parse(t);if(!Array.isArray(n))return[];if(n.length>0&&n.every(r=>!Array.isArray(r?.items))){const r=n.map((a,i)=>bt(a,i));return r.length>0?[{id:"legacy-checklist",title:"Checklist",items:r,createdAt:""}]:[]}return n.map((r,a)=>gt(r,a)).filter(r=>r.title||r.items.length>0)}catch(n){return console.warn("Checklists illisibles, valeur ignorée :",n),[]}}function gt(e,t=0){const n=Array.isArray(e?.items)?e.items.map((s,r)=>bt(s,r)):[];return{id:u(e?.id)||`checklist-${t}-${j()}`,title:u(e?.title||e?.name).trim()||`Checklist ${t+1}`,items:n,createdAt:u(e?.createdAt)}}function bt(e,t=0){return{id:u(e?.id)||`item-${t}-${j()}`,text:u(e?.text).trim(),done:!!e?.done,memberIds:[...new Set(w(e?.memberIds||e?.members||[]))],dueDate:vt(e?.dueDate),createdAt:u(e?.createdAt)}}function vt(e){const t=u(e).trim();return/^\d{4}-\d{2}-\d{2}$/.test(t)?t:""}function ms(e,t=_(e.CHECKLIST)){if(!t.length)return"";const n=o.col.CHECKLIST.getIsFormula();return`
        <div class="checklists-stack" data-row-id="${Number(e.id)}">
            ${t.map(s=>Et(s,e.id,n)).join("")}
        </div>
    `}function Et(e,t,n){const s=e.items.filter(a=>a.done).length,r=e.items.length>0?Math.round(s/e.items.length*100):0;return`
        <section
            class="detail-section checklist-section checklist-section-compact"
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
                    <span class="checklist-compact-count">
                        ${s}/${e.items.length}
                    </span>
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

            <div
                class="checklist-progress checklist-progress-compact"
                role="progressbar"
                aria-valuemin="0"
                aria-valuemax="100"
                aria-valuenow="${r}"
            >
                <span style="width:${r}%"></span>
            </div>

            <div
                class="checklist-items"
                data-row-id="${Number(t)}"
                data-checklist-id="${m(e.id)}"
            >
                ${e.items.length?e.items.map(a=>ps(a,e.id,t,n)).join(""):'<div class="section-empty checklist-empty">Cette checklist est vide.</div>'}
            </div>

            ${n?"":`
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
                                ${Number(t)},
                                '${E(e.id)}',
                                this,
                                event
                            )"
                        >
                        <div class="checklist-add-actions">
                            <button
                                type="button"
                                class="checklist-add-confirm"
                                onclick="ajouterItemChecklist(
                                    ${Number(t)},
                                    '${E(e.id)}',
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
                id="checklist-status-${Number(t)}-${wt(e.id)}"
                class="section-status checklist-status"
                aria-live="polite"
            ></div>
        </section>
    `}function ps(e,t,n,s){const r=e.memberIds.map(c=>y.get(c)).filter(Boolean),a=!e.done&&e.dueDate&&new Date(`${e.dueDate}T23:59:59`).getTime()<Date.now(),i=e.dueDate?`${a?"Échéance dépassée":"Date limite"} : ${Je(e.dueDate)}`:"Ajouter une date limite";return`
        <article
            class="checklist-item checklist-item-compact${e.done?" done":""}${a?" overdue":""}"
            data-item-id="${m(e.id)}"
        >
            ${s?"":`
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
                    onchange="mettreAJourItemChecklist(
                        ${Number(n)},
                        '${E(t)}',
                        '${E(e.id)}',
                        'done',
                        this.checked,
                        this,
                        event
                    )"
                    ${s?"disabled":""}
                >
                <span aria-hidden="true"></span>
            </label>

            <textarea
                class="checklist-item-text auto-expand"
                rows="1"
                oninput="ajusterTextarea(this)"
                onchange="mettreAJourItemChecklist(
                    ${Number(n)},
                    '${E(t)}',
                    '${E(e.id)}',
                    'text',
                    this.value,
                    this,
                    event
                )"
                ${s?"disabled":""}
            >${f(e.text)}</textarea>

            <div class="checklist-item-actions">
                <label
                    class="checklist-inline-date${a?" overdue":""}${e.dueDate?" has-date":""}"
                    title="${m(i)}"
                >
                    <span
                        class="checklist-inline-date-button"
                        aria-hidden="true"
                    >
                        <span class="checklist-inline-date-emoji">📅</span>
                        ${e.dueDate?`<span class="checklist-inline-date-value">${f(nr(e.dueDate))}</span>`:""}
                    </span>

                    <input
                        type="date"
                        class="checklist-inline-date-input"
                        value="${m(e.dueDate)}"
                        aria-label="${m(i)}"
                        onchange="mettreAJourItemChecklist(
                            ${Number(n)},
                            '${E(t)}',
                            '${E(e.id)}',
                            'dueDate',
                            this.value,
                            this,
                            event
                        )"
                        ${s?"disabled":""}
                    >
                </label>

                ${fs(e,t,n,r,s)}

                ${s?"":`
                    <button
                        type="button"
                        class="checklist-delete"
                        onclick="supprimerItemChecklist(
                            ${Number(n)},
                            '${E(t)}',
                            '${E(e.id)}',
                            event
                        )"
                        title="Supprimer l’élément"
                        aria-label="Supprimer l’élément"
                    >×</button>
                `}
            </div>
        </article>
    `}function fs(e,t,n,s,r){const a=new Set(e.memberIds),i=yt(s);return r?`<div class="checklist-assignees readonly">${i}</div>`:`
        <details class="checklist-assignees">
            <summary>${i}</summary>
            <div class="checklist-assignees-menu">
                <div class="multi-toolbar">
                    <input type="search" class="multi-search" placeholder="Rechercher…" oninput="filtrerOptionsChecklist(this)" onclick="event.stopPropagation()">
                </div>
                <div class="multi-options">
                    ${L.map(c=>`
                        <label class="multi-option checklist-person-option" data-search="${m(c.label.toLocaleLowerCase(o.cultureFull))}">
                            <input
                                type="checkbox"
                                value="${c.id}"
                                ${a.has(c.id)?"checked":""}
                                onchange="mettreAJourAssignationsItemChecklist(${Number(n)}, '${E(t)}', '${E(e.id)}', this.closest('.checklist-assignees'), event)"
                            >
                            <span class="responsable-option-avatar" style="background:${m(c.avatarColor)}">${f(c.initials)}</span>
                            <span class="responsable-option-name">${f(c.label)}</span>
                        </label>
                    `).join("")||'<div class="multi-empty">Aucun membre disponible</div>'}
                </div>
            </div>
        </details>
    `}function yt(e){return e.length?`
            <span class="checklist-assignee-avatars">
                ${e.slice(0,4).map(t=>`
                    <span class="checklist-assignee-avatar" style="background:${m(t.avatarColor)}" title="${m(t.label)}">${f(t.initials)}</span>
                `).join("")}
                ${e.length>4?`<span class="checklist-assignee-more">+${e.length-4}</span>`:""}
            </span>
        `:'<span class="checklist-assignee-placeholder">👤 Attribuer</span>'}function hs(e){const t=e.closest(".checklist-assignees"),n=e.value.trim().toLocaleLowerCase(o.cultureFull);t?.querySelectorAll(".checklist-person-option").forEach(s=>{s.hidden=n!==""&&!u(s.dataset.search).includes(n)})}function gs(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".checklist-add-zone"),s=n?.querySelector(".checklist-add-composer"),r=s?.querySelector(".checklist-add-input");!n||!s||(e.hidden=!0,s.hidden=!1,r?.focus())}function bs(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".checklist-add-zone"),s=n?.querySelector(".checklist-add-composer"),r=n?.querySelector(".checklist-add-trigger"),a=s?.querySelector(".checklist-add-input");!n||!s||!r||(a&&(a.value=""),s.hidden=!0,r.hidden=!1)}function vs(e,t,n,s){s.key==="Enter"&&(s.preventDefault(),St(e,t,n,s))}async function St(e,t,n,s){s?.preventDefault(),s?.stopPropagation();const a=n.closest(".checklist-section")?.querySelector(".checklist-add-input"),i=u(a?.value).trim();if(!i){a?.focus(),fe(e,t,"error","Saisissez un intitulé.");return}a&&(a.value="");const c=await M(e,l=>l.map(d=>d.id===t?{...d,items:[...d.items,{id:j(),text:i,done:!1,memberIds:[],dueDate:"",createdAt:new Date().toISOString()}]}:d));qe(e,t,c)}async function Es(e,t,n,s){s?.stopPropagation();const r=u(n).trim()||"Checklist";await M(e,a=>a.map(i=>i.id===t?{...i,title:r}:i))}async function ys(e,t,n,s,r,a,i){i?.stopPropagation();const c=s==="done"?!!r:s==="dueDate"?vt(r):u(r).trim(),l=await M(e,d=>d.map(p=>p.id===t?{...p,items:p.items.map(g=>g.id===n?{...g,[s]:c}:g)}:p));if(s==="text"){fe(e,t,"saved","Élément enregistré.");return}qe(e,t,l)}async function Ss(e,t,n,s,r){r?.stopPropagation();const a=Array.from(s.querySelectorAll('input[type="checkbox"]:checked')).map(l=>Number(l.value)).filter(l=>y.has(l));await M(e,l=>l.map(d=>d.id===t?{...d,items:d.items.map(p=>p.id===n?{...p,memberIds:a}:p)}:d));const i=a.map(l=>y.get(l)).filter(Boolean),c=s.querySelector("summary");c&&(c.innerHTML=yt(i)),fe(e,t,"saved","Attribution enregistrée.")}async function Cs(e,t,n,s){s?.preventDefault(),s?.stopPropagation();const r=b(e),i=_(r?.CHECKLIST).find(l=>l.id===t)?.items.find(l=>l.id===n);if(i?.text&&!window.confirm(`Supprimer « ${i.text} » ?`))return;const c=await M(e,l=>l.map(d=>d.id===t?{...d,items:d.items.filter(p=>p.id!==n)}:d));qe(e,t,c)}async function ws(e,t,n){n?.preventDefault(),n?.stopPropagation();const s=b(e),r=_(s?.CHECKLIST).find(a=>a.id===t);window.confirm(`Supprimer la checklist « ${r?.title||"Checklist"} » et tous ses éléments ?`)&&(await M(e,a=>a.filter(i=>i.id!==t)),await S(e))}async function M(e,t){const n=Number(e),r=(le.get(n)||Promise.resolve()).catch(()=>{}).then(async()=>{const a=b(n),i=_(a?.CHECKLIST),c=t(i).map((l,d)=>gt(l,d));return await N(n,"CHECKLIST",JSON.stringify(c)),a&&(a.CHECKLIST=JSON.stringify(c)),c}).finally(()=>{le.get(n)===r&&le.delete(n)});return le.set(n,r),r}function qe(e,t,n=null){const s=b(e),a=(n||_(s?.CHECKLIST)).find(d=>d.id===t),i=document.querySelector(`.checklist-section[data-row-id="${Number(e)}"][data-checklist-id="${ks(t)}"]`);if(!i||!a){S(e);return}const c=document.createElement("div");c.innerHTML=Et(a,e,o.col.CHECKLIST.getIsFormula());const l=c.firstElementChild;i.replaceWith(l),l.querySelectorAll(".auto-expand").forEach(W),Ct(l.parentElement)}function fe(e,t,n,s){const r=document.getElementById(`checklist-status-${Number(e)}-${wt(t)}`);r&&(r.className=`section-status checklist-status${n?` ${n}`:""}`,r.textContent=s)}function Ct(e=document){typeof Sortable!="function"||o.opt.readonly||e.querySelectorAll('.checklist-section[data-disabled="false"] .checklist-items').forEach(t=>{t.dataset.sortableReady!=="true"&&(t.dataset.sortableReady="true",new Sortable(t,{animation:140,handle:".checklist-drag-handle",ghostClass:"checklist-item-ghost",chosenClass:"checklist-item-chosen",onEnd:async()=>{const n=Number(t.dataset.rowId),s=t.dataset.checklistId,r=Array.from(t.querySelectorAll(".checklist-item")).map(a=>a.dataset.itemId);await M(n,a=>a.map(i=>{if(i.id!==s)return i;const c=new Map(i.items.map(l=>[l.id,l]));return{...i,items:r.map(l=>c.get(l)).filter(Boolean)}})),fe(n,s,"saved","Ordre enregistré.")}}))})}function wt(e){return u(e).replace(/[^a-zA-Z0-9_-]/g,"_")}function ks(e){return window.CSS?.escape?window.CSS.escape(u(e)):u(e).replace(/["\\]/g,"\\$&")}function As(e,t=w(e.PIECES_JOINTES),n=he(e.LIENS)){return`
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
                        ${n.map(s=>$s(e.id,s)).join("")}
                    </div>
                </div>
            `:""}
        </section>
    `}function he(e){const t=u(e).trim();if(!t)return[];try{const n=JSON.parse(t);return Array.isArray(n)?n.map((s,r)=>({id:u(s?.id)||`link-${r}`,label:u(s?.label||s?.text).trim(),url:Oe(s?.url),createdAt:u(s?.createdAt)})).filter(s=>s.label&&s.url):[]}catch(n){return console.warn("Liens illisibles, valeur ignorée :",n),[]}}function Oe(e){const t=u(e).trim();if(!t)return"";const n=/^(https?:)/i.test(t)?t:`https://${t}`;try{const s=new URL(n);return["http:","https:"].includes(s.protocol)?s.href:""}catch{return""}}function $s(e,t){let n="";try{n=new URL(t.url).hostname}catch{n=t.url}return`
        <article class="resource-link-card">
            <a href="${m(t.url)}" target="_blank" rel="noopener noreferrer" class="resource-link-main">
                <span class="resource-link-icon">🔗</span>
                <span class="resource-link-text">
                    <strong>${f(t.label)}</strong>
                    <small>${f(n)}</small>
                </span>
            </a>
            ${o.map?.LIENS&&!o.col.LIENS.getIsFormula()?`
                <button
                    type="button"
                    onclick="retirerLienFiche(${Number(e)}, '${E(t.id)}', event)"
                    title="Retirer ce lien"
                    aria-label="Retirer ce lien"
                >×</button>
            `:""}
        </article>
    `}async function Ns(e,t,n){n?.preventDefault(),n?.stopPropagation();const s=t.closest(".task-action-panel"),r=s?.querySelector(".resource-link-label"),a=s?.querySelector(".resource-link-url"),i=s?.querySelector(".task-panel-status"),c=u(r?.value).trim(),l=Oe(a?.value);if(!c||!l){i&&(i.className="task-panel-status section-status error",i.textContent="Renseignez un texte d’affichage et une adresse valide."),(c?a:r)?.focus();return}try{i&&(i.className="task-panel-status section-status saving",i.textContent="Enregistrement…"),await kt(e,d=>[...d,{id:j(),label:c,url:l,createdAt:new Date().toISOString()}]),await S(e,"resources")}catch{i&&(i.className="task-panel-status section-status error",i.textContent="Impossible d’ajouter le lien.")}}async function Ts(e,t,n){n?.preventDefault(),n?.stopPropagation(),await kt(e,s=>s.filter(r=>r.id!==t)),await S(e)}async function kt(e,t){const n=Number(e),r=(ue.get(n)||Promise.resolve()).catch(()=>{}).then(async()=>{const a=b(n),i=he(a?.LIENS),c=t(i).map(l=>({id:u(l.id)||j(),label:u(l.label).trim(),url:Oe(l.url),createdAt:u(l.createdAt)||new Date().toISOString()})).filter(l=>l.label&&l.url);return await N(n,"LIENS",JSON.stringify(c)),a&&(a.LIENS=JSON.stringify(c)),c}).finally(()=>{ue.get(n)===r&&ue.delete(n)});return ue.set(n,r),r}async function Is(e){const t=document.getElementById(`attachments-list-${Number(e)}`);if(!t)return;const n=b(e),s=w(n?.PIECES_JOINTES);if(s.length===0){t.innerHTML='<div class="section-empty">Aucune pièce jointe</div>';return}t.innerHTML='<div class="section-loading">Chargement des aperçus…</div>';try{const[r]=await Promise.all([Fe(!0),Ne()]);t.innerHTML=s.map(a=>At(e,a,r)).join("")}catch(r){console.error("Impossible d’afficher les pièces jointes :",r),t.innerHTML=s.map(a=>At(e,a,null)).join("")}}function At(e,t,n){const s=It(t),r=n?Tt(n,t):"",a=Lt(s),i=a==="image"&&r?`<img src="${m(r)}" alt="${m(s.fileName)}" loading="lazy">`:`<div class="attachment-file-icon">${Rt(a)}</div>`;return`
        <article class="attachment-card">
            <button type="button" class="attachment-preview" onclick="ouvrirPieceJointe(${Number(e)}, ${Number(t)}, event)" title="Ouvrir ${m(s.fileName)}">
                ${i}
            </button>
            <div class="attachment-info">
                <div class="attachment-name" title="${m(s.fileName)}">${f(s.fileName)}</div>
                <div class="attachment-meta">${f(rr(s.fileSize))}</div>
            </div>
            <div class="attachment-actions">
                <button type="button" onclick="ouvrirPieceJointe(${Number(e)}, ${Number(t)}, event)" title="Visualiser">👁</button>
                ${o.map?.PIECES_JOINTES&&!o.col.PIECES_JOINTES.getIsFormula()?`<button type="button" onclick="retirerPieceJointe(${Number(e)}, ${Number(t)}, event)" title="Retirer de la tâche">×</button>`:""}
            </div>
        </article>
    `}function Ls(e,t){t?.preventDefault(),t?.stopPropagation();const s=e?.closest(".task-action-panel")?.querySelector(".resource-file-input");!s||s.disabled||s.click()}function Rs(e){const t=[],n=s=>{if(s!=null){if(typeof s=="number"||typeof s=="string"){const r=Number(s);Number.isInteger(r)&&r>0&&t.push(r);return}if(Array.isArray(s)){const r=s[0]==="L"?1:0;s.slice(r).forEach(n);return}typeof s=="object"&&["id","ids","attachmentId","attachmentIds","attachments","recordIds","result"].forEach(r=>{Object.prototype.hasOwnProperty.call(s,r)&&n(s[r])})}};return n(e),[...new Set(t)]}async function Ds(e,t,n){n?.preventDefault(),n?.stopPropagation();const s=t?.closest(".task-action-panel"),r=s?.querySelector(".task-panel-status"),a=s?.querySelector(".resource-file-button"),i=Array.from(t?.files||[]);if(i.length===0)return;const c=(d,p)=>{r&&(r.className=`task-panel-status section-status${d?` ${d}`:""}`,r.textContent=p)},l=i.find(d=>d.size>en);if(l){c("error",`${l.name} dépasse la limite de 50 Mo.`),t.value="";return}t.disabled=!0,a&&(a.disabled=!0),c("saving",`Envoi de ${i.length} fichier(s)…`);try{const d=await Fe(!1),p=new FormData;i.forEach(re=>{p.append("upload",re,re.name)});const g=`${d.baseUrl}/attachments?auth=${encodeURIComponent(d.token)}`,v=await fetch(g,{method:"POST",body:p,headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}),h=await v.text();let k=h;if(h)try{k=JSON.parse(h)}catch{k=h}if(!v.ok)throw new Error(`Upload refusé par Grist (${v.status}).`);const P=Rs(k);if(P.length===0)throw new Error("Le fichier a été envoyé, mais aucun identifiant de pièce jointe n’a été retourné.");const I=b(e),se=w(I?.PIECES_JOINTES),q=[...new Set([...se,...P])];await $t(e,q),I&&(I.PIECES_JOINTES=[...q]),ie=!1,G=null,await Ne(!0),c("saved",`${P.length} pièce(s) jointe(s) ajoutée(s).`),F(),await S(e)}catch(d){console.error("Erreur pendant l’ajout des pièces jointes :",d),c("error",d?.message||"Échec de l’envoi.")}finally{t.value="",t.disabled=!1,a&&(a.disabled=!1)}}async function Ms(e,t,n){n?.preventDefault(),n?.stopPropagation();const s=b(e),a=w(s?.PIECES_JOINTES).filter(i=>i!==Number(t));try{T("attachments",e,"saving","Mise à jour…"),await $t(e,a),s&&(s.PIECES_JOINTES=[...a]),await S(e)}catch(i){console.error("Erreur pendant le retrait de la pièce jointe :",i),T("attachments",e,"error","Impossible de retirer la pièce jointe.")}}async function $t(e,t){const n=o.map?.PIECES_JOINTES;if(!n||Array.isArray(n))throw new Error("La colonne Pièces jointes n’est pas correctement mappée.");await grist.getTable().update({id:Number(e),fields:{[n]:["L",...t]}}),await Ft(e)}async function Ps(e,t,n){n?.preventDefault(),n?.stopPropagation();try{const[s]=await Promise.all([Fe(!0),Ne()]),r=It(t),a=Tt(s,t);Os(r,a)}catch(s){console.error("Impossible d’ouvrir la pièce jointe :",s),window.alert("Impossible d’ouvrir cette pièce jointe.")}}function qs(){if(document.getElementById("attachment-viewer"))return;const e=document.createElement("div");e.id="attachment-viewer",e.className="attachment-viewer",e.setAttribute("aria-hidden","true"),e.innerHTML=`
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
    `,document.body.appendChild(e)}function Os(e,t){const n=document.getElementById("attachment-viewer"),s=document.getElementById("attachment-viewer-content"),r=document.getElementById("attachment-viewer-title"),a=document.getElementById("attachment-viewer-download");if(!n||!s||!r||!a)return;r.textContent=e.fileName,a.href=t;const i=Lt(e);i==="image"?s.innerHTML=`<img src="${m(t)}" alt="${m(e.fileName)}">`:i==="pdf"?s.innerHTML=`<iframe src="${m(t)}" title="${m(e.fileName)}"></iframe>`:i==="video"?s.innerHTML=`<video src="${m(t)}" controls autoplay></video>`:i==="audio"?s.innerHTML=`<div class="attachment-generic-preview"><div class="attachment-large-icon">🎵</div><audio src="${m(t)}" controls autoplay></audio></div>`:s.innerHTML=`<div class="attachment-generic-preview"><div class="attachment-large-icon">${Rt(i)}</div><p>Ce format ne dispose pas d’un aperçu intégré.</p><a href="${m(t)}" target="_blank" rel="noopener">Ouvrir ou télécharger le fichier</a></div>`,n.classList.add("visible"),n.setAttribute("aria-hidden","false")}function Nt(e){e?.preventDefault(),e?.stopPropagation();const t=document.getElementById("attachment-viewer");if(!t)return;t.classList.remove("visible"),t.setAttribute("aria-hidden","true");const n=document.getElementById("attachment-viewer-content");n&&(n.innerHTML="")}async function Fe(e=!0){if(e&&G&&Date.now()-ze<Zt)return G;const t=await grist.docApi.getAccessToken({readOnly:e});return e&&(G=t,ze=Date.now()),t}function Tt(e,t){return`${e.baseUrl}/attachments/${Number(t)}/download?auth=${encodeURIComponent(e.token)}`}function It(e){return Ce.get(Number(e))||{id:Number(e),fileName:`Pièce jointe ${Number(e)}`,fileExt:"",fileType:"",fileSize:0,imageWidth:0,imageHeight:0}}function Lt(e){const t=u(e.fileExt||Qt(e.fileName)).toLowerCase().replace(/^\./,""),n=u(e.fileType).toLowerCase();return n.startsWith("image/")||["png","jpg","jpeg","gif","webp","svg","bmp","avif"].includes(t)?"image":n==="application/pdf"||t==="pdf"?"pdf":n.startsWith("video/")||["mp4","webm","mov","m4v","ogv"].includes(t)?"video":n.startsWith("audio/")||["mp3","wav","ogg","m4a","aac","flac"].includes(t)?"audio":["doc","docx","odt"].includes(t)?"document":["xls","xlsx","ods","csv"].includes(t)?"tableur":["ppt","pptx","odp"].includes(t)?"presentation":["zip","rar","7z","tar","gz"].includes(t)?"archive":"file"}function Rt(e){return{image:"🖼️",pdf:"📕",video:"🎬",audio:"🎵",document:"📄",tableur:"📊",presentation:"📽️",archive:"🗜️",file:"📎"}[e]||"📎"}function Fs(e){const t=Z(e.COMMENTAIRES),n=o.opt.enablementions!==!1;return`
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
                ${Pt(t,e.id)}
            </div>

            <div class="comment-composer">
                <div class="comment-input-wrapper">
                    <textarea
                        class="comment-input"
                        placeholder="Écrire un commentaire${n?" — utilisez @ pour mentionner quelqu’un":""}…"
                        oninput="ajusterTextarea(this); gererSaisieMention(this)"
                        onkeydown="gererTouchesMention(this, event)"
                    ></textarea>

                    ${n?xs():""}
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
    `}function xs(){return`
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
                ${L.map(t=>`
        <button
            type="button"
            class="mention-option"
            data-member-id="${t.id}"
            data-search="${m(`${t.label} ${t.email||""}`.toLocaleLowerCase(o.cultureFull))}"
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
    `}function _s(e,t){t?.preventDefault(),t?.stopPropagation();const s=e.closest(".comment-composer")?.querySelector(".mention-menu");s&&(s.hidden=!1,Dt(s,""))}function Bs(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".mention-menu");n&&(n.hidden=!0)}function Us(e){const n=e.closest(".comment-composer")?.querySelector(".mention-menu");if(!n||o.opt.enablementions===!1)return;const s=Mt(e);if(!s){n.hidden=!0;return}n.hidden=!1,n.dataset.mentionStart=String(s.start),Dt(n,s.query)}function js(e,t){const s=e.closest(".comment-composer")?.querySelector(".mention-menu");if(!s||s.hidden)return;const r=Array.from(s.querySelectorAll(".mention-option:not([hidden])"));if(t.key==="Escape"){t.preventDefault(),s.hidden=!0,e.focus();return}t.key==="Enter"&&r.length===1&&(t.preventDefault(),r[0].click())}function Dt(e,t){const n=u(t).trim().toLocaleLowerCase(o.cultureFull);e.querySelectorAll(".mention-option").forEach(s=>{s.hidden=n!==""&&!u(s.dataset.search).includes(n)})}function Mt(e){const t=Number(e.selectionStart),s=e.value.slice(0,t).match(/(?:^|\s)@([^@\n]*)$/);if(!s)return null;const r=s[1];return{query:r,start:t-r.length-1,end:t}}function Js(e,t,n){n?.preventDefault(),n?.stopPropagation();const s=e.closest(".comment-composer"),r=s?.querySelector(".comment-input"),a=s?.querySelector(".mention-menu"),i=y.get(Number(t));if(!s||!r||!i)return;const c=Mt(r),l=`@${i.label}`;if(c)r.setRangeText(`${l} `,c.start,c.end,"end");else{const d=r.value&&!/\s$/.test(r.value)?" ":"";r.setRangeText(`${d}${l} `,r.selectionStart,r.selectionEnd,"end")}s._selectedMentions||(s._selectedMentions=new Map),s._selectedMentions.set(i.id,{id:i.id,name:i.label,email:i.email||""}),xe(s),a&&(a.hidden=!0),r.focus(),W(r)}function xe(e){const t=e.querySelector(".comment-selected-mentions");if(!t)return;const n=Array.from(e._selectedMentions?.values?.()||[]);t.innerHTML=n.map(s=>`
        <span class="selected-mention-chip">
            @${f(s.name)}
            <button
                type="button"
                onclick="retirerMentionCommentaire(this, ${Number(s.id)}, event)"
                aria-label="Retirer ${m(s.name)}"
            >×</button>
        </span>
    `).join("")}function Hs(e,t,n){n?.preventDefault(),n?.stopPropagation();const s=e.closest(".comment-composer"),r=s?.querySelector(".comment-input"),a=y.get(Number(t));if(s?._selectedMentions?.delete(Number(t)),r&&a){const i=`@${a.label}`;r.value=r.value.replaceAll(i,"").replace(/[ \t]{2,}/g," ").trimStart(),W(r)}s&&xe(s)}function Pt(e,t){return e.length===0?'<div class="section-empty">Aucun commentaire</div>':e.map(n=>`
        <article
            class="comment-card"
            data-comment-id="${m(n.id)}"
        >
            <div class="comment-header">
                <strong>${f(n.author===V?"Nom Grist non configuré":n.author||"Anonyme")}</strong>
                <span>${f(He(n.createdAt))}</span>
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
                ${Ks(n)}
            </div>
        </article>
    `).join("")}function Ks(e){let t=f(e.text).replace(/\n/g,"<br>");return qt(e.mentions).sort((s,r)=>r.name.length-s.name.length).forEach(s=>{const r=f(`@${s.name}`),a=`
            <span
                class="comment-mention"
                title="${m(s.email||s.name)}"
            >${r}</span>
        `;t=t.split(r).join(a)}),t}function Z(e){const t=u(e).trim();if(!t)return[];try{const n=JSON.parse(t);if(!Array.isArray(n))throw new Error("Format non tableau");return n.map((s,r)=>({id:u(s?.id)||`legacy-${r}`,author:u(s?.author)||"Anonyme",createdAt:u(s?.createdAt),text:u(s?.text),mentions:qt(s?.mentions)})).filter(s=>s.text.trim())}catch{return[{id:"legacy-text",author:"Ancien commentaire",createdAt:"",text:t,mentions:[]}]}}function qt(e){return U(e).map(t=>({id:Number(t?.id)||0,name:u(t?.name||t?.label).trim(),email:zt(t?.email)})).filter(t=>t.name)}async function zs(e,t,n){n?.preventDefault(),n?.stopPropagation();const r=t.closest(".comments-section")?.querySelector(".comment-composer"),a=r?.querySelector(".comment-input"),i=u(a?.value).trim();if(!i){T("comments",e,"error","Écrivez un commentaire."),a?.focus();return}const c=Array.from(r?._selectedMentions?.values?.()||[]).filter(d=>i.includes(`@${d.name}`));t.disabled=!0,T("comments",e,"saving","Enregistrement…");const l={id:j(),author:V,createdAt:new Date().toISOString(),text:i,mentions:c};try{const p=(await Ot(e,h=>[...h,l])).find(h=>h.id===l.id);if(!p||p.author===V)throw new Error("La formule user.Name n’a pas remplacé le nom temporaire.");if(a&&(a.value="",W(a)),r){r._selectedMentions=new Map,xe(r);const h=r.querySelector(".mention-menu");h&&(h.hidden=!0)}_e(e);const g=p.mentions.length,v=g>0?`Commentaire ajouté par ${p.author}. ${g} mention(s) visuelle(s), sans envoi d’e-mail.`:`Commentaire ajouté par ${p.author}.`;T("comments",e,"saved",v)}catch(d){console.error("Erreur pendant l’ajout du commentaire :",d),_e(e),T("comments",e,"error",u(d?.message)||"Impossible d’ajouter le commentaire.")}finally{t.disabled=!1}}async function Ws(e,t,n){n?.preventDefault(),n?.stopPropagation();try{T("comments",e,"saving","Suppression…"),await Ot(e,s=>s.filter(r=>r.id!==t)),_e(e),T("comments",e,"saved","Commentaire supprimé.")}catch(s){console.error("Erreur pendant la suppression du commentaire :",s),T("comments",e,"error","Impossible de supprimer le commentaire.")}}async function Ot(e,t){const n=Number(e),r=(de.get(n)||Promise.resolve()).catch(()=>{}).then(async()=>{const a=b(n),i=Z(a?.COMMENTAIRES),c=t(i),l=JSON.stringify(c),d=ee();await o.updateRecords(o.formatRecord(n,{COMMENTAIRES:l,...d}));const p=await Qs(n);return a&&(a.COMMENTAIRES=JSON.stringify(p)),p}).finally(()=>{de.get(n)===r&&de.delete(n)});return de.set(n,r),r}async function Qs(e){const t=o.map?.COMMENTAIRES;if(!t||Array.isArray(t))throw new Error("La colonne Commentaires n’est pas correctement mappée.");const n=await ht(e,t),s=Z(n),r=b(e);return r&&(r.COMMENTAIRES=u(n)),s}function _e(e){const t=b(e),n=Z(t?.COMMENTAIRES),s=document.getElementById(`comments-list-${Number(e)}`),r=s?.closest(".comments-section");s&&(s.innerHTML=Pt(n,e));const a=r?.querySelector(".detail-section-header p");a&&(a.textContent=`${n.length} commentaire(s)`)}async function N(e,t,n,s){s?.stopPropagation();try{t==="STATUT"&&ge(n)?.useconfetti&&Vt();const r={[t]:n,...t==="DERNIERE_MISE_A_JOUR"||t==="MODIFIE_PAR"?{}:ee()};await o.updateRecords(o.formatRecord(e,r));const a=b(e);a&&(a[t]=n,r.DERNIERE_MISE_A_JOUR&&(a.DERNIERE_MISE_A_JOUR=r.DERNIERE_MISE_A_JOUR),r.MODIFIE_PAR&&(a.MODIFIE_PAR=r.MODIFIE_PAR))}catch(r){throw console.error(A("Error during update:"),r),r}}function ee(){const e={};return o.map?.DERNIERE_MISE_A_JOUR&&!o.col.DERNIERE_MISE_A_JOUR.getIsFormula()&&(e.DERNIERE_MISE_A_JOUR=new Date().toISOString()),o.map?.MODIFIE_PAR&&!o.col.MODIFIE_PAR.getIsFormula()&&(e.MODIFIE_PAR=V),e}async function Ft(e){const t=ee();if(Object.keys(t).length!==0)try{await o.updateRecords(o.formatRecord(e,t));const n=b(e);n&&Object.assign(n,t)}catch(n){console.warn("Données enregistrées, mais informations de suivi non modifiées :",n)}}async function Vs(e){try{const t={DESCRIPTION:"",STATUT:e};o.map?.DERNIERE_MISE_A_JOUR&&!o.col.DERNIERE_MISE_A_JOUR.getIsFormula()&&(t.DERNIERE_MISE_A_JOUR=new Date().toISOString()),o.map?.CREE_LE&&!o.col.CREE_LE.getIsFormula()&&(t.CREE_LE=new Date().toISOString()),o.map?.COMMENTAIRES&&!o.col.COMMENTAIRES.getIsFormula()&&(t.COMMENTAIRES="[]"),o.map?.CHECKLIST&&!o.col.CHECKLIST.getIsFormula()&&(t.CHECKLIST="[]"),o.map?.LIENS&&!o.col.LIENS.getIsFormula()&&(t.LIENS="[]"),o.map?.ORDRE&&!o.col.ORDRE.getIsFormula()&&(t.ORDRE=Be(e));const n=await o.createRecords({fields:t});if(n?.id>0){grist.setCursorPos({rowId:n.id});const s=await o.fetchSelectedRecord(n.id);o.opt.hideedit||X(s)}}catch(t){console.error(A("Error on creation:"),t)}}async function Gs(e,t){t?.preventDefault(),t?.stopPropagation();const n=t?.currentTarget,s=n?.innerHTML;n&&(n.disabled=!0,n.classList.add("is-loading"),n.innerHTML="…",n.title="Archivage en cours…");try{const r=await o.col.STATUT.getChoices(),a=u(o.opt?.archivestatus).trim()||"Archives",i=r.find(d=>u(d)===a)||r.find(d=>u(d).toLocaleLowerCase(o.cultureFull)===a.toLocaleLowerCase(o.cultureFull))||r.find(d=>u(d).toLocaleLowerCase(o.cultureFull).includes("archive"));if(!i)throw new Error(`Aucun statut « ${a} » n’existe dans la colonne Statut.`);const c={STATUT:i,...ee()};o.map?.ORDRE&&!o.col.ORDRE.getIsFormula()&&(c.ORDRE=Be(i)),await o.updateRecords(o.formatRecord(e,c));const l=b(e);l&&Object.assign(l,c),te(),await H($)}catch(r){console.error("Impossible d’archiver la tâche :",r),Xs(r?.message||"Impossible d’archiver la tâche."),n&&(n.disabled=!1,n.classList.remove("is-loading"),n.innerHTML=s||"🗃️",n.title="Archiver la tâche")}}function Xs(e){const n=document.getElementById("popup-todo")?.querySelector(".popup-content");if(!n)return;let s=n.querySelector(".archive-status-message");s||(s=document.createElement("div"),s.className="archive-status-message",s.setAttribute("role","alert"),n.appendChild(s)),s.textContent=e,window.setTimeout(()=>{s?.remove()},4500)}function te(){const e=document.getElementById("popup-todo");!e||e.querySelector(".notes-field.is-editing.is-dirty")&&!window.confirm("Les modifications des notes ne sont pas enregistrées. Fermer quand même ?")||(B(e.dataset.currentTodo)?.classList.remove("active"),F(),e.classList.remove("visible"),xt())}function Ys(e,t){if(t?.stopPropagation(),!e)return;e.classList.toggle("collapsed");const n=e.querySelector(".titre-statut")?.childNodes?.[0]?.textContent?.trim()||e.id;localStorage.setItem(Bt(n),String(e.classList.contains("collapsed")))}function W(e){e&&(e.style.height="",e.style.height=`${Math.max(e.scrollHeight,42)}px`)}function xt(e=null){document.querySelectorAll(".multi-dropdown[open], .checklist-assignees[open]").forEach(t=>{t!==e&&t.removeAttribute("open")})}document.addEventListener("keydown",e=>{if(e.key!=="Escape")return;if(document.getElementById("attachment-viewer")?.classList.contains("visible")){Nt(e);return}const n=document.querySelector(".multi-dropdown[open], .checklist-assignees[open]");if(n){n.removeAttribute("open");return}if(document.querySelector(".task-action-panel:not([hidden])")){F(e);return}te()}),document.addEventListener("click",e=>{const t=e.target.closest(".multi-dropdown, .checklist-assignees");o?.opt?.autoclosemenus!==!1&&xt(t);const n=document.getElementById("popup-todo");if(!n?.classList.contains("visible"))return;e.target.closest(".task-action-panel, .task-quick-button")||F();const r=n.contains(e.target),a=!!e.target.closest(".carte"),i=!!e.target.closest("#attachment-viewer");!r&&!a&&!i&&te()});function b(e){return $.find(t=>Number(t.id)===Number(e))||null}function B(e){return Array.from(document.querySelectorAll(".carte")).find(t=>Number(t.dataset.todoId)===Number(e))||null}function _t(e){return{addbutton:!1,isdone:!1,useconfetti:!1,hidecolumn:!1,...(Array.isArray(o.opt?.columns)?o.opt.columns:[])[e]||{}}}function ge(e){const n=(o.valuesList?.columns||[]).indexOf(e);return n>=0?_t(n):null}function Bt(e){return`column-todo-${u(e)}`}function Be(e){const t=$.filter(n=>u(n.STATUT)===u(e)).map(n=>Number(n.ORDRE)).filter(Number.isFinite);return t.length>0?Math.max(...t)+1e3:1e3}function Ue(e,t){const n=Kt(e?.[`${t}_id`]);if(n.length>0)return n;const s=ne(e?.[t]).filter(a=>a!=="#KeyError"),r=[...L];return s.flatMap(a=>{const i=r.findIndex(l=>l.label===a);if(i<0)return[];const[c]=r.splice(i,1);return[c.id]})}function Ut(e,t){const n=Ue(e,t);return n.length>0?n.map(s=>y.get(s)).filter(Boolean):ne(e?.[t]).filter(s=>s!=="#KeyError").map(s=>({id:0,label:s,initials:Ze(s),avatarColor:et(s)}))}function Zs(e){return Ue(e,"MEMBRES")}function jt(e){return Ut(e,"MEMBRES")}function er(e){return Ue(e,"RESPONSABLE")}function Jt(e){return Ut(e,"RESPONSABLE")}function je(e){const t=Kt(e?.ETIQUETTES_id);if(t.length>0)return t;const n=ne(e?.ETIQUETTES).filter(r=>r!=="#KeyError"),s=[...J];return n.flatMap(r=>{const a=s.findIndex(c=>c.label===r);if(a<0)return[];const[i]=s.splice(a,1);return[i.id]})}function Ht(e){const t=je(e);return t.length>0?t.map(n=>O.get(n)).filter(Boolean):ne(e?.ETIQUETTES).filter(n=>n!=="#KeyError").map(n=>{const s=tt(n);return{id:0,label:n,color:s,textColor:nt(s)}})}function Kt(e){return w(e)}function w(e){let t=U(e);return t[0]==="L"?t=t.slice(1):t[0]==="r"&&(t=U(t[2])),[...new Set(t.flatMap(n=>Array.isArray(n)?n:[n]).map(Number).filter(n=>Number.isInteger(n)&&n>0))]}function ne(e){let t=U(e);return t[0]==="L"&&(t=t.slice(1)),[...new Set(t.flatMap(n=>Array.isArray(n)?n:[n]).map(u).map(n=>n.trim()).filter(Boolean))]}function U(e){return e==null||e===""?[]:Array.isArray(e)?e:[e]}function u(e){return e==null?"":String(e)}function zt(e){const t=u(e).trim().toLowerCase();return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)?t:""}function tr(e){const t=[],n=o.map?.CREE_LE&&e.CREE_LE?He(e.CREE_LE):"",s=o.map?.CREE_PAR?u(e.CREE_PAR).trim():"";if(n||s){const c=["Créé"];n&&c.push(`le ${n}`),s&&c.push(`par ${s}`),t.push(`<div>${f(c.join(" "))}</div>`)}const r=o.map?.DERNIERE_MISE_A_JOUR&&e.DERNIERE_MISE_A_JOUR?He(e.DERNIERE_MISE_A_JOUR):"",a=o.map?.MODIFIE_PAR?u(e.MODIFIE_PAR).trim():"",i=a===V?"Nom Grist non configuré":a;if(r||i){const c=["Modifié"];r&&c.push(`le ${r}`),i&&c.push(`par ${i}`),t.push(`<div>${f(c.join(" "))}</div>`)}return t.join("")}function T(e,t,n,s){const r=document.getElementById(`${e}-status-${Number(t)}`);r&&(r.className=`section-status${n?` ${n}`:""}`,r.textContent=s)}function Je(e){if(!e)return"";const t=new Date(e);if(Number.isNaN(t.getTime())||t>=Q)return"";const n=String(t.getDate()).padStart(2,"0"),s=t.toLocaleDateString(o.cultureFull,{month:"short"});return`${n} ${s} ${t.getFullYear()}`}function nr(e){if(!e)return"";const n=u(e).trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);if(n)return`${n[3]}/${n[2]}/${n[1]}`;const s=new Date(e);return Number.isNaN(s.getTime())?"":s.toLocaleDateString(o.cultureFull,{day:"2-digit",month:"2-digit",year:"numeric"})}function He(e){if(!e)return"";const t=new Date(e);return Number.isNaN(t.getTime())?"":t.toLocaleString(o.cultureFull,{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}function sr(e){if(!e)return"";const t=new Date(e);return Number.isNaN(t.getTime())||t>=Q?"":t.toISOString().split("T")[0]}function Wt(e){if(!e)return"";const t=new Date(e);return Number.isNaN(t.getTime())?u(e):t.toISOString()}function be(e){if(!e)return null;const t=new Date(e).getTime();return Number.isNaN(t)?null:t}function ve(e,t){return be(e)??t}function rr(e){const t=Number(e)||0;if(t<=0)return"";const n=["o","Ko","Mo","Go"],s=Math.min(Math.floor(Math.log(t)/Math.log(1024)),n.length-1);return`${(t/1024**s).toFixed(s===0?0:1)} ${n[s]}`}function Qt(e){const t=u(e).match(/(\.[^.]+)$/);return t?t[1]:""}function j(){return globalThis.crypto?.randomUUID?crypto.randomUUID():`comment-${Date.now()}-${Math.random().toString(16).slice(2)}`}function f(e){return u(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function m(e){return f(e).replace(/`/g,"&#096;")}function E(e){return u(e).replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/\r/g,"\\r").replace(/\n/g,"\\n")}function ar(e){return encodeURIComponent(u(e)).replace(/'/g,"%27")}function Vt(){if(typeof confetti!="function")return;const e=2e3,t=Date.now()+e,n={startVelocity:30,spread:360,ticks:60,zIndex:1500},s=(a,i)=>Math.random()*(i-a)+a,r=window.setInterval(()=>{const a=t-Date.now();if(a<=0){window.clearInterval(r);return}const i=50*(a/e);confetti({...n,particleCount:i,origin:{x:s(.1,.3),y:Math.random()-.2}}),confetti({...n,particleCount:i,origin:{x:s(.7,.9),y:Math.random()-.2}})},250)}window.toggleColonne=Ys,window.togglePopupTodo=X,window.fermerPopup=te,window.mettreAJourChamp=N,window.creerNouvelleTache=Vs,window.archiverTodo=Gs,window.mettreAJourChampPersonnes=pt,window.filtrerOptionsMultiples=rs,window.viderChampPersonnes=as,window.mettreAJourEtiquettes=Me,window.viderEtiquettes=os,window.retirerEtiquetteActive=cs,window.ouvrirPanneauFiche=at,window.fermerPanneauxFiche=F,window.filtrerPanneauFiche=Dn,window.changerStatutDepuisFiche=Mn,window.mettreAJourTitreFiche=Pn,window.mettreAJourProprieteFiche=qn,window.enregistrerEtiquettesDepuisPanneau=On,window.retirerEtiquetteFiche=Fn,window.basculerRolePersonnePanneau=xn,window.enregistrerEquipeDepuisPanneau=Bn,window.gererCreationChecklistClavier=Un,window.ajouterChecklistAvecTitre=ot,window.mettreAJourCouleurFiche=jn,window.ouvrirAjoutItemChecklist=gs,window.fermerAjoutItemChecklist=bs,window.gererAjoutItemChecklistClavier=vs,window.ajouterItemChecklist=St,window.renommerChecklist=Es,window.mettreAJourItemChecklist=ys,window.mettreAJourAssignationsItemChecklist=Ss,window.supprimerItemChecklist=Cs,window.supprimerChecklist=ws,window.filtrerOptionsChecklist=hs,window.ajouterLienFiche=Ns,window.retirerLienFiche=Ts,window.declencherSelecteurPiecesJointes=Ls,window.ajouterPiecesJointes=Ds,window.retirerPieceJointe=Ms,window.ouvrirPieceJointe=Ps,window.fermerLecteurPieceJointe=Nt,window.ajouterCommentaire=zs,window.supprimerCommentaire=Ws,window.ajusterTextarea=W,window.previsualiserCouleur=ts,window.mettreAJourCouleur=mt,window.reinitialiserCouleur=ns,window.activerEditionNotes=Hn,window.annulerEditionNotes=Kn,window.enregistrerEtFermerNotes=zn,window.appliquerFormatBlocNotes=Qn,window.appliquerCommandeNotes=Vn,window.appliquerBaliseSelectionNotes=Gn,window.creerLienNotes=lt,window.nettoyerCollageNotes=Xn,window.marquerNotesModifiees=R,window.mettreAJourEtatBarreNotes=K,window.gererRaccourcisNotes=Yn,window.ouvrirMenuMentions=_s,window.fermerMenuMentions=Bs,window.gererSaisieMention=Us,window.gererTouchesMention=js,window.selectionnerMentionCommentaire=Js,window.retirerMentionCommentaire=Hs}));
