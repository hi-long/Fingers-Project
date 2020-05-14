// export function newFollow

export function newComment(response, numberOfComments, commentsDiv){
	var commentedUser = {
		id: response.data.user._id,
		cover: response.data.user.cover,
		nickname: response.data.user.nickname,
		comment: response.data.content,
		date: response.data.date
	}
		
	numberOfComments.text(parseInt(numberOfComments.text()) + 1);
		
	commentsDiv.append(
		'<div class="comment">' +
			'<a href="/' + commentedUser.id + '">' +
				'<div class="user d-flex">' +
					'<img class="profile" src="' + commentedUser.cover + '">' +
					'<h5>' + commentedUser.nickname + '</h5>' +
				'</div>' +
			'</a>' +
			'<div class="date">' +
				'<p>' + commentedUser.comment + '</p>' +
				'<p class="comment-date">' + commentedUser.date + '</p>' +
			'</div>' + 
		'</div>'
	)
}