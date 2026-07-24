(function(a){typeof define=="function"&&define.amd?define(a):a()})((function(){"use strict";let a,h;const w=new Date("3000-01-01"),H="#DCDCDC",ie="#000000",_e=120*1e3,Me=50*1024*1024,K="__GRIST_USER_NAME__";let A=[],C=[],N=new Map,W=null,I=[],z=new Map,O=!1,_=null,oe=0,R=null;const M=new Map,P=new Map,U=new Map;window.addEventListener("load",async()=>{a=new WidgetSDK,h=await a.loadTranslations(["widget.js"]),a.configureOptions([WidgetSDK.newItem("columns",null,"Behavior","Configure the behavior of each column","Columns",{columnId:"STATUT",template:[WidgetSDK.newItem("addbutton",!0,"Can add card","Display a button to add a card."),WidgetSDK.newItem("isdone",!1,"Is done","Cards in this column are considered completed."),WidgetSDK.newItem("useconfetti",!1,"Use confetti","Display confetti when a card enters this column."),WidgetSDK.newItem("hidecolumn",!1,"Hide","Hide this column.")]}),WidgetSDK.newItem("rotation",!0,"Tilt","Randomly tilt cards.","Display"),WidgetSDK.newItem("compact",!1,"Compact","Use a compact rendering.","Display"),WidgetSDK.newItem("readonly",!1,"Read only","Disable all edits.","Display"),WidgetSDK.newItem("hideedit",!1,"Hide editing form","Do not open the editing form when clicking a card.","Display"),WidgetSDK.newItem("gristeditcard",!1,"Grist Record Card","Open the Grist record card on double click.","Display")],"#config-view","#main-view",{onOptChange:ce,onOptLoad:ce}),a.initMetaData(),a.ready({requiredAccess:"full",allowSelectBy:!0,columns:[{name:"STATUT",title:"Statut",description:"Colonne du Kanban",type:"Choice",strictType:!0},{name:"DESCRIPTION",title:"Nom de la tâche",description:"Nom principal de la tâche",type:"Any"},{name:"DESCRIPTION_DISPLAY",title:"Affichage de la tâche",description:"Contenu personnalisé facultatif affiché sur la carte",type:"Any",optional:!0},{name:"NOTES",title:"Notes",description:"Notes détaillées de la tâche",type:"Any",optional:!0},{name:"DEADLINE",title:"Échéance",description:"Date limite ou ordre de priorité",type:"Date",optional:!0},{name:"RESPONSABLE",title:"Responsables",description:"Personnes responsables de la tâche",type:"RefList",strictType:!0,optional:!0},{name:"ETIQUETTES",title:"Étiquettes",description:"Étiquettes multiples de type Trello",type:"ChoiceList",strictType:!0,optional:!0},{name:"PIECES_JOINTES",title:"Pièces jointes",description:"Fichiers et images associés à la tâche",type:"Attachments",strictType:!0,optional:!0},{name:"COMMENTAIRES",title:"Commentaires",description:"Commentaires du widget stockés en JSON",type:"Text",strictType:!0,optional:!0},{name:"COULEUR",title:"Couleur de carte",description:"Code hexadécimal choisi depuis le widget",type:"Text",strictType:!0,optional:!0},{name:"CREE_PAR",title:"Créé par",type:"Any",optional:!0},{name:"CREE_LE",title:"Date de création",type:"DateTime",optional:!0},{name:"DERNIERE_MISE_A_JOUR",title:"Dernière mise à jour",description:"Champ technique non affiché",type:"DateTime",optional:!0}]}),a.onRecords(x,{expandRefs:!1,keepEncoded:!1,mapRef:!0}),a.isLoaded().then(()=>{a.initDone=!0}),grist.on("message",async e=>{e.mappingsChange&&await Pe()}),it()});async function ae(e=!1){if(!a?.map?.RESPONSABLE||!a?.col?.RESPONSABLE){k();return}const t=a.col.RESPONSABLE,[n,r]=String(t.type||"").split(":");if(n!=="RefList"||!r||!t.visibleCol){k();return}const o=`${r}:${t.visibleCol}`;if(!(!e&&W===o&&C.length>0))try{const[i,s]=await Promise.all([grist.docApi.fetchTable(r),t.getMeta(t.visibleCol)]),c=s?.colId,u=Array.isArray(i?.id)?i.id:[],l=c&&Array.isArray(i?.[c])?i[c]:[],E=u.map((f,b)=>({id:Number(f),label:d(l[b]).trim()})).filter(f=>Number.isInteger(f.id)&&f.id>0&&f.label&&f.label!=="#KeyError").sort((f,b)=>f.label.localeCompare(b.label,a.cultureFull,{sensitivity:"base"}));C=E,N=new Map(E.map(f=>[f.id,f])),W=o}catch(i){k(),console.error("Impossible de charger la table des responsables :",i)}}function k(){C=[],N=new Map,W=null}async function se(){if(I=[],!(!a?.map?.ETIQUETTES||!a?.col?.ETIQUETTES))try{I=[...new Set((await a.col.ETIQUETTES.getChoices()||[]).map(d).filter(Boolean))]}catch(e){console.error("Impossible de charger les étiquettes :",e)}}async function Q(e=!1){if(!(O&&!e)){z=new Map,O=!0;try{const t=await grist.docApi.fetchTable("_grist_Attachments");(Array.isArray(t?.id)?t.id:[]).forEach((r,o)=>{const i=Number(r);if(!Number.isInteger(i)||i<=0)return;const s=d(t.fileName?.[o])||`Pièce jointe ${i}`,c=d(t.fileExt?.[o])||Oe(s),u=d(t.fileType?.[o]),l=Number(t.fileSize?.[o])||0;z.set(i,{id:i,fileName:s,fileExt:c,fileType:u,fileSize:l,imageWidth:Number(t.imageWidth?.[o])||0,imageHeight:Number(t.imageHeight?.[o])||0})})}catch(t){console.warn("Métadonnées des pièces jointes indisponibles :",t)}}}async function x(e){A=Array.isArray(e)?e:[],await Promise.all([ae(),se()]);const t=document.getElementById("conteneur-kanban");if(!t)return;t.innerHTML="";const n=await a.col.STATUT.getChoices();if(!Array.isArray(n)||n.length===0){t.innerHTML=`<div class="kanban-message">${p(h("No choice available in the Status column"))}</div>`;return}n.forEach((r,o)=>{const i=Ue(r,o);i&&t.appendChild(i)}),A.forEach(r=>{const o=d(r.STATUT),i=Array.from(t.querySelectorAll(".contenu-colonne")).find(s=>s.dataset.statut===o);i&&i.insertBefore(ke(r),i.firstChild)}),qe(),document.querySelectorAll(".colonne-kanban").forEach(G)}async function ce(){await a.isMapped(),await x(A)}async function Pe(){k(),R=null,I=[],O=!1,_=null,await Promise.all([ae(!0),se()]),await x(A)}function Ue(e,t){const n=Ie(t);if(n.hidecolumn)return null;const r=d(e),o=document.createElement("section");o.className=`colonne-kanban${!n.addbutton&&!a.opt.compact?" colonne-nobouton":""}`,o.id=r,localStorage.getItem(Re(r))==="true"&&o.classList.add("collapsed");const i=a.col.STATUT.getColor(r)??H,s=a.col.STATUT.getTextColor(r)??ie,c=yt(r);return o.innerHTML=`
        <div class="entete-colonne" style="background-color:${i};color:${s}">
            <div class="titre-statut">${p(r)} <span class="compteur-colonne">(0)</span></div>
            <div class="actions-colonne">
                ${n.addbutton&&!a.opt.readonly?`<button type="button" class="bouton-ajouter-entete ${a.opt.compact?"compact":""}" onclick="creerNouvelleTache(decodeURIComponent('${c}'))" aria-label="${m(h("Add a new task"))}">+</button>`:""}
                <button type="button" class="bouton-toggle" onclick="toggleColonne(this.closest('.colonne-kanban'), event)" aria-label="Replier ou déplier">⇄</button>
            </div>
        </div>
        ${n.addbutton&&!a.opt.readonly?`<button type="button" class="bouton-ajouter ${a.opt.compact?"compact":""}" onclick="creerNouvelleTache(decodeURIComponent('${c}'))">+ ${p(h("Add a new task"))}</button>`:""}
        <div class="contenu-colonne" data-statut="${m(r)}" data-isdone="${n.isdone?"true":"false"}"></div>
    `,o}function ke(e){const t=document.createElement("article");t.className=`carte${a.opt.rotation?"":" norotate"}${a.opt.compact?" compact":""}`,t.dataset.todoId=String(e.id),t.dataset.lastUpdate=Le(e.DERNIERE_MISE_A_JOUR),t.dataset.deadline=Le(e.DEADLINE),Je(t,e.COULEUR);const n=e.DEADLINE?De(e.DEADLINE):"",r=$e(e),o=L(e.ETIQUETTES),i=y(e.PIECES_JOINTES).length,s=$(e.COMMENTAIRES).length,c=e.DESCRIPTION_DISPLAY?String(e.DESCRIPTION_DISPLAY):p(d(e.DESCRIPTION)||h("No description")),u=o.map(T=>xe(T)).join(""),l=r.map(T=>`<span class="responsable-badge">${p(T)}</span>`).join(""),E=te(e.STATUT),f=re(e.DEADLINE),b=f!==null&&f<Date.now()&&f<w.getTime();return t.innerHTML=`
        ${u?`<div class="etiquettes-list">${u}</div>`:""}
        <div class="description">${c}</div>
        ${n?`<div class="deadline${b?" late":""} truncate">📅 ${p(n)}</div>`:""}
        ${r.length?`<div class="responsables-list">${l}</div>`:""}
        ${i||s?`<div class="card-indicators">
                ${i?`<span title="${i} pièce(s) jointe(s)">📎 ${i}</span>`:""}
                ${s?`<span title="${s} commentaire(s)">💬 ${s}</span>`:""}
               </div>`:""}
        ${E?.isdone?`<div class="tampon-termine" style="color:${a.col.STATUT.getColor(e.STATUT)??H};">${p(d(e.STATUT))}</div>`:""}
    `,t.addEventListener("click",()=>{grist.setCursorPos({rowId:e.id}),a.opt.hideedit||J(e)}),t.addEventListener("dblclick",()=>{grist.setCursorPos({rowId:e.id}),a.opt.gristeditcard?grist.commandApi.run("viewAsCard"):a.opt.hideedit||J(e)}),t}function xe(e){const t=a.col?.ETIQUETTES?.getColor(e)||"rgba(0, 0, 0, 0.08)",n=a.col?.ETIQUETTES?.getTextColor(e)||"#273142";return`<span class="etiquette-badge" style="background:${m(t)};color:${m(n)}">${p(e)}</span>`}function Je(e,t){const n=q(t);n&&(e.style.backgroundColor=n)}function qe(){document.querySelectorAll(".contenu-colonne").forEach(e=>{le(e),!(a.opt.readonly||typeof Sortable!="function")&&new Sortable(e,{group:"kanban-todo",animation:150,ghostClass:"carte-fantome",chosenClass:"carte-selectionnee",onEnd:async t=>{const n=t.to.dataset.statut,r=t.from.dataset.statut,o=t.item.dataset.todoId;try{n!==r?await Y(o,"STATUT",n):t.oldIndex!==t.newIndex&&await je(t.to)}catch(i){console.error(h("Error during status update:"),i),await x(A)}le(t.to),G(t.to.closest(".colonne-kanban")),t.from!==t.to&&G(t.from.closest(".colonne-kanban"))}})})}async function je(e){if(!a.map?.DEADLINE)return;const n=Array.from(e.querySelectorAll(".carte")).filter(i=>{const s=re(i.dataset.deadline);return s===null||s>=w.getTime()});if(n.length===0)return;let r=w.getFullYear();const o=n.map(i=>{const s=`${r}-01-01`;return r+=1,i.dataset.deadline=s,a.formatRecord(i.dataset.todoId,{DEADLINE:s})});await a.updateRecords(o)}function le(e){if(!e)return;const t=e.dataset.isdone==="true",n=Array.from(e.children);n.sort((r,o)=>{let i=0;return a.map?.DEADLINE&&(t?i=F(o.dataset.lastUpdate,0)-F(r.dataset.lastUpdate,0):i=F(r.dataset.deadline,Number.MAX_SAFE_INTEGER)-F(o.dataset.deadline,Number.MAX_SAFE_INTEGER)),i!==0?i:(Number(r.dataset.todoId)||0)-(Number(o.dataset.todoId)||0)}),n.forEach(r=>e.appendChild(r))}function G(e){if(!e)return;const t=e.querySelector(".contenu-colonne"),n=e.querySelector(".compteur-colonne");t&&n&&(n.textContent=`(${t.children.length})`)}async function J(e){const t=document.getElementById("popup-todo");if(!t)return;if(a.opt.readonly){D();return}document.querySelector(".carte.active")?.classList.remove("active"),j(e.id)?.classList.add("active");const n=te(e.STATUT),r=a.col.STATUT.getColor(e.STATUT)??H,o=a.col.STATUT.getTextColor(e.STATUT)??ie;t.style.borderLeftColor=r,t.dataset.statut=d(e.STATUT),t.dataset.isdone=n?.isdone?"true":"false",t.dataset.currentTodo=String(e.id);const i=t.querySelector(".popup-title"),s=t.querySelector(".popup-content"),c=t.querySelector(".popup-header"),u=t.querySelector(".bouton-fermer");if(i&&(i.textContent=d(e.DESCRIPTION)||h("New task")),c&&(c.style.backgroundColor=r,c.style.color=o),u&&(u.style.color=o),!s)return;const l=[],E=a.col.DESCRIPTION.getIsFormula(),f=a.map?.NOTES?a.col.NOTES.getIsFormula():!1;l.push(`
        <div class="field field-wide">
            <label class="field-label">Nom de la tâche</label>
            <textarea
                class="field-textarea auto-expand task-title-input"
                onchange="mettreAJourChamp(${Number(e.id)}, 'DESCRIPTION', this.value, event)"
                oninput="ajusterTextarea(this)"
                ${E?"disabled":""}
            >${p(d(e.DESCRIPTION))}</textarea>
        </div>
    `),a.map?.NOTES&&l.push(`
            <div class="field field-wide">
                <label class="field-label">Notes</label>
                <textarea
                    class="field-textarea auto-expand notes-input"
                    onchange="mettreAJourChamp(${Number(e.id)}, 'NOTES', this.value, event)"
                    oninput="ajusterTextarea(this)"
                    ${f?"disabled":""}
                >${p(d(e.NOTES))}</textarea>
            </div>
        `),a.map?.ETIQUETTES&&l.push(Ye(e)),a.map?.RESPONSABLE&&l.push(Ke(e.id,pt(e),a.map.RESPONSABLE,a.col.RESPONSABLE.getIsFormula())),a.map?.DEADLINE&&l.push(`
            <div class="field">
                <label class="field-label">Échéance</label>
                <input
                    type="date"
                    class="field-input"
                    value="${m(ht(e.DEADLINE))}"
                    onchange="mettreAJourChamp(${Number(e.id)}, 'DEADLINE', this.value || null, event)"
                    ${a.col.DEADLINE.getIsFormula()?"disabled":""}
                >
            </div>
        `),a.map?.COULEUR&&l.push(Be(e));let b=`<div class="form-grid">${l.join("")}</div>`;a.map?.PIECES_JOINTES&&(b+=et(e)),a.map?.COMMENTAIRES&&(b+=at(e));const T=ft(e);T&&(b+=`<div class="info-creation">${T}</div>`),b+=`
        <div class="popup-actions">
            <button
                type="button"
                class="popup-action-button bouton-supprimer"
                onclick="supprimerTodo(${Number(e.id)}, event)"
                title="${m(h("Remove the task"))}"
                aria-label="${m(h("Remove the task"))}"
            >🗑️</button>
        </div>
    `,s.innerHTML=b,s.querySelectorAll(".auto-expand").forEach(ee),t.classList.add("visible"),a.map?.PIECES_JOINTES&&await V(e.id)}function Be(e){const t=q(e.COULEUR),n=t||"#ffffd1",r=a.col.COULEUR.getIsFormula();return`
        <div class="field color-field" data-row-id="${Number(e.id)}">
            <label class="field-label">Couleur de la carte</label>
            <div class="color-picker-row">
                <input
                    type="color"
                    class="color-picker"
                    value="${m(n)}"
                    oninput="previsualiserCouleur(${Number(e.id)}, this.value, this)"
                    onchange="mettreAJourCouleur(${Number(e.id)}, this.value, this, event)"
                    ${r?"disabled":""}
                    aria-label="Choisir une couleur"
                >
                <input
                    type="text"
                    class="field-input color-value"
                    value="${m(t||"")}"
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
    `}function q(e){const t=d(e).trim();if(!t)return"";const n=t.startsWith("#")?t:`#${t}`;return/^#[0-9a-f]{3}$/i.test(n)?`#${n[1]}${n[1]}${n[2]}${n[2]}${n[3]}${n[3]}`.toUpperCase():/^#[0-9a-f]{6}$/i.test(n)?n.toUpperCase():""}function Fe(e,t,n){const r=q(t);if(!r)return;const o=j(e);o&&(o.style.backgroundColor=r);const i=n?.closest(".color-field");if(i){const s=i.querySelector(".color-picker"),c=i.querySelector(".color-value");s&&n!==s&&(s.value=r),c&&n!==c&&(c.value=r)}}async function ue(e,t,n,r){r?.stopPropagation();const o=n?.closest(".color-field"),i=o?.querySelector(".color-status"),s=d(t).trim(),c=q(s);if(s&&!c){i&&(i.className="section-status color-status error",i.textContent="Utilisez un code hexadécimal, par exemple #FFFFD1.");return}try{i&&(i.className="section-status color-status saving",i.textContent="Enregistrement…"),await Y(e,"COULEUR",c||null,r);const u=j(e);if(u&&(c?u.style.backgroundColor=c:u.style.removeProperty("background-color")),o){const l=o.querySelector(".color-picker"),E=o.querySelector(".color-value");l&&(l.value=c||"#ffffd1"),E&&(E.value=c||"")}i&&(i.className="section-status color-status saved",i.textContent="Enregistré",window.setTimeout(()=>{i.className="section-status color-status",i.textContent=""},1200))}catch(u){i&&(i.className="section-status color-status error",i.textContent="Impossible d’enregistrer la couleur."),console.error("Erreur pendant l’enregistrement de la couleur :",u)}}function He(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".color-field"),r=Number(n?.dataset?.rowId);if(!n||!Number.isInteger(r)||r<=0)return;const o=n.querySelector(".color-value");o&&(o.value=""),ue(r,"",e,t)}function Ke(e,t,n,r){const o=new Set(ne(t)),i=C.map(c=>`
        <label class="multi-option" data-search="${m(c.label.toLocaleLowerCase(a.cultureFull))}">
            <input
                type="checkbox"
                value="${c.id}"
                data-label="${m(c.label)}"
                ${o.has(c.id)?"checked":""}
                onchange="mettreAJourChampResponsables(${Number(e)}, this.closest('.multi-dropdown'), event)"
                ${r?"disabled":""}
            >
            <span>${p(c.label)}</span>
        </label>
    `).join(""),s=[...o].map(c=>N.get(c)?.label).filter(Boolean);return`
        <div class="field field-responsables">
            <label class="field-label">${p(n)}</label>
            <details class="multi-dropdown responsables-dropdown" data-row-id="${Number(e)}">
                <summary>${p(de(s))}</summary>
                <div class="multi-dropdown-menu">
                    <div class="multi-toolbar">
                        <input
                            type="search"
                            class="multi-search"
                            placeholder="Rechercher…"
                            oninput="filtrerOptionsMultiples(this)"
                            onclick="event.stopPropagation()"
                            ${r?"disabled":""}
                        >
                        <button type="button" class="multi-clear" onclick="viderResponsables(this, event)" ${r?"disabled":""}>Effacer</button>
                    </div>
                    <div class="multi-options">${i||'<div class="multi-empty">Aucun membre disponible</div>'}</div>
                    <div class="multi-status" aria-live="polite"></div>
                </div>
            </details>
        </div>
    `}function de(e){const t=L(e);return t.length===0?"Choisir…":t.length===1?t[0]:`${t.length} responsables`}function We(e){const t=e.closest(".multi-dropdown");if(!t)return;const n=e.value.trim().toLocaleLowerCase(a.cultureFull);t.querySelectorAll(".multi-option").forEach(r=>{r.hidden=n!==""&&!d(r.dataset.search).includes(n)})}function ze(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".multi-dropdown");n&&(n.querySelectorAll('input[type="checkbox"]:checked').forEach(r=>{r.checked=!1}),me(Number(n.dataset.rowId),n,t))}async function me(e,t,n){n?.stopPropagation();const r=Number(e||t?.dataset?.rowId);if(!Number.isInteger(r)||r<=0||!t)return;const o=Array.from(t.querySelectorAll('input[type="checkbox"]:checked')).map(u=>Number(u.value)).filter(u=>Number.isInteger(u)&&u>0&&N.has(u)),i=o.map(u=>N.get(u).label);t.querySelector("summary").textContent=de(i),S(t,"saving","Enregistrement…");const c=(M.get(r)||Promise.resolve()).catch(()=>{}).then(()=>Qe(r,o)).then(()=>{Xe(r,o),S(t,"saved","Enregistré"),window.setTimeout(()=>S(t,"",""),1200)}).catch(u=>{S(t,"error","Échec de l’enregistrement"),console.error("Erreur lors de l’enregistrement des responsables :",u)}).finally(()=>{M.get(r)===c&&M.delete(r)});M.set(r,c),await c}async function Qe(e,t){const n=a.map?.RESPONSABLE;if(!n||Array.isArray(n))throw new Error("La colonne Responsable n’est pas correctement mappée.");const r=[...new Set(B(t).map(Number).filter(l=>Number.isInteger(l)&&l>0))],[,o]=d(a.col.RESPONSABLE.type).split(":"),i=[{mode:"list",value:["L",...r]},{mode:"normal",value:[...r]},{mode:"reference-list",value:["r",o,[...r]]}],s=R?[...i.filter(l=>l.mode===R),...i.filter(l=>l.mode!==R)]:i,c=grist.getTable(),u=[];for(const l of s)try{await c.update({id:Number(e),fields:{[n]:l.value}},{parseStrings:!1});const E=await pe(e,n),f=Ge(E);if(Ve(r,f)){R=l.mode,await Z(e);return}u.push({mode:l.mode,sent:l.value,received:E})}catch(E){u.push({mode:l.mode,sent:l.value,error:E?.message||String(E)})}throw console.error("Formats testés pour la RefList :",u),new Error("Grist n’a accepté aucun format d’écriture pour la liste de références. Vérifiez que la colonne mappée est bien une Liste de références vers la table Membres.")}async function pe(e,t){const n=await grist.getTable().getTableId(),r=await grist.docApi.fetchTable(n),o=B(r?.id).findIndex(i=>Number(i)===Number(e));if(o<0)throw new Error(`Ligne ${e} introuvable dans la table ${n}.`);return r?.[t]?.[o]}function Ge(e){return e==null||e===""?[]:Array.isArray(e)?e[0]==="E"?[]:e[0]==="L"?y(e.slice(1)):e[0]==="r"?y(e[2]):y(e):[]}function Ve(e,t){const n=[...new Set(e.map(Number))].sort((o,i)=>o-i),r=[...new Set(t.map(Number))].sort((o,i)=>o-i);return n.length===r.length&&n.every((o,i)=>o===r[i])}function Xe(e,t){const n=v(e);n&&(n.RESPONSABLE_id=[...t],n.RESPONSABLE=t.map(r=>N.get(r)?.label).filter(Boolean))}function Ye(e){const t=new Set(L(e.ETIQUETTES)),n=I.map(r=>{const o=a.col.ETIQUETTES.getColor(r)||"#dfe3e8",i=a.col.ETIQUETTES.getTextColor(r)||"#273142";return`
            <label class="multi-option etiquette-option" data-search="${m(r.toLocaleLowerCase(a.cultureFull))}">
                <input
                    type="checkbox"
                    value="${m(r)}"
                    ${t.has(r)?"checked":""}
                    onchange="mettreAJourEtiquettes(${Number(e.id)}, this.closest('.multi-dropdown'), event)"
                    ${a.col.ETIQUETTES.getIsFormula()?"disabled":""}
                >
                <span class="etiquette-preview" style="background:${m(o)};color:${m(i)}">${p(r)}</span>
            </label>
        `}).join("");return`
        <div class="field field-etiquettes">
            <label class="field-label">Étiquettes</label>
            <details class="multi-dropdown etiquettes-dropdown" data-row-id="${Number(e.id)}">
                <summary>${p(fe([...t]))}</summary>
                <div class="multi-dropdown-menu">
                    <div class="multi-toolbar">
                        <input type="search" class="multi-search" placeholder="Rechercher…" oninput="filtrerOptionsMultiples(this)" onclick="event.stopPropagation()">
                        <button type="button" class="multi-clear" onclick="viderEtiquettes(this, event)">Effacer</button>
                    </div>
                    <div class="multi-options">${n||'<div class="multi-empty">Ajoutez des choix dans la colonne Étiquettes de Grist</div>'}</div>
                    <div class="multi-status" aria-live="polite"></div>
                </div>
            </details>
        </div>
    `}function fe(e){const t=L(e);return t.length===0?"Choisir…":t.length===1?t[0]:`${t.length} étiquettes`}function Ze(e,t){t?.preventDefault(),t?.stopPropagation();const n=e.closest(".multi-dropdown");n?.querySelectorAll('input[type="checkbox"]:checked').forEach(r=>{r.checked=!1}),n&&Ee(Number(n.dataset.rowId),n,t)}async function Ee(e,t,n){n?.stopPropagation();const r=Number(e||t?.dataset?.rowId);if(!Number.isInteger(r)||r<=0||!t)return;const o=Array.from(t.querySelectorAll('input[type="checkbox"]:checked')).map(c=>d(c.value)).filter(c=>I.includes(c));t.querySelector("summary").textContent=fe(o),S(t,"saving","Enregistrement…");const s=(P.get(r)||Promise.resolve()).catch(()=>{}).then(async()=>{const c=a.map?.ETIQUETTES;if(!c||Array.isArray(c))throw new Error("La colonne Étiquettes n’est pas correctement mappée.");await grist.getTable().update({id:r,fields:{[c]:["L",...o]}}),await Z(r)}).then(()=>{const c=v(r);c&&(c.ETIQUETTES=[...o]),S(t,"saved","Enregistré"),window.setTimeout(()=>S(t,"",""),1200)}).catch(c=>{S(t,"error","Échec de l’enregistrement"),console.error("Erreur lors de l’enregistrement des étiquettes :",c)}).finally(()=>{P.get(r)===s&&P.delete(r)});P.set(r,s),await s}function S(e,t,n){const r=e?.querySelector(".multi-status");r&&(r.className=`multi-status${t?` ${t}`:""}`,r.textContent=n)}function et(e){const t=a.col.PIECES_JOINTES.getIsFormula();return`
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
    `}async function V(e){const t=document.getElementById(`attachments-list-${Number(e)}`);if(!t)return;const n=v(e),r=y(n?.PIECES_JOINTES);if(r.length===0){t.innerHTML='<div class="section-empty">Aucune pièce jointe</div>';return}t.innerHTML='<div class="section-loading">Chargement des aperçus…</div>';try{const[o]=await Promise.all([ve(!0),Q()]);t.innerHTML=r.map(i=>he(e,i,o)).join("")}catch(o){console.error("Impossible d’afficher les pièces jointes :",o),t.innerHTML=r.map(i=>he(e,i,null)).join("")}}function he(e,t,n){const r=Te(t),o=n?ye(n,t):"",i=Se(r),s=i==="image"&&o?`<img src="${m(o)}" alt="${m(r.fileName)}" loading="lazy">`:`<div class="attachment-file-icon">${Ne(i)}</div>`;return`
        <article class="attachment-card">
            <button type="button" class="attachment-preview" onclick="ouvrirPieceJointe(${Number(e)}, ${Number(t)}, event)" title="Ouvrir ${m(r.fileName)}">
                ${s}
            </button>
            <div class="attachment-info">
                <div class="attachment-name" title="${m(r.fileName)}">${p(r.fileName)}</div>
                <div class="attachment-meta">${p(gt(r.fileSize))}</div>
            </div>
            <div class="attachment-actions">
                <button type="button" onclick="ouvrirPieceJointe(${Number(e)}, ${Number(t)}, event)" title="Visualiser">👁</button>
                <button type="button" onclick="retirerPieceJointe(${Number(e)}, ${Number(t)}, event)" title="Retirer de la tâche">×</button>
            </div>
        </article>
    `}async function tt(e,t,n){n?.stopPropagation();const r=Array.from(t?.files||[]);if(r.length===0)return;const o=r.find(i=>i.size>Me);if(o){g("attachments",e,"error",`${o.name} dépasse 50 Mo.`),t.value="";return}t.disabled=!0,g("attachments",e,"saving",`Envoi de ${r.length} fichier(s)…`);try{const i=await grist.docApi.getAccessToken({readOnly:!1}),s=new FormData;r.forEach(T=>s.append("upload",T,T.name));const c=await fetch(`${i.baseUrl}/attachments?auth=${encodeURIComponent(i.token)}`,{method:"POST",body:s,headers:{"X-Requested-With":"XMLHttpRequest"}});if(!c.ok)throw new Error(`Upload échoué (${c.status} ${c.statusText})`);const u=await c.json(),l=y(u);if(l.length===0)throw new Error("Grist n’a retourné aucun identifiant de pièce jointe.");const E=v(e),f=y(E?.PIECES_JOINTES),b=[...new Set([...f,...l])];await ge(e,b),E&&(E.PIECES_JOINTES=[...b]),O=!1,await Q(!0),await V(e),g("attachments",e,"saved","Pièce(s) jointe(s) ajoutée(s).")}catch(i){console.error("Erreur pendant l’ajout des pièces jointes :",i),g("attachments",e,"error",i.message||"Échec de l’envoi.")}finally{t.value="",t.disabled=!1}}async function nt(e,t,n){n?.preventDefault(),n?.stopPropagation();const r=v(e),i=y(r?.PIECES_JOINTES).filter(s=>s!==Number(t));try{g("attachments",e,"saving","Mise à jour…"),await ge(e,i),r&&(r.PIECES_JOINTES=[...i]),await V(e),g("attachments",e,"saved","Pièce jointe retirée de la tâche.")}catch(s){console.error("Erreur pendant le retrait de la pièce jointe :",s),g("attachments",e,"error","Impossible de retirer la pièce jointe.")}}async function ge(e,t){const n=a.map?.PIECES_JOINTES;if(!n||Array.isArray(n))throw new Error("La colonne Pièces jointes n’est pas correctement mappée.");await grist.getTable().update({id:Number(e),fields:{[n]:["L",...t]}}),await Z(e)}async function rt(e,t,n){n?.preventDefault(),n?.stopPropagation();try{const[r]=await Promise.all([ve(!0),Q()]),o=Te(t),i=ye(r,t);ot(o,i)}catch(r){console.error("Impossible d’ouvrir la pièce jointe :",r),window.alert("Impossible d’ouvrir cette pièce jointe.")}}function it(){if(document.getElementById("attachment-viewer"))return;const e=document.createElement("div");e.id="attachment-viewer",e.className="attachment-viewer",e.setAttribute("aria-hidden","true"),e.innerHTML=`
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
    `,document.body.appendChild(e)}function ot(e,t){const n=document.getElementById("attachment-viewer"),r=document.getElementById("attachment-viewer-content"),o=document.getElementById("attachment-viewer-title"),i=document.getElementById("attachment-viewer-download");if(!n||!r||!o||!i)return;o.textContent=e.fileName,i.href=t;const s=Se(e);s==="image"?r.innerHTML=`<img src="${m(t)}" alt="${m(e.fileName)}">`:s==="pdf"?r.innerHTML=`<iframe src="${m(t)}" title="${m(e.fileName)}"></iframe>`:s==="video"?r.innerHTML=`<video src="${m(t)}" controls autoplay></video>`:s==="audio"?r.innerHTML=`<div class="attachment-generic-preview"><div class="attachment-large-icon">🎵</div><audio src="${m(t)}" controls autoplay></audio></div>`:r.innerHTML=`<div class="attachment-generic-preview"><div class="attachment-large-icon">${Ne(s)}</div><p>Ce format ne dispose pas d’un aperçu intégré.</p><a href="${m(t)}" target="_blank" rel="noopener">Ouvrir ou télécharger le fichier</a></div>`,n.classList.add("visible"),n.setAttribute("aria-hidden","false")}function be(e){e?.preventDefault(),e?.stopPropagation();const t=document.getElementById("attachment-viewer");if(!t)return;t.classList.remove("visible"),t.setAttribute("aria-hidden","true");const n=document.getElementById("attachment-viewer-content");n&&(n.innerHTML="")}async function ve(e=!0){if(e&&_&&Date.now()-oe<_e)return _;const t=await grist.docApi.getAccessToken({readOnly:e});return e&&(_=t,oe=Date.now()),t}function ye(e,t){return`${e.baseUrl}/attachments/${Number(t)}/download?auth=${encodeURIComponent(e.token)}`}function Te(e){return z.get(Number(e))||{id:Number(e),fileName:`Pièce jointe ${Number(e)}`,fileExt:"",fileType:"",fileSize:0,imageWidth:0,imageHeight:0}}function Se(e){const t=d(e.fileExt||Oe(e.fileName)).toLowerCase().replace(/^\./,""),n=d(e.fileType).toLowerCase();return n.startsWith("image/")||["png","jpg","jpeg","gif","webp","svg","bmp","avif"].includes(t)?"image":n==="application/pdf"||t==="pdf"?"pdf":n.startsWith("video/")||["mp4","webm","mov","m4v","ogv"].includes(t)?"video":n.startsWith("audio/")||["mp3","wav","ogg","m4a","aac","flac"].includes(t)?"audio":["doc","docx","odt"].includes(t)?"document":["xls","xlsx","ods","csv"].includes(t)?"tableur":["ppt","pptx","odp"].includes(t)?"presentation":["zip","rar","7z","tar","gz"].includes(t)?"archive":"file"}function Ne(e){return{image:"🖼️",pdf:"📕",video:"🎬",audio:"🎵",document:"📄",tableur:"📊",presentation:"📽️",archive:"🗜️",file:"📎"}[e]||"📎"}function at(e){const t=$(e.COMMENTAIRES);return`
        <section class="detail-section comments-section" data-row-id="${Number(e.id)}">
            <div class="detail-section-header">
                <div>
                    <h3>💬 Commentaires</h3>
                    <p>${t.length} commentaire(s)</p>
                </div>
            </div>
            <div id="comments-list-${Number(e.id)}" class="comments-list">
                ${Ae(t,e.id)}
            </div>
            <div class="comment-composer">
                <textarea
                    class="comment-input"
                    placeholder="Écrire un commentaire…"
                    oninput="ajusterTextarea(this)"
                ></textarea>
                <div class="comment-grist-author">
                    Le nom est renseigné automatiquement par Grist avec <code>user.Name</code>.
                </div>
                <div class="comment-composer-footer">
                    <div id="comments-status-${Number(e.id)}" class="section-status" aria-live="polite"></div>
                    <button type="button" onclick="ajouterCommentaire(${Number(e.id)}, this, event)">Commenter</button>
                </div>
            </div>
        </section>
    `}function Ae(e,t){return e.length===0?'<div class="section-empty">Aucun commentaire</div>':e.map(n=>`
        <article class="comment-card" data-comment-id="${m(n.id)}">
            <div class="comment-header">
                <strong>${p(n.author===K?"Nom Grist non configuré":n.author||"Anonyme")}</strong>
                <span>${p(Et(n.createdAt))}</span>
                <button type="button" onclick="supprimerCommentaire(${Number(t)}, '${vt(n.id)}', event)" title="Supprimer le commentaire">×</button>
            </div>
            <div class="comment-body">${p(n.text).replace(/\n/g,"<br>")}</div>
        </article>
    `).join("")}function $(e){const t=d(e).trim();if(!t)return[];try{const n=JSON.parse(t);if(!Array.isArray(n))throw new Error("Format non tableau");return n.map((r,o)=>({id:d(r?.id)||`legacy-${o}`,author:d(r?.author)||"Anonyme",createdAt:d(r?.createdAt),text:d(r?.text)})).filter(r=>r.text.trim())}catch{return[{id:"legacy-text",author:"Ancien commentaire",createdAt:"",text:t}]}}async function st(e,t,n){n?.preventDefault(),n?.stopPropagation();const o=t.closest(".comments-section")?.querySelector(".comment-input"),i=d(o?.value).trim();if(!i){g("comments",e,"error","Écrivez un commentaire."),o?.focus();return}t.disabled=!0,g("comments",e,"saving","Enregistrement…");const s={id:bt(),author:K,createdAt:new Date().toISOString(),text:i};try{const u=(await we(e,l=>[...l,s])).find(l=>l.id===s.id);if(!u||u.author===K)throw new Error("La formule d’initialisation user.Name n’a pas remplacé le nom temporaire. Configurez la colonne Commentaires comme indiqué dans le README.");o&&(o.value="",ee(o)),X(e),g("comments",e,"saved",`Commentaire ajouté par ${u.author}.`)}catch(c){console.error("Erreur pendant l’ajout du commentaire :",c),X(e),g("comments",e,"error","Le commentaire a été envoyé, mais Grist n’a pas renseigné user.Name. Vérifiez la formule d’initialisation.")}finally{t.disabled=!1}}async function ct(e,t,n){n?.preventDefault(),n?.stopPropagation();try{g("comments",e,"saving","Suppression…"),await we(e,r=>r.filter(o=>o.id!==t)),X(e),g("comments",e,"saved","Commentaire supprimé.")}catch(r){console.error("Erreur pendant la suppression du commentaire :",r),g("comments",e,"error","Impossible de supprimer le commentaire.")}}async function we(e,t){const n=Number(e),o=(U.get(n)||Promise.resolve()).catch(()=>{}).then(async()=>{const i=v(n),s=$(i?.COMMENTAIRES),c=t(s),u=JSON.stringify(c);await a.updateRecords(a.formatRecord(n,{COMMENTAIRES:u,...a.map?.DERNIERE_MISE_A_JOUR&&!a.col.DERNIERE_MISE_A_JOUR.getIsFormula()?{DERNIERE_MISE_A_JOUR:new Date().toISOString()}:{}}));const l=await lt(n);return i&&(i.COMMENTAIRES=JSON.stringify(l)),l}).finally(()=>{U.get(n)===o&&U.delete(n)});return U.set(n,o),o}async function lt(e){const t=a.map?.COMMENTAIRES;if(!t||Array.isArray(t))throw new Error("La colonne Commentaires n’est pas correctement mappée.");const n=await pe(e,t),r=$(n),o=v(e);return o&&(o.COMMENTAIRES=d(n)),r}function X(e){const t=v(e),n=$(t?.COMMENTAIRES),r=document.getElementById(`comments-list-${Number(e)}`),o=r?.closest(".comments-section");r&&(r.innerHTML=Ae(n,e));const i=o?.querySelector(".detail-section-header p");i&&(i.textContent=`${n.length} commentaire(s)`)}async function Y(e,t,n,r){r?.stopPropagation();try{t==="STATUT"&&te(n)?.useconfetti&&Tt();const o={[t]:n};a.map?.DERNIERE_MISE_A_JOUR&&t!=="DERNIERE_MISE_A_JOUR"&&!a.col.DERNIERE_MISE_A_JOUR.getIsFormula()&&(o.DERNIERE_MISE_A_JOUR=new Date().toISOString()),await a.updateRecords(a.formatRecord(e,o));const i=v(e);i&&(i[t]=n,o.DERNIERE_MISE_A_JOUR&&(i.DERNIERE_MISE_A_JOUR=o.DERNIERE_MISE_A_JOUR))}catch(o){throw console.error(h("Error during update:"),o),o}}async function Z(e){if(!(!a.map?.DERNIERE_MISE_A_JOUR||a.col.DERNIERE_MISE_A_JOUR.getIsFormula()))try{const t=new Date().toISOString();await a.updateRecords(a.formatRecord(e,{DERNIERE_MISE_A_JOUR:t}));const n=v(e);n&&(n.DERNIERE_MISE_A_JOUR=t)}catch(t){console.warn("Données enregistrées, mais date technique non modifiée :",t)}}async function ut(e){try{const t={DESCRIPTION:"",STATUT:e};a.map?.DERNIERE_MISE_A_JOUR&&!a.col.DERNIERE_MISE_A_JOUR.getIsFormula()&&(t.DERNIERE_MISE_A_JOUR=new Date().toISOString()),a.map?.CREE_LE&&!a.col.CREE_LE.getIsFormula()&&(t.CREE_LE=new Date().toISOString()),a.map?.COMMENTAIRES&&!a.col.COMMENTAIRES.getIsFormula()&&(t.COMMENTAIRES="[]");const n=await a.createRecords({fields:t});if(n?.id>0){grist.setCursorPos({rowId:n.id});const r=await a.fetchSelectedRecord(n.id);a.opt.hideedit||J(r)}}catch(t){console.error(h("Error on creation:"),t)}}async function dt(e,t){if(t?.stopPropagation(),!!confirm(h("Are you sure you want to delete this task?")))try{await a.destroyRecords(e),D()}catch(n){console.error(h("Error on delete:"),n)}}function D(){const e=document.getElementById("popup-todo");e&&(j(e.dataset.currentTodo)?.classList.remove("active"),e.classList.remove("visible"),Ce())}function mt(e,t){if(t?.stopPropagation(),!e)return;e.classList.toggle("collapsed");const n=e.querySelector(".titre-statut")?.childNodes?.[0]?.textContent?.trim()||e.id;localStorage.setItem(Re(n),String(e.classList.contains("collapsed")))}function ee(e){e&&(e.style.height="",e.style.height=`${Math.max(e.scrollHeight,42)}px`)}function Ce(e=null){document.querySelectorAll(".multi-dropdown[open]").forEach(t=>{t!==e&&t.removeAttribute("open")})}document.addEventListener("keydown",e=>{if(e.key!=="Escape")return;if(document.getElementById("attachment-viewer")?.classList.contains("visible")){be(e);return}const n=document.querySelector(".multi-dropdown[open]");n?n.removeAttribute("open"):D()}),document.addEventListener("click",e=>{const t=e.target.closest(".multi-dropdown");Ce(t);const n=document.getElementById("popup-todo");if(!n?.classList.contains("visible"))return;const r=n.contains(e.target),o=!!e.target.closest(".carte"),i=!!e.target.closest("#attachment-viewer");!r&&!o&&!i&&D()});function v(e){return A.find(t=>Number(t.id)===Number(e))||null}function j(e){return Array.from(document.querySelectorAll(".carte")).find(t=>Number(t.dataset.todoId)===Number(e))||null}function Ie(e){return{addbutton:!1,isdone:!1,useconfetti:!1,hidecolumn:!1,...(Array.isArray(a.opt?.columns)?a.opt.columns:[])[e]||{}}}function te(e){const n=(a.valuesList?.columns||[]).indexOf(e);return n>=0?Ie(n):null}function Re(e){return`column-todo-${d(e)}`}function pt(e){const t=ne(e?.RESPONSABLE_id);if(t.length>0)return t;const n=$e(e),r=[...C];return n.flatMap(o=>{const i=r.findIndex(c=>c.label===o);if(i<0)return[];const[s]=r.splice(i,1);return[s.id]})}function $e(e){const t=L(e?.RESPONSABLE).filter(n=>n!=="#KeyError");return t.length>0?t:ne(e?.RESPONSABLE_id).map(n=>N.get(n)?.label).filter(Boolean)}function ne(e){return y(e)}function y(e){let t=B(e);return t[0]==="L"&&(t=t.slice(1)),[...new Set(t.flatMap(n=>Array.isArray(n)?n:[n]).map(Number).filter(n=>Number.isInteger(n)&&n>0))]}function L(e){let t=B(e);return t[0]==="L"&&(t=t.slice(1)),[...new Set(t.flatMap(n=>Array.isArray(n)?n:[n]).map(d).map(n=>n.trim()).filter(Boolean))]}function B(e){return e==null||e===""?[]:Array.isArray(e)?e:[e]}function d(e){return e==null?"":String(e)}function ft(e){const t=!!(a.map?.CREE_LE&&e.CREE_LE),n=!!(a.map?.CREE_PAR&&e.CREE_PAR);if(!t&&!n)return"";const r=[p(h("Created"))];return t&&r.push(p(h("on %on",{on:De(e.CREE_LE)}))),n&&r.push(p(h("by %by",{by:d(e.CREE_PAR)}))),r.join(" ")}function g(e,t,n,r){const o=document.getElementById(`${e}-status-${Number(t)}`);o&&(o.className=`section-status${n?` ${n}`:""}`,o.textContent=r)}function De(e){if(!e)return"";const t=new Date(e);if(Number.isNaN(t.getTime())||t>=w)return"";const n=String(t.getDate()).padStart(2,"0"),r=t.toLocaleDateString(a.cultureFull,{month:"short"});return`${n} ${r} ${t.getFullYear()}`}function Et(e){if(!e)return"";const t=new Date(e);return Number.isNaN(t.getTime())?"":t.toLocaleString(a.cultureFull,{day:"2-digit",month:"short",year:"numeric",hour:"2-digit",minute:"2-digit"})}function ht(e){if(!e)return"";const t=new Date(e);return Number.isNaN(t.getTime())||t>=w?"":t.toISOString().split("T")[0]}function Le(e){if(!e)return"";const t=new Date(e);return Number.isNaN(t.getTime())?d(e):t.toISOString()}function re(e){if(!e)return null;const t=new Date(e).getTime();return Number.isNaN(t)?null:t}function F(e,t){return re(e)??t}function gt(e){const t=Number(e)||0;if(t<=0)return"";const n=["o","Ko","Mo","Go"],r=Math.min(Math.floor(Math.log(t)/Math.log(1024)),n.length-1);return`${(t/1024**r).toFixed(r===0?0:1)} ${n[r]}`}function Oe(e){const t=d(e).match(/(\.[^.]+)$/);return t?t[1]:""}function bt(){return globalThis.crypto?.randomUUID?crypto.randomUUID():`comment-${Date.now()}-${Math.random().toString(16).slice(2)}`}function p(e){return d(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function m(e){return p(e).replace(/`/g,"&#096;")}function vt(e){return d(e).replace(/\\/g,"\\\\").replace(/'/g,"\\'").replace(/\r/g,"\\r").replace(/\n/g,"\\n")}function yt(e){return encodeURIComponent(d(e)).replace(/'/g,"%27")}function Tt(){if(typeof confetti!="function")return;const e=2e3,t=Date.now()+e,n={startVelocity:30,spread:360,ticks:60,zIndex:1500},r=(i,s)=>Math.random()*(s-i)+i,o=window.setInterval(()=>{const i=t-Date.now();if(i<=0){window.clearInterval(o);return}const s=50*(i/e);confetti({...n,particleCount:s,origin:{x:r(.1,.3),y:Math.random()-.2}}),confetti({...n,particleCount:s,origin:{x:r(.7,.9),y:Math.random()-.2}})},250)}window.toggleColonne=mt,window.togglePopupTodo=J,window.fermerPopup=D,window.mettreAJourChamp=Y,window.creerNouvelleTache=ut,window.supprimerTodo=dt,window.mettreAJourChampResponsables=me,window.filtrerOptionsMultiples=We,window.viderResponsables=ze,window.mettreAJourEtiquettes=Ee,window.viderEtiquettes=Ze,window.ajouterPiecesJointes=tt,window.retirerPieceJointe=nt,window.ouvrirPieceJointe=rt,window.fermerLecteurPieceJointe=be,window.ajouterCommentaire=st,window.supprimerCommentaire=ct,window.ajusterTextarea=ee,window.previsualiserCouleur=Fe,window.mettreAJourCouleur=ue,window.reinitialiserCouleur=He}));
