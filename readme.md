# MDN tutorial express server

TODOs:
- <del>connect `robots.txt` before deploy</del> <ins>fixed in [a68dc05a]()</ins>
- prevent Book deletion if there are instances of it
- rework forms according to latest memes.
- make date forms not reset upon returned `POST` updates.
- `author_detail.pug` - rework handling dates, especially when the birth/death dates are greater than `Date.now()`.
- `bookinstance_form.pug` - retain Book, Date and Status fields upon update.
- `book_form.pug` - retain genre selection on update.
- append `<time>` tags with `datetime="YYYY-MM-DDTHH:MM:SS.mmm-timezone"` where possible.
- <del>rewrite in ES6 modules.</del> <ins>Done</ins>

Structure:
- `catalog/` — The home/index page.
- `catalog/<objects>/` — The list of all books, bookinstances, genres, or authors (e.g. `/catalog/books/`, `/catalog/genres/`, etc.)
- <code>catalog/&lt;object&gt;/<em>&lt;id&gt;</em></code> — The detail page for a specific book, bookinstance, genre, or author with the given <code><em>_id</em></code> field value (e.g. `/catalog/book/584493c1f4887f06c0e67d37)`.
- `catalog/<object>/create` — The form to create a new book, bookinstance, genre, or author (e.g. <code>/catalog/book/create)</code>.
- <code>catalog/&lt;object&gt;/<em>&lt;id&gt;</em>/update</code> — The form to update a specific book, bookinstance, genre, or author with the given <code><em>_id</em></code> field value (e.g. `/catalog/book/584493c1f4887f06c0e67d37/update)`.
- <code>catalog/&lt;object&gt;/<em>&lt;id&gt;</em>/delete</code> — The form to delete a specific book, bookinstance, genre, author with the given <code><em>_id</em></code> field value (e.g. <code>/catalog/book/584493c1f4887f06c0e67d37/delete)</code>.

[Blog reqs](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Django/django_assessment_blog#Project_brief):
- `/` and `/blog/` - **Home page** 

  An index page describing the site.

- `/blog/blogs/` - **List of all blog posts** 
  
  List of all blog posts:
    - Accessible to all users from a sidebar link.
    - List sorted by post date (newest to oldest).
    - List paginated in groups of 5 articles.
    - List items display the blog title, post date, and author.
    - Blog post names are linked to blog detail pages.
    - Blogger (author names) are linked to blog author detail pages.

- `/blog/blogger/<author-id>` - **Blog author (blogger) detail page** 

  Information for a specified author (by id) and list of their blog posts:
    - Accessible to all users from author links in blog posts etc.
    - Contains some biographical information about the blogger/author.
    - List sorted by post date (newest to oldest).
    - Not paginated.
    - List items display just the blog post name and post date.
    - Blog post names are linked to blog detail pages.

- `/blog/<blog-id>` - **Blog post detail page** 

  Blog post details.
    - Accessible to all users from blog post lists.
    - Page contains the blog post: name, author, post date, and content.
    - Comments for the blog post should be displayed at bottom.
    - Comments should be sorted in order: oldest to most recent.
    - Contains link to add comments at end for logged in users (see Comment form page)
    - Blog posts and comments need only display plain text. There is no need to support any sort of HTML markup (e.g. links, images, bold/italic, etc).

- `/blog/bloggers/` - **List of all bloggers** 
  
  List of bloggers on system:
    - Accessible to all users from site sidebar
    - Blogger names are linked to Blog author detail pages.

- `/blog/<blog-id>/create` - **Comment form page** 

  Create comment for blog post:
    - Accessible to logged-in users (only) from link at bottom of blog post detail pages.
    - Displays form with description for entering comments (post date and blog is not editable).
    - After a comment has been posted, the page will redirect back to the associated blog post page.
    - Users cannot edit or delete their posts.
    - Logged out users will be directed to the login page to log in, before they can add comments. After logging in, they will be redirected back to the blog page they wanted to comment on.
    - Comment pages should include the name/link to the blogpost being commented on.
    
- `/accounts/<standard urls>` - **User authentication pages**

  Standard Django authentication pages for logging in, out and setting the password:
    - Login/out should be accessible via sidebar links.
- `/admin/<standard urls>` - **Admin site** 

  Admin site should be enabled to allow create/edit/delete of blog posts, blog authors and blog comments (this is the mechanism for bloggers to create new blog posts):
    - Admin site blog posts records should display the list of associated comments inline (below each blog post).
    - Comment names in the Admin site are created by truncating the comment description to 75 characters.
    - Other types of records can use basic registration.
