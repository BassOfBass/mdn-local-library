const async = require('async');
const validator = require('express-validator');
const Genre = require('../models/genre');
const Book = require('../models/book');

/**
 * Display list of all Genre.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.genre_list = (req, res, next) => {
  Genre
  .find()
  .populate("genre")
  .sort([[ "name", "ascending" ]])
  .exec((err, list_genres) => {
    if (err) { return next(err); }
    res.render("genre_list", { title: "Genre List", genre_list: list_genres});
  });
}

/**
 * Display detail page for a specific Genre.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.genre_detail = (req, res, next) => {

  async.parallel({
    genre: (callback) => {
      Genre.findById(req.params.id)
        .exec(callback);
    },
    genre_books: (callback) => {
      Book.find({ 'genre': req.params.id })
        .exec(callback);
    },
  }, (err, results) => {

      if (err) { return next(err); }

      if (results.genre == null) { // No results.
        var err = new Error('Genre not found');
        err.status = 404;
        return next(err);
      }

      // Successful, so render
      res.render('genre_detail', { title: 'Genre Detail', genre: results.genre, genre_books: results.genre_books });
    });

};

/**
 * Display Genre create form on GET.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.genre_create_get = (req, res, next) => {
  res.render('genre_form', { title: 'Create Genre' });
};

/** Handle Genre create on POST. */
exports.genre_create_post = [

  // Validate that the name field is not empty.
  validator.body('name', 'Genre name required').trim().isLength({ min: 1 }),

  // Sanitize (escape) the name field.
  validator.sanitizeBody('name').escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    /** Validation errors extracted from a request. */
    const errors = validator.validationResult(req);
    /** A genre object with escaped and trimmed data. */
    let genre = new Genre(
      { name: req.body.name }
    );

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('genre_form', { title: 'Create Genre', genre: genre, errors: errors.array()});

      return;
    } else {
      // Data from form is valid.
      // Check if Genre with same name already exists.
      Genre.findOne({ 'name': req.body.name })
      .exec( (err, found_genre) => {

        if (err) { return next(err); }

        if (found_genre) {
          // Genre exists, redirect to its detail page.
          res.redirect(found_genre.url);
        } else {
          genre.save((err) => {

            if (err) { return next(err); }

            // Genre saved. Redirect to genre detail page.
            res.redirect(genre.url);
          });
        }
      });
    }
  }
];

/**
 * Display Genre delete form on GET.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.genre_delete_get = (req, res, next) => {
  async.parallel({
    genre: (callback) => {
      Genre.findById(req.params.id).exec(callback);
    },
    genre_books: (callback) => {
      Book.find({ "genre": req.params.id }).exec(callback);
    },
  }, (err, results) => {

    if (err) { return next(err) };

    if (results.genre == null) { // no results
      res.redirect("catalog/genres");
    }

    // successful, so render
    res.render("genre_delete", {
      title: "Delete Genre",
      genre: results.genre,
      genre_books: results.genre_books
    });
  });
};

/**
 * Handle Genre delete on POST.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.genre_delete_post = (req, res, next) => {
  async.parallel({
    genre: (callback) => {
      Genre.findById(req.params.id).exec(callback);
    },
    genre_books: (callback) => {
      Book.find({ "genre": req.params.id }).exec(callback);
    },
  }, (err, results) => {

    if (err) { return next(err) };

    // success
    if (results.genre_books.length > 0) {
      // Genre has books, render the same way as GET route
      res.render("genre_delete", {
        title: "Delete Genre",
        genre: results.genre,
        genre_books: results.genre_books
      });
    } else {
      // Genre has no books, delete object and redirect to the list of genres
      Genre.findByIdAndRemove(req.body.id, (err) => {

        if (err) { return next(err); }

        // success, go to genre list
        res.redirect("/catalog/genres");
      });
    }
  });
};

/**
 * Display Genre update form on GET.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
exports.genre_update_get = (req, res, next) => {
  Genre.findById(req.params.id, (err, genre) => {

    if (err) { return next(err); }

    if (genre == null) { // no results
      const err = new Error("Genre not found");
      err.status = 404;

      return next(err);
    }

    // success
    res.render("genre_form", {
      title: "Update Genre",
      genre: genre
    });
  });
};

/** Handle Genre update on POST. */
exports.genre_update_post = [
  // ensure the name field is not empty
  validator.body("name", "Genre name required")
  .isLength({ min: 1 })
  .trim(),

  // sanitize (escape) the name field
  validator.sanitizeBody("name").escape(),

  // process request after validation and sanitization
  (req, res, next) => {
    /** Validation errors extracted from a request. */
    const errors = validator.validationResult(req);
    /** A genre object with escaped and trimmed data (and the old id!) */
    const genre = new Genre({
      name: req.body.name,
      _id: req.params.id
    });

    if ( !errors.isEmpty() ) {
      // there are errors
      // render the form again with sanitized values and error messages
      res.render("genre_form", {
        title: "Update Genre",
        genre: genre,
        errors: errors.array()
      });

      return;

    } else {
      // data from form is valid, update the record
      Genre.findByIdAndUpdate(req.params.id, genre, {}, (err, thegenre) => {

        if (err) {return next(err); }

        // successfull, redirect to genre detail page
        res.redirect(thegenre.url)
      });
    }
  }
];