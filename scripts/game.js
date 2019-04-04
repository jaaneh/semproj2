// Temporary code to test session storage.
const players = document.getElementById('players');

const player1 = sessionStorage.getItem('Player1');
const player2 = sessionStorage.getItem('Player2');
const player1Name = sessionStorage.getItem('Player1_Name');
const player2Name = sessionStorage.getItem('Player2_Name');

players.innerHTML = `
  <b>Player 1:</b> ${player1} - ${player1Name}<br/>
  <b>Player 2:</b> ${player2} - ${player2Name}
`;

// Load How to Play modal content from local JSON file.
const htp = document.getElementById('htp');

fetch('../howtoplay.json')
	.then((res) => res.json())
	.then((json) => {
		htp.innerHTML = json.content;
	})
	.catch((err) => console.error(err));
