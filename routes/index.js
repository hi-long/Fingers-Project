var express = require('express'),
	router = express.Router(),
	passport = require('passport'),
	async = require('async'),
	nodemailer = require('nodemailer'),
	crypto = require('crypto');

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
//AUTHE ROUTE
//--------------------//
//Sign in
router.get('/signin', (req, res) => {
	res.render('account/signIn');
});

router.post('/signin', passport.authenticate('local', {
		failureFlash: true,
		failureRedirect: '/login'
	}), (req, res) => {
		req.flash('success', `Welcome back, ${req.user.nickname}. Stay home, stay safe, stay in shape and be legendary !`);
		res.redirect(`/${req.user.id}`);
	}
);
// Sign up
router.get('/signup', (req, res) => {
	res.render('account/signUp');
});

router.post('/signup', async (req, res) => {
	try {
		const newUser = await User.register({ username: req.body.username }, req.body.password);
		passport.authenticate('local')(req, res, () => {
			res.redirect(`/${req.user.id}/info`);
		});
	} catch (err) {
		console.log(err);
		req.flash('error', 'We failed to sign you up :(');
		return res.render('account/signUp');
	}
});
//Log out
router.get('/logout', isSignedIn, (req, res) => {
	req.logout();
	req.flash('success', 'You were successfully logged out !')
	res.redirect('/');
});
//User input info
router.get('/:id/info', isSignedIn, async (req, res) => {
	try {
		const foundUser = await User.findById(req.params.id);
		res.render('account/new', { user: foundUser });
	} catch (err) {
		console.log(err);
	}
});

router.put('/:id/info', isSignedIn, upload.single('image'), (req, res) => {
	if (req.file) {
		cloudinary.v2.uploader.upload(req.file.path, async (err, result) => {
			try {
				const foundUser = await User.findByIdAndUpdate(req.params.id, {
					nickname: req.body.nickname,
					description: req.body.description,
					cover: result.secure_url,
					coverId: result.public_id
				});
				foundUser.save();
				req.flash('success', `Welcome to Fingers, ${req.user.nickname} stay home, and be legendary!`);
				res.redirect('/' + req.user.id);
			} catch (err) {
				console.log(err);
			}
		});
	}
});

router.get('/check/nickname/:nickname', async (req, res) => {
	try {
		const newNickname = req.params.nickname;
		const foundUser = await User.find({ nickname: req.params.nickname }, 'nickname');
		console.log(foundUser.length);
		if (foundUser.length == 0) {
			res.send('valid');
		} else {
			res.send('invalid');
		}
	} catch (err) {
		console.log(err);
	}
});

router.get('/check/email/:email', async (req, res) => {
	try {
		const newEmail = req.params.email;
		const foundUser = await User.find({ username: newEmail }, 'username');
		console.log(foundUser.length);
		if (foundUser.length == 0) {
			res.send('valid');
		} else {
			res.send('invalid');
		}
	} catch (err) {
		console.log(err);
	}
});

// FORGOT PASSWORD
router.get('/forgot', (req, res) => {
	res.render('account/forgotPassword.ejs');
});

router.post('/forgot', function(req, res, next) {
	async.waterfall(
		[
			function(done) {
				crypto.randomBytes(20, function(err, buf) {
					var token = buf.toString('hex');
					done(err, token);
				});
			},
			function(token, done) {
				User.findOne({ username: req.body.email }, function(err, user) {
					if (!user) {
						req.flash('error', 'No account with that email address exists.');
						return res.redirect('/forgotPassword');
					}

					user.resetPasswordToken = token;
					user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

					user.save(function(err) {
						done(err, token, user);
					});
				});
			},
			function(token, user, done) {
				var smtpTransport = nodemailer.createTransport({
					service: 'Gmail',
					auth: {
						user: process.env.MY_GMAIL,
						pass: process.env.MY_GMAIL_PASSWORD
					}
				});
				var mailOptions = {
					to: user.username,
					from: process.env.MY_GMAIL,
					subject: 'Fingers Password Reset',
					text:
						'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
						'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
						'http://' +
						req.headers.host +
						'/resetPassword/' +
						token +
						'\n\n' +
						'If you did not request this, please ignore this email and your password will remain unchanged.\n'
				};
				smtpTransport.sendMail(mailOptions, function(err) {
					req.flash(
						'success', 'An e-mail has been sent to ' + user.username + ' with further instructions.'
					);
					done(err, 'done');
				});
			}
		],
		function(err) {
			if (err) return next(err);
			req.flash("Some failures happened :(, please try again.");
			res.redirect('/forgotPassword');
		}
	);
});

router.get('/resetPassword/:token', function(req, res) {
	User.findOne(
		{ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } },
		function(err, user) {
			if (!user) {
				req.flash('error', 'Password reset token is invalid or has expired.');
				return res.redirect('/forgotPassword');
			}
			res.render('account/resetPassword', { token: req.params.token });
		}
	);
});

router.post('/resetPassword/:token', (req, res) => {
	async.waterfall(
		[
			function(done) {
				User.findOne(
					{
						resetPasswordToken: req.params.token,
						resetPasswordExpires: { $gt: Date.now() }
					},
					function(err, user) {
						if (!user) {
							req.flash('error', 'Password reset token is invalid or has expired.');
							return res.redirect('/resetPassword');
						}
						if (req.body.password === req.body.confirm) {
							user.setPassword(req.body.password, function(err) {
								user.resetPasswordToken = undefined;
								user.resetPasswordExpires = undefined;

								user.save(function(err) {
									req.logIn(user, function(err) {
										done(err, user);
									});
								});
							});
						} else {
							req.flash('error', 'Passwords do not match.');
							return res.redirect('/reset');
						}
					}
				);
			},
			function(user, done) {
				var smtpTransport = nodemailer.createTransport({
					service: 'gmail',
					auth: {
						user: process.env.MY_GMAIL,
						pass: process.env.MY_GMAIL_PASSWORD
					}
				});
				var mailOptions = {
					to: user.username,
					from: 'learntocodeinfo@mail.com',
					subject: 'Your password has been changed',
					text:
						'Hello,\n\n' +
						'This is a confirmation that the password for your account ' +
						user.username +
						' has just been changed.\n'
				};
				smtpTransport.sendMail(mailOptions, function(err) {
					req.flash('success', 'Success! Your password has been changed.');
					done(err);
				});
			}
		],
		function(err) {
			res.redirect('/signin');
		}
	);
});

function isSignedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/signin');
}

module.exports = router;