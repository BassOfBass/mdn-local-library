import mongoose from "mongoose";

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  email: { 
    type: String, 
    required: true, 
    minlength: 5,
  },

  password: {
    type: String,
    required: true,
    minlength: 8,
  },

  status: [{
    type: String
  }]
  
}, {
  timestamps: true
});

const User = mongoose.model("User", UserSchema);

export default User;