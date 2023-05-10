import functions from "firebase-functions"
import express from "express"
import cors from "cors"

const app = express()


app.use(cors({ origin: [
    "http://localhost",
    "https://bocacode.com"
] })) //allow any website or url to talk to API

//Lets set up our unprotected routes

app.post("/login")
app.post('/signup')

//now we set up protected roles

// ...

app.listen(3030, () => console.log("Listening on port 3030...")) //This is for testing

export const api = functions.https.onRequest(app) // This is used for deploying the app.