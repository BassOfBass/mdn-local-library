const async = require("async");
const validator = require("express-validator");
const Book = require('../models/book');
const Author = require('../models/author');
const Genre = require('../models/genre');
const BookInstance = require('../models/bookinstance');


/**
 * Index page info.
 * @param {*} req 
 * @param {*} res 
 */
exports.index = (req, res) => {

  async.parallel({
    book_count: (callback) => {
      Book.countDocuments({}, callback); // Pass an empty object as match condition to find all documents of this collection
    },
    book_instance_count: (callback) => {
      BookInstance.countDocuments({}, callback);
    },
    book_instance_available_count: (callback) => {
      BookInstance.countDocuments({ status: 'Available' }, callback);
    },
    author_count: (callback) => {
      Author.countDocuments({}, callback);
    },
    genre_count: (callback) => {
      Genre.countDocuments({}, callback);
    }
  }, (err, results) => { 
    res.render('index', { title: 'Local Library Home', error: err, data: results });
  });
};
 
/**
 * Display list of all books.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.book_list = (req, res, next) => {

  Book.find({}, 'title author')
  .populate('author')
  .exec((err, list_books) => {
    if (err) { return next(err); }
    //Successful, so render
    res.render('book_list', { title: 'Book List', book_list: list_books });
  });

};

/**
 * Display detail page for a specific book.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.book_detail = (req, res, next) => {

  async.parallel({
    book: (callback) => {
      Book
      .findById(req.params.id)
      .populate('author')
      .populate('genre')
      .exec(callback);
    },
    book_instance: (callback) => {
      BookInstance
      .find({ 'book': req.params.id })
      .exec(callback);
    },
  }, (err, results) => {

      if (err) { return next(err); }

      if (results.book == null) { // No results.
        var err = new Error('Book not found');
        err.status = 404;
        return next(err);
      }
      
      // Successful, so render.
      res.render('book_detail', { title: results.book.title, book: results.book, book_instances: results.book_instance });
    });

};

/**
 * Display book create form on GET.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.book_create_get = (req, res, next) => {

  // Get all authors and genres, which we can use for adding to our book.
  async.parallel({
    authors: (callback) => {
      Author.find(callback);
    },
    genres: (callback) => {
      Genre.find(callback);
    },
  }, (err, results) => {

      if (err) { return next(err); }

      res.render('book_form', { title: 'Create Book', authors: results.authors, genres: results.genres });
  });
};

/** Handle book create on POST. */
exports.book_create_post = [

  // Convert the genre to an array.
  (req, res, next) => {

      if ( !(req.body.genre instanceof Array) ) {

        if ( typeof req.body.genre === 'undefined' )
        req.body.genre = [];

        else
        req.body.genre = new Array(req.body.genre);
      }

      next();
  },

  // Validate fields.
  validator.body('title', 'Title must not be empty.').trim().isLength({ min: 1 }),
  validator.body('author', 'Author must not be empty.').trim().isLength({ min: 1 }),
  validator.body('summary', 'Summary must not be empty.').trim().isLength({ min: 1 }),
  validator.body('isbn', 'ISBN must not be empty').trim().isLength({ min: 1 }),

  // Sanitize fields (using wildcard).
  validator.sanitizeBody('*').escape(),
  validator.sanitizeBody('genre.*').escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    /**
     * Validation errors extracted from a request;
     */
    const errors = validator.validationResult(req);

    /**
     * A Book object with escaped and trimmed data.
     */
    const book = new Book({ 
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: req.body.genre
    });

    if ( !errors.isEmpty() ) {
        // There are errors. Render form again with sanitized values/error messages.

        // Get all authors and genres for form.
        async.parallel({
          authors: (callback) => {
          Author.find(callback);
        },
          genres: (callback) => {
            Genre.find(callback);
          },
        }, (err, results) => {

            if (err) { return next(err); }

            // Mark our selected genres as checked.
            for (let i = 0; i < results.genres.length; i++) {

              if (book.genre.indexOf(results.genres[i]._id) > -1) {
                results.genres[i].checked = 'true';
              }

            }

            res.render('book_form', { 
              title: 'Create Book', 
              authors: results.authors, 
              genres: results.genres, 
              book: book, 
              errors: errors.array() 
            });
          });

        return;
    } else {
      // Data from form is valid. Save book.
      book.save((err) => {

        if (err) { return next(err); }

        //successful - redirect to new book record.
        res.redirect(book.url);
      });
    }
  }
];

