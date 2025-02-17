const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String },
  name: { type: String, required: true },
  provider: { type: String, default: "local" },
  isAdmin: { type: Boolean, default: false }, // ✅ 관리자 기본값 false
  createdAt: { type: Date, default: Date.now }
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("User", userSchema);
