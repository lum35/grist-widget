(function(t){typeof define=="function"&&define.amd?define(t):t()})((function(){"use strict";let t,d;const f=new Date("3000-01-01"),g="#DCDCDC",y="#000000";let I,h=[];window.addEventListener("load",async e=>{t=new WidgetSDK,d=await t.loadTranslations(["widget.js"]);const a=`If empty, the widget use the column properties (based on choices or references) to make the list. Else, you can either:
• Provides a list, separated by ";"
• Provides a reference to a table or a column starting with a "$" ($TableID or $TableID.ColumnID)`;t.configureOptions([WidgetSDK.newItem("columns",null,"Behavior","Configure the behavior of each columns","Columns",{columnId:"STATUT",template:[WidgetSDK.newItem("addbutton",!0,"Can add card","If checked, display a button to add card to the column."),WidgetSDK.newItem("isdone",!1,"Is done","If checked, cards in the columns are considered as over."),WidgetSDK.newItem("useconfetti",!1,"Use confetti","If checked, confetti apprear when a card enter in the column."),WidgetSDK.newItem("hidecolumn",!1,"Hide","If checked, the column is hidden.")]}),WidgetSDK.newItem("ref","","References","List of task references available.","Cards options",{description:a,columnId:"REFERENCE_PROJET",type:"lookup"}),WidgetSDK.newItem("types","","Type","List of task types available.","Cards options",{description:a,columnId:"TYPE",type:"lookup"}),WidgetSDK.newItem("incharge","","In charge","List of people that can be in charge of the task.","Cards options",{description:a,columnId:"RESPONSABLE",type:"lookup"}),WidgetSDK.newItem("cardcolor","","Card color","List of color available for card background.","Cards options",{description:a,columnId:"COULEUR",type:"lookup"}),WidgetSDK.newItem("rotation",!0,"Tilt","If checked, cards are randomly tilted.","Display"),WidgetSDK.newItem("compact",!1,"Compact","If checked, use a compact rendering.","Display"),WidgetSDK.newItem("readonly",!1,"Read only","If checked, kanban is ready only.","Display"),WidgetSDK.newItem("hideedit",!1,"Hide editing form","If checked, hide the editing form when click on a card.","Display"),WidgetSDK.newItem("gristeditcard",!1,"Grist Record Card","If checked, opens the grist record card on double click.","Display")],"#config-view","#main-view",{onOptChange:b,onOptLoad:b}),t.initMetaData(),t.ready({requiredAccess:"full",allowSelectBy:!0,columns:[{name:"STATUT",title:"Status",description:"Defines the Kanban column",type:"Choice",strictType:!0},{name:"DESCRIPTION",title:"Task",description:"Task name",type:"Any"},{name:"DESCRIPTION_DISPLAY",title:"Task Display",description:"Displayed card content (e.g. a formula column adding html)",type:"Any",optional:!0},{name:"DEADLINE",title:"Deadline",description:"Can also be use as priority",type:"Date",optional:!0},{name:"REFERENCE_PROJET",title:"Reference",description:"Reference associated with the task",type:"Any",optional:!0},{name:"TYPE",title:"Type",description:"Type associated with the task",type:"Any",optional:!0},{name:"RESPONSABLE",title:"Responsables",description:"Personnes responsables de la tâche",type:"RefList",strictType:!0,optional:!0},{name:"CREE_PAR",title:"Created by",type:"Any",optional:!0},{name:"CREE_LE",title:"Creation date",type:"DateTime",optional:!0},{name:"DERNIERE_MISE_A_JOUR",title:"Last update date",description:"Updated after any change",type:"DateTime",optional:!0},{name:"NOTES",title:"Notes",description:"Additional notes",type:"Any",optional:!0},{name:"COULEUR",title:"Card color",description:"Choice or html value",type:"Choice,Text",optional:!0},{name:"TAGS",title:"Tags",description:"Additional fields to display",type:"Any",optional:!0,allowMultiple:!0}]}),t.onRecords(v,{expandRefs:!0,keepEncoded:!1,mapRef:!1}),t.isLoaded().then(async()=>{t.initDone=!0}),grist.on("message",async n=>{n.mappingsChange&&O()})});async function v(e){I=e;const a=document.getElementById("conteneur-kanban");a.innerHTML="";const n=await t.col.STATUT.getChoices();if(!n||n.length===0){console.error(d("No choice available in the Status column"));return}let r;n.forEach((o,i)=>{r=L(o,i),r!=null&&a.appendChild(r)}),e?.length>0&&(e.forEach(o=>{const i=U(o),s=document.querySelector(`.contenu-colonne[data-statut="${o.STATUT}"]`);s&&s.insertBefore(i,s.firstChild)}),t.opt.readonly||document.querySelectorAll(".contenu-colonne").forEach(o=>{new Sortable(o,{group:"kanban-todo",animation:150,onEnd:async function(i){const s=i.to.dataset.statut;if(s===i.from.dataset.statut){if(t.map.DEADLINE){let l=i.item.dataset.deadline||"9999-12-31";if(i.oldIndex!==i.newIndex&&new Date(l)>=f){let m=f.getFullYear(),u=[];document.querySelectorAll(".contenu-colonne").forEach(c=>{c.getAttribute("data-statut")===s&&c.querySelectorAll(".carte").forEach(async E=>{l=E.getAttribute("data-deadline")||"9999-12-31",new Date(l)>=f&&(l=`${m}-01-01`,E.setAttribute("data-deadline",l),m+=1,u.push(t.formatRecord(E.getAttribute("data-todo-id"),{DEADLINE:l})))})});try{await t.updateRecords(u)}catch(c){console.error(d("Error during status update:"),c)}}}}else try{await A(i.item.dataset.todoId,"STATUT",s)}catch(l){console.error(d("Error during status update:"),l)}D(o)}}),D(o)}),document.querySelectorAll(".colonne-kanban").forEach(P))}async function b(e){await t.isMapped(),v(I)}function L(e,a){const n=t.opt.columns[a];if(n.hidecolumn)return null;const r=document.createElement("div");return r.className=`colonne-kanban${!n.addbutton&&!t.opt.compact?" colonne-nobouton":""}`,r.id=e,localStorage.getItem(`column-todo-${e}`)==="true"&&r.classList.add("collapsed"),r.innerHTML=`
        <div class="entete-colonne" style="background-color: ${t.col.STATUT.getColor(e)??g};color:${t.col.STATUT.getTextColor(e)??y}">
            <div class="titre-statut">${e} <span class="compteur-colonne">(0)</span></div>
            ${n.addbutton&&!t.opt.readonly?`
            <button class="bouton-ajouter-entete ${t.opt.compact?" compact":""}" onclick="creerNouvelleTache('${e}')">+</button>
            `:""}
            <button class="bouton-toggle" onclick="toggleColonne(this.closest('.colonne-kanban'), event)">⇄</button>
        </div>
        ${n.addbutton&&!t.opt.readonly?`
            <button class="bouton-ajouter ${t.opt.compact?" compact":""}" onclick="creerNouvelleTache('${e}')">+ ${d("Add a new task")}</button>
        `:""}
        <div class="contenu-colonne" data-statut="${e}"></div>
    `,r}function O(){const e=document.getElementsByClassName("colonne-kanban");Array.prototype.forEach.call(e,a=>{a.style=`background-color: ${t.col.STATUT.getColor(a.id)??g};color:${t.col.STATUT.getTextColor(a.id)??y}`}),N()}async function N(){await t.isMapped(),h=[],t.map.TAGS&&(h=await t.map.TAGS.map(async e=>await(await t.meta.getColMeta(e))?.getChoices()??[]),h=await Promise.all(h))}function U(e){const a=document.createElement("div");a.className=`carte ${t.opt.rotation?"":" norotate"}${t.opt.compact?" compact":""}`,a.setAttribute("data-todo-id",e.id),a.setAttribute("data-last-update",e.DERNIERE_MISE_A_JOUR||""),a.setAttribute("data-deadline",e.DEADLINE||""),e.COULEUR&&t.col.COULEUR.type==="Choice"&&(t.col.COULEUR.getColor(e.COULEUR)?a.setAttribute("style",`background-color: ${t.col.COULEUR.getColor(e.COULEUR)}`):a.setAttribute("style",`background-color: ${(e.COULEUR.startsWith("#")?"":"#")+e.COULEUR}`));const n=e.TYPE||"",r=e.DESCRIPTION_DISPLAY||e.DESCRIPTION||d("No description"),o=e.DEADLINE?C(e.DEADLINE):"",i=Array.isArray(e.RESPONSABLE)?e.RESPONSABLE.filter(Boolean):e.RESPONSABLE?[e.RESPONSABLE]:[],s=i.map(E=>`
    <span class="responsable-badge">
      ${E}
    </span>
  `).join(""),l=e.REFERENCE_PROJET,m=e.TAGS||[];let u="";m.forEach(E=>u+=E?`<div class="more-tag">${E}</div>`:"");const c=t.getValueListOption("columns",e.STATUT);return a.innerHTML=`
    ${l&&l.length>0?`<div class="projet-ref truncate">#${l}</div>`:""}
    ${n?`<div class="type-tag truncate">${n}</div>`:l&&l.length>0?"<div>&nbsp;</div>":""}
    ${m.length>0?`<div>${u}</div>`:""}
    <div class="description">${r}</div>
    ${o?`<div class="deadline${e.DEADLINE<Date.now()?" late":""} truncate">📅 ${o}</div>`:i.length?"<div>&nbsp;</div>":""}
    ${i.length?`<div class="responsables-list">${s}</div>`:""}
    ${c?.isdone?`<div class="tampon-termine" style="color: ${t.col.STATUT.getColor(e.STATUT)??g};">${e.STATUT}</div>`:""}      
`,a.addEventListener("click",()=>{grist.setCursorPos({rowId:e.id}),t.opt.hideedit||R(e)}),a.addEventListener("dblclick",()=>{grist.setCursorPos({rowId:e.id}),t.opt.gristeditcard?grist.commandApi.run("viewAsCard"):t.opt.hideedit||R(e)}),a}async function A(e,a,n,r){try{if(r?.stopPropagation(),a==="STATUT"){const i=t.getValueListOption("columns",n);i&&i.useconfetti&&B()}let o={[a]:n||void 0};t.map.DERNIERE_MISE_A_JOUR&&(o.DERNIERE_MISE_A_JOUR=new Date().toISOString()),await t.updateRecords(t.formatRecord(e,o))}catch(o){console.error(d("Error during update:"),o)}}function D(e){const a=Array.from(e.children),n=e.dataset.isdone;a.sort((r,o)=>{let i=0;if(t.map.DEADLINE)if(n){const s=r.getAttribute("data-last-update")||"1970-01-01",l=o.getAttribute("data-last-update")||"1970-01-01";i=new Date(l)-new Date(s)}else{const s=r.getAttribute("data-deadline")||"9999-12-31",l=o.getAttribute("data-deadline")||"9999-12-31";i=new Date(s)-new Date(l)}if(i===0){const s=parseInt(r.getAttribute("data-todo-id"))||0,l=parseInt(o.getAttribute("data-todo-id"))||0;return s-l}else return i}),a.forEach(r=>e.appendChild(r))}function P(e){const a=e.querySelector(".contenu-colonne"),n=e.querySelector(".compteur-colonne");a&&n&&(n.textContent=`(${a.children.length})`)}function R(e){const a=document.getElementById("popup-todo"),n=document.querySelector(".carte.active"),r=document.querySelector(`[data-todo-id="${e.id}"]`),o=t.getValueListOption("columns",e.STATUT);if(t.opt.readonly){T();return}n?.classList.remove("active"),r?.classList.add("active"),a.style=`border-left-color: ${t.col.STATUT.getColor(e.STATUT)??g}`,a.dataset.statut=e.STATUT,a.dataset.isdone=o?!1:o.isdone,a.dataset.currentTodo=e.id;const i=a.querySelector(".popup-title"),s=a.querySelector(".popup-content"),l=a.querySelector(".popup-header");l.style=`background-color: ${t.col.STATUT.getColor(e.STATUT)??g};color:${t.col.STATUT.getTextColor(e.STATUT)??y}`;const m=a.querySelector(".bouton-fermer");m.style=`color:${t.col.STATUT.getTextColor(e.STATUT)??y}`,i.textContent=e.DESCRIPTION||d("New task");let u=1,c='<div class="field-row">';t.map.DEADLINE&&(c+=`
            <div class="field">
            <label class="field-label">${t.map.DEADLINE}</label>
            <input type="date" class="field-input" 
                    value="${F(e.DEADLINE)}"
                    onchange="mettreAJourChamp(${e.id}, 'DEADLINE', this.value, event)">
            </div>
        `),t.map.REFERENCE_PROJET&&(c+=S(e.id,e.REFERENCE_PROJET,t.valuesList.ref,t.map.REFERENCE_PROJET,"REFERENCE_PROJET",t.col.REFERENCE_PROJET.getIsFormula()),u+=1),u%2===0&&(c+='</div><div class="field-row">'),t.map.TYPE&&(c+=S(e.id,e.TYPE,t.valuesList.types,t.map.TYPE,"TYPE",t.col.TYPE.getIsFormula()),u+=1),u%2===0&&(c+='</div><div class="field-row">'),t.map.RESPONSABLE&&(c+=_(e.id,e.RESPONSABLE,t.valuesList.incharge,t.map.RESPONSABLE,"RESPONSABLE",t.col.RESPONSABLE.getIsFormula()),u+=1),u%2===0&&(c+='</div><div class="field-row">'),t.map.TAGS&&t.map.TAGS.forEach((E,p)=>{c+=S(e.id,e.TAGS[p],h[p],E,E,t.col.TAGS[p].getIsFormula()),u+=1,u%2===0&&(c+='</div><div class="field-row">')}),t.map.COULEUR&&(c+=S(e.id,e.COULEUR,t.valuesList.cardcolor,t.map.COULEUR,"COULEUR"),t.col.COULEUR.getIsFormula(),u+=1),c+=`</div>
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
                ${d("Created")} ${t.map.CREE_LE&&e.CREE_LE?d("on %on",{on:C(e.CREE_LE)}):""} 
                ${t.map.CREE_PAR&&e.CREE_PAR?d("by %by",{by:e.CREE_PAR||"-"}):""}
                ${t.map.DERNIERE_MISE_A_JOUR&&e.DERNIERE_MISE_A_JOUR?"<br>"+d("Last update on %on",{on:C(e.DERNIERE_MISE_A_JOUR)||"-"}):""}
            </div>
        `),t.opt.readonly||(c+=` 
          <div class="popup-actions">
            <button class="popup-action-button bouton-supprimer" onclick="supprimerTodo(${e.id}, event)" 
                    title="${d("Remove the task")}">🗑️</button>
          </div>
        `),s.innerHTML=c,setTimeout(()=>{document.querySelectorAll(".auto-expand").forEach(p=>{p.style.height="",p.style.height=p.scrollHeight+"px"})},0),a.classList.add("visible")}function S(e,a,n,r,o,i){let s="";return n?.length>0?n.length<10?(s+=`
                <div class="field">
                    <label class="field-label">${r}</label>
                    <select class="field-select" onchange="mettreAJourChamp(${e}, '${o}', this.value, event)">
                    <option value="" ${i?"disabled":""}></option>`,n.forEach(l=>{s+=`<option value="${l}" ${a===l?"selected":""}>${l}</option>`}),s+=`</select>
                </div>        
            `):(s+=`
                <div class="field">
                    <label class="field-label">${r}</label>
                    <input type="text" list="list-${o}" class="field-select" onchange="mettreAJourChamp(${e}, '${o}', this.value, event)" ${i?"disabled":""}/>
                    <datalist id="list-${o}">`,n.forEach(l=>{s+=`<option value="${l}" ${a===l?"selected":""}>${l}</option>`}),s+=`</datalist>
                </div>        
            `):s+=`
            <div class="field">
                <label class="field-label">${r}</label>
                <input type="text" class="field-input" value="${a||""}" 
                    onchange="mettreAJourChamp(${e}, '${o}', this.value, event)" ${i?"disabled":""}>
            </div>
        `,s}function $(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function _(e,a,n,r,o,i){const l=(Array.isArray(a)?a:a?[a]:[]).map(String).filter(p=>p&&p!=="#KeyError"),m=new Set(l),c=[...new Set((n||[]).map(String).filter(p=>p&&p!=="#KeyError"))].map(p=>{const w=$(p);return`
            <label class="multi-option">
                <input
                    type="checkbox"
                    value="${w}"
                    ${m.has(p)?"checked":""}
                    onchange="mettreAJourChampMultiple(${e}, '${o}', this.closest('.multi-dropdown'), event)"
                    ${i?"disabled":""}
                >
                <span>${w}</span>
            </label>
        `}).join(""),E=l.length?l.map($).join(", "):"Choisir…";return`
        <div class="field">
            <label class="field-label">${r}</label>

            <details class="multi-dropdown">
                <summary>${E}</summary>

                <div class="multi-dropdown-menu">
                    ${c||'<div class="multi-empty">Aucun membre disponible</div>'}
                </div>
            </details>
        </div>
    `}async function k(e,a,n,r){r?.stopPropagation();const o=Array.from(n.querySelectorAll('input[type="checkbox"]:checked')).map(s=>s.value),i=n.querySelector("summary");i&&(i.textContent=o.length?o.join(", "):"Choisir…"),await A(e,a,o,r)}function T(){const e=document.getElementById("popup-todo"),a=e.dataset.currentTodo,n=document.querySelector(`[data-todo-id="${a}"]`);n&&n.classList.remove("active"),e.classList.remove("visible")}document.addEventListener("keydown",e=>{e.key==="Escape"&&T()}),document.addEventListener("click",e=>{const a=document.getElementById("popup-todo");a.classList.contains("visible")&&!a.querySelector(".popup-content").contains(e.target)&&!e.target.closest(".carte")&&!e.target.closest(".popup-header")&&T()});async function J(e){try{let a={DESCRIPTION:"",STATUT:e};t.map.TYPE&&!t.col.TYPE.getIsFormula()&&(a.TYPE=""),t.map.REFERENCE_PROJET&&!t.col.REFERENCE_PROJET.getIsFormula()&&(a.REFERENCE_PROJET=null),t.map.DERNIERE_MISE_A_JOUR&&!t.col.DERNIERE_MISE_A_JOUR.getIsFormula()&&(a.DERNIERE_MISE_A_JOUR=new Date().toISOString()),t.map.CREE_LE&&!t.col.CREE_LE.getIsFormula()&&(a.CREE_LE=new Date().toISOString());const n=await t.createRecords({fields:a});if(n.id&&n.id>0){const r=await t.fetchSelectedRecord(n.id);grist.setCursorPos({rowId:n.id}),t.opt.hideedit||R(r)}}catch(a){console.error(d("Error on creation:"),a)}}async function x(e,a){if(a?.stopPropagation(),confirm(d("Are you sure you want to delete this task?")))try{await t.destroyRecords(e),T()}catch(n){console.error(d("Error on delete:"),n)}}function M(e,a){a?.stopPropagation(),e.classList.toggle("collapsed"),localStorage.setItem(`column-todo-${e.querySelector(".titre-statut").textContent.trim()}`,e.classList.contains("collapsed"))}function B(){const a=Date.now()+2e3,n={startVelocity:30,spread:360,ticks:60,zIndex:0};function r(i,s){return Math.random()*(s-i)+i}const o=setInterval(function(){const i=a-Date.now();if(i<=0)return clearInterval(o);const s=50*(i/2e3);confetti(Object.assign({},n,{particleCount:s,origin:{x:r(.1,.3),y:Math.random()-.2}})),confetti(Object.assign({},n,{particleCount:s,origin:{x:r(.7,.9),y:Math.random()-.2}}))},250)}function C(e){if(!e)return"-";const a=new Date(e);if(a>=f)return null;const n=a.getDate().toString().padStart(2,"0"),r=a.toLocaleDateString(t.cultureFull,{month:"short"}),o=a.getFullYear();return`${n} ${r} ${o}`}function F(e){if(!e)return"";try{const a=new Date(e);return a>=f?"":a.toISOString().split("T")[0]}catch(a){return console.error(d("Error on date formating:"),a),""}}window.toggleColonne=M,window.togglePopupTodo=R,window.fermerPopup=T,window.mettreAJourChamp=A,window.creerNouvelleTache=J,window.supprimerTodo=x,window.mettreAJourChampMultiple=k}));
