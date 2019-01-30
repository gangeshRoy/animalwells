// ************* local insta login Credentials **************** 
const in_client_id = '492d2d55b8c94579a3738731fec6bf88',
    in_client_secret = '768aefe9848247a39259001a376b426b',
    in_redirect_uri = 'http://localhost:8080/auth',
    redirect_uri = 'http://localhost:8080/auth',
    in_auth_url = 'https://api.instagram.com/oauth/authorize/?client_id='
        + in_client_id + '&redirect_uri='
        + in_redirect_uri + '&response_type=code';

const SERVER_KEY="AAAAtX-Ky2Y:APA91bGYjBid5Bqwl7Qlo88M10ogPF2IL2RDpJFyWrRhQTs96dSAqrCxoNAxqBCTK9q72_7rjg8eo76qV3yATXomDKceIuTiMoiopHplCWDd3PBEugmjSe3G0YIFLeqh5ILaK_2cR6_p";
      

module.exports = {
    instagram: {
        client_id: in_client_id,
        client_secret: in_client_secret,
        auth_url: in_auth_url,
        redirect_uri: redirect_uri
    },
    SERVER_KEY
};