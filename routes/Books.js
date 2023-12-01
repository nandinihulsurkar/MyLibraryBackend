import express from "express";
const router = express.Router();

import db from './Database.js';

router.get('/', (req, res) => {
    const getBooksQry = "SELECT * FROM books";
    db.query(getBooksQry, (err, booksData) => {
        if(err) return res.json("Server Side : fetching data from books table failed.");
        
        return res.json(booksData);
    })
});

router.get('/fetchAuthors', (req, res) => {
    const getAuthorQry = "SELECT id, author FROM books GROUP BY author";
    db.query(getAuthorQry, (err, authorData) => {
        if(err) return res.json("Server Error : fetching authors from books table failed.");
        
        return res.json(authorData);
    })
})

router.get('/fetchBookDetails/:bid', (req, res) => {
    const bookId = req.params.bid;

    const getBookQry = "SELECT * FROM books WHERE id = "+bookId;
    db.query(getBookQry, (err, booksData) => {
        
        if(err) return res.json("Server Side : fetching book details from books table failed.");
        
        return res.json(booksData);
    })
});

router.post('/addOrEditBook', (req, res) => {    
    let bookId = 0;
    "id" in req.body ? bookId = req.body.id : bookId = 0;
    
    if(bookId > 0)
    {
        const updateQuery = "UPDATE books SET isbn = ?,  title = ?, publisher = ?, author = ?, language = ?, total_count = ?, available_count = ?, no_of_borrow_days = ?, fine_per_day = ? WHERE id = "+req.body.id;
        db.query(updateQuery, [req.body.isbn, req.body.title, req.body.publisher, req.body.author, req.body.language, req.body.total_count, req.body.available_count, req.body.no_of_borrow_days, req.body.fine_per_day], (err, resData) => {
            if(err) return res.json("Server Error : updating book data into books table failed.");

            return res.json("Edit Book Success");
        })
    }
    else
    {
        const insertQuery = "INSERT INTO books (`isbn`, `title`,`publisher`,`author`,`language`, `total_count`, `available_count`, `no_of_borrow_days`, `fine_per_day`) VALUES  (?, ?, ?, ?, ?, ?, ?, ?, ?) ";
        db.query(insertQuery, [req.body.isbn, req.body.title, req.body.publisher, req.body.author, req.body.language, req.body.total_count, req.body.available_count, req.body.no_of_borrow_days, req.body.fine_per_day], (err, resData) => {
            if(err) return res.json("Server Error : inserting book data into books table failed.");

            return res.json("Add Book Success");
        })       
    } 
});

export default router;