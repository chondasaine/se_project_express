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
          require_display_name: false,
          allow_utf8_local_part: true,
          require_tld: true,
          allow_ip_domain: false,
          allow_underscores: false,
          domain_specific_validation: true,
          blacklisted_chars: "!#$%",
          host_blacklist: ["spamdomain.com"],
          host_whitelist: ["trusteddomain.com"],
        };

        return validator.isEmail(email, options);
      },
      message: "You must enter a valid email address",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [8, "Password must be at least 8 characters long"],
    select: false,
  },
});

module.exports = mongoose.model("user", userSchema);
