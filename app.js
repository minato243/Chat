const Bot = require("./Bot");
const DataBase = require("./DataBase");

database = new DataBase();
bot = new Bot();

bot.getUpdates();
bot.sendMessage("@Thaodt3_zps do something");


setInterval(function(){bot.getUpdates()}, 5000);
//setInterval(function(){bot.sendRandomMessage()}, 5000);

let datetime = new Date();
datetime.setTime(datetime.getTime() + 86400*1000);
let dateStr = datetime.toISOString().substring(0, 10);
