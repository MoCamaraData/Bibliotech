// =========================
// VARIABLES GLOBALES
// =========================
 
const STORAGE_KEY = "biblioDb";
let booksDatabase = [];
let nextId = 0;
 
// =========================
// CHARGEMENT SÉCURISÉ
// =========================
 
const LancerApplication = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        booksDatabase = parsed;
 
        const ids = booksDatabase.map((item) => item.uid);
        nextId = ids.length ? Math.max(...ids) : 0;
      }
    }
  } catch (e) {
    console.error("Erreur de parsing localStorage :", e);
    booksDatabase = [];
    nextId = 0;
  }
 
  Display();
};
 
// =========================
// VALIDATION FORMULAIRE
// =========================
 
const validateForm = (title, author, isbn) => {
  if (!title.trim()) return "Erreur : Titre obligatoire.";
  if (!author.trim()) return "Erreur : Auteur obligatoire.";
  if (!isbn.trim() || isbn.length < 4) return "Erreur : ISBN invalide (min 4 caractères).";
  return "";
};
 
// =========================
// SAUVEGARDE
// =========================
 
const sauvegarder_le_tout = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(booksDatabase));
  } catch (e) {
    console.error("Erreur sauvegarde :", e);
  }
};
 
// =========================
// AJOUT D’UN LIVRE
// =========================
 
const Excecute_Save_Data_To_Memory = () => {
  const title = document.getElementById("inp_A").value;
  const author = document.getElementById("inp_B").value;
  const categoryValue = document.getElementById("sel_X").value;
  const isbn = document.getElementById("inp_C").value;
 
  const validationMessage = validateForm(title, author, isbn);
  if (validationMessage !== "") {
    alert(validationMessage);
    return;
  }
 
  nextId++;
 
  const today = new Date();
  const createdAt =
    today.getDate() +
    "/" +
    (today.getMonth() + 1) +
    "/" +
    today.getFullYear();
 
  let categoryLabel = "";
  if (categoryValue === "1") categoryLabel = "Science-Fiction";
  else if (categoryValue === "2") categoryLabel = "Documentaire";
  else categoryLabel = "Roman";
 
  const newBook = {
    uid: nextId,
    Name: title.trim(),
    auteur_name: author.trim(),
    k: categoryLabel,
    stuff: isbn.trim() + " | " + createdAt,
    is_dead: false,
  };
 
  booksDatabase.push(newBook);
  sauvegarder_le_tout();
  Display();
 
  document.getElementById("inp_A").value = "";
  document.getElementById("inp_B").value = "";
  document.getElementById("inp_C").value = "";
 
  alert_user("C'est bon");
};
 
// =========================
// AFFICHAGE
// =========================
 
const Display = () => {
  const tbody = document.getElementById("corps_du_tableau");
  tbody.innerHTML = "";
 
  let count = 0;
 
  booksDatabase.forEach((book) => {
    if (book.is_dead) return;
 
    count++;
 
    const tr = document.createElement("tr");
 
    const tdNum = document.createElement("td");
    tdNum.textContent = "#" + book.uid;
    tr.appendChild(tdNum);
 
    const tdInfo = document.createElement("td");
    const titleElement = document.createElement("b");
    titleElement.textContent = book.Name.toUpperCase();
    const br = document.createElement("br");
    const authorElement = document.createElement("i");
    authorElement.textContent = book.auteur_name;
    tdInfo.append(titleElement, br, authorElement);
    tr.appendChild(tdInfo);
 
    const tdCategory = document.createElement("td");
    const categorySpan = document.createElement("span");
    categorySpan.style.background = "white";
    categorySpan.style.color = "black";
    categorySpan.style.padding = "2px";
    categorySpan.textContent = book.k;
    tdCategory.appendChild(categorySpan);
    tr.appendChild(tdCategory);
 
    const tdDetails = document.createElement("td");
    tdDetails.textContent = book.stuff;
    tr.appendChild(tdDetails);
 
    const tdDelete = document.createElement("td");
    const deleteButton = document.createElement("button");
    deleteButton.className = "btn-del";
    deleteButton.textContent = "X";
    deleteButton.onclick = () => del(book.uid);
    tdDelete.appendChild(deleteButton);
    tr.appendChild(tdDelete);
 
    tbody.appendChild(tr);
  });
 
  document.getElementById("cpt").textContent = count;
};
 
// =========================
// SUPPRESSION
// =========================
 
const del = (id) => {
  if (confirm("Supprimer ?")) {
    booksDatabase = booksDatabase.map((book) =>
      book.uid === id ? { ...book, is_dead: true } : book
    );
 
    sauvegarder_le_tout();
    Display();
  }
};
 
// =========================
// RECHERCHE
// =========================
 
const regarder = (val) => {
  const search = val.toUpperCase();
  const table = document.getElementById("tab");
  const rows = table.getElementsByTagName("tr");
 
  for (let i = 1; i < rows.length; i++) {
    const col = rows[i].getElementsByTagName("td")[1];
    if (!col) continue;
 
    const txt = col.textContent || col.innerText;
 
    rows[i].style.display = txt.toUpperCase().includes(search)
      ? ""
      : "none";
  }
};
 
// =========================
// MESSAGES & RESET
// =========================
 
const alert_user = (msg) => {
  const zone = document.getElementById("zone_m");
  zone.textContent = msg;
  setTimeout(() => {
    zone.textContent = "";
  }, 3000);
};
 
const kill = () => {
  localStorage.removeItem(STORAGE_KEY);
  location.reload();
};