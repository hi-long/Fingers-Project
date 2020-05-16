import {timeConverter} from '/mediaPlayer/converter.js'
import theme, {Timer, canvasControlling_PostRoute} from '/mediaPlayer/media.js'
import {newComment} from '/mediaPlayer/newInteractions.js'
import {deleteComment} from '/mediaPlayer/handleInteractions.js'

//---------------------------//
// LOADING
//---------------------------//
const loading = $("#loading"),
	  mainContents = $(".content");

mainContents.hide();

setTimeout(() => {
	loading.fadeOut("slow", () => {
		mainContents.fadeIn("slow");
	})
}, 3000);

paper.install(window);

//----------------------//
// MEDIA PLAYER
//----------------------//
var onPlaying = false;

const playBtn = $("#play-btn"),
	  alert = $(".alert");

$("textarea").on("keydown", (event) => {
	if(event.key = "enter"){
		event.stopPropagation();
	}
})

const songId = $("canvas").data("song");

axios
	.get(`/song/${songId}`)
	.then(function(response) {
		// handle success
		let song = response.data;
	
		var tool = new Tool();
	
		paper.setup('myCanvas');
	
		canvasControlling_PostRoute(song, tool, alert, onPlaying, view, theme);
	})
	.catch(function(error) {
		// handle error
		console.log(error);
	});

// TOGGLE BUTTON LEFT ABOVE
let toggleTriggerBtn = $("#toggle-btn-trigger"),
	escapeBtn = $("#escape"),	
	nextPost = $("#next"),
	previousPost = $("#previous"),
	btnsOnShowing = true;

toggleTriggerBtn.on("click", () => {
	if(btnsOnShowing) {
		escapeBtn.css({left: "150%", zIndex: 1});
		nextPost.css({left: "300%", zIndex: 1});
		previousPost.css({left: "450%", zIndex: 1});
	} else {
		escapeBtn.css({left: "0%", zIndex: -1});
		nextPost.css({left: "0%", zIndex: -1});
		previousPost.css({left: "0%", zIndex: -1});
	}
	btnsOnShowing = !btnsOnShowing;
})

// NEXT, PREVIOUS POST
const postId = $("canvas").attr("data-post-id");

axios.get(`/post/${postId}/next`)
	.then((response) => {
		const nextPostId = response.data;
		nextPost.parent().attr("href", `/post/${nextPostId}`);
	})
	.catch((err) => {
		console.log(err);
	})

axios.get(`/post/${postId}/previous`)
	.then((response) => {
		const previousPostId = response.data;
		previousPost.parent().attr("href", `/post/${previousPostId}`);
	})
	.catch((err) => {
		console.log(err);
	})

// CONVERT COMMENT TIME
let commentsDate = $(".comment-date");
for(let i = 0; i < commentsDate.length; i ++){
	let comment = commentsDate[i];
	let commentDate = comment.textContent;
	comment.textContent = (timeConverter(parseInt(commentDate)));
}

// HANDLE LIKE BUTTON
var likeBtn = $('.like-btn'),
	likedUsersDiv = $('#liked-users'),
	numberOfLikes = $('#n-o-likes'),
	likedDivEscape = $('#likedDiv-escape')

likeBtn.click((event) => {
	/* Act on the event */
	axios.post(`/post/${postId}/new/like`, {})
		.then((response) => {
			if(response.data == "liked"){
				likeBtn.attr("src", "https://img.icons8.com/cotton/36/000000/like--v4.png");
				numberOfLikes.text(parseInt(numberOfLikes.text()) - 1);
				$('#likedDiv-content .user:last').fadeOut();
			} else {
				likeBtn.attr("src", "https://img.icons8.com/cotton/36/000000/like--v3.png");
				var likedUser = {
					id: response.data.user._id,
					cover: response.data.user.cover,
					nickname: response.data.user.nickname
				}
				numberOfLikes.text(parseInt(numberOfLikes.text()) + 1);
				$("#likedDiv-content").prepend(
					'<div class="user">' + 
						'<a href="/' + likedUser.id + '" id="user-liked">' +
						'<img class="profile" src="' + likedUser.cover + '">' +
						'<p>' + likedUser.nickname + '</p>' +
					'</div>'
				)
			}
		})
		.catch(function (error) {
			console.log(error);
		});
});

numberOfLikes.on('click', function() {
	likedUsersDiv.toggleClass('liked-users-show');
});

likedDivEscape.on('click', function() {
	likedUsersDiv.removeClass('liked-users-show');
});

// HANDLE COMMENT BUTTON
var postContent = $('#post-content'),
	ultiBtn = $('#ulti-btn'),
	commentsDiv = $("#comments-div"),
	submitCommentBtn = $('#interaction button'),
	numberOfComments = $("#n-o-comments");

submitCommentBtn.on("click", function(){
	axios.post(`/post/${postId}/new/comment`, {
			content: $("#interaction textarea").val()
		})
		.then((response) => {
			newComment(response, numberOfComments, commentsDiv);
			$("#interaction textarea").val("");
		})
		.catch(function (error) {
			console.log(error);
		});
})

// SHOW AND HIDE POST
var showBtn = $('#show-up'),
	hideBtn = $('#hide')

showBtn.on('click', function() {
	postContent.addClass('post-content-show');
	showBtn.toggleClass('hide');
	hideBtn.toggleClass('hide');
});

hideBtn.on('click', function() {
	postContent.removeClass('post-content-show');
	showBtn.toggleClass('hide');
	hideBtn.toggleClass('hide');
});

// DELETE COMMENT
const deleteBtn = $(".delete-comment-btn");

commentsDiv.on("click", ".delete-comment-btn", (event) => {
	let thisBtn = $(event.currentTarget),
		commentId = thisBtn.parent().attr("data-comment-id");
	deleteComment(postId, commentId, commentsDiv);
	thisBtn.parent().fadeOut("slow");
	numberOfComments.text(parseInt(numberOfComments.text()) - 1);
})

