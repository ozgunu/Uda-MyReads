import React from 'react';
import { Component } from 'react';

class Book extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: this.props.details.id,
            title: this.props.details.title,
            authors: this.props.details.authors,
            imageLinks: this.props.details.imageLinks,
            shelf: this.props.details.shelf
        }
    }

    handleShelfChange = (event) => {     
        let newShelf = event.target.value;
        this.setState({shelf: newShelf});
        this.props.handleShelfChange(this.state, newShelf);
    }

    render() {
        return (
            <div className="book">
                <div className="book-top">
                    <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: "url(" + this.state.imageLinks.thumbnail + ")" }}></div>
                    <div className="book-shelf-changer">
                        <select value={this.state.shelf} onChange={this.handleShelfChange}>
                            <option value="none" disabled>Move to...</option>
                            <option value="currentlyReading" selected={this.state.currentlyReading}>Currently Reading</option>
                            <option value="wantToRead" selected={this.state.wantToRead}>Want to Read</option>
                            <option value="read" selected={this.state.read}>Read</option>
                            <option value="none">None</option>
                        </select>
            </div>
                </div>
                <div className="book-title">{this.state.title}</div>
                <div className="book-authors">{this.state.authors.join(", ")}</div>
            </div>
        )
    }

}

export default Book;

