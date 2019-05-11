/* 
In game.js we added the whole winner object to sessionStorage.
We had to wrap this in JSON.stringify(), so therefore we also need to
use JSON.parse() to get the item again.

We're saving the whole object to a variable for easy access throughout the page.
*/
const winner = JSON.parse(sessionStorage.getItem('winner'));
const winnerWrapper = document.getElementById('winnerWrapper');

if (!winner) {
	winnerWrapper.innerHTML = `
		<div class="no-winner">
			<h2>No winner found.</h2>
			<p>Looks like you didn't play the game.</p>
			<button type="button" onclick="redirectPlayer()" class="btn btn-default no-winner--btn">Go play <i class="far fa-chevron-right fa-xs"></i></button>
		</div>
	`;
} else {
	winnerWrapper.innerHTML = `
	<div class="winner">
		<img src="images/characters/${winner.id}.png" class="mx-auto card-img-top winner--image" alt="...">
		<h2 class="winner--name">${winner.name}</h2>
		<p>You reached the end of the game.</br>Congratulations!</p>
		<button type="button" onclick="redirectPlayer()" class="btn btn-default winner--btn">Play again <i class="far fa-chevron-right fa-xs"></i></button>
	</div>	
	`;
}

function redirectPlayer() {
	sessionStorage.clear(); // clear sessionStorage.
	location.href = 'index.html'; // redirect to index.
}
