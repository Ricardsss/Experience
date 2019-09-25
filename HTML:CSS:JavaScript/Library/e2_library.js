/* E2 Library - JS */

/*-----------------------------------------------------------*/
/* Starter code - DO NOT edit the code below. */
/*-----------------------------------------------------------*/

// global counts
let numberOfBooks = 0; // total number of books
let numberOfPatrons = 0; // total number of patrons

// global arrays
const libraryBooks = [] // Array of books owned by the library (whether they are loaned or not)
const patrons = [] // Array of library patrons.

// Book 'class'
class Book {
	constructor(title, author, genre) {
		this.title = title;
		this.author = author;
		this.genre = genre;
		this.patron = null; // will be the patron objet

		// set book ID
		this.bookId = numberOfBooks;
		numberOfBooks++;
	}

	setLoanTime() {
		// Create a setTimeout that waits 3 seconds before indicating a book is overdue

		const self = this; // keep book in scope of anon function (why? the call-site for 'this' in the anon function is the DOM window)
		setTimeout(function() {
			
			console.log('overdue book!', self.title)
			changeToOverdue(self);

		}, 3000)

	}
}

// Patron constructor
const Patron = function(name) {
	this.name = name;
	this.cardNumber = numberOfPatrons;

	numberOfPatrons++;
}


// Adding these books does not change the DOM - we are simply setting up the 
// book and patron arrays as they appear initially in the DOM.
libraryBooks.push(new Book('Harry Potter', 'J.K. Rowling', 'Fantasy'));
libraryBooks.push(new Book('1984', 'G. Orwell', 'Dystopian Fiction'));
libraryBooks.push(new Book('A Brief History of Time', 'S. Hawking', 'Cosmology'));

patrons.push(new Patron('Jim John'))
patrons.push(new Patron('Kelly Jones'))

// Patron 0 loans book 0
libraryBooks[0].patron = patrons[0]
// Set the overdue timeout
libraryBooks[0].setLoanTime()  // check console to see a log after 3 seconds


/* Select all DOM form elements you'll need. */ 
const bookAddForm = document.querySelector('#bookAddForm');
const bookInfoForm = document.querySelector('#bookInfoForm');
const bookLoanForm = document.querySelector('#bookLoanForm');
const patronAddForm = document.querySelector('#patronAddForm');
const editNameForm = document.querySelector('#editNameForm');
const bookRemoveForm = document.querySelector('#bookRemoveForm');
const patronRemoveForm = document.querySelector('#patronRemoveForm');

/* bookTable element */
const bookTable = document.querySelector('#bookTable')
/* bookInfo element */
const bookInfo = document.querySelector('#bookInfo')
/* Full patrons entries element */
const patronEntries = document.querySelector('#patrons')

/* Event listeners for button submit and button click */

bookAddForm.addEventListener('submit', addNewBookToBookList);
bookLoanForm.addEventListener('submit', loanBookToPatron);
patronAddForm.addEventListener('submit', addNewPatron);
bookInfoForm.addEventListener('submit', getBookInfo);
editNameForm.addEventListener('submit', changeName);
bookRemoveForm.addEventListener('submit', removeBook);
patronRemoveForm.addEventListener('submit', removePatron);


/* Listen for click patron entries - will have to check if it is a return button in returnBookToLibrary */
patronEntries.addEventListener('click', returnBookToLibrary);

/*-----------------------------------------------------------*/
/* End of starter code - do *not* edit the code above. */
/*-----------------------------------------------------------*/


/** ADD your code to the functions below. DO NOT change the function signatures. **/


/*** Functions that don't edit DOM themselves, but can call DOM functions 
     Use the book and patron arrays appropriately in these functions.
 ***/