/**
 * Display book delete form on GET.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.book_delete_get = (req, res, next) => {
  async.parallel({
    book: (callback) => {
      Book.findById(req.params.id).populate("author").populate("genre").exec(callback);
    },
    book_bookinstances: (callback) => {
      BookInstance.find({ "book": req.params.id }).exec(callback);
    },
  }, (err, results) => {

    if (err) { return next(err) };

    if (results.book == null) { // no results
      res.redirect("catalog/books");
    }

    // successful, so render
    res.render("book_delete", {
      title: "Delete Book",
      book: results.book,
      book_instances: results.book_bookinstances
    });
  });
};

/**
 * Handle book delete on POST.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.book_delete_post = (req, res, next) => {
  // assume the post has valid id (ie no validation/sanitization)
  async.parallel({
    book: (callback) => {
      Book.findById(req.body.id).populate("author").populate("genre").exec(callback);
    },
    book_bookinstances: (callback) => {
      BookInstance.find({ "book": req.body.id }).exec(callback);
    },
  }, (err, results) => {

    if (err) { return next(err); }

    // success
    if (results.book_bookinstances.length > 0) {
      // Book has book_instances, render as GET route
      res.render("book_delete", {
        title: "Delete Book",
        book: results.book,
        book_instances: results.book_bookinstances
      });

      return;

    } else {
      // Book has no BookInstance objects
      // delete object and redirect to the list of books
      Book.findByIdAndRemove(req.body.id, (err) => {

        if (err) { return next(err); }

        // success, go to book list`
        res.redirect("/catalog/books");
      });
    }
  });
};

/**
 * Display book update form on GET.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.book_update_get = (req, res, next) => {

  // Get book, authors and genres for form.
  async.parallel({
    book: (callback) => {
      Book.findById(req.params.id).populate('author').populate('genre').exec(callback);
    },
    authors: (callback) => {
      Author.find(callback);
    },
    genres: (callback) => {
      Genre.find(callback);
    },
  }, (err, results) => {

    if (err) { return next(err); }

    if (results.book == null) { // No results.
      const err = new Error('Book not found');
      err.status = 404;

      return next(err);
    }

    // Success.
    // Mark our selected genres as checked.
    for (let all_g_iter = 0; all_g_iter < results.genres.length; all_g_iter++) {

      for (let book_g_iter = 0; book_g_iter < results.book.genre.length; book_g_iter++) {

        if (results.genres[all_g_iter]._id.toString() == results.book.genre[book_g_iter]._id.toString()) {
          results.genres[all_g_iter].checked = 'true';
        }
      }
    }

    res.render('book_form', { 
      title: 'Update Book', 
      authors: results.authors, 
      genres: results.genres, book: 
      results.book 
    });
  });
};

/** Handle book update on POST. */
exports.book_update_post = [

  // Convert the genre to an array
  (req, res, next) => {

    if( !(req.body.genre instanceof Array) ) {

      if( typeof req.body.genre === 'undefined' )
      req.body.genre = [];

      else
      req.body.genre = new Array(req.body.genre);
    }

    next();
  },
 
  // Validate fields.
  validator.body('title', 'Title must not be empty.').trim().isLength({ min: 1 }),
  validator.body('author', 'Author must not be empty.').trim().isLength({ min: 1 }),
  validator.body('summary', 'Summary must not be empty.').trim().isLength({ min: 1 }),
  validator.body('isbn', 'ISBN must not be empty').trim().isLength({ min: 1 }),

  // Sanitize fields.
  validator.sanitizeBody('title').escape(),
  validator.sanitizeBody('author').escape(),
  validator.sanitizeBody('summary').escape(),
  validator.sanitizeBody('isbn').escape(),
  validator.sanitizeBody('genre.*').escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {

    /** Validayion errors extracted from a request. */
    const errors = validator.validationResult(req);

    /** A Book object with escaped/trimmed data and old id. */
    const book = new Book({ 
      title: req.body.title,
      author: req.body.author,
      summary: req.body.summary,
      isbn: req.body.isbn,
      genre: ( typeof req.body.genre === 'undefined' ) ? [] : req.body.genre,
      _id:req.params.id //This is required, or a new ID will be assigned!
    });

    if ( !errors.isEmpty() ) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all authors and genres for form.
      async.parallel(
        {
          authors: (callback) => {
          Author.find(callback);
        },
          genres: (callback) => {
            Genre.find(callback);
          },
        }, (err, results) => {

          if (err) { return next(err); }

          // Mark our selected genres as checked.
          for (let i = 0; i < results.genres.length; i++) {

            if (book.genre.indexOf(results.genres[i]._id) > -1) {
              results.genres[i].checked = 'true';
            }

          }

          res.render('book_form', { 
            title: 'Update Book', 
            authors: results.authors, 
            genres: results.genres, 
            book: book, 
            errors: errors.array() 
          });
        }
      );
        
      return;

    } else {
      // Data from form is valid. Update the record.
      Book.findByIdAndUpdate(req.params.id, book, {}, (err, thebook) => {

        if (err) { return next(err); }
        
        // Successful - redirect to book detail page.
        res.redirect(thebook.url);
      });
    }
  }
];