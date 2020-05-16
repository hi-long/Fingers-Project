var express = require("express"),
	router = express.Router({mergeParams: true});

var Post = require("../models/post"),
	Like = require("../models/like"),
	Comment = require("../models/comment"),
	Song = require("../models/song"),
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
// POST ROUTE
//--------------------//
router.get('/', isSignedIn, async (req, res) => {
	try {
		const foundPost = await Post.findById(req.params.id)
			.populate("user")
			.populate("song")
			.populate('comments')
			.populate({
				path: 'comments',
				populate: { path: 'user' }
			})
			.populate({
				path: 'likes',
				populate: { path: 'user' }
			})
		let likesOfThePost = foundPost.likes
		let thisUserliked = false;
		for(let i = 0; i < likesOfThePost.length; i ++){
			if(likesOfThePost[i].user.id == req.user.id){
				thisUserliked = true;
				break;
			}
		}
		res.render('post/show', {
			liked: thisUserliked,
			post: foundPost,
			song: foundPost.song,
			user: req.user
		});
	}
	catch (err) {
		console.log(err);
	}
});

router.get('/edit', isSignedIn, async (req, res) => {
	try {
		const foundPost = await Post.findById(req.params.id);
		if(req.user.id == foundPost.user){
			res.render('post/edit', {
				user: req.user,
				post: foundPost
			});
		} else {
			res.redirect("/notfound");
		}
	}
	catch (err) {
		console.log(err);
	}
});

router.get('/next', isSignedIn, async (req, res) => {
	try {
		const currentPostId = req.params.id;
		const currentPostPosition = req.user.posts.indexOf(currentPostId); 
		if(currentPostPosition == req.user.posts.length - 1){
			return res.send(req.user.posts[0]);
		} else {
			return res.send(req.user.posts[currentPostPosition + 1])
		}
	}
	catch (err) {
		console.log(err);
	}
})

router.get('/previous', isSignedIn, async (req, res) => {
	try {
		const currentPostId = req.params.id;
		const currentPostPosition = req.user.posts.indexOf(currentPostId); 
		if(currentPostPosition == 0){
			res.send(req.user.posts[req.user.posts.length - 1]);
		} else {
			res.send(req.user.posts[currentPostPosition - 1])
		}
	}
	catch (err) {
		console.log(err);
	}
})

router.get('/check/like', isSignedIn, async (req, res) => {
	try {
		const foundPost = Post.findById(req.params.id).populate("likes");
		let result = false;
		foundPost.likes.forEach((like) => {
			if(like.user == req.user.id){
				result = true;
			}
		})
		res.send(result);
	}
	catch(err) {
		console.log(err);
	}
})

router.post('/new/like', isSignedIn, async (req, res) => {
	try {
		const foundPost = await Post.findById(req.params.id).populate("likes", "user").populate("user", "notifications");
		let likesOfThePost = foundPost.likes,
			thisUserliked = false,
			likeId;
		for(let i = 0; i < likesOfThePost.length; i ++){
			if(likesOfThePost[i].user == req.user.id){
				thisUserliked = true;
				likeId = likesOfThePost[i];
				break;
			}
		}
		if(!thisUserliked){
			if(!thisUserliked){
				const newLike = await Like.create({user: req.user});
				foundPost.likes.push(newLike);
				foundPost.save();
				const foundUser = await User.findById(foundPost.user);
				if(foundUser.id != req.user.id) {
					const newNotification = await Notification.create(
					{
						post: foundPost,
						like: newLike,
						seen: false
					})
					foundUser.notifications.push(newNotification);
					foundUser.save();
				}
				res.json(newLike);
			}
		} else {				
			const foundNotification = await Notification.findOneAndDelete({like: likeId._id});
			foundPost.user.notifications.splice(foundPost.user.notifications.indexOf(foundNotification), 1);
			foundPost.likes.splice(likesOfThePost.indexOf(req.user.id), 1);	
			foundPost.save();
			res.send("liked");
		}
	}
	catch (err) {
		console.log(err);
	}
});

router.post('/new/comment', isSignedIn, async (req, res) => {
	try {
		const foundPost = await Post.findById(req.params.id);
		var comment = req.body.content;
		if (comment != null) {
			const newComment = await Comment.create(
				{
					content: comment,
					user: req.user
				})
			const foundUser = await User.findById(foundPost.user);
			if(foundUser.id != req.user.id) {
				const newNotification = await Notification.create(
				{
					post: foundPost,
					comment: newComment,
					seen: false
				})
				foundUser.notifications.push(newNotification);
				foundUser.save();
			}
			foundPost.comments.push(newComment);
			foundPost.save();
			res.json(newComment);
		}
	}
	catch (err) {
		console.log(err);
	}
})

router.put('/edit', isSignedIn, upload.single('image'), (req, res) => {
	Post.findById(req.params.id, async (err, foundPost) => {
		if (req.file) {
        	try {
				await cloudinary.v2.uploader.destroy(foundPost.coverId);
                var result = await cloudinary.v2.uploader.upload(req.file.path);
				foundPost.coverId = result.public_id;
                foundPost.cover = result.secure_url;
            } catch(err) {
                console.log(err);
            }
        }
        foundPost.description = req.body.newDescription;
		foundPost.save();
		req.flash("success", "Your post has successfully been changed !")
        res.redirect("/post/" + foundPost.id);
	})
})

router.delete('/delete', isSignedIn, async (req, res) => {
	try {
		const deletedPost = await Post.findByIdAndRemove(req.params.id);
		deletedPost.comments.forEach((comment) => {
			Comment.findByIdAndRemove(comment.id, (err) => {});
		});
		deletedPost.likes.forEach((like) => {
			Like.findByIdAndRemove(like.id, (err) => {});
		});
		req.user.posts.splice(req.user.posts.indexOf(req.params.id), 1);
		req.user.save();
		res.redirect('/' + req.user.id);
	}
	catch (err) {
		console.log(err);
	}
});

router.delete('/comment/:commentId/delete', isSignedIn, async (req, res) => {
	try {
		const foundPost = await Post.findById(req.params.id);
		const deletedComment = await Comment.findByIdAndRemove(req.params.commentId);
		const deletedNotification = await Notification.findOneAndDelete({comment: deletedComment});
		foundPost.comments.splice(foundPost.comments.indexOf(deletedComment), 1);
		if(deletedNotification != null && deletedNotification != undefined && foundPost.user.notifications != undefined) {
			foundPost.user.notifications.splice(foundPost.user.notifications.indexOf(deletedNotification), 1);
			foundPost.user.save();
		}
		foundPost.save();
		res.send("Deleted !");
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