// Adds a new book to the global book list and calls addBookToLibraryTable()
function addNewBookToBookList(e) {
	e.preventDefault();

	// Add book book to global array
	const bookName = document.querySelector('#newBookName').value
	const bookAuthor = document.querySelector('#newBookAuthor').value
	const bookGenre = document.querySelector('#newBookGenre').value
	const newBook = new Book(bookName, bookAuthor, bookGenre)
	libraryBooks.push(newBook)

	// Call addBookToLibraryTable properly to add book to the DOM
	addBookToLibraryTable(newBook)
}

// Changes book patron information, and calls addBookToPatronLoans()
function loanBookToPatron(e) {
	e.preventDefault();

	// Get correct book and patron
	const bookId = document.querySelector('#loanBookId').value
	const patronId = document.querySelector('#loanCardNum').value

	// Add patron to the book's patron property
	libraryBooks[bookId].patron = patrons[patronId]

	// Add book to the patron's book table in the DOM by calling addBookToPatronLoans()
	addBookToPatronLoans(libraryBooks[bookId])
	
	// Start the book loan timer.
	libraryBooks[bookId].setLoanTime()
}

// Changes book patron information and calls returnBookToLibraryTable()
function returnBookToLibrary(e) {
	e.preventDefault();
	
	// check if return button was clicked, otherwise do nothing.
	if (e.target.classList[0] != 'return') {
		return
	}
	
	// Call removeBookFromPatronTable()
	bookId = parseInt(e.target.parentNode.parentNode.getElementsByTagName('td')[0].innerHTML)
	removeBookFromPatronTable(libraryBooks[bookId])

	// Change the book object to have a patron of 'null'
	libraryBooks[bookId].patron = null
}

// Creates and adds a new patron
function addNewPatron(e) {
	e.preventDefault();

	// Add a new patron to global array
	const patronName = document.querySelector('#newPatronName').value
	const patron = new Patron(patronName)
	patrons.push(patron)

	// Call addNewPatronEntry() to add patron to the DOM
	addNewPatronEntry(patron)
}

// Gets book info and then displays
function getBookInfo(e) {
	e.preventDefault();

	// Get correct book
	const bookId = document.querySelector('#bookInfoId').value
	const book = libraryBooks[bookId]
	
	// Call displayBookInfo()	
	displayBookInfo(book)
}

function changeName(e) {
	e.preventDefault();

	const patronId = document.querySelector('#patronId').value
	const patronNewName = document.querySelector('#newName').value
	patrons[patronId].name = patronNewName
	const patron = patrons[patronId]

	changePatronName(patron)
}

function removeBook(e) {
	e.preventDefault();

	const bookId = document.querySelector('#bookRemoveId').value
	book = libraryBooks[bookId]
	libraryBooks.splice(bookId, 1)
	var i;

	for (i = 0; i < libraryBooks.length; i++) {
		libraryBooks[i].bookId = i
	}
	numberOfBooks--

	removeBookFromLibrary(book)
}

function removePatron(e) {
	e.preventDefault();

	const patronId = document.querySelector('#patronRemoveId').value
	patron = patrons[patronId]
	patrons.splice(patronId, 1)
	var i;

	for (i = 0; i < patrons.length; i++) {
		patrons[i].cardNumber = i
	}
	numberOfPatrons--

	removePatronFromSystem(patron)
}


/*-----------------------------------------------------------*/
/*** DOM functions below - use these to create and edit DOM objects ***/

// Adds a book to the library table.
function addBookToLibraryTable(book) {
	// Add code here
	const newRow = bookTable.insertRow(numberOfBooks)
	const idCell = newRow.insertCell(0)
	const nameCell = newRow.insertCell(1)
	const patronCell = newRow.insertCell(2)
	
	const id = document.createTextNode(book.bookId)
	const name = document.createTextNode(book.title)
	const strongName = document.createElement('strong')
	strongName.appendChild(name)
	idCell.appendChild(id)
	nameCell.appendChild(strongName)
}


