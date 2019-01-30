const httpRequest = require('request');
const config = require('../../config/config');
const db = require('../../database/db_config_mysql.js').localConnect();
// const db = require('../../database/db_config_mysql_master.js').localConnect();
const mysql = require('mysql');
const s3ImageDomain = '//images.woovly.com/w_200';
// var emailHelperClass = require('../../emailers/emailTextHelper');
// var emailHelperObj = new emailHelperClass();
const jwt = require('jsonwebtoken');

module.exports = function (request) {
    const options = {
        url: 'https://api.instagram.com/oauth/access_token',
        method: 'POST',
        form: {
            client_id: config.instagram.client_id,
            client_secret: config.instagram.client_secret,
            grant_type: 'authorization_code',
            redirect_uri: config.instagram.redirect_uri,
            code: request.query.code
        }
    };
    httpRequest(options, (err, res, body) => {
        if (!err && res.statusCode == 200) {
            let r = JSON.parse(body);
            let initial = ['Check', 'View', 'See'][Math.floor(Math.random() * 3)];
            let userGenrSql = '';
            let userKeySql = '';
            let sql = "insert into tbl_user_master set";
            var user = {
                id: r.user.id,
                username: r.user.username,
                full_name: r.user.full_name,
                bio: r.user.bio,
                website: r.user.website,
                profile_picture: r.user.profile_picture,
                access_token: r.access_token
            };

            if (r.user.username) {
                if (userGenrSql !== '') {
                    userGenrSql += ',';
                }
                userGenrSql += '  user_name = ' + mysql.escape(r.user.username.toLowerCase()) + '';
            } if (r.user.full_name) {
                if (userGenrSql !== '') {
                    userGenrSql += ',';
                }
                userGenrSql += ' name = ' + mysql.escape(r.user.full_name) + ' ';
            } if (r.user.bio) {
                if (userGenrSql !== '') {
                    userGenrSql += ',';
                }
                userGenrSql += ' user_info = ' + mysql.escape(r.user.bio) + ' ';
            } if (r.user.profile_picture) {
                if (userGenrSql !== '') {
                    userGenrSql += ',';
                }
                userGenrSql += ' profile_image = ' + mysql.escape(r.user.profile_picture) + ' ';
            } if (r.access_token) {

            } if (userGenrSql !== '') {
                userKeySql += ' user_id = ' + r.user.id + ' , ';
                //  userKeySql += ' insta_id = ' + r.user.id + ', ';
                token = jwt.sign({ id: r.user.id, }, 'secret');
                userKeySql += ' meta_description_initial = ' + mysql.escape(initial) + ', ';
            }

            let sqlUpdateFollow = 'insert into tbl_follow_master set user_id = ' + r.user.id + ' , follower_id = ' + r.user.id + ' , active_flag = 1 on duplicate key update updated_on = now()';
            db.query(sqlUpdateFollow, (err, rowsin, fields) => { });
            sql = sql + ' ' + userKeySql + ' ' + userGenrSql + ',created_on =now() ,active_flag = 1 on duplicate key update updated_on = now() ,' + userGenrSql + ' ';
            console.log(r.user);
            console.log(sql);
            db.query(sql, (err) => {
                if (err) {
                    console.log(sql);
                    console.log(err);
                } else {
                    res.redirect('/');
                }
            })
        } else {
            console.log(err);
            console.log(body);
        }
    });
};



// { id: '9743375626',
//   username: 'loyalcoder101020',
//   full_name: 'Gangesh kumar',
//   bio: '',
//   website: '',
//   profile_picture:
//    'https://scontent.cdninstagram.com/vp/eaf4663b993b22ab3c90681222cba10e/5C0B007A/t51.2885-19/11906329_960233084022564_1448528159_a.jpg',
//   access_token: '9743375626.492d2d5.c52d0137287d48ea9f8183b95aa840cf' }