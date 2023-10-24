function saveToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function readFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

function displayBookItems() {
    const incompleteBookshelfList = document.getElementById("incompleteBookshelfList");
    const completeBookshelfList = document.getElementById("completeBookshelfList");

    incompleteBookshelfList.innerHTML = "";
    completeBookshelfList.innerHTML = "";

    const books = readFromLocalStorage("books") || [];
    books.forEach((book, index) => {
        const bookItem = document.createElement("article");
        bookItem.classList.add("book_item");

        const buttonCompleteText = book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca";

        bookItem.innerHTML = `
          <h3>${book.title}</h3>
          <p>Penulis: ${book.author}</p>
          <p>Tahun: ${book.year}</p>
          <div class="action">
            <button id="complete" onclick="selesaiDibaca(${index})" class="green">${buttonCompleteText}</button>
            <button id="edit" class="yellow" onclick="editBuku(${index})">Edit buku</button>
            <button id="hapus" class="red" onclick="hapusBuku(${index})">Hapus buku</button>
          </div>
        `;

        if (book.isComplete) {
            completeBookshelfList.appendChild(bookItem);
        } else {
            incompleteBookshelfList.appendChild(bookItem);
        }

    });
}

function addBookItem() {
    const bookTitle = document.getElementById("inputBookTitle");
    const bookAuthor = document.getElementById("inputBookAuthor");
    const bookYear = document.getElementById("inputBookYear");
    const bookIsComplete = document.getElementById("inputBookIsComplete");

    const books = readFromLocalStorage("books") || [];

    const newBook = {
        id: +new Date(),
        title: bookTitle.value.trim(),
        author: bookAuthor.value.trim(),
        year: parseInt(bookYear.value),
        isComplete: bookIsComplete.checked
    };

    if (newBook.title && newBook.author && newBook.year) {
        books.push(newBook);

        saveToLocalStorage("books", books);

        bookTitle.value = "";
        bookAuthor.value = "";
        bookYear.value = "";
        bookIsComplete.checked = false;

        displayBookItems();
    }

}


function editBuku(index) {
    const books = readFromLocalStorage("books") || [];
    const book = books[index];

    const updatedBookTitle = prompt("Masukkan judul baru:", book.title);
    const updatedBookAuthor = prompt("Masukkan penulis baru:", book.author);
    const updatedBookYear = prompt("Masukkan tahun (harus angka):", book.year);

    if (updatedBookYear && isNaN(updatedBookYear)) {
        alert("Tahun harus angka!");
        return;

    }


    if (updatedBookTitle && updatedBookAuthor && updatedBookYear) {
        book.title = updatedBookTitle;
        book.author = updatedBookAuthor;
        book.year = parseInt(updatedBookYear);

        saveToLocalStorage("books", books);
        displayBookItems();
    }

}


function hapusBuku(index) {
    const books = readFromLocalStorage("books") || [];

    if (!confirm(`Apakah anda yakin ingin menghapus buku ${books[index].title}?`)) {
        return;
    }

    books.splice(index, 1);
    saveToLocalStorage("books", books);
    displayBookItems();
}

function selesaiDibaca(index) {
    const books = readFromLocalStorage("books") || [];
    if (books[index].isComplete) {
        books[index].isComplete = false;
    } else {
        books[index].isComplete = true;
    }

    saveToLocalStorage("books", books);
    displayBookItems();
}

const inputBook = document.getElementById("inputBook");
inputBook.addEventListener("submit", (event) => {
    event.preventDefault();
    addBookItem();
});

displayBookItems();


function cariBuku() {
    const searchBookTitle = document.getElementById("searchBookTitle");
    const listPencarian = document.getElementById("list_pencarian");
    const hasilPencarian = document.getElementById("hasilpencarian");
    const books = readFromLocalStorage("books") || [];

    if (searchBookTitle.value.trim()) {
        listPencarian.classList.remove("hiden");
        hasilPencarian.innerHTML = "";
        books.forEach((book, index) => {
            if (book.title.toLowerCase().includes(searchBookTitle.value.toLowerCase())) {
                const bookItem = document.createElement("article");
                bookItem.classList.add("book_item");

                const buttonCompleteText = book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca";

                bookItem.innerHTML = `
              <h3>${book.title}</h3>
              <p>Penulis: ${book.author}</p>
              <p>Tahun: ${book.year}</p>
            `;

                hasilPencarian.appendChild(bookItem);
            }
        });
    } else {
        hasilPencarian.innerHTML = "<p>Hasil Pencarian tidak boleh kosong!</p>";
    }

    if (hasilPencarian.innerHTML === "") {
        hasilPencarian.innerHTML = "<p>Tidak ada buku yang ditemukan!</p>";
    }
}

const searchBook = document.getElementById("searchBook");
searchBook.addEventListener("submit", (event) => {
    event.preventDefault();
    cariBuku();
});