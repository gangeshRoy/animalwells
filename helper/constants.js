module.exports = {
    SECRET: "secret",
    LONG_QUERY: 300000,
    MEDIUM_QUERY: 180000,
    SHORT_QUERY: 60000,
    errMsg: "error in query",
    successMsg: "Success in query",
    USER: "notificationsgangesh",
    PASSWORD: "g@ngesh12345",
   
  
    development: {
      port: 8080,
      mysqlServer: "db_animalwells",
      hostMaster: "localhost",
      hostSlave: "localhost",
      user: "root",
      password: "password1",
    //   mongoUrl: "mongodb://127.0.0.1:27017/db_woovly_mongo",
      min: ""
    },
  
    development1: { 
      //developmentShubam: {
      port: 8080,
      mysqlServer: "db_animalwells",
      hostMaster: "woovlydbmaster.cmy2utyh80ee.ap-south-1.rds.amazonaws.com",
      hostSlave: "woovlydbslave.cmy2utyh80ee.ap-south-1.rds.amazonaws.com",
      user: "woovlydbuser",
      password: "WIPL#db56",
      //mongoUrl: 'mongodb://superAdmin:admin123@127.0.0.1:27017/admin?authMechanism=DEFAULT&authSource=admin',
      mongoUrl: "mongodb://127.0.0.1:27017/db_woovly_mongo",
      min: ""
    },
    staging: {
      port: 443,
      mysqlServer: "db_animalwells",
      hostMaster: "woovlydbmaster.cmy2utyh80ee.ap-south-1.rds.amazonaws.com",
      hostSlave: "woovlydbslave.cmy2utyh80ee.ap-south-1.rds.amazonaws.com",
      user: "woovlydbuser",
      password: "WIPL#db56",
      mongoUrl:
        "mongodb://superAdmin:admin123@127.0.0.1:27017/db_woovly_mongo?authMechanism=DEFAULT&authSource=admin",
      min: ""
    }
  };
  