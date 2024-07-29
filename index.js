const express = require("express")
const app = express()
const User = require("./models/user")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

mongoose
  .connect("mongodb://localhost:27017/authDemo", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("接続ok")
  })
  .catch((error) => console.log("エラー", error))

app.set("view engine", "ejs")
app.set("views", "views")
app.use(express.urlencoded({ extended: true }))

app.get("/",(req,res)=>{
  res.send("ホームページ")
})

app.get("/register", (req, res) => {
  res.render("register")
})

app.post("/register", async (req, res) => {
  const { username, password } = req.body
  const hash = await bcrypt.hash(password, 12)
  const user = new User({
    username, //* username: usernameの省略記法
    password: hash,
  })
  await user.save()
  res.redirect("/")
  // await new User(req.body) password bcryptで暗号化
  // res.send(hash)
})

app.get("/login",(req,res)=>{
  res.render("login")
})

app.post("/login",(req,res)=>{
  res.send(req.body)
})


app.get("/secret", (req, res) => {
  res.send("ここはログイン済みの場合だけ見れる秘密のページです")
})

app.listen(3000, () => {
  console.log("port3000で起動中")
})
