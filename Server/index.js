// importing
const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require("body-parser");
const env = require('dotenv').config();
const Pusher = require('pusher')
const cors= require('cors')

const message = require("./model.js")

// app cofig
const app = express()
const port = process.env.PORT || 8000

const pusher = new Pusher({
    appId: "1336041",
    key: "e720df5cd5a5389d7366",
    secret: "3627f32bcfe3ae72b2b0",
    cluster: "eu",
    useTLS: true
});

// middlewares
app.use(express.json());
app.use(cors());
app.use(bodyparser.urlencoded({ extended: true }));


// database config
mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => { console.log("database connected") }).
    catch((err) => {
        console.log(err);
        process.exit(1);
    })
// const data = new message({ name: "sanjeev", message: "how are you?" });
// data.save().then((data) => {
//     console.log(data)
// }).catch((err)=>{})

const db = mongoose.connection;
db.once('open', async () => {
    const myCollection = db.collection('messages');
    const result = await myCollection.find({}).toArray();
    const changeStream = myCollection.watch();
    // console.log(changeStream)

    changeStream.on('change', (change) => {
        console.log("something changes",change)
        if (change.operationType === 'insert') {
            const messageDetail = change.fullDocument;


            pusher.trigger('message', 'inserted', {
                name: messageDetail.name,
                message: messageDetail.message,
                timestamp: messageDetail.timestamp,
                recieved: messageDetail.received
            })

        }
        else {
            console.log("Error triggring puhser..")
        }
    })


})


// app endpoints

app.get("/", (req, res) => {
    res.send('Welcome Guys!');
})

app.get("/message/sync", (req, res) => {
    message.find({}, (err, data) => {
        if (err) {
            res.status(500).send(err)
        }
        else {
            console.log("data is feched..")
            res.status(200).send(data)
        }
    })
})
// app.get("/message/sync",(req,res)=>{
//     message.find({}).then((data)=>{res.send(data)}).catch((err)=>{console.log(err)})});


app.post("/message/new", (req, res) => {
    const newMessage = req.body;
    message.create(newMessage, (err, data) => {
        if (err) {
            res.status(500).send("This is error", err)
        }
        else {
            res.status(201).send(`New Message created: \n ${data}`)

        }
    })
});



app.listen(port, () => {
    console.log(`port ${port} is listening...`)
});
