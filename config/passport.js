var LocalStrategy    = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy  = require('passport-twitter').Strategy;
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;
var facebook         = require('./facebook.js');
var ValidationClass  = require('../helper/validationCheck.js');
var validationObj    = new ValidationClass();
const generateIdClass       = require('../helper/genarateId.js');
const generateIdObj         = new generateIdClass();
var configAuth       = require('./auth'); 
var https            = require('https');
const constants      = require('../helper/constants.js');
const LONG_QUERY     = constants.LONG_QUERY;
const MEDIUM_QUERY   = constants.MEDIUM_QUERY;
const SHORT_QUERY    = constants.SHORT_QUERY;
var Promise = require("promise");
var mysql = require('mysql');
var frds             = {};
var db               = require('../database/db_config_mysql.js').localConnect();
var dbmaster = require('../database/db_config_mysql.js').localConnect();
// var logger           = require('../logging/ js');
var async              = require('async');
const bcrypt = require('bcrypt-nodejs');
var salt = bcrypt.genSaltSync(6);
var Firebird = require('node-firebird');
var dateFormat = require('dateformat');
var request = require('request');
// const googleapis = require('googleapis');
// var emailHelperClass = require('../emailers/emailTextHelper');
// // const googleapis = require('googleapis');
// var emailHelperObj = new emailHelperClass();




