(function(t){typeof define=="function"&&define.amd?define(t):t()})((function(){"use strict";let t,u;const h=new Date("3000-01-01"),R="#DCDCDC",y="#000000";let v,T=[];window.addEventListener("load",async e=>{t=new WidgetSDK,u=await t.loadTranslations(["widget.js"]);const a=`If empty, the widget use the column properties (based on choices or references) to make the list. Else, you can either:
• Provides a list, separated by ";"
• Provides a reference to a table or a column starting with a "$" ($TableID or $TableID.ColumnID)`;t.configureOptions([WidgetSDK.newItem("columns",null,"Behavior","Configure the behavior of each columns","Columns",{columnId:"STATUT",template:[WidgetSDK.newItem("addbutton",!0,"Can add card","If checked, display a button to add card to the column."),WidgetSDK.newItem("isdone",!1,"Is done","If checked, cards in the columns are considered as over."),WidgetSDK.newItem("useconfetti",!1,"Use confetti","If checked, confetti apprear when a card enter in the column."),WidgetSDK.newItem("hidecolumn",!1,"Hide","If checked, the column is hidden.")]}),WidgetSDK.newItem("ref","","References","List of task references available.","Cards options",{description:a,columnId:"REFERENCE_PROJET",type:"lookup"}),WidgetSDK.newItem("types","","Type","List of task types available.","Cards options",{description:a,columnId:"TYPE",type:"lookup"}),WidgetSDK.newItem("incharge","","In charge","List of people that can be in charge of the task.","Cards options",{description:a,columnId:"RESPONSABLE",type:"lookup"}),WidgetSDK.newItem("cardcolor","","Card color","List of color available for card background.","Cards options",{description:a,columnId:"COULEUR",type:"lookup"}),WidgetSDK.newItem("rotation",!0,"Tilt","If checked, cards are randomly tilted.","Display"),WidgetSDK.newItem("compact",!1,"Compact","If checked, use a compact rendering.","Display"),WidgetSDK.newItem("readonly",!1,"Read only","If checked, kanban is ready only.","Display"),WidgetSDK.newItem("hideedit",!1,"Hide editing form","If checked, hide the editing form when click on a card.","Display"),WidgetSDK.newItem("gristeditcard",!1,"Grist Record Card","If checked, opens the grist record card on double click.","Display")],"#config-view","#main-view",{onOptChange:$,onOptLoad:$}),t.initMetaData(),t.ready({requiredAccess:"full",allowSelectBy:!0,columns:[{name:"STATUT",title:"Status",description:"Defines the Kanban column",type:"Choice",strictType:!0},{name:"DESCRIPTION",title:"Task",description:"Task name",type:"Any"},{name:"DESCRIPTION_DISPLAY",title:"Task Display",description:"Displayed card content (e.g. a formula column adding html)",type:"Any",optional:!0},{name:"DEADLINE",title:"Deadline",description:"Can also be use as priority",type:"Date",optional:!0},{name:"REFERENCE_PROJET",title:"Reference",description:"Reference associated with the task",type:"Any",optional:!0},{name:"TYPE",title:"Type",description:"Type associated with the task",type:"Any",optional:!0},{name:"RESPONSABLE",title:"Responsables",description:"Personnes responsables de la tâche",type:"RefList",strictType:!0,optional:!0},{name:"CREE_PAR",title:"Created by",type:"Any",optional:!0},{name:"CREE_LE",title:"Creation date",type:"DateTime",optional:!0},{name:"DERNIERE_MISE_A_JOUR",title:"Last update date",description:"Updated after any change",type:"DateTime",optional:!0},{name:"NOTES",title:"Notes",description:"Additional notes",type:"Any",optional:!0},{name:"COULEUR",title:"Card color",description:"Choice or html value",type:"Choice,Text",optional:!0},{name:"TAGS",title:"Tags",description:"Additional fields to display",type:"Any",optional:!0,allowMultiple:!0}]}),t.onRecords(D,{expandRefs:!1,keepEncoded:!1,mapRef:!0}),t.isLoaded().then(async()=>{t.initDone=!0}),grist.on("message",async n=>{n.mappingsChange&&_()})});async function D(e){v=e;const a=document.getElementById("conteneur-kanban");a.innerHTML="";const n=await t.col.STATUT.getChoices();if(!n||n.length===0){console.error(u("No choice available in the Status column"));return}let s;n.forEach((o,i)=>{s=N(o,i),s!=null&&a.appendChild(s)}),e?.length>0&&(e.forEach(o=>{const i=P(o),r=document.querySelector(`.contenu-colonne[data-statut="${o.STATUT}"]`);r&&r.insertBefore(i,r.firstChild)}),t.opt.readonly||document.querySelectorAll(".contenu-colonne").forEach(o=>{new Sortable(o,{group:"kanban-todo",animation:150,onEnd:async function(i){const r=i.to.dataset.statut;if(r===i.from.dataset.statut){if(t.map.DEADLINE){let l=i.item.dataset.deadline||"9999-12-31";if(i.oldIndex!==i.newIndex&&new Date(l)>=h){let E=h.getFullYear(),p=[];document.querySelectorAll(".contenu-colonne").forEach(c=>{c.getAttribute("data-statut")===r&&c.querySelectorAll(".carte").forEach(async m=>{l=m.getAttribute("data-deadline")||"9999-12-31",new Date(l)>=h&&(l=`${E}-01-01`,m.setAttribute("data-deadline",l),E+=1,p.push(t.formatRecord(m.getAttribute("data-todo-id"),{DEADLINE:l})))})});try{await t.updateRecords(p)}catch(c){console.error(u("Error during status update:"),c)}}}}else try{await w(i.item.dataset.todoId,"STATUT",r)}catch(l){console.error(u("Error during status update:"),l)}L(o)}}),L(o)}),document.querySelectorAll(".colonne-kanban").forEach(k))}async function $(e){await t.isMapped(),D(v)}function N(e,a){const n=t.opt.columns[a];if(n.hidecolumn)return null;const s=document.createElement("div");return s.className=`colonne-kanban${!n.addbutton&&!t.opt.compact?" colonne-nobouton":""}`,s.id=e,localStorage.getItem(`column-todo-${e}`)==="true"&&s.classList.add("collapsed"),s.innerHTML=`
        <div class="entete-colonne" style="background-color: ${t.col.STATUT.getColor(e)??R};color:${t.col.STATUT.getTextColor(e)??y}">
            <div class="titre-statut">${e} <span class="compteur-colonne">(0)</span></div>
            ${n.addbutton&&!t.opt.readonly?`
            <button class="bouton-ajouter-entete ${t.opt.compact?" compact":""}" onclick="creerNouvelleTache('${e}')">+</button>
            `:""}
            <button class="bouton-toggle" onclick="toggleColonne(this.closest('.colonne-kanban'), event)">⇄</button>
        </div>
        ${n.addbutton&&!t.opt.readonly?`
            <button class="bouton-ajouter ${t.opt.compact?" compact":""}" onclick="creerNouvelleTache('${e}')">+ ${u("Add a new task")}</button>
        `:""}
        <div class="contenu-colonne" data-statut="${e}"></div>
    `,s}function _(){const e=document.getElementsByClassName("colonne-kanban");Array.prototype.forEach.call(e,a=>{a.style=`background-color: ${t.col.STATUT.getColor(a.id)??R};color:${t.col.STATUT.getTextColor(a.id)??y}`}),U()}async function U(){await t.isMapped(),T=[],t.map.TAGS&&(T=await t.map.TAGS.map(async e=>await(await t.meta.getColMeta(e))?.getChoices()??[]),T=await Promise.all(T))}function P(e){const a=document.createElement("div");a.className=`carte ${t.opt.rotation?"":" norotate"}${t.opt.compact?" compact":""}`,a.setAttribute("data-todo-id",e.id),a.setAttribute("data-last-update",e.DERNIERE_MISE_A_JOUR||""),a.setAttribute("data-deadline",e.DEADLINE||""),e.COULEUR&&t.col.COULEUR.type==="Choice"&&(t.col.COULEUR.getColor(e.COULEUR)?a.setAttribute("style",`background-color: ${t.col.COULEUR.getColor(e.COULEUR)}`):a.setAttribute("style",`background-color: ${(e.COULEUR.startsWith("#")?"":"#")+e.COULEUR}`));const n=e.TYPE||"",s=e.DESCRIPTION_DISPLAY||e.DESCRIPTION||u("No description"),o=e.DEADLINE?b(e.DEADLINE):"",i=(Array.isArray(e.RESPONSABLE)?e.RESPONSABLE:e.RESPONSABLE?[e.RESPONSABLE]:[]).map(String).filter(d=>d&&d!=="#KeyError"),r=i[0],l=r?`
        <span class="responsable-badge">
            ${I(r)}
        </span>

        ${i.length>1?`<span class="responsable-badge responsable-plus">+${i.length-1}</span>`:""}
    `:"",E=e.REFERENCE_PROJET,p=e.TAGS||[];let c="";p.forEach(d=>c+=d?`<div class="more-tag">${d}</div>`:"");const m=t.getValueListOption("columns",e.STATUT);return a.innerHTML=`
    ${E&&E.length>0?`<div class="projet-ref truncate">#${E}</div>`:""}
    ${n?`<div class="type-tag truncate">${n}</div>`:E&&E.length>0?"<div>&nbsp;</div>":""}
    ${p.length>0?`<div>${c}</div>`:""}
    <div class="description">${s}</div>
    ${o?`<div class="deadline${e.DEADLINE<Date.now()?" late":""} truncate">📅 ${o}</div>`:i.length?"<div>&nbsp;</div>":""}
    ${i.length?`<div class="responsables-list">${l}</div>`:""}
    ${m?.isdone?`<div class="tampon-termine" style="color: ${t.col.STATUT.getColor(e.STATUT)??R};">${e.STATUT}</div>`:""}      
`,a.addEventListener("click",()=>{grist.setCursorPos({rowId:e.id}),t.opt.hideedit||A(e)}),a.addEventListener("dblclick",()=>{grist.setCursorPos({rowId:e.id}),t.opt.gristeditcard?grist.commandApi.run("viewAsCard"):t.opt.hideedit||A(e)}),a}async function w(e,a,n,s){try{if(s?.stopPropagation(),a==="STATUT"){const i=t.getValueListOption("columns",n);i&&i.useconfetti&&q()}let o={[a]:n||void 0};t.map.DERNIERE_MISE_A_JOUR&&(o.DERNIERE_MISE_A_JOUR=new Date().toISOString()),await t.updateRecords(t.formatRecord(e,o))}catch(o){console.error(u("Error during update:"),o)}}function L(e){const a=Array.from(e.children),n=e.dataset.isdone;a.sort((s,o)=>{let i=0;if(t.map.DEADLINE)if(n){const r=s.getAttribute("data-last-update")||"1970-01-01",l=o.getAttribute("data-last-update")||"1970-01-01";i=new Date(l)-new Date(r)}else{const r=s.getAttribute("data-deadline")||"9999-12-31",l=o.getAttribute("data-deadline")||"9999-12-31";i=new Date(r)-new Date(l)}if(i===0){const r=parseInt(s.getAttribute("data-todo-id"))||0,l=parseInt(o.getAttribute("data-todo-id"))||0;return r-l}else return i}),a.forEach(s=>e.appendChild(s))}function k(e){const a=e.querySelector(".contenu-colonne"),n=e.querySelector(".compteur-colonne");a&&n&&(n.textContent=`(${a.children.length})`)}function A(e){const a=document.getElementById("popup-todo"),n=document.querySelector(".carte.active"),s=document.querySelector(`[data-todo-id="${e.id}"]`),o=t.getValueListOption("columns",e.STATUT);if(t.opt.readonly){S();return}n?.classList.remove("active"),s?.classList.add("active"),a.style=`border-left-color: ${t.col.STATUT.getColor(e.STATUT)??R}`,a.dataset.statut=e.STATUT,a.dataset.isdone=o?!1:o.isdone,a.dataset.currentTodo=e.id;const i=a.querySelector(".popup-title"),r=a.querySelector(".popup-content"),l=a.querySelector(".popup-header");l.style=`background-color: ${t.col.STATUT.getColor(e.STATUT)??R};color:${t.col.STATUT.getTextColor(e.STATUT)??y}`;const E=a.querySelector(".bouton-fermer");E.style=`color:${t.col.STATUT.getTextColor(e.STATUT)??y}`,i.textContent=e.DESCRIPTION||u("New task");let p=1,c='<div class="field-row">';t.map.DEADLINE&&(c+=`
            <div class="field">
            <label class="field-label">${t.map.DEADLINE}</label>
            <input type="date" class="field-input" 
                    value="${W(e.DEADLINE)}"
                    onchange="mettreAJourChamp(${e.id}, 'DEADLINE', this.value, event)">
            </div>
        `),t.map.REFERENCE_PROJET&&(c+=C(e.id,e.REFERENCE_PROJET,t.valuesList.ref,t.map.REFERENCE_PROJET,"REFERENCE_PROJET",t.col.REFERENCE_PROJET.getIsFormula()),p+=1),p%2===0&&(c+='</div><div class="field-row">'),t.map.TYPE&&(c+=C(e.id,e.TYPE,t.valuesList.types,t.map.TYPE,"TYPE",t.col.TYPE.getIsFormula()),p+=1),p%2===0&&(c+='</div><div class="field-row">'),t.map.RESPONSABLE&&(c+=x(e.id,e.RESPONSABLE,t.valuesList.incharge,t.map.RESPONSABLE,"RESPONSABLE",t.col.RESPONSABLE.getIsFormula()),p+=1),p%2===0&&(c+='</div><div class="field-row">'),t.map.TAGS&&t.map.TAGS.forEach((m,d)=>{c+=C(e.id,e.TAGS[d],T[d],m,m,t.col.TAGS[d].getIsFormula()),p+=1,p%2===0&&(c+='</div><div class="field-row">')}),t.map.COULEUR&&(c+=C(e.id,e.COULEUR,t.valuesList.cardcolor,t.map.COULEUR,"COULEUR"),t.col.COULEUR.getIsFormula(),p+=1),c+=`</div>
        <div class="field">
            <label class="field-label">${t.map.DESCRIPTION}</label>
            <textarea class="field-textarea auto-expand" 
                    onchange="mettreAJourChamp(${e.id}, 'DESCRIPTION', this.value, event)"
                    oninput="this.style.height = ''; this.style.height = this.scrollHeight + 'px'">${e.DESCRIPTION||""}</textarea>
        </div>
    `,t.map.NOTES&&(c+=`<div class="field">
            <label class="field-label">${t.map.NOTES}</label>
            <textarea class="field-textarea auto-expand" 
                      onchange="mettreAJourChamp(${e.id}, 'NOTES', this.value, event)"
                      oninput="this.style.height = ''; this.style.height = this.scrollHeight + 'px'">${e.NOTES||""}</textarea>
          </div>
        `),(t.map.CREE_LE&&e.CREE_LE||t.map.CREE_PAR&&e.CREE_PAR||t.map.DERNIERE_MISE_A_JOUR&&e.DERNIERE_MISE_A_JOUR)&&(c+=`<div class="info-creation">
                ${u("Created")} ${t.map.CREE_LE&&e.CREE_LE?u("on %on",{on:b(e.CREE_LE)}):""} 
                ${t.map.CREE_PAR&&e.CREE_PAR?u("by %by",{by:e.CREE_PAR||"-"}):""}
                ${t.map.DERNIERE_MISE_A_JOUR&&e.DERNIERE_MISE_A_JOUR?"<br>"+u("Last update on %on",{on:b(e.DERNIERE_MISE_A_JOUR)||"-"}):""}
            </div>
        `),t.opt.readonly||(c+=` 
          <div class="popup-actions">
            <button class="popup-action-button bouton-supprimer" onclick="supprimerTodo(${e.id}, event)" 
                    title="${u("Remove the task")}">🗑️</button>
          </div>
        `),r.innerHTML=c,setTimeout(()=>{document.querySelectorAll(".auto-expand").forEach(d=>{d.style.height="",d.style.height=d.scrollHeight+"px"})},0),a.classList.add("visible")}function C(e,a,n,s,o,i){let r="";return n?.length>0?n.length<10?(r+=`
                <div class="field">
                    <label class="field-label">${s}</label>
                    <select class="field-select" onchange="mettreAJourChamp(${e}, '${o}', this.value, event)">
                    <option value="" ${i?"disabled":""}></option>`,n.forEach(l=>{r+=`<option value="${l}" ${a===l?"selected":""}>${l}</option>`}),r+=`</select>
                </div>        
            `):(r+=`
                <div class="field">
                    <label class="field-label">${s}</label>
                    <input type="text" list="list-${o}" class="field-select" onchange="mettreAJourChamp(${e}, '${o}', this.value, event)" ${i?"disabled":""}/>
                    <datalist id="list-${o}">`,n.forEach(l=>{r+=`<option value="${l}" ${a===l?"selected":""}>${l}</option>`}),r+=`</datalist>
                </div>        
            `):r+=`
            <div class="field">
                <label class="field-label">${s}</label>
                <input type="text" class="field-input" value="${a||""}" 
                    onchange="mettreAJourChamp(${e}, '${o}', this.value, event)" ${i?"disabled":""}>
            </div>
        `,r}function I(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function J(e){return!e||e.length===0?"Choisir…":e.length===1?e[0]:`${e[0]} +${e.length-1}`}function x(e,a,n,s,o,i){const l=(Array.isArray(a)?a:a?[a]:[]).map(String).filter(d=>d&&d!=="#KeyError"),E=new Set(l),c=[...new Set((n||[]).map(String).filter(d=>d&&d!=="#KeyError"))].map(d=>{const f=I(d);return`
            <label class="multi-option">
                <input
                    type="checkbox"
                    value="${f}"
                    ${E.has(d)?"checked":""}
                    onchange="mettreAJourChampMultiple(${e}, '${o}', this.closest('.multi-dropdown'), event)"
                    ${i?"disabled":""}
                >
                <span>${f}</span>
            </label>
        `}).join(""),m=I(J(l));return`
        <div class="field">
            <label class="field-label">${s}</label>

            <details class="multi-dropdown">
                <summary>${m}</summary>

                <div class="multi-dropdown-menu">
                    ${c||'<div class="multi-empty">Aucun membre disponible</div>'}
                </div>
            </details>
        </div>
    `}async function M(e,a,n,s){s?.stopPropagation();try{const o=Array.from(n.querySelectorAll('input[type="checkbox"]:checked')).map(g=>g.value).filter(Boolean),[i,r]=t.col.RESPONSABLE.type.split(":");if(i!=="RefList"||!r)throw new Error("La colonne Responsable n’est pas une RefList valide.");const l=await grist.docApi.fetchTable(r),E=await t.col.RESPONSABLE.getMeta(t.col.RESPONSABLE.visibleCol),p=l[E.colId]||[],m=["L",...o.map(g=>{const O=p.findIndex(Y=>String(Y)===String(g));return O===-1?(console.warn(`Responsable introuvable : ${g}`),null):Number(l.id[O])}).filter(g=>Number.isInteger(g)&&g>0)],d={[a]:m};t.map.DERNIERE_MISE_A_JOUR&&(d.DERNIERE_MISE_A_JOUR=new Date().toISOString()),console.log("Envoi Responsable à Grist :",m),await t.updateRecords(t.formatRecord(e,d),!1);const f=n.querySelector("summary");f&&(o.length===0?f.textContent="Choisir…":o.length===1?f.textContent=o[0]:f.textContent=`${o.length} responsables`)}catch(o){console.error("Erreur lors de l’enregistrement des responsables :",o)}}function S(){const e=document.getElementById("popup-todo"),a=e.dataset.currentTodo,n=document.querySelector(`[data-todo-id="${a}"]`);n&&n.classList.remove("active"),e.classList.remove("visible")}document.addEventListener("keydown",e=>{e.key==="Escape"&&S()}),document.addEventListener("click",e=>{const a=document.getElementById("popup-todo");a.classList.contains("visible")&&!a.querySelector(".popup-content").contains(e.target)&&!e.target.closest(".carte")&&!e.target.closest(".popup-header")&&S()});async function B(e){try{let a={DESCRIPTION:"",STATUT:e};t.map.TYPE&&!t.col.TYPE.getIsFormula()&&(a.TYPE=""),t.map.REFERENCE_PROJET&&!t.col.REFERENCE_PROJET.getIsFormula()&&(a.REFERENCE_PROJET=null),t.map.DERNIERE_MISE_A_JOUR&&!t.col.DERNIERE_MISE_A_JOUR.getIsFormula()&&(a.DERNIERE_MISE_A_JOUR=new Date().toISOString()),t.map.CREE_LE&&!t.col.CREE_LE.getIsFormula()&&(a.CREE_LE=new Date().toISOString());const n=await t.createRecords({fields:a});if(n.id&&n.id>0){const s=await t.fetchSelectedRecord(n.id);grist.setCursorPos({rowId:n.id}),t.opt.hideedit||A(s)}}catch(a){console.error(u("Error on creation:"),a)}}async function F(e,a){if(a?.stopPropagation(),confirm(u("Are you sure you want to delete this task?")))try{await t.destroyRecords(e),S()}catch(n){console.error(u("Error on delete:"),n)}}function K(e,a){a?.stopPropagation(),e.classList.toggle("collapsed"),localStorage.setItem(`column-todo-${e.querySelector(".titre-statut").textContent.trim()}`,e.classList.contains("collapsed"))}function q(){const a=Date.now()+2e3,n={startVelocity:30,spread:360,ticks:60,zIndex:0};function s(i,r){return Math.random()*(r-i)+i}const o=setInterval(function(){const i=a-Date.now();if(i<=0)return clearInterval(o);const r=50*(i/2e3);confetti(Object.assign({},n,{particleCount:r,origin:{x:s(.1,.3),y:Math.random()-.2}})),confetti(Object.assign({},n,{particleCount:r,origin:{x:s(.7,.9),y:Math.random()-.2}}))},250)}function b(e){if(!e)return"-";const a=new Date(e);if(a>=h)return null;const n=a.getDate().toString().padStart(2,"0"),s=a.toLocaleDateString(t.cultureFull,{month:"short"}),o=a.getFullYear();return`${n} ${s} ${o}`}function W(e){if(!e)return"";try{const a=new Date(e);return a>=h?"":a.toISOString().split("T")[0]}catch(a){return console.error(u("Error on date formating:"),a),""}}window.toggleColonne=K,window.togglePopupTodo=A,window.fermerPopup=S,window.mettreAJourChamp=w,window.creerNouvelleTache=B,window.supprimerTodo=F,window.mettreAJourChampMultiple=M}));