// Displays deatiled info on the book in the Book Info Section
function displayBookInfo(book) {
	// Add code here
	const elementList = bookInfo.getElementsByTagName('p')
	const id = elementList[0].getElementsByTagName('span')[0]
	id.innerHTML = book.bookId
	const name = elementList[1].getElementsByTagName('span')[0]
	name.innerHTML = book.title
	const author = elementList[2].getElementsByTagName('span')[0]
	author.innerHTML = book.author
	const genre = elementList[3].getElementsByTagName('span')[0]
	genre.innerHTML = book.genre
	const patron = elementList[4].getElementsByTagName('span')[0]

	if (book.patron != null) {
		patron.innerHTML = book.patron.name
	}

	else {
		patron.innerHTML = 'N/A'
	}
}

// Adds a book to a patron's book list with a status of 'Within due date'. 
// (don't forget to add a 'return' button).
function addBookToPatronLoans(book) {
	// Add code here
	const patron = patronEntries.getElementsByClassName('patron')[book.patron.cardNumber]
	const loanTable = patron.getElementsByClassName('patronLoansTable')[0]
	const newRow = loanTable.insertRow(loanTable.rows.length)
	const idCell = newRow.insertCell(0)
	const nameCell = newRow.insertCell(1)
	const statusCell = newRow.insertCell(2)
	const returnCell = newRow.insertCell(3)

	const id = document.createTextNode(book.bookId)
	const name = document.createTextNode(book.title)
	const strongName = document.createElement('strong')
	const statusHolder = document.createElement('span')
	statusHolder.classList.add('green')
	const status = document.createTextNode('Within due date')
	strongName.appendChild(name)
	statusHolder.appendChild(status)
	const returnButton = document.createElement('button')
	returnButton.classList.add('return')
	returnButton.innerHTML = 'return'

	idCell.appendChild(id)
	nameCell.appendChild(strongName)
	statusCell.appendChild(statusHolder)
	returnCell.appendChild(returnButton)

	const tableBody = bookTable.getElementsByTagName('tbody')[0]
	const bookRow = tableBody.getElementsByTagName('tr')[book.bookId + 1]
	const patronIdCell = bookRow.getElementsByTagName('td')[2]
	patronIdCell.innerHTML = book.patron.cardNumber
}

// Adds a new patron with no books in their table to the DOM, including name, card number,
// and blank book list (with only the <th> headers: BookID, Title, Status).
function addNewPatronEntry(patron) {
	// Add code here
	const patronDiv = document.createElement('div')
	patronDiv.classList.add('patron')
	
	const nameP = document.createElement('p')
	nameP.innerHTML = 'Name: '
	const nameSpan = document.createElement('span')
	nameSpan.innerHTML = patron.name
	nameP.appendChild(nameSpan)
	patronDiv.appendChild(nameP)
	
	const cardNumberP = document.createElement('p')
	cardNumberP.innerHTML = 'Card Number: '
	const cardNumberSpan = document.createElement('span')
	cardNumberSpan.innerHTML = patron.cardNumber
	cardNumberP.appendChild(cardNumberSpan)
	patronDiv.appendChild(cardNumberP)
	
	const booksOnLoan = document.createElement('h4')
	booksOnLoan.innerHTML = 'Books on loan:'
	patronDiv.appendChild(booksOnLoan)
	
	const loanTable = document.createElement('table')
	loanTable.classList.add('patronLoansTable')
	const headerRow = loanTable.insertRow(0)
	const bookIdHeader = document.createElement('th')
	bookIdHeader.innerHTML = 'BookID'
	const titleHeader = document.createElement('th')
	titleHeader.innerHTML = 'Title'
	const statusHeader = document.createElement('th')
	statusHeader.innerHTML = 'Status'
	const returnHeader = document.createElement('th')
	returnHeader.innerHTML = 'Return'
	headerRow.appendChild(bookIdHeader)
	headerRow.appendChild(titleHeader)
	headerRow.appendChild(statusHeader)
	headerRow.appendChild(returnHeader)
	patronDiv.appendChild(loanTable)
	
	patronEntries.appendChild(patronDiv)
}


