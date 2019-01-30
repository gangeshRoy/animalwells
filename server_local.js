const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
const flash = require('connect-flash');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const fs = require('fs');
const http = require('http');
const sanitizer = require('sanitizer');
const requestSanitizer = require('request-sanitizer')();
const validator = requestSanitizer.validator;
const db = require('./database/db_config_mysql.js').localConnect();
// const logger = require('./logging/logger.js');
const cluster = require('cluster');
const numWorkers = require('os').cpus().length;
// const {sendPushNotification} = require('./controllers/notificationController');
// const {OCCASION_TYPE,TIMEZONE_TYPE} = require('./helper/constantsHelper');



var server = '';
// var cron = require('node-cron');
var compression = require('compression');
var shell = require('shelljs');
var exec = require('child_process').exec;

var Allocator = require('malloc');
var GarbageCollector = require('garbage-collector');

const heap = new Buffer(1024 * 1024);
const allocator = new Allocator(heap); // heap could also be an ArrayBuffer

const gc = new GarbageCollector(allocator, {
    // The number of cycles before an item with no references will be freed.
    lifetime: 2,
    // The callbacks which will be invoked when a tagged block is freed.
    // Keys must be integers within uint32 range, greater than zero.
    callbacks: {
        1: offset => {
            ////console.log ('Freeing string at', offset);
        },
    },
});

var  cors = require('cors');

var corsOption = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['x-auth-token1111']
  };
  app.use(cors(corsOption));


app.get('/detect', function (req, res) {
    //https://detectlanguage.com/private
    var st = new Date().getTime();
    var DetectLanguage = require('detectlanguage');
    var detectLanguage = new DetectLanguage({
        key: '731e6046c24dc137bca862f5cb43f085',
        ssl: false
    });

    var dataSimple = "ሻቢሃም";
    detectLanguage.detect(dataSimple, function (error, result) {
        //console.log(JSON.stringify(result));
        var et = new Date().getTime();
        result[0].st = st;
        result[0].et = et;
        result[0].diff = et - st;
        res.json(result);
    });

    var googleTranslate = require('google-translate')('AIzaSyAm1x3kBNQSl0-QQTGlkMydSJQ8RTRSPXo');
    googleTranslate.detectLanguage('shubham', function (err, detection) {
        res.json(detection);
        // =>  es
    });


});



app.get('/readDir', function (req, res) {
    var fs = require('fs');
    const path = require('path');
    var dir = path.join(__dirname, 'public');
    uploadDir(dir, "w-dev");
    fs.lstat(dir, (err, stats) => {
        if (err)
            return console.log(err); //Handle error

        console.log(`Is file: ${stats.isFile()}`);
        console.log(`Is directory: ${stats.isDirectory()}`);
        console.log(`Is symbolic link: ${stats.isSymbolicLink()}`);
        console.log(`Is character device: ${stats.isCharacterDevice()}`);
        console.log(`Is block device: ${stats.isBlockDevice()}`);
    });


    
});

gc.inspect();

const input = 'Hello World';
const offset = gc.alloc(Buffer.byteLength(input), 1); // 1 is the type tag, it's optional.
heap.write(input, offset);

gc.ref(offset); // increment the reference count
gc.cycle(); // our data is preserved because it has a reference count > 0
gc.sizeOf(offset);
gc.unref(offset); // decrement the reference count by 1
const freed = gc.cycle(); // frees our string and invokes the callback

// require('./config/passport')(passport); // pass passport for configuration
app.use(morgan('dev')); // log every request to the //console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.use(compression());
app.use(express.static(__dirname + '/public', { maxage: '100d' }));

app.set('views', __dirname + '/public/views');
app.engine('html', require('ejs').renderFile);
app.use(
    session({
        secret: 'checktransportinghere', // session secret
        resave: true,
        saveUninitialized: true,
    })
);

app.use(flash()); // use connect-flash for flash messages stored in session

server = http.createServer(app).listen(8080);
var url = require('url');
app.get('*app.js', function (req, res, next) {
    req.url = req.url + '.gz';
    res.set('Content-Encoding', 'gzip');
    next();
});

app.use('/', require('./routes/index.js'));
require('./app/routes.js')(app); // load our routes and pass in our app and fully configured passport
////console.log(process.env.NODE_ENV);
app.get('*', function(req, res) {
    res.sendfile('./public/views/dashboard.html'); // load the single view file (angular will handle the page changes on the front-end)
})
process.on('uncaughtException', function (err) {
    //console.log(err);
});

var userIds = new Array();
console.log('Discover amazing things to do on Animailwells on Port:' + port);

