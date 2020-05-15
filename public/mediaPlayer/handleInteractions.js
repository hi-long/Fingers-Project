export function deleteComment(postId, commentId, commentDiv) {
	axios.delete(`/post/${postId}/comment/${commentId}/delete`)
		.then((response) => {
			console.log("Comment deleted !")
		})
		.catch((err) => {
			console.log(err);
		})
}