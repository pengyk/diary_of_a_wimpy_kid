// const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://conuhack-bd4ec.firebaseio.com'
  });
const express = require("express");
const bodyParser = require("body-parser");
const pino = require("express-pino-logger")();
const ToneAnalyzerV3 = require("ibm-watson/tone-analyzer/v3");
const { IamAuthenticator } = require("ibm-watson/auth");


const toneAnalyzer = new ToneAnalyzerV3({
  version: "2017-09-21",
  authenticator: new IamAuthenticator({
    apikey: "GhuzTtVpJUMEVbTJh8El5j6qyfBuaVeydABV8ZzVy3Fj"
  }),
  url:
    "https://api.us-south.tone-analyzer.watson.cloud.ibm.com/instances/a0109bb1-4ddf-4296-9242-bec071a24616"
});

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);

app.get("/api/greeting", (req, res) => {
  const text = req.query.text;

  const toneParams = {
    toneInput: { text: text },
    contentType: "application/json"
  };

  //   let test = {}

  toneAnalyzer
    .tone(toneParams)
    .then(toneAnalysis => {
      // test = toneAnalysis.result;
      // parse toneAnalysis.result
      let second = toneAnalysis.result["document_tone"];
      let list_obj = second["tones"];
      let obj = new Object();
      let cloned = new Object();

      let arr = new Array(); //store all cleaned up data

      for (let i = 0; i < list_obj.length; i++) {
        obj = list_obj[i];
        cloned = Object.assign({}, obj);
        delete cloned["tone_id"];
        arr.push(cloned);
      }

      arr.sort(function(a, b) {
        return b["score"] - a["score"];
      });
      // send relevant data to firebase
      var db = admin.database().ref("items");

      var query = db
        .orderByChild("uuid")
        .equalTo(req.query.uuid);
      query.once("child_added", function(snapshot) {
        snapshot.ref.update({ moods: arr });
      });
    })
    .catch(err => {
      console.log("error:", err);
    });
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify({ status: "success" }));
});

app.listen(3001, () =>
  console.log("Express server is running on localhost:3001")
);
