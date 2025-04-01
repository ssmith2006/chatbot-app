"use strict";

const chatHistoryDiv = document.getElementById("chatHistory"); //id from HTML from DIV
const userInput = document.getElementById("userInput"); //id from input form in HTML
const SndBtn = document.getElementById("send"); //id from buttom in HTML
const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || []; //this is to pull the chat history for the App

function addToStorage(sender, text) {
  //this is the storage function for the Chat History with Gabe
  chatHistory.push({ sender, text }); //put into array

  if (chatHistory.length > 5) {
    //under 5 messages
    chatHistory.shift(); //removes the oldest item
  } else {
    renderNewMessage(sender, text);
  }
  localStorage.setItem("chatHistory", JSON.stringify(chatHistory)); //saves chat history
}

function renderNewMessage(sender, text) {
  //sender will be the user.
  chatHistoryDiv.innerHTML += `<p>${sender}: ${text}</p>`;
}

async function fetchApiKey() {
  const config = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: "1234567" }),
  };
  try {
    const res = await fetch(
      "https://proxy-key-eb0j.onrender.com/get-key",
      config
    );
    if (res.status != 200) {
      throw new Error("Could not get key");
    }
    const data = await res.json();
    console.log(data); //only change to const key=JSON.parse(data.key) if you have multiple keys.
    return data.key; //change to return key.gemini if you have multiple keys in Render.com
  } catch (error) {
    console.error(error);
    return null; //returns null if fetch fails
  }
}

// async function testTheCode() {
//   const key = await fetchApiKey();
//   console.log(key);
// }
// testTheCode();

async function sendMessageToGemini(userMessage) {
  //This gets the chatbot rolling
  try {
    const key = await fetchApiKey();
    if (!key) {
      //If no key = !key
      renderNewMessage("Error, No API Key"); //Error Handling
      throw new Error("No API Key");
    }
    const instructions =
      "| Your name is Gabe 2.0. Everything between the pipes are instructions from the website you are being used on.  Keep responses clear but thorough. Responses are being pushed to the DOM.  Use only the english language to answer questions.  Do not use markdown syntax. When asked your name, respond 'My name is Gabe 2.0.'  |";
    const config = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text:
                  userMessage +
                  instructions +
                  "After this line is our conversation history:" +
                  chatHistory,
              },
            ],
          },
        ],
      }),
    };
    const url =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=";
    const res = await fetch(url + key, config);
    if (res.status != 200) {
      throw new Error("Could not talk to Gemini for some reason");
    }
    const data = await res.json();
    console.log(data);
    renderNewMessage("Robot", data.candidates[0].content.parts[0].text); //drill data (figure out nested objects)
  } catch (error) {
    console.error(error); //catch the error
  }
}

// sendMessageToGemini(""); //start talking to the robot

SndBtn.addEventListener("click", () => {
  const message = userInput.value.trim();
  console.log(message)
  if (message) 
  {
    
    renderNewMessage("Shantel", message);
    userInput.value = "";
    sendMessageToGemini(message);
    addToStorage("Shantel", message);
  }
});
