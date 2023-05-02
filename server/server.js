const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const logger = require('morgan');
const bcrypt = require('bcrypt')
// cross origin access 
const cors = require('cors');
const axios = require("axios");
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config()
//have a model
let accomodation = require('./models/accomodations');
let trip = require('./models/trip');
let User = require('./models/user');
const app = express();

// access
app.use(cors({
    origin: "*"
}));

// logs the different requests to our server
app.use(logger('dev'))

//parse stringified objects (JSON)
app.use(express.json())

// server build folder
app.use(express.static(path.join(__dirname, 'build')));

//remember to input user and pass variables
let connectionString =`mongodb+srv://${process.env.mongoUsername}:${process.env.mongoPassword}@mongosetupcluster.anqqbl8.mongodb.net/VacationSite?retryWrites=true&w=majority`
//mongoose requirements
mongoose.set('strictQuery', false);
//connect expresss to Mongo
mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.once('open', ()=> {
    console.log('connected to mongo');
});


const initializePassport = require('./config/passport-config.js')

//everything below is what a user needs to login
const store = MongoStore.create({
    mongoUrl: connectionString,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret: 'thisshouldbeabettersecret!'
    }
});
store.on("error", function(e){
    console.log("SESSION STORE ERROR", e)
})

app.use(session({
    store,
    name: "session",
    secure: true,
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 3600000,
        maxAge: 3600000 }
}))

// initialize Passport and session middleware
app.use(passport.initialize());
app.use(passport.session());
//everything a user needs to sign up
app.post('/users/signup',async (req, res) => {

    let hashedPassword = await bcrypt.hash(req.body.password, 10)

    // use User model to place user in the database
    let userFromCollection = await User.create({
        email: req.body.email,
        name: req.body.name,
        password: hashedPassword
    })

    // sending user response after creation or login
    res.json(`user created ${userFromCollection}`)
});

initializePassport(
    passport,
    // passport tells us that they want a function that will return the correct user given an email
    async email => {
        let user = User.findOne({email: email})
        return user;
    },
    async id => {
        let user = User.findById(id);
        return user;
    },
);





app.get('/session-info', (req, res) => {
    res.json({
        session: req.session
    });
});



app.post('/users/login', async (req, res, next) => {
    console.log(req.body);
    // passport authentication
    passport.authenticate("local", (err, user, message) => {
        console.log(message);
        if (err) throw err;
        if (!user) {
            res.json({
                message: "login failed",
                user: false
            })
        } else {
            // delete user.password
            req.logIn(user, err => {
                if (err) throw err;
                res.json(req.session)
            })
        }
    })(req, res, next);
})

app.get('/test_route', (req, res) => {
    res.send("good route!")
})


app.get('/search', async (req, res) => {
    let where = req.query.location.toLowerCase()
    let type = req.query.type
    let guests = req.query.guest
    //doing greater than the number the user inputs means they will get the amount of room needed for the amount of people coming
    let data = await accomodation.find({"city": where, "type": type, "max_guests": {$gt : guests}})
    console.log(data)
    res.send(data)
})
app.get('/single/:id', async (req, res) => {
    let id = req.params.id
    let data = await accomodation.findOne({"_id": id}) 
    console.log(data)
    res.send(data)
})
app.post('/create_trip', async (req, res) =>{
    const {tripName: tripName, names: names, date: date, summary: summary, emails: emails, id: id, price: price, userId: user} = req.body;
    console.log(tripName)
   
    let returnedValue = await trip.create({
        tripName,
        names,
        date,
        summary,
        emails,
        id,
        price,
        user
    })
    console.log(id)
    console.log(returnedValue);
    if (returnedValue) {
        console.log("upload complete");
    }
    //sending the returned value from the object we created
    res.send(returnedValue);
})

app.get('/get_trips/:user', async (req, res) => {
    let user = req.params.user
    let data = await trip.find({user: user})
    console.log(data)
    res.send(data)
})
app.delete('/delete/:id', async (req, res) => {
    let id = req.params.id
    console.log(id)
    let response = await trip.deleteOne({_id: id});
   console.log(response);
   res.send({data: `deleted ${response.deletedCount} items.`})
})
app.put('/update_trip/:id', async (req, res) => {
    console.log(req.params.id)
    //mongoose needs to be able to assign the variable to a property that matches it's schema.
    //so I just translated the keys to the properties of the schema on the front-end and input the 
    //req.body as an update. whats inside of req.body is an object holding the schema properties and their keys
    const {tripName: tripName} = req.body
    console.log(`this is your variable: ${tripName}`)
      
      const response = await trip.findOneAndUpdate({ _id:  req.params.id}, req.body, { new: true });
    console.log(response)
    res.send(response)
  });


app.post('/logout', function(req, res, next) {
    console.log(req);

    try {
        
    req.logout(function(err) {
    if (err) 
    { 
        return next(err); 
    }
  })
    } catch (error) {
         console.error(error);

    }
  res.json("logout successful");
  });

app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is Listening on port ${port}`)
});
