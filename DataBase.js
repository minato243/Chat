const mysql = require('mysql');
const fs = require('fs');

const HOST_IP = "34.66.154.116"
const HOST_PORT = 3306
const USER_NAME = "root"
const PASSWORD = "24031992"
const DEFAULT_DB = "absentCalendar"

// createTcpPool initializes a TCP connection pool for a Cloud SQL
// instance of MySQL.
const createTcpPool = async config => {
    // Note: Saving credentials in environment variables is convenient, but not
    // secure - consider a more secure solution such as
    // Cloud Secret Manager (https://cloud.google.com/secret-manager) to help
    // keep secrets safe.
    const dbConfig = {
      host: HOST_IP, // e.g. '127.0.0.1'
      port: HOST_PORT, // e.g. '3306'
      user: USER_NAME, // e.g. 'my-db-user'
      password: PASSWORD, // e.g. 'my-db-password'
      database: DEFAULT_DB, // e.g. 'my-database'
      // ... Specify additional properties here.
    };
    // Establish a connection to the database.
    console.log("createTcpPool");
    return mysql.createPool(dbConfig);
  };
  

class DataBase{
    constructor(){
        createTcpPool();
        var con = mysql.createConnection({
          host: HOST_IP,
          user: USER_NAME,
          password: PASSWORD,
          database: DEFAULT_DB
        });
        this.con = con;
    }

    insertDatabase(userId, dateTime, type){
      console.log("insertDatabase", userId, dateTime, type);
      
      let con = this.con;
      con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        var sql = `insert into absent values("`+userId+`", "`+dateTime+`", +`+type+`)`;
        console.log(sql);
        con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("1 record inserted");
        });
      });
    }

    getLatenessToday(){
      console.log("getLatenessToday");
      let con2 = this.con;
      con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        let date = new Date();
        let dateStr = date.toISOString().substring(0, 10);
        var sql = `Select * from Lateness where day = "`+ dateStr+`"`;
        console.log(sql);
        con2.query(sql, function (err, result) {
          if (err) throw err;
          console.log("Result: " + JSON.stringify(result));
        })
      })  
    };

    getLatenessBetween(startDate, endDate){
      console.log("getLatenessBetween", startDate, endDate);
      let con = this.con;
      con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
        var sql = `Select userId, count(day) as num from Lateness where day >= "`+ startDate+`" and day <="`+endDate+`" group by userId`;
        console.log(sql);
        con.query(sql, function (err, result) {
          if (err) throw err;
          console.log("Result: " + JSON.stringify(result));
        });
      });
    };
};


module.exports = DataBase;