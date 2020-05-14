var express = require('express'),
	passport = require('passport'),
	router = express.Router();

var User = require('../models/user');

var multer = require('multer');
var storage = multer.diskStorage({
	filename: (req, file, callback) => {
		callback(null, Date.now() + file.originalname);
	}
});
var imageFilter = (req, file, cb) => {
	// accept image files only
	if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
		return cb(new Error('Only image files are allowed!'), false);
	}
	cb(null, true);
};
var upload = multer({ storage: storage, fileFilter: imageFilter });

var cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: process.env.CLOUD_NAME, 
  api_key: process.env.API_KEY, 
  api_secret: process.env.API_SECRET
});

//--------------------//
// SETTING ROUTE
//--------------------//
router.get('/setting', isSignedIn, async (req, res) => {
	try {
		const currentAccount = await User.findById(req.user.id)
			.populate('notifications')
			.populate({
				path: 'notifications',
				populate: { path: 'post' }
			})
			.populate({
				path: 'notifications',
				populate: ({ 
					path: 'like comment',
					populate: { path: 'user'}
				})
			})
			.populate({
				path: 'notifications',
				populate: ({
					path: 'follow',
					populate: {path : 'from to'}
				})
			})
		let numberOfUnseenNotis = 0;
		for (let i = 0; i < currentAccount.notifications.length; i++) {
			if (currentAccount.notifications[i].seen == false) {
				numberOfUnseenNotis++;
			}
		}
		res.render('setting/index', {
			numberOfUnseenNotis: numberOfUnseenNotis,
			notifications: currentAccount.notifications,
			user: currentAccount
		});
	}
	catch (err) {
		console.log(err);
	}
});

router.put('/setting', isSignedIn, upload.single('image'), async (req, res) => {
	if (req.file) {
		try {
			await cloudinary.v2.uploader.destroy(req.user.coverId);
			const result = await cloudinary.v2.uploader.upload(req.file.path); 
			req.user.cover = result.secure_url;
			req.user.coverId = result.public_id;
		} catch (err) {
			req.flash("error", "Something wrong happened :(, please try again.")
			res.redirect("/setting");
			console.log(err);
		}
	}
	if(req.body.newNickname != ""){
		req.user.nickname = req.body.newNickname;
	}
	req.user.description = req.body.newDescription;
	req.user.save();
	req.flash('success', 'You have just successfully changed your profile information !');
	res.redirect('/' + req.user.id);
});

router.put('/setting/change/password', async (req, res) => {
	try {
		const newPassword = req.body.newPassword;
		req.user.changePassword(req.body.oldPassword, newPassword, function(err) {
			 if(err) {
				if(err.name === 'IncorrectPasswordError'){
				    req.flash('error', 'Can not change your password :<. Please check back, it might be wrongly typed	 !');
					res.redirect(`/setting`);// Return error
				}else {
				    res.json({ success: false, message: 'Something went wrong!! Please try again after sometimes.' });
				}
			} else {
				req.flash('success', 'You have just successfully changed your password !');
			  	res.redirect(`/${req.user.id}`);
			}
		})
	}
	catch (err) {
		console.log(err);
	}
})

function isSignedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/signin');
}

module.exports = router;