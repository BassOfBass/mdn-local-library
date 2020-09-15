SET DEBUG=mdn-express-server:* & npm start
SET DEBUG=mdn-express-server:* & npm run devstart

TODO: rewrite in ES6 modules.

<ul>
 <li><code>catalog/</code> — The home/index page.</li>
 <li><code>catalog/&lt;objects&gt;/</code> — The list of all books, bookinstances, genres, or authors (e.g. /<code>catalog/books/</code>, /<code>catalog/genres/</code>, etc.)</li>
 <li><code>catalog/&lt;object&gt;/<em>&lt;id&gt;</em></code> — The detail page for a specific book, bookinstance, genre, or author with the given <code><em>_id</em></code> field value (e.g. <code>/catalog/book/584493c1f4887f06c0e67d37)</code>.</li>
 <li><code>catalog/&lt;object&gt;/create</code> — The form to create a new book, bookinstance, genre, or author (e.g. <code>/catalog/book/create)</code>.</li>
 <li><code>catalog/&lt;object&gt;/<em>&lt;id&gt;</em>/update</code> — The form to update a specific book, bookinstance, genre, or author with the given <code><em>_id</em></code> field value (e.g. <code>/catalog/book/584493c1f4887f06c0e67d37/update)</code>.</li>
 <li><code>catalog/&lt;object&gt;/<em>&lt;id&gt;</em>/delete</code> — The form to delete a specific book, bookinstance, genre, author with the given <code><em>_id</em></code> field value (e.g. <code>/catalog/book/584493c1f4887f06c0e67d37/delete)</code>.</li>
</ul>