const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  phonenumber: {
    type: String,
    unique: true,
  },
  deviceid: {
    type: String,
    unique: true,
  },
  secretpin: {
    type: String,
  },
  state: {
    type: String,
  },
  city: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = User = mongoose.model("users", userSchema);
