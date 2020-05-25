/* eslint-disable handle-callback-err */
/* eslint-disable promise/no-nesting */
/* eslint-disable promise/always-return */
const functions = require("firebase-functions");
const app = require("express")();
const admin = require("firebase-admin");
const bodyParser = require("body-parser");
const serviceAccount = require("./avinashvidyarthi-5f9076cc9fd2.json");
const webPush = require("web-push");

webPush.setVapidDetails(
  "mailto:avinashvidyarthi@gmail.com",
  "BKrd_OpQgyPWKHmyyHshZvRCOVMum_wDI7z4zQ-ZWvcHljHhnxMc14ir7G8B96xTXPrCu9xHKiTkSvoudXQTgRo",
  "nU7KY-0jXCZ9693s52p27xqR69jhjJ3lcw49ypWG9C0"
);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://avinashvidyarthi.firebaseio.com",
});

let db = admin.firestore();

//header configuration
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type,Origin,X-Requested-With,Accept"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

app.get("/check", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/store-subs", (req, res) => {
  db.collection("subscription")
    .doc()
    .set(JSON.parse(req.body))
    .then((data) => {
      res.json({ status: "ok", msg: "subscribed" });
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get("/test-notification", (req, res) => {
  db.collection("subscription")
    .get()
    .then((subs) => {
      subs.forEach((s) => {
        var options = {
          endpoint: s.data().endpoint,
          keys: {
            auth: s.data().keys.auth,
            p256dh: s.data().keys.p256dh,
          },
        };
        webPush
          .sendNotification(
            options,
            JSON.stringify({
              title: "Test Notification!",
              content: "This is a test notification",
              url: "https://avinashvidyarthi.github.io"
            })
          )
          .then((d) => {
            res.json({ status: "ok", msg: d });
          })
          .catch((err) => {
            // console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});


app.get('/no-of-subs',(req,res)=>{
db.collection("subscription").get().then((subs)=>{
  res.json({length:subs.length});
}).catch(()=>{res.json({error:true});});
})

app.post("/notify",(req,res)=>{
    db.collection("subscription")
    .get()
    .then((subs) => {
      subs.forEach((s) => {
        var options = {
          endpoint: s.data().endpoint,
          keys: {
            auth: s.data().keys.auth,
            p256dh: s.data().keys.p256dh,
          },
        };
        webPush
          .sendNotification(
            options,
            JSON.stringify({
              title: req.body.title,
              content: req.body.content,
              url: req.body.link,
              image:req.body.img_link==="" || req.body.img_link===null?null:req.body.img_link
            })
          )
          .then((d) => {
            res.json({ status: "ok", msg: d });
          })
          .catch((err) => {
            // console.log(err);
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
})

exports.app = functions.https.onRequest(app);
