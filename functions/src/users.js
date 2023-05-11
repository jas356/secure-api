import { hashSync } from "bcrypt"
import jwt from "jsonwebtoken"
import { salt, secretKey } from "../service_account.js"
import { db } from "./connect.js"

export async function login(req, res) {
    const {email, password } = req.body
    if(!email || !password){
        res.status(400).send({message: "Email and Password both required"})
        return
    }
    const hashedPassword = hashSync(password, salt)
    const userResults = await db.collection("users")
    .where("email", "==", email.toLowerCase())
    .where("password", "==", hashedPassword)
    .get()
    let user = userResults.docs.map(doc => ({id: doc.id, ...doc.data() }))[0]
    if(!user) {
        res.status(401).send({ message: "Invalid email or password." })
        return
      }
      delete user.password
      const token = jwt.sign(user, secretKey)
      res.send({ user, token })
}

export async function signup(req, res) {
    const { email, password} = req.body
    if(!email || !password) {
        res.status(400).send({message: "Email and Password both required"})
        return
    }
     // check to see if email already exists...
  const check = await db.collection("users").where("email", "==", email.toLowerCase()).get()
  if(check.exists) {
    res.status(401).send({ message: "Email already in use. Please try logging in instead."})
    return
  }
  const hashedPassword = hashSync(password, salt)
  await db.collection("users").add({ email: email.toLowerCase(), password: hashedPassword })
  login(req, res)
}