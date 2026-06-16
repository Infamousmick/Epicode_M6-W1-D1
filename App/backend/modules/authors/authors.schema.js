const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Author = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      max: 20,
    },
    lastName: {
      type: String,
      required: true,
      max: 20,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, strict: true },
);

Author.pre("save", async function () {
  const instance = this;
  if (!instance.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  instance.password = await bcrypt.hash(instance.password, salt);
});

Author.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate();

  let rawPassword;
  if (update.password) {
    rawPassword = update.password;
  } else if (update.$set && update.$set.password) {
    rawPassword = update.$set.password;
  }
  if (rawPassword) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(rawPassword, salt);
    this.set({ password: hashedPassword });
  }
});

module.exports = mongoose.model("Author", Author, "Authors");
