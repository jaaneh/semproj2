/* 
In game.js we added the whole winner object to sessionStorage.
We had to wrap this in JSON.stringify(), so therefore we also need to
use JSON.parse() to get the item again.

We're saving the whole object to a variable for easy access throughout the page.
*/
const winner = JSON.parse(sessionStorage.getItem('winner'));
const winnerEl = document.getElementById('winner');

if (!winner) {
	winnerEl.innerHTML = `
		<h2>No winner found.</h2>

		<div class="no-winner">
			<p>Did you play the game?</p>
			<button type="button" onclick="location.href='/index.html'" class="btn btn-default no-winner--btn">Go play <i class="far fa-chevron-right fa-xs"></i></button>
		</div>
	`;
} else {
	winnerEl.innerHTML = `${winner.name} (${winner.id})`;
}
