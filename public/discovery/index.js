import {timeConverter} from '/mediaPlayer/converter.js';
import {newComment} from '/mediaPlayer/newInteractions.js';
import {deleteComment} from '/mediaPlayer/handleInteractions.js';
import theme, {Timer} from '/mediaPlayer/media.js';

//-----------------------//
// LOADING		 		 //
//-----------------------//
setTimeout(() => {
	$("#loading").fadeOut("slow", () => {
		$(".main-container").fadeIn("slow");
	});
}, 3000)

//-----------------------//
// OTHERS		 		 //
//-----------------------//
const commentsDiv = $('.comments-div'),
	commentBtn = $('.comment-btn');

commentBtn.on('click', (event) => {
	$(event.currentTarget)
		.parent()
		.parent()
		.children('.comments-div')
		.toggleClass('div-hide');
});

// CONVERT COMMENT TIME
let commentsDate = $(".comment-date");
for(let i = 0; i < commentsDate.length; i ++){
	let comment = commentsDate[i];
	let commentDate = comment.textContent;
	comment.textContent = (timeConverter(parseInt(commentDate)));
}

// HANDLE LIKE BUTTON
const likeBtn = $('.like-btn'),
	numberOfLikes = $(".n-o-likes");

// HANDLE LIKE BUTTON
likeBtn.click((event) => {
	/* Act on the event */
	let numberOfLikesOfThisPost = $(event.currentTarget).parent().children(".n-o-likes");
	let canvasOfThisPost = $(event.currentTarget).parent().parent().children("canvas");
	var likes = numberOfLikesOfThisPost.text();
	console.log(numberOfLikesOfThisPost);
	axios.post(`/post/${canvasOfThisPost.attr("data-post-id")}/new/like`, {})
		.then((response) => {
			if(response.data == "liked"){
				$(event.currentTarget).attr("src", "https://img.icons8.com/cotton/36/000000/like--v4.png");
				numberOfLikesOfThisPost.text(parseInt(likes) - 1);
			} else {
				$(event.currentTarget).attr("src", "https://img.icons8.com/cotton/36/000000/like--v3.png");
				var likedUser = {
					id: response.data.user._id,
					cover: response.data.user.cover,
					nickname: response.data.user.nickname
				}
				numberOfLikesOfThisPost.text(parseInt(likes) + 1);
			}
		})
		.catch((error) => {
			console.log(error);
		});
});

// HANDLE COMMENT BUTTON
var submitCommentBtn = $('#interaction button');

submitCommentBtn.on("click", (event) => {
	let newCommentContent = $(event.currentTarget).parent().children("textarea").val();
	let commentsDiv = $(event.currentTarget).parent().parent().children(".comments-part");
	let postId = $(event.currentTarget).parent().parent().parent().children("canvas").attr("data-post-id");
	let numberOfComments = $(event.currentTarget).parent().parent().parent().children(".header").children(".n-o-comments");
	axios.post(`/post/${postId}/new/comment`, {
			content: newCommentContent
		})
		.then((response) => {
			newComment(response, numberOfComments, commentsDiv);
			$("#interaction textarea").val("");
		})
		.catch((error) => {
			console.log(error);
		});
})

// DELETE COMMENT
const deleteBtn = $(".delete-comment-btn");

commentsDiv.on("click", ".delete-comment-btn", (event) => {
	let thisBtn = $(event.currentTarget),
		commentId = thisBtn.parent().attr("data-comment-id"),
		postId = $(event.currentTarget).parent().parent().parent().parent().children("canvas").attr("data-post-id"),
		numberOfComments = $(event.currentTarget).parent().parent().parent().parent().find(".n-o-comments");
	deleteComment(postId, commentId, commentsDiv);
	thisBtn.parent().fadeOut("slow");
	numberOfComments.text(parseInt(numberOfComments.text()) - 1);
})

//-----------------------//
// MEDIA		 		 //
//-----------------------//

// RESOURCES
paper.install(window);

var start = false,
	stop = false;

// MEDIA PLAYER 	
let productCanvas = $('.product');

productCanvas.on('click', () => {
	
	let clickedCanvas = $(event.currentTarget),
		onPlaying = clickedCanvas.attr("data-is-playing"),
		canvasBackground = clickedCanvas.css("backgroundImage");
	const song_id = clickedCanvas.attr('id');
	
	if(onPlaying == "true"){
		onPlaying = "false";
	} else {
		onPlaying = "true";
	}
	
	clickedCanvas.attr("data-is-playing", onPlaying);
	clickedCanvas.css("backgroundImage", "none");
	
	axios
		.get(`/song/${song_id}`)
		.then((response) => {
			// handle success
			
			let song = response.data;
		
			paper.setup(song_id);
		
			var circles = [],
				keys = song.sounds,
				effectsCores = song.effects,
				themeCores = song.theme,
				timeCores = song.time;
		
			(function playSounds(i) {
				if(clickedCanvas.attr("data-is-playing") == "true") {
					setTimeout(function() {
						playSound(i);
						i ++;  
						clickedCanvas.attr("data-pause-pos", i);
						if(i == timeCores.length - 1){
							setTimeout(() => {
								// alert.fadeToggle('1000');
								clickedCanvas.attr("data-is-playing", "false");
								clickedCanvas.attr("data-pause-pos", "0");
								clickedCanvas.css("backgroundImage", canvasBackground);
							}, 2000);
						}
						if (i < timeCores.length - 1) {
							playSounds(i); 
						}
					}, timeCores[i + 1] - timeCores[i])
				} 
			})(parseInt(clickedCanvas.attr("data-pause-pos"))); 

			view.onFrame = function(event) {
				for (var i = 0; i < circles.length; i++) {
					if (clickedCanvas.attr("data-is-playing") == "true") {
						circles[i].scale(0.95);
						circles[i].fillColor.hue += 1;
						if (circles[i].area < 1) {
							circles[i].remove();
							circles.splice(i, 1);
						}
					}
				}
			};

			function playSound(i) {
				if (effectsCores[i] != undefined) {
					const newCircle = new Path.Circle({
						center: new Point(effectsCores[i].center[1] / 3, effectsCores[i].center[2] / 3),
						radius: effectsCores[i].radius,
						fillColor: effectsCores[i].fillColor,
						blendMode: effectsCores[i].blendMode
					});
					circles.push(newCircle);
					theme[themeCores[i]][keys[i]].sound.play();
				}
			}
		})
		.catch((error) => {
			// handle error
			console.log(error);
		});
});
