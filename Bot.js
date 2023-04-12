const DataBase = require("./DataBase");
database = new DataBase();

const post = async (url, params) => {
    const response = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    })
  
    const data = await response.json()
  
    return data
  }
  
  // Then use it like so with async/await:
  // (async () => {
  //   const data = await post('https://jsonplaceholder.typicode.com/posts', {
  //       title: 'This will be the title',
  //       body: 'Setting the body property',
  //       userId: 1
  //   })
  
  //   console.log(data)
  // })()
  

class Bot{
  CHAT_ID = -928293632;
  //BOT_TOKEN = "5993615271:AAEavGljVlSE9s4FB7TVSwEzK-Zwiu9ZRQ0"; //Minato
  BOT_TOKEN = "5542267435:AAGtcdeY1bZUqYhHY0xRpBf37i76h9kb34s";//Mina


    constructor(){
      console.log("Bot....");
      this.offset = 0;
      this.lastTimeSendMessage = 0;
    }

    sendMessage(message){
        (async () => {
            const data = await post('https://api.telegram.org/bot'+this.BOT_TOKEN+'/sendMessage', {
              chat_id: this.CHAT_ID,
                text: message
            })
          
            console.log(data)
          })()
    }

    getUpdates(){
      (async () => {
        console.log("this.offset", this.offset);
        const data = await post('https://api.telegram.org/bot'+this.BOT_TOKEN+'/getUpdates', {
          allowed_updates: ["message", "edited_channel_post"],
          offset: this.offset +1,
          timeout:3
        })
      
        console.log(JSON.stringify(data))
        if(data.result){
          data.result.forEach(item => {
            if(item.message.text){
              this.solveMessage(item.message);
            }
            if(this.offset < item.update_id){
              this.offset = item.update_id;
            }
          });
        }
      })()
    }

    solveMessage(item){
      console.log("solveMessage", JSON.stringify(item));
      let params = item.text.split(" ");
      let command = params[0];
      console.log(command);
      switch(command){
        case "/nghisang":
          {
            let date = new Date();
            let dateStr = date.toISOString().substring(0, 10);
            database.insertDatabase(item.from.username, dateStr, 1);
            break;

          }
        case "/tongketdimuon":{
          let result = database.getAllLateness();
          JSON.stringify("solveMessage", result);
          break;
        }

        case "/muon":
          {
            let result = database.insertLateness(item.from.username);
            break;
          }
        case "nghisang":
          break;

        case "nghichieu":
          break;
        case "nghifull":
          break;
        case "aidimuonhomnay":
          break;
      }
        
      
    }

    checkNewDay(){
      
    }

    sendRandomMessage(){
      let date = new Date();
      let day = date.getDay();
      let hour = date.getHours();      
      const minute = date.getMinutes();
      //console.log("sendRandomMessage %d %d", hour, minute);
      if((hour == 17 && minute == 30)
      || (hour == 8 && minute == 0)){
        if(this.lastTimeSendMessage < date.getTime() - 60 * 1000) {
          this.lastTimeSendMessage = date.getTime();
          const message = this.createMessage(day, hour);
          this.sendMessage(message);
        }
      }
    }

    createMessage(day, hour){
      switch (hour){
        case 8:
          {
            return "8h sáng rồi, chúc mọi người thứ "+day+" vui vẻ!";
          }
          case 17:
            {
              return "Chúc mọi người buổi tối vui vẻ!";
            }
      }
      return "Nice to meet you!";
    }
}

module.exports = Bot;