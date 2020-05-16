var express = require('express'),
	router = express.Router();

var User = require('../models/user');

router.get('/discovery', isSignedIn, async (req, res) => {
	try {
		const currentAccount = await User.findById(req.user).populate('notifications')
				.populate({
					path: 'notifications',
					populate: {
						path: 'post',
						populate: {
							path: 'user'
						}
					}
				})
				.populate({
					path: 'notifications',
					populate: {
						path: 'like',
						populate: {
							path: 'user'
						}
					}
				})
				.populate({
					path: 'notifications',
					populate: {
						path: 'comment',
						populate: {
							path: 'user'
						}
					}
				})
				.populate({
					path: 'notifications',
					populate: {
						path: 'follow',
						populate: {
							path: 'from to'
						}
					}
				})
				.populate('followings')
				.populate({
					path: 'followings',
					populate: {
						path: 'posts',
						populate: {
							path: 'comments likes song',
							populate: 'user'
						}
					}
				})
		let numberOfUnseenNotis = 0;
		for (let i = 0; i < currentAccount.notifications.length; i++) {
			if (currentAccount.notifications[i].seen == false) {
				numberOfUnseenNotis++;
			}
		}
		res.render('discovery/index', {
			numberOfUnseenNotis: numberOfUnseenNotis,
			notifications: currentAccount.notifications,
			user: currentAccount,
			followings: currentAccount.followings
		});
	}
	catch (err) {
		console.log(err);
	}
});

function isSignedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/signin');
}

module.exports = router;