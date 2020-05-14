require('dotenv').config();

const 	bodyParser = require('body-parser'),
		methodOverride = require('method-override'),
		expressSanitizer = require('express-sanitizer'),
		mongoose = require('mongoose'),
		express = require('express'),
		passport = require('passport'),
		axios = require('axios'),
		LocalStrategy = require('passport-local'),
		flash = require('connect-flash'),
	  	User = require('./models/user'),
		Notification = require('./models/notification'),
		Post = require('./models/post'),
		Song = require('./models/song'),
		Comment = require('./models/comment'),
		Like = require('./models/like'),
		app = express();

var 	authRoutes = require("./routes/index"),
		creationRoutes = require("./routes/creation"),
		homepageRoutes = require("./routes/homepage"),
		discoveryRoutes = require("./routes/discovery"),
		settingRoutes = require("./routes/setting"),
		postRoutes = require("./routes/posts"),
		searchingRoutes = require("./routes/searching")
		

//--------------------//
// APP CONFIG
//--------------------//
// mongoose.connect('mongodb://localhost/fingers_data', {
// 	useNewUrlParser: true,
// 	useUnifiedTopology: true
// });

mongoose.connect(`mongodb+srv://Lof_TheCreater:${process.env.MONGO_ATLAS_PASSWORD}@fingers-iwbbc.mongodb.net/test?retryWrites=true&w=majority`, {
	useNewUrlParser: true,
	useUnifiedTopology: true
})

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(expressSanitizer());
app.use(methodOverride('_method'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());

//--------------------//
//PASSPORT CONFIG
//--------------------//
app.use(
	require('express-session')({
		secret: 'This app is all about your fingers!',
		resave: false,
		saveUninitialized: false
	})
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.failureMessage = req.flash('error');
	res.locals.successMessage = req.flash('success');
	next();
});

app.use(authRoutes);
app.use(creationRoutes);
app.use(discoveryRoutes);
app.use("/post/:id", postRoutes);
app.use(settingRoutes);
app.use(searchingRoutes);
app.use(homepageRoutes);

//--------------------//
// NOT FOUND
//--------------------//
app.get('*', function(req, res) {
	res.send('You are lost :(, please get back');
});

app.listen(process.env.PORT, process.env.IP, function() {
	console.log('The app is onnnn !');
});