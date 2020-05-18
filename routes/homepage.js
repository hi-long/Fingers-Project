var express = require('express'),
	router = express.Router();

var User = require('../models/user'),
	Notification = require('../models/notification'),
	Follow = require('../models/follow');

//--------------------//
// HOMEPAGE ROUTE
//--------------------//

router.get('/:id', isSignedIn, async (req, res) => {
	try {
		const currentAccount_toGetFollowedBack =  await User.findById(req.user.id);
		const followedBack = currentAccount_toGetFollowedBack.followings.filter(user => currentAccount_toGetFollowedBack.followers.includes(user)); 
		const currentAccount = await User.findById(req.user.id)
			.populate('posts')
			.populate({
				path: 'followers',
				populate: { path: 'user' }
			})
			.populate('notifications')
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
					path: 'like comment follow',
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
		let numberOfUnseenNotis = 0;
		for (let i = 0; i < currentAccount.notifications.length; i++) {
			if (currentAccount.notifications[i].seen == false) {
				numberOfUnseenNotis++;
			}
		}
		if (req.params.id != req.user.id) {
			const foundUser = await User.findById(req.params.id)
				.populate('posts')
				.populate({
					path: 'followers',
					populate: { path: 'user' }
				})
			let followed = false;
			if (currentAccount.followings.indexOf(req.params.id) >= 0) {
				followed = true;
			}
			res.render('account/home', {
				followed: followed,
				followedBack: followedBack,
				numberOfUnseenNotis: numberOfUnseenNotis,
				notifications: currentAccount.notifications,
				currentUser: foundUser,
				user: currentAccount
			});
		} else {
			res.render('account/home', {
				followed: true,
				followedBack: followedBack,
				numberOfUnseenNotis: numberOfUnseenNotis,
				notifications: currentAccount.notifications,
				currentUser: currentAccount,
				user: currentAccount
			});
		}	
	}
	catch (err) {
		console.log(err);
	}
});

router.put('/:id', isSignedIn, async (req, res) => {
	try {
		const foundUser = await User.findById(req.params.id)
		if(req.body.followed == false) {
			const createdFollow = await Follow.create({from: req.user, to: foundUser});
			const createdNotification = await Notification.create({follow: createdFollow});
			foundUser.notifications.push(createdNotification);
			req.user.followings.push(foundUser);
			req.user.save();
			foundUser.followers.push(req.user);
			foundUser.save();
		} else if (req.body.followed == true) {
			const foundFollow = await Follow.find({from: req.user.id, to: foundUser.id});
			const deletedNotification = await Notification.findOneAndDelete({follow: foundFollow.id});
			if(deletedNotification != null){
				foundUser.notifications.splice(foundUser.notifications.indexOf(deletedNotification.id), 1);
				req.user.followings.splice(req.user.followings.indexOf(foundUser), 1);
				req.user.save();
				foundUser.followers.splice(foundUser.followers.indexOf(req.user.id), 1);
				foundUser.save();
			}
		}
		res.send('Ok ;)');
	}
	catch (err) {
		console.log(err);
	}
});

router.put('/noti/:id', isSignedIn, async (req, res) => {
	try {
		const foundNoti = await Notification.findByIdAndUpdate(req.params.id,
			{
				seen: true
			})
		res.json(foundNoti);
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