const DataBase = require("./DataBase");
database = new DataBase();


testDataBase = function(){
    result = database.getAllLateness();
    console.log(result);
}

testDataBase();
