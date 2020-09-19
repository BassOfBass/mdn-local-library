# MDN tutorial express server

Commands to run with nodemon on Windows:

    SET DEBUG=mdn-express-server:* & npm start
    SET DEBUG=mdn-express-server:* & npm run devstart - nodemon dev launch

Challenge:

> Implement the delete pages for the Book, BookInstance, and Genre models, linking them from the associated detail pages in the same way as our Author delete page. The pages should follow the same design approach:  
>- If there are references to the object from other objects, then these other objects should be displayed along with a note that this record can't be deleted until the listed objects have been deleted.  
>- If there are no other references to the object then the view should prompt to delete it. If the user presses the Delete button, the record should then be deleted.
>
>A few tips:  
>- Deleting a Genre is just like deleting an Author as both objects are dependencies of Book (so in both cases you can delete the object only when the associated books are deleted).
>- Deleting a Book is also similar, but you need to check that there are no associated BookInstances.
>- Deleting a BookInstance is the easiest of all because there are no dependent objects. In this case, you can just find the associated record and delete it.
>
>Implement the update pages for the BookInstance, Author, and Genre models, linking them from the associated detail pages in the same way as our Book update page.
>
>A few tips:
>- The Book update page we just implemented is the hardest! The same patterns can be used for the update pages for the other objects.
>- The Author date of death and date of birth fields and the BookInstance due_date field are the wrong format to input into the date input field on the form (it requires data in form "YYYY-MM-DD"). The easiest way to get around this is to define a new virtual property for the dates that formats the dates appropriately, and then use this field in the associated view templates.
>- If you get stuck, there are examples of the update pages in the example here.



TODOs:
- rework forms.
- append &lt;time&gt; tags with datetime="YYYY-MM-DDTHH:MM:SS.mmm-timezone" where possible.
- rewrite in ES6 modules.


Structure:
- `catalog/` — The home/index page.
`catalog/<objects>/` — The list of all books, bookinstances, genres, or authors (e.g. / `catalog/books/`, `/catalog/genres/`, etc.)
- <code>catalog/&lt;object&gt;/<em>&lt;id&gt;</em></code> — The detail page for a specific book, bookinstance, genre, or author with the given <code><em>_id</em></code> field value (e.g. `/catalog/book/584493c1f4887f06c0e67d37)`.
- `catalog/<object>/create` — The form to create a new book, bookinstance, genre, or author (e.g. <code>/catalog/book/create)</code>.
- <code>catalog/&lt;object&gt;/<em>&lt;id&gt;</em>/update</code> — The form to update a specific book, bookinstance, genre, or author with the given <code><em>_id</em></code> field value (e.g. `/catalog/book/584493c1f4887f06c0e67d37/update)`.
- <code>catalog/&lt;object&gt;/<em>&lt;id&gt;</em>/delete</code> — The form to delete a specific book, bookinstance, genre, author with the given <code><em>_id</em></code> field value (e.g. <code>/catalog/book/584493c1f4887f06c0e67d37/delete)</code>.