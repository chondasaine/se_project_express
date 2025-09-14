const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
    trim: true,
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
      message: "You must enter a valid URL",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator(email) {
        const options = {
          allow_display_name: false,
          allow_utf8_local_part: true,
          require_tld: true,
          allow_ip_domain: false,
        };

        return validator.isEmail(email, options);
      },
      message: "You must enter a valid email address",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUserByCredentials(
  email
) {
  return this.findOne({ email })
    .select("+password -__v")
    .then((user) => {
      if (!user) {
        throw new Error("Incorrect email or password");
      }
      return user;
    });
};

module.exports = mongoose.model("user", userSchema);
