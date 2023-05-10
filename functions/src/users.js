import { hashSync } from "bcrypt"
import { salt } from "../service_account.js"
import db from "./connect.js"

export async function login(req, res) {
    const {email, password } = req.body
    if(!email || !password){
        res.status(400).send({message: "Email and Password both required"})
        return
    }
    const userResults = await db.collection("users")
    .where("email", "==", email.toLowerCase())
    .where("password", "==", password)
    .get()
    let user = userResults.docs.map(doc => ({id: doc.id, ...doc.data() }))[0]
    delete user.password
    res.send(user)
}

export async function signup(req, res) {
    const { email, password} = req.body
    if(!email || !password) {
        res.status(400).send({message: "Email and Password both required"})
        return
    }
    const hashedPassword = hashSync(password, salt)
    await db.collection("users").add({email: email.toLowerCase(), password: hashedPassword})
    login(req, res)
}