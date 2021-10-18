const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("express-flash");
const reg = require("./regNo");
const routes = require("./routes/regRoutes");

var app = express();

const pg = require("pg");
const Pool = pg.Pool;

// should we use a SSL connection
let useSSL = false;
// eslint-disable-next-line no-undef
const local = process.env.LOCAL || false;
// eslint-disable-next-line no-undef
if (process.env.DATABASE_URL && !local) {
	// eslint-disable-next-line no-unused-vars
	useSSL = true;
}

// eslint-disable-next-line no-undef
const connectionString = process.env.DATABASE_URL || "postgresql://codex:codex123@localhost:5432/my_registration";

const pool = new Pool({
	connectionString,
	ssl: {
		rejectUnauthorized: false
	}
});


const theRegs = reg(pool);

const regRoutes = routes(theRegs);

const handlebarSetup = exphbs({
	partialsDir: "./views/partials",
	viewPath: "./views",
	layoutsDir: "./views/layouts"
});

app.engine("handlebars", handlebarSetup);
app.set("view engine", "handlebars");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("public"));

app.use(flash());
 
app.use(session({
	secret: "the-registration ",
	resave: false,
	saveUninitialized: true
}));


app.get("/", regRoutes.displayReg);

app.post("/reg_numbers", regRoutes.addReg); 

app.post("/reset", regRoutes.letReset);

app.post("/viewAll", regRoutes.viewReg);

app.post("/show", regRoutes.showReg);

app.get("/reg_Number/:reg", regRoutes.regUrl);

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3655;

app.listen(PORT, function () {
	console.log("App started running");
});