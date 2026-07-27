(function(o){typeof define=="function"&&define.amd?define(o):o()})((function(){"use strict";let o,N;const j=new Date("3000-01-01"),le="#DCDCDC",Te="#000000",wt=120*1e3,Dt=50*1024*1024,J="__GRIST_USER_NAME__",p={records:[],people:{items:[],byId:new Map,loadedFor:null},labels:{items:[],byId:new Map,loadedFor:null},attachments:{meta:new Map,metaLoaded:!1,readToken:null,readTokenAt:0},notesTimers:new Map,config:{saveTimer:null,saving:!1}},E={people:new Map,checklists:new Map,links:new Map,comments:new Map,notes:new Map},Rt=Object.freeze({"vert clair":{background:"#BAF3DB",text:"#000000"},"jaune clair":{background:"#F5E989",text:"#000000"},"orange clair":{background:"#FCE4A6",text:"#000000"},"rouge clair":{background:"#FFD5D2",text:"#000000"},"violet clair":{background:"#EED7FC",text:"#000000"},"bleu clair":{background:"#CFE1FD",text:"#000000"},"bleu ciel clair":{background:"#C6EDFB",text:"#000000"},"vert citron clair":{background:"#D3F1A7",text:"#000000"},"rose clair":{background:"#FDD0EC",text:"#000000"},"noir clair":{background:"#DDDEE1",text:"#000000"},vert:{background:"#4BCE97",text:"#000000"},jaune:{background:"#EED12B",text:"#000000"},orange:{background:"#FCA700",text:"#000000"},rouge:{background:"#F87168",text:"#000000"},violet:{background:"#C97CF4",text:"#000000"},bleu:{background:"#669DF1",text:"#000000"},"bleu ciel":{background:"#6CC3E0",text:"#000000"},"vert citron":{background:"#94C748",text:"#000000"},rose:{background:"#E774BB",text:"#000000"},noir:{background:"#8C8F97",text:"#000000"}});window.addEventListener("load",async()=>{o=new WidgetSDK,N=await o.loadTranslations(["widget.js"]),o.configureOptions([WidgetSDK.newItem("columns",null,"Colonnes du Kanban","Réglez le comportement de chaque statut.","1 — Colonnes",{columnId:"STATUT",template:[WidgetSDK.newItem("addbutton",!0,"Autoriser l’ajout","Afficher un bouton pour créer une carte dans cette colonne."),WidgetSDK.newItem("isdone",!1,"Colonne terminée","Considérer les cartes de cette colonne comme terminées."),WidgetSDK.newItem("useconfetti",!1,"Confettis","Afficher des confettis lorsqu’une carte arrive dans cette colonne."),WidgetSDK.newItem("hidecolumn",!1,"Masquer la colonne","Ne pas afficher cette colonne dans le Kanban.")]}),WidgetSDK.newItem("cardrotation",!1,"Inclinaison des cartes","Incliner légèrement les cartes. Désactivé par défaut.","2 — Affichage des cartes"),WidgetSDK.newItem("compact",!1,"Mode compact","Réduire les espacements et la hauteur des cartes.","2 — Affichage des cartes"),WidgetSDK.newItem("showlabels",!0,"Afficher les étiquettes","Afficher les étiquettes colorées sur les cartes.","2 — Affichage des cartes"),WidgetSDK.newItem("showmembers",!0,"Afficher les membres","Afficher les bulles d’initiales des membres sur les cartes.","2 — Affichage des cartes"),WidgetSDK.newItem("showresponsables",!0,"Afficher les responsables","Afficher les responsables avec une bordure renforcée sur les cartes.","2 — Affichage des cartes"),WidgetSDK.newItem("showdeadline",!0,"Afficher l’échéance","Afficher la date limite sur les cartes.","2 — Affichage des cartes"),WidgetSDK.newItem("showindicators",!0,"Afficher les indicateurs","Afficher le nombre de pièces jointes et de commentaires.","2 — Affichage des cartes"),WidgetSDK.newItem("showchecklistprogress",!0,"Afficher la progression checklist","Afficher le nombre d’éléments cochés sur les cartes.","2 — Affichage des cartes"),WidgetSDK.newItem("defaultcardcolor","#FFFFD1","Couleur par défaut","Couleur utilisée lorsqu’aucune couleur personnalisée n’est enregistrée.","2 — Affichage des cartes"),WidgetSDK.newItem("showchecklist",!0,"Checklist","Afficher la checklist avancée dans la fiche.","3 — Fiche descriptive"),WidgetSDK.newItem("showattachments",!0,"Pièces jointes","Afficher la section des pièces jointes dans la fiche.","3 — Fiche descriptive"),WidgetSDK.newItem("showcomments",!0,"Commentaires","Afficher la section des commentaires dans la fiche.","3 — Fiche descriptive"),WidgetSDK.newItem("showmetadata",!0,"Informations de suivi","Afficher les lignes « Créé le » et « Modifié le » en bas de la fiche.","3 — Fiche descriptive"),WidgetSDK.newItem("autoclosemenus",!0,"Fermer les menus automatiquement","Fermer les sélecteurs multiples lorsqu’on clique ailleurs.","3 — Fiche descriptive"),WidgetSDK.newItem("readonly",!1,"Lecture seule","Désactiver toutes les modifications depuis le widget.","4 — Comportement"),WidgetSDK.newItem("hideedit",!1,"Masquer la fiche","Ne pas ouvrir la fiche descriptive lors d’un clic sur une carte.","4 — Comportement"),WidgetSDK.newItem("gristeditcard",!1,"Double-clic vers la fiche Grist","Ouvrir la fiche native de Grist lors d’un double-clic.","4 — Comportement"),WidgetSDK.newItem("archivestatus","Archives","Liste d’archives","Nom du statut dans lequel déplacer les cartes archivées.","4 — Comportement")],"#config-view","#main-view",{onOptChange:fe,onOptLoad:fe}),o.initMetaData(),o.ready({requiredAccess:"full",allowSelectBy:!0,columns:[{name:"STATUT",title:"Statut",description:"Colonne du Kanban",type:"Choice",strictType:!0},{name:"DESCRIPTION",title:"Nom de la tâche",description:"Nom principal de la tâche",type:"Any"},{name:"DESCRIPTION_DISPLAY",title:"Affichage de la tâche",description:"Contenu personnalisé facultatif affiché sur la carte",type:"Any",optional:!0},{name:"NOTES",title:"Notes",description:"Notes enrichies enregistrées en HTML sécurisé",type:"Text",strictType:!0,optional:!0},{name:"DEADLINE",title:"Échéance",description:"Date limite de la carte",type:"Date",optional:!0},{name:"ORDRE",title:"Ordre manuel",description:"Nombre utilisé pour conserver exactement la position des cartes",type:"Numeric",strictType:!0,optional:!0},{name:"MEMBRES",title:"Membres",description:"Toutes les personnes qui participent à la carte",type:"RefList",strictType:!0,optional:!0},{name:"RESPONSABLE",title:"Responsables",description:"Responsables principaux de la carte",type:"RefList",strictType:!0,optional:!0},{name:"ETIQUETTES",title:"Étiquettes",description:"Étiquettes multiples référencées depuis une table dédiée",type:"RefList",strictType:!0,optional:!0},{name:"CHECKLIST",title:"Checklist",description:"Checklists titrées stockées en JSON",type:"Text",strictType:!0,optional:!0},{name:"PIECES_JOINTES",title:"Pièces jointes",description:"Fichiers et images associés à la tâche",type:"Attachments",strictType:!0,optional:!0},{name:"LIENS",title:"Liens",description:"Liens avec texte d’affichage stockés en JSON",type:"Text",strictType:!0,optional:!0},{name:"COMMENTAIRES",title:"Commentaires",description:"Commentaires du widget stockés en JSON",type:"Text",strictType:!0,optional:!0},{name:"COULEUR",title:"Couleur de carte",description:"Code hexadécimal choisi depuis le widget",type:"Text",strictType:!0,optional:!0},{name:"CREE_PAR",title:"Créé par",type:"Any",optional:!0},{name:"CREE_LE",title:"Date de création",type:"DateTime",optional:!0},{name:"DERNIERE_MISE_A_JOUR",title:"Dernière mise à jour",description:"Date technique affichée dans le suivi",type:"DateTime",optional:!0},{name:"MODIFIE_PAR",title:"Modifié par",description:"Nom de la dernière personne ayant modifié la tâche",type:"Text",strictType:!0,optional:!0}]}),o.onRecords(q,{expandRefs:!1,keepEncoded:!1,mapRef:!0}),o.isLoaded().then(()=>{o.initDone=!0}),grist.on("message",async e=>{e.mappingsChange&&await qt()}),us(),xt()});async function we(e=!1){const t=o?.map?.MEMBRES?"MEMBRES":o?.map?.RESPONSABLE?"RESPONSABLE":null;if(!t||!o?.col?.[t]){ue();return}const n=o.col[t],s=`${t}:${n.type}:${n.visibleCol}`;if(!(!e&&p.people.loadedFor===s&&p.people.items.length>0))try{const a=await Re(n),r=a.dataColumns,i=Le(r,["initiales","initiale","initials","abreviation","abréviation","sigle"])||Pe(r,a.visibleColumnId),c=i&&Array.isArray(a.table[i])?a.table[i]:[];p.people.items=a.ids.map((l,u)=>{const h=d(a.labels[u]).trim(),v=Lt(c[u])||Fe(h);return{id:Number(l),label:h,initials:v,avatarColor:xe(h||l)}}).filter(l=>Number.isInteger(l.id)&&l.id>0&&l.label&&l.label!=="#KeyError").sort((l,u)=>l.label.localeCompare(u.label,o?.cultureFull||"fr-FR",{sensitivity:"base"})),p.people.byId=new Map(p.people.items.map(l=>[l.id,l])),p.people.loadedFor=s}catch(a){ue(),console.error("Impossible de charger la table des membres :",a)}}function ue(){p.people.items=[],p.people.byId=new Map,p.people.loadedFor=null}async function De(e=!1){if(!o?.map?.ETIQUETTES||!o?.col?.ETIQUETTES){de();return}const t=o.col.ETIQUETTES,n=`${t.type}:${t.visibleCol}`;if(!(!e&&p.labels.loadedFor===n&&p.labels.items.length>0))try{const s=await Re(t),a=s.dataColumns,r=Le(a,["couleur","color","hex","codecouleur","code_couleur"])||Pe(a,s.visibleColumnId),i=r&&Array.isArray(s.table[r])?s.table[r]:[];p.labels.items=s.ids.map((c,l)=>{const u=d(s.labels[l]).trim(),h=d(i[l]).trim(),v=Mt(h),C=A(h),y=v?.background||C||Oe(u||c),$=v?.text||qe(y);return{id:Number(c),label:u,color:y,textColor:$,colorChoice:h}}).filter(c=>Number.isInteger(c.id)&&c.id>0&&c.label&&c.label!=="#KeyError").sort((c,l)=>c.label.localeCompare(l.label,o?.cultureFull||"fr-FR",{sensitivity:"base"})),p.labels.byId=new Map(p.labels.items.map(c=>[c.id,c])),p.labels.loadedFor=n}catch(s){de(),console.error("Impossible de charger la table des étiquettes :",s)}}function de(){p.labels.items=[],p.labels.byId=new Map,p.labels.loadedFor=null}async function Re(e){const[t,n]=d(e?.type).split(":");if(t!=="RefList"||!n||!e?.visibleCol)throw new Error("La colonne doit être une Liste de références avec une colonne visible configurée.");const[s,a]=await Promise.all([grist.docApi.fetchTable(n),e.getMeta(e.visibleCol)]),r=a?.colId;if(!r||!Array.isArray(s?.id)||!Array.isArray(s?.[r]))throw new Error(`La colonne visible de la table ${n} est introuvable.`);const i=Object.keys(s).filter(c=>Array.isArray(s[c])&&c!=="id"&&c!=="manualSort"&&!c.startsWith("gristHelper_"));return{tableId:n,table:s,ids:s.id,labels:s[r],visibleColumnId:r,dataColumns:i}}function Le(e,t){const n=new Set(t.map(Me));return e.find(s=>n.has(Me(s)))||null}function Pe(e,t){const n=e.indexOf(t);return n>=0&&e[n+1]||null}function Me(e){return d(e).normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]/gi,"").toLowerCase()}function Lt(e){return d(e).trim().replace(/\s+/g,"").slice(0,4).toUpperCase()}function Fe(e){const t=d(e).trim().split(/\s+/).filter(Boolean);return t.length===0?"?":t.length===1?t[0].slice(0,2).toUpperCase():`${t[0][0]||""}${t[t.length-1][0]||""}`.toUpperCase()}function xe(e){let t=0;for(const s of d(e))t=(t<<5)-t+s.charCodeAt(0),t|=0;return`hsl(${Math.abs(t)%360} 58% 42%)`}function Pt(e){return d(e).normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim().replace(/\s+/g," ").toLocaleLowerCase("fr-FR")}function Mt(e){const t=Pt(e);return Rt[t]||null}function Oe(e){let t=0;for(const s of d(e))t=(t<<5)-t+s.charCodeAt(0),t|=0;const n=Math.abs(t)%360;return Ft(n,62,72)}function Ft(e,t,n){t/=100,n/=100;const s=(1-Math.abs(2*n-1))*t,a=s*(1-Math.abs(e/60%2-1)),r=n-s/2;let i=0,c=0,l=0;return e<60?[i,c,l]=[s,a,0]:e<120?[i,c,l]=[a,s,0]:e<180?[i,c,l]=[0,s,a]:e<240?[i,c,l]=[0,a,s]:e<300?[i,c,l]=[a,0,s]:[i,c,l]=[s,0,a],`#${[i,c,l].map(u=>Math.round((u+r)*255).toString(16).padStart(2,"0")).join("")}`.toUpperCase()}function qe(e){const t=A(e)||"#DDE3EA",n=parseInt(t.slice(1,3),16),s=parseInt(t.slice(3,5),16),a=parseInt(t.slice(5,7),16);return(.2126*n+.7152*s+.0722*a)/255>.58?"#1F2937":"#FFFFFF"}async function pe(e=!1){if(!(p.attachments.metaLoaded&&!e)){p.attachments.meta=new Map,p.attachments.metaLoaded=!0;try{const t=await grist.docApi.fetchTable("_grist_Attachments");(Array.isArray(t?.id)?t.id:[]).forEach((s,a)=>{const r=Number(s);if(!Number.isInteger(r)||r<=0)return;const i=d(t.fileName?.[a])||`Pièce jointe ${r}`,c=d(t.fileExt?.[a])||$t(i),l=d(t.fileType?.[a]),u=Number(t.fileSize?.[a])||0;p.attachments.meta.set(r,{id:r,fileName:i,fileExt:c,fileType:l,fileSize:u,imageWidth:Number(t.imageWidth?.[a])||0,imageHeight:Number(t.imageHeight?.[a])||0})})}catch(t){console.warn("Métadonnées des pièces jointes indisponibles :",t)}}}async function q(e){p.records=Array.isArray(e)?e:[],await Promise.all([we(),De()]);const t=document.getElementById("conteneur-kanban");if(!t)return;t.innerHTML="";const n=await o.col.STATUT.getChoices();if(!Array.isArray(n)||n.length===0){t.innerHTML=`<div class="kanban-message">${f(N("No choice available in the Status column"))}</div>`;return}n.forEach((s,a)=>{const r=_t(s,a);r&&t.appendChild(r)}),p.records.forEach(s=>{const a=d(s.STATUT),r=Array.from(t.querySelectorAll(".contenu-colonne")).find(i=>i.dataset.statut===a);r&&r.insertBefore(Bt(s),r.firstChild)}),Kt(),document.querySelectorAll(".colonne-kanban").forEach(he)}function xt(){const e=document.getElementById("config-view");!e||e.dataset.autosaveInstalled==="true"||(e.dataset.autosaveInstalled="true",e.addEventListener("input",t=>{t.target.matches("input, textarea, select")&&me()}),e.addEventListener("change",t=>{t.target.matches("input, textarea, select")&&me()}),e.addEventListener("click",t=>{t.target.closest(".config-switch")&&window.setTimeout(me,0)}))}function me(){window.clearTimeout(p.config.saveTimer),X("saving","Sauvegarde…"),p.config.saveTimer=window.setTimeout(Ot,350)}async function Ot(){if(!(p.config.saving||!o?._parameters||!o?._config||o._config.style.display==="none")){p.config.saving=!0;try{o.opt=await o.readOptionValues(o._parameters,o._config,o.opt),await grist.widgetApi.setOption("options",JSON.parse(JSON.stringify(o.opt))),await fe(),X("saved","Enregistré"),window.setTimeout(()=>{X("","")},1400)}catch(e){console.error("Impossible de sauvegarder automatiquement la configuration :",e),X("error","Échec de la sauvegarde")}finally{p.config.saving=!1}}}function X(e,t){const n=document.getElementById("config-view");if(!n||n.style.display==="none")return;let s=n.querySelector(".config-autosave-status");!s&&t&&(s=document.createElement("div"),s.className="config-autosave-status",s.setAttribute("aria-live","polite"),n.appendChild(s)),s&&(s.className=`config-autosave-status${e?` ${e}`:""}`,s.textContent=t,s.hidden=!t)}async function fe(){await o.isMapped(),await q(p.records)}async function qt(){ue(),de(),p.attachments.metaLoaded=!1,p.attachments.readToken=null,await Promise.all([we(!0),De(!0)]),await q(p.records)}function _t(e,t){const n=vt(t);if(n.hidecolumn)return null;const s=d(e),a=document.createElement("section");a.className=`colonne-kanban${!n.addbutton&&!o.opt.compact?" colonne-nobouton":""}`,a.id=s,localStorage.getItem(Et(s))==="true"&&a.classList.add("collapsed");const r=o.col.STATUT.getColor(s)??le,i=o.col.STATUT.getTextColor(s)??Te,c=Is(s);return a.innerHTML=`
        <div class="entete-colonne" style="background-color:${r};color:${i}">
            <div class="titre-statut">${f(s)} <span class="compteur-colonne">(0)</span></div>
            <div class="actions-colonne">
                ${n.addbutton&&!o.opt.readonly?`<button type="button" class="bouton-ajouter-entete ${o.opt.compact?"compact":""}" onclick="creerNouvelleTache(decodeURIComponent('${c}'))" aria-label="${m(N("Add a new task"))}">+</button>`:""}
                <button type="button" class="bouton-toggle" onclick="toggleColonne(this.closest('.colonne-kanban'), event)" aria-label="Replier ou déplier">⇄</button>
            </div>
        </div>
        ${n.addbutton&&!o.opt.readonly?`<button type="button" class="bouton-ajouter ${o.opt.compact?"compact":""}" onclick="creerNouvelleTache(decodeURIComponent('${c}'))">+ ${f(N("Add a new task"))}</button>`:""}
        <div class="contenu-colonne" data-statut="${m(s)}" data-isdone="${n.isdone?"true":"false"}"></div>
    `,a}function Bt(e){const t=document.createElement("article"),n=o.opt.cardrotation===!0;t.className=`carte${n?"":" norotate"}${o.opt.compact?" compact":""}`,t.dataset.todoId=String(e.id),t.dataset.lastUpdate=Ct(e.DERNIERE_MISE_A_JOUR),t.dataset.deadline=Ct(e.DEADLINE),t.dataset.order=Qt(e.ORDRE),Ht(t,e.COULEUR);const s=e.DEADLINE?Ne(e.DEADLINE):"",a=Ce(e),r=$e(e),i=St(e),c=F(e.CHECKLIST).flatMap(V=>V.items||[]),l=c.filter(V=>V.done).length,u=k(e.PIECES_JOINTES).length,h=ne(e.LIENS).length,v=K(e.COMMENTAIRES).length,C=e.DESCRIPTION_DISPLAY?String(e.DESCRIPTION_DISPLAY):f(d(e.DESCRIPTION)||N("No description")),y=i.map(V=>Jt(V)).join(""),$=Ut(a,r),R=re(e.STATUT),T=oe(e.DEADLINE),G=T!==null&&T<Date.now()&&T<j.getTime(),L=o.opt.showlabels!==!1,Q=o.opt.showmembers!==!1,Ts=o.opt.showresponsables!==!1,ws=o.opt.showdeadline!==!1,Nt=o.opt.showindicators!==!1,Ds=o.opt.showchecklistprogress!==!1,It=(Q||Ts)&&$,Tt=`
        ${Ds&&c.length?`<span title="${l} élément(s) terminé(s) sur ${c.length}">☑ ${l}/${c.length}</span>`:""}
        ${Nt&&u+h?`<span title="${u} fichier(s) et ${h} lien(s)">📎 ${u+h}</span>`:""}
        ${Nt&&v?`<span title="${v} commentaire(s)">💬 ${v}</span>`:""}
    `;return t.innerHTML=`
        ${L&&y?`<div class="etiquettes-list">${y}</div>`:""}
        <div class="description">${C}</div>
        ${ws&&s?`<div class="deadline${G?" late":""} truncate">📅 ${f(s)}</div>`:""}
        ${It||Tt.trim()?`<div class="card-footer">
                <div class="card-indicators">${Tt}</div>
                ${It?`<div class="card-team-stack" aria-label="Équipe de la carte">${$}</div>`:""}
               </div>`:""}
        ${R?.isdone?`<div class="tampon-termine" style="color:${o.col.STATUT.getColor(e.STATUT)??le};">${f(d(e.STATUT))}</div>`:""}
    `,t.addEventListener("click",()=>{grist.setCursorPos({rowId:e.id}),o.opt.hideedit||Y(e)}),t.addEventListener("dblclick",()=>{grist.setCursorPos({rowId:e.id}),o.opt.gristeditcard?grist.commandApi.run("viewAsCard"):o.opt.hideedit||Y(e)}),t}function Ut(e,t){const n=new Set(t.map(i=>Number(i.id)).filter(i=>Number.isInteger(i)&&i>0)),s=[...t.map(i=>({...i,role:"responsable"})),...e.filter(i=>!n.has(Number(i.id))).map(i=>({...i,role:"membre"}))],a=s.slice(0,6),r=s.length-a.length;return[...a.map(i=>jt(i,i.role)),r>0?`<span class="card-team-more" title="${r} autre(s) membre(s)">+${r}</span>`:""].join("")}function jt(e,t="membre"){const n=t==="responsable",s=n?"Responsable":"Membre";return`
        <span
            class="responsable-avatar ${n?"responsable-avatar-principal":"membre-avatar"}"
            style="background:${m(e.avatarColor)}"
            title="${m(`${s} : ${e.label}`)}"
            aria-label="${m(`${s} : ${e.label}`)}"
        >${f(e.initials)}</span>
    `}function Jt(e){return`
        <span
            class="etiquette-badge"
            style="background:${m(e.color)};color:${m(e.textColor)}"
            title="${m(e.colorChoice?`${e.label} — ${e.colorChoice}`:e.label)}"
        >${f(e.label)}</span>
    `}function Ht(e,t){const n=A(t)||A(o.opt?.defaultcardcolor)||"#FFFFD1";e.style.backgroundColor=n}function Kt(){document.querySelectorAll(".contenu-colonne").forEach(e=>{Gt(e),!(o.opt.readonly||typeof Sortable!="function")&&new Sortable(e,{group:"kanban-todo",animation:150,ghostClass:"carte-fantome",chosenClass:"carte-selectionnee",onEnd:async t=>{const n=t.to.dataset.statut,s=t.from.dataset.statut,a=Number(t.item.dataset.todoId),r=Array.from(t.to.querySelectorAll(".carte")).map(c=>Number(c.dataset.todoId)),i=t.from===t.to?[]:Array.from(t.from.querySelectorAll(".carte")).map(c=>Number(c.dataset.todoId));try{n!==s&&await x(a,"STATUT",n),o.map?.ORDRE&&!o.col.ORDRE.getIsFormula()?await zt(r,i):(await _e(t.to),t.from!==t.to&&await _e(t.from))}catch(c){console.error(N("Error during status update:"),c),await q(p.records)}he(t.to.closest(".colonne-kanban")),t.from!==t.to&&he(t.from.closest(".colonne-kanban"))}})})}async function zt(e,t=[]){const n=[],s=new Set;[e,t].forEach(a=>{const r=U(a).map(Number).filter(c=>Number.isInteger(c)&&c>0),i=r.join(",");r.length>0&&!s.has(i)&&(s.add(i),n.push(r))});for(const a of n)await Wt(a)}async function Wt(e){if(!o.map?.ORDRE||o.col.ORDRE.getIsFormula())return;const t=e.map((n,s)=>{const a=(s+1)*1e3,r=b(n),i=B(n);return r&&(r.ORDRE=a),i&&(i.dataset.order=String(a)),o.formatRecord(n,{ORDRE:a})});t.length>0&&await o.updateRecords(t)}async function _e(e){if(!o.map?.DEADLINE||!e)return;const n=Array.from(e.querySelectorAll(".carte")).filter(r=>{const i=oe(r.dataset.deadline);return i===null||i>=j.getTime()});if(n.length===0)return;let s=j.getFullYear();const a=n.map(r=>{const i=`${s}-01-01`;return s+=1,r.dataset.deadline=i,o.formatRecord(r.dataset.todoId,{DEADLINE:i})});await o.updateRecords(a)}function Gt(e){if(!e)return;const t=e.dataset.isdone==="true",n=Array.from(e.children);n.sort((s,a)=>{let r=0;return o.map?.ORDRE?r=Be(s.dataset.order)-Be(a.dataset.order):o.map?.DEADLINE&&(t?r=ce(a.dataset.lastUpdate,0)-ce(s.dataset.lastUpdate,0):r=ce(s.dataset.deadline,Number.MAX_SAFE_INTEGER)-ce(a.dataset.deadline,Number.MAX_SAFE_INTEGER)),r!==0?r:(Number(s.dataset.todoId)||0)-(Number(a.dataset.todoId)||0)}),n.forEach(s=>e.appendChild(s))}function Qt(e){const t=Number(e);return Number.isFinite(t)?String(t):""}function Be(e){const t=Number(e);return Number.isFinite(t)?t:Number.MAX_SAFE_INTEGER}function he(e){if(!e)return;const t=e.querySelector(".contenu-colonne"),n=e.querySelector(".compteur-colonne");t&&n&&(n.textContent=`(${t.children.length})`)}async function Y(e){const t=document.getElementById("popup-todo");if(!t)return;if(o.opt.readonly){W();return}document.querySelector(".carte.active")?.classList.remove("active"),B(e.id)?.classList.add("active");const n=re(e.STATUT),s=await o.col.STATUT.getChoices(),a=o.col.STATUT.getColor(e.STATUT)??le,r=o.col.STATUT.getTextColor(e.STATUT)??Te;t.style.setProperty("--task-status-color",a),t.style.setProperty("--task-status-text",r),t.style.borderLeftColor="transparent",t.dataset.statut=d(e.STATUT),t.dataset.isdone=n?.isdone?"true":"false",t.dataset.currentTodo=String(e.id);const i=t.querySelector(".popup-title"),c=t.querySelector(".popup-content"),l=t.querySelector(".popup-header"),u=t.querySelector(".bouton-fermer");if(i&&(i.textContent=""),l&&(l.style.backgroundColor="",l.style.color=""),u&&(u.style.color=""),!c)return;const h=o.map?.NOTES?o.col.NOTES.getIsFormula():!1,v=o.col.DESCRIPTION.getIsFormula(),C=rn(e),y=o.opt.showmetadata!==!1?Cs(e):"",$=o.map?.NOTES?Cn(e,h):"",R=o.map?.COMMENTAIRES&&o.opt.showcomments!==!1?ps(e):"",T=!!($||C.checklists||R),G=!!C.context;c.innerHTML=`
        <div class="task-detail-shell task-detail-v8" data-row-id="${Number(e.id)}">
            <section class="task-hero">
                <div class="task-hero-accent" aria-hidden="true"></div>
                <div class="task-hero-copy">
                    <div class="task-title-meta">
                        <label
                            class="task-status-selector"
                            style="--status-background:${m(a)};--status-color:${m(r)}"
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
                                ${s.map(L=>`
                                    <option
                                        value="${m(L)}"
                                        ${d(L)===d(e.STATUT)?"selected":""}
                                    >${f(d(L))}</option>
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
                        ${v?"disabled":""}
                    >${f(d(e.DESCRIPTION))}</textarea>
                </div>
            </section>

            <div class="task-actions-dock">
                ${Vt()}
            </div>
            ${Xt(e)}

            ${G?`
                <div class="task-inline-context" aria-label="Informations actives de la carte">
                    ${C.context}
                </div>
            `:""}

            ${T?`
                <main class="task-main-column task-main-column-full">
                    ${$}
                    ${C.checklists}
                    ${R}
                </main>
            `:""}

            ${y?`<div class="task-detail-metadata">${y}</div>`:""}

            <div class="popup-actions">
                <button
                    type="button"
                    class="popup-action-button bouton-archiver"
                    onclick="ouvrirPopupArchivage(${Number(e.id)}, event)"
                    title="Archiver la tâche"
                    aria-label="Archiver la tâche"
                >🗃️</button>
            </div>
        </div>
    `,c.querySelectorAll(".auto-expand").forEach(ae),t.classList.add("visible"),t.classList.remove("task-panel-open"),at(c),o.map?.PIECES_JOINTES&&k(e.PIECES_JOINTES).length>0&&await as(e.id)}function Vt(e){const t=!!(o.map?.CHECKLIST&&!o.col.CHECKLIST.getIsFormula()),n=!!(o.map?.MEMBRES&&!o.col.MEMBRES.getIsFormula()||o.map?.RESPONSABLE&&!o.col.RESPONSABLE.getIsFormula()),s=!!(o.map?.PIECES_JOINTES&&!o.col.PIECES_JOINTES.getIsFormula()||o.map?.LIENS&&!o.col.LIENS.getIsFormula());return`
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
    `}function Xt(e){return`
        <div class="task-action-layer">
            <div class="task-action-panels">${[Yt(),o.map?.ETIQUETTES?Zt(e):"",o.map?.DEADLINE?en(e):"",o.map?.CHECKLIST?tn(e):"",o.map?.MEMBRES||o.map?.RESPONSABLE?nn(e):"",o.map?.PIECES_JOINTES||o.map?.LIENS?sn(e):"",o.map?.COULEUR?an(e):""].filter(Boolean).join("")}</div>
        </div>
    `}function Yt(e){const t=[];return o.map?.ETIQUETTES&&t.push(["🏷️","Étiquettes","labels"]),o.map?.DEADLINE&&t.push(["📅","Dates","date"]),o.map?.CHECKLIST&&t.push(["☑","Checklist","checklist"]),(o.map?.MEMBRES||o.map?.RESPONSABLE)&&t.push(["👥","Membres","people"]),(o.map?.PIECES_JOINTES||o.map?.LIENS)&&t.push(["📎","Pièce jointe","resources"]),o.map?.COULEUR&&t.push(["🎨","Couleur de carte","color"]),`
        <section class="task-action-panel task-add-menu" data-panel="add" hidden>
            <div class="task-panel-heading">
                <div><strong>Ajouter à la carte</strong><span>Choisissez un élément</span></div>
                <button type="button" onclick="fermerPanneauxFiche(event)" aria-label="Fermer">×</button>
            </div>
            <div class="task-add-grid">
                ${t.map(([n,s,a])=>`
                    <button
                        type="button"
                        onclick="ouvrirPanneauFiche('${a}', event, true)"
                    ><span>${n}</span><strong>${f(s)}</strong></button>
                `).join("")||'<div class="section-empty">Aucun champ supplémentaire n’est mappé.</div>'}
            </div>
        </section>
    `}function Zt(e){const t=new Set(Ae(e)),n=o.col.ETIQUETTES.getIsFormula();return`
        <section class="task-action-panel" data-panel="labels" hidden>
            <div class="task-panel-heading">
                <div><strong>Étiquettes</strong><span>Sélectionnez les étiquettes actives</span></div>
                <button type="button" onclick="fermerPanneauxFiche(event)" aria-label="Fermer">×</button>
            </div>
            <div class="task-panel-search">
                <input type="search" placeholder="Rechercher une étiquette…" oninput="filtrerPanneauFiche(this)">
            </div>
            <div class="task-panel-options" data-row-id="${Number(e.id)}">
                ${p.labels.items.map(s=>`
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
    `}function en(e){const t=o.col.DEADLINE.getIsFormula();return`
        <section class="task-action-panel" data-panel="date" hidden>
            <div class="task-panel-heading">
                <div><strong>Date limite</strong><span>Ajoutez ou modifiez l’échéance de la carte</span></div>
                <button type="button" onclick="fermerPanneauxFiche(event)" aria-label="Fermer">×</button>
            </div>
            <div class="task-date-editor">
                <input
                    type="date"
                    value="${m(As(e.DEADLINE))}"
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
    `}function tn(e){const t=o.col.CHECKLIST.getIsFormula();return`
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
    `}function nn(e){const t=new Set(Ss(e)),n=new Set(ks(e)),s=!o.map?.MEMBRES||o.col.MEMBRES.getIsFormula(),a=!o.map?.RESPONSABLE||o.col.RESPONSABLE.getIsFormula(),r=[...p.people.items].sort((i,c)=>{const l=n.has(i.id)?0:t.has(i.id)?1:2,u=n.has(c.id)?0:t.has(c.id)?1:2;return l!==u?l-u:i.label.localeCompare(c.label,o.cultureFull,{sensitivity:"base"})});return`
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
                    ${t.size} membre(s)
                </span>
                <span data-team-count="RESPONSABLE">
                    ${n.size} responsable(s)
                </span>
            </div>

            <div class="task-people-roster">
                ${r.map(i=>{const c=t.has(i.id),l=n.has(i.id);return`
                        <article
                            class="task-person-card${c||l?" is-selected":""}"
                            data-search="${m(i.label.toLocaleLowerCase(o.cultureFull))}"
                            data-person-name="${m(i.label)}"
                        >
                            <div class="task-person-identity">
                                <span
                                    class="task-person-avatar"
                                    style="background:${m(i.avatarColor)}"
                                >${f(i.initials)}</span>

                                <span class="task-person-copy">
                                    <strong>${f(i.label)}</strong>
                                </span>
                            </div>

                            <div
                                class="task-person-role-actions"
                                aria-label="Rôles de ${m(i.label)}"
                            >
                                <button
                                    type="button"
                                    class="task-person-role-button task-person-role-member${c?" active":""}"
                                    data-role="MEMBRES"
                                    data-person-id="${i.id}"
                                    aria-pressed="${c?"true":"false"}"
                                    onclick="basculerRolePersonnePanneau(this, event)"
                                    ${s?"disabled":""}
                                >
                                    <span aria-hidden="true">👤</span>
                                    <strong>Membre</strong>
                                </button>

                                <button
                                    type="button"
                                    class="task-person-role-button task-person-role-responsable${l?" active":""}"
                                    data-role="RESPONSABLE"
                                    data-person-id="${i.id}"
                                    aria-pressed="${l?"true":"false"}"
                                    onclick="basculerRolePersonnePanneau(this, event)"
                                    ${a?"disabled":""}
                                >
                                    <span aria-hidden="true">◆</span>
                                    <strong>Responsable</strong>
                                </button>
                            </div>
                        </article>
                    `}).join("")||`
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
    `}function sn(e){const t=!!(o.map?.PIECES_JOINTES&&!o.col.PIECES_JOINTES.getIsFormula()),n=!!(o.map?.LIENS&&!o.col.LIENS.getIsFormula());return`
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
    `}function an(e){const t=A(e.COULEUR),n=t||A(o.opt?.defaultcardcolor)||"#FFFFD1",s=o.col.COULEUR.getIsFormula();return`
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
    `}function rn(e){const t=[],n=St(e),s=Ce(e),a=$e(e),r=A(e.COULEUR),i=F(e.CHECKLIST),c=k(e.PIECES_JOINTES),l=ne(e.LIENS);n.length>0&&t.push(on(e,n)),e.DEADLINE&&t.push(cn(e)),(s.length>0||a.length>0)&&t.push(Ue(e,s,a)),r&&t.push(ln(e,r));const u=[];return t.length>0&&u.push(`<div class="task-property-grid">${t.join("")}</div>`),(c.length>0||l.length>0)&&o.opt.showattachments!==!1&&u.push(es(e,c,l)),{context:u.join(""),checklists:i.length>0&&o.opt.showchecklist!==!1?qn(e,i):""}}function on(e,t){return`
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
    `}function cn(e){const t=oe(e.DEADLINE),n=t!==null&&t<Date.now();return`
        <button
            type="button"
            class="task-compact-meta task-compact-date${n?" is-late":""}"
            onclick="ouvrirPanneauFiche('date', event, true)"
            title="Modifier la date limite"
        >
            <span class="task-compact-meta-title">Date</span>
            <span class="task-compact-date-value">
                <span aria-hidden="true">📅</span>
                <strong>${f(Ne(e.DEADLINE))}</strong>
                ${n?"<small>En retard</small>":""}
            </span>
        </button>
    `}function Ue(e,t,n){const s=new Set(n.map(r=>Number(r.id)).filter(r=>Number.isInteger(r)&&r>0));return`
        <section class="task-compact-meta task-compact-team">
            <span class="task-compact-meta-title">Équipe</span>
            <div class="task-compact-team-avatars">
                ${[...n.map(r=>({...r,role:"responsable"})),...t.filter(r=>!s.has(Number(r.id))).map(r=>({...r,role:"membre"}))].map(r=>`
                    <span
                        class="task-compact-avatar${r.role==="responsable"?" is-responsable":""}"
                        style="background:${m(r.avatarColor)}"
                        title="${m(`${r.role==="responsable"?"Responsable":"Membre"} : ${r.label}`)}"
                    >${f(r.initials)}</span>
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
    `}function ln(e,t){return`
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
    `}function je(e,t,n=!1){t?.preventDefault(),t?.stopPropagation();const s=document.getElementById("popup-todo"),a=s?.querySelector(`.task-action-panel[data-panel="${e}"]`);if(!s||!a)return;const r=!a.hidden;if(s.querySelectorAll(".task-action-panel").forEach(i=>{i.hidden=!0}),s.querySelectorAll(".task-quick-button").forEach(i=>{i.classList.remove("active"),i.setAttribute("aria-expanded","false")}),!r||n){a.hidden=!1,s.classList.add("task-panel-open"),e==="people"&&yn(a);const i=s.querySelector(`[data-panel-trigger="${e}"]`);i?.classList.add("active"),i?.setAttribute("aria-expanded","true"),window.setTimeout(()=>{a.querySelector('input:not([type="checkbox"]):not([type="file"]), textarea, button')?.focus()},0)}else P(t)}function P(e){e?.preventDefault(),e?.stopPropagation();const t=document.getElementById("popup-todo");t?.querySelectorAll(".task-action-panel").forEach(n=>{n.hidden=!0}),t?.querySelectorAll(".task-quick-button").forEach(n=>{n.classList.remove("active"),n.setAttribute("aria-expanded","false")}),t?.classList.remove("task-panel-open")}function Je(e){return d(e).normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim().toLocaleLowerCase(o.cultureFull)}function un(e){const t=e?.closest(".task-action-panel");if(!t)return;const n=Je(e.value);t.querySelectorAll("[data-search]").forEach(s=>{const a=Je(s.dataset.search),r=n===""||a.includes(n);s.hidden=!r,s.style.display=r?"":"none"})}async function S(e,t=""){const n=document.getElementById("popup-todo"),a=n?.querySelector(".popup-content")?.scrollTop||0,r=b(e);if(!r)return;await Y(r);const i=n?.querySelector(".popup-content");i&&(i.scrollTop=a),t&&je(t,null,!0)}async function dn(e,t,n){n?.preventDefault(),n?.stopPropagation();const s=d(t?.value).trim(),a=b(e);if(!s||!a||s===d(a.STATUT))return;const r=d(a.STATUT);t.disabled=!0;try{re(s)?.useconfetti&&At();const c={STATUT:s,...z()};o.map?.ORDRE&&!o.col.ORDRE.getIsFormula()&&(c.ORDRE=Se(s)),await o.updateRecords(o.formatRecord(e,c)),Object.assign(a,c),await q(p.records),await S(e)}catch(i){console.error("Impossible de changer la liste de la carte :",i),t.value=r,t.disabled=!1}}async function pn(e,t,n){const s=d(t?.value).trim();await x(e,"DESCRIPTION",s,n);const a=B(e)?.querySelector(".description");a&&(a.textContent=s||N("No description"))}async function mn(e,t,n,s,a){const i=a?.target?.closest(".task-action-panel")?.querySelector(".task-panel-status");try{i&&(i.className="task-panel-status section-status saving",i.textContent="Enregistrement…"),await x(e,t,n,a),await S(e,s)}catch{i&&(i.className="task-panel-status section-status error",i.textContent="Impossible d’enregistrer.")}}async function fn(e,t,n){n?.stopPropagation();const s=t?.querySelector(".task-panel-status"),a=Array.from(t.querySelectorAll('input[type="checkbox"]:checked')).map(r=>Number(r.value)).filter(r=>p.labels.byId.has(r));try{s&&(s.className="task-panel-status section-status saving",s.textContent="Enregistrement…"),await Z(e,"ETIQUETTES",a),Ve(e,a),await S(e,"labels")}catch{s&&(s.className="task-panel-status section-status error",s.textContent="Impossible d’enregistrer les étiquettes.")}}async function hn(e,t,n){n?.preventDefault(),n?.stopPropagation();const s=b(e),a=Ae(s).filter(r=>r!==Number(t));await Z(e,"ETIQUETTES",a),Ve(e,a),await S(e)}async function bn(e,t){if(t?.preventDefault(),t?.stopPropagation(),!e||e.disabled)return;const n=e.closest(".task-action-panel"),s=e.closest(".task-person-card"),a=Number(e.dataset.personId),r=d(e.dataset.role),i=!e.classList.contains("active"),c=n?.querySelector(`.task-person-role-button[data-role="MEMBRES"][data-person-id="${a}"]`),l=n?.querySelector(`.task-person-role-button[data-role="RESPONSABLE"][data-person-id="${a}"]`);be(e,i),r==="RESPONSABLE"?be(c,i):r==="MEMBRES"&&!i&&l?.classList.contains("active")&&be(l,!1);const u=!!(c?.classList.contains("active")||l?.classList.contains("active"));s?.classList.toggle("is-selected",u),gn(n),await vn(Number(n?.dataset.rowId),n)}function be(e,t){!e||e.disabled||(e.classList.toggle("active",!!t),e.setAttribute("aria-pressed",t?"true":"false"))}function gn(e){e&&["MEMBRES","RESPONSABLE"].forEach(t=>{const n=e.querySelectorAll(`.task-person-role-button[data-role="${t}"].active`).length,s=e.querySelector(`[data-team-count="${t}"]`);s&&(s.textContent=t==="MEMBRES"?`${n} membre(s)`:`${n} responsable(s)`)})}async function vn(e,t){if(!Number.isInteger(Number(e))||!t)return;const n=Number(e),s=Array.from(t.querySelectorAll('.task-person-role-button[data-role="MEMBRES"].active')).map(u=>Number(u.dataset.personId)).filter(u=>Number.isInteger(u)&&p.people.byId.has(u)),a=Array.from(t.querySelectorAll('.task-person-role-button[data-role="RESPONSABLE"].active')).map(u=>Number(u.dataset.personId)).filter(u=>Number.isInteger(u)&&p.people.byId.has(u)),r=t.querySelector(".task-panel-status"),i=`team:${n}`,c=E.people.get(i)||Promise.resolve();r&&(r.className="task-panel-status task-people-live-status section-status saving",r.textContent="Enregistrement…");const l=c.catch(()=>{}).then(async()=>{o.map?.MEMBRES&&!o.col.MEMBRES.getIsFormula()&&(await Z(n,"MEMBRES",s),Qe(n,"MEMBRES",s)),o.map?.RESPONSABLE&&!o.col.RESPONSABLE.getIsFormula()&&(await Z(n,"RESPONSABLE",a),Qe(n,"RESPONSABLE",a)),En(n),r?.isConnected&&(r.className="task-panel-status task-people-live-status section-status saved",r.textContent="Équipe enregistrée.")}).catch(u=>{console.error("Impossible d’enregistrer l’équipe :",u),r?.isConnected&&(r.className="task-panel-status task-people-live-status section-status error",r.textContent="Impossible d’enregistrer l’équipe.")}).finally(()=>{E.people.get(i)===l&&E.people.delete(i)});E.people.set(i,l),await l}function En(e){const t=b(e),n=document.querySelector(`.task-detail-shell[data-row-id="${Number(e)}"]`);if(!t||!n)return;const s=Ce(t),a=$e(t),r=n.querySelector(".task-compact-team");if(s.length===0&&a.length===0){r?.remove();return}const i=document.createElement("div");i.innerHTML=Ue(t,s,a);const c=i.firstElementChild;if(r){r.replaceWith(c);return}let l=n.querySelector(".task-inline-context");l||(l=document.createElement("div"),l.className="task-inline-context",n.querySelector(".task-main-column-full")?.before(l));let u=l.querySelector(".task-property-grid");u||(u=document.createElement("div"),u.className="task-property-grid",l.prepend(u)),u.appendChild(c)}function yn(e){const t=e?.querySelector(".task-people-roster");if(!t)return;const n=Array.from(t.querySelectorAll(".task-person-card"));n.sort((s,a)=>{const r=l=>l.querySelector(".task-person-role-responsable.active")?0:l.querySelector(".task-person-role-member.active")?1:2,i=r(s),c=r(a);return i!==c?i-c:d(s.dataset.personName).localeCompare(d(a.dataset.personName),o.cultureFull,{sensitivity:"base"})}),n.forEach(s=>t.appendChild(s))}function Sn(e,t,n){n.key==="Enter"&&(n.preventDefault(),He(e,t,n))}async function He(e,t,n){n?.preventDefault(),n?.stopPropagation();const s=t.closest(".task-action-panel"),a=s?.querySelector(".new-checklist-title"),r=s?.querySelector(".task-panel-status"),i=d(a?.value).trim();if(!i){r&&(r.className="task-panel-status section-status error",r.textContent="Saisissez un titre."),a?.focus();return}await D(e,c=>[...c,{id:O(),title:i,items:[],createdAt:new Date().toISOString()}]),await S(e)}async function kn(e,t,n,s){const r=n?.closest(".task-action-panel")?.querySelector(".task-panel-status"),i=d(t).trim(),c=A(i);if(i&&!c){r&&(r.className="task-panel-status section-status error",r.textContent="Utilisez un code hexadécimal valide.");return}try{r&&(r.className="task-panel-status section-status saving",r.textContent="Enregistrement…"),await x(e,"COULEUR",c||null,s);const l=B(e);l&&(l.style.backgroundColor=c||A(o.opt?.defaultcardcolor)||"#FFFFD1"),await S(e,"color")}catch{r&&(r.className="task-panel-status section-status error",r.textContent="Impossible d’enregistrer la couleur.")}}function Cn(e,t){const n=Number(e.id),s=In(e.NOTES),a=Ge(s).trim().length>0,r=t?"disabled":"",i=[["bold","<strong>B</strong>","Gras"],["italic","<em>I</em>","Italique"],["underline","<u>U</u>","Souligné"],["strikeThrough","<s>S</s>","Barré"],["insertUnorderedList","• Liste","Liste à puces"],["insertOrderedList","1. Liste","Liste numérotée"],["insertHorizontalRule","―","Ligne de séparation"],["removeFormat","Tx","Effacer la mise en forme"],["undo","↶","Annuler"],["redo","↷","Rétablir"]].map(([c,l,u])=>`
        <button
            type="button"
            class="notes-tool"
            data-command="${c}"
            onmousedown="event.preventDefault()"
            onclick="appliquerCommandeNotes(this, '${c}', null, event)"
            title="${m(u)}"
            aria-label="${m(u)}"
            ${r}
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
                    ${r}
                >✏️ Modifier</button>
            </div>

            <div
                class="notes-display${a?"":" empty"}"
                tabindex="0"
            >${a?s:"Aucune note pour cette tâche."}</div>

            <div class="notes-edit-panel" hidden>
                <div class="notes-toolbar" role="toolbar" aria-label="Mise en forme des notes">
                    <label class="sr-only" for="notes-format-${n}">Style du paragraphe</label>
                    <select
                        id="notes-format-${n}"
                        class="notes-format-select"
                        onchange="appliquerFormatBlocNotes(this, event)"
                        title="Style du paragraphe"
                        ${r}
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
                        ${r}
                    >&lt;/&gt;</button>

                    <button
                        type="button"
                        class="notes-tool"
                        onmousedown="event.preventDefault()"
                        onclick="appliquerBaliseSelectionNotes(this, 'mark', event)"
                        title="Surligner"
                        aria-label="Surligner"
                        ${r}
                    >🖍</button>

                    <button
                        type="button"
                        class="notes-tool notes-tool-link"
                        onmousedown="event.preventDefault()"
                        onclick="creerLienNotes(this, event)"
                        title="Ajouter ou modifier un lien"
                        aria-label="Ajouter ou modifier un lien"
                        ${r}
                    >🔗 Lien</button>

                    <button
                        type="button"
                        class="notes-tool"
                        data-command="unlink"
                        onmousedown="event.preventDefault()"
                        onclick="appliquerCommandeNotes(this, 'unlink', null, event)"
                        title="Retirer le lien"
                        aria-label="Retirer le lien"
                        ${r}
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
    `}function $n(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".notes-field"),s=n?.querySelector(".notes-edit-panel"),a=n?.querySelector(".notes-display"),r=n?.querySelector(".notes-editor");!n||!s||!a||!r||n.dataset.disabled==="true"||(n._originalNotesHtml=H(r.innerHTML),n.classList.add("is-editing"),n.classList.remove("is-dirty"),a.hidden=!0,s.hidden=!1,e.hidden=!0,document.execCommand("defaultParagraphSeparator",!1,"p"),r.focus(),Pn(r),_(r),M(Number(n.dataset.rowId),"",""))}function An(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".notes-field"),s=n?.querySelector(".notes-editor");!n||!s||(s.innerHTML=n._originalNotesHtml||"",Ke(n,!1))}async function Nn(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".notes-field"),s=n?.querySelector(".notes-editor"),a=Number(n?.dataset?.rowId);if(!(!n||!s||!Number.isInteger(a)||a<=0)){e.disabled=!0;try{const r=await Mn(a,s);n._originalNotesHtml=r,Ke(n,!0)}finally{e.disabled=!1}}}function Ke(e,t){const n=e.querySelector(".notes-edit-panel"),s=e.querySelector(".notes-display"),a=e.querySelector(".notes-editor"),r=e.querySelector(".notes-edit-button");if(t&&s&&a){const i=H(a.innerHTML).trim(),c=Ge(i).trim().length>0;s.innerHTML=c?i:"Aucune note pour cette tâche.",s.classList.toggle("empty",!c)}e.classList.remove("is-editing","is-dirty"),n&&(n.hidden=!0),s&&(s.hidden=!1),r&&(r.hidden=!1),M(Number(e.dataset.rowId),"","")}function In(e){const t=d(e).trim();if(!t)return"";const s=/<\/?[a-z][\s\S]*>/i.test(t)?t:f(t).replace(/\r?\n/g,"<br>");return H(s)}function H(e){const t=document.createElement("template");t.innerHTML=d(e);const n=new Set(["B","STRONG","I","EM","U","S","STRIKE","A","UL","OL","LI","P","DIV","BR","BLOCKQUOTE","H2","H3","SPAN","CODE","PRE","HR","MARK"]),s=new Set(["SCRIPT","STYLE","IFRAME","OBJECT","EMBED","FORM","INPUT","BUTTON","SVG","MATH","META","LINK"]),a=r=>{Array.from(r.childNodes).forEach(i=>{if(i.nodeType===Node.ELEMENT_NODE){if(s.has(i.tagName)){i.remove();return}if(!n.has(i.tagName)){a(i),i.replaceWith(...Array.from(i.childNodes));return}if(Array.from(i.attributes).forEach(c=>{i.tagName==="A"&&["href","target","rel"].includes(c.name.toLowerCase())||i.removeAttribute(c.name)}),i.tagName==="A"){const c=We(i.getAttribute("href"));if(!c){i.replaceWith(...Array.from(i.childNodes));return}i.setAttribute("href",c),i.setAttribute("target","_blank"),i.setAttribute("rel","noopener noreferrer")}a(i)}else i.nodeType!==Node.TEXT_NODE&&i.remove()})};return a(t.content),t.innerHTML}function Tn(e,t){t?.preventDefault(),t?.stopPropagation();const s=e.closest(".notes-field")?.querySelector(".notes-editor");!s||s.contentEditable!=="true"||(s.focus(),document.execCommand("formatBlock",!1,e.value||"p"),w(s),_(s))}function wn(e,t,n,s){s?.preventDefault(),s?.stopPropagation();const r=e.closest(".notes-field")?.querySelector(".notes-editor");!r||r.contentEditable!=="true"||(r.focus(),document.execCommand(t,!1,n),w(r),_(r))}function Dn(e,t,n){n?.preventDefault(),n?.stopPropagation();const a=e.closest(".notes-field")?.querySelector(".notes-editor"),r=window.getSelection();if(!a||a.contentEditable!=="true"||!r||r.rangeCount===0)return;a.focus();const i=r.getRangeAt(0);if(!a.contains(i.commonAncestorContainer))return;const c=i.toString(),l=t==="mark"?"mark":"code";c?document.execCommand("insertHTML",!1,`<${l}>${f(c)}</${l}>`):document.execCommand("insertHTML",!1,`<${l}>&#8203;</${l}>`),w(a),_(a)}function ze(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".notes-field"),s=n?.querySelector(".notes-editor");if(!s||s.contentEditable!=="true")return;s.focus();const a=window.prompt("Adresse du lien :","https://");if(a===null)return;const r=We(a);if(!r){M(Number(n.dataset.rowId),"error","Adresse de lien invalide.");return}const i=window.getSelection();!i||i.isCollapsed?document.execCommand("insertHTML",!1,`<a href="${m(r)}" target="_blank" rel="noopener noreferrer">${f(r)}</a>`):document.execCommand("createLink",!1,r),w(s),_(s)}function We(e){const t=d(e).trim();if(!t)return"";const n=/^(https?:|mailto:|tel:)/i.test(t)?t:`https://${t}`;try{const s=new URL(n);return["http:","https:","mailto:","tel:"].includes(s.protocol)?s.href:""}catch{return""}}function Rn(e,t){if(!t?.clipboardData)return;t.preventDefault();const n=t.clipboardData.getData("text/html"),s=t.clipboardData.getData("text/plain"),a=n?H(n):f(s).replace(/\r?\n/g,"<br>");document.execCommand("insertHTML",!1,a),w(e)}function w(e){const t=e?.closest(".notes-field");t&&(t.classList.add("is-dirty"),M(Number(t.dataset.rowId),"saving","Modifications non enregistrées"))}function _(e){const t=e?.closest(".notes-field");if(!t||!t.classList.contains("is-editing"))return;t.querySelectorAll(".notes-tool[data-command]").forEach(s=>{let a=!1;try{a=document.queryCommandState(s.dataset.command)}catch{a=!1}s.classList.toggle("active",a),s.setAttribute("aria-pressed",a?"true":"false")});const n=t.querySelector(".notes-format-select");if(n){let s="p";try{s=d(document.queryCommandValue("formatBlock")).replace(/[<>]/g,"").toLowerCase()||"p"}catch{s="p"}Array.from(n.options).some(a=>a.value===s)?n.value=s:n.value="p"}}function Ln(e,t){if(!(t.ctrlKey||t.metaKey))return;const n=t.key.toLowerCase();if(n==="k"){t.preventDefault();const s=e.closest(".notes-field")?.querySelector(".notes-tool-link");s&&ze(s,t)}t.shiftKey&&n==="7"&&(t.preventDefault(),document.execCommand("insertOrderedList"),w(e)),t.shiftKey&&n==="8"&&(t.preventDefault(),document.execCommand("insertUnorderedList"),w(e))}function Pn(e){const t=document.createRange(),n=window.getSelection();t.selectNodeContents(e),t.collapse(!1),n?.removeAllRanges(),n?.addRange(t)}function Ge(e){const t=document.createElement("template");return t.innerHTML=d(e),t.content.textContent||""}async function Mn(e,t){if(!t)return"";const n=Number(e),s=H(t.innerHTML).trim(),a=E.notes.get(n)||Promise.resolve();M(n,"saving","Enregistrement…");const r=a.catch(()=>{}).then(()=>x(n,"NOTES",s||null)).then(()=>(t.innerHTML=s,M(n,"saved","Enregistré"),s)).catch(i=>{throw M(n,"error","Échec de l’enregistrement"),console.error("Erreur pendant l’enregistrement des notes :",i),i}).finally(()=>{E.notes.get(n)===r&&E.notes.delete(n)});return E.notes.set(n,r),r}function M(e,t,n){const s=document.getElementById(`notes-status-${Number(e)}`);s&&(s.className=`section-status notes-status${t?` ${t}`:""}`,s.textContent=n)}function A(e){const t=d(e).trim();if(!t)return"";const n=t.startsWith("#")?t:`#${t}`;return/^#[0-9a-f]{3}$/i.test(n)?`#${n[1]}${n[1]}${n[2]}${n[2]}${n[3]}${n[3]}`.toUpperCase():/^#[0-9a-f]{6}$/i.test(n)?n.toUpperCase():""}function Fn(e,t,n){const s=A(t);if(!s)return;const a=B(e);a&&(a.style.backgroundColor=s);const r=n?.closest(".color-field");if(r){const i=r.querySelector(".color-picker"),c=r.querySelector(".color-value");i&&n!==i&&(i.value=s),c&&n!==c&&(c.value=s)}}function Qe(e,t,n){const s=b(e);s&&(s[`${t}_id`]=[...n],s[t]=n.map(a=>p.people.byId.get(a)?.label).filter(Boolean))}function Ve(e,t){const n=b(e);n&&(n.ETIQUETTES_id=[...t],n.ETIQUETTES=t.map(s=>p.labels.byId.get(s)?.label).filter(Boolean))}async function Z(e,t,n){const s=o.map?.[t];if(!s||Array.isArray(s))throw new Error(`La colonne ${t} n’est pas correctement mappée.`);const a=[...new Set(U(n).map(Number).filter(u=>Number.isInteger(u)&&u>0))],r=await grist.getTable().getTableId(),i=a.length>0?["L",...a]:null;await grist.docApi.applyUserActions([["UpdateRecord",r,Number(e),{[s]:i}]]);const c=await Xe(e,s),l=xn(c);if(!On(a,l))throw new Error(`Vérification d’écriture échouée pour ${t}. Valeur envoyée : ${JSON.stringify(i)} ; valeur relue : ${JSON.stringify(c)}`);await bt(e)}async function Xe(e,t){const n=await grist.getTable().getTableId(),s=await grist.docApi.fetchTable(n),a=U(s?.id).findIndex(r=>Number(r)===Number(e));if(a<0)throw new Error(`Ligne ${e} introuvable dans la table ${n}.`);return s?.[t]?.[a]}function xn(e){return e==null||e===""?[]:!Array.isArray(e)||e[0]==="E"?[]:e[0]==="L"?k(e.slice(1)):e[0]==="r"?k(e[2]):k(e)}function On(e,t){const n=[...new Set(e.map(Number))].sort((a,r)=>a-r),s=[...new Set(t.map(Number))].sort((a,r)=>a-r);return n.length===s.length&&n.every((a,r)=>a===s[r])}function F(e){const t=d(e).trim();if(!t)return[];try{const n=JSON.parse(t);if(!Array.isArray(n))return[];if(n.length>0&&n.every(a=>!Array.isArray(a?.items))){const a=n.map((r,i)=>Ze(r,i));return a.length>0?[{id:"legacy-checklist",title:"Checklist",items:a,createdAt:""}]:[]}return n.map((a,r)=>Ye(a,r)).filter(a=>a.title||a.items.length>0)}catch(n){return console.warn("Checklists illisibles, valeur ignorée :",n),[]}}function Ye(e,t=0){const n=Array.isArray(e?.items)?e.items.map((s,a)=>Ze(s,a)):[];return{id:d(e?.id)||`checklist-${t}-${O()}`,title:d(e?.title||e?.name).trim()||`Checklist ${t+1}`,items:n,createdAt:d(e?.createdAt)}}function Ze(e,t=0){return{id:d(e?.id)||`item-${t}-${O()}`,text:d(e?.text).trim(),done:!!e?.done,memberIds:[...new Set(k(e?.memberIds||e?.members||[]))],dueDate:et(e?.dueDate),createdAt:d(e?.createdAt)}}function et(e){const t=d(e).trim();return/^\d{4}-\d{2}-\d{2}$/.test(t)?t:""}function qn(e,t=F(e.CHECKLIST)){if(!t.length)return"";const n=o.col.CHECKLIST.getIsFormula();return`
        <div class="checklists-stack" data-row-id="${Number(e.id)}">
            ${t.map(s=>tt(s,e.id,n)).join("")}
        </div>
    `}function tt(e,t,n){const s=e.items.filter(r=>r.done).length,a=e.items.length>0?Math.round(s/e.items.length*100):0;return`
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
                        onchange="renommerChecklist(${Number(t)}, '${g(e.id)}', this.value, event)"
                        ${n?"disabled":""}
                    >
                </div>
                <div class="checklist-title-actions">
                    <span class="checklist-compact-count">
                        ${s}/${e.items.length}
                    </span>
                    <span class="checklist-progress-percent">${a}%</span>
                    ${n?"":`
                        <button
                            type="button"
                            class="checklist-delete-list"
                            onclick="supprimerChecklist(${Number(t)}, '${g(e.id)}', event)"
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
                aria-valuenow="${a}"
            >
                <span style="width:${a}%"></span>
            </div>

            <div
                class="checklist-items"
                data-row-id="${Number(t)}"
                data-checklist-id="${m(e.id)}"
            >
                ${e.items.length?e.items.map(r=>_n(r,e.id,t,n)).join(""):'<div class="section-empty checklist-empty">Cette checklist est vide.</div>'}
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
                                '${g(e.id)}',
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
                                    '${g(e.id)}',
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
                id="checklist-status-${Number(t)}-${rt(e.id)}"
                class="section-status checklist-status"
                aria-live="polite"
            ></div>
        </section>
    `}function _n(e,t,n,s){const a=e.memberIds.map(c=>p.people.byId.get(c)).filter(Boolean),r=!e.done&&e.dueDate&&new Date(`${e.dueDate}T23:59:59`).getTime()<Date.now(),i=e.dueDate?`${r?"Échéance dépassée":"Date limite"} : ${Ne(e.dueDate)}`:"Ajouter une date limite";return`
        <article
            class="checklist-item checklist-item-compact${e.done?" done":""}${r?" overdue":""}"
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
                        '${g(t)}',
                        '${g(e.id)}',
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
                    '${g(t)}',
                    '${g(e.id)}',
                    'text',
                    this.value,
                    this,
                    event
                )"
                ${s?"disabled":""}
            >${f(e.text)}</textarea>

            <div class="checklist-item-actions">
                ${Bn(e,t,n,s,r,i)}

                ${Hn(e,t,n,a,s)}

                ${s?"":`
                    <button
                        type="button"
                        class="checklist-delete"
                        onclick="supprimerItemChecklist(
                            ${Number(n)},
                            '${g(t)}',
                            '${g(e.id)}',
                            event
                        )"
                        title="Supprimer l’élément"
                        aria-label="Supprimer l’élément"
                    >×</button>
                `}
            </div>
        </article>
    `}function Bn(e,t,n,s,a,r){const i=`
        <span class="checklist-date-summary-icon" aria-hidden="true">📅</span>
        ${e.dueDate?`<span class="checklist-date-summary-value">${f($s(e.dueDate))}</span>`:""}
    `;return s?`
            <div
                class="checklist-date-picker readonly${a?" overdue":""}${e.dueDate?" has-date":""}"
                title="${m(r)}"
            >
                <span class="checklist-date-summary">${i}</span>
            </div>
        `:`
        <details
            class="checklist-date-picker${a?" overdue":""}${e.dueDate?" has-date":""}"
        >
            <summary
                class="checklist-date-summary"
                title="${m(r)}"
                aria-label="${m(r)}"
            >${i}</summary>

            <div
                class="checklist-date-menu"
                onclick="event.stopPropagation()"
            >
                <label class="checklist-date-field">
                    <span>Date limite</span>
                    <input
                        type="date"
                        value="${m(e.dueDate)}"
                        onchange="mettreAJourDateChecklistDepuisMenu(
                            ${Number(n)},
                            '${g(t)}',
                            '${g(e.id)}',
                            this,
                            event
                        )"
                    >
                </label>

                <div class="checklist-date-quick-actions">
                    <button
                        type="button"
                        onclick="definirDateChecklistRapide(
                            ${Number(n)},
                            '${g(t)}',
                            '${g(e.id)}',
                            0,
                            event
                        )"
                    >Aujourd’hui</button>

                    <button
                        type="button"
                        onclick="definirDateChecklistRapide(
                            ${Number(n)},
                            '${g(t)}',
                            '${g(e.id)}',
                            1,
                            event
                        )"
                    >Demain</button>

                    ${e.dueDate?`
                        <button
                            type="button"
                            class="checklist-date-remove"
                            onclick="effacerDateChecklist(
                                ${Number(n)},
                                '${g(t)}',
                                '${g(e.id)}',
                                event
                            )"
                        >Retirer</button>
                    `:""}
                </div>
            </div>
        </details>
    `}async function Un(e,t,n,s,a){a?.stopPropagation(),await ee(e,t,n,"dueDate",s?.value||"",s,a)}async function jn(e,t,n,s,a){a?.preventDefault(),a?.stopPropagation();const r=new Date;r.setHours(12,0,0,0),r.setDate(r.getDate()+Number(s||0));const i=[r.getFullYear(),String(r.getMonth()+1).padStart(2,"0"),String(r.getDate()).padStart(2,"0")].join("-");await ee(e,t,n,"dueDate",i,null,a)}async function Jn(e,t,n,s){s?.preventDefault(),s?.stopPropagation(),await ee(e,t,n,"dueDate","",null,s)}function Hn(e,t,n,s,a){const r=new Set(e.memberIds),i=nt(s);return a?`<div class="checklist-assignees readonly">${i}</div>`:`
        <details class="checklist-assignees">
            <summary>${i}</summary>
            <div class="checklist-assignees-menu">
                <div class="multi-toolbar">
                    <input type="search" class="multi-search" placeholder="Rechercher…" oninput="filtrerOptionsChecklist(this)" onclick="event.stopPropagation()">
                </div>
                <div class="multi-options">
                    ${p.people.items.map(c=>`
                        <label class="multi-option checklist-person-option" data-search="${m(c.label.toLocaleLowerCase(o.cultureFull))}">
                            <input
                                type="checkbox"
                                value="${c.id}"
                                ${r.has(c.id)?"checked":""}
                                onchange="mettreAJourAssignationsItemChecklist(${Number(n)}, '${g(t)}', '${g(e.id)}', this.closest('.checklist-assignees'), event)"
                            >
                            <span class="responsable-option-avatar" style="background:${m(c.avatarColor)}">${f(c.initials)}</span>
                            <span class="responsable-option-name">${f(c.label)}</span>
                        </label>
                    `).join("")||'<div class="multi-empty">Aucun membre disponible</div>'}
                </div>
            </div>
        </details>
    `}function nt(e){return e.length?`
            <span class="checklist-assignee-avatars">
                ${e.slice(0,4).map(t=>`
                    <span class="checklist-assignee-avatar" style="background:${m(t.avatarColor)}" title="${m(t.label)}">${f(t.initials)}</span>
                `).join("")}
                ${e.length>4?`<span class="checklist-assignee-more">+${e.length-4}</span>`:""}
            </span>
        `:'<span class="checklist-assignee-placeholder">👤 Attribuer</span>'}function Kn(e){const t=e.closest(".checklist-assignees"),n=e.value.trim().toLocaleLowerCase(o.cultureFull);t?.querySelectorAll(".checklist-person-option").forEach(s=>{s.hidden=n!==""&&!d(s.dataset.search).includes(n)})}function zn(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".checklist-add-zone"),s=n?.querySelector(".checklist-add-composer"),a=s?.querySelector(".checklist-add-input");!n||!s||(e.hidden=!0,s.hidden=!1,a?.focus())}function Wn(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".checklist-add-zone"),s=n?.querySelector(".checklist-add-composer"),a=n?.querySelector(".checklist-add-trigger"),r=s?.querySelector(".checklist-add-input");!n||!s||!a||(r&&(r.value=""),s.hidden=!0,a.hidden=!1)}function Gn(e,t,n,s){s.key==="Enter"&&(s.preventDefault(),st(e,t,n,s))}async function st(e,t,n,s){s?.preventDefault(),s?.stopPropagation();const r=n.closest(".checklist-section")?.querySelector(".checklist-add-input"),i=d(r?.value).trim();if(!i){r?.focus(),te(e,t,"error","Saisissez un intitulé.");return}r&&(r.value="");const c=await D(e,l=>l.map(u=>u.id===t?{...u,items:[...u.items,{id:O(),text:i,done:!1,memberIds:[],dueDate:"",createdAt:new Date().toISOString()}]}:u));ge(e,t,c)}async function Qn(e,t,n,s){s?.stopPropagation();const a=d(n).trim()||"Checklist";await D(e,r=>r.map(i=>i.id===t?{...i,title:a}:i))}async function ee(e,t,n,s,a,r,i){i?.stopPropagation();const c=s==="done"?!!a:s==="dueDate"?et(a):d(a).trim(),l=await D(e,u=>u.map(h=>h.id===t?{...h,items:h.items.map(v=>v.id===n?{...v,[s]:c}:v)}:h));if(s==="text"){te(e,t,"saved","Élément enregistré.");return}ge(e,t,l)}async function Vn(e,t,n,s,a){a?.stopPropagation();const r=Array.from(s.querySelectorAll('input[type="checkbox"]:checked')).map(l=>Number(l.value)).filter(l=>p.people.byId.has(l));await D(e,l=>l.map(u=>u.id===t?{...u,items:u.items.map(h=>h.id===n?{...h,memberIds:r}:h)}:u));const i=r.map(l=>p.people.byId.get(l)).filter(Boolean),c=s.querySelector("summary");c&&(c.innerHTML=nt(i)),te(e,t,"saved","Attribution enregistrée.")}async function Xn(e,t,n,s){s?.preventDefault(),s?.stopPropagation();const a=b(e),i=F(a?.CHECKLIST).find(l=>l.id===t)?.items.find(l=>l.id===n);if(i?.text&&!window.confirm(`Supprimer « ${i.text} » ?`))return;const c=await D(e,l=>l.map(u=>u.id===t?{...u,items:u.items.filter(h=>h.id!==n)}:u));ge(e,t,c)}async function Yn(e,t,n){n?.preventDefault(),n?.stopPropagation();const s=b(e),a=F(s?.CHECKLIST).find(r=>r.id===t);window.confirm(`Supprimer la checklist « ${a?.title||"Checklist"} » et tous ses éléments ?`)&&(await D(e,r=>r.filter(i=>i.id!==t)),await S(e))}async function D(e,t){const n=Number(e),a=(E.checklists.get(n)||Promise.resolve()).catch(()=>{}).then(async()=>{const r=b(n),i=F(r?.CHECKLIST),c=t(i).map((l,u)=>Ye(l,u));return await x(n,"CHECKLIST",JSON.stringify(c)),r&&(r.CHECKLIST=JSON.stringify(c)),c}).finally(()=>{E.checklists.get(n)===a&&E.checklists.delete(n)});return E.checklists.set(n,a),a}function ge(e,t,n=null){const s=b(e),r=(n||F(s?.CHECKLIST)).find(u=>u.id===t),i=document.querySelector(`.checklist-section[data-row-id="${Number(e)}"][data-checklist-id="${Zn(t)}"]`);if(!i||!r){S(e);return}const c=document.createElement("div");c.innerHTML=tt(r,e,o.col.CHECKLIST.getIsFormula());const l=c.firstElementChild;i.replaceWith(l),l.querySelectorAll(".auto-expand").forEach(ae),at(l.parentElement)}function te(e,t,n,s){const a=document.getElementById(`checklist-status-${Number(e)}-${rt(t)}`);a&&(a.className=`section-status checklist-status${n?` ${n}`:""}`,a.textContent=s)}function at(e=document){typeof Sortable!="function"||o.opt.readonly||e.querySelectorAll('.checklist-section[data-disabled="false"] .checklist-items').forEach(t=>{t.dataset.sortableReady!=="true"&&(t.dataset.sortableReady="true",new Sortable(t,{animation:140,handle:".checklist-drag-handle",ghostClass:"checklist-item-ghost",chosenClass:"checklist-item-chosen",onEnd:async()=>{const n=Number(t.dataset.rowId),s=t.dataset.checklistId,a=Array.from(t.querySelectorAll(".checklist-item")).map(r=>r.dataset.itemId);await D(n,r=>r.map(i=>{if(i.id!==s)return i;const c=new Map(i.items.map(l=>[l.id,l]));return{...i,items:a.map(l=>c.get(l)).filter(Boolean)}})),te(n,s,"saved","Ordre enregistré.")}}))})}function rt(e){return d(e).replace(/[^a-zA-Z0-9_-]/g,"_")}function Zn(e){return window.CSS?.escape?window.CSS.escape(d(e)):d(e).replace(/["\\]/g,"\\$&")}function es(e,t=k(e.PIECES_JOINTES),n=ne(e.LIENS)){return`
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
                        ${n.map(s=>ts(e.id,s)).join("")}
                    </div>
                </div>
            `:""}
        </section>
    `}function ne(e){const t=d(e).trim();if(!t)return[];try{const n=JSON.parse(t);return Array.isArray(n)?n.map((s,a)=>({id:d(s?.id)||`link-${a}`,label:d(s?.label||s?.text).trim(),url:ve(s?.url),createdAt:d(s?.createdAt)})).filter(s=>s.label&&s.url):[]}catch(n){return console.warn("Liens illisibles, valeur ignorée :",n),[]}}function ve(e){const t=d(e).trim();if(!t)return"";const n=/^(https?:)/i.test(t)?t:`https://${t}`;try{const s=new URL(n);return["http:","https:"].includes(s.protocol)?s.href:""}catch{return""}}function ts(e,t){let n="";try{n=new URL(t.url).hostname}catch{n=t.url}return`
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
                    onclick="retirerLienFiche(${Number(e)}, '${g(t.id)}', event)"
                    title="Retirer ce lien"
                    aria-label="Retirer ce lien"
                >×</button>
            `:""}
        </article>
    `}async function ns(e,t,n){n?.preventDefault(),n?.stopPropagation();const s=t.closest(".task-action-panel"),a=s?.querySelector(".resource-link-label"),r=s?.querySelector(".resource-link-url"),i=s?.querySelector(".task-panel-status"),c=d(a?.value).trim(),l=ve(r?.value);if(!c||!l){i&&(i.className="task-panel-status section-status error",i.textContent="Renseignez un texte d’affichage et une adresse valide."),(c?r:a)?.focus();return}try{i&&(i.className="task-panel-status section-status saving",i.textContent="Enregistrement…"),await it(e,u=>[...u,{id:O(),label:c,url:l,createdAt:new Date().toISOString()}]),await S(e,"resources")}catch{i&&(i.className="task-panel-status section-status error",i.textContent="Impossible d’ajouter le lien.")}}async function ss(e,t,n){n?.preventDefault(),n?.stopPropagation(),await it(e,s=>s.filter(a=>a.id!==t)),await S(e)}async function it(e,t){const n=Number(e),a=(E.links.get(n)||Promise.resolve()).catch(()=>{}).then(async()=>{const r=b(n),i=ne(r?.LIENS),c=t(i).map(l=>({id:d(l.id)||O(),label:d(l.label).trim(),url:ve(l.url),createdAt:d(l.createdAt)||new Date().toISOString()})).filter(l=>l.label&&l.url);return await x(n,"LIENS",JSON.stringify(c)),r&&(r.LIENS=JSON.stringify(c)),c}).finally(()=>{E.links.get(n)===a&&E.links.delete(n)});return E.links.set(n,a),a}async function as(e){const t=document.getElementById(`attachments-list-${Number(e)}`);if(!t)return;const n=b(e),s=k(n?.PIECES_JOINTES);if(s.length===0){t.innerHTML='<div class="section-empty">Aucune pièce jointe</div>';return}t.innerHTML='<div class="section-loading">Chargement des aperçus…</div>';try{const[a]=await Promise.all([Ee(!0),pe()]);t.innerHTML=s.map(r=>ot(e,r,a)).join("")}catch(a){console.error("Impossible d’afficher les pièces jointes :",a),t.innerHTML=s.map(r=>ot(e,r,null)).join("")}}function ot(e,t,n){const s=dt(t),a=n?ut(n,t):"",r=pt(s),i=r==="image"&&a?`<img src="${m(a)}" alt="${m(s.fileName)}" loading="lazy">`:`<div class="attachment-file-icon">${mt(r)}</div>`;return`
        <article class="attachment-card">
            <button type="button" class="attachment-preview" onclick="ouvrirPieceJointe(${Number(e)}, ${Number(t)}, event)" title="Ouvrir ${m(s.fileName)}">
                ${i}
            </button>
            <div class="attachment-info">
                <div class="attachment-name" title="${m(s.fileName)}">${f(s.fileName)}</div>
                <div class="attachment-meta">${f(Ns(s.fileSize))}</div>
            </div>
            <div class="attachment-actions">
                <button type="button" onclick="ouvrirPieceJointe(${Number(e)}, ${Number(t)}, event)" title="Visualiser">👁</button>
                ${o.map?.PIECES_JOINTES&&!o.col.PIECES_JOINTES.getIsFormula()?`<button type="button" onclick="retirerPieceJointe(${Number(e)}, ${Number(t)}, event)" title="Retirer de la tâche">×</button>`:""}
            </div>
        </article>
    `}function rs(e,t){t?.preventDefault(),t?.stopPropagation();const s=e?.closest(".task-action-panel")?.querySelector(".resource-file-input");!s||s.disabled||s.click()}function is(e){const t=[],n=s=>{if(s!=null){if(typeof s=="number"||typeof s=="string"){const a=Number(s);Number.isInteger(a)&&a>0&&t.push(a);return}if(Array.isArray(s)){const a=s[0]==="L"?1:0;s.slice(a).forEach(n);return}typeof s=="object"&&["id","ids","attachmentId","attachmentIds","attachments","recordIds","result"].forEach(a=>{Object.prototype.hasOwnProperty.call(s,a)&&n(s[a])})}};return n(e),[...new Set(t)]}async function os(e,t,n){n?.preventDefault(),n?.stopPropagation();const s=t?.closest(".task-action-panel"),a=s?.querySelector(".task-panel-status"),r=s?.querySelector(".resource-file-button"),i=Array.from(t?.files||[]);if(i.length===0)return;const c=(u,h)=>{a&&(a.className=`task-panel-status section-status${u?` ${u}`:""}`,a.textContent=h)},l=i.find(u=>u.size>Dt);if(l){c("error",`${l.name} dépasse la limite de 50 Mo.`),t.value="";return}t.disabled=!0,r&&(r.disabled=!0),c("saving",`Envoi de ${i.length} fichier(s)…`);try{const u=await Ee(!1),h=new FormData;i.forEach(Q=>{h.append("upload",Q,Q.name)});const v=`${u.baseUrl}/attachments?auth=${encodeURIComponent(u.token)}`,C=await fetch(v,{method:"POST",body:h,headers:{"X-Requested-With":"XMLHttpRequest",Accept:"application/json"}}),y=await C.text();let $=y;if(y)try{$=JSON.parse(y)}catch{$=y}if(!C.ok)throw new Error(`Upload refusé par Grist (${C.status}).`);const R=is($);if(R.length===0)throw new Error("Le fichier a été envoyé, mais aucun identifiant de pièce jointe n’a été retourné.");const T=b(e),G=k(T?.PIECES_JOINTES),L=[...new Set([...G,...R])];await ct(e,L),T&&(T.PIECES_JOINTES=[...L]),p.attachments.metaLoaded=!1,p.attachments.readToken=null,await pe(!0),c("saved",`${R.length} pièce(s) jointe(s) ajoutée(s).`),P(),await S(e)}catch(u){console.error("Erreur pendant l’ajout des pièces jointes :",u),c("error",u?.message||"Échec de l’envoi.")}finally{t.value="",t.disabled=!1,r&&(r.disabled=!1)}}async function cs(e,t,n){n?.preventDefault(),n?.stopPropagation();const s=b(e),r=k(s?.PIECES_JOINTES).filter(i=>i!==Number(t));try{I("attachments",e,"saving","Mise à jour…"),await ct(e,r),s&&(s.PIECES_JOINTES=[...r]),await S(e)}catch(i){console.error("Erreur pendant le retrait de la pièce jointe :",i),I("attachments",e,"error","Impossible de retirer la pièce jointe.")}}async function ct(e,t){const n=o.map?.PIECES_JOINTES;if(!n||Array.isArray(n))throw new Error("La colonne Pièces jointes n’est pas correctement mappée.");await grist.getTable().update({id:Number(e),fields:{[n]:["L",...t]}}),await bt(e)}async function ls(e,t,n){n?.preventDefault(),n?.stopPropagation();try{const[s]=await Promise.all([Ee(!0),pe()]),a=dt(t),r=ut(s,t);ds(a,r)}catch(s){console.error("Impossible d’ouvrir la pièce jointe :",s),window.alert("Impossible d’ouvrir cette pièce jointe.")}}function us(){if(document.getElementById("attachment-viewer"))return;const e=document.createElement("div");e.id="attachment-viewer",e.className="attachment-viewer",e.setAttribute("aria-hidden","true"),e.innerHTML=`
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
    `,document.body.appendChild(e)}function ds(e,t){const n=document.getElementById("attachment-viewer"),s=document.getElementById("attachment-viewer-content"),a=document.getElementById("attachment-viewer-title"),r=document.getElementById("attachment-viewer-download");if(!n||!s||!a||!r)return;a.textContent=e.fileName,r.href=t;const i=pt(e);i==="image"?s.innerHTML=`<img src="${m(t)}" alt="${m(e.fileName)}">`:i==="pdf"?s.innerHTML=`<iframe src="${m(t)}" title="${m(e.fileName)}"></iframe>`:i==="video"?s.innerHTML=`<video src="${m(t)}" controls autoplay></video>`:i==="audio"?s.innerHTML=`<div class="attachment-generic-preview"><div class="attachment-large-icon">🎵</div><audio src="${m(t)}" controls autoplay></audio></div>`:s.innerHTML=`<div class="attachment-generic-preview"><div class="attachment-large-icon">${mt(i)}</div><p>Ce format ne dispose pas d’un aperçu intégré.</p><a href="${m(t)}" target="_blank" rel="noopener">Ouvrir ou télécharger le fichier</a></div>`,n.classList.add("visible"),n.setAttribute("aria-hidden","false")}function lt(e){e?.preventDefault(),e?.stopPropagation();const t=document.getElementById("attachment-viewer");if(!t)return;t.classList.remove("visible"),t.setAttribute("aria-hidden","true");const n=document.getElementById("attachment-viewer-content");n&&(n.innerHTML="")}async function Ee(e=!0){if(e&&p.attachments.readToken&&Date.now()-p.attachments.readTokenAt<wt)return p.attachments.readToken;const t=await grist.docApi.getAccessToken({readOnly:e});return e&&(p.attachments.readToken=t,p.attachments.readTokenAt=Date.now()),t}function ut(e,t){return`${e.baseUrl}/attachments/${Number(t)}/download?auth=${encodeURIComponent(e.token)}`}function dt(e){return p.attachments.meta.get(Number(e))||{id:Number(e),fileName:`Pièce jointe ${Number(e)}`,fileExt:"",fileType:"",fileSize:0,imageWidth:0,imageHeight:0}}function pt(e){const t=d(e.fileExt||$t(e.fileName)).toLowerCase().replace(/^\./,""),n=d(e.fileType).toLowerCase();return n.startsWith("image/")||["png","jpg","jpeg","gif","webp","svg","bmp","avif"].includes(t)?"image":n==="application/pdf"||t==="pdf"?"pdf":n.startsWith("video/")||["mp4","webm","mov","m4v","ogv"].includes(t)?"video":n.startsWith("audio/")||["mp3","wav","ogg","m4a","aac","flac"].includes(t)?"audio":["doc","docx","odt"].includes(t)?"document":["xls","xlsx","ods","csv"].includes(t)?"tableur":["ppt","pptx","odp"].includes(t)?"presentation":["zip","rar","7z","tar","gz"].includes(t)?"archive":"file"}function mt(e){return{image:"🖼️",pdf:"📕",video:"🎬",audio:"🎵",document:"📄",tableur:"📊",presentation:"📽️",archive:"🗜️",file:"📎"}[e]||"📎"}function ps(e){const t=K(e.COMMENTAIRES);return`
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
                ${ft(t,e.id)}
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
    `}function ft(e,t){return e.length===0?'<div class="section-empty">Aucun commentaire</div>':e.map(n=>`
        <article
            class="comment-card"
            data-comment-id="${m(n.id)}"
        >
            <div class="comment-header">
                <strong>${f(n.author===J?"Nom Grist non configuré":n.author||"Anonyme")}</strong>
                <span>${f(Ie(n.createdAt))}</span>
                <button
                    type="button"
                    onclick="supprimerCommentaire(
                        ${Number(t)},
                        '${g(n.id)}',
                        event
                    )"
                    title="Supprimer le commentaire"
                >×</button>
            </div>
            <div class="comment-body">
                ${ms(n)}
            </div>
        </article>
    `).join("")}function ms(e){return f(e.text).replace(/\n/g,"<br>")}function K(e){const t=d(e).trim();if(!t)return[];try{const n=JSON.parse(t);if(!Array.isArray(n))throw new Error("Format non tableau");return n.map((s,a)=>({id:d(s?.id)||`legacy-${a}`,author:d(s?.author)||"Anonyme",createdAt:d(s?.createdAt),text:d(s?.text)})).filter(s=>s.text.trim())}catch{return[{id:"legacy-text",author:"Ancien commentaire",createdAt:"",text:t}]}}async function fs(e,t,n){n?.preventDefault(),n?.stopPropagation();const a=t.closest(".comments-section")?.querySelector(".comment-input"),r=d(a?.value).trim();if(!r){I("comments",e,"error","Écrivez un commentaire."),a?.focus();return}t.disabled=!0,I("comments",e,"saving","Enregistrement…");const i={id:O(),author:J,createdAt:new Date().toISOString(),text:r};try{const l=(await ht(e,u=>[...u,i])).find(u=>u.id===i.id);if(!l||l.author===J)throw new Error("La formule user.Name n’a pas remplacé le nom temporaire.");a&&(a.value="",ae(a)),ye(e),I("comments",e,"saved",`Commentaire ajouté par ${l.author}.`)}catch(c){console.error("Erreur pendant l’ajout du commentaire :",c),ye(e),I("comments",e,"error",d(c?.message)||"Impossible d’ajouter le commentaire.")}finally{t.disabled=!1}}async function hs(e,t,n){n?.preventDefault(),n?.stopPropagation();try{I("comments",e,"saving","Suppression…"),await ht(e,s=>s.filter(a=>a.id!==t)),ye(e),I("comments",e,"saved","Commentaire supprimé.")}catch(s){console.error("Erreur pendant la suppression du commentaire :",s),I("comments",e,"error","Impossible de supprimer le commentaire.")}}async function ht(e,t){const n=Number(e),a=(E.comments.get(n)||Promise.resolve()).catch(()=>{}).then(async()=>{const r=b(n),i=K(r?.COMMENTAIRES),c=t(i),l=JSON.stringify(c),u=z();await o.updateRecords(o.formatRecord(n,{COMMENTAIRES:l,...u}));const h=await bs(n);return r&&(r.COMMENTAIRES=JSON.stringify(h)),h}).finally(()=>{E.comments.get(n)===a&&E.comments.delete(n)});return E.comments.set(n,a),a}async function bs(e){const t=o.map?.COMMENTAIRES;if(!t||Array.isArray(t))throw new Error("La colonne Commentaires n’est pas correctement mappée.");const n=await Xe(e,t),s=K(n),a=b(e);return a&&(a.COMMENTAIRES=d(n)),s}function ye(e){const t=b(e),n=K(t?.COMMENTAIRES),s=document.getElementById(`comments-list-${Number(e)}`),a=s?.closest(".comments-section");s&&(s.innerHTML=ft(n,e));const r=a?.querySelector(".detail-section-header p");r&&(r.textContent=`${n.length} commentaire(s)`)}async function x(e,t,n,s){s?.stopPropagation();try{t==="STATUT"&&re(n)?.useconfetti&&At();const a={[t]:n,...t==="DERNIERE_MISE_A_JOUR"||t==="MODIFIE_PAR"?{}:z()};await o.updateRecords(o.formatRecord(e,a));const r=b(e);r&&(r[t]=n,a.DERNIERE_MISE_A_JOUR&&(r.DERNIERE_MISE_A_JOUR=a.DERNIERE_MISE_A_JOUR),a.MODIFIE_PAR&&(r.MODIFIE_PAR=a.MODIFIE_PAR))}catch(a){throw console.error(N("Error during update:"),a),a}}function z(){const e={};return o.map?.DERNIERE_MISE_A_JOUR&&!o.col.DERNIERE_MISE_A_JOUR.getIsFormula()&&(e.DERNIERE_MISE_A_JOUR=new Date().toISOString()),o.map?.MODIFIE_PAR&&!o.col.MODIFIE_PAR.getIsFormula()&&(e.MODIFIE_PAR=J),e}async function bt(e){const t=z();if(Object.keys(t).length!==0)try{await o.updateRecords(o.formatRecord(e,t));const n=b(e);n&&Object.assign(n,t)}catch(n){console.warn("Données enregistrées, mais informations de suivi non modifiées :",n)}}async function gs(e){try{const t={DESCRIPTION:"",STATUT:e};o.map?.DERNIERE_MISE_A_JOUR&&!o.col.DERNIERE_MISE_A_JOUR.getIsFormula()&&(t.DERNIERE_MISE_A_JOUR=new Date().toISOString()),o.map?.CREE_LE&&!o.col.CREE_LE.getIsFormula()&&(t.CREE_LE=new Date().toISOString()),o.map?.COMMENTAIRES&&!o.col.COMMENTAIRES.getIsFormula()&&(t.COMMENTAIRES="[]"),o.map?.CHECKLIST&&!o.col.CHECKLIST.getIsFormula()&&(t.CHECKLIST="[]"),o.map?.LIENS&&!o.col.LIENS.getIsFormula()&&(t.LIENS="[]"),o.map?.ORDRE&&!o.col.ORDRE.getIsFormula()&&(t.ORDRE=Se(e));const n=await o.createRecords({fields:t});if(n?.id>0){grist.setCursorPos({rowId:n.id});const s=await o.fetchSelectedRecord(n.id);o.opt.hideedit||Y(s)}}catch(t){console.error(N("Error on creation:"),t)}}function vs(e,t){t?.preventDefault(),t?.stopPropagation(),P();const n=document.getElementById("popup-todo"),s=b(e);if(!n||!s)return;se();const a=document.createElement("div");a.id="archive-confirm-dialog",a.className="archive-confirm-overlay",a.setAttribute("role","presentation"),a.innerHTML=`
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
                    « ${f(d(s.DESCRIPTION)||"Cette carte")} » sera déplacée dans la liste
                    <strong>${f(d(o.opt?.archivestatus).trim()||"Archives")}</strong>.
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
                        ${Number(e)},
                        this,
                        event
                    )"
                >Archiver</button>
            </div>
        </section>
    `,a.addEventListener("click",r=>{r.target===a&&se(r)}),n.appendChild(a),window.setTimeout(()=>{a.querySelector(".archive-confirm-submit")?.focus()},0)}function se(e){e?.preventDefault(),e?.stopPropagation(),document.getElementById("archive-confirm-dialog")?.remove()}async function Es(e,t,n){n?.preventDefault(),n?.stopPropagation();const s=t?.closest(".archive-confirm-card"),a=s?.querySelector(".archive-confirm-status"),r=s?.querySelector(".archive-confirm-cancel");t.disabled=!0,r&&(r.disabled=!0),a&&(a.className="archive-confirm-status section-status saving",a.textContent="Archivage…");try{const i=await o.col.STATUT.getChoices(),c=d(o.opt?.archivestatus).trim()||"Archives",l=i.find(v=>d(v)===c)||i.find(v=>d(v).toLocaleLowerCase(o.cultureFull)===c.toLocaleLowerCase(o.cultureFull))||i.find(v=>d(v).toLocaleLowerCase(o.cultureFull).includes("archive"));if(!l)throw new Error(`Aucun statut « ${c} » n’existe dans la colonne Statut.`);const u={STATUT:l,...z()};o.map?.ORDRE&&!o.col.ORDRE.getIsFormula()&&(u.ORDRE=Se(l)),await o.updateRecords(o.formatRecord(e,u));const h=b(e);h&&Object.assign(h,u),se(),W(),await q(p.records)}catch(i){console.error("Impossible d’archiver la tâche :",i),a&&(a.className="archive-confirm-status section-status error",a.textContent=i?.message||"Impossible d’archiver la tâche."),t.disabled=!1,r&&(r.disabled=!1)}}function W(){const e=document.getElementById("popup-todo");!e||e.querySelector(".notes-field.is-editing.is-dirty")&&!window.confirm("Les modifications des notes ne sont pas enregistrées. Fermer quand même ?")||(B(e.dataset.currentTodo)?.classList.remove("active"),P(),e.classList.remove("visible"),gt())}function ys(e,t){if(t?.stopPropagation(),!e)return;e.classList.toggle("collapsed");const n=e.querySelector(".titre-statut")?.childNodes?.[0]?.textContent?.trim()||e.id;localStorage.setItem(Et(n),String(e.classList.contains("collapsed")))}function ae(e){e&&(e.style.height="",e.style.height=`${Math.max(e.scrollHeight,42)}px`)}function gt(e=null){document.querySelectorAll(".multi-dropdown[open], .checklist-assignees[open], .checklist-date-picker[open]").forEach(t=>{t!==e&&t.removeAttribute("open")})}document.addEventListener("keydown",e=>{if(e.key!=="Escape")return;if(document.getElementById("attachment-viewer")?.classList.contains("visible")){lt(e);return}const n=document.querySelector(".multi-dropdown[open], .checklist-assignees[open], .checklist-date-picker[open]");if(n){n.removeAttribute("open");return}if(document.querySelector(".task-action-panel:not([hidden])")){P(e);return}W()}),document.addEventListener("click",e=>{const t=e.target.closest(".multi-dropdown, .checklist-assignees, .checklist-date-picker");o?.opt?.autoclosemenus!==!1&&gt(t);const n=document.getElementById("popup-todo");if(!n?.classList.contains("visible"))return;e.target.closest(".task-action-panel, .task-quick-button")||P();const a=n.contains(e.target),r=!!e.target.closest(".carte"),i=!!e.target.closest("#attachment-viewer");!a&&!r&&!i&&W()});function b(e){return p.records.find(t=>Number(t.id)===Number(e))||null}function B(e){return Array.from(document.querySelectorAll(".carte")).find(t=>Number(t.dataset.todoId)===Number(e))||null}function vt(e){return{addbutton:!1,isdone:!1,useconfetti:!1,hidecolumn:!1,...(Array.isArray(o.opt?.columns)?o.opt.columns:[])[e]||{}}}function re(e){const n=(o.valuesList?.columns||[]).indexOf(e);return n>=0?vt(n):null}function Et(e){return`column-todo-${d(e)}`}function Se(e){const t=p.records.filter(n=>d(n.STATUT)===d(e)).map(n=>Number(n.ORDRE)).filter(Number.isFinite);return t.length>0?Math.max(...t)+1e3:1e3}function ke(e,t){const n=kt(e?.[`${t}_id`]);if(n.length>0)return n;const s=ie(e?.[t]).filter(r=>r!=="#KeyError"),a=[...p.people.items];return s.flatMap(r=>{const i=a.findIndex(l=>l.label===r);if(i<0)return[];const[c]=a.splice(i,1);return[c.id]})}function yt(e,t){const n=ke(e,t);return n.length>0?n.map(s=>p.people.byId.get(s)).filter(Boolean):ie(e?.[t]).filter(s=>s!=="#KeyError").map(s=>({id:0,label:s,initials:Fe(s),avatarColor:xe(s)}))}function Ss(e){return ke(e,"MEMBRES")}function Ce(e){return yt(e,"MEMBRES")}function ks(e){return ke(e,"RESPONSABLE")}function $e(e){return yt(e,"RESPONSABLE")}function Ae(e){const t=kt(e?.ETIQUETTES_id);if(t.length>0)return t;const n=ie(e?.ETIQUETTES).filter(a=>a!=="#KeyError"),s=[...p.labels.items];return n.flatMap(a=>{const r=s.findIndex(c=>c.label===a);if(r<0)return[];const[i]=s.splice(r,1);return[i.id]})}function St(e){const t=Ae(e);return t.length>0?t.map(n=>p.labels.byId.get(n)).filter(Boolean):ie(e?.ETIQUETTES).filter(n=>n!=="#KeyError").map(n=>{const s=Oe(n);return{id:0,label:n,color:s,textColor:qe(s)}})}function kt(e){return k(e)}function k(e){let t=U(e);return t[0]==="L"?t=t.slice(1):t[0]==="r"&&(t=U(t[2])),[...new Set(t.flatMap(n=>Array.isArray(n)?n:[n]).map(Number).filter(n=>Number.isInteger(n)&&n>0))]}function ie(e){let t=U(e);return t[0]==="L"&&(t=t.slice(1)),[...new Set(t.flatMap(n=>Array.isArray(n)?n:[n]).map(d).map(n=>n.trim()).filter(Boolean))]}function U(e){return e==null||e===""?[]:Array.isArray(e)?e:[e]}function d(e){return e==null?"":String(e)}function Cs(e){const t=[],n=o.map?.CREE_LE&&e.CREE_LE?Ie(e.CREE_LE):"",s=o.map?.CREE_PAR?d(e.CREE_PAR).trim():"";if(n||s){const c=["Créé"];n&&c.push(`le ${n}`),s&&c.push(`par ${s}`),t.push(`<div>${f(c.join(" "))}</div>`)}const a=o.map?.DERNIERE_MISE_A_JOUR&&e.DERNIERE_MISE_A_JOUR?Ie(e.DERNIERE_MISE_A_JOUR):"",r=o.map?.MODIFIE_PAR?d(e.MODIFIE_PAR).trim():"",i=r===J?"Nom Grist non configuré":r;if(a||i){const c=["Modifié"];a&&c.push(`le ${a}`),i&&c.push(`par ${i}`),t.push(`<div>${f(c.join(" "))}</div>`)}return t.join("")}function I(e,t,n,s){const a=document.getElementById(`${e}-status-${Number(t)}`);a&&(a.className=`section-status${n?` ${n}`:""}`,a.textContent=s)}function Ne(e){if(!e)return"";const t=new Date(e);if(Number.isNaN(t.getTime())||t>=j)return"";const n=String(t.getDate()).padStart(2,"0"),s=t.toLocaleDateString(o.cultureFull,{month:"short"});return`${n} ${s} ${t.getFullYear()}`}function $s(e){if(!e)return"";const n=d(e).trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);if(n)return`${n[3]}/${n[2]}/${n[1]}`;const s=new Date(e);return Number.isNaN(s.getTime())?"":s.toLocaleDateString(o.cultureFull,{day:"2-digit",month:"2-digit",year:"numeric"})}function Ie(e){if(!e)return"";const t=new Date(e);return Number.isNaN(t.getTime())?"":t.toLocaleString(o.cultureFull,{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}function As(e){if(!e)return"";const t=new Date(e);return Number.isNaN(t.getTime())||t>=j?"":t.toISOString().split("translate")[0]}function Ct(e){if(!e)return"";const t=new Date(e);return Number.isNaN(t.getTime())?d(e):t.toISOString()}function oe(e){if(!e)return null;const t=new Date(e).getTime();return Number.isNaN(t)?null:t}function ce(e,t){return oe(e)??t}function Ns(e){const t=Number(e)||0;if(t<=0)return"";const n=["o","Ko","Mo","Go"],s=Math.min(Math.floor(Math.log(t)/Math.log(1024)),n.length-1);return`${(t/1024**s).toFixed(s===0?0:1)} ${n[s]}`}function $t(e){const t=d(e).match(/(\.[^.]+)$/);return t?t[1]:""}function O(){return globalThis.crypto?.randomUUID?crypto.randomUUID():`comment-${Date.now()}-${Math.random().toString(16).slice(2)}`}function f(e){return d(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function m(e){return f(e).replace(/`/g,"&#096;")}function g(e){return d(e).replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/\r/g,"\\r").replace(/\n/g,"\\n")}function Is(e){return encodeURIComponent(d(e)).replace(/'/g,"%27")}function At(){if(typeof confetti!="function")return;const e=2e3,t=Date.now()+e,n={startVelocity:30,spread:360,ticks:60,zIndex:1500},s=(r,i)=>Math.random()*(i-r)+r,a=window.setInterval(()=>{const r=t-Date.now();if(r<=0){window.clearInterval(a);return}const i=50*(r/e);confetti({...n,particleCount:i,origin:{x:s(.1,.3),y:Math.random()-.2}}),confetti({...n,particleCount:i,origin:{x:s(.7,.9),y:Math.random()-.2}})},250)}Object.assign(window,{activerEditionNotes:$n,ajouterChecklistAvecTitre:He,ajouterCommentaire:fs,ajouterItemChecklist:st,ajouterLienFiche:ns,ajouterPiecesJointes:os,ajusterTextarea:ae,annulerEditionNotes:An,appliquerBaliseSelectionNotes:Dn,appliquerCommandeNotes:wn,appliquerFormatBlocNotes:Tn,basculerRolePersonnePanneau:bn,changerStatutDepuisFiche:dn,confirmerArchivage:Es,creerLienNotes:ze,creerNouvelleTache:gs,declencherSelecteurPiecesJointes:rs,definirDateChecklistRapide:jn,effacerDateChecklist:Jn,enregistrerEtFermerNotes:Nn,enregistrerEtiquettesDepuisPanneau:fn,fermerAjoutItemChecklist:Wn,fermerLecteurPieceJointe:lt,fermerPanneauxFiche:P,fermerPopup:W,fermerPopupArchivage:se,filtrerOptionsChecklist:Kn,filtrerPanneauFiche:un,gererAjoutItemChecklistClavier:Gn,gererCreationChecklistClavier:Sn,gererRaccourcisNotes:Ln,marquerNotesModifiees:w,mettreAJourAssignationsItemChecklist:Vn,mettreAJourCouleurFiche:kn,mettreAJourDateChecklistDepuisMenu:Un,mettreAJourEtatBarreNotes:_,mettreAJourItemChecklist:ee,mettreAJourProprieteFiche:mn,mettreAJourTitreFiche:pn,nettoyerCollageNotes:Rn,ouvrirAjoutItemChecklist:zn,ouvrirPanneauFiche:je,ouvrirPieceJointe:ls,ouvrirPopupArchivage:vs,previsualiserCouleur:Fn,renommerChecklist:Qn,retirerEtiquetteFiche:hn,retirerLienFiche:ss,retirerPieceJointe:cs,supprimerChecklist:Yn,supprimerCommentaire:hs,supprimerItemChecklist:Xn,toggleColonne:ys})}));
