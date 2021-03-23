// Book Class: Represent a book
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI class: Handle UI Tasks
class UI {
    static displayBooks() {
        // dummy data
        // const StoredBooks = [
        //     {
        //         title: 'Book One',
        //         author: 'John Doe',
        //         isbn : '3122123'
        //     },
        //     {
        //         title : 'Book Two',
        //         author : 'Jane Doe',
        //         isbn : '44333'
        //     }
        // ];

        const books = Store.getBooks();

        // loops through them and call a method to add
        books.forEach((book) => UI.addBookToList(book))
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;
        
        list.appendChild(row);
    }

    static deleteBook(el) {
        if(el.classList.contains('delete')) {
            el.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-from');
        container.insertBefore(div, form);

        // Vanish in 3 seconds
        setTimeout(() => document.querySelector('.alert').remove(), 
        2000);

    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
}

// Store Class: Handles Storage
class Store {
    //Method to get books
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    // Method to add books
    static addBooks(book) {
        const books = Store.getBooks();
        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));

    }

    // Method to remove book
    static removeBook(isbn) {
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Event: Dispay Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: Add a Book
document.querySelector('#book-from').addEventListener('submit', (e) => {
    // prevent actual submit
    e.preventDefault();

    //get form values
    const title = document.querySelector("#title").value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;


    // validate
    if(title=== '' || author=== '' || isbn=== '') {
        UI.showAlert('PLease Fill in all fields', 'danger');
    } else {

    // Instatiate a book
    const book = new Book(title, author, isbn);

    // Add Bookk to UI
    UI.addBookToList(book);

    // Add book to store
    Store.addBooks(book);

    // success message
    UI.showAlert('Book Added', 'success');

    // clear Fields
    UI.clearFields();
    }



    // console.log(book);
});

// Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {
    // Remove book from Ui
    UI.deleteBook(e.target);

    // Remove book from store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    //show delete message
    UI.showAlert('Book deleted', 'info');
});