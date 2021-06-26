import express from "express";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongodb = require("mongodb");
const mongoose = require("mongoose");
const app = express();
app.use(express.json());

const port = 3000;

//Initializing uri
const uri =
  "mongodb+srv://nithish0504:hello@covid-assignment.lb8rm.mongodb.net/ysquares?retryWrites=true&w=majority";
//Connecting mongodb atlas db
mongoose.connect(
  uri,
  { useNewUrlParser: true },
  { useUnifiedTopology: true },
  { serverSelectionTimeoutMS: 5000 },
  { socketTimeoutMS: 45000 }
);
var db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.listen(port, () => {
  return console.log(`server is listening on ${port}`);
});

//Middleware functions
//Function to authenticate JWT token
function authenticateToken(request: any, response: any, next: any) {
  let jwtToken;
  const authHeader = request.headers["authorization"];
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1]; //Getting JWT token from header
  }
  if (jwtToken === undefined) {
    response.status(401);
    response.send("Invalid JWT Token"); //If no JWT token
  } else {
    jwt.verify(jwtToken, "efgytrhjkhfk", async (error: any, payload: any) => {
      if (error) {
        response.status(401);
        response.send("Invalid JWT Token"); //If Invalid JWT token
      } else {
        request.email = payload.email;
        //Getting phoneNumber of User for Further Use
        next();
      }
    });
  }
}

//Data Validations function Start
function validate_details(request: any, response: any, next: any) {
  const body = request.body;

  if (body.userName !== undefined) {
    if (`${body.userName}`.length > 15 || typeof body.userName !== "string") {
      response.send("invalid userName");
    }
  }
  if (body.gotemail !== undefined) {
    if (`${body.gotemail}`.length > 25 || typeof body.gotemail !== "string") {
      response.send("invalid Email");
    }
  }
  if (body.gotpassword !== undefined) {
    if (
      `${body.gotpassword}`.length < 6 ||
      typeof body.gotpassword !== "string"
    ) {
      response.send("invalid Password");
    }
  }
  if (body.userEmail !== undefined) {
    if (`${body.userEmail}`.length > 25 || typeof body.userEmail !== "string") {
      response.send("invalid Email");
    }
  }
  if (body.userPassword !== undefined) {
    if (
      `${body.userPassword}`.length < 6 ||
      typeof body.userPassword !== "string"
    ) {
      response.send("invalid Password");
    }
  }

  next();
}
//Data Validations function End

//Register User API Start

app.post("/register/", validate_details, async (request, response) => {
  const { userName, gotemail, gotpassword } = request.body;
  const hashedPassword = await bcrypt.hash(gotpassword, 10);
  //Reading Values from request body
  let checkuser = await db.collection("users").findOne({ email: gotemail });
  //Checking If a user with the given Email exists in DB
  if (checkuser === null) {
    //If User Doesn't Exists Inserting The user into Users
    await db.collection("users").insertOne({
      username: userName,
      email: gotemail,
      password: hashedPassword,
    });
    //Sending Response to the User
    response.send("user Successfully Added");
  } else {
    //If User with PhoneNumber Exists in DB
    response.send("User Already Exists");
  }
});

//Register User API End

//User Login API Start

app.post("/login/", validate_details, async (request, response) => {
  const { userEmail, userPassword } = request.body;
  //Getting phoneNumber and Password from DB
  //Checking if user present in DB
  const databaseUser = await db
    .collection("users")
    .findOne({ email: userEmail });

  if (databaseUser === null) {
    //If user is not Present
    response.status(400);
    response.send("Invalid user");
  } else {
    //If user is present
    let password = "password";

    const PasswordMatched = await bcrypt.compare(
      userPassword,
      databaseUser.password
    );
    if (PasswordMatched == true) {
      //Checking the Password of User
      const payload = {
        email: userEmail,
      };
      //Generating and Sending JWT Token
      const jwtToken = jwt.sign(payload, "efgytrhjkhfk");
      response.send({ jwtToken });
    } else {
      //If password is Invalid
      response.status(400);
      response.send("Invalid password");
    }
  }
});

//User Login API End

//Get Users API Start
app.get("/users", authenticateToken, async (request, response) => {
  db.collection("users")
    .find({})
    .toArray(function (err: any, userdata: any) {
      if (err) {
        console.log(err);
        response.send(err);
      }
      console.log(userdata);
      return response.send(userdata);
    });
});

//Get Users API End
