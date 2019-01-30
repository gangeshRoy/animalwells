module.exports = {
    apps: [
        {
        name: "animalwells",
        script: "server.js",
        watch: false,
        env: {
            NODE_ENV: "staging"
        }
    }
       
]
};
