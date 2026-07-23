(function(t){typeof define=="function"&&define.amd?define(t):t()})((function(){"use strict";let t,u;const f=new Date("3000-01-01"),g="#DCDCDC",y="#000000";let b,h=[];window.addEventListener("load",async e=>{t=new WidgetSDK,u=await t.loadTranslations(["widget.js"]);const a=`If empty, the widget use the column properties (based on choices or references) to make the list. Else, you can either:
• Provides a list, separated by ";"
• Provides a reference to a table or a column starting with a "$" ($TableID or $TableID.ColumnID)`;t.configureOptions([WidgetSDK.newItem("columns",null,"Behavior","Configure the behavior of each columns","Columns",{columnId:"STATUT",template:[WidgetSDK.newItem("addbutton",!0,"Can add card","If checked, display a button to add card to the column."),WidgetSDK.newItem("isdone",!1,"Is done","If checked, cards in the columns are considered as over."),WidgetSDK.newItem("useconfetti",!1,"Use confetti","If checked, confetti apprear when a card enter in the column."),WidgetSDK.newItem("hidecolumn",!1,"Hide","If checked, the column is hidden.")]}),WidgetSDK.newItem("ref","","References","List of task references available.","Cards options",{description:a,columnId:"REFERENCE_PROJET",type:"lookup"}),WidgetSDK.newItem("types","","Type","List of task types available.","Cards options",{description:a,columnId:"TYPE",type:"lookup"}),WidgetSDK.newItem("incharge","","In charge","List of people that can be in charge of the task.","Cards options",{description:a,columnId:"RESPONSABLE",type:"lookup"}),WidgetSDK.newItem("cardcolor","","Card color","List of color available for card background.","Cards options",{description:a,columnId:"COULEUR",type:"lookup"}),WidgetSDK.newItem("rotation",!0,"Tilt","If checked, cards are randomly tilted.","Display"),WidgetSDK.newItem("compact",!1,"Compact","If checked, use a compact rendering.","Display"),WidgetSDK.newItem("readonly",!1,"Read only","If checked, kanban is ready only.","Display"),WidgetSDK.newItem("hideedit",!1,"Hide editing form","If checked, hide the editing form when click on a card.","Display"),WidgetSDK.newItem("gristeditcard",!1,"Grist Record Card","If checked, opens the grist record card on double click.","Display")],"#config-view","#main-view",{onOptChange:D,onOptLoad:D}),t.initMetaData(),t.ready({requiredAccess:"full",allowSelectBy:!0,columns:[{name:"STATUT",title:"Status",description:"Defines the Kanban column",type:"Choice",strictType:!0},{name:"DESCRIPTION",title:"Task",description:"Task name",type:"Any"},{name:"DESCRIPTION_DISPLAY",title:"Task Display",description:"Displayed card content (e.g. a formula column adding html)",type:"Any",optional:!0},{name:"DEADLINE",title:"Deadline",description:"Can also be use as priority",type:"Date",optional:!0},{name:"REFERENCE_PROJET",title:"Reference",description:"Reference associated with the task",type:"Any",optional:!0},{name:"TYPE",title:"Type",description:"Type associated with the task",type:"Any",optional:!0},{name:"RESPONSABLE",title:"Responsables",description:"Personnes responsables de la tâche",type:"RefList",strictType:!0,optional:!0},{name:"CREE_PAR",title:"Created by",type:"Any",optional:!0},{name:"CREE_LE",title:"Creation date",type:"DateTime",optional:!0},{name:"DERNIERE_MISE_A_JOUR",title:"Last update date",description:"Updated after any change",type:"DateTime",optional:!0},{name:"NOTES",title:"Notes",description:"Additional notes",type:"Any",optional:!0},{name:"COULEUR",title:"Card color",description:"Choice or html value",type:"Choice,Text",optional:!0},{name:"TAGS",title:"Tags",description:"Additional fields to display",type:"Any",optional:!0,allowMultiple:!0}]}),t.onRecords(v,{expandRefs:!1,keepEncoded:!1,mapRef:!0}),t.isLoaded().then(async()=>{t.initDone=!0}),grist.on("message",async n=>{n.mappingsChange&&N()})});async function v(e){b=e;const a=document.getElementById("conteneur-kanban");a.innerHTML="";const n=await t.col.STATUT.getChoices();if(!n||n.length===0){console.error(u("No choice available in the Status column"));return}let r;n.forEach((i,o)=>{r=O(i,o),r!=null&&a.appendChild(r)}),e?.length>0&&(e.forEach(i=>{const o=P(i),s=document.querySelector(`.contenu-colonne[data-statut="${i.STATUT}"]`);s&&s.insertBefore(o,s.firstChild)}),t.opt.readonly||document.querySelectorAll(".contenu-colonne").forEach(i=>{new Sortable(i,{group:"kanban-todo",animation:150,onEnd:async function(o){const s=o.to.dataset.statut;if(s===o.from.dataset.statut){if(t.map.DEADLINE){let l=o.item.dataset.deadline||"9999-12-31";if(o.oldIndex!==o.newIndex&&new Date(l)>=f){let E=f.getFullYear(),p=[];document.querySelectorAll(".contenu-colonne").forEach(c=>{c.getAttribute("data-statut")===s&&c.querySelectorAll(".carte").forEach(async m=>{l=m.getAttribute("data-deadline")||"9999-12-31",new Date(l)>=f&&(l=`${E}-01-01`,m.setAttribute("data-deadline",l),E+=1,p.push(t.formatRecord(m.getAttribute("data-todo-id"),{DEADLINE:l})))})});try{await t.updateRecords(p)}catch(c){console.error(u("Error during status update:"),c)}}}}else try{await A(o.item.dataset.todoId,"STATUT",s)}catch(l){console.error(u("Error during status update:"),l)}$(i)}}),$(i)}),document.querySelectorAll(".colonne-kanban").forEach(_))}async function D(e){await t.isMapped(),v(b)}function O(e,a){const n=t.opt.columns[a];if(n.hidecolumn)return null;const r=document.createElement("div");return r.className=`colonne-kanban${!n.addbutton&&!t.opt.compact?" colonne-nobouton":""}`,r.id=e,localStorage.getItem(`column-todo-${e}`)==="true"&&r.classList.add("collapsed"),r.innerHTML=`
        <div class="entete-colonne" style="background-color: ${t.col.STATUT.getColor(e)??g};color:${t.col.STATUT.getTextColor(e)??y}">
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
    `,r}function N(){const e=document.getElementsByClassName("colonne-kanban");Array.prototype.forEach.call(e,a=>{a.style=`background-color: ${t.col.STATUT.getColor(a.id)??g};color:${t.col.STATUT.getTextColor(a.id)??y}`}),U()}async function U(){await t.isMapped(),h=[],t.map.TAGS&&(h=await t.map.TAGS.map(async e=>await(await t.meta.getColMeta(e))?.getChoices()??[]),h=await Promise.all(h))}function P(e){const a=document.createElement("div");a.className=`carte ${t.opt.rotation?"":" norotate"}${t.opt.compact?" compact":""}`,a.setAttribute("data-todo-id",e.id),a.setAttribute("data-last-update",e.DERNIERE_MISE_A_JOUR||""),a.setAttribute("data-deadline",e.DEADLINE||""),e.COULEUR&&t.col.COULEUR.type==="Choice"&&(t.col.COULEUR.getColor(e.COULEUR)?a.setAttribute("style",`background-color: ${t.col.COULEUR.getColor(e.COULEUR)}`):a.setAttribute("style",`background-color: ${(e.COULEUR.startsWith("#")?"":"#")+e.COULEUR}`));const n=e.TYPE||"",r=e.DESCRIPTION_DISPLAY||e.DESCRIPTION||u("No description"),i=e.DEADLINE?I(e.DEADLINE):"",o=(Array.isArray(e.RESPONSABLE)?e.RESPONSABLE:e.RESPONSABLE?[e.RESPONSABLE]:[]).map(String).filter(d=>d&&d!=="#KeyError"),s=o[0],l=s?`
        <span class="responsable-badge">
            ${C(s)}
        </span>

        ${o.length>1?`<span class="responsable-badge responsable-plus">+${o.length-1}</span>`:""}
    `:"",E=e.REFERENCE_PROJET,p=e.TAGS||[];let c="";p.forEach(d=>c+=d?`<div class="more-tag">${d}</div>`:"");const m=t.getValueListOption("columns",e.STATUT);return a.innerHTML=`
    ${E&&E.length>0?`<div class="projet-ref truncate">#${E}</div>`:""}
    ${n?`<div class="type-tag truncate">${n}</div>`:E&&E.length>0?"<div>&nbsp;</div>":""}
    ${p.length>0?`<div>${c}</div>`:""}
    <div class="description">${r}</div>
    ${i?`<div class="deadline${e.DEADLINE<Date.now()?" late":""} truncate">📅 ${i}</div>`:o.length?"<div>&nbsp;</div>":""}
    ${o.length?`<div class="responsables-list">${l}</div>`:""}
    ${m?.isdone?`<div class="tampon-termine" style="color: ${t.col.STATUT.getColor(e.STATUT)??g};">${e.STATUT}</div>`:""}      
`,a.addEventListener("click",()=>{grist.setCursorPos({rowId:e.id}),t.opt.hideedit||R(e)}),a.addEventListener("dblclick",()=>{grist.setCursorPos({rowId:e.id}),t.opt.gristeditcard?grist.commandApi.run("viewAsCard"):t.opt.hideedit||R(e)}),a}async function A(e,a,n,r){try{if(r?.stopPropagation(),a==="STATUT"){const o=t.getValueListOption("columns",n);o&&o.useconfetti&&B()}let i={[a]:n||void 0};t.map.DERNIERE_MISE_A_JOUR&&(i.DERNIERE_MISE_A_JOUR=new Date().toISOString()),await t.updateRecords(t.formatRecord(e,i))}catch(i){console.error(u("Error during update:"),i)}}function $(e){const a=Array.from(e.children),n=e.dataset.isdone;a.sort((r,i)=>{let o=0;if(t.map.DEADLINE)if(n){const s=r.getAttribute("data-last-update")||"1970-01-01",l=i.getAttribute("data-last-update")||"1970-01-01";o=new Date(l)-new Date(s)}else{const s=r.getAttribute("data-deadline")||"9999-12-31",l=i.getAttribute("data-deadline")||"9999-12-31";o=new Date(s)-new Date(l)}if(o===0){const s=parseInt(r.getAttribute("data-todo-id"))||0,l=parseInt(i.getAttribute("data-todo-id"))||0;return s-l}else return o}),a.forEach(r=>e.appendChild(r))}function _(e){const a=e.querySelector(".contenu-colonne"),n=e.querySelector(".compteur-colonne");a&&n&&(n.textContent=`(${a.children.length})`)}function R(e){const a=document.getElementById("popup-todo"),n=document.querySelector(".carte.active"),r=document.querySelector(`[data-todo-id="${e.id}"]`),i=t.getValueListOption("columns",e.STATUT);if(t.opt.readonly){T();return}n?.classList.remove("active"),r?.classList.add("active"),a.style=`border-left-color: ${t.col.STATUT.getColor(e.STATUT)??g}`,a.dataset.statut=e.STATUT,a.dataset.isdone=i?!1:i.isdone,a.dataset.currentTodo=e.id;const o=a.querySelector(".popup-title"),s=a.querySelector(".popup-content"),l=a.querySelector(".popup-header");l.style=`background-color: ${t.col.STATUT.getColor(e.STATUT)??g};color:${t.col.STATUT.getTextColor(e.STATUT)??y}`;const E=a.querySelector(".bouton-fermer");E.style=`color:${t.col.STATUT.getTextColor(e.STATUT)??y}`,o.textContent=e.DESCRIPTION||u("New task");let p=1,c='<div class="field-row">';t.map.DEADLINE&&(c+=`
            <div class="field">
            <label class="field-label">${t.map.DEADLINE}</label>
            <input type="date" class="field-input" 
                    value="${K(e.DEADLINE)}"
                    onchange="mettreAJourChamp(${e.id}, 'DEADLINE', this.value, event)">
            </div>
        `),t.map.REFERENCE_PROJET&&(c+=S(e.id,e.REFERENCE_PROJET,t.valuesList.ref,t.map.REFERENCE_PROJET,"REFERENCE_PROJET",t.col.REFERENCE_PROJET.getIsFormula()),p+=1),p%2===0&&(c+='</div><div class="field-row">'),t.map.TYPE&&(c+=S(e.id,e.TYPE,t.valuesList.types,t.map.TYPE,"TYPE",t.col.TYPE.getIsFormula()),p+=1),p%2===0&&(c+='</div><div class="field-row">'),t.map.RESPONSABLE&&(c+=k(e.id,e.RESPONSABLE,t.valuesList.incharge,t.map.RESPONSABLE,"RESPONSABLE",t.col.RESPONSABLE.getIsFormula()),p+=1),p%2===0&&(c+='</div><div class="field-row">'),t.map.TAGS&&t.map.TAGS.forEach((m,d)=>{c+=S(e.id,e.TAGS[d],h[d],m,m,t.col.TAGS[d].getIsFormula()),p+=1,p%2===0&&(c+='</div><div class="field-row">')}),t.map.COULEUR&&(c+=S(e.id,e.COULEUR,t.valuesList.cardcolor,t.map.COULEUR,"COULEUR"),t.col.COULEUR.getIsFormula(),p+=1),c+=`</div>
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
                ${u("Created")} ${t.map.CREE_LE&&e.CREE_LE?u("on %on",{on:I(e.CREE_LE)}):""} 
                ${t.map.CREE_PAR&&e.CREE_PAR?u("by %by",{by:e.CREE_PAR||"-"}):""}
                ${t.map.DERNIERE_MISE_A_JOUR&&e.DERNIERE_MISE_A_JOUR?"<br>"+u("Last update on %on",{on:I(e.DERNIERE_MISE_A_JOUR)||"-"}):""}
            </div>
        `),t.opt.readonly||(c+=` 
          <div class="popup-actions">
            <button class="popup-action-button bouton-supprimer" onclick="supprimerTodo(${e.id}, event)" 
                    title="${u("Remove the task")}">🗑️</button>
          </div>
        `),s.innerHTML=c,setTimeout(()=>{document.querySelectorAll(".auto-expand").forEach(d=>{d.style.height="",d.style.height=d.scrollHeight+"px"})},0),a.classList.add("visible")}function S(e,a,n,r,i,o){let s="";return n?.length>0?n.length<10?(s+=`
                <div class="field">
                    <label class="field-label">${r}</label>
                    <select class="field-select" onchange="mettreAJourChamp(${e}, '${i}', this.value, event)">
                    <option value="" ${o?"disabled":""}></option>`,n.forEach(l=>{s+=`<option value="${l}" ${a===l?"selected":""}>${l}</option>`}),s+=`</select>
                </div>        
            `):(s+=`
                <div class="field">
                    <label class="field-label">${r}</label>
                    <input type="text" list="list-${i}" class="field-select" onchange="mettreAJourChamp(${e}, '${i}', this.value, event)" ${o?"disabled":""}/>
                    <datalist id="list-${i}">`,n.forEach(l=>{s+=`<option value="${l}" ${a===l?"selected":""}>${l}</option>`}),s+=`</datalist>
                </div>        
            `):s+=`
            <div class="field">
                <label class="field-label">${r}</label>
                <input type="text" class="field-input" value="${a||""}" 
                    onchange="mettreAJourChamp(${e}, '${i}', this.value, event)" ${o?"disabled":""}>
            </div>
        `,s}function C(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function w(e){return!e||e.length===0?"Choisir…":e.length===1?e[0]:`${e[0]} +${e.length-1}`}function k(e,a,n,r,i,o){const l=(Array.isArray(a)?a:a?[a]:[]).map(String).filter(d=>d&&d!=="#KeyError"),E=new Set(l),c=[...new Set((n||[]).map(String).filter(d=>d&&d!=="#KeyError"))].map(d=>{const L=C(d);return`
            <label class="multi-option">
                <input
                    type="checkbox"
                    value="${L}"
                    ${E.has(d)?"checked":""}
                    onchange="mettreAJourChampMultiple(${e}, '${i}', this.closest('.multi-dropdown'), event)"
                    ${o?"disabled":""}
                >
                <span>${L}</span>
            </label>
        `}).join(""),m=C(w(l));return`
        <div class="field">
            <label class="field-label">${r}</label>

            <details class="multi-dropdown">
                <summary>${m}</summary>

                <div class="multi-dropdown-menu">
                    ${c||'<div class="multi-empty">Aucun membre disponible</div>'}
                </div>
            </details>
        </div>
    `}async function J(e,a,n,r){r?.stopPropagation();const i=Array.from(n.querySelectorAll('input[type="checkbox"]:checked')).map(s=>s.value),o=n.querySelector("summary");o&&(o.textContent=w(i)),await A(e,a,i,r)}function T(){const e=document.getElementById("popup-todo"),a=e.dataset.currentTodo,n=document.querySelector(`[data-todo-id="${a}"]`);n&&n.classList.remove("active"),e.classList.remove("visible")}document.addEventListener("keydown",e=>{e.key==="Escape"&&T()}),document.addEventListener("click",e=>{const a=document.getElementById("popup-todo");a.classList.contains("visible")&&!a.querySelector(".popup-content").contains(e.target)&&!e.target.closest(".carte")&&!e.target.closest(".popup-header")&&T()});async function x(e){try{let a={DESCRIPTION:"",STATUT:e};t.map.TYPE&&!t.col.TYPE.getIsFormula()&&(a.TYPE=""),t.map.REFERENCE_PROJET&&!t.col.REFERENCE_PROJET.getIsFormula()&&(a.REFERENCE_PROJET=null),t.map.DERNIERE_MISE_A_JOUR&&!t.col.DERNIERE_MISE_A_JOUR.getIsFormula()&&(a.DERNIERE_MISE_A_JOUR=new Date().toISOString()),t.map.CREE_LE&&!t.col.CREE_LE.getIsFormula()&&(a.CREE_LE=new Date().toISOString());const n=await t.createRecords({fields:a});if(n.id&&n.id>0){const r=await t.fetchSelectedRecord(n.id);grist.setCursorPos({rowId:n.id}),t.opt.hideedit||R(r)}}catch(a){console.error(u("Error on creation:"),a)}}async function M(e,a){if(a?.stopPropagation(),confirm(u("Are you sure you want to delete this task?")))try{await t.destroyRecords(e),T()}catch(n){console.error(u("Error on delete:"),n)}}function F(e,a){a?.stopPropagation(),e.classList.toggle("collapsed"),localStorage.setItem(`column-todo-${e.querySelector(".titre-statut").textContent.trim()}`,e.classList.contains("collapsed"))}function B(){const a=Date.now()+2e3,n={startVelocity:30,spread:360,ticks:60,zIndex:0};function r(o,s){return Math.random()*(s-o)+o}const i=setInterval(function(){const o=a-Date.now();if(o<=0)return clearInterval(i);const s=50*(o/2e3);confetti(Object.assign({},n,{particleCount:s,origin:{x:r(.1,.3),y:Math.random()-.2}})),confetti(Object.assign({},n,{particleCount:s,origin:{x:r(.7,.9),y:Math.random()-.2}}))},250)}function I(e){if(!e)return"-";const a=new Date(e);if(a>=f)return null;const n=a.getDate().toString().padStart(2,"0"),r=a.toLocaleDateString(t.cultureFull,{month:"short"}),i=a.getFullYear();return`${n} ${r} ${i}`}function K(e){if(!e)return"";try{const a=new Date(e);return a>=f?"":a.toISOString().split("T")[0]}catch(a){return console.error(u("Error on date formating:"),a),""}}window.toggleColonne=F,window.togglePopupTodo=R,window.fermerPopup=T,window.mettreAJourChamp=A,window.creerNouvelleTache=x,window.supprimerTodo=M,window.mettreAJourChampMultiple=J}));
