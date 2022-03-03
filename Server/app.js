const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require("body-parser");
const env = require('dotenv').config();

const message = require("./model.js")

const app = express()
const port = process.env.PORT || 5000;

app.use(express.json);
app.use(bodyparser.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => { console.log("database connected") }).
    catch((err) => {
        console.log(err);
        // process.exit(1);
    })

// const data = new message({ name: "sanjeev", message: "how are you?" });
// data.save().then((data) => {
//     console.log(data)
// })

app.get("/",(req,res)=>{
    res.send("ok")
})

app.listen(port, () => {
    console.log(`port ${port} is listening...`)
})