module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        let profileImage  = user._json.picture ? user._json.picture.data.url :user.photos[0].value;
        var profile = {'userid':user._json.id,'is_set':user._json.is_set,'name':user._json.name,'username':user._json.username,'email':user._json.email,'upht':profileImage,'utyp':user._json.uType};
         error("serializeUser");
         error(profile);
        done(null,profile);
    });


    passport.deserializeUser(function(id, done) {
        //console.log(id);
        done(null,id);

    });

  
    var fbStrategy = configAuth.facebookAuth;
    fbStrategy.passReqToCallback = true;  
    
    passport.use(new FacebookStrategy(fbStrategy,function(req, token, refreshToken, profile, done) {
        process.nextTick(function() {
            //console.log('its on more load now');
            var userGenrSqlUserid = '';
            var userGenrSql = '';
            var error  = {};
            var retArr = {}; 
            var data = {};
            var userName = '';
            var flag = 1;
            var userNameAlready = '';
            var lastname = profile._json['last_name'].split(' ');
            var firstname =  profile._json['first_name'].split(' ');
            userName = firstname[0]+'.'+lastname[0]+'';
            var sqlUsrName = "SELECT COUNT(1) AS cnt,( select user_name  FROM tbl_user_master WHERE user_id = "+profile.id+"   ) as userNameOf, ( select active_flag  FROM tbl_user_master WHERE user_id = "+profile.id+"   ) as avfg,(select count(1) from tbl_user_master where user_id = "+profile.id+") as isLogin FROM tbl_user_master WHERE user_name LIKE '%"+userName+"%' and user_id <> "+profile.id+" ";
             error(sqlUsrName);
            let promise1 = new Promise(function(resolve,reject){
                db.query({sql:sqlUsrName,timeout: MEDIUM_QUERY}, function (err, rows, fields)
                {
                    request('https://graph.facebook.com/me/permissions?access_token='+token, function (error, response, body) {
                        var declined = [];
                        var i = 0;
                        body  = JSON.parse(body);
                        for (i = 0; i < body.data.length; i++) { 
                          if (body.data[i].status == 'declined') {
                            declined.push(body.data[i].permission)
                          }
                        }
                        if(declined.length){
                            //console.log('all deatails are neccessary to sign in into woovly');
                            //return done(null, false, {error: ''});
                        }
                    });                        
                    if(rows[0].cnt >0){ 
                        if(rows[0].cnt == 1)
                            rows[0].cnt =0;
                        let count =  rows[0].cnt+1;
                        count = '.'+count;
                        userName = userName+count;
                        if(rows && rows.length && !rows[0].userNameOf)
                                userNameAlready  = rows[0].userNameOf; 

                    }
                    //console.log(rows[0]);
                    //console.log("**********");
                    if(rows[0].avfg != 1 && rows[0].isLogin){
                        //console.log("here ----------");
                        return done(null, false, {error: 'You are suspended by admin please contact at woovly@gmail.com'});
                        flag = 0;
                    }
                    //console.log("sddddddd------------");
                    resolve(userName);
                });
            });
            promise1.then(function(data){
                userName = data;
                var sql = "insert into tbl_user_master set";
                var updatesearchsql = 'insert into tbl_user_search_master set user_id = ' + profile.id + ' , active_flag = 1 , ';
                var updatesearchinsql = '';
                if (validationObj.checkEmpty(profile._json['email'])) {
                    if (userGenrSql !== '')
                    {
                        userGenrSql += ',';
                    }
                    userGenrSql += ' user_email = "' + profile._json['email'] + '" ';
                    userGenrSql += ' ,is_fb = 1 ';
                }
                if (validationObj.checkEmpty(profile._json['name'])) {
                    if (userGenrSql !== '')
                    {
                        userGenrSql += ',';
                    }
                    userGenrSql += ' name = "' + profile._json['name'] + '"';
                    updatesearchinsql += '  name = "' + profile._json['name'] + '"';
                }
                 error(userNameAlready+'-------------'+userName);
                if(!userNameAlready){
                if (validationObj.checkEmpty(userName)) {
                    if (userGenrSql !== '')
                    {
                        userGenrSql += ',';
                    }
                    userGenrSql += '  user_name = "' + userName.toLowerCase() + '"';
                }
            }
                if (validationObj.checkEmpty(profile.photos[0].value)) {
                    if (userGenrSql !== '')
                    {
                        userGenrSql += ',';
                    }
                    userGenrSql += ' profile_image = "' + profile.photos[0].value + '"';
                    updatesearchinsql +=  ' , profile_image = "' + profile.photos[0].value + '"';
                }
                if (userGenrSql !== ''){
                    userGenrSql += ' , user_type = 1 ';
                    userGenrSqlUserid = ' user_id = ' + profile.id + ' , ';
                    userGenrSqlUserid+= 'facebook_id = ' + profile.id + ', '; 

                }
                updatesearchsql +=  updatesearchinsql +' on duplicate   key update '+ updatesearchinsql;

                var sqlUpdateFollow = 'insert into tbl_follow_master set user_id = '+profile.id+' , follower_id = '+profile.id+' , active_flag = 1 on duplicate key update updated_on = now()';
                    db.query({sql:sqlUpdateFollow,timeout: MEDIUM_QUERY}, function (err, rowsin, fields)
                {});

                 db.query({sql:updatesearchsql,timeout: MEDIUM_QUERY}, function (err, rowsin, fields)
                {});
                sql = sql +' '+ userGenrSqlUserid +' '+userGenrSql+',created_on =now() ,active_flag = 1 on duplicate key update ' + userGenrSql + ' ';
                 error(sql);
                 error("********************");
                dbmaster.query({sql:sql,timeout: MEDIUM_QUERY}, function (err, rows, fields)
                {
                    sendEmailForFirst(profile.id);
                    if(err){

                         error(sql);
                         error(constants.errMsg);
                        return 1;
                    }else{
                        facebook.getFbData(token, '/me/friends?access_token='+token+'&fields=picture.type(large),name,email,likes', function(data){
                            let data1 = JSON.parse(data);
                            var friends = data1.summary.total_count ? data1.summary.total_count : 0;
                            async.eachSeries(data1.data, function (vl, callback) {
                                let sql1 = 'insert into tbl_user_friend_mapping set ';
                                let sqlFollow = 'insert into tbl_follow_master set ';
                                let sqlNotify = 'insert into tbl_notification_master set ';
                                let frdSql = '';
                                let frdIdSql = '';
                                let followSql = '';
                                let followIdSql = '';
                                let notifySql = '';
                                let nid     =  generateIdObj.generateId() ;
    
                                if(validationObj.checkEmpty(vl.name)){
                                    if (frdSql !== '')
                                    {
                                        frdSql += ',';
                                    }
                                    frdSql += ' frd_name = "' + vl.name + '" ';
                                    followSql = 'name = "'+vl.name+'" ';
                                }
                                if(validationObj.checkEmpty(vl.picture.data.url)){
                                    if (frdSql !== '')
                                    {
                                        frdSql += ',';
                                    }
                                    frdSql += ' frd_image = "' + vl.picture.data.url + '" ';
                                }
                                frdSql += ', active_flag = 1';
                                if(validationObj.checkEmpty(profile.id)){
                                    if (frdIdSql !== '')
                                    {
                                        frdIdSql += ',';
                                    }
                                    if (followIdSql !== '')
                                    {
                                        followIdSql += ',';
                                    }
                                    frdIdSql += ' user_id = "' + profile.id + '" ';
                                    followIdSql+= 'user_id = "' + profile.id + '" ';
                                    sqlNotify+= 'userid = "' + profile.id + '" ';
                                }
                                if(validationObj.checkEmpty(vl.id)){
                                    if (frdIdSql !== '')
                                    {
                                        frdIdSql += ',';
                                    }
                                    if (followIdSql !== '')
                                    {
                                        followIdSql += ',';
                                    }
                                    if (sqlNotify !== '')
                                    {
                                        sqlNotify += ',';
                                    }
                                    frdIdSql += ' frd_id = "' +  vl.id + '" ,';
                                    followIdSql+= ' follower_id = "' +  vl.id + '" ';
                                    sqlNotify+= 'intended_userid = "' + vl.id + '" ';
                                }
                                sql1 = sql1 +' '+ frdIdSql +' '+frdSql+',created_on =now() on duplicate key update ' + frdSql + ' ';
                                sqlFollow = sqlFollow +' '+followIdSql +' , active_flag =1 , created_on = now() on duplicate key update '+followSql+' ';
                                sqlNotify+= ', nid = '+nid+' ,active_flag =1 ,is_viewed= 0 ,n_type = 5,created_on = now()';
                                dbmaster.query({sql:sql1,timeout: MEDIUM_QUERY}, function (err, rows, fields)
                                {
                                    if(err){
                                         error('API from addUserFriends');
                                         error('too long to execute query');
                                         error(sql1);
                                         error(err);
                                        return done(null, false, {error: ''});
                                    }
                                    // }else{
                                    //     let sqlLogin = 'select count(1) as cnt from tbl_user_master where user_id = '+profile.id+' and active_flag =1 ';
                                    //     db.query({sql:sqlLogin,timeout: MEDIUM_QUERY}, function (err, rows, fields)
                                    //     {
                                    //         if(err){
                                    //              error('API from addUserFriends');
                                    //              error('too long to execute query');
                                    //              error(sqlLogin);
                                    //              error(err);
                                    //             return done(null, false, {error: ''});
                                    //         }else if(rows[0].cnt){
                                    //             db.query({sql:sqlFollow,timeout: MEDIUM_QUERY}, function (err, rows, fields)
                                    //             {
                                    //                 if(err){
                                    //                      error('API from addUserFriends');
                                    //                      error('too long to execute query');
                                    //                      error(sqlFollow);
                                    //                      error(err);
                                    //                     return done(null, false, {error: ''});
                                    //                 }else{
                                    //                     db.query({sql:sqlNotify,timeout: MEDIUM_QUERY}, function (err, rows, fields)
                                    //                     {
                                    //                         if(err){
                                    //                              error('API from addUserFriends');
                                    //                              error('too long to execute query');
                                    //                              error(sqlNotify);
                                    //                              error(err);
                                    //                             return done(null, false, {error: ''});
                                    //                         }
                                    //                     });
                                    //                 }
                                    //             });
                                    //         }
                                    //     });
                                    // }
                                });
                                callback();
                            },function(err){
                                
                            });
                                let sqlfrd = 'update tbl_user_master set total_fb_friends = '+friends+' where  user_id = "'+profile.id+'" ';
                                dbmaster.query({sql:sqlfrd,timeout: MEDIUM_QUERY}, function (err, rows, fields)
                                {
                                    if(err){
                                         error('API from addUserFriends');
                                         error('too long to execute query');
                                         error(sqlfrd);
                                         error(err);
                                        return done(null, false, {error: ''});
                                    }
                                });
                        });
    
                        let sql2 = 'SELECT user_name FROM tbl_user_master WHERE user_id = '+profile.id+' AND active_flag = 1';
                        db.query({sql:sql2,timeout: MEDIUM_QUERY}, function (err, rows, fields)
                        {
                        if(err){
                                 error('API from addUserFriends');
                                 error('too long to execute query');
                                 error(sql2);
                                 error(err);
                                return done(null, false, {error: ''});
                            }else{
                                facebook.getFbData(token, '/me?access_token='+token+'&fields=birthday,location', function(data){
                                    let data2 = data ? JSON.parse(data) : '';
                                    if(data){
                                    // async.eachSeries(data2.likes.data, function (vl, callback) {
                                    //     let lSql = 'insert into tbl_user_like_mapping set ';
                                    //     let likeSql = '';
                                    //     let primarySql = ''; 
                                    //     if(validationObj.checkEmpty(vl.name)){
                                    //         if (likeSql !== '')
                                    //         {
                                    //             likeSql += ',';
                                    //         }
                                    //         likeSql += ' name = "' + vl.name + '" ';
                                    //     }
                                    //     if(validationObj.checkEmpty(vl.created_time)){
                                    //         if (likeSql !== '')
                                    //         {
                                    //             likeSql += ',';
                                    //         }
                                    //         likeSql += ' created_on = "' + vl.created_time + '" ';
                                    //     }
                                    //     likeSql+= ' , active_flag = 1 ';
                                    //     if(validationObj.checkEmpty(profile.id)){
                                    //         if (primarySql !== '')
                                    //         {
                                    //             primarySql += ',';
                                    //         }
                                    //         primarySql += ' user_id = "' + profile.id + '" ';
                                    //     }
                                    //     if(validationObj.checkEmpty(vl.id)){
                                    //         if (primarySql !== '')
                                    //         {
                                    //             primarySql += ',';
                                    //         }
                                    //         primarySql += ' like_id = "' + vl.id + '" ';
                                    //     }
                                    //     lSql = lSql +' '+ likeSql +' , '+primarySql+' on duplicate key update ' + likeSql + ' ';
                                    //     db.query({sql:lSql,timeout: MEDIUM_QUERY}, function (err, rows, fields)
                                    //     {
                                    //         if(err){
                                    //              error('API from addUserFriends');
                                    //              error('too long to execute query');
                                    //              error(lSql);
                                    //              error(err);
                                    //             return done(null, false, {error: ''});
                                    //         }
                                    //     });
                                    //      callback();
                                    // },function(err){
                                    //     var sqlUp = 'update tbl_user_master set last_login = NOW() where user_id = "'+profile.id+'" ' ;
                                    //     db.query({sql:sqlUp}, function(err, rows,fields){ 
                                    //         if(err){
                                    //                  error(sqlUp);
                                    //         }
                                    //     }); 
                                    // });
                                }
                                let tempData = '';
                                if(data2.birthday){
                                    tempData+= ' , dob = '+mysql.escape(dateFormat(data2.birthday, "yyyy-mm-dd"))+' ';
                                }if(data2.location && data2.location.name){
                                    tempData+= ' , location = '+mysql.escape(data2.location.name)+' ';
                                }
                                let sqlUp = 'update tbl_user_master set last_login = NOW(),active_flag = 1 '+tempData+' where user_id = "'+profile.id+'" ' ;
                                 error(sqlUp);
                                dbmaster.query({sql:sqlUp}, function(err, rows,fields){ 
                                    if(err){
                                        //console.log("here I am");
                                             error(sqlUp);
                                            return true;
                                    }
                                });
                                profile._json['username'] = rows[0].user_name;
                                    done(null, profile);
                                });
                            }
                        });
                    }
                });
            });
        });
    }));

     // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
 passport.use(new GoogleStrategy({
    clientID : configAuth.googleAuth.clientID,
    clientSecret : configAuth.googleAuth.clientSecret,
    callbackURL : configAuth.googleAuth.callbackURL,
    passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },function(req, token, refreshToken, profile, done) {
        let temp = (profile.name.givenName).split(/\s+/);
        let userGenrSqlUserid = '';
        let userGenrSql = '';
        userName = temp[0] +'.'+profile.name.familyName;
         error(token);
        process.nextTick(function() {
            let email = profile.emails[0].value.toLowerCase();
            var sqlUsrName = 'SELECT COUNT(1) AS cnt, (select user_id from tbl_user_master where user_email = '+mysql.escape(email)+' and active_flag = 1 and facebook_id IS NOT NULL ) as uuid ,(select user_name from tbl_user_master where user_id = uuid and active_flag =1 ) as uname,( select active_flag  FROM tbl_user_master WHERE user_id = '+mysql.escape(profile.id)+') as avfg FROM tbl_user_master WHERE user_name LIKE "%'+userName+'%" and user_id <> '+profile.id+' ';

                                    //console.log(sqlUsrName);
                                    //console.log(sqlUsrName);

            let promise1 = new Promise(function(resolve,reject){
                db.query({sql:sqlUsrName,timeout: MEDIUM_QUERY}, function (err, rows, fields)
                {
                    if(err){
                        //console.log(err);
                        //console.log(sqlUsrName);
                    }else{
                        let checkUserEmail = '  select \n\
                                                    user_id,\n\
                                                    user_name\n\
                                                from \n\
                                                    tbl_user_master \n\
                                                where \n\
                                                    user_email = '+mysql.escape(email)+' \n\
                                                and \n\
                                                    active_flag = 1';
                         error(checkUserEmail);
                        db.query(checkUserEmail,(err,rows1)=>{
                            if(err){
                                 error(sql);
                                 error(err);
                                return done(null, false, {error: ''});
                            }else if(rows1 && rows1.length){
                                profile._json['username'] = rows1[0].user_name;
                                profile.id = rows1[0].user_id;
                                profile._json['id'] = rows1[0].user_id;
                                 error(profile);
                                done(null, profile);
                            }else{
                                if(rows && rows[0].cnt >0){
                                    if(rows[0].cnt == 1)
                                        rows[0].cnt =0;
                                    let count =  rows[0].cnt+1;
                                    count = '.'+count;
                                    userName = userName+count;
                                }
                                if(rows[0].avfg == 0){
                                    return done(null, false, {error: ''});
                                    flag = 0;
                                }
                                resolve(userName);
                            }
                        })
                    }
                });
            });
            promise1.then(function(data){


                 var updatesearchsql = 'insert into tbl_user_search_master set user_id = ' + profile.id + ' , active_flag =1 , ';
                var updatesearchinsql = '';
                var sql = "insert into tbl_user_master set";
                if (validationObj.checkEmpty(profile.emails[0].value)) {
                    if (userGenrSql !== '')
                    {
                        userGenrSql += ',';
                    }
                    userGenrSql += ' user_email = "' + profile.emails[0].value + '" ';
                    userGenrSql += ' ,is_fb = 2 ';
                }
                if (validationObj.checkEmpty(profile.displayName)) {
                    if (userGenrSql !== '')
                    {
                        userGenrSql += ',';
                    }
                    userGenrSql += ' name = "' + profile.displayName + '"';
                      updatesearchinsql +=   ' name = "' + profile.displayName + '"';
                }
                if (validationObj.checkEmpty(userName)) {
                    if (userGenrSql !== '')
                    {
                        userGenrSql += ',';
                    }
                    userGenrSql += ' user_name = "' + userName.toLowerCase() + '"';
                }
                if (validationObj.checkEmpty(profile.photos[0].value)) {
                    if (userGenrSql !== '')
                    {
                        userGenrSql += ',';
                    }
                    userGenrSql += ' profile_image = "' + replaceQueryParam('sz', 200, profile.photos[0].value) + '"';
                     updatesearchinsql +=  ' , profile_image = "' + replaceQueryParam('sz', 200, profile.photos[0].value) + '"';
                }
                if (userGenrSql !== ''){
                    userGenrSql += ' , user_type = 1 ';
                    userGenrSqlUserid = ' user_id = ' + profile.id + ' , ';
                    userGenrSqlUserid+= 'google_id = ' + profile.id + ', '; 
                }
                 updatesearchsql +=  updatesearchinsql +' on duplicate   key update '+ updatesearchinsql;
                    var sqlUpdateFollow = 'insert into tbl_follow_master set user_id = '+profile.id+' , follower_id = '+profile.id+' , active_flag = 1 on duplicate key update updated_on = now()';
                    db.query({sql:sqlUpdateFollow,timeout: MEDIUM_QUERY}, function (err, rowsin, fields)
                {});

                 db.query({sql:updatesearchsql,timeout: MEDIUM_QUERY}, function (err, rowsin, fields)
                {});
                sql = sql +' '+ userGenrSqlUserid +' '+userGenrSql+',created_on =now() ,active_flag = 1 on duplicate key update ' + userGenrSql + ' ';
                dbmaster.query({sql:sql,timeout: MEDIUM_QUERY}, function (err, rows, fields)
                {
                    if(err){
                         error(sql);
                         error(err);
                        return done(null, false, {error: ''});
                    }else{
                        sendEmailForFirst(profile.id);
                      //  request('https://www.google.com/m8/feeds/contacts/default/full?alt=json&oauth_token=ya29.GltKBaVi8HlY487sS6987Sbnf1iIDfcLLCCPKTpSNiZ50YJgYXHR9E_vZfF7DwJDTBJzAlP92s3HW_PtT8YbGrLo7IsLGvPcXLGjPSsLwex16brReK_uBqxtSP9X', function (error, response, body) {
                        request('https://www.google.com/m8/feeds/contacts/default/full?alt=json&max-results=100&oauth_token='+token, function (error, response, body) {
                             error("*******************************JSON*********************");
                             error(typeof body);
                             error(JSON.parse(body));
                             error(configAuth.googleAuth.clientID);
                             error("****************************JSON************************");
                            body = JSON.parse(body);
                            if(body.feed){
                                async.eachSeries(body.feed.entry,function(vl,cb){
                                    let sqlGoogleContact = ' insert into tbl_user_google_contacts set ';
                                    let sqlTemp = '';
                                    let keySql = '';
                                    keySql+= 'user_id = '+profile.id+' ';
                                    if(vl.gd$email && vl.gd$email.length > 0){
                                        keySql+= ' , contact_email ='+mysql.escape(vl.gd$email[0].address)+' ';
                                    }
                                    if(vl.title.$t){
                                        sqlTemp = ' contact_name = '+mysql.escape(vl.title.$t)+' ';
                                    }
                                    if(sqlTemp){
                                        sqlTemp+= ' ,'; 
                                    }
                                    sqlTemp+= ' active_flag =1 ,created_on = now() ';
                                    sqlGoogleContact = sqlGoogleContact + '' + keySql + ' , '+ sqlTemp + 'on duplicate key update ' + sqlTemp ;
                                    //console.log(sqlGoogleContact);
                                    dbmaster.query(sqlGoogleContact,function(err,results,fields){
                                        if(err){
                                             error("error in google contacts");
                                             error(err);
                                             error(sqlGoogleContact);
                                        }
                                        cb();
                                    })
                                },function(err){
                                    profile._json['username'] = userName;
                                    done(null, profile);
                                })
                            }else{
                                profile._json['username'] = userName;
                                done(null, profile);
                            }
                        });
                    }
                });
                // profile._json['username'] = userName;
                // if (!req.user) {
                //     return done(null, profile);
                // } else {
                //     // user already exists and is logged in, we have to link accounts
                //     return done(null, profile);
                // }
            });
        });
    }));
   
    // =========================================================================
    // ============================= END GOOGLE LOGIN ==========================
    // =========================================================================
    
    passport.use('local-login', new LocalStrategy({
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
        process.nextTick(function() {
        var sql = 'SELECT * FROM tbl_user_master where user_email = '+Firebird.escape(email)+' and active_flag =1 and is_fb = 0';
            db.query({sql:sql}, function(err, rows,fields){  
                if(err){
                     error('Login Error');
                     error(err);
                     error(sql);
                    return 1;
                }else{
                    if(rows && rows.length>0 && rows[0].password){
                        let flag = '';
                        var results = bcrypt.compareSync(password, rows[0].password);
                        if(results){
                            var sqlUp = 'update tbl_user_master set last_login = NOW() where user_email = '+Firebird.escape(email)+' and active_flag =1 ' ;
                            dbmaster.query({sql:sqlUp}, function(err, rows,fields){
                                if(err){
                                      error(sqlUp);
                                }
                             });                                                                                      
                            var user={};
                            var  _json = {'userid':rows[0].user_id,'id':rows[0].user_id,'name':rows[0].name,'is_set':rows[0].is_set,'username':rows[0].user_name,'email':rows[0].user_email,'uType':rows[0].user_type, picture:{'data':{'url':rows[0].profile_image}}};
                            user._json = _json;
                            return done(null, user);
                        }else{
                            return done(null, false, {error: ''});
                        }
                    }else{
                        return done(null, false, {error: ''});
                    }
                }
            });
        });
    }));
};

