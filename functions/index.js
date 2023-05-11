import functions from "firebase-functions"
import express from "express"
import cors from "cors"
import { login, signup } from "./src/users.js"
import { validToken, isAdmin } from "./src/middleware.js"

const app = express()


app.use(cors({ origin: [
    "http://localhost",
    "https://bocacode.com"
] })) //allow any website or url to talk to API

//Lets set up our unprotected routes

app.post("/login", login)
app.post('/signup', signup)

//now we set up protected roles

// now we set up our un-protected routes
app.get('/secretinfo', validToken, (req, res) => res.send({ message: "You made it!"}))
app.get('/supersecretinfo', validToken, isAdmin, (req, res) => res.send({ message: "You made it here, too!"}))


app.listen(3030, () => console.log("Listening on port 3030...")) //This is for testing

export const api = functions.https.onRequest(app) // This is used for deploying the app.