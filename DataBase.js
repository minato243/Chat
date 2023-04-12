const mysql = require('mysql2');
const fs = require('fs');

const HOST_IP = "34.66.154.116"
const HOST_PORT = 3306
const USER_NAME = "root"
const PASSWORD = "24031992"
const DEFAULT_DB = "absentCalendar"

const connection = require("./helper/ConnectHelper");

const createQuerry = async (conn, q, params) => new Promise(
  (resolve, reject) => {
    const handler = (error, result) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(result);
    }
    conn.query(q, params, handler);
  });

class DataBase {
  CONFIG = {
    host: HOST_IP,
    user: USER_NAME,
    password: PASSWORD,
    database: DEFAULT_DB
  };

  constructor() {
    var con = mysql.createConnection(this.CONFIG);
    this.con = con;
  }

  insertDatabase(userId, dateTime, type) {
    console.log("insertDatabase", userId, dateTime, type);

    let con = this.con;
    con.connect(function (err) {
      if (err) throw err;
      console.log("Connected!");
      var sql = `insert into absent values("` + userId + `", "` + dateTime + `", +` + type + `)`;
      console.log(sql);
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("1 record inserted");
      });
    });
  }

  getLatenessToday() {
    console.log("getLatenessToday");
    let con2 = this.con;
    con.onnect(function (err) {
      if (err) throw err;
      console.log("Connected!");
      let date = new Date();
      let dateStr = date.toISOString().substring(0, 10);
      var sql = `Select * from Lateness where day = "` + dateStr + `"`;
      console.log(sql);
      con2query(sql, function (err, result) {
        if (err) throw err;
        console.log("Result: " + JSON.stringify(result));
      })
    })
  };

  async getLatenessBetween(startDate, endDate) {
    console.log("getLatenessBetween", startDate, endDate);
    const conn = await connection({
      host: HOST_IP,
      user: USER_NAME,
      password: PASSWORD,
      database: DEFAULT_DB
    }).catch(e => { });

    var sql = `Select userId, count(day) as num from Lateness where day >= "` + startDate + `" and day <="` + endDate + `" group by userId`;
    const result = await createQuerry(conn, sql);
    console.log("getAllLateness", JSON.stringify(result));
    return result;

  }

  async getAllLateness() {
    console.log("getAllLateness");
    const conn = await connection({
      host: HOST_IP,
      user: USER_NAME,
      password: PASSWORD,
      database: DEFAULT_DB
    }).catch(e => { });
    var sql = `Select userId, count(day) as num from Lateness group by userId`;
    const result = await createQuerry(conn, sql);
    console.log("getAllLateness", JSON.stringify(result));
    return result;
  };

  async insertLateness(userId) {
    console.log("insertLateness");
    const conn = await connect(this.CONFIG);
    let date = new Date();
    let dateStr = date.toISOString().substring(0, 10);
    var sql = `Insert into Lateness values("${userId}", "${dateStr}")`;
    console.log("insertLateness", sql);
    const result = await createQuerry(conn, sql);
    console.log("insertLateness", JSON.stringify(result));
  }

};


module.exports = DataBase; 