function replaceQueryParam(param, newval, search) {
    var regex = new RegExp("([?;&])" + param + "[^&;]*[;&]?");
    var query = search.replace(regex, "$1").replace(/&$/, '');
    return (query.length > 2 ? query + "&" : "?") + (newval ? param + "=" + newval : '');
}

// function sendEmailForFirst(id){
// var user_id = id;
//     var storyArray = [];
//      var bucketArray = [];
//      var sendDetails = {};
//      var userDetails = {};
//      var check = 'select mail_sent, name , user_email , profile_image from tbl_user_master where user_id = ' + user_id;
//         //console.log(check);
//                      db.query({sql:check,timeout: MEDIUM_QUERY}, function (err, rows1, fields)
//                     {
//                         if(rows1&&rows1.length)
//                         {
//                             if(rows1[0].mail_sent !=1){
//                                 userDetails.name = rows1[0].name;
//                                 userDetails.image = rows1[0].profile_image;


//                                     // select random buckets

//                 var sqlCheck = 'SELECT *,user_id AS uid,story_id as sid,(select count(1) from tbl_like_master where story_id = sid and active_flag = 1) as likeCnt,(SELECT user_name FROM tbl_user_master WHERE user_id = uid) AS name1 FROM tbl_story_master WHERE active_flag = 1   LIMIT 0 ,3';
//                     db.query(
//                           { sql: sqlCheck },
//                           function(err, rows2, fields) {
//                             var storyEach  ={};
                            
