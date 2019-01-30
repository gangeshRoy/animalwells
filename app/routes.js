



module.exports = function (app) {
    app.get('/getListAnimal',function (req, res) {
        console.log(req);
        const data = {};
        data.user = "";
        data.spath = req.protocol + '://' + req.hostname + ':' + port + '/';
        data.server = req.hostname;
        data.min = min;
        data.ver = version;
        data.port = port;
        data.path = '/dashboard';
        data.page = 'dashboard';
        data.curl = req.protocol + '://' + req.hostname;
        data.curl = data.curl.toLowerCase();
        data.title = 'animal List - Discover';
        data.contrl = 'animalTransportDashboard';
        data.meta.storyL.name = 'AnimalTransport';
        data.uuid = "";
        data.is_set = '';
        data.utyp = '';
        res.render("dashboard.html", { dt: data });
    });

}
