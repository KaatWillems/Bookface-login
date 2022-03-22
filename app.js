const express = require('express');
const router = express.Router();
const app = express();
const mongoose = require('mongoose');
const expressEjsLayout = require('express-ejs-layouts')
const dotenv = require('dotenv'); //added mongodb
dotenv.config(); //added for mongodb 
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

require('./config/passport')(passport)

// mongoose
mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser: true, useUnifiedTopology : true})
.then(() => console.log('connected to DB'))
.catch((err)=> console.log(err));

//---added for mongo db
//const mongoose = require("mongoose");
//connection to db 
//mongoose.set("useFindAndModify", false);
// mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true }, () => {
// console.log("Connected to db!");
// app.listen(3000, () => console.log("Server Up and running"));
// });

//EJS
app.use('/static', express.static('public'));

app.set('view engine','ejs');
app.use(expressEjsLayout);
//BodyParser
app.use(express.urlencoded({extended : false}));
//express session
app.use(session({
    secret : 'secret',
    resave : true,
    saveUninitialized : true
   }));
   //use flash
   app.use(passport.initialize());
    app.use(passport.session());
   app.use(flash());
   app.use((req,res,next)=> {
     res.locals.success_msg = req.flash('success_msg');
     res.locals.error_msg = req.flash('error_msg');
     res.locals.error  = req.flash('error');
   next();
   })
//Routes
app.use('/',require('./routes/index'));
app.use('/users',require('./routes/users'));

app.listen(process.env.PORT || 3000);