// Removes book from patron's book table and remove patron card number from library book table
function removeBookFromPatronTable(book) {
	// Add code here
	const patron = patronEntries.getElementsByClassName('patron')[book.patron.cardNumber]
	const loanTable = patron.getElementsByClassName('patronLoansTable')[0]
	const tableBody = loanTable.getElementsByTagName('tbody')[0]
	var i;

	for (i = 1; i < loanTable.rows.length; i++) {

		if (tableBody.getElementsByTagName('tr')[i].getElementsByTagName('td')[0].innerHTML == book.bookId) {
			loanTable.deleteRow(i)
		}
	}
	const bookTableBody = bookTable.getElementsByTagName('tbody')[0]
	const bookRow = bookTableBody.getElementsByTagName('tr')[book.bookId + 1]
	const patronIdCell = bookRow.getElementsByTagName('td')[2]
	patronIdCell.innerHTML = null
}

// Set status to red 'Overdue' in the book's patron's book table.
function changeToOverdue(book) {
	// Add code here
	const patron = patronEntries.getElementsByClassName('patron')[book.patron.cardNumber]
	const loanTable = patron.getElementsByClassName('patronLoansTable')[0]
	const tableBody = loanTable.getElementsByTagName('tbody')[0]
	const bookRow = tableBody.getElementsByTagName('tr')[loanTable.rows.length - 1]
	const statusCell = bookRow.getElementsByTagName('td')[2]
	const statusHolder = document.createElement('span')
	statusHolder.classList.add('red')
	const status = document.createTextNode('Overdue')
	statusHolder.appendChild(status)
	statusCell.innerHTML = null
	statusCell.appendChild(statusHolder)
}

function changePatronName(patron) {
	const currPatron = patronEntries.getElementsByClassName('patron')[patron.cardNumber]
	const nameP = currPatron.getElementsByTagName('p')[0]
	const nameSpan = nameP.getElementsByTagName('span')[0]
	nameSpan.innerHTML = patron.name
}

function removeBookFromLibrary(book) {
	bookTable.deleteRow(book.bookId + 1)
	const tableBody = bookTable.getElementsByTagName('tbody')[0]
	const tableRows = tableBody.getElementsByTagName('tr')
	var i;

	for (i = 1; i < bookTable.rows.length; i++) {
		tableRows[i].getElementsByTagName('td')[0].innerHTML = i - 1
	}

	const patrons = patronEntries.getElementsByClassName('patron')
	var k;

	for (k = 0; k < patrons.length; k++) {
		const patronLoanTable = patrons[k].getElementsByTagName('table')[0]
		const patronLoanTableBody = patronLoanTable.getElementsByTagName('tbody')[0]
		const patronLoanTableBodyRows = patronLoanTableBody.getElementsByTagName('tr')
		var l;

		for (l = patronLoanTable.rows.length - 1; l > 0; l--) {
			patronLoanTable.deleteRow(l)
		}
	}

	var j;

	for (j = 0; j < numberOfBooks; j++) {
		if (libraryBooks[j].patron != null) {
			addBookToPatronLoans(libraryBooks[j])
			changeToOverdue(libraryBooks[j])
		}
	}
}


function removePatronFromSystem(patron) {
	patronEntries.removeChild(patronEntries.getElementsByClassName('patron')[patron.cardNumber])
	const patrons = patronEntries.getElementsByClassName('patron')
	var i;

	for (i = 0; i < patrons.length; i++) {
		patrons[i].getElementsByTagName('p')[1].getElementsByTagName('span')[0].innerHTML = i

	}
	var j;

	for (j = 0; j < numberOfBooks; j++) {
		if (libraryBooks[j].patron != null) {
			removeBookFromPatronTable(libraryBooks[j])
			addBookToPatronLoans(libraryBooks[j])
			changeToOverdue(libraryBooks[j])
		}
	}
}