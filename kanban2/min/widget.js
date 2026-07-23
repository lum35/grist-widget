(function(a){typeof define=="function"&&define.amd?define(a):a()})((function(){"use strict";let a,m;const I=new Date("3000-01-01"),U="#DCDCDC",W="#000000";let T=[],k=[],A=[],h=new Map,M=null;const D=new Map;window.addEventListener("load",async()=>{a=new WidgetSDK,m=await a.loadTranslations(["widget.js"]);const e=`If empty, the widget uses the column properties (choices or references) to build the list. Otherwise, provide either:
• A list separated by ";"
• A table or column reference starting with "$" ($TableID or $TableID.ColumnID)`;a.configureOptions([WidgetSDK.newItem("columns",null,"Behavior","Configure the behavior of each column","Columns",{columnId:"STATUT",template:[WidgetSDK.newItem("addbutton",!0,"Can add card","Display a button to add a card."),WidgetSDK.newItem("isdone",!1,"Is done","Cards in this column are considered completed."),WidgetSDK.newItem("useconfetti",!1,"Use confetti","Display confetti when a card enters this column."),WidgetSDK.newItem("hidecolumn",!1,"Hide","Hide this column.")]}),WidgetSDK.newItem("ref","","References","List of task references available.","Cards options",{description:e,columnId:"REFERENCE_PROJET",type:"lookup"}),WidgetSDK.newItem("types","","Type","List of task types available.","Cards options",{description:e,columnId:"TYPE",type:"lookup"}),WidgetSDK.newItem("cardcolor","","Card color","List of colors available for card backgrounds.","Cards options",{description:e,columnId:"COULEUR",type:"lookup"}),WidgetSDK.newItem("rotation",!0,"Tilt","Randomly tilt cards.","Display"),WidgetSDK.newItem("compact",!1,"Compact","Use a compact rendering.","Display"),WidgetSDK.newItem("readonly",!1,"Read only","Disable all edits.","Display"),WidgetSDK.newItem("hideedit",!1,"Hide editing form","Do not open the editing form when clicking a card.","Display"),WidgetSDK.newItem("gristeditcard",!1,"Grist Record Card","Open the Grist record card on double click.","Display")],"#config-view","#main-view",{onOptChange:z,onOptLoad:z}),a.initMetaData(),a.ready({requiredAccess:"full",allowSelectBy:!0,columns:[{name:"STATUT",title:"Status",description:"Defines the Kanban column",type:"Choice",strictType:!0},{name:"DESCRIPTION",title:"Task",description:"Task name",type:"Any"},{name:"DESCRIPTION_DISPLAY",title:"Task Display",description:"Displayed card content, for example an HTML formula column",type:"Any",optional:!0},{name:"DEADLINE",title:"Deadline",description:"Can also be used as priority",type:"Date",optional:!0},{name:"REFERENCE_PROJET",title:"Reference",description:"Reference associated with the task",type:"Any",optional:!0},{name:"TYPE",title:"Type",description:"Type associated with the task",type:"Any",optional:!0},{name:"RESPONSABLE",title:"Responsables",description:"Personnes responsables de la tâche",type:"RefList",strictType:!0,optional:!0},{name:"CREE_PAR",title:"Created by",type:"Any",optional:!0},{name:"CREE_LE",title:"Creation date",type:"DateTime",optional:!0},{name:"DERNIERE_MISE_A_JOUR",title:"Last update date",description:"Updated after any change",type:"DateTime",optional:!0},{name:"NOTES",title:"Notes",description:"Additional notes",type:"Any",optional:!0},{name:"COULEUR",title:"Card color",description:"Choice or HTML color value",type:"Choice,Text",optional:!0},{name:"TAGS",title:"Tags",description:"Additional fields to display",type:"Any",optional:!0,allowMultiple:!0}]}),a.onRecords(L,{expandRefs:!1,keepEncoded:!1,mapRef:!0}),a.isLoaded().then(async()=>{a.initDone=!0}),grist.on("message",async t=>{t.mappingsChange&&await le()})});async function H(e=!1){if(!a?.map?.RESPONSABLE||!a?.col?.RESPONSABLE){v();return}const t=a.col.RESPONSABLE,[n,o]=String(t.type||"").split(":");if(n!=="RefList"||!o||!t.visibleCol){v();return}const r=`${o}:${t.visibleCol}`;if(!(!e&&M===r&&A.length>0))try{const[s,i]=await Promise.all([grist.docApi.fetchTable(o),t.getMeta(t.visibleCol)]),l=i?.colId,u=Array.isArray(s?.id)?s.id:[],d=l&&Array.isArray(s?.[l])?s[l]:[],E=u.map((p,S)=>{const R=Number(p),w=d[S],j=w==null?"":String(w).trim();return{id:R,label:j}}).filter(p=>Number.isInteger(p.id)&&p.id>0&&p.label&&p.label!=="#KeyError").sort((p,S)=>p.label.localeCompare(S.label,a.cultureFull,{sensitivity:"base"}));A=E,h=new Map(E.map(p=>[p.id,p])),M=r}catch(s){v(),console.error("Impossible de charger la table des responsables :",s)}}function v(){A=[],h=new Map,M=null}async function G(){await a.isMapped(),k=[];const e=g(a.map?.TAGS);e.length!==0&&(k=await Promise.all(e.map(async t=>{try{return await(await a.meta.getColMeta(t))?.getChoices()??[]}catch(n){return console.warn(`Impossible de charger les choix de ${t}`,n),[]}})))}async function L(e){T=Array.isArray(e)?e:[],await Promise.all([H(),G()]);const t=document.getElementById("conteneur-kanban");if(!t)return;t.innerHTML="";const n=await a.col.STATUT.getChoices();if(!Array.isArray(n)||n.length===0){t.innerHTML=`<div class="kanban-message">${c(m("No choice available in the Status column"))}</div>`;return}n.forEach((o,r)=>{const s=ce(o,r);s&&t.appendChild(s)}),T.forEach(o=>{const r=String(o.STATUT??""),s=Array.from(t.querySelectorAll(".contenu-colonne")).find(i=>i.dataset.statut===r);s&&s.insertBefore(ue(o),s.firstChild)}),pe(),document.querySelectorAll(".colonne-kanban").forEach(J)}async function z(){await a.isMapped(),await L(T)}async function le(){v(),await H(!0),await G(),await L(T)}function ce(e,t){const n=ae(t);if(n.hidecolumn)return null;const o=String(e),r=document.createElement("section");r.className=`colonne-kanban${!n.addbutton&&!a.opt.compact?" colonne-nobouton":""}`,r.id=o;const s=oe(o);localStorage.getItem(s)==="true"&&r.classList.add("collapsed");const i=a.col.STATUT.getColor(o)??U,l=a.col.STATUT.getTextColor(o)??W,u=c(o),d=we(o);return r.innerHTML=`
        <div class="entete-colonne" style="background-color:${i};color:${l}">
            <div class="titre-statut">${u} <span class="compteur-colonne">(0)</span></div>
            <div class="actions-colonne">
                ${n.addbutton&&!a.opt.readonly?`<button type="button" class="bouton-ajouter-entete ${a.opt.compact?"compact":""}" onclick="creerNouvelleTache(decodeURIComponent('${d}'))" aria-label="${c(m("Add a new task"))}">+</button>`:""}
                <button type="button" class="bouton-toggle" onclick="toggleColonne(this.closest('.colonne-kanban'), event)" aria-label="Replier ou déplier">⇄</button>
            </div>
        </div>
        ${n.addbutton&&!a.opt.readonly?`<button type="button" class="bouton-ajouter ${a.opt.compact?"compact":""}" onclick="creerNouvelleTache(decodeURIComponent('${d}'))">+ ${c(m("Add a new task"))}</button>`:""}
        <div class="contenu-colonne" data-statut="${b(o)}" data-isdone="${n.isdone?"true":"false"}"></div>
    `,r}function ue(e){const t=document.createElement("article");t.className=`carte${a.opt.rotation?"":" norotate"}${a.opt.compact?" compact":""}`,t.dataset.todoId=String(e.id),t.dataset.lastUpdate=se(e.DERNIERE_MISE_A_JOUR),t.dataset.deadline=se(e.DEADLINE),de(t,e.COULEUR);const n=f(e.TYPE),o=f(e.REFERENCE_PROJET),r=e.DEADLINE?F(e.DEADLINE):"",s=re(e),i=g(e.TAGS).flatMap(R=>g(R)).map(f).filter(Boolean),l=e.DESCRIPTION_DISPLAY?String(e.DESCRIPTION_DISPLAY):c(f(e.DESCRIPTION)||m("No description")),u=s.map(R=>`<span class="responsable-badge">${c(R)}</span>`).join(""),d=i.map(R=>`<span class="more-tag">${c(R)}</span>`).join(""),E=x(e.STATUT),p=q(e.DEADLINE),S=p!==null&&p<Date.now()&&p<I.getTime();return t.innerHTML=`
        ${o?`<div class="projet-ref truncate">#${c(o)}</div>`:""}
        ${n?`<div class="type-tag truncate">${c(n)}</div>`:o?'<div class="card-spacer">&nbsp;</div>':""}
        ${d?`<div class="tags-list">${d}</div>`:""}
        <div class="description">${l}</div>
        ${r?`<div class="deadline${S?" late":""} truncate">📅 ${c(r)}</div>`:s.length?'<div class="card-spacer">&nbsp;</div>':""}
        ${s.length?`<div class="responsables-list">${u}</div>`:""}
        ${E?.isdone?`<div class="tampon-termine" style="color:${a.col.STATUT.getColor(e.STATUT)??U};">${c(f(e.STATUT))}</div>`:""}
    `,t.addEventListener("click",()=>{grist.setCursorPos({rowId:e.id}),a.opt.hideedit||$(e)}),t.addEventListener("dblclick",()=>{grist.setCursorPos({rowId:e.id}),a.opt.gristeditcard?grist.commandApi.run("viewAsCard"):a.opt.hideedit||$(e)}),t}function de(e,t){if(!t||!a.map?.COULEUR||!a.col?.COULEUR)return;let n="";if(a.col.COULEUR.type==="Choice")n=a.col.COULEUR.getColor(t)||"";else{const o=String(t).trim();/^#?[0-9a-f]{3,8}$/i.test(o)?n=o.startsWith("#")?o:`#${o}`:/^[a-z]+$/i.test(o)&&(n=o)}n&&(e.style.backgroundColor=n)}function pe(){document.querySelectorAll(".contenu-colonne").forEach(e=>{V(e),!(a.opt.readonly||typeof Sortable!="function")&&new Sortable(e,{group:"kanban-todo",animation:150,ghostClass:"carte-fantome",chosenClass:"carte-selectionnee",onEnd:async t=>{const n=t.to.dataset.statut,o=t.from.dataset.statut,r=t.item.dataset.todoId;try{n!==o?await Z(r,"STATUT",n):t.oldIndex!==t.newIndex&&await me(t.to)}catch(s){console.error(m("Error during status update:"),s),await L(T)}V(t.to),J(t.to.closest(".colonne-kanban")),t.from!==t.to&&J(t.from.closest(".colonne-kanban"))}})})}async function me(e){if(!a.map?.DEADLINE)return;const n=Array.from(e.querySelectorAll(".carte")).filter(s=>{const i=q(s.dataset.deadline);return i===null||i>=I.getTime()});if(n.length===0)return;let o=I.getFullYear();const r=n.map(s=>{const i=`${o}-01-01`;return o+=1,s.dataset.deadline=i,a.formatRecord(s.dataset.todoId,{DEADLINE:i})});await a.updateRecords(r)}function V(e){if(!e)return;const t=e.dataset.isdone==="true",n=Array.from(e.children);n.sort((o,r)=>{let s=0;return a.map?.DEADLINE&&(t?s=P(r.dataset.lastUpdate,0)-P(o.dataset.lastUpdate,0):s=P(o.dataset.deadline,Number.MAX_SAFE_INTEGER)-P(r.dataset.deadline,Number.MAX_SAFE_INTEGER)),s!==0?s:(Number(o.dataset.todoId)||0)-(Number(r.dataset.todoId)||0)}),n.forEach(o=>e.appendChild(o))}function J(e){if(!e)return;const t=e.querySelector(".contenu-colonne"),n=e.querySelector(".compteur-colonne");t&&n&&(n.textContent=`(${t.children.length})`)}function $(e){const t=document.getElementById("popup-todo");if(!t)return;if(a.opt.readonly){C();return}document.querySelector(".carte.active")?.classList.remove("active"),ne(e.id)?.classList.add("active");const n=x(e.STATUT),o=a.col.STATUT.getColor(e.STATUT)??U,r=a.col.STATUT.getTextColor(e.STATUT)??W;t.style.borderLeftColor=o,t.dataset.statut=f(e.STATUT),t.dataset.isdone=n?.isdone?"true":"false",t.dataset.currentTodo=String(e.id);const s=t.querySelector(".popup-title"),i=t.querySelector(".popup-content"),l=t.querySelector(".popup-header"),u=t.querySelector(".bouton-fermer");if(s&&(s.textContent=f(e.DESCRIPTION)||m("New task")),l&&(l.style.backgroundColor=o,l.style.color=r),u&&(u.style.color=r),!i)return;const d=[];a.map?.DEADLINE&&d.push(`
            <div class="field">
                <label class="field-label">${c(a.map.DEADLINE)}</label>
                <input
                    type="date"
                    class="field-input"
                    value="${b(Ce(e.DEADLINE))}"
                    onchange="mettreAJourChamp(${Number(e.id)}, 'DEADLINE', this.value || null, event)"
                    ${a.col.DEADLINE.getIsFormula()?"disabled":""}
                >
            </div>
        `),a.map?.REFERENCE_PROJET&&d.push(O(e.id,e.REFERENCE_PROJET,a.valuesList.ref,a.map.REFERENCE_PROJET,"REFERENCE_PROJET",a.col.REFERENCE_PROJET.getIsFormula())),a.map?.TYPE&&d.push(O(e.id,e.TYPE,a.valuesList.types,a.map.TYPE,"TYPE",a.col.TYPE.getIsFormula())),a.map?.RESPONSABLE&&d.push(fe(e.id,Ie(e),a.map.RESPONSABLE,a.col.RESPONSABLE.getIsFormula()));const E=g(a.map?.TAGS),p=g(a.col?.TAGS),S=g(e.TAGS);E.forEach((y,Y)=>{d.push(O(e.id,S[Y],k[Y],y,y,p[Y]?.getIsFormula?.()??!1))}),a.map?.COULEUR&&d.push(O(e.id,e.COULEUR,a.valuesList.cardcolor,a.map.COULEUR,"COULEUR",a.col.COULEUR.getIsFormula()));const R=[];for(let y=0;y<d.length;y+=2)R.push(`<div class="field-row">${d[y]}${d[y+1]||""}</div>`);const w=c(f(e.DESCRIPTION)),j=c(f(e.NOTES));let N=R.join("");N+=`
        <div class="field">
            <label class="field-label">${c(a.map.DESCRIPTION)}</label>
            <textarea
                class="field-textarea auto-expand"
                onchange="mettreAJourChamp(${Number(e.id)}, 'DESCRIPTION', this.value, event)"
                oninput="ajusterTextarea(this)"
            >${w}</textarea>
        </div>
    `,a.map?.NOTES&&(N+=`
            <div class="field">
                <label class="field-label">${c(a.map.NOTES)}</label>
                <textarea
                    class="field-textarea auto-expand"
                    onchange="mettreAJourChamp(${Number(e.id)}, 'NOTES', this.value, event)"
                    oninput="ajusterTextarea(this)"
                    ${a.col.NOTES.getIsFormula()?"disabled":""}
                >${j}</textarea>
            </div>
        `);const ie=Ae(e);ie&&(N+=`<div class="info-creation">${ie}</div>`),N+=`
        <div class="popup-actions">
            <button
                type="button"
                class="popup-action-button bouton-supprimer"
                onclick="supprimerTodo(${Number(e.id)}, event)"
                title="${b(m("Remove the task"))}"
                aria-label="${b(m("Remove the task"))}"
            >🗑️</button>
        </div>
    `,i.innerHTML=N,i.querySelectorAll(".auto-expand").forEach(ee),t.classList.add("visible")}function O(e,t,n,o,r,s){const i=f(t),l=[...new Set(g(n).map(f).filter(Boolean))],u=c(o);if(l.length>0&&l.length<20){const d=l.map(E=>`
            <option value="${b(E)}" ${E===i?"selected":""}>
                ${c(E)}
            </option>
        `).join("");return`
            <div class="field">
                <label class="field-label">${u}</label>
                <select
                    class="field-select"
                    onchange="mettreAJourChamp(${Number(e)}, '${K(r)}', this.value, event)"
                    ${s?"disabled":""}
                >
                    <option value=""></option>
                    ${d}
                </select>
            </div>
        `}if(l.length>=20){const d=`list-${r}-${e}`.replace(/[^a-zA-Z0-9_-]/g,"-"),E=l.map(p=>`<option value="${b(p)}"></option>`).join("");return`
            <div class="field">
                <label class="field-label">${u}</label>
                <input
                    type="text"
                    list="${d}"
                    class="field-input"
                    value="${b(i)}"
                    onchange="mettreAJourChamp(${Number(e)}, '${K(r)}', this.value, event)"
                    ${s?"disabled":""}
                >
                <datalist id="${d}">${E}</datalist>
            </div>
        `}return`
        <div class="field">
            <label class="field-label">${u}</label>
            <input
                type="text"
                class="field-input"
                value="${b(i)}"
                onchange="mettreAJourChamp(${Number(e)}, '${K(r)}', this.value, event)"
                ${s?"disabled":""}
            >
        </div>
    `}function fe(e,t,n,o){const r=new Set(B(t)),s=A.map(l=>`
        <label class="multi-option" data-search="${b(l.label.toLocaleLowerCase(a.cultureFull))}">
            <input
                type="checkbox"
                value="${l.id}"
                data-label="${b(l.label)}"
                ${r.has(l.id)?"checked":""}
                onchange="mettreAJourChampMultiple(${Number(e)}, this.closest('.multi-dropdown'), event)"
                ${o?"disabled":""}
            >
            <span>${c(l.label)}</span>
        </label>
    `).join(""),i=[...r].map(l=>h.get(l)?.label).filter(Boolean);return`
        <div class="field field-responsables">
            <label class="field-label">${c(n)}</label>
            <details class="multi-dropdown" data-row-id="${Number(e)}">
                <summary>${c(X(i))}</summary>
                <div class="multi-dropdown-menu">
                    <div class="multi-toolbar">
                        <input
                            type="search"
                            class="multi-search"
                            placeholder="Rechercher…"
                            oninput="filtrerResponsables(this)"
                            onclick="event.stopPropagation()"
                            ${o?"disabled":""}
                        >
                        <button
                            type="button"
                            class="multi-clear"
                            onclick="viderResponsables(this, event)"
                            ${o?"disabled":""}
                        >Effacer</button>
                    </div>
                    <div class="multi-options">
                        ${s||'<div class="multi-empty">Aucun membre disponible</div>'}
                    </div>
                    <div class="multi-status" aria-live="polite"></div>
                </div>
            </details>
        </div>
    `}function X(e){const t=g(e).filter(Boolean);return t.length===0?"Choisir…":t.length===1?t[0]:`${t.length} responsables`}function Ee(e){const t=e.closest(".multi-dropdown");if(!t)return;const n=e.value.trim().toLocaleLowerCase(a.cultureFull);t.querySelectorAll(".multi-option").forEach(o=>{o.hidden=n!==""&&!String(o.dataset.search||"").includes(n)})}function ge(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".multi-dropdown");n&&(n.querySelectorAll('input[type="checkbox"]:checked').forEach(o=>{o.checked=!1}),Q(Number(n.dataset.rowId||0),n,t))}async function Q(e,t,n){n?.stopPropagation();const o=Number(e||t?.dataset?.rowId||t?.closest("[data-row-id]")?.dataset?.rowId);if(!Number.isInteger(o)||o<=0||!t){console.error("Identifiant de ligne invalide pour les responsables.",{rowId:e,resolvedRowId:o});return}const r=Array.from(t.querySelectorAll('input[type="checkbox"]:checked')).map(u=>Number(u.value)).filter(u=>Number.isInteger(u)&&u>0&&h.has(u)),s=r.map(u=>h.get(u).label);he(t,s),_(t,"saving","Enregistrement…");const l=(D.get(o)||Promise.resolve()).catch(()=>{}).then(()=>be(o,r)).then(()=>{Re(o,r),_(t,"saved","Enregistré"),window.setTimeout(()=>_(t,"",""),1200)}).catch(u=>{_(t,"error","Échec de l’enregistrement"),console.error("Erreur lors de l’enregistrement des responsables :",u)}).finally(()=>{D.get(o)===l&&D.delete(o)});D.set(o,l),await l}async function be(e,t){const n=a.map?.RESPONSABLE;if(!n||Array.isArray(n))throw new Error("La colonne Responsable n’est pas correctement mappée.");if(await grist.getTable().update({id:Number(e),fields:{[n]:[...t]}}),a.map?.DERNIERE_MISE_A_JOUR&&!a.col.DERNIERE_MISE_A_JOUR.getIsFormula())try{await a.updateRecords(a.formatRecord(e,{DERNIERE_MISE_A_JOUR:new Date().toISOString()}))}catch(r){console.warn("Responsables enregistrés, mais date de mise à jour non modifiée :",r)}}function Re(e,t){const n=T.find(o=>Number(o.id)===Number(e));n&&(n.RESPONSABLE_id=[...t],n.RESPONSABLE=t.map(o=>h.get(o)?.label).filter(Boolean))}function he(e,t){const n=e.querySelector("summary");n&&(n.textContent=X(t))}function _(e,t,n){const o=e.querySelector(".multi-status");o&&(o.className=`multi-status${t?` ${t}`:""}`,o.textContent=n)}async function Z(e,t,n,o){o?.stopPropagation();try{t==="STATUT"&&x(n)?.useconfetti&&Ne();const r={[t]:n};a.map?.DERNIERE_MISE_A_JOUR&&t!=="DERNIERE_MISE_A_JOUR"&&!a.col.DERNIERE_MISE_A_JOUR.getIsFormula()&&(r.DERNIERE_MISE_A_JOUR=new Date().toISOString()),await a.updateRecords(a.formatRecord(e,r))}catch(r){throw console.error(m("Error during update:"),r),r}}async function Se(e){try{const t={DESCRIPTION:"",STATUT:e};a.map?.TYPE&&!a.col.TYPE.getIsFormula()&&(t.TYPE=""),a.map?.REFERENCE_PROJET&&!a.col.REFERENCE_PROJET.getIsFormula()&&(t.REFERENCE_PROJET=null),a.map?.DERNIERE_MISE_A_JOUR&&!a.col.DERNIERE_MISE_A_JOUR.getIsFormula()&&(t.DERNIERE_MISE_A_JOUR=new Date().toISOString()),a.map?.CREE_LE&&!a.col.CREE_LE.getIsFormula()&&(t.CREE_LE=new Date().toISOString());const n=await a.createRecords({fields:t});if(n?.id>0){grist.setCursorPos({rowId:n.id});const o=await a.fetchSelectedRecord(n.id);a.opt.hideedit||$(o)}}catch(t){console.error(m("Error on creation:"),t)}}async function ye(e,t){if(t?.stopPropagation(),!!confirm(m("Are you sure you want to delete this task?")))try{await a.destroyRecords(e),C()}catch(n){console.error(m("Error on delete:"),n)}}function C(){const e=document.getElementById("popup-todo");if(!e)return;const t=e.dataset.currentTodo;ne(t)?.classList.remove("active"),e.classList.remove("visible"),te()}function Te(e,t){if(t?.stopPropagation(),!e)return;e.classList.toggle("collapsed");const n=e.querySelector(".titre-statut")?.childNodes?.[0]?.textContent?.trim()||e.id;localStorage.setItem(oe(n),String(e.classList.contains("collapsed")))}function ee(e){e&&(e.style.height="",e.style.height=`${e.scrollHeight}px`)}function te(e=null){document.querySelectorAll(".multi-dropdown[open]").forEach(t=>{t!==e&&t.removeAttribute("open")})}document.addEventListener("keydown",e=>{if(e.key==="Escape"){const t=document.querySelector(".multi-dropdown[open]");t?t.removeAttribute("open"):C()}}),document.addEventListener("click",e=>{const t=e.target.closest(".multi-dropdown");te(t);const n=document.getElementById("popup-todo");if(!n?.classList.contains("visible"))return;const o=n.contains(e.target),r=!!e.target.closest(".carte");!o&&!r&&C()});function ne(e){return Array.from(document.querySelectorAll(".carte")).find(t=>Number(t.dataset.todoId)===Number(e))||null}function ae(e){return{addbutton:!1,isdone:!1,useconfetti:!1,hidecolumn:!1,...(Array.isArray(a.opt?.columns)?a.opt.columns:[])[e]||{}}}function x(e){const n=(a.valuesList?.columns||[]).indexOf(e);return n>=0?ae(n):null}function oe(e){return`column-todo-${String(e)}`}function Ie(e){const t=B(e?.RESPONSABLE_id);if(t.length>0)return t;const n=re(e);if(n.length===0)return[];const o=[...A];return n.flatMap(r=>{const s=o.findIndex(l=>l.label===r);if(s<0)return[];const[i]=o.splice(s,1);return[i.id]})}function re(e){const t=g(e?.RESPONSABLE).map(f).filter(n=>n&&n!=="#KeyError");return t.length>0?t:B(e?.RESPONSABLE_id).map(n=>h.get(n)?.label).filter(Boolean)}function B(e){let t=g(e);return t[0]==="L"&&(t=t.slice(1)),[...new Set(t.map(Number).filter(n=>Number.isInteger(n)&&n>0))]}function g(e){return e==null||e===""?[]:Array.isArray(e)?e:[e]}function f(e){return e==null?"":String(e)}function Ae(e){const t=!!(a.map?.CREE_LE&&e.CREE_LE),n=!!(a.map?.CREE_PAR&&e.CREE_PAR),o=!!(a.map?.DERNIERE_MISE_A_JOUR&&e.DERNIERE_MISE_A_JOUR);if(!t&&!n&&!o)return"";const r=[c(m("Created"))];t&&r.push(c(m("on %on",{on:F(e.CREE_LE)}))),n&&r.push(c(m("by %by",{by:f(e.CREE_PAR)})));let s=r.join(" ");return o&&(s+=`<br>${c(m("Last update on %on",{on:F(e.DERNIERE_MISE_A_JOUR)}))}`),s}function F(e){if(!e)return"";const t=new Date(e);if(Number.isNaN(t.getTime())||t>=I)return"";const n=String(t.getDate()).padStart(2,"0"),o=t.toLocaleDateString(a.cultureFull,{month:"short"});return`${n} ${o} ${t.getFullYear()}`}function Ce(e){if(!e)return"";const t=new Date(e);return Number.isNaN(t.getTime())||t>=I?"":t.toISOString().split("T")[0]}function se(e){if(!e)return"";const t=new Date(e);return Number.isNaN(t.getTime())?String(e):t.toISOString()}function q(e){if(!e)return null;const t=new Date(e).getTime();return Number.isNaN(t)?null:t}function P(e,t){return q(e)??t}function c(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function b(e){return c(e).replace(/`/g,"&#096;")}function K(e){return String(e??"").replace(/\\/g,"\\\\").replace(/'/g,"\\'")}function we(e){return encodeURIComponent(String(e??"")).replace(/'/g,"%27")}function Ne(){if(typeof confetti!="function")return;const e=2e3,t=Date.now()+e,n={startVelocity:30,spread:360,ticks:60,zIndex:1500},o=(s,i)=>Math.random()*(i-s)+s,r=window.setInterval(()=>{const s=t-Date.now();if(s<=0){window.clearInterval(r);return}const i=50*(s/e);confetti({...n,particleCount:i,origin:{x:o(.1,.3),y:Math.random()-.2}}),confetti({...n,particleCount:i,origin:{x:o(.7,.9),y:Math.random()-.2}})},250)}window.toggleColonne=Te,window.togglePopupTodo=$,window.fermerPopup=C,window.mettreAJourChamp=Z,window.creerNouvelleTache=Se,window.supprimerTodo=ye,window.mettreAJourChampMultiple=Q,window.filtrerResponsables=Ee,window.viderResponsables=ge,window.ajusterTextarea=ee}));
