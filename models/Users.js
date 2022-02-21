const mongoose = require("mongoose");

const Users = mongoose.model("Users", {
  name: String,
  email: {
    type: String,
    index: { unique: true, required: true, dropDups: true },
  },
  username: {
    type: String,
    index: { unique: true, required: true, dropDups: true },
  },
  password: String,
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = Users;
