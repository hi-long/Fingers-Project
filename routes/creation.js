var express = require("express"),
	router = express.Router();

var Song = require("../models/song"),
	Post = require("../models/post"),
	Notification = require("../models/notification"),
	User = require("../models/user")

var multer = require('multer');
var storage = multer.diskStorage({
  filename: (req, file, callback) => {
    callback(null, Date.now() + file.originalname);
  }
});
var imageFilter =  (req, file, cb) => {
    // accept image files only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter})

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET
});

//--------------------//
//NEW POST router
//--------------------//
//Creation page
router.get('/', (req, res) => {
	res.render('post/index', {
		user: req.user
	});
});
//New product
router.get('/new', isSignedIn, (req, res) => {
	res.render('post/new', {
		user: req.user
	});
});

router.post('/new', isSignedIn, upload.single('image'), (req, res) => {
	cloudinary.v2.uploader.upload(req.file.path, async (err, result) => {
		try {
			const currentUser = req.user.populate('followings');
			const foundSong = await Song.findOne().sort({ _id: -1 });
			const createdPost = await Post.create(
				{
					user: req.user,
					description: req.body.description,
					song: foundSong,
					cover: result.secure_url,
					coverId: result.public_id
				}
			)
			req.user.posts.push(createdPost);
			req.user.save();
			const newNotification = await Notification.create({post : createdPost});
			currentUser.followings.forEach(async following => {
				const foundFollowing = await User.findById(following);
				foundFollowing.notifications.push(newNotification);
				foundFollowing.save();
			})
			req.flash('success', 'You have successfully uploaded your song ! :>');
			res.redirect('/' + req.user.id);
		}
		catch (err) {
			console.log(err);		
			req.flash('error', 'Some error has just happened :( , please try again !');
			res.redirect('/new');
		}
	})
});
//Song
router.get("/song/:id", async (req, res) => {
	try {
		const foundSong = await Song.findById(req.params.id);
		res.json(foundSong);
	}
	catch (err) {
		console.log(err);	
	}
})

router.post("/new/song", async (req, res) => {
	try {
		if(req.body.sounds.length == 0){
			req.flash('error', 'No song was recorded :(, please try again !');
			res.redirect("/");
		}
		const createdSong = await Song.create(
			{
				canvasSize: req.body.canvasSize,
				sounds: req.body.sounds,
				theme: req.body.theme,
				effects: req.body.effects,
				time: req.body.time	 
			}
		)
	}
	catch (err) {
		console.log(err);
	}
})

function isSignedIn (req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/signin');
}

module.exports = router;