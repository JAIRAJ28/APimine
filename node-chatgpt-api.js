var cors = require('cors')
const { Configuration, OpenAIApi } = require("openai");
const readlineSync = require("readline-sync");
require("dotenv").config();

const express = require("express");
const app=express();
app.use(cors())


app.use(express.json())


  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

 const history =[]
app.get("/api/chats",async(req,res)=>{
    const {user_input}=req.query
    console.log(user_input)

    const messages = [];
    for (const [input_text, completion_text] of history) {
      messages.push({ role: "user", content: input_text });
      messages.push({ role: "assistant", content: completion_text });
    }
    console.log("HELLO")
    messages.push({ role: "user", content:`Crack a joke on ${user_input}` });

    try {
      const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: messages,
      });

      const completion_text = completion.data.choices[0].message.content;
      console.log(completion_text);
      
      history.push([user_input, completion_text]);

       return(res.status(200).send({completion_text}))
      
   

    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
    }
})

app.listen(process.env.Port,()=>{
    console.log("connected")
})


