"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
var mongodb = require("mongodb");
var mongoose = require("mongoose");
var app = express_1.default();
app.use(express_1.default.json());
var port = 3000;
//Initializing uri
var uri = "mongodb+srv://nithish0504:hello@covid-assignment.lb8rm.mongodb.net/ysquares?retryWrites=true&w=majority";
//Connecting mongodb atlas db
mongoose.connect(uri, { useNewUrlParser: true }, { useUnifiedTopology: true }, { serverSelectionTimeoutMS: 5000 }, { socketTimeoutMS: 45000 });
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
app.listen(port, function () {
    return console.log("server is listening on " + port);
});
//Middleware functions
//Function to authenticate JWT token
function authenticateToken(request, response, next) {
    var _this = this;
    var jwtToken;
    var authHeader = request.headers["authorization"];
    if (authHeader !== undefined) {
        jwtToken = authHeader.split(" ")[1]; //Getting JWT token from header
    }
    if (jwtToken === undefined) {
        response.status(401);
        response.send("Invalid JWT Token"); //If no JWT token
    }
    else {
        jwt.verify(jwtToken, "efgytrhjkhfk", function (error, payload) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (error) {
                    response.status(401);
                    response.send("Invalid JWT Token"); //If Invalid JWT token
                }
                else {
                    request.phoneNumber = payload.phoneNumber;
                    //Getting phoneNumber of User for Further Use
                    next();
                }
                return [2 /*return*/];
            });
        }); });
    }
}
//Data Validations function Start
function validate_details(request, response, next) {
    var body = request.body;
    if (body.userName !== undefined) {
        if (("" + body.userName).length > 15 || typeof body.userName !== "string") {
            response.send("invalid userName");
        }
    }
    if (body.gotemail !== undefined) {
        if (("" + body.gotemail).length > 25 || typeof body.gotemail !== "string") {
            response.send("invalid Email");
        }
    }
    if (body.gotpassword !== undefined) {
        if (("" + body.gotpassword).length < 6 ||
            typeof body.gotpassword !== "string") {
            response.send("invalid Password");
        }
    }
    if (body.userEmail !== undefined) {
        if (("" + body.userEmail).length > 25 || typeof body.userEmail !== "string") {
            response.send("invalid Email");
        }
    }
    if (body.userPassword !== undefined) {
        if (("" + body.userPassword).length < 6 ||
            typeof body.userPassword !== "string") {
            response.send("invalid Password");
        }
    }
    next();
}
//Data Validations function End
//Register User API Start
app.post("/register/", validate_details, function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userName, gotemail, gotpassword, hashedPassword, checkuser;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = request.body, userName = _a.userName, gotemail = _a.gotemail, gotpassword = _a.gotpassword;
                return [4 /*yield*/, bcrypt.hash(gotpassword, 10)];
            case 1:
                hashedPassword = _b.sent();
                return [4 /*yield*/, db.collection("users").findOne({ email: gotemail })];
            case 2:
                checkuser = _b.sent();
                if (!(checkuser === null)) return [3 /*break*/, 4];
                //If User Doesn't Exists Inserting The user into Users
                return [4 /*yield*/, db.collection("users").insertOne({
                        username: userName,
                        email: gotemail,
                        password: hashedPassword,
                    })];
            case 3:
                //If User Doesn't Exists Inserting The user into Users
                _b.sent();
                //Sending Response to the User
                response.send("user Successfully Added");
                return [3 /*break*/, 5];
            case 4:
                //If User with PhoneNumber Exists in DB
                response.send("User Already Exists");
                _b.label = 5;
            case 5: return [2 /*return*/];
        }
    });
}); });
//Register User API End
//User Login API Start
app.post("/login/", validate_details, function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userEmail, userPassword, databaseUser, password, PasswordMatched, payload, jwtToken;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = request.body, userEmail = _a.userEmail, userPassword = _a.userPassword;
                return [4 /*yield*/, db
                        .collection("users")
                        .findOne({ email: userEmail })];
            case 1:
                databaseUser = _b.sent();
                if (!(databaseUser === null)) return [3 /*break*/, 2];
                //If user is not Present
                response.status(400);
                response.send("Invalid user");
                return [3 /*break*/, 4];
            case 2:
                password = "password";
                return [4 /*yield*/, bcrypt.compare(userPassword, databaseUser.password)];
            case 3:
                PasswordMatched = _b.sent();
                if (PasswordMatched == true) {
                    payload = {
                        email: userEmail,
                    };
                    jwtToken = jwt.sign(payload, "efgytrhjkhfk");
                    response.send({ jwtToken: jwtToken });
                }
                else {
                    //If password is Invalid
                    response.status(400);
                    response.send("Invalid password");
                }
                _b.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
//User Login API End
//Get Users API Start
app.get("/users", authenticateToken, function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        db.collection("users")
            .find({})
            .toArray(function (err, userdata) {
            if (err) {
                console.log(err);
                response.send(err);
            }
            console.log(userdata);
            return response.send(userdata);
        });
        return [2 /*return*/];
    });
}); });
//Get Users API End
