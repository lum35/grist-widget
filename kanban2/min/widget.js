(function(o){typeof define=="function"&&define.amd?define(o):o()})((function(){"use strict";let o,y;const z=new Date("3000-01-01"),be="#DCDCDC",je="#000000",Vt=120*1e3,Gt=50*1024*1024,W="__GRIST_USER_NAME__";let M=[],T=[],S=new Map,ge=null,J=[],P=new Map,ve=null,Ee=new Map,ne=!1,Q=null,He=0;const se=new Map,re=new Map,ie=new Map,ae=new Map,oe=new Map,ce=new Map;let Ke=null,ye=!1;window.addEventListener("load",async()=>{o=new WidgetSDK,y=await o.loadTranslations(["widget.js"]),o.configureOptions([WidgetSDK.newItem("columns",null,"Colonnes du Kanban","Réglez le comportement de chaque statut.","1 — Colonnes",{columnId:"STATUT",template:[WidgetSDK.newItem("addbutton",!0,"Autoriser l’ajout","Afficher un bouton pour créer une carte dans cette colonne."),WidgetSDK.newItem("isdone",!1,"Colonne terminée","Considérer les cartes de cette colonne comme terminées."),WidgetSDK.newItem("useconfetti",!1,"Confettis","Afficher des confettis lorsqu’une carte arrive dans cette colonne."),WidgetSDK.newItem("hidecolumn",!1,"Masquer la colonne","Ne pas afficher cette colonne dans le Kanban.")]}),WidgetSDK.newItem("cardrotation",!1,"Inclinaison des cartes","Incliner légèrement les cartes. Désactivé par défaut.","2 — Affichage des cartes"),WidgetSDK.newItem("compact",!1,"Mode compact","Réduire les espacements et la hauteur des cartes.","2 — Affichage des cartes"),WidgetSDK.newItem("showlabels",!0,"Afficher les étiquettes","Afficher les étiquettes colorées sur les cartes.","2 — Affichage des cartes"),WidgetSDK.newItem("showmembers",!0,"Afficher les membres","Afficher les bulles d’initiales des membres sur les cartes.","2 — Affichage des cartes"),WidgetSDK.newItem("showresponsables",!0,"Afficher les responsables","Afficher les responsables avec une bordure renforcée sur les cartes.","2 — Affichage des cartes"),WidgetSDK.newItem("showdeadline",!0,"Afficher l’échéance","Afficher la date limite sur les cartes.","2 — Affichage des cartes"),WidgetSDK.newItem("showindicators",!0,"Afficher les indicateurs","Afficher le nombre de pièces jointes et de commentaires.","2 — Affichage des cartes"),WidgetSDK.newItem("showchecklistprogress",!0,"Afficher la progression checklist","Afficher le nombre d’éléments cochés sur les cartes.","2 — Affichage des cartes"),WidgetSDK.newItem("defaultcardcolor","#FFFFD1","Couleur par défaut","Couleur utilisée lorsqu’aucune couleur personnalisée n’est enregistrée.","2 — Affichage des cartes"),WidgetSDK.newItem("showchecklist",!0,"Checklist","Afficher la checklist avancée dans la fiche.","3 — Fiche descriptive"),WidgetSDK.newItem("showattachments",!0,"Pièces jointes","Afficher la section des pièces jointes dans la fiche.","3 — Fiche descriptive"),WidgetSDK.newItem("showcomments",!0,"Commentaires","Afficher la section des commentaires dans la fiche.","3 — Fiche descriptive"),WidgetSDK.newItem("enablementions",!0,"Mentions @ visuelles","Permettre de mentionner les membres dans les commentaires. Cette version ne déclenche aucun e-mail automatique.","3 — Fiche descriptive"),WidgetSDK.newItem("showmetadata",!0,"Informations de suivi","Afficher les lignes « Créé le » et « Modifié le » en bas de la fiche.","3 — Fiche descriptive"),WidgetSDK.newItem("autoclosemenus",!0,"Fermer les menus automatiquement","Fermer les sélecteurs multiples lorsqu’on clique ailleurs.","3 — Fiche descriptive"),WidgetSDK.newItem("readonly",!1,"Lecture seule","Désactiver toutes les modifications depuis le widget.","4 — Comportement"),WidgetSDK.newItem("hideedit",!1,"Masquer la fiche","Ne pas ouvrir la fiche descriptive lors d’un clic sur une carte.","4 — Comportement"),WidgetSDK.newItem("gristeditcard",!1,"Double-clic vers la fiche Grist","Ouvrir la fiche native de Grist lors d’un double-clic.","4 — Comportement"),WidgetSDK.newItem("confirmdelete",!0,"Confirmer les suppressions","Demander une confirmation avant de supprimer une tâche.","4 — Comportement")],"#config-view","#main-view",{onOptChange:$e,onOptLoad:$e}),o.initMetaData(),o.ready({requiredAccess:"full",allowSelectBy:!0,columns:[{name:"STATUT",title:"Statut",description:"Colonne du Kanban",type:"Choice",strictType:!0},{name:"DESCRIPTION",title:"Nom de la tâche",description:"Nom principal de la tâche",type:"Any"},{name:"DESCRIPTION_DISPLAY",title:"Affichage de la tâche",description:"Contenu personnalisé facultatif affiché sur la carte",type:"Any",optional:!0},{name:"NOTES",title:"Notes",description:"Notes enrichies enregistrées en HTML sécurisé",type:"Text",strictType:!0,optional:!0},{name:"DEADLINE",title:"Échéance",description:"Date limite de la carte",type:"Date",optional:!0},{name:"ORDRE",title:"Ordre manuel",description:"Nombre utilisé pour conserver exactement la position des cartes",type:"Numeric",strictType:!0,optional:!0},{name:"MEMBRES",title:"Membres",description:"Toutes les personnes qui participent à la carte",type:"RefList",strictType:!0,optional:!0},{name:"RESPONSABLE",title:"Responsables",description:"Responsables principaux de la carte",type:"RefList",strictType:!0,optional:!0},{name:"ETIQUETTES",title:"Étiquettes",description:"Étiquettes multiples référencées depuis une table dédiée",type:"RefList",strictType:!0,optional:!0},{name:"CHECKLIST",title:"Checklist",description:"Checklists titrées stockées en JSON",type:"Text",strictType:!0,optional:!0},{name:"PIECES_JOINTES",title:"Pièces jointes",description:"Fichiers et images associés à la tâche",type:"Attachments",strictType:!0,optional:!0},{name:"LIENS",title:"Liens",description:"Liens avec texte d’affichage stockés en JSON",type:"Text",strictType:!0,optional:!0},{name:"COMMENTAIRES",title:"Commentaires",description:"Commentaires du widget stockés en JSON",type:"Text",strictType:!0,optional:!0},{name:"COULEUR",title:"Couleur de carte",description:"Code hexadécimal choisi depuis le widget",type:"Text",strictType:!0,optional:!0},{name:"CREE_PAR",title:"Créé par",type:"Any",optional:!0},{name:"CREE_LE",title:"Date de création",type:"DateTime",optional:!0},{name:"DERNIERE_MISE_A_JOUR",title:"Dernière mise à jour",description:"Date technique affichée dans le suivi",type:"DateTime",optional:!0},{name:"MODIFIE_PAR",title:"Modifié par",description:"Nom de la dernière personne ayant modifié la tâche",type:"Text",strictType:!0,optional:!0}]}),o.onRecords(le,{expandRefs:!1,keepEncoded:!1,mapRef:!0}),o.isLoaded().then(()=>{o.initDone=!0}),grist.on("message",async e=>{e.mappingsChange&&await tn()}),Rs(),Zt()});async function ze(e=!1){const t=o?.map?.MEMBRES?"MEMBRES":o?.map?.RESPONSABLE?"RESPONSABLE":null;if(!t||!o?.col?.[t]){Se();return}const n=o.col[t],s=`${t}:${n.type}:${n.visibleCol}`;if(!(!e&&ge===s&&T.length>0))try{const r=await Qe(n),i=r.dataColumns,a=ke(i,["initiales","initiale","initials","abreviation","abréviation","sigle"])||Ve(i,r.visibleColumnId),c=ke(i,["email","e-mail","mail","courriel","adresseemail","adresse_email","adressemail","adresse_mail"]),l=a&&Array.isArray(r.table[a])?r.table[a]:[],d=c&&Array.isArray(r.table[c])?r.table[c]:[];T=r.ids.map((p,b)=>{const v=u(r.labels[b]).trim(),h=Xt(l[b])||Xe(v),A=jt(d[b]);return{id:Number(p),label:v,initials:h,email:A,avatarColor:Ye(v||p)}}).filter(p=>Number.isInteger(p.id)&&p.id>0&&p.label&&p.label!=="#KeyError").sort((p,b)=>p.label.localeCompare(b.label,o.cultureFull,{sensitivity:"base"})),S=new Map(T.map(p=>[p.id,p])),ge=s}catch(r){Se(),console.error("Impossible de charger la table des membres :",r)}}function Se(){T=[],S=new Map,ge=null}async function We(e=!1){if(!o?.map?.ETIQUETTES||!o?.col?.ETIQUETTES){Ce();return}const t=o.col.ETIQUETTES,n=`${t.type}:${t.visibleCol}`;if(!(!e&&ve===n&&J.length>0))try{const s=await Qe(t),r=s.dataColumns,i=ke(r,["couleur","color","hex","codecouleur","code_couleur"])||Ve(r,s.visibleColumnId),a=i&&Array.isArray(s.table[i])?s.table[i]:[];J=s.ids.map((c,l)=>{const d=u(s.labels[l]).trim(),b=C(a[l])||Ze(d||c);return{id:Number(c),label:d,color:b,textColor:et(b)}}).filter(c=>Number.isInteger(c.id)&&c.id>0&&c.label&&c.label!=="#KeyError").sort((c,l)=>c.label.localeCompare(l.label,o.cultureFull,{sensitivity:"base"})),P=new Map(J.map(c=>[c.id,c])),ve=n}catch(s){Ce(),console.error("Impossible de charger la table des étiquettes :",s)}}function Ce(){J=[],P=new Map,ve=null}async function Qe(e){const[t,n]=u(e?.type).split(":");if(t!=="RefList"||!n||!e?.visibleCol)throw new Error("La colonne doit être une Liste de références avec une colonne visible configurée.");const[s,r]=await Promise.all([grist.docApi.fetchTable(n),e.getMeta(e.visibleCol)]),i=r?.colId;if(!i||!Array.isArray(s?.id)||!Array.isArray(s?.[i]))throw new Error(`La colonne visible de la table ${n} est introuvable.`);const a=Object.keys(s).filter(c=>Array.isArray(s[c])&&c!=="id"&&c!=="manualSort"&&!c.startsWith("gristHelper_"));return{tableId:n,table:s,ids:s.id,labels:s[i],visibleColumnId:i,dataColumns:a}}function ke(e,t){const n=new Set(t.map(Ge));return e.find(s=>n.has(Ge(s)))||null}function Ve(e,t){const n=e.indexOf(t);return n>=0&&e[n+1]||null}function Ge(e){return u(e).normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]/gi,"").toLowerCase()}function Xt(e){return u(e).trim().replace(/\s+/g,"").slice(0,4).toUpperCase()}function Xe(e){const t=u(e).trim().split(/\s+/).filter(Boolean);return t.length===0?"?":t.length===1?t[0].slice(0,2).toUpperCase():`${t[0][0]||""}${t[t.length-1][0]||""}`.toUpperCase()}function Ye(e){let t=0;for(const s of u(e))t=(t<<5)-t+s.charCodeAt(0),t|=0;return`hsl(${Math.abs(t)%360} 58% 42%)`}function Ze(e){let t=0;for(const s of u(e))t=(t<<5)-t+s.charCodeAt(0),t|=0;const n=Math.abs(t)%360;return Yt(n,62,72)}function Yt(e,t,n){t/=100,n/=100;const s=(1-Math.abs(2*n-1))*t,r=s*(1-Math.abs(e/60%2-1)),i=n-s/2;let a=0,c=0,l=0;return e<60?[a,c,l]=[s,r,0]:e<120?[a,c,l]=[r,s,0]:e<180?[a,c,l]=[0,s,r]:e<240?[a,c,l]=[0,r,s]:e<300?[a,c,l]=[r,0,s]:[a,c,l]=[s,0,r],`#${[a,c,l].map(d=>Math.round((d+i)*255).toString(16).padStart(2,"0")).join("")}`.toUpperCase()}function et(e){const t=C(e)||"#DDE3EA",n=parseInt(t.slice(1,3),16),s=parseInt(t.slice(3,5),16),r=parseInt(t.slice(5,7),16);return(.2126*n+.7152*s+.0722*r)/255>.58?"#1F2937":"#FFFFFF"}async function we(e=!1){if(!(ne&&!e)){Ee=new Map,ne=!0;try{const t=await grist.docApi.fetchTable("_grist_Attachments");(Array.isArray(t?.id)?t.id:[]).forEach((s,r)=>{const i=Number(s);if(!Number.isInteger(i)||i<=0)return;const a=u(t.fileName?.[r])||`Pièce jointe ${i}`,c=u(t.fileExt?.[r])||Kt(a),l=u(t.fileType?.[r]),d=Number(t.fileSize?.[r])||0;Ee.set(i,{id:i,fileName:a,fileExt:c,fileType:l,fileSize:d,imageWidth:Number(t.imageWidth?.[r])||0,imageHeight:Number(t.imageHeight?.[r])||0})})}catch(t){console.warn("Métadonnées des pièces jointes indisponibles :",t)}}}async function le(e){M=Array.isArray(e)?e:[],await Promise.all([ze(),We()]);const t=document.getElementById("conteneur-kanban");if(!t)return;t.innerHTML="";const n=await o.col.STATUT.getChoices();if(!Array.isArray(n)||n.length===0){t.innerHTML=`<div class="kanban-message">${f(y("No choice available in the Status column"))}</div>`;return}n.forEach((s,r)=>{const i=nn(s,r);i&&t.appendChild(i)}),M.forEach(s=>{const r=u(s.STATUT),i=Array.from(t.querySelectorAll(".contenu-colonne")).find(a=>a.dataset.statut===r);i&&i.insertBefore(sn(s),i.firstChild)}),ln(),document.querySelectorAll(".colonne-kanban").forEach(Ne)}function Zt(){const e=document.getElementById("config-view");!e||e.dataset.autosaveInstalled==="true"||(e.dataset.autosaveInstalled="true",e.addEventListener("input",t=>{t.target.matches("input, textarea, select")&&Ae()}),e.addEventListener("change",t=>{t.target.matches("input, textarea, select")&&Ae()}),e.addEventListener("click",t=>{t.target.closest(".config-switch")&&window.setTimeout(Ae,0)}))}function Ae(){window.clearTimeout(Ke),ue("saving","Sauvegarde…"),Ke=window.setTimeout(en,350)}async function en(){if(!(ye||!o?._parameters||!o?._config||o._config.style.display==="none")){ye=!0;try{o.opt=await o.readOptionValues(o._parameters,o._config,o.opt),await grist.widgetApi.setOption("options",JSON.parse(JSON.stringify(o.opt))),await $e(),ue("saved","Enregistré"),window.setTimeout(()=>{ue("","")},1400)}catch(e){console.error("Impossible de sauvegarder automatiquement la configuration :",e),ue("error","Échec de la sauvegarde")}finally{ye=!1}}}function ue(e,t){const n=document.getElementById("config-view");if(!n||n.style.display==="none")return;let s=n.querySelector(".config-autosave-status");!s&&t&&(s=document.createElement("div"),s.className="config-autosave-status",s.setAttribute("aria-live","polite"),n.appendChild(s)),s&&(s.className=`config-autosave-status${e?` ${e}`:""}`,s.textContent=t,s.hidden=!t)}async function $e(){await o.isMapped(),await le(M)}async function tn(){Se(),Ce(),ne=!1,Q=null,await Promise.all([ze(!0),We(!0)]),await le(M)}function nn(e,t){const n=Ot(t);if(n.hidecolumn)return null;const s=u(e),r=document.createElement("section");r.className=`colonne-kanban${!n.addbutton&&!o.opt.compact?" colonne-nobouton":""}`,r.id=s,localStorage.getItem(xt(s))==="true"&&r.classList.add("collapsed");const i=o.col.STATUT.getColor(s)??be,a=o.col.STATUT.getTextColor(s)??je,c=er(s);return r.innerHTML=`
        <div class="entete-colonne" style="background-color:${i};color:${a}">
            <div class="titre-statut">${f(s)} <span class="compteur-colonne">(0)</span></div>
            <div class="actions-colonne">
                ${n.addbutton&&!o.opt.readonly?`<button type="button" class="bouton-ajouter-entete ${o.opt.compact?"compact":""}" onclick="creerNouvelleTache(decodeURIComponent('${c}'))" aria-label="${m(y("Add a new task"))}">+</button>`:""}
                <button type="button" class="bouton-toggle" onclick="toggleColonne(this.closest('.colonne-kanban'), event)" aria-label="Replier ou déplier">⇄</button>
            </div>
        </div>
        ${n.addbutton&&!o.opt.readonly?`<button type="button" class="bouton-ajouter ${o.opt.compact?"compact":""}" onclick="creerNouvelleTache(decodeURIComponent('${c}'))">+ ${f(y("Add a new task"))}</button>`:""}
        <div class="contenu-colonne" data-statut="${m(s)}" data-isdone="${n.isdone?"true":"false"}"></div>
    `,r}function sn(e){const t=document.createElement("article"),n=o.opt.cardrotation===!0;t.className=`carte${n?"":" norotate"}${o.opt.compact?" compact":""}`,t.dataset.todoId=String(e.id),t.dataset.lastUpdate=Ht(e.DERNIERE_MISE_A_JOUR),t.dataset.deadline=Ht(e.DEADLINE),t.dataset.order=pn(e.ORDRE),cn(t,e.COULEUR);const s=e.DEADLINE?Be(e.DEADLINE):"",r=_t(e),i=Bt(e),a=Ut(e),c=x(e.CHECKLIST).flatMap(te=>te.items||[]),l=c.filter(te=>te.done).length,d=w(e.PIECES_JOINTES).length,p=me(e.LIENS).length,b=X(e.COMMENTAIRES).length,v=e.DESCRIPTION_DISPLAY?String(e.DESCRIPTION_DISPLAY):f(u(e.DESCRIPTION)||y("No description")),h=a.map(te=>on(te)).join(""),A=rn(r,i),U=xe(e.STATUT),I=pe(e.DEADLINE),Je=I!==null&&I<Date.now()&&I<z.getTime(),he=o.opt.showlabels!==!1,ee=o.opt.showmembers!==!1,nr=o.opt.showresponsables!==!1,sr=o.opt.showdeadline!==!1,zt=o.opt.showindicators!==!1,rr=o.opt.showchecklistprogress!==!1,Wt=(ee||nr)&&A,Qt=`
        ${rr&&c.length?`<span title="${l} élément(s) terminé(s) sur ${c.length}">☑ ${l}/${c.length}</span>`:""}
        ${zt&&d+p?`<span title="${d} fichier(s) et ${p} lien(s)">📎 ${d+p}</span>`:""}
        ${zt&&b?`<span title="${b} commentaire(s)">💬 ${b}</span>`:""}
    `;return t.innerHTML=`
        ${he&&h?`<div class="etiquettes-list">${h}</div>`:""}
        <div class="description">${v}</div>
        ${sr&&s?`<div class="deadline${Je?" late":""} truncate">📅 ${f(s)}</div>`:""}
        ${Wt||Qt.trim()?`<div class="card-footer">
                <div class="card-indicators">${Qt}</div>
                ${Wt?`<div class="card-team-stack" aria-label="Équipe de la carte">${A}</div>`:""}
               </div>`:""}
        ${U?.isdone?`<div class="tampon-termine" style="color:${o.col.STATUT.getColor(e.STATUT)??be};">${f(u(e.STATUT))}</div>`:""}
    `,t.addEventListener("click",()=>{grist.setCursorPos({rowId:e.id}),o.opt.hideedit||V(e)}),t.addEventListener("dblclick",()=>{grist.setCursorPos({rowId:e.id}),o.opt.gristeditcard?grist.commandApi.run("viewAsCard"):o.opt.hideedit||V(e)}),t}function rn(e,t){const n=new Set(t.map(a=>Number(a.id)).filter(a=>Number.isInteger(a)&&a>0)),s=[...t.map(a=>({...a,role:"responsable"})),...e.filter(a=>!n.has(Number(a.id))).map(a=>({...a,role:"membre"}))],r=s.slice(0,6),i=s.length-r.length;return[...r.map(a=>an(a,a.role)),i>0?`<span class="card-team-more" title="${i} autre(s) membre(s)">+${i}</span>`:""].join("")}function an(e,t="membre"){const n=t==="responsable",s=n?"Responsable":"Membre";return`
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
    `}function cn(e,t){const n=C(t)||C(o.opt?.defaultcardcolor)||"#FFFFD1";e.style.backgroundColor=n}function ln(){document.querySelectorAll(".contenu-colonne").forEach(e=>{mn(e),!(o.opt.readonly||typeof Sortable!="function")&&new Sortable(e,{group:"kanban-todo",animation:150,ghostClass:"carte-fantome",chosenClass:"carte-selectionnee",onEnd:async t=>{const n=t.to.dataset.statut,s=t.from.dataset.statut,r=Number(t.item.dataset.todoId),i=Array.from(t.to.querySelectorAll(".carte")).map(c=>Number(c.dataset.todoId)),a=t.from===t.to?[]:Array.from(t.from.querySelectorAll(".carte")).map(c=>Number(c.dataset.todoId));try{n!==s&&await $(r,"STATUT",n),o.map?.ORDRE&&!o.col.ORDRE.getIsFormula()?await un(i,a):(await tt(t.to),t.from!==t.to&&await tt(t.from))}catch(c){console.error(y("Error during status update:"),c),await le(M)}Ne(t.to.closest(".colonne-kanban")),t.from!==t.to&&Ne(t.from.closest(".colonne-kanban"))}})})}async function un(e,t=[]){const n=[],s=new Set;[e,t].forEach(r=>{const i=_(r).map(Number).filter(c=>Number.isInteger(c)&&c>0),a=i.join(",");i.length>0&&!s.has(a)&&(s.add(a),n.push(i))});for(const r of n)await dn(r)}async function dn(e){if(!o.map?.ORDRE||o.col.ORDRE.getIsFormula())return;const t=e.map((n,s)=>{const r=(s+1)*1e3,i=g(n),a=F(n);return i&&(i.ORDRE=r),a&&(a.dataset.order=String(r)),o.formatRecord(n,{ORDRE:r})});t.length>0&&await o.updateRecords(t)}async function tt(e){if(!o.map?.DEADLINE||!e)return;const n=Array.from(e.querySelectorAll(".carte")).filter(i=>{const a=pe(i.dataset.deadline);return a===null||a>=z.getTime()});if(n.length===0)return;let s=z.getFullYear();const r=n.map(i=>{const a=`${s}-01-01`;return s+=1,i.dataset.deadline=a,o.formatRecord(i.dataset.todoId,{DEADLINE:a})});await o.updateRecords(r)}function mn(e){if(!e)return;const t=e.dataset.isdone==="true",n=Array.from(e.children);n.sort((s,r)=>{let i=0;return o.map?.ORDRE?i=nt(s.dataset.order)-nt(r.dataset.order):o.map?.DEADLINE&&(t?i=fe(r.dataset.lastUpdate,0)-fe(s.dataset.lastUpdate,0):i=fe(s.dataset.deadline,Number.MAX_SAFE_INTEGER)-fe(r.dataset.deadline,Number.MAX_SAFE_INTEGER)),i!==0?i:(Number(s.dataset.todoId)||0)-(Number(r.dataset.todoId)||0)}),n.forEach(s=>e.appendChild(s))}function pn(e){const t=Number(e);return Number.isFinite(t)?String(t):""}function nt(e){const t=Number(e);return Number.isFinite(t)?t:Number.MAX_SAFE_INTEGER}function Ne(e){if(!e)return;const t=e.querySelector(".contenu-colonne"),n=e.querySelector(".compteur-colonne");t&&n&&(n.textContent=`(${t.children.length})`)}async function V(e){const t=document.getElementById("popup-todo");if(!t)return;if(o.opt.readonly){Y();return}document.querySelector(".carte.active")?.classList.remove("active"),F(e.id)?.classList.add("active");const n=xe(e.STATUT),s=o.col.STATUT.getColor(e.STATUT)??be,r=o.col.STATUT.getTextColor(e.STATUT)??je;t.style.setProperty("--task-status-color",s),t.style.setProperty("--task-status-text",r),t.style.borderLeftColor="transparent",t.dataset.statut=u(e.STATUT),t.dataset.isdone=n?.isdone?"true":"false",t.dataset.currentTodo=String(e.id);const i=t.querySelector(".popup-title"),a=t.querySelector(".popup-content"),c=t.querySelector(".popup-header"),l=t.querySelector(".bouton-fermer");if(i&&(i.textContent=""),c&&(c.style.backgroundColor="",c.style.color=""),l&&(l.style.color=""),!a)return;const d=o.map?.NOTES?o.col.NOTES.getIsFormula():!1,p=o.col.DESCRIPTION.getIsFormula(),b=kn(e),v=o.opt.showmetadata!==!1?Xs(e):"",h=o.map?.NOTES?Fn(e,d):"",A=o.map?.COMMENTAIRES&&o.opt.showcomments!==!1?Ms(e):"",U=!!(h||b.checklists||A),I=!!b.context;a.innerHTML=`
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

            ${I?`
                <div class="task-inline-context" aria-label="Informations actives de la carte">
                    ${b.context}
                </div>
            `:""}

            ${U?`
                <main class="task-main-column task-main-column-full">
                    ${h}
                    ${b.checklists}
                    ${A}
                </main>
            `:""}

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
    `,a.querySelectorAll(".auto-expand").forEach(K),t.classList.add("visible"),t.classList.remove("task-panel-open"),Et(a),o.map?.PIECES_JOINTES&&w(e.PIECES_JOINTES).length>0&&await As(e.id)}function fn(e){const t=!!(o.map?.CHECKLIST&&!o.col.CHECKLIST.getIsFormula()),n=!!(o.map?.MEMBRES&&!o.col.MEMBRES.getIsFormula()||o.map?.RESPONSABLE&&!o.col.RESPONSABLE.getIsFormula()),s=!!(o.map?.PIECES_JOINTES&&!o.col.PIECES_JOINTES.getIsFormula()||o.map?.LIENS&&!o.col.LIENS.getIsFormula());return`
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
            <div class="task-action-panels">${[bn(),o.map?.ETIQUETTES?gn(e):"",o.map?.DEADLINE?vn(e):"",o.map?.CHECKLIST?En(e):"",o.map?.MEMBRES||o.map?.RESPONSABLE?yn(e):"",o.map?.PIECES_JOINTES||o.map?.LIENS?Sn(e):"",o.map?.COULEUR?Cn(e):""].filter(Boolean).join("")}</div>
        </div>
    `}function bn(e){const t=[];return o.map?.ETIQUETTES&&t.push(["🏷️","Étiquettes","labels"]),o.map?.DEADLINE&&t.push(["📅","Dates","date"]),o.map?.CHECKLIST&&t.push(["☑","Checklist","checklist"]),(o.map?.MEMBRES||o.map?.RESPONSABLE)&&t.push(["👥","Membres","people"]),(o.map?.PIECES_JOINTES||o.map?.LIENS)&&t.push(["📎","Pièce jointe","resources"]),o.map?.COULEUR&&t.push(["🎨","Couleur de carte","color"]),`
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
    `}function gn(e){const t=new Set(_e(e)),n=o.col.ETIQUETTES.getIsFormula();return`
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
    `}function vn(e){const t=o.col.DEADLINE.getIsFormula();return`
        <section class="task-action-panel" data-panel="date" hidden>
            <div class="task-panel-heading">
                <div><strong>Date limite</strong><span>Ajoutez ou modifiez l’échéance de la carte</span></div>
                <button type="button" onclick="fermerPanneauxFiche(event)" aria-label="Fermer">×</button>
            </div>
            <div class="task-date-editor">
                <input
                    type="date"
                    value="${m(Ys(e.DEADLINE))}"
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
    `}function En(e){const t=o.col.CHECKLIST.getIsFormula();return`
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
    `}function yn(e){const t=new Set(Vs(e)),n=new Set(Gs(e)),s=!o.map?.MEMBRES||o.col.MEMBRES.getIsFormula(),r=!o.map?.RESPONSABLE||o.col.RESPONSABLE.getIsFormula();return`
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
                ${T.map(i=>`
                    <article
                        class="task-person-card"
                        data-search="${m(`${i.label} ${i.email||""}`.toLocaleLowerCase(o.cultureFull))}"
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

                        <div
                            class="task-person-role-actions"
                            aria-label="Rôles de ${m(i.label)}"
                        >
                            <button
                                type="button"
                                class="task-person-role-button task-person-role-member${t.has(i.id)?" active":""}"
                                data-role="MEMBRES"
                                data-person-id="${i.id}"
                                aria-pressed="${t.has(i.id)?"true":"false"}"
                                onclick="basculerRolePersonnePanneau(this, event)"
                                ${s?"disabled":""}
                            >
                                <span aria-hidden="true">👤</span>
                                <strong>Membre</strong>
                            </button>

                            <button
                                type="button"
                                class="task-person-role-button task-person-role-responsable${n.has(i.id)?" active":""}"
                                data-role="RESPONSABLE"
                                data-person-id="${i.id}"
                                aria-pressed="${n.has(i.id)?"true":"false"}"
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
    `}function Sn(e){const t=!!(o.map?.PIECES_JOINTES&&!o.col.PIECES_JOINTES.getIsFormula()),n=!!(o.map?.LIENS&&!o.col.LIENS.getIsFormula());return`
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
    `}function Cn(e){const t=C(e.COULEUR),n=t||C(o.opt?.defaultcardcolor)||"#FFFFD1",s=o.col.COULEUR.getIsFormula();return`
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
    `}function kn(e){const t=[],n=Ut(e),s=_t(e),r=Bt(e),i=C(e.COULEUR),a=x(e.CHECKLIST),c=w(e.PIECES_JOINTES),l=me(e.LIENS);n.length>0&&t.push(wn(e,n)),e.DEADLINE&&t.push(An(e)),(s.length>0||r.length>0)&&t.push($n(e,s,r)),i&&t.push(Nn(e,i));const d=[];return t.length>0&&d.push(`<div class="task-property-grid">${t.join("")}</div>`),(c.length>0||l.length>0)&&o.opt.showattachments!==!1&&d.push(Ss(e,c,l)),{context:d.join(""),checklists:a.length>0&&o.opt.showchecklist!==!1?os(e,a):""}}function wn(e,t){return`
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
    `}function An(e){const t=pe(e.DEADLINE),n=t!==null&&t<Date.now();return`
        <button
            type="button"
            class="task-compact-meta task-compact-date${n?" is-late":""}"
            onclick="ouvrirPanneauFiche('date', event, true)"
            title="Modifier la date limite"
        >
            <span class="task-compact-meta-title">Date</span>
            <span class="task-compact-date-value">
                <span aria-hidden="true">📅</span>
                <strong>${f(Be(e.DEADLINE))}</strong>
                ${n?"<small>En retard</small>":""}
            </span>
        </button>
    `}function $n(e,t,n){const s=new Set(n.map(i=>Number(i.id)).filter(i=>Number.isInteger(i)&&i>0));return`
        <section class="task-compact-meta task-compact-team">
            <span class="task-compact-meta-title">Équipe</span>
            <div class="task-compact-team-avatars">
                ${[...n.map(i=>({...i,role:"responsable"})),...t.filter(i=>!s.has(Number(i.id))).map(i=>({...i,role:"membre"}))].map(i=>`
                    <span
                        class="task-compact-avatar${i.role==="responsable"?" is-responsable":""}"
                        style="background:${m(i.avatarColor)}"
                        title="${m(`${i.role==="responsable"?"Responsable":"Membre"} : ${i.label}`)}"
                    >${f(i.initials)}</span>
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
    `}function Nn(e,t){return`
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
    `}function st(e,t,n=!1){t?.preventDefault(),t?.stopPropagation();const s=document.getElementById("popup-todo"),r=s?.querySelector(`.task-action-panel[data-panel="${e}"]`);if(!s||!r)return;const i=!r.hidden;if(s.querySelectorAll(".task-action-panel").forEach(a=>{a.hidden=!0}),s.querySelectorAll(".task-quick-button").forEach(a=>{a.classList.remove("active"),a.setAttribute("aria-expanded","false")}),!i||n){r.hidden=!1,s.classList.add("task-panel-open");const a=s.querySelector(`[data-panel-trigger="${e}"]`);a?.classList.add("active"),a?.setAttribute("aria-expanded","true"),window.setTimeout(()=>{r.querySelector('input:not([type="checkbox"]):not([type="file"]), textarea, button')?.focus()},0)}else q(t)}function q(e){e?.preventDefault(),e?.stopPropagation();const t=document.getElementById("popup-todo");t?.querySelectorAll(".task-action-panel").forEach(n=>{n.hidden=!0}),t?.querySelectorAll(".task-quick-button").forEach(n=>{n.classList.remove("active"),n.setAttribute("aria-expanded","false")}),t?.classList.remove("task-panel-open")}function In(e){const t=e.closest(".task-action-panel"),n=u(e.value).trim().toLocaleLowerCase(o.cultureFull);t?.querySelectorAll("[data-search]").forEach(s=>{s.hidden=n!==""&&!u(s.dataset.search).includes(n)})}async function k(e,t=""){const n=document.getElementById("popup-todo"),r=n?.querySelector(".popup-content")?.scrollTop||0,i=g(e);if(!i)return;await V(i);const a=n?.querySelector(".popup-content");a&&(a.scrollTop=r),t&&st(t,null,!0)}async function Tn(e,t,n){const s=u(t?.value).trim();await $(e,"DESCRIPTION",s,n);const r=F(e)?.querySelector(".description");r&&(r.textContent=s||y("No description"))}async function Ln(e,t,n,s,r){const a=r?.target?.closest(".task-action-panel")?.querySelector(".task-panel-status");try{a&&(a.className="task-panel-status section-status saving",a.textContent="Enregistrement…"),await $(e,t,n,r),await k(e,s)}catch{a&&(a.className="task-panel-status section-status error",a.textContent="Impossible d’enregistrer.")}}async function Rn(e,t,n){n?.stopPropagation();const s=t?.querySelector(".task-panel-status"),r=Array.from(t.querySelectorAll('input[type="checkbox"]:checked')).map(i=>Number(i.value)).filter(i=>P.has(i));try{s&&(s.className="task-panel-status section-status saving",s.textContent="Enregistrement…"),await H(e,"ETIQUETTES",r),Le(e,r),await k(e,"labels")}catch{s&&(s.className="task-panel-status section-status error",s.textContent="Impossible d’enregistrer les étiquettes.")}}async function Dn(e,t,n){n?.preventDefault(),n?.stopPropagation();const s=g(e),r=_e(s).filter(i=>i!==Number(t));await H(e,"ETIQUETTES",r),Le(e,r),await k(e)}function Mn(e,t){if(t?.preventDefault(),t?.stopPropagation(),!e||e.disabled)return;const n=!e.classList.contains("active");e.classList.toggle("active",n),e.setAttribute("aria-pressed",n?"true":"false"),Pn(e.closest(".task-action-panel"))}function Pn(e){e&&["MEMBRES","RESPONSABLE"].forEach(t=>{const n=e.querySelectorAll(`.task-person-role-button[data-role="${t}"].active`).length,s=e.querySelector(`[data-team-count="${t}"]`);s&&(s.textContent=t==="MEMBRES"?`${n} membre(s)`:`${n} responsable(s)`)})}async function qn(e,t,n){n?.preventDefault(),n?.stopPropagation();const s=t?.closest(".task-action-panel"),r=s?.querySelector(".task-panel-status");if(!s)return;const i=Array.from(s.querySelectorAll('.task-person-role-button[data-role="MEMBRES"].active')).map(c=>Number(c.dataset.personId)).filter(c=>Number.isInteger(c)&&S.has(c)),a=Array.from(s.querySelectorAll('.task-person-role-button[data-role="RESPONSABLE"].active')).map(c=>Number(c.dataset.personId)).filter(c=>Number.isInteger(c)&&S.has(c));t.disabled=!0;try{r&&(r.className="task-panel-status section-status saving",r.textContent="Enregistrement…"),o.map?.MEMBRES&&!o.col.MEMBRES.getIsFormula()&&(await H(e,"MEMBRES",i),Ie(e,"MEMBRES",i)),o.map?.RESPONSABLE&&!o.col.RESPONSABLE.getIsFormula()&&(await H(e,"RESPONSABLE",a),Ie(e,"RESPONSABLE",a)),r&&(r.className="task-panel-status section-status saved",r.textContent="Équipe enregistrée."),q(),await k(e)}catch(c){console.error("Impossible d’enregistrer l’équipe :",c),r&&(r.className="task-panel-status section-status error",r.textContent="Impossible d’enregistrer l’équipe.")}finally{t.disabled=!1}}function On(e,t,n){n.key==="Enter"&&(n.preventDefault(),rt(e,t,n))}async function rt(e,t,n){n?.preventDefault(),n?.stopPropagation();const s=t.closest(".task-action-panel"),r=s?.querySelector(".new-checklist-title"),i=s?.querySelector(".task-panel-status"),a=u(r?.value).trim();if(!a){i&&(i.className="task-panel-status section-status error",i.textContent="Saisissez un titre."),r?.focus();return}await D(e,c=>[...c,{id:B(),title:a,items:[],createdAt:new Date().toISOString()}]),await k(e)}async function xn(e,t,n,s){const i=n?.closest(".task-action-panel")?.querySelector(".task-panel-status"),a=u(t).trim(),c=C(a);if(a&&!c){i&&(i.className="task-panel-status section-status error",i.textContent="Utilisez un code hexadécimal valide.");return}try{i&&(i.className="task-panel-status section-status saving",i.textContent="Enregistrement…"),await $(e,"COULEUR",c||null,s);const l=F(e);l&&(l.style.backgroundColor=c||C(o.opt?.defaultcardcolor)||"#FFFFD1"),await k(e,"color")}catch{i&&(i.className="task-panel-status section-status error",i.textContent="Impossible d’enregistrer la couleur.")}}function Fn(e,t){const n=Number(e.id),s=Jn(e.NOTES),r=ct(s).trim().length>0,i=t?"disabled":"",a=[["bold","<strong>B</strong>","Gras"],["italic","<em>I</em>","Italique"],["underline","<u>U</u>","Souligné"],["strikeThrough","<s>S</s>","Barré"],["insertUnorderedList","• Liste","Liste à puces"],["insertOrderedList","1. Liste","Liste numérotée"],["insertHorizontalRule","―","Ligne de séparation"],["removeFormat","Tx","Effacer la mise en forme"],["undo","↶","Annuler"],["redo","↷","Rétablir"]].map(([c,l,d])=>`
        <button
            type="button"
            class="notes-tool"
            data-command="${c}"
            onmousedown="event.preventDefault()"
            onclick="appliquerCommandeNotes(this, '${c}', null, event)"
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
    `}function _n(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".notes-field"),s=n?.querySelector(".notes-edit-panel"),r=n?.querySelector(".notes-display"),i=n?.querySelector(".notes-editor");!n||!s||!r||!i||n.dataset.disabled==="true"||(n._originalNotesHtml=G(i.innerHTML),n.classList.add("is-editing"),n.classList.remove("is-dirty"),r.hidden=!0,s.hidden=!1,e.hidden=!0,document.execCommand("defaultParagraphSeparator",!1,"p"),i.focus(),Qn(i),j(i),O(Number(n.dataset.rowId),"",""))}function Bn(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".notes-field"),s=n?.querySelector(".notes-editor");!n||!s||(s.innerHTML=n._originalNotesHtml||"",it(n,!1))}async function Un(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".notes-field"),s=n?.querySelector(".notes-editor"),r=Number(n?.dataset?.rowId);if(!(!n||!s||!Number.isInteger(r)||r<=0)){e.disabled=!0;try{const i=await Vn(r,s);n._originalNotesHtml=i,it(n,!0)}finally{e.disabled=!1}}}function it(e,t){const n=e.querySelector(".notes-edit-panel"),s=e.querySelector(".notes-display"),r=e.querySelector(".notes-editor"),i=e.querySelector(".notes-edit-button");if(t&&s&&r){const a=G(r.innerHTML).trim(),c=ct(a).trim().length>0;s.innerHTML=c?a:"Aucune note pour cette tâche.",s.classList.toggle("empty",!c)}e.classList.remove("is-editing","is-dirty"),n&&(n.hidden=!0),s&&(s.hidden=!1),i&&(i.hidden=!1),O(Number(e.dataset.rowId),"","")}function Jn(e){const t=u(e).trim();if(!t)return"";const s=/<\/?[a-z][\s\S]*>/i.test(t)?t:f(t).replace(/\r?\n/g,"<br>");return G(s)}function G(e){const t=document.createElement("template");t.innerHTML=u(e);const n=new Set(["B","STRONG","I","EM","U","S","STRIKE","A","UL","OL","LI","P","DIV","BR","BLOCKQUOTE","H2","H3","SPAN","CODE","PRE","HR","MARK"]),s=new Set(["SCRIPT","STYLE","IFRAME","OBJECT","EMBED","FORM","INPUT","BUTTON","SVG","MATH","META","LINK"]),r=i=>{Array.from(i.childNodes).forEach(a=>{if(a.nodeType===Node.ELEMENT_NODE){if(s.has(a.tagName)){a.remove();return}if(!n.has(a.tagName)){r(a),a.replaceWith(...Array.from(a.childNodes));return}if(Array.from(a.attributes).forEach(c=>{a.tagName==="A"&&["href","target","rel"].includes(c.name.toLowerCase())||a.removeAttribute(c.name)}),a.tagName==="A"){const c=ot(a.getAttribute("href"));if(!c){a.replaceWith(...Array.from(a.childNodes));return}a.setAttribute("href",c),a.setAttribute("target","_blank"),a.setAttribute("rel","noopener noreferrer")}r(a)}else a.nodeType!==Node.TEXT_NODE&&a.remove()})};return r(t.content),t.innerHTML}function jn(e,t){t?.preventDefault(),t?.stopPropagation();const s=e.closest(".notes-field")?.querySelector(".notes-editor");!s||s.contentEditable!=="true"||(s.focus(),document.execCommand("formatBlock",!1,e.value||"p"),L(s),j(s))}function Hn(e,t,n,s){s?.preventDefault(),s?.stopPropagation();const i=e.closest(".notes-field")?.querySelector(".notes-editor");!i||i.contentEditable!=="true"||(i.focus(),document.execCommand(t,!1,n),L(i),j(i))}function Kn(e,t,n){n?.preventDefault(),n?.stopPropagation();const r=e.closest(".notes-field")?.querySelector(".notes-editor"),i=window.getSelection();if(!r||r.contentEditable!=="true"||!i||i.rangeCount===0)return;r.focus();const a=i.getRangeAt(0);if(!r.contains(a.commonAncestorContainer))return;const c=a.toString(),l=t==="mark"?"mark":"code";c?document.execCommand("insertHTML",!1,`<${l}>${f(c)}</${l}>`):document.execCommand("insertHTML",!1,`<${l}>&#8203;</${l}>`),L(r),j(r)}function at(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".notes-field"),s=n?.querySelector(".notes-editor");if(!s||s.contentEditable!=="true")return;s.focus();const r=window.prompt("Adresse du lien :","https://");if(r===null)return;const i=ot(r);if(!i){O(Number(n.dataset.rowId),"error","Adresse de lien invalide.");return}const a=window.getSelection();!a||a.isCollapsed?document.execCommand("insertHTML",!1,`<a href="${m(i)}" target="_blank" rel="noopener noreferrer">${f(i)}</a>`):document.execCommand("createLink",!1,i),L(s),j(s)}function ot(e){const t=u(e).trim();if(!t)return"";const n=/^(https?:|mailto:|tel:)/i.test(t)?t:`https://${t}`;try{const s=new URL(n);return["http:","https:","mailto:","tel:"].includes(s.protocol)?s.href:""}catch{return""}}function zn(e,t){if(!t?.clipboardData)return;t.preventDefault();const n=t.clipboardData.getData("text/html"),s=t.clipboardData.getData("text/plain"),r=n?G(n):f(s).replace(/\r?\n/g,"<br>");document.execCommand("insertHTML",!1,r),L(e)}function L(e){const t=e?.closest(".notes-field");t&&(t.classList.add("is-dirty"),O(Number(t.dataset.rowId),"saving","Modifications non enregistrées"))}function j(e){const t=e?.closest(".notes-field");if(!t||!t.classList.contains("is-editing"))return;t.querySelectorAll(".notes-tool[data-command]").forEach(s=>{let r=!1;try{r=document.queryCommandState(s.dataset.command)}catch{r=!1}s.classList.toggle("active",r),s.setAttribute("aria-pressed",r?"true":"false")});const n=t.querySelector(".notes-format-select");if(n){let s="p";try{s=u(document.queryCommandValue("formatBlock")).replace(/[<>]/g,"").toLowerCase()||"p"}catch{s="p"}Array.from(n.options).some(r=>r.value===s)?n.value=s:n.value="p"}}function Wn(e,t){if(!(t.ctrlKey||t.metaKey))return;const n=t.key.toLowerCase();if(n==="k"){t.preventDefault();const s=e.closest(".notes-field")?.querySelector(".notes-tool-link");s&&at(s,t)}t.shiftKey&&n==="7"&&(t.preventDefault(),document.execCommand("insertOrderedList"),L(e)),t.shiftKey&&n==="8"&&(t.preventDefault(),document.execCommand("insertUnorderedList"),L(e))}function Qn(e){const t=document.createRange(),n=window.getSelection();t.selectNodeContents(e),t.collapse(!1),n?.removeAllRanges(),n?.addRange(t)}function ct(e){const t=document.createElement("template");return t.innerHTML=u(e),t.content.textContent||""}async function Vn(e,t){if(!t)return"";const n=Number(e),s=G(t.innerHTML).trim(),r=ce.get(n)||Promise.resolve();O(n,"saving","Enregistrement…");const i=r.catch(()=>{}).then(()=>$(n,"NOTES",s||null)).then(()=>(t.innerHTML=s,O(n,"saved","Enregistré"),s)).catch(a=>{throw O(n,"error","Échec de l’enregistrement"),console.error("Erreur pendant l’enregistrement des notes :",a),a}).finally(()=>{ce.get(n)===i&&ce.delete(n)});return ce.set(n,i),i}function O(e,t,n){const s=document.getElementById(`notes-status-${Number(e)}`);s&&(s.className=`section-status notes-status${t?` ${t}`:""}`,s.textContent=n)}function C(e){const t=u(e).trim();if(!t)return"";const n=t.startsWith("#")?t:`#${t}`;return/^#[0-9a-f]{3}$/i.test(n)?`#${n[1]}${n[1]}${n[2]}${n[2]}${n[3]}${n[3]}`.toUpperCase():/^#[0-9a-f]{6}$/i.test(n)?n.toUpperCase():""}function Gn(e,t,n){const s=C(t);if(!s)return;const r=F(e);r&&(r.style.backgroundColor=s);const i=n?.closest(".color-field");if(i){const a=i.querySelector(".color-picker"),c=i.querySelector(".color-value");a&&n!==a&&(a.value=s),c&&n!==c&&(c.value=s)}}async function lt(e,t,n,s){s?.stopPropagation();const r=n?.closest(".color-field"),i=r?.querySelector(".color-status"),a=u(t).trim(),c=C(a);if(a&&!c){i&&(i.className="section-status color-status error",i.textContent="Utilisez un code hexadécimal, par exemple #FFFFD1.");return}try{i&&(i.className="section-status color-status saving",i.textContent="Enregistrement…"),await $(e,"COULEUR",c||null,s);const l=F(e);if(l&&(c?l.style.backgroundColor=c:l.style.backgroundColor=C(o.opt?.defaultcardcolor)||"#FFFFD1"),r){const d=r.querySelector(".color-picker"),p=r.querySelector(".color-value");d&&(d.value=c||C(o.opt?.defaultcardcolor)||"#FFFFD1"),p&&(p.value=c||"")}i&&(i.className="section-status color-status saved",i.textContent="Enregistré",window.setTimeout(()=>{i.className="section-status color-status",i.textContent=""},1200))}catch(l){i&&(i.className="section-status color-status error",i.textContent="Impossible d’enregistrer la couleur."),console.error("Erreur pendant l’enregistrement de la couleur :",l)}}function Xn(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".color-field"),s=Number(n?.dataset?.rowId);if(!n||!Number.isInteger(s)||s<=0)return;const r=n.querySelector(".color-value");r&&(r.value=""),lt(s,"",e,t)}function Yn(e,t,n){const s=Z(e);return s.length===0?"Choisir…":s.length===1?s[0]:`${s.length} ${n||`${t}s`}`}function Zn(e){const t=e.closest(".multi-dropdown");if(!t)return;const n=e.value.trim().toLocaleLowerCase(o.cultureFull);t.querySelectorAll(".multi-option").forEach(s=>{const r=s.querySelector('input[type="checkbox"]'),i=s.dataset.hideWhenSelected==="true"&&r?.checked,a=n!==""&&!u(s.dataset.search).includes(n);s.hidden=!!(i||a)}),dt(t)}function es(e,t,n,s,r){r?.preventDefault(),r?.stopPropagation();const i=e.closest(".multi-dropdown");i&&(i.querySelectorAll('input[type="checkbox"]:checked').forEach(a=>{a.checked=!1}),ut(Number(i.dataset.rowId),t,i,n,s,r))}async function ut(e,t,n,s,r,i){i?.stopPropagation();const a=Number(e||n?.dataset?.rowId);if(!Number.isInteger(a)||a<=0||!n)return;const c=Array.from(n.querySelectorAll('input[type="checkbox"]:checked')).map(h=>Number(h.value)).filter(h=>Number.isInteger(h)&&h>0&&S.has(h)),l=c.map(h=>S.get(h)?.label).filter(Boolean),d=n.querySelector("summary");d&&(d.textContent=Yn(l,s,r)),R(n,"saving","Enregistrement…");const p=`${t}:${a}`,v=(se.get(p)||Promise.resolve()).catch(()=>{}).then(()=>H(a,t,c)).then(()=>{Ie(a,t,c),R(n,"saved","Enregistré"),window.setTimeout(()=>R(n,"",""),1200)}).catch(h=>{R(n,"error","Échec de l’enregistrement"),console.error(`Erreur lors de l’enregistrement de ${t} :`,h)}).finally(()=>{se.get(p)===v&&se.delete(p)});se.set(p,v),await v}function Ie(e,t,n){const s=g(e);s&&(s[`${t}_id`]=[...n],s[t]=n.map(r=>S.get(r)?.label).filter(Boolean))}function ts(e,t,n){return e.length?e.map(s=>`
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
    `).join(""):'<span class="etiquettes-empty">Aucune étiquette</span>'}function ns(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".multi-dropdown");n&&(n.querySelectorAll('input[type="checkbox"]:checked').forEach(s=>{s.checked=!1}),Te(Number(n.dataset.rowId),n,t))}function ss(e,t,n,s){s?.preventDefault(),s?.stopPropagation();const i=n.closest(".field-etiquettes")?.querySelector(".etiquettes-dropdown");if(!i)return;const a=i.querySelector(`input[type="checkbox"][value="${Number(t)}"]`);a&&(a.checked=!1),Te(Number(e),i,s)}async function Te(e,t,n){n?.stopPropagation();const s=Number(e||t?.dataset?.rowId);if(!Number.isInteger(s)||s<=0||!t)return;const r=Array.from(t.querySelectorAll('input[type="checkbox"]:checked')).map(c=>Number(c.value)).filter(c=>Number.isInteger(c)&&c>0&&P.has(c));rs(t,s,r),R(t,"saving","Enregistrement…");const a=(re.get(s)||Promise.resolve()).catch(()=>{}).then(()=>H(s,"ETIQUETTES",r)).then(()=>{Le(s,r),R(t,"saved","Enregistré"),window.setTimeout(()=>R(t,"",""),1200)}).catch(c=>{R(t,"error","Échec de l’enregistrement"),console.error("Erreur lors de l’enregistrement des étiquettes :",c)}).finally(()=>{re.get(s)===a&&re.delete(s)});re.set(s,a),await a}function rs(e,t,n){const r=e.closest(".field-etiquettes")?.querySelector(".etiquettes-actives"),i=new Set(n),a=n.map(c=>P.get(c)).filter(Boolean);r&&(r.innerHTML=ts(a,t)),e.querySelectorAll(".etiquette-option").forEach(c=>{const l=c.querySelector('input[type="checkbox"]'),d=i.has(Number(l?.value));l&&(l.checked=d),c.hidden=d}),dt(e)}function dt(e){if(!e?.classList.contains("etiquettes-dropdown"))return;const t=e.querySelector(".multi-all-selected"),n=Array.from(e.querySelectorAll(".etiquette-option")).filter(s=>!s.hidden);t&&(t.hidden=n.length>0)}function Le(e,t){const n=g(e);n&&(n.ETIQUETTES_id=[...t],n.ETIQUETTES=t.map(s=>P.get(s)?.label).filter(Boolean))}async function H(e,t,n){const s=o.map?.[t];if(!s||Array.isArray(s))throw new Error(`La colonne ${t} n’est pas correctement mappée.`);const r=[...new Set(_(n).map(Number).filter(d=>Number.isInteger(d)&&d>0))],i=await grist.getTable().getTableId(),a=r.length>0?["L",...r]:null;await grist.docApi.applyUserActions([["UpdateRecord",i,Number(e),{[s]:a}]]);const c=await mt(e,s),l=is(c);if(!as(r,l))throw new Error(`Vérification d’écriture échouée pour ${t}. Valeur envoyée : ${JSON.stringify(a)} ; valeur relue : ${JSON.stringify(c)}`);await Pt(e)}async function mt(e,t){const n=await grist.getTable().getTableId(),s=await grist.docApi.fetchTable(n),r=_(s?.id).findIndex(i=>Number(i)===Number(e));if(r<0)throw new Error(`Ligne ${e} introuvable dans la table ${n}.`);return s?.[t]?.[r]}function is(e){return e==null||e===""?[]:!Array.isArray(e)||e[0]==="E"?[]:e[0]==="L"?w(e.slice(1)):e[0]==="r"?w(e[2]):w(e)}function as(e,t){const n=[...new Set(e.map(Number))].sort((r,i)=>r-i),s=[...new Set(t.map(Number))].sort((r,i)=>r-i);return n.length===s.length&&n.every((r,i)=>r===s[i])}function R(e,t,n){const s=e?.querySelector(".multi-status");s&&(s.className=`multi-status${t?` ${t}`:""}`,s.textContent=n)}function x(e){const t=u(e).trim();if(!t)return[];try{const n=JSON.parse(t);if(!Array.isArray(n))return[];if(n.length>0&&n.every(r=>!Array.isArray(r?.items))){const r=n.map((i,a)=>ft(i,a));return r.length>0?[{id:"legacy-checklist",title:"Checklist",items:r,createdAt:""}]:[]}return n.map((r,i)=>pt(r,i)).filter(r=>r.title||r.items.length>0)}catch(n){return console.warn("Checklists illisibles, valeur ignorée :",n),[]}}function pt(e,t=0){const n=Array.isArray(e?.items)?e.items.map((s,r)=>ft(s,r)):[];return{id:u(e?.id)||`checklist-${t}-${B()}`,title:u(e?.title||e?.name).trim()||`Checklist ${t+1}`,items:n,createdAt:u(e?.createdAt)}}function ft(e,t=0){return{id:u(e?.id)||`item-${t}-${B()}`,text:u(e?.text).trim(),done:!!e?.done,memberIds:[...new Set(w(e?.memberIds||e?.members||[]))],dueDate:ht(e?.dueDate),createdAt:u(e?.createdAt)}}function ht(e){const t=u(e).trim();return/^\d{4}-\d{2}-\d{2}$/.test(t)?t:""}function os(e,t=x(e.CHECKLIST)){if(!t.length)return"";const n=o.col.CHECKLIST.getIsFormula();return`
        <div class="checklists-stack" data-row-id="${Number(e.id)}">
            ${t.map(s=>bt(s,e.id,n)).join("")}
        </div>
    `}function bt(e,t,n){const s=e.items.filter(i=>i.done).length,r=e.items.length>0?Math.round(s/e.items.length*100):0;return`
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
                ${e.items.length?e.items.map(i=>cs(i,e.id,t,n)).join(""):'<div class="section-empty checklist-empty">Cette checklist est vide.</div>'}
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
                id="checklist-status-${Number(t)}-${yt(e.id)}"
                class="section-status checklist-status"
                aria-live="polite"
            ></div>
        </section>
    `}function cs(e,t,n,s){const r=e.memberIds.map(c=>S.get(c)).filter(Boolean),i=!e.done&&e.dueDate&&new Date(`${e.dueDate}T23:59:59`).getTime()<Date.now(),a=e.dueDate?`${i?"Échéance dépassée":"Date limite"} : ${Be(e.dueDate)}`:"Ajouter une date limite";return`
        <article
            class="checklist-item checklist-item-compact${e.done?" done":""}${i?" overdue":""}"
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
                <div
                    class="checklist-inline-date${i?" overdue":""}${e.dueDate?" has-date":""}"
                >
                    <button
                        type="button"
                        class="checklist-inline-date-button"
                        onclick="ouvrirDateChecklist(this, event)"
                        title="${m(a)}"
                        aria-label="${m(a)}"
                        ${s?"disabled":""}
                    >📅</button>

                    <input
                        type="date"
                        class="checklist-inline-date-input"
                        value="${m(e.dueDate)}"
                        tabindex="-1"
                        aria-hidden="true"
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
                </div>

                ${ls(e,t,n,r,s)}

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
    `}function ls(e,t,n,s,r){const i=new Set(e.memberIds),a=gt(s);return r?`<div class="checklist-assignees readonly">${a}</div>`:`
        <details class="checklist-assignees">
            <summary>${a}</summary>
            <div class="checklist-assignees-menu">
                <div class="multi-toolbar">
                    <input type="search" class="multi-search" placeholder="Rechercher…" oninput="filtrerOptionsChecklist(this)" onclick="event.stopPropagation()">
                </div>
                <div class="multi-options">
                    ${T.map(c=>`
                        <label class="multi-option checklist-person-option" data-search="${m(c.label.toLocaleLowerCase(o.cultureFull))}">
                            <input
                                type="checkbox"
                                value="${c.id}"
                                ${i.has(c.id)?"checked":""}
                                onchange="mettreAJourAssignationsItemChecklist(${Number(n)}, '${E(t)}', '${E(e.id)}', this.closest('.checklist-assignees'), event)"
                            >
                            <span class="responsable-option-avatar" style="background:${m(c.avatarColor)}">${f(c.initials)}</span>
                            <span class="responsable-option-name">${f(c.label)}</span>
                        </label>
                    `).join("")||'<div class="multi-empty">Aucun membre disponible</div>'}
                </div>
            </div>
        </details>
    `}function gt(e){return e.length?`
            <span class="checklist-assignee-avatars">
                ${e.slice(0,4).map(t=>`
                    <span class="checklist-assignee-avatar" style="background:${m(t.avatarColor)}" title="${m(t.label)}">${f(t.initials)}</span>
                `).join("")}
                ${e.length>4?`<span class="checklist-assignee-more">+${e.length-4}</span>`:""}
            </span>
        `:'<span class="checklist-assignee-placeholder">👤 Attribuer</span>'}function us(e){const t=e.closest(".checklist-assignees"),n=e.value.trim().toLocaleLowerCase(o.cultureFull);t?.querySelectorAll(".checklist-person-option").forEach(s=>{s.hidden=n!==""&&!u(s.dataset.search).includes(n)})}function ds(e,t){t?.preventDefault(),t?.stopPropagation();const s=e?.closest(".checklist-inline-date")?.querySelector(".checklist-inline-date-input");if(!(!s||s.disabled)){s.focus({preventScroll:!0});try{typeof s.showPicker=="function"?s.showPicker():s.click()}catch{s.click()}}}function ms(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".checklist-add-zone"),s=n?.querySelector(".checklist-add-composer"),r=s?.querySelector(".checklist-add-input");!n||!s||(e.hidden=!0,s.hidden=!1,r?.focus())}function ps(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".checklist-add-zone"),s=n?.querySelector(".checklist-add-composer"),r=n?.querySelector(".checklist-add-trigger"),i=s?.querySelector(".checklist-add-input");!n||!s||!r||(i&&(i.value=""),s.hidden=!0,r.hidden=!1)}function fs(e,t,n,s){s.key==="Enter"&&(s.preventDefault(),vt(e,t,n,s))}async function vt(e,t,n,s){s?.preventDefault(),s?.stopPropagation();const i=n.closest(".checklist-section")?.querySelector(".checklist-add-input"),a=u(i?.value).trim();if(!a){i?.focus(),de(e,t,"error","Saisissez un intitulé.");return}i&&(i.value="");const c=await D(e,l=>l.map(d=>d.id===t?{...d,items:[...d.items,{id:B(),text:a,done:!1,memberIds:[],dueDate:"",createdAt:new Date().toISOString()}]}:d));Re(e,t,c)}async function hs(e,t,n,s){s?.stopPropagation();const r=u(n).trim()||"Checklist";await D(e,i=>i.map(a=>a.id===t?{...a,title:r}:a))}async function bs(e,t,n,s,r,i,a){a?.stopPropagation();const c=s==="done"?!!r:s==="dueDate"?ht(r):u(r).trim(),l=await D(e,d=>d.map(p=>p.id===t?{...p,items:p.items.map(b=>b.id===n?{...b,[s]:c}:b)}:p));if(s==="text"){de(e,t,"saved","Élément enregistré.");return}Re(e,t,l)}async function gs(e,t,n,s,r){r?.stopPropagation();const i=Array.from(s.querySelectorAll('input[type="checkbox"]:checked')).map(l=>Number(l.value)).filter(l=>S.has(l));await D(e,l=>l.map(d=>d.id===t?{...d,items:d.items.map(p=>p.id===n?{...p,memberIds:i}:p)}:d));const a=i.map(l=>S.get(l)).filter(Boolean),c=s.querySelector("summary");c&&(c.innerHTML=gt(a)),de(e,t,"saved","Attribution enregistrée.")}async function vs(e,t,n,s){s?.preventDefault(),s?.stopPropagation();const r=g(e),a=x(r?.CHECKLIST).find(l=>l.id===t)?.items.find(l=>l.id===n);if(a?.text&&!window.confirm(`Supprimer « ${a.text} » ?`))return;const c=await D(e,l=>l.map(d=>d.id===t?{...d,items:d.items.filter(p=>p.id!==n)}:d));Re(e,t,c)}async function Es(e,t,n){n?.preventDefault(),n?.stopPropagation();const s=g(e),r=x(s?.CHECKLIST).find(i=>i.id===t);window.confirm(`Supprimer la checklist « ${r?.title||"Checklist"} » et tous ses éléments ?`)&&(await D(e,i=>i.filter(a=>a.id!==t)),await k(e))}async function D(e,t){const n=Number(e),r=(ie.get(n)||Promise.resolve()).catch(()=>{}).then(async()=>{const i=g(n),a=x(i?.CHECKLIST),c=t(a).map((l,d)=>pt(l,d));return await $(n,"CHECKLIST",JSON.stringify(c)),i&&(i.CHECKLIST=JSON.stringify(c)),c}).finally(()=>{ie.get(n)===r&&ie.delete(n)});return ie.set(n,r),r}function Re(e,t,n=null){const s=g(e),i=(n||x(s?.CHECKLIST)).find(d=>d.id===t),a=document.querySelector(`.checklist-section[data-row-id="${Number(e)}"][data-checklist-id="${ys(t)}"]`);if(!a||!i){k(e);return}const c=document.createElement("div");c.innerHTML=bt(i,e,o.col.CHECKLIST.getIsFormula());const l=c.firstElementChild;a.replaceWith(l),l.querySelectorAll(".auto-expand").forEach(K),Et(l.parentElement)}function de(e,t,n,s){const r=document.getElementById(`checklist-status-${Number(e)}-${yt(t)}`);r&&(r.className=`section-status checklist-status${n?` ${n}`:""}`,r.textContent=s)}function Et(e=document){typeof Sortable!="function"||o.opt.readonly||e.querySelectorAll('.checklist-section[data-disabled="false"] .checklist-items').forEach(t=>{t.dataset.sortableReady!=="true"&&(t.dataset.sortableReady="true",new Sortable(t,{animation:140,handle:".checklist-drag-handle",ghostClass:"checklist-item-ghost",chosenClass:"checklist-item-chosen",onEnd:async()=>{const n=Number(t.dataset.rowId),s=t.dataset.checklistId,r=Array.from(t.querySelectorAll(".checklist-item")).map(i=>i.dataset.itemId);await D(n,i=>i.map(a=>{if(a.id!==s)return a;const c=new Map(a.items.map(l=>[l.id,l]));return{...a,items:r.map(l=>c.get(l)).filter(Boolean)}})),de(n,s,"saved","Ordre enregistré.")}}))})}function yt(e){return u(e).replace(/[^a-zA-Z0-9_-]/g,"_")}function ys(e){return window.CSS?.escape?window.CSS.escape(u(e)):u(e).replace(/["\\]/g,"\\$&")}function Ss(e,t=w(e.PIECES_JOINTES),n=me(e.LIENS)){return`
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
                        ${n.map(s=>Cs(e.id,s)).join("")}
                    </div>
                </div>
            `:""}
        </section>
    `}function me(e){const t=u(e).trim();if(!t)return[];try{const n=JSON.parse(t);return Array.isArray(n)?n.map((s,r)=>({id:u(s?.id)||`link-${r}`,label:u(s?.label||s?.text).trim(),url:De(s?.url),createdAt:u(s?.createdAt)})).filter(s=>s.label&&s.url):[]}catch(n){return console.warn("Liens illisibles, valeur ignorée :",n),[]}}function De(e){const t=u(e).trim();if(!t)return"";const n=/^(https?:)/i.test(t)?t:`https://${t}`;try{const s=new URL(n);return["http:","https:"].includes(s.protocol)?s.href:""}catch{return""}}function Cs(e,t){let n="";try{n=new URL(t.url).hostname}catch{n=t.url}return`
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
    `}async function ks(e,t,n){n?.preventDefault(),n?.stopPropagation();const s=t.closest(".task-action-panel"),r=s?.querySelector(".resource-link-label"),i=s?.querySelector(".resource-link-url"),a=s?.querySelector(".task-panel-status"),c=u(r?.value).trim(),l=De(i?.value);if(!c||!l){a&&(a.className="task-panel-status section-status error",a.textContent="Renseignez un texte d’affichage et une adresse valide."),(c?i:r)?.focus();return}try{a&&(a.className="task-panel-status section-status saving",a.textContent="Enregistrement…"),await St(e,d=>[...d,{id:B(),label:c,url:l,createdAt:new Date().toISOString()}]),await k(e,"resources")}catch{a&&(a.className="task-panel-status section-status error",a.textContent="Impossible d’ajouter le lien.")}}async function ws(e,t,n){n?.preventDefault(),n?.stopPropagation(),await St(e,s=>s.filter(r=>r.id!==t)),await k(e)}async function St(e,t){const n=Number(e),r=(ae.get(n)||Promise.resolve()).catch(()=>{}).then(async()=>{const i=g(n),a=me(i?.LIENS),c=t(a).map(l=>({id:u(l.id)||B(),label:u(l.label).trim(),url:De(l.url),createdAt:u(l.createdAt)||new Date().toISOString()})).filter(l=>l.label&&l.url);return await $(n,"LIENS",JSON.stringify(c)),i&&(i.LIENS=JSON.stringify(c)),c}).finally(()=>{ae.get(n)===r&&ae.delete(n)});return ae.set(n,r),r}async function As(e){const t=document.getElementById(`attachments-list-${Number(e)}`);if(!t)return;const n=g(e),s=w(n?.PIECES_JOINTES);if(s.length===0){t.innerHTML='<div class="section-empty">Aucune pièce jointe</div>';return}t.innerHTML='<div class="section-loading">Chargement des aperçus…</div>';try{const[r]=await Promise.all([Me(!0),we()]);t.innerHTML=s.map(i=>Ct(e,i,r)).join("")}catch(r){console.error("Impossible d’afficher les pièces jointes :",r),t.innerHTML=s.map(i=>Ct(e,i,null)).join("")}}function Ct(e,t,n){const s=$t(t),r=n?At(n,t):"",i=Nt(s),a=i==="image"&&r?`<img src="${m(r)}" alt="${m(s.fileName)}" loading="lazy">`:`<div class="attachment-file-icon">${It(i)}</div>`;return`
        <article class="attachment-card">
            <button type="button" class="attachment-preview" onclick="ouvrirPieceJointe(${Number(e)}, ${Number(t)}, event)" title="Ouvrir ${m(s.fileName)}">
                ${a}
            </button>
            <div class="attachment-info">
                <div class="attachment-name" title="${m(s.fileName)}">${f(s.fileName)}</div>
                <div class="attachment-meta">${f(Zs(s.fileSize))}</div>
            </div>
            <div class="attachment-actions">
                <button type="button" onclick="ouvrirPieceJointe(${Number(e)}, ${Number(t)}, event)" title="Visualiser">👁</button>
                ${o.map?.PIECES_JOINTES&&!o.col.PIECES_JOINTES.getIsFormula()?`<button type="button" onclick="retirerPieceJointe(${Number(e)}, ${Number(t)}, event)" title="Retirer de la tâche">×</button>`:""}
            </div>
        </article>
    `}function $s(e,t){t?.preventDefault(),t?.stopPropagation();const s=e?.closest(".task-action-panel")?.querySelector(".resource-file-input");!s||s.disabled||s.click()}function Ns(e){const t=[],n=s=>{if(s!=null){if(typeof s=="number"||typeof s=="string"){const r=Number(s);Number.isInteger(r)&&r>0&&t.push(r);return}if(Array.isArray(s)){const r=s[0]==="L"?1:0;s.slice(r).forEach(n);return}typeof s=="object"&&["id","ids","attachmentId","attachmentIds","attachments","recordIds","result"].forEach(r=>{Object.prototype.hasOwnProperty.call(s,r)&&n(s[r])})}};return n(e),[...new Set(t)]}async function Is(e,t,n){n?.preventDefault(),n?.stopPropagation();const s=t?.closest(".task-action-panel"),r=s?.querySelector(".task-panel-status"),i=s?.querySelector(".resource-file-button"),a=Array.from(t?.files||[]);if(a.length===0)return;const c=(d,p)=>{r&&(r.className=`task-panel-status section-status${d?` ${d}`:""}`,r.textContent=p)},l=a.find(d=>d.size>Gt);if(l){c("error",`${l.name} dépasse la limite de 50 Mo.`),t.value="";return}t.disabled=!0,i&&(i.disabled=!0),c("saving",`Envoi de ${a.length} fichier(s)…`);try{const d=await Me(!1),p=new FormData;a.forEach(ee=>{p.append("upload",ee,ee.name)});const b=`${d.baseUrl}/attachments?auth=${encodeURIComponent(d.token)}`,v=await fetch(b,{method:"POST",body:p,headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}),h=await v.text();let A=h;if(h)try{A=JSON.parse(h)}catch{A=h}if(!v.ok)throw new Error(`Upload refusé par Grist (${v.status}).`);const U=Ns(A);if(U.length===0)throw new Error("Le fichier a été envoyé, mais aucun identifiant de pièce jointe n’a été retourné.");const I=g(e),Je=w(I?.PIECES_JOINTES),he=[...new Set([...Je,...U])];await kt(e,he),I&&(I.PIECES_JOINTES=[...he]),ne=!1,Q=null,await we(!0),c("saved",`${U.length} pièce(s) jointe(s) ajoutée(s).`),q(),await k(e)}catch(d){console.error("Erreur pendant l’ajout des pièces jointes :",d),c("error",d?.message||"Échec de l’envoi.")}finally{t.value="",t.disabled=!1,i&&(i.disabled=!1)}}async function Ts(e,t,n){n?.preventDefault(),n?.stopPropagation();const s=g(e),i=w(s?.PIECES_JOINTES).filter(a=>a!==Number(t));try{N("attachments",e,"saving","Mise à jour…"),await kt(e,i),s&&(s.PIECES_JOINTES=[...i]),await k(e)}catch(a){console.error("Erreur pendant le retrait de la pièce jointe :",a),N("attachments",e,"error","Impossible de retirer la pièce jointe.")}}async function kt(e,t){const n=o.map?.PIECES_JOINTES;if(!n||Array.isArray(n))throw new Error("La colonne Pièces jointes n’est pas correctement mappée.");await grist.getTable().update({id:Number(e),fields:{[n]:["L",...t]}}),await Pt(e)}async function Ls(e,t,n){n?.preventDefault(),n?.stopPropagation();try{const[s]=await Promise.all([Me(!0),we()]),r=$t(t),i=At(s,t);Ds(r,i)}catch(s){console.error("Impossible d’ouvrir la pièce jointe :",s),window.alert("Impossible d’ouvrir cette pièce jointe.")}}function Rs(){if(document.getElementById("attachment-viewer"))return;const e=document.createElement("div");e.id="attachment-viewer",e.className="attachment-viewer",e.setAttribute("aria-hidden","true"),e.innerHTML=`
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
    `,document.body.appendChild(e)}function Ds(e,t){const n=document.getElementById("attachment-viewer"),s=document.getElementById("attachment-viewer-content"),r=document.getElementById("attachment-viewer-title"),i=document.getElementById("attachment-viewer-download");if(!n||!s||!r||!i)return;r.textContent=e.fileName,i.href=t;const a=Nt(e);a==="image"?s.innerHTML=`<img src="${m(t)}" alt="${m(e.fileName)}">`:a==="pdf"?s.innerHTML=`<iframe src="${m(t)}" title="${m(e.fileName)}"></iframe>`:a==="video"?s.innerHTML=`<video src="${m(t)}" controls autoplay></video>`:a==="audio"?s.innerHTML=`<div class="attachment-generic-preview"><div class="attachment-large-icon">🎵</div><audio src="${m(t)}" controls autoplay></audio></div>`:s.innerHTML=`<div class="attachment-generic-preview"><div class="attachment-large-icon">${It(a)}</div><p>Ce format ne dispose pas d’un aperçu intégré.</p><a href="${m(t)}" target="_blank" rel="noopener">Ouvrir ou télécharger le fichier</a></div>`,n.classList.add("visible"),n.setAttribute("aria-hidden","false")}function wt(e){e?.preventDefault(),e?.stopPropagation();const t=document.getElementById("attachment-viewer");if(!t)return;t.classList.remove("visible"),t.setAttribute("aria-hidden","true");const n=document.getElementById("attachment-viewer-content");n&&(n.innerHTML="")}async function Me(e=!0){if(e&&Q&&Date.now()-He<Vt)return Q;const t=await grist.docApi.getAccessToken({readOnly:e});return e&&(Q=t,He=Date.now()),t}function At(e,t){return`${e.baseUrl}/attachments/${Number(t)}/download?auth=${encodeURIComponent(e.token)}`}function $t(e){return Ee.get(Number(e))||{id:Number(e),fileName:`Pièce jointe ${Number(e)}`,fileExt:"",fileType:"",fileSize:0,imageWidth:0,imageHeight:0}}function Nt(e){const t=u(e.fileExt||Kt(e.fileName)).toLowerCase().replace(/^\./,""),n=u(e.fileType).toLowerCase();return n.startsWith("image/")||["png","jpg","jpeg","gif","webp","svg","bmp","avif"].includes(t)?"image":n==="application/pdf"||t==="pdf"?"pdf":n.startsWith("video/")||["mp4","webm","mov","m4v","ogv"].includes(t)?"video":n.startsWith("audio/")||["mp3","wav","ogg","m4a","aac","flac"].includes(t)?"audio":["doc","docx","odt"].includes(t)?"document":["xls","xlsx","ods","csv"].includes(t)?"tableur":["ppt","pptx","odp"].includes(t)?"presentation":["zip","rar","7z","tar","gz"].includes(t)?"archive":"file"}function It(e){return{image:"🖼️",pdf:"📕",video:"🎬",audio:"🎵",document:"📄",tableur:"📊",presentation:"📽️",archive:"🗜️",file:"📎"}[e]||"📎"}function Ms(e){const t=X(e.COMMENTAIRES),n=o.opt.enablementions!==!1;return`
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
                ${Rt(t,e.id)}
            </div>

            <div class="comment-composer">
                <div class="comment-input-wrapper">
                    <textarea
                        class="comment-input"
                        placeholder="Écrire un commentaire${n?" — utilisez @ pour mentionner quelqu’un":""}…"
                        oninput="ajusterTextarea(this); gererSaisieMention(this)"
                        onkeydown="gererTouchesMention(this, event)"
                    ></textarea>

                    ${n?Ps():""}
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
    `}function Ps(){return`
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
    `}function qs(e,t){t?.preventDefault(),t?.stopPropagation();const s=e.closest(".comment-composer")?.querySelector(".mention-menu");s&&(s.hidden=!1,Tt(s,""))}function Os(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".mention-menu");n&&(n.hidden=!0)}function xs(e){const n=e.closest(".comment-composer")?.querySelector(".mention-menu");if(!n||o.opt.enablementions===!1)return;const s=Lt(e);if(!s){n.hidden=!0;return}n.hidden=!1,n.dataset.mentionStart=String(s.start),Tt(n,s.query)}function Fs(e,t){const s=e.closest(".comment-composer")?.querySelector(".mention-menu");if(!s||s.hidden)return;const r=Array.from(s.querySelectorAll(".mention-option:not([hidden])"));if(t.key==="Escape"){t.preventDefault(),s.hidden=!0,e.focus();return}t.key==="Enter"&&r.length===1&&(t.preventDefault(),r[0].click())}function Tt(e,t){const n=u(t).trim().toLocaleLowerCase(o.cultureFull);e.querySelectorAll(".mention-option").forEach(s=>{s.hidden=n!==""&&!u(s.dataset.search).includes(n)})}function Lt(e){const t=Number(e.selectionStart),s=e.value.slice(0,t).match(/(?:^|\s)@([^@\n]*)$/);if(!s)return null;const r=s[1];return{query:r,start:t-r.length-1,end:t}}function _s(e,t,n){n?.preventDefault(),n?.stopPropagation();const s=e.closest(".comment-composer"),r=s?.querySelector(".comment-input"),i=s?.querySelector(".mention-menu"),a=S.get(Number(t));if(!s||!r||!a)return;const c=Lt(r),l=`@${a.label}`;if(c)r.setRangeText(`${l} `,c.start,c.end,"end");else{const d=r.value&&!/\s$/.test(r.value)?" ":"";r.setRangeText(`${d}${l} `,r.selectionStart,r.selectionEnd,"end")}s._selectedMentions||(s._selectedMentions=new Map),s._selectedMentions.set(a.id,{id:a.id,name:a.label,email:a.email||""}),Pe(s),i&&(i.hidden=!0),r.focus(),K(r)}function Pe(e){const t=e.querySelector(".comment-selected-mentions");if(!t)return;const n=Array.from(e._selectedMentions?.values?.()||[]);t.innerHTML=n.map(s=>`
        <span class="selected-mention-chip">
            @${f(s.name)}
            <button
                type="button"
                onclick="retirerMentionCommentaire(this, ${Number(s.id)}, event)"
                aria-label="Retirer ${m(s.name)}"
            >×</button>
        </span>
    `).join("")}function Bs(e,t,n){n?.preventDefault(),n?.stopPropagation();const s=e.closest(".comment-composer"),r=s?.querySelector(".comment-input"),i=S.get(Number(t));if(s?._selectedMentions?.delete(Number(t)),r&&i){const a=`@${i.label}`;r.value=r.value.replaceAll(a,"").replace(/[ \t]{2,}/g," ").trimStart(),K(r)}s&&Pe(s)}function Rt(e,t){return e.length===0?'<div class="section-empty">Aucun commentaire</div>':e.map(n=>`
        <article
            class="comment-card"
            data-comment-id="${m(n.id)}"
        >
            <div class="comment-header">
                <strong>${f(n.author===W?"Nom Grist non configuré":n.author||"Anonyme")}</strong>
                <span>${f(Ue(n.createdAt))}</span>
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
                ${Us(n)}
            </div>
        </article>
    `).join("")}function Us(e){let t=f(e.text).replace(/\n/g,"<br>");return Dt(e.mentions).sort((s,r)=>r.name.length-s.name.length).forEach(s=>{const r=f(`@${s.name}`),i=`
            <span
                class="comment-mention"
                title="${m(s.email||s.name)}"
            >${r}</span>
        `;t=t.split(r).join(i)}),t}function X(e){const t=u(e).trim();if(!t)return[];try{const n=JSON.parse(t);if(!Array.isArray(n))throw new Error("Format non tableau");return n.map((s,r)=>({id:u(s?.id)||`legacy-${r}`,author:u(s?.author)||"Anonyme",createdAt:u(s?.createdAt),text:u(s?.text),mentions:Dt(s?.mentions)})).filter(s=>s.text.trim())}catch{return[{id:"legacy-text",author:"Ancien commentaire",createdAt:"",text:t,mentions:[]}]}}function Dt(e){return _(e).map(t=>({id:Number(t?.id)||0,name:u(t?.name||t?.label).trim(),email:jt(t?.email)})).filter(t=>t.name)}async function Js(e,t,n){n?.preventDefault(),n?.stopPropagation();const r=t.closest(".comments-section")?.querySelector(".comment-composer"),i=r?.querySelector(".comment-input"),a=u(i?.value).trim();if(!a){N("comments",e,"error","Écrivez un commentaire."),i?.focus();return}const c=Array.from(r?._selectedMentions?.values?.()||[]).filter(d=>a.includes(`@${d.name}`));t.disabled=!0,N("comments",e,"saving","Enregistrement…");const l={id:B(),author:W,createdAt:new Date().toISOString(),text:a,mentions:c};try{const p=(await Mt(e,h=>[...h,l])).find(h=>h.id===l.id);if(!p||p.author===W)throw new Error("La formule user.Name n’a pas remplacé le nom temporaire.");if(i&&(i.value="",K(i)),r){r._selectedMentions=new Map,Pe(r);const h=r.querySelector(".mention-menu");h&&(h.hidden=!0)}qe(e);const b=p.mentions.length,v=b>0?`Commentaire ajouté par ${p.author}. ${b} mention(s) visuelle(s), sans envoi d’e-mail.`:`Commentaire ajouté par ${p.author}.`;N("comments",e,"saved",v)}catch(d){console.error("Erreur pendant l’ajout du commentaire :",d),qe(e),N("comments",e,"error",u(d?.message)||"Impossible d’ajouter le commentaire.")}finally{t.disabled=!1}}async function js(e,t,n){n?.preventDefault(),n?.stopPropagation();try{N("comments",e,"saving","Suppression…"),await Mt(e,s=>s.filter(r=>r.id!==t)),qe(e),N("comments",e,"saved","Commentaire supprimé.")}catch(s){console.error("Erreur pendant la suppression du commentaire :",s),N("comments",e,"error","Impossible de supprimer le commentaire.")}}async function Mt(e,t){const n=Number(e),r=(oe.get(n)||Promise.resolve()).catch(()=>{}).then(async()=>{const i=g(n),a=X(i?.COMMENTAIRES),c=t(a),l=JSON.stringify(c),d=Oe();await o.updateRecords(o.formatRecord(n,{COMMENTAIRES:l,...d}));const p=await Hs(n);return i&&(i.COMMENTAIRES=JSON.stringify(p)),p}).finally(()=>{oe.get(n)===r&&oe.delete(n)});return oe.set(n,r),r}async function Hs(e){const t=o.map?.COMMENTAIRES;if(!t||Array.isArray(t))throw new Error("La colonne Commentaires n’est pas correctement mappée.");const n=await mt(e,t),s=X(n),r=g(e);return r&&(r.COMMENTAIRES=u(n)),s}function qe(e){const t=g(e),n=X(t?.COMMENTAIRES),s=document.getElementById(`comments-list-${Number(e)}`),r=s?.closest(".comments-section");s&&(s.innerHTML=Rt(n,e));const i=r?.querySelector(".detail-section-header p");i&&(i.textContent=`${n.length} commentaire(s)`)}async function $(e,t,n,s){s?.stopPropagation();try{t==="STATUT"&&xe(n)?.useconfetti&&tr();const r={[t]:n,...t==="DERNIERE_MISE_A_JOUR"||t==="MODIFIE_PAR"?{}:Oe()};await o.updateRecords(o.formatRecord(e,r));const i=g(e);i&&(i[t]=n,r.DERNIERE_MISE_A_JOUR&&(i.DERNIERE_MISE_A_JOUR=r.DERNIERE_MISE_A_JOUR),r.MODIFIE_PAR&&(i.MODIFIE_PAR=r.MODIFIE_PAR))}catch(r){throw console.error(y("Error during update:"),r),r}}function Oe(){const e={};return o.map?.DERNIERE_MISE_A_JOUR&&!o.col.DERNIERE_MISE_A_JOUR.getIsFormula()&&(e.DERNIERE_MISE_A_JOUR=new Date().toISOString()),o.map?.MODIFIE_PAR&&!o.col.MODIFIE_PAR.getIsFormula()&&(e.MODIFIE_PAR=W),e}async function Pt(e){const t=Oe();if(Object.keys(t).length!==0)try{await o.updateRecords(o.formatRecord(e,t));const n=g(e);n&&Object.assign(n,t)}catch(n){console.warn("Données enregistrées, mais informations de suivi non modifiées :",n)}}async function Ks(e){try{const t={DESCRIPTION:"",STATUT:e};o.map?.DERNIERE_MISE_A_JOUR&&!o.col.DERNIERE_MISE_A_JOUR.getIsFormula()&&(t.DERNIERE_MISE_A_JOUR=new Date().toISOString()),o.map?.CREE_LE&&!o.col.CREE_LE.getIsFormula()&&(t.CREE_LE=new Date().toISOString()),o.map?.COMMENTAIRES&&!o.col.COMMENTAIRES.getIsFormula()&&(t.COMMENTAIRES="[]"),o.map?.CHECKLIST&&!o.col.CHECKLIST.getIsFormula()&&(t.CHECKLIST="[]"),o.map?.LIENS&&!o.col.LIENS.getIsFormula()&&(t.LIENS="[]"),o.map?.ORDRE&&!o.col.ORDRE.getIsFormula()&&(t.ORDRE=Qs(e));const n=await o.createRecords({fields:t});if(n?.id>0){grist.setCursorPos({rowId:n.id});const s=await o.fetchSelectedRecord(n.id);o.opt.hideedit||V(s)}}catch(t){console.error(y("Error on creation:"),t)}}async function zs(e,t){if(t?.stopPropagation(),!(o.opt.confirmdelete!==!1&&!confirm(y("Are you sure you want to delete this task?"))))try{await o.destroyRecords(e),Y()}catch(n){console.error(y("Error on delete:"),n)}}function Y(){const e=document.getElementById("popup-todo");!e||e.querySelector(".notes-field.is-editing.is-dirty")&&!window.confirm("Les modifications des notes ne sont pas enregistrées. Fermer quand même ?")||(F(e.dataset.currentTodo)?.classList.remove("active"),q(),e.classList.remove("visible"),qt())}function Ws(e,t){if(t?.stopPropagation(),!e)return;e.classList.toggle("collapsed");const n=e.querySelector(".titre-statut")?.childNodes?.[0]?.textContent?.trim()||e.id;localStorage.setItem(xt(n),String(e.classList.contains("collapsed")))}function K(e){e&&(e.style.height="",e.style.height=`${Math.max(e.scrollHeight,42)}px`)}function qt(e=null){document.querySelectorAll(".multi-dropdown[open], .checklist-assignees[open]").forEach(t=>{t!==e&&t.removeAttribute("open")})}document.addEventListener("keydown",e=>{if(e.key!=="Escape")return;if(document.getElementById("attachment-viewer")?.classList.contains("visible")){wt(e);return}const n=document.querySelector(".multi-dropdown[open], .checklist-assignees[open]");if(n){n.removeAttribute("open");return}if(document.querySelector(".task-action-panel:not([hidden])")){q(e);return}Y()}),document.addEventListener("click",e=>{const t=e.target.closest(".multi-dropdown, .checklist-assignees");o?.opt?.autoclosemenus!==!1&&qt(t);const n=document.getElementById("popup-todo");if(!n?.classList.contains("visible"))return;e.target.closest(".task-action-panel, .task-quick-button")||q();const r=n.contains(e.target),i=!!e.target.closest(".carte"),a=!!e.target.closest("#attachment-viewer");!r&&!i&&!a&&Y()});function g(e){return M.find(t=>Number(t.id)===Number(e))||null}function F(e){return Array.from(document.querySelectorAll(".carte")).find(t=>Number(t.dataset.todoId)===Number(e))||null}function Ot(e){return{addbutton:!1,isdone:!1,useconfetti:!1,hidecolumn:!1,...(Array.isArray(o.opt?.columns)?o.opt.columns:[])[e]||{}}}function xe(e){const n=(o.valuesList?.columns||[]).indexOf(e);return n>=0?Ot(n):null}function xt(e){return`column-todo-${u(e)}`}function Qs(e){const t=M.filter(n=>u(n.STATUT)===u(e)).map(n=>Number(n.ORDRE)).filter(Number.isFinite);return t.length>0?Math.max(...t)+1e3:1e3}function Fe(e,t){const n=Jt(e?.[`${t}_id`]);if(n.length>0)return n;const s=Z(e?.[t]).filter(i=>i!=="#KeyError"),r=[...T];return s.flatMap(i=>{const a=r.findIndex(l=>l.label===i);if(a<0)return[];const[c]=r.splice(a,1);return[c.id]})}function Ft(e,t){const n=Fe(e,t);return n.length>0?n.map(s=>S.get(s)).filter(Boolean):Z(e?.[t]).filter(s=>s!=="#KeyError").map(s=>({id:0,label:s,initials:Xe(s),avatarColor:Ye(s)}))}function Vs(e){return Fe(e,"MEMBRES")}function _t(e){return Ft(e,"MEMBRES")}function Gs(e){return Fe(e,"RESPONSABLE")}function Bt(e){return Ft(e,"RESPONSABLE")}function _e(e){const t=Jt(e?.ETIQUETTES_id);if(t.length>0)return t;const n=Z(e?.ETIQUETTES).filter(r=>r!=="#KeyError"),s=[...J];return n.flatMap(r=>{const i=s.findIndex(c=>c.label===r);if(i<0)return[];const[a]=s.splice(i,1);return[a.id]})}function Ut(e){const t=_e(e);return t.length>0?t.map(n=>P.get(n)).filter(Boolean):Z(e?.ETIQUETTES).filter(n=>n!=="#KeyError").map(n=>{const s=Ze(n);return{id:0,label:n,color:s,textColor:et(s)}})}function Jt(e){return w(e)}function w(e){let t=_(e);return t[0]==="L"?t=t.slice(1):t[0]==="r"&&(t=_(t[2])),[...new Set(t.flatMap(n=>Array.isArray(n)?n:[n]).map(Number).filter(n=>Number.isInteger(n)&&n>0))]}function Z(e){let t=_(e);return t[0]==="L"&&(t=t.slice(1)),[...new Set(t.flatMap(n=>Array.isArray(n)?n:[n]).map(u).map(n=>n.trim()).filter(Boolean))]}function _(e){return e==null||e===""?[]:Array.isArray(e)?e:[e]}function u(e){return e==null?"":String(e)}function jt(e){const t=u(e).trim().toLowerCase();return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t)?t:""}function Xs(e){const t=[],n=o.map?.CREE_LE&&e.CREE_LE?Ue(e.CREE_LE):"",s=o.map?.CREE_PAR?u(e.CREE_PAR).trim():"";if(n||s){const c=["Créé"];n&&c.push(`le ${n}`),s&&c.push(`par ${s}`),t.push(`<div>${f(c.join(" "))}</div>`)}const r=o.map?.DERNIERE_MISE_A_JOUR&&e.DERNIERE_MISE_A_JOUR?Ue(e.DERNIERE_MISE_A_JOUR):"",i=o.map?.MODIFIE_PAR?u(e.MODIFIE_PAR).trim():"",a=i===W?"Nom Grist non configuré":i;if(r||a){const c=["Modifié"];r&&c.push(`le ${r}`),a&&c.push(`par ${a}`),t.push(`<div>${f(c.join(" "))}</div>`)}return t.join("")}function N(e,t,n,s){const r=document.getElementById(`${e}-status-${Number(t)}`);r&&(r.className=`section-status${n?` ${n}`:""}`,r.textContent=s)}function Be(e){if(!e)return"";const t=new Date(e);if(Number.isNaN(t.getTime())||t>=z)return"";const n=String(t.getDate()).padStart(2,"0"),s=t.toLocaleDateString(o.cultureFull,{month:"short"});return`${n} ${s} ${t.getFullYear()}`}function Ue(e){if(!e)return"";const t=new Date(e);return Number.isNaN(t.getTime())?"":t.toLocaleString(o.cultureFull,{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}function Ys(e){if(!e)return"";const t=new Date(e);return Number.isNaN(t.getTime())||t>=z?"":t.toISOString().split("T")[0]}function Ht(e){if(!e)return"";const t=new Date(e);return Number.isNaN(t.getTime())?u(e):t.toISOString()}function pe(e){if(!e)return null;const t=new Date(e).getTime();return Number.isNaN(t)?null:t}function fe(e,t){return pe(e)??t}function Zs(e){const t=Number(e)||0;if(t<=0)return"";const n=["o","Ko","Mo","Go"],s=Math.min(Math.floor(Math.log(t)/Math.log(1024)),n.length-1);return`${(t/1024**s).toFixed(s===0?0:1)} ${n[s]}`}function Kt(e){const t=u(e).match(/(\.[^.]+)$/);return t?t[1]:""}function B(){return globalThis.crypto?.randomUUID?crypto.randomUUID():`comment-${Date.now()}-${Math.random().toString(16).slice(2)}`}function f(e){return u(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function m(e){return f(e).replace(/`/g,"&#096;")}function E(e){return u(e).replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/\r/g,"\\r").replace(/\n/g,"\\n")}function er(e){return encodeURIComponent(u(e)).replace(/'/g,"%27")}function tr(){if(typeof confetti!="function")return;const e=2e3,t=Date.now()+e,n={startVelocity:30,spread:360,ticks:60,zIndex:1500},s=(i,a)=>Math.random()*(a-i)+i,r=window.setInterval(()=>{const i=t-Date.now();if(i<=0){window.clearInterval(r);return}const a=50*(i/e);confetti({...n,particleCount:a,origin:{x:s(.1,.3),y:Math.random()-.2}}),confetti({...n,particleCount:a,origin:{x:s(.7,.9),y:Math.random()-.2}})},250)}window.toggleColonne=Ws,window.togglePopupTodo=V,window.fermerPopup=Y,window.mettreAJourChamp=$,window.creerNouvelleTache=Ks,window.supprimerTodo=zs,window.mettreAJourChampPersonnes=ut,window.filtrerOptionsMultiples=Zn,window.viderChampPersonnes=es,window.mettreAJourEtiquettes=Te,window.viderEtiquettes=ns,window.retirerEtiquetteActive=ss,window.ouvrirPanneauFiche=st,window.fermerPanneauxFiche=q,window.filtrerPanneauFiche=In,window.mettreAJourTitreFiche=Tn,window.mettreAJourProprieteFiche=Ln,window.enregistrerEtiquettesDepuisPanneau=Rn,window.retirerEtiquetteFiche=Dn,window.basculerRolePersonnePanneau=Mn,window.enregistrerEquipeDepuisPanneau=qn,window.gererCreationChecklistClavier=On,window.ajouterChecklistAvecTitre=rt,window.mettreAJourCouleurFiche=xn,window.ouvrirDateChecklist=ds,window.ouvrirAjoutItemChecklist=ms,window.fermerAjoutItemChecklist=ps,window.gererAjoutItemChecklistClavier=fs,window.ajouterItemChecklist=vt,window.renommerChecklist=hs,window.mettreAJourItemChecklist=bs,window.mettreAJourAssignationsItemChecklist=gs,window.supprimerItemChecklist=vs,window.supprimerChecklist=Es,window.filtrerOptionsChecklist=us,window.ajouterLienFiche=ks,window.retirerLienFiche=ws,window.declencherSelecteurPiecesJointes=$s,window.ajouterPiecesJointes=Is,window.retirerPieceJointe=Ts,window.ouvrirPieceJointe=Ls,window.fermerLecteurPieceJointe=wt,window.ajouterCommentaire=Js,window.supprimerCommentaire=js,window.ajusterTextarea=K,window.previsualiserCouleur=Gn,window.mettreAJourCouleur=lt,window.reinitialiserCouleur=Xn,window.activerEditionNotes=_n,window.annulerEditionNotes=Bn,window.enregistrerEtFermerNotes=Un,window.appliquerFormatBlocNotes=jn,window.appliquerCommandeNotes=Hn,window.appliquerBaliseSelectionNotes=Kn,window.creerLienNotes=at,window.nettoyerCollageNotes=zn,window.marquerNotesModifiees=L,window.mettreAJourEtatBarreNotes=j,window.gererRaccourcisNotes=Wn,window.ouvrirMenuMentions=qs,window.fermerMenuMentions=Os,window.gererSaisieMention=xs,window.gererTouchesMention=Fs,window.selectionnerMentionCommentaire=_s,window.retirerMentionCommentaire=Bs}));
