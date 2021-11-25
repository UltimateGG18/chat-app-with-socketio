const express = require("express");
const mongoose = require('mongoose');
const session = require('express-session');  // session middleware
const passport = require('passport');  // authentication
const connectEnsureLogin = require('connect-ensure-login');// authorization
LocalStrategy = require('passport-local').Strategy;

const User = require('./model/user');

const app = express()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

app.use(express.static(__dirname + '/public'))

// Configure Sessions Middleware
app.use(session({
    secret: 'r8q,+&1LM3)CD*zAGpx1xm{NeQhc;#',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 } // 1 hour
}));

// Configure Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());

// Passport Local Strategy
passport.use(new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password'
    },
    // function of username, password, done(callback)
    function (username, password, done) {
        // look for the user data
        User.findOne({ email: username }, function (err, user) {
            // if there is an error
            if (err) { return done(err); }
            // if user doesn't exist
            if (!user) { return done(null, false, { message: 'User not found.' }); }
            // if the password isn't correct
            if (user.password !== password) {
                return done(null, false, {
                    message: 'Invalid password.'
                });
            }
            // if the user is properly authenticated
            return done(null, user);
        });
    }
));

// To use with sessions
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

var ChatUserMessageDetails
//socket

//console.log(io)
io.on('connection', (socket) => {
    console.log("connected..")
    //console.log(socket)

    socket.on('message', (msg) => {
        // console.log(msg)
        socket.broadcast.emit('message', msg)
        ChatUserMessageDetails = msg
        console.log("ChatUserMessageDetails : ", ChatUserMessageDetails)
    })

    // socket.on('jsonData', (jsonData) => {
    //     console.log('jsonData', jsonData)
    // })

    socket.on('disconnect', () => {
        console.log('disconnected..')
    })
})

// Route to Login
app.get("/login", (req, res) => {
    res.sendFile(__dirname + '/login.html')
})

// Route to Secret Page
app.get('/chat', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    res.sendFile(__dirname + '/chat.html');
});

// Route to Log out
app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/login');
});

// Post Route: /login
app.post('/login', passport.authenticate('local', { failureRedirect: '/' }), function (req, res) {
    console.log(req.user)
    res.status(200).json({ user: req.user })
});

//to store messages in database
app.post('/saveMessage', (req, res) => {
    User.findOneAndUpdate(
        { email: ChatUserMessageDetails.email },
        {
            $push: {
                messages: ChatUserMessageDetails
            }
        }
    ).then(response => {
        res.status(200).json({ message: "message inserted successfully", user: response })
    }).catch(err => {
        console.log(err)
    })
})


const PORT = 3030

// connect to database
mongoose.connect('mongodb+srv://gauravgaonkar:gauravgaonkar@cluster0.dfdws.mongodb.net/Mango?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    http.listen(PORT, () => console.log(`This app is listening on port ${PORT}`));
})

