const express = require('express');
const bodyparser = require('body-parser');
var cors = require('cors');
const app = express();
const MongoClient = require('mongodb');
const url ='mongodb+srv://ramyabtech19:jaisriram@ecomdb-t8ic5.mongodb.net/test?retryWrites=true&w=majority';

app.set('PORT',process.env.PORT)

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

    //console.log(req.params.url)
    MongoClient.connect(url, (err, client) => {
        if (err) return console.log(err);
        var db = client.db("urlDB");
        db.collection('links').findOne({shortURL:req.params.url},function(err,data){
            if (err) throw err;
            db.collection('links').findOneAndUpdate({ shortURL: req.params.url}, { $inc: { clickCount: +1 } }, function (err, data) {
                if (err) throw err;
                client.close();
                console.log(data)
                res.redirect(data.value.longURL)
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
app.delete('/delete/:url', function (req, res) {
    console.log(req.params.url)
    MongoClient.connect(url, (err, client) => {
        if (err) return console.log(err);
        var db = client.db("urlDB");

        db.collection('links').deleteOne({ shortURL: req.params.url }, function (err, data) {
            if (err) throw err;
            client.close();
            res.json({
                message: "Deleted Successfully"
            })
        })
    })

})

app.listen(app.get('PORT'), function () {
    console.log(app.get('PORT'))
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
