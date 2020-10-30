import mongoose from 'mongoose';
import moment from "moment";

const Schema = mongoose.Schema;
const BookInstanceSchema = new Schema(
  { 
    /** Reference to the associated book. */
    book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    imprint: {type: String, required: true},
    status: {type: String, required: true, enum: ['Available', 'Maintenance', 'Loaned', 'Reserved'], default: 'Maintenance'},
    due_back: {type: Date, default: Date.now}
  }
);

// Virtual for bookinstance's URL
BookInstanceSchema
.virtual('url')
.get( function() {
  return '/catalog/bookinstance/' + this._id;
});

BookInstanceSchema
.virtual("due_back_formatted")
.get( function() {
  return moment(this.due_back).format("Do MMMM, YYYY");
});

const BookInstance = mongoose.model('BookInstance', BookInstanceSchema);

//Export model
export default BookInstance;