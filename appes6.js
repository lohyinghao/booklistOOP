class Book {
    constructor(title, author, isbn) {
        this.title = title,
        this.author = author,
        this.isbn = isbn;
    }
};

class UI {
    addBookToList(book) {
        const list = document.getElementById('book-list');
        // Create tr element
        const row = document.createElement('tr');
        // Insert cols
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><i href="#" class="delete fas fa-times fa-red"></i></td>
        `;

        list.appendChild(row);
    }

    showAlert(message, className) {
        // Create div
        const div = document.createElement('button');
        // Add classes
        div.className = `alert ${className} u-full-width`;
        // Add text
        div.appendChild(document.createTextNode(message));
        // Get parent
        const container = document.querySelector('.container');
        // Get form
        const form = document.querySelector(`#book-form`);
        // Insert alert
        container.insertBefore(div, form);

        // Timeout after 3 sec
        setTimeout(function () {
            document.querySelector('.alert').remove();
        }, 3000);
    }

    deleteBook(target) { 
        target.parentElement.parentElement.remove();
    }

    clearFields() {
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('isbn').value = '';
    }
};

class Store {
    static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books
    }

    static displayBooks() {
        const books = Store.getBooks();

        books.forEach(function(book) {
            const ui = new UI;

            // Add book to UI
            ui.addBookToList(book);
        })
    }
    
    static addBook(book) {
        const books = Store.getBooks();

        books.push(book)

        localStorage.setItem('books', JSON.stringify(books))
    }
    
    static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach(function(book, index) {
            if (book.isbn === isbn){
                books.splice(index, 1)
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
    
};

// DOM Load Event
document.addEventListener('DOMContentLoaded', Store.displayBooks);

// Event Listeners
document.getElementById('book-form').addEventListener('submit',
    function (e) {
        e.preventDefault();

        // Get form values
        const title = document.getElementById('title').value,
            author = document.getElementById('author').value,
            isbn = document.getElementById('isbn').value;

        // Instantiate Book
        const book = new Book(title, author, isbn);

        // Instantiate UI
        const ui = new UI();

        // Validate
        if (title === '' || author === '' || isbn === '') {
            // Error alert
            ui.showAlert('Please fill in all fields', 'error');
        } else {
            // Add book to list
            ui.addBookToList(book);

            // Add to local storage
            Store.addBook(book);

            // Show success
            ui.showAlert(`${book.title} Added!`, 'success');

            // Clear input fields
            ui.clearFields();
        }
    });

// Event Listener for delete
document.getElementById('book-list').addEventListener('click', function (e) {
    // Instantiate UI
    const ui = new UI();

    console.log(e.target.parentElement.previousElementSibling.
        previousElementSibling.previousElementSibling.textContent);

    if (e.target.className.includes('delete')) {
        // Delete book
        ui.deleteBook(e.target);
        // Show message
        ui.showAlert(`${e.target.parentElement.textContent} Removed!`, 'success');

        // Remove from Local Storage
        Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    }
});