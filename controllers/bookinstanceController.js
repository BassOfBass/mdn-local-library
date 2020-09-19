const validator = require("express-validator");
const BookInstance = require('../models/bookinstance');
const Book = require('../models/book');

/**
 * Display list of all BookInstances.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.bookinstance_list = (req, res, next) => {

  BookInstance.find()
  .populate('book')
  .exec((err, list_bookinstances) => {

    if (err) { return next(err); }
    
    // Successful, so render
    res.render('bookinstance_list', { title: 'Book Instance List', bookinstance_list: list_bookinstances });
  });

};

/**
 * Display detail page for a specific BookInstance.
 * @param {*} req 
 * @param {*} res 
 */
exports.bookinstance_detail = (req, res, next) => {
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
      res.render('bookinstance_detail', { title: 'Copy: ' + bookinstance.book.title, bookinstance: bookinstance });
  });
};

/**
 * Display BookInstance create form on GET.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.bookinstance_create_get = (req, res, next) => {

  Book.find({}, 'title')
  .exec((err, books) => {

    if (err) { return next(err); }

    // Successful, so render.
    res.render('bookinstance_form', { title: 'Create BookInstance', book_list: books });
  });
};

/**
 * Handle BookInstance create on POST.
 */
exports.bookinstance_create_post = [

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
          res.render('bookinstance_form', { 
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
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.bookinstance_delete_get = (req, res, next) => {
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
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.bookinstance_delete_post = (req, res, next) => {
  // assume valid BookInstance id in field
  BookInstance.findByIdAndRemove(req.body.id, (err) => {

    if (err) { return next(err) };

    // success, so redirect to list of BookInstance items
    res.redirect("/catalog/bookinstances");
  });
}

// Display BookInstance update form on GET.
exports.bookinstance_update_get = (req, res) => {
  res.send('NOT IMPLEMENTED: BookInstance update GET');
};

// Handle bookinstance update on POST.
exports.bookinstance_update_post = (req, res) => {
  res.send('NOT IMPLEMENTED: BookInstance update POST');
};