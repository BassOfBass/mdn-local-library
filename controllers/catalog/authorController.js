import express from "express";
import async from 'async';
import validator from "express-validator";
import debugLib from "debug";
import Book from '../../models/book.js';
import Author from '../../models/author.js';

const debug = debugLib("author");

/**
 * Display list of all Authors.
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
function author_list(req, res, next) {
  Author.find()
  .populate('author')
  .sort([['family_name', 'ascending']])
  .exec((err, list_authors) => {
      if (err) { return next(err); }
      //Successful, so render
      res.render('catalog/author_list', { title: 'Author List', author_list: list_authors });
    });
};

/**
 * Display detail page for a specific Author.
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
function author_detail(req, res, next) {

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
    res.render('catalog/author_detail', { title: 'Author Detail', author: results.author, author_books: results.authors_books });
  });
};

/**
 * Display Author create form on GET.
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
function author_create_get(req, res, next) {
  res.render('catalog/author_form', { title: 'Create Author' });
};

/**
 * Handle Author create on POST.
 */
const author_create_post = [

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
        res.render('catalog/author_form', { title: 'Create Author', author: req.body, errors: errors.array() });

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

/**
 * Display Author delete form on GET.
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
function author_delete_get(req, res, next) {

  async.parallel({
    author: (callback) => {
      Author.findById(req.params.id).exec(callback);
    },
    authors_books: (callback) => {
      Book.find({ 'author': req.params.id }).exec(callback);
    },
  }, (err, results) => {

    if (err) { return next(err); }

    if (results.author == null) { // No results.
      res.redirect('/catalog/authors');
    }

    // Successful, so render.
    res.render('catalog/author_delete', { title: 'Delete Author', author: results.author, author_books: results.authors_books });
  });

};

/**
 * Handle Author delete on POST.
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
function author_delete_post(req, res, next) {

  async.parallel({
    author: (callback) => {
      Author.findById(req.body.authorid).exec(callback);
    },
    authors_books: (callback) => {
      Book.find({ 'author': req.body.authorid }).exec(callback);
    },
  }, (err, results) => {

    if (err) { return next(err); }

    // Success
    if (results.authors_books.length > 0) {
      // Author has books. Render in same way as for GET route.
      res.render('catalog/author_delete', { title: 'Delete Author', author: results.author, author_books: results.authors_books });

      return;

    } else {
      // We could check if the call to findById() returns any result, and if not,  immediately render the list of all authors.  We've left the code as it is above for brevity (it will still return the list of authors if the id is not found, but this will happen after findByIdAndRemove()).
      // Author has no books. Delete object and redirect to the list of authors.
      Author.findByIdAndRemove(req.body.authorid, (err) => {

        if (err) { return next(err); }

        // Success - go to author list
        res.redirect('/catalog/authors');
      });
    }
  });
};

/**
 * Display Author update form on GET.
 * @param {express.Request} req 
 * @param {express.Response} res 
 * @param {express.NextFunction} next 
 */
function author_update_get(req, res, next) {
  Author.findById(req.params.id, (err, author) => {

    if (err) { 
      debug("Update error: " + err);
      return next(err); 
    }

    if ( author == null ) { // no results
      const err = new Error("Author not found");
      err.status = 404;

      return next(err);

    }

    // success
    res.render("catalog/author_form", {
      title: "Update Author",
      author: author
    });
  });
};

/** Handle Author update on POST. */
const author_update_post = [
  // validate fields
  validator.body("first_name")
  .isLength({ min: 1 })
  .trim().withMessage("First name must be specified.")
  .isAlphanumeric().withMessage("First name has non-alphanumeric characters."),

  validator.body("family_name")
  .isLength({ min: 1})
  .trim().withMessage("Family name must be specified.")
  .isAlphanumeric().withMessage("Family name has non-alphanumeric characters."),

  validator.body("date_of_birth", "Invalid date of birth")
  .optional({ checkFalsy: true }).isISO8601(),

  validator.body("date_of_death", "Invalid date of death")
  .optional({ checkFalsy: true }).isISO8601(),

  // sanitize fields
  validator.sanitizeBody("first_name").escape(),
  validator.sanitizeBody("family_name").escape(),
  validator.sanitizeBody("date_of_birth").toDate(),
  validator.sanitizeBody("date_of_death").toDate(),

  // process request after validation and sanitization
  (req, res, next) => {
    /** Validation errors extracted from a request. */
    const errors = validator.validationResult(req);
    /** Author object with escaped and trimmed data (and the old id!). */
    const author = new Author(
      {
        first_name: req.body.first_name,
        family_name: req.body.family_name,
        date_of_birth: req.body.date_of_birth,
        date_of_death: req.body.date_of_death,
        _id: req.params.id
      }
    );

    if ( !errors.isEmpty() ) {
      // there are errors, render the form again with sanitized values and error messages
      res.render("catalog/author_form", {
        title: "Update Author",
        author: author,
        errors: errors.array()
      });

      return;

    } else {
      // data form is valid, update the record
      Author.findByIdAndUpdate(req.params.id, author, {}, (err, theauthor) => {

        if (err) { return next(err); }

        // successful, redirect to genre detail page
        res.redirect(theauthor.url);
      });
    }
  }
];

export default {
  author_list,
  author_detail,
  author_create_get,
  author_create_post,
  author_delete_get,
  author_delete_post,
  author_update_get,
  author_update_post,
};