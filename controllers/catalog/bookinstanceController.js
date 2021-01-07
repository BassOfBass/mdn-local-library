import express from "express";
import async  from "async";
import validator  from "express-validator";
import BookInstance  from '../models/bookinstance.js';
import Book  from '../models/book.js';

/**
 * Display list of all BookInstances.
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
function bookinstance_list(req, res, next) {

  BookInstance.find()
  .populate('book')
  .exec((err, list_bookinstances) => {

    if (err) { return next(err); }
    
    // Successful, so render
    res.render('catalog/bookinstance_list', { title: 'Book Instance List', bookinstance_list: list_bookinstances });
  });

};

/**
 * Display detail page for a specific BookInstance.
 * @param {express.Request} req 
 * @param {express.Response} res 
 */
function bookinstance_detail(req, res, next) {
  BookInstance.findById(req.params.id)
  .populate('book')
  .exec((err, bookinstance) => {

      if (err) { return next(err); }

      if (bookinstance == null) { // No results.
        let err = new Error('Book copy not found');
        err.status = 404;
        return next(err);
      }

      // Successful, so render.
      res.render('catalog/bookinstance_detail', { title: 'Copy: ' + bookinstance.book.title, bookinstance: bookinstance });
  });
};

/**
 * Display BookInstance create form on GET.
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
function bookinstance_create_get(req, res, next){

  Book.find({}, 'title')
  .exec((err, books) => {

    if (err) { return next(err); }

    // Successful, so render.
    res.render('catalog/bookinstance_form', { title: 'Create BookInstance', book_list: books });
  });
};

/** Handle BookInstance create on POST. */
const bookinstance_create_post = [

  // Validate fields.
  validator.body('book', 'Book must be specified').trim().isLength({ min: 1 }),
  validator.body('imprint', 'Imprint must be specified').trim().isLength({ min: 1 }),
  validator.body('due_back', 'Invalid date').optional({ checkFalsy: true }).isISO8601(),
  
  // Sanitize fields.
  validator.sanitizeBody('book').escape(),
  validator.sanitizeBody('imprint').escape(),
  validator.sanitizeBody('status').trim().escape(),
  validator.sanitizeBody('due_back').toDate(),
  
  // Process request after validation and sanitization.
  (req, res, next) => {
 
    /** The validation errors extracted from a request. */
    const errors = validator.validationResult(req);

    /** A BookInstance object with escaped and trimmed data. */
    const bookinstance = new BookInstance({ 
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back
    });

    if ( !errors.isEmpty() ) {
        // There are errors. Render form again with sanitized values and error messages.
        Book.find({},'title')
        .exec((err, books) => {

          if (err) { return next(err); }

          // Successful, so render.
          res.render('catalog/bookinstance_form', { 
            title: 'Create BookInstance', 
            book_list: books, 
            selected_book: bookinstance.book._id, 
            errors: errors.array(), 
            bookinstance: bookinstance });
        });

        return;

    } else {
      // Data from form is valid.
      bookinstance.save((err) => {

        if (err) { return next(err); }
        
        // Successful - redirect to new record.
        res.redirect(bookinstance.url);
      });
    }
  }
];

/**
 * Display BookInstance delete form on GET.
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
function bookinstance_delete_get(req, res, next) {
  BookInstance.findById(req.params.id)
  .populate("book")
  .exec( (err, bookinstance) => {

    if (err) { return next(err); }

    if ( bookinstance == null ) { // no results
      res.redirect("/catalog/bookinstances");
    }

    // successful, so render
    res.render("bookinstance_delete", {
      title: "Delete BookInstance", 
      bookinstance: bookinstance
    });
  });
};

/**
 * Handle BookInstance delete on POST.
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
function bookinstance_delete_post(req, res, next) {
  // assume valid BookInstance id in field
  BookInstance.findByIdAndRemove(req.body.id, (err) => {

    if (err) { return next(err) };

    // success, so redirect to list of BookInstance items
    res.redirect("/catalog/bookinstances");
  });
}

/**
 * Display BookInstance update form on GET.
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
function bookinstance_update_get(req, res, next) {
  // get books, authors and genres for form
  async.parallel({
    bookinstance: (callback) => {
      BookInstance.findById(req.params.id)
      .populate("book")
      .exec(callback)
    },
    books: (callback) => {
      Book.find(callback)
    },
  }, (err, results) => {

    if (err) { return next(err); }

    if (results.bookinstance == null) { // no results
      const err = new Error("Book copy not found");
      err.status = 404;

      return next(err);

    }

    // success
    res.render("bookinstance_form", {
      title: "Update BookInstance",
      book_list: results.books,
      selected_book: results.bookinstance.book._id,
      bookinstance: results.bookinstance
    });
  });
};

/** Handle bookinstance update on POST. */
const bookinstance_update_post = [
  // validate fields
  validator.body("book", "Book must be specified")
  .isLength({ min: 1 })
  .trim(),

  validator.body("imprint", "Imprint must be specified")
  .isLength({ min: 1})
  .trim(),

  validator.body("due_back", "Invalid date")
  .optional({ checkFalsy: true })
  .isISO8601(),

  // sanitize fields
  validator.sanitizeBody("book").escape(),
  validator.sanitizeBody("imprint").escape(),
  validator.sanitizeBody("status").escape(),
  validator.sanitizeBody("due_back").toDate(),

  // process request after validation and sanitization
  (req, res, next) => {
    /** Validation errors exracted from a request. */
    const errors = validator.validationResult(req);
    /** A BookInstance object with escaped/trimmed data and current id. */
    const bookinstance = new BookInstance({
      book: req.body.book,
      imprint: req.body.imprint,
      status: req.body.status,
      due_back: req.body.due_back,
      _id: req.params.id
    });

    if ( !errors.isEmpty() ) {
      // there are errors
      // render the form again with sanitized values and errors
      Book.find({}, "title")
      .exec( (err, books) => {

        if (err) { return next(err); }

        // successful, so render
        res.render("bookinstance_form", {
          title: 'Update BookInstance', 
          book_list: books, 
          selected_book: bookinstance.book._id, 
          errors: errors.array(), 
          bookinstance: bookinstance
        });
      });

      return;

    } else {
      // data from form is valid
      BookInstance.findByIdAndUpdate(req.params.id, bookinstance, {}, (err, thebookinstance) => {

        if (err) { return next(err); }

        // successful, redirect to detail page
        res.redirect(thebookinstance.url);
      });
    }
  }
];

export default {
  bookinstance_list,
  bookinstance_detail,
  bookinstance_create_get,
  bookinstance_create_post,
  bookinstance_delete_get,
  bookinstance_delete_post,
  bookinstance_update_get,
  bookinstance_update_post,
};