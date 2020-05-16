import {timeConverter} from "./converter.js"

export function deleteComment(postId, commentId, commentDiv) {
	axios.delete(`/post/${postId}/comment/${commentId}/delete`)
		.then((response) => {
			console.log("Comment deleted !")
		})
		.catch((err) => {
			console.log(err);
		})
}

export function newComment(response, numberOfComments, commentsDiv){
	console.log(response);
	var commentedUser = {
		id: response.data.user._id,
		cover: response.data.user.cover,
		nickname: response.data.user.nickname,
		comment: response.data.content,
		date: response.data.date
	}
		
	numberOfComments.text(parseInt(numberOfComments.text()) + 1);
	console.log(Date.now() + " " + commentedUser.date + " " + Date.now() - commentedUser.date);
	let time = timeConverter(Date.now() - commentedUser.date);
	
	commentsDiv.append(
		'<div class="comment" data-comment-id="' + response.data._id + '">' +
			'<a href="/' + commentedUser.id + '">' +
				'<div class="user" style="display: inline-flex; align-items: center; padding: 0.5rem 0.5rem 0 0.5rem;">' +
					'<img class="profile" src="' + commentedUser.cover + '">' +
					'<h5 class="user-nickname">' + commentedUser.nickname + '</h5>' +
				'</div>' +
			'</a>' +
			'<img class="delete-comment-btn" style="float: right; cursor: pointer;" src="https://img.icons8.com/cotton/36/000000/delete-sign--v1.png"/>' +
			'<div class="date" style="padding-left: 0.5rem;">' +
				'<p class="comment-content">' + commentedUser.comment + '</p>' +
				'<p class="comment-date" style="padding-left: 10px;	margin-bottom: 0;">' + time + '</p>' +
			'</div>' + 
			'<hr>' +
		'</div>' 
		
	)
}