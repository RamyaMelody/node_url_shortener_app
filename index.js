const express = require('express');
const bodyparser = require('body-parser');
var cors = require('cors');
const app = express();
const MongoClient = require('mongodb');
const url = 'mongodb://localhost:27017';

app.use(cors());


app.use(bodyparser.json()) //middle ware 


app.get('/view', function (req, res) {
    MongoClient.connect(url, (err, client) => {
        if (err) return console.log(err);
        var db = client.db("urlDB");
        var urlLink = db.collection('links').find().toArray();
        urlLink
            .then(function (data) {
                client.close();
                res.json(data);
            })
            .catch(function (err) {
                client.close();
                res.status(500).json({
                    message: "error"
                })
            })

    })
});

app.get('/geturl/:url', function(req,res){

    console.log(req.params.url)
    MongoClient.connect(url, (err, client) => {
        if (err) return console.log(err);
        var db = client.db("urlDB");
        db.collection('links').findOne({shortURL:req.params.url},function(err,data){
            if (err) throw err;
            client.close();

            res.json({
                message: "success",
                data:data
            })
        })

    })

})

app.post('/create', function (req, res) {
    console.log(req.body);
    console.log(genShortUrl());
    MongoClient.connect(url, (err, client) => {
        if (err) return console.log(err);

        var db = client.db("urlDB");
        db.collection('links').insertOne({ longURL: req.body.longURL, shortURL: genShortUrl() }, (err, result) => {
            if (err) throw err;
            client.close();

            res.json({
                message: "success"
            })
        })

    })

})

app.listen(3000, function () {
    console.log("port is running")
});

function genShortUrl() {
    var result = "";
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charLen = characters.length;

    for (var i = 0; i < 5; i++) {
        result += characters.charAt(
            Math.floor(Math.random() * charLen)
        );
    }
    //console.log(result);
    return result;
}