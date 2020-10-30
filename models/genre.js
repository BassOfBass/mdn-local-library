import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const GenreSchema = new Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 100 }
});

// Declare a virtual for the genre's URL, named "url".
GenreSchema
.virtual("url")
.get( function() {
  return "/catalog/genre/" + this._id;
})

const Genre = mongoose.model("Genre", GenreSchema);

// Export the model.
export default Genre;
