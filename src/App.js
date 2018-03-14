import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import Book from './Book'
import * as BooksAPI from './BooksAPI'
import './App.css'

class BooksApp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      allBooks: [],
      currentlyReading: [],
      wantToRead: [],
      read: [],
      searchQuery: "",
      searchResults: []
    }
  }

  // Handle shelf change for a book
  handleShelfChange = (book, shelf) => {
    BooksAPI.update(book, shelf).then((updatedBook) => {    
      this.loadBooks();
    });  
  }

  componentDidMount() {
    this.loadBooks();
  }

  // Get all books from server 
  // and group them by shelves
  loadBooks() {

    BooksAPI.getAll().then(books => {

      let currentlyReading = books.filter(book => book.shelf === 'currentlyReading');
      let wantToRead = books.filter(book => book.shelf === 'wantToRead');
      let read = books.filter(book => book.shelf === 'read');

      this.setState({
        allBooks: books,
        currentlyReading: currentlyReading,
        wantToRead: wantToRead,
        read: read
      });

    });

  }

  // Update state's query on each key stroke
  // This will re-render the component.
  updateSearchQuery(query) {
    this.setState({ searchQuery: query.trim() });
    this.searchBooks();
  }

  // Search books. After fetching the results look at our shelves and see
  // if we have the same book already. If we do, use this shelf. Otherwise
  // use 'none' as shelf. Then set the searchResults in the state object.
  searchBooks() {

    if (!this.state.searchQuery) {
      return;
    }

    // Search the server
    BooksAPI.search(this.state.searchQuery).then(searchResults => {
      
      // We will collect fixed search results here
      var fixedSearchResults = [];

      // Iterate in searchResults
      searchResults.forEach(searchResult => {
        
        // Add shelf property to book with default value 'none'
        searchResult.shelf = 'none';

        // If this book is already on a shelf, set shelf property
        this.state.allBooks.forEach(myBook => {
          if (searchResult.id === myBook.id) {
            searchResult.shelf = myBook.shelf;
          }
        });

        // Add the result to the array
        fixedSearchResults.push(searchResult);

      });
      
      // Set state using search results
      this.setState({ searchResults: fixedSearchResults });

    });

  }

  render() {
    return (
      <div className="app">

        { /* List View */ }
        <Route exact path="/" render={() => (
          <div className="list-books">
          <div className="list-books-title">
            <h1>MyReads</h1>
          </div>
          <div className="list-books-content">
            <div>
              <div className="bookshelf">
                <h2 className="bookshelf-title">Currently Reading</h2>
                <div className="bookshelf-books">
                  <ol className="books-grid">
                    {this.state.currentlyReading.map(book =>
                      <li key={book.id} >
                        <Book details={book} handleShelfChange={this.handleShelfChange}/>
                      </li>
                    )}
                  </ol>
                </div>
              </div>
              <div className="bookshelf">
                <h2 className="bookshelf-title">Want to Read</h2>
                <div className="bookshelf-books">
                  <ol className="books-grid">
                    {this.state.wantToRead.map(book =>
                      <li key={book.id} >
                        <Book details={book} handleShelfChange={this.handleShelfChange}/>
                      </li>
                    )}
                  </ol>
                </div>
              </div>
              <div className="bookshelf">
                <h2 className="bookshelf-title">Read</h2>
                <div className="bookshelf-books">
                  <ol className="books-grid">
                    {this.state.read.map(book =>
                      <li key={book.id} >
                        <Book details={book} handleShelfChange={this.handleShelfChange}/>
                      </li>
                    )}
                  </ol>
                </div>
              </div>
            </div>
          </div>
          <div className="open-search">
            <Link to='/search'/>           
          </div>
          </div>
        )}/>

        { /* Search View */ }
        <Route path="/search" render={() => (
          <div className="search-books">
              <div className="search-books-bar">
                  <Link className="close-search" to='/'>Close</Link>
                  <div className="search-books-input-wrapper">
                      <input 
                          type="text" 
                          placeholder="Search by title or author"
                          value={this.state.query}
                          onChange={((event) => this.updateSearchQuery(event.target.value))}      
                      />
                  </div>
              </div>
              <div className="search-books-results">
                  <ol className="books-grid">
                    {this.state.searchResults && this.state.searchResults.map(book =>
                        <li key={book.id}>
                          <Book details={book} handleShelfChange={this.handleShelfChange}/>
                        </li>
                    )}

                  </ol>
              </div>
          </div>         
        )}/>

      </div>
    )
  }
}

export default BooksApp
