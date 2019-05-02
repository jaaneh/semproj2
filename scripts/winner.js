const winnerSpan = document.getElementById('winner');
/* 
	In game.js we added the whole winner object to sessionStorage.
	We had to wrap this in JSON.stringify(), so therefore we also need to
	use JSON.parse() to get the item again.

	We're saving the whole object to a variable for easy access throughout the page.
*/
const winner = JSON.parse(sessionStorage.getItem('winner'));

winnerSpan.innerHTML = `${winner.name} (${winner.id})`;
