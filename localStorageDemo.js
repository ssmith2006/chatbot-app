"use strict";

const message1 = {
  Shantel: "How are you today?",
  gemini: "I am good how are you?",
};
localStorage.setItem("messages", JSON.stringify(message1));
//sets the item

const myMessage = JSON.parse(localStorage.getItem("messages"));
//retrieves the storage
console.log(myMessage);


localStorage.removeItem("messages");
//this removes the messages from Local Storage

const removedMessage = localStorage.getItem("messages");
console.log(removedMessage); 
// Will output null because it has been removed


