# MDN tutorial express server

Commands to run with nodemon on Windows:

- `SET DEBUG=mdn-express-server:* & npm start`
- `SET DEBUG=mdn-express-server:* & npm run devstart - nodemon dev launch`

TODOs:
- connect `robots.txt` before deploy
- rework forms according to latest memes.
- make date forms not reset upon returned `POST` updates.
- `author_detail.pug` - rework handling dates, especially when the birth/death dates are greater than `Date.now()`.
- `bookinstance_form.pug` - retain Book, Date and Status fields upon update.
- `book_form.pug` - retain genre selection on update.
- append `<time>` tags with `datetime="YYYY-MM-DDTHH:MM:SS.mmm-timezone"` where possible.
- rewrite in ES6 modules.

Structure:
- `catalog/` — The home/index page.
- `catalog/<objects>/` — The list of all books, bookinstances, genres, or authors (e.g. `/catalog/books/`, `/catalog/genres/`, etc.)
- <code>catalog/&lt;object&gt;/<em>&lt;id&gt;</em></code> — The detail page for a specific book, bookinstance, genre, or author with the given <code><em>_id</em></code> field value (e.g. `/catalog/book/584493c1f4887f06c0e67d37)`.
- `catalog/<object>/create` — The form to create a new book, bookinstance, genre, or author (e.g. <code>/catalog/book/create)</code>.
- <code>catalog/&lt;object&gt;/<em>&lt;id&gt;</em>/update</code> — The form to update a specific book, bookinstance, genre, or author with the given <code><em>_id</em></code> field value (e.g. `/catalog/book/584493c1f4887f06c0e67d37/update)`.
- <code>catalog/&lt;object&gt;/<em>&lt;id&gt;</em>/delete</code> — The form to delete a specific book, bookinstance, genre, author with the given <code><em>_id</em></code> field value (e.g. <code>/catalog/book/584493c1f4887f06c0e67d37/delete)</code>.