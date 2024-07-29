const mongoose = require("mongoose")
const { Schema } = mongoose
const bcrypt = require("bcrypt")

const userSchema = new Schema({
  username: {
    type: String,
    required: [true, "ユーザー名は必要です"],
  },
  password: {
    type: String,
    required: [true, "passwordは必須です"],
  },
})

userSchema.statics.findAndValidate = async function (username, password) {
  const foundUser = await this.findOne({ username }) //* thisがUserみたいな意味を持つ
  const isValid = await bcrypt.compare(password, foundUser.password)
  return isValid ? foundUser : false //* trueならfoundUserがfalseならfalseが返ってくる
} //* 自分でstaticsの下に設定したメゾットを作れる

userSchema.pre("save", async function(next) { //* arrow関数だとダメ
  // this //* saveが行われた時のインスタンス userとか
  this.password = await bcrypt.hash(this.password,12)
  next()
}) //* save直前にやる

module.exports = mongoose.model("User", userSchema)
