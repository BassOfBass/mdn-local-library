const mongoose = require('mongoose');
const moment = require("moment");

const Schema = mongoose.Schema;
const AuthorSchema = new Schema(
  {
    first_name: {type: String, required: true, maxlength: 100},
    family_name: {type: String, required: true, maxlength: 100},
    date_of_birth: {type: Date},
    date_of_death: {type: Date},
  }
);

// Virtual for author's full name
AuthorSchema
.virtual('name')
.get( function() {
  // To avoid errors in cases where an author does not have either a family name or first name
  // We want to make sure we handle the exception by returning an empty string for that case

  let fullname = '';
  if (this.first_name && this.family_name) {
    fullname = this.family_name + ', ' + this.first_name;
  }
  if (!this.first_name || !this.family_name) {
    fullname = '';
  }

  return fullname;
});

// Virtual for author's lifespan
AuthorSchema
.virtual('lifespan')
.get( function() {
  return (this.date_of_death.getYear() - this.date_of_birth.getYear()).toString();
});

// Virtual for author's URL
AuthorSchema
.virtual('url')
.get( function() {
  return '/catalog/author/' + this._id;
});

AuthorSchema
.virtual("date_formatted")
.get( function() {
  let birth = moment(this.date_of_birth).format("Do MMMM, YYYY");
  let death = moment(this.date_of_death).format("Do MMMM, YYYY");
  
  if (this.date_of_birth && this.date_of_death) {
    let age = this.date_of_death.getFullYear() - this.date_of_birth.getFullYear();

    return birth + " - " + death + " (died " + age + " years old)"
  } 
  
  if (this.date_of_birth && !this.date_of_death) {
    let currentAge = new Date().getFullYear() - this.date_of_birth.getFullYear();

    return "Born " + birth + " (" + currentAge + " years old)";
  }

  if (!this.date_of_birth && this.date_of_death) {
    return "Died " + death;
  }

  return "Dates unknown";
});

//Export model
module.exports = mongoose.model('Author', AuthorSchema);