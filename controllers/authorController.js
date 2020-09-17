const async = require('async');
const validator = require("express-validator");
const Book = require('../models/book');
const Author = require('../models/author');

/**
 * Display list of all Authors.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.author_list = (req, res, next) => {
  Author.find()
  .populate('author')
  .sort([['family_name', 'ascending']])
  .exec((err, list_authors) => {
      if (err) { return next(err); }
      //Successful, so render
      res.render('author_list', { title: 'Author List', author_list: list_authors });
    });
};

/**
 * Display detail page for a specific Author.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.author_detail = (req, res, next) => {

  async.parallel({
    author: (callback) => {
      Author
      .findById(req.params.id)
      .exec(callback);
    },
    authors_books: (callback) => {
      Book
      .find({ 'author': req.params.id }, 'title summary')
      .exec(callback);
    },
  }, (err, results) => {

    if (err) { return next(err); } // Error in API usage.

    if (results.author == null) { // No results.
      let err = new Error('Author not found');
      err.status = 404;
      return next(err);
    }

    // Successful, so render.
    res.render('author_detail', { title: 'Author Detail', author: results.author, author_books: results.authors_books });
  });
};

/**
 * Display Author create form on GET.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.author_create_get = (req, res, next) => {
  res.render('author_form', { title: 'Create Author' });
};

/**
 * Handle Author create on POST.
 * 
 * TODO: check for Author duplicates before submit.
 */
exports.author_create_post = [

  // Validate fields.
  validator.body('first_name').isLength({ min: 1 }).trim().withMessage('First name must be specified.')
      .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
  validator.body('family_name').isLength({ min: 1 }).trim().withMessage('Family name must be specified.')
      .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
  validator.body('date_of_birth', 'Invalid date of birth').optional({ checkFalsy: true }).isISO8601(),
  validator.body('date_of_death', 'Invalid date of death').optional({ checkFalsy: true }).isISO8601(),

  // Sanitize fields.
  validator.sanitizeBody('first_name').escape(),
  validator.sanitizeBody('family_name').escape(),
  validator.sanitizeBody('date_of_birth').toDate(),
  validator.sanitizeBody('date_of_death').toDate(),

  // Process request after validation and sanitization.
  // TODO: rewrite as a separate function
  (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validator.validationResult(req);

    if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/errors messages.
        res.render('author_form', { title: 'Create Author', author: req.body, errors: errors.array() });

        return;
    }
    else {
        // Data from form is valid.

        /**
         * An Author object with escaped and trimmed data.
         */
        let author = new Author(
            {
                first_name: req.body.first_name,
                family_name: req.body.family_name,
                date_of_birth: req.body.date_of_birth,
                date_of_death: req.body.date_of_death
            });
        author.save((err) => {

          if (err) { return next(err); }

          // Successful - redirect to new author record.
          res.redirect(author.url);
        });
    }
  }
];

// Display Author delete form on GET.
exports.author_delete_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Author delete GET');
};

// Handle Author delete on POST.
exports.author_delete_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Author delete POST');
};

// Display Author update form on GET.
exports.author_update_get = (req, res) => {
  res.send('NOT IMPLEMENTED: Author update GET');
};

// Handle Author update on POST.
exports.author_update_post = (req, res) => {
  res.send('NOT IMPLEMENTED: Author update POST');
};