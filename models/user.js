import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [ true, "You must provide a name" ],
  },
  email: {
    type: String,
    required: [true, 'Email address is required']
  },
  username: {
    type: String,
    required: [true, 'Username is required']
  },
  password: {
    type: String,
    required: [true, 'You must provide a password']
  }
}, {
  timestamps: true
});

userSchema.pre("save", async function(next) {
  if (this.isNew) {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  }
});

userSchema.static("authenticate", async function(username, email, plainTextPassword) {
  const user = await this.findOne({ 
    $or: [ 
      { email }, 
      { username } 
    ]
  });

  if (
    user && 
    await bcrypt.compare(plainTextPassword, user.password)
  ) {
    return user
  }

  return false
});

const User = mongoose.model("User", userSchema);

export default User;