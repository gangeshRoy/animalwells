//require('newrelic');
const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const passport = require("passport");
const flash = require("connect-flash");
const path = require("path");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoClient = require("mongodb").MongoClient;
const fs = require("fs");
const http = require("http");
const http1 = require("http");
const nodemailer = require("nodemailer");
const sanitizer = require("sanitizer");
const requestSanitizer = require("request-sanitizer")();
const validator = requestSanitizer.validator;
// const mongoURL = require("./database/db_config_mongo.js").url;
const db = require("./database/db_config_mysql.js").localConnect();
// const logger = require("./logging/logger.js");
const cluster = require("cluster");
const numWorkers = require("os").cpus().length;
var server = "";
var cron = require("node-cron");
var compression = require("compression");
var shell = require("shelljs");
var exec = require("child_process").exec;
//const sqlinjection = require('sql-injection');
var cors = require("cors");
var request = require("request");
var option = {
  ca: fs.readFileSync("/home/ec2-user/certificates_2/STAR_woovly_com.ca-bundle"),
  key: fs.readFileSync("/home/ec2-user/certificates_2/STAR.woovly.com.key"),
  cert: fs.readFileSync("/home/ec2-user/certificates_2/STAR_woovly_com.crt")
};
var https = require("https").createServer(option, app);
var forceSsl = require("express-force-ssl");
var sqlInjectionClass = require("./helper/sqlInjectionCheck.js");
var InjectionObj = new sqlInjectionClass();

var elasticsearch = require("elasticsearch");
var client = new elasticsearch.Client({
  hosts: ["https://localhost:9200"]
});

client.ping(
  {
    requestTimeout: 30000
  },
  function(error) {
    if (error) {
      console.error("elasticsearch cluster is down!");
    } else {
      //console.log('Everything is ok');
    }
  }
);

//console.log(process.env.NODE_ENV)
server = https.listen(port, function(err) {
  //console.log(err);
});

var Allocator = require("malloc");
var GarbageCollector = require("garbage-collector");

const heap = new Buffer(1024 * 1024);
const allocator = new Allocator(heap); // heap could also be an ArrayBuffer

const gc = new GarbageCollector(allocator, {
  // The number of cycles before an item with no references will be freed.
  lifetime: 2,
  // The callbacks which will be invoked when a tagged block is freed.
  // Keys must be integers within uint32 range, greater than zero.
  callbacks: {
    1: offset => {
      //console.log ('Freeing string at', offset);
    }
  }
});

//console.log (gc.inspect ());

const input = "Hello World";
const offset = gc.alloc(Buffer.byteLength(input), 1); // 1 is the type tag, it's optional.
heap.write(input, offset);

gc.ref(offset); // increment the reference count

gc.cycle(); // our data is preserved because it has a reference count > 0

//console.log (gc.inspect ());

//console.log (gc.sizeOf (offset));

gc.unref(offset); // decrement the reference count by 1

const freed = gc.cycle(); // frees our string and invokes the callback



require("./config/passport")(passport); // pass passport for configuration
app.use(morgan("dev")); // log every request to the console

app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

var dir = path.join(__dirname, "uploads");

app.use(compression());
app.use(express.static(dir));
app.use(express.static(__dirname + "/public", { maxage: "100d" }));
app.use(express.static(__dirname + "/uploads"));

app.set("views", __dirname + "/public/views");
app.engine("html", require("ejs").renderFile);
app.use(
  session({
    secret: "checkwoovlyhere", // session secret
    resave: true,
    saveUninitialized: true
  })
);
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
app.use(forceSsl);

var corsOption = {
  origin: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  exposedHeaders: ["x-auth-token1111"]
};
app.use(cors(corsOption));



app.all("/*", function(req, res, next) {
  //console.log("AB");
  //console.log(req.headers.accept);
  res.header("Access-Control-Allow-Origin", "*");
  // res.header("'X-Requested-With': 'XMLHttpRequest'");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-type,Accept,x-access-token,X-Key"
  );
  //console.log("AC");
  //next();
  requestSanitizer.setOptions({
    query: {
      test: [validator.escape]
    },
    body: {
      name: [validator.escape, validator.ltrim],
      test: [validator.ltrim]
    }
  });

  // if (req.path == '/photosUpload/1' || req.headers.accept.indexOf('image/webp') !== -1 || req.headers.accept.indexOf('text/plain') !== -1 || req.headers.accept.indexOf('text/html') !== -1) {
  //     next();
  // }    else {
  //     return false;
  // }

  // next();
  if (req.headers.accept) {
    if (req.headers.accept.indexOf("image/webp") === -1) {
      if (InjectionObj.middleware(req.url)) {
        return false;
      } else {
        next();
      }
    } else {
      if (InjectionObj.middleware(req.url)) {
        return false;
      } else {
        next();
      }
    }
  } else {
    if (InjectionObj.middleware(req.url)) return false;
    else next();
  }
});

app.get("*.min.js", function(req, res, next) {
  req.url = req.url + ".gz";
  res.set("Content-Encoding", "gzip");
  next();
});

app.post("/", require("./middlewares/tokenVerification.js"));

app.get("/gtime", function(req, res) {
  var dateFormat = require("dateformat");

  var sql = "select NOW() as time ";
  var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "gangesh@gmail.com",
      pass: "dev12345"
    }
  });
  db.query(
    {
      sql: sql
    },
    function(err, rows, fields) {
      var cdata = {};
      var y = new Date();
      var x = new Date(y.getTime() + 1000 * 60 * 30 * 7);
      cdata.x = x;
      cdata.y = rows[0];
      cdata.cdate = dateFormat(x, "ddS mmm  yyyy");
      cdata.mstime = x.getTime();
      dateFormat.masks.hammerTime = "HH:MM";
      cdata.ctime = dateFormat(x, "hammerTime");
      res.json(cdata);
    }
  );
});

require("./middlewares/tokenVerification.js")(app);
app.use("/", require("./routes/index.js"));
require("./app/routes.js")(app, passport); // load our routes and pass in our app and fully configured passport

process.on("uncaughtException", function(err) {
  //console.log(err);
});


