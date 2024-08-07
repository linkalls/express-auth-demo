const express = require("express")
const app = express()
const User = require("./models/user")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const session = require("express-session")

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
app.use(session({ secret: "mysecret" }))

const requireLogin = (req, res, next) => {
  //* ミドルウェア
  if (!req.session.user_id) {
    return res.redirect("/login")
  }
  next()
}

app.get("/", (req, res) => {
  res.send("ホームページ")
})

app.get("/register", (req, res) => {
  res.render("register")
})

app.post("/register", async (req, res) => {
  const { username, password } = req.body
  const user = new User({
    username, //* username: usernameの省略記法
    password,
  })
  await user.save()
  req.session.user_id = user._id
  res.redirect("/")
  // await new User(req.body) password bcryptで暗号化
  // res.send(hash)
})

app.get("/login", (req, res) => {
  res.render("login")
})

app.post("/login", async (req, res) => {
  const { username, password } = req.body
 const foundUser = await User.findAndValidate(username,password)
  if (foundUser) {
    req.session.user_id = foundUser._id
    res.redirect("/secret")
  } else {
    res.redirect("/login")
  }
})

app.post("/logout", (req, res) => {
  req.session.user_id = null
  res.redirect("/login")
})

app.get("/secret", requireLogin,(req, res) => {
  res.render("secret")
})

app.get("/topsecret",requireLogin,(req,res)=>{
  res.send("TOP secret!!")
})

app.listen(3000, () => {
  console.log("port3000で起動中")
})
