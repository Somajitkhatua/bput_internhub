require("dotenv").config();
const express = require("express");
const mongoose = require('mongoose');
const app = express();

const port = process.env.PORT || 5000;

app.get("/login" ,(req,res)=>{
    res.send("User registered successfully!");
});
app.get("/" ,(req,res)=>{
    res.send("Hi I am root");
});

main()
.then(()=>{
    console.log("DB connected successfully");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
};
app.listen(port , ()=>{
    console.log(`server is listening on port ${port}`);
});