//                           async.eachSeries (rows2,function (vl, cb) {
//                             //console.log(vl);
//                              storyEach  ={};
//                             storyEach.imgUrl = 'images.woovly.com/w_150,h_150/'+vl.image;
//                             storyEach.link = 'https://www.woovly.com/'+vl.name1+'/stories/'+vl.textseo.split(' ').join('-');
//                             storyEach.text = vl.text;
//                             storyEach.likeCount = vl.likeCnt;
//                             storyEach.viewCount = vl.view_count;
                            
//                             storyArray.push(storyEach);


//                             cb();

//                           },function(){

//                         var bucketSql = 'select bucket_title_seo , bucket_title , bucket_image , like_count  , comment_count from tbl_user_bucket_master WHERE active_flag =  1 GROUP BY bucket_id LIMIT 0 ,3 ';        
//                                       db.query(
//                           { sql: bucketSql },
//                           function(err, rowsbucket, fields) {
//                             var bucketEach  ={};
//                             //console.log(bucketSql);
//                           async.eachSeries (rowsbucket,function (vl1, cb1) {
//                                 bucketEach = {};
//                                 bucketEach.link = 'https://www.woovly.com/bucketList/'+vl1.bucket_title_seo.split(' ').join('-');
//                                 bucketEach.image='images.woovly.com/w_150,h_150/'+vl1.bucket_image;
//                                 bucketEach.likeCount= vl1.like_count;
//                                 bucketEach.comentCount = vl1.comment_count;
//                                 bucketEach.text = vl1.bucket_title;
//                                 bucketArray.push(bucketEach);
//                             cb1();

