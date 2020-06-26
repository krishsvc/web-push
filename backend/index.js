const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const webpush = require('web-push')

const app = express()
app.use(cors())
app.use(bodyParser.json())

const port = 4000

app.get('/', (req, res) => res.send('Hello World!'))

const dummyDb = { subscription: null } //dummy in memory store

const saveToDatabase = async subscription => {
  // Since this is a demo app, I am going to save this in a dummy in memory store. Do not do this in your apps.
  // Here you should be writing your db logic to save it.
  dummyDb.subscription = subscription
  console.log("dummyDb.subscription : "+dummyDb.subscription);
}

// The new /save-subscription endpoint
app.post('/save-subscription', async (req, res) => {
  const subscription = req.body
  console.log("subscription : "+subscription)
  await saveToDatabase(subscription) //Method to save the subscription to Database
  res.json({ message: 'success' })
})

/*
/*

Public Key:
BBzuxZ-QKzL5OGmN_nQYQhQ6k9IqK4u80_mHhZRhALsst70YWebM0Hz3xH1wkX8EwvpeGBjmmZC4sr8tb61RuEI

Private Key:
UxtuB0pScSC8OnigIVb9UePrKNIEnECYjnEdRNQsscY
*/

const vapidKeys = {
  publicKey:
    'BPsNn0acRw-eozdax-A9TjVrB_yOk6sGA2N24dCCJWP7Ya7_-izLZ2e69s_5xJ9Ih8jW9G_UvYOc1CimYNA2QHI',
  privateKey: 'yeIgg3vy2rWDwVCLGLDWrpnTzC2K3JSQKGVgeZSKmak',
}

//setting our previously generated VAPID keys
webpush.setVapidDetails(
  'mailto:myuserid@email.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
)

//function to send the notification to the subscribed device
const sendNotification = (subscription, dataToSend) => {
  webpush.sendNotification(subscription, dataToSend)
}

//route to test send notification
app.get('/send-notification', (req, res) => {
  const subscription = dummyDb.subscription //get subscription from your databse here.
  //const message = 'Hello World'
  const message = JSON.stringify({
    body: "HEY! Take a look at this brand new tee",
    icon: "jason-leung-HM6TMmevbZQ-unsplash.jpg",
    vibrate: [200, 100, 200],
    tag: "new-product",
    image: "jason-leung-HM6TMmevbZQ-unsplash.jpg",
    badge: "https://spyna.it/icons/android-icon-192x192.png",
    data:{
      like: "https://www.google.com",
      reply:"https://www.yahoo.com"
    },
    actions: [{ action: "Detail", title: "View", icon: "https://via.placeholder.com/128/ff0000" }]
  })
  sendNotification(subscription, message)
  res.json({ message: 'message sent' })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))