var express = require('express'),
	router = express.Router();

var User = require('../models/user'),
	Post = require("../models/post");

router.get('/discovery', isSignedIn, async (req, res) => {
	try {
		// FRIEND SUGGESTIONS		
		const count = await User.estimatedDocumentCount();
		let suggestions = [];
		for(let i = 0; i < 3; i ++) {
			const random = Math.floor(Math.random() * count)
			User.findOne().skip(random).exec(
				 function (err, result) {
			  // Tada! random user
					 suggestions.push(result);
				})
		}
		
		const hottestPostsBasedOnLikes = await Post.find().sort({"likes":-1}).limit(5);
		const hottestPostsBasedOnComments = await Post.find().sort({"comments":-1}).limit(5);
		
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
			suggestions: suggestions,
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