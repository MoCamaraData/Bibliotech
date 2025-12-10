// =========================

// VARIABLES GLOBALES

// =========================
 
 
let DATA_BASE = [];

let x = 0; 

const STORAGE_KEY = "biblio_db_final";
 
 
// =========================

// CHARGEMENT SÉCURISÉ

// =========================
 
 
function LancerApplication() {

   try {

       const raw = localStorage.getItem(STORAGE_KEY);

       if (raw) {

           const parsed = JSON.parse(raw); // Remplace eval()

           if (Array.isArray(parsed)) {

               DATA_BASE = parsed;
 
 
               const ids = DATA_BASE.map(item => item.uid);

               x = ids.length ? Math.max(...ids) : 0;

           }

       }

   } catch (e) {

       console.error("Erreur de parsing localStorage :", e);

       DATA_BASE = [];

       x = 0;

   }
 
 
   Display();

}
 
 
// =========================

// VALIDATION FORMULAIRE

// =========================
 
 
function validateForm(v1, v2, v4) {

   if (!v1.trim()) return "Erreur : Titre obligatoire.";

   if (!v2.trim()) return "Erreur : Auteur obligatoire.";

   if (!v4.trim() || v4.length < 4) return "Erreur : ISBN invalide.";

   return "";

}
 
 
// =========================

// SAUVEGARDE

// =========================
 
 
function sauvegarder_le_tout() {

   try {

       localStorage.setItem(STORAGE_KEY, JSON.stringify(DATA_BASE));

   } catch (e) {

       console.error("Erreur sauvegarde :", e);

   }

}
 
 
// =========================

// AJOUT D’UN LIVRE (SÉCURISÉ)

// =========================
 
 
function Excecute_Save_Data_To_Memory() {

   const v1 = document.getElementById("inp_A").value;

   const v2 = document.getElementById("inp_B").value;

   const v3 = document.getElementById("sel_X").value;

   const v4 = document.getElementById("inp_C").value;
 
 
   const validation = validateForm(v1, v2, v4);

   if (validation !== "") {

       alert(validation);

       return;

   }
 
 
   x++;
 
 
   const ajd = new Date();

   const string = ajd.getDate() + "/" + (ajd.getMonth() + 1) + "/" + ajd.getFullYear();
 
 
   let label = "";

   if (v3 === "1") label = "Science-Fiction";

   else if (v3 === "2") label = "Documentaire";

   else label = "Roman";
 
 
   const Thing = {

       uid: x,

       Name: v1.trim(),

       auteur_name: v2.trim(),

       k: label,

       stuff: v4.trim() + " | " + string,

       is_dead: false

   };
 
 
   DATA_BASE.push(Thing);

   sauvegarder_le_tout();

   Display();
 
 
   document.getElementById("inp_A").value = "";

   document.getElementById("inp_B").value = "";

   document.getElementById("inp_C").value = "";
 
 
   alert_user("C'est bon");

}
 
 
// =========================

// AFFICHAGE (sécurisé contre XSS)

// =========================
 
 
function Display() {

   const el = document.getElementById("corps_du_tableau");

   el.innerHTML = ""; // reset tableau sécurisé
 
 
   let count = 0;
 
 
   DATA_BASE.forEach(o => {

       if (!o.is_dead) {

           count++;
 
 
           const tr = document.createElement("tr");
 
 
           // uid

           const tdNum = document.createElement("td");

           tdNum.textContent = "#" + o.uid;

           tr.appendChild(tdNum);
 
 
           // titre + auteur

           const tdInfo = document.createElement("td");

           const b = document.createElement("b");

           b.textContent = o.Name.toUpperCase();

           const br = document.createElement("br");

           const i = document.createElement("i");

           i.textContent = o.auteur_name;

           tdInfo.append(b, br, i);

           tr.appendChild(tdInfo);
 
 
           // catégorie

           const tdCat = document.createElement("td");

           const span = document.createElement("span");

           span.style.background = "white";

           span.style.color = "black";

           span.style.padding = "2px";

           span.textContent = o.k;

           tdCat.appendChild(span);

           tr.appendChild(tdCat);
 
 
           // détails

           const tdStuff = document.createElement("td");

           tdStuff.textContent = o.stuff;

           tr.appendChild(tdStuff);
 
 
           // bouton delete

           const tdDel = document.createElement("td");

           const btn = document.createElement("button");

           btn.className = "btn-del";

           btn.textContent = "X";

           btn.onclick = () => del(o.uid);

           tdDel.appendChild(btn);

           tr.appendChild(tdDel);
 
 
           el.appendChild(tr);

       }

   });
 
 
   document.getElementById("cpt").textContent = count;

}
 
 
// =========================

// SUPPRESSION

// =========================
 
 
function del(id) {

   if (confirm("Supprimer ?")) {

       DATA_BASE = DATA_BASE.map(o =>

           o.uid === id ? { ...o, is_dead: true } : o

       );
 
 
       sauvegarder_le_tout();

       Display();

   }

}
 
 
// =========================

// RECHERCHE

// =========================
 
 
function regarder(val) {

   const search = val.toUpperCase();

   const t = document.getElementById("tab");

   const rows = t.getElementsByTagName("tr");
 
 
   for (let i = 1; i < rows.length; i++) {

       const col = rows[i].getElementsByTagName("td")[1];

       if (!col) continue;
 
 
       const txt = col.textContent || col.innerText;
 
 
       rows[i].style.display = txt.toUpperCase().includes(search)

           ? ""

           : "none";

   }

}
 
 
function alert_user(msg) {

   const z = document.getElementById("zone_m");

   z.textContent = msg;

   setTimeout(() => (z.textContent = ""), 3000);

}
 
 
function kill() {

   localStorage.removeItem(STORAGE_KEY);

   location.reload();

}

 