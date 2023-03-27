const Bot = require("./Bot")

bot = new Bot();

bot.getUpdates();

setInterval(function(){bot.getUpdates()}, 5000);
setInterval(function(){bot.sendRandomMessage()}, 5000)