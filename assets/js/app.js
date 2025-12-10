(() => {
  "use strict";

  const STORAGE_KEY = "biblioDb";

  let booksDatabase = [];
  let nextId = 1;

  const titleInput = document.getElementById("bookTitleInput");
  const authorInput = document.getElementById("authorInput");
  const categorySelect = document.getElementById("categorySelect");
  const isbnInput = document.getElementById("isbnInput");
  const saveButton = document.getElementById("saveButton");
  const searchInput = document.getElementById("searchInput");
  const resetButton = document.getElementById("resetButton");
  const messageZone = document.getElementById("messageZone");
  const booksTableBody = document.getElementById("booksTableBody");
  const booksCounter = document.getElementById("booksCounter");

  const showMessage = (text, type = "info") => {
    messageZone.textContent = text;
    messageZone.className = "message";
    messageZone.classList.add(`message--${type}`);

    setTimeout(() => {
      messageZone.textContent = "";
      messageZone.className = "message";
    }, 3000);
  };

  const mapCategory = (value) => {
    const categories = {
      "1": "Science-Fiction",
      "2": "Documentaire",
      "3": "Roman",
    };

    return categories[value] || "Autre";
  };

  const validateForm = (title, author, isbn) => {
    if (!title.trim()) {
      return "Titre obligatoire.";
    }
    if (!author.trim()) {
      return "Auteur obligatoire.";
    }
    if (!isbn.trim() || isbn.trim().length < 4) {
      return "ISBN invalide (minimum 4 caractères).";
    }
    return "";
  };

  const loadFromStorage = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        booksDatabase = [];
        nextId = 1;
        return;
      }

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        booksDatabase = [];
        nextId = 1;
        return;
      }

      booksDatabase = parsed;
      const ids = booksDatabase.map((book) => book.id);
      nextId = ids.length ? Math.max(...ids) + 1 : 1;
    } catch (error) {
      console.error("Erreur de lecture du localStorage", error);
      booksDatabase = [];
      nextId = 1;
    }
  };

  const saveToStorage = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(booksDatabase));
    } catch (error) {
      console.error("Erreur de sauvegarde dans le localStorage", error);
    }
  };

  const clearForm = () => {
    titleInput.value = "";
    authorInput.value = "";
    isbnInput.value = "";
    categorySelect.value = "1";
  };

  const addBook = () => {
    const title = titleInput.value;
    const author = authorInput.value;
    const isbn = isbnInput.value;
    const categoryValue = categorySelect.value;

    const validationError = validateForm(title, author, isbn);
    if (validationError) {
      showMessage(validationError, "error");
      return;
    }

    const today = new Date();
    const createdAt = `${today.getDate()}/${
      today.getMonth() + 1
    }/${today.getFullYear()}`;

    const newBook = {
      id: nextId++,
      title: title.trim(),
      author: author.trim(),
      category: mapCategory(categoryValue),
      isbn: isbn.trim(),
      createdAt,
      isDeleted: false,
    };

    booksDatabase.push(newBook);
    saveToStorage();
    renderBooksTable(booksDatabase);
    clearForm();
    showMessage("Livre enregistré.", "success");
  };

  const deleteBook = (id) => {
    const confirmDelete = window.confirm("Supprimer ce livre ?");
    if (!confirmDelete) {
      return;
    }

    booksDatabase = booksDatabase.filter((book) => book.id !== id);
    saveToStorage();
    renderBooksTable(booksDatabase);
    showMessage("Livre supprimé.", "success");
  };

  const createCell = (text) => {
    const td = document.createElement("td");
    td.textContent = text;
    return td;
  };

  const renderBooksTable = (books) => {
    while (booksTableBody.firstChild) {
      booksTableBody.removeChild(booksTableBody.firstChild);
    }

    let count = 0;

    books.forEach((book) => {
      if (book.isDeleted) {
        return;
      }

      count += 1;

      const tr = document.createElement("tr");

      const numCell = createCell(`#${book.id}`);
      tr.appendChild(numCell);

      const infoCell = document.createElement("td");
      const titleElement = document.createElement("b");
      titleElement.textContent = book.title.toUpperCase();
      const authorElement = document.createElement("i");
      authorElement.textContent = `\n${book.author}`;
      infoCell.appendChild(titleElement);
      infoCell.appendChild(document.createElement("br"));
      infoCell.appendChild(authorElement);
      tr.appendChild(infoCell);

      const categoryCell = document.createElement("td");
      const categorySpan = document.createElement("span");
      categorySpan.classList.add("category-pill");
      categorySpan.textContent = book.category;
      categoryCell.appendChild(categorySpan);
      tr.appendChild(categoryCell);

      const detailsCell = createCell(`${book.isbn} | ${book.createdAt}`);
      tr.appendChild(detailsCell);

      const optCell = document.createElement("td");
      const deleteButton = document.createElement("button");
      deleteButton.classList.add("btn", "btn-delete");
      deleteButton.textContent = "X";
      deleteButton.addEventListener("click", () => deleteBook(book.id));
      optCell.appendChild(deleteButton);
      tr.appendChild(optCell);

      booksTableBody.appendChild(tr);
    });

    booksCounter.textContent = count.toString();
  };

  const filterBooks = (term) => {
    const value = term.trim().toLowerCase();
    if (!value) {
      renderBooksTable(booksDatabase);
      return;
    }

    const filtered = booksDatabase.filter((book) => {
      if (book.isDeleted) {
        return false;
      }
      const searchable = `${book.title} ${book.author} ${book.category} ${book.isbn}`.toLowerCase();
      return searchable.includes(value);
    });

    renderBooksTable(filtered);
  };

  const resetApp = () => {
    const confirmReset = window.confirm(
      "Réinitialiser toute la base de données ?"
    );
    if (!confirmReset) {
      return;
    }

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Erreur lors de la réinitialisation du localStorage", error);
    }

    booksDatabase = [];
    nextId = 1;
    renderBooksTable(booksDatabase);
    showMessage("Base réinitialisée.", "success");
  };

  const initApp = () => {
    loadFromStorage();
    renderBooksTable(booksDatabase);

    saveButton.addEventListener("click", addBook);
    searchInput.addEventListener("input", (event) => {
      filterBooks(event.target.value);
    });
    resetButton.addEventListener("click", resetApp);
  };

  window.addEventListener("DOMContentLoaded", initApp);
})();
