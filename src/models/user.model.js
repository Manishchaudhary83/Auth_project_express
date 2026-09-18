const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 30,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },
    resetPasswordToken: {
    type: String,
    default: null
},

resetPasswordExpires: {
    type: Date,
    default: null
}
 },{
    timestamps: true,
  }
);

const userModel = mongoose.model("users", userSchema);
module.exports = userModel
