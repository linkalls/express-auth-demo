const mongoose = require("mongoose")
const {Schema} = mongoose

const userSchema = new Schema({
  username: {
    type: String,
    required: [true,"ユーザー名は必要です"]
  },
  password: {
    type:String,
    required: [true,"passwordは必須です"]
  }
})

module.exports = mongoose.model("User",userSchema)