//                           },function(){

//                                         sendDetails.bucket = bucketArray;
//                                         sendDetails.story = storyArray;
//                                         sendDetails.user =userDetails;    


//                               var emailHelperClass = require('../emailers/emailTextHelper');
//                               var emailHelperObj = new emailHelperClass();
//                             //  var mailBody = emailHelperObj.mailAfterComment(fullData);
                             
                            
//                                     // storieselect random stories




//                                   var mailBody = emailHelperObj.SignUpEmailer(sendDetails);
//                                    var nodemailer = require('nodemailer');
//                                      var smtpTransport = nodemailer.createTransport({
//                                                         service: 'Gmail', // sets automatically host, port and connection security settings
//                                                         auth: {
//                                                               user: 'woovlydev@gmail.com', 
//                                                               pass: 'dev12345'
//                                                         }
//                                                     });

//                                 var mailOptions = {
//                                   from: 'woovlydev@gmail.com',
//                                   to: rows1[0].user_email,
//                                   subject: 'Thanks for Joining Us '+rows1[0].name ,
//                                   html: mailBody.content
//                                };  


//                                         smtpTransport.sendMail(mailOptions, (error, info) => {
//                                                 if (error) {
//                                                     //console.log('Error while sending mail: ' + error);
//                                                 } else {
//                                                     //console.log('Message sent: %s', info.messageId);
//                                                      var updateSql = 'update tbl_user_master set mail_sent = 1 where user_id = ' +id;
//                                                       dbmaster.query({sql:updateSql,timeout: MEDIUM_QUERY}, function (err, rows, fields)
//                                                     {

//                                                     });
//                                                 }
//                                                 smtpTransport.close(); // shut down the connection pool, no more messages.
//                                                     return;
//                                                     });



//                           });
//                         });
//                     });
//                 });
//             }
//         }
//     });
// }
                          