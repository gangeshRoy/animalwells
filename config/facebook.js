var https = require('https');

exports.getFbData = function(accessToken, apiPath, callback) {
    var options = {
        host: 'graph.facebook.com',
        port: 443,
        path: apiPath , //apiPath example: '/me/friends'
        method: 'GET'
    };

    var buffer = ''; 
    var request = https.get(options, function(result){
        result.setEncoding('utf8');
        result.on('data', function(chunk){
            buffer += chunk;
        });
        result.on('end', function(){
            callback(buffer);
        });
    });

    request.on('error', function(e){
        //console.log('error from facebook.getFbData: ' + e.message);
    });

    request.end();
};