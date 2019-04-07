// Temporary code to test session storage.
const player1 = document.getElementById('player1');
const player2 = document.getElementById('player2');
// const API_URL = 'https://anapioficeandfire.com/api/characters/';

const getPlayer1 = sessionStorage.getItem('Player1');
const getPlayer2 = sessionStorage.getItem('Player2');
const getPlayer1Name = sessionStorage.getItem('Player1_Name');
const getPlayer2Name = sessionStorage.getItem('Player2_Name');

const characters = [
	{
		id: getPlayer1,
		name: getPlayer1Name
	},
	{
		id: getPlayer2,
		name: getPlayer2Name
	}
];

// Add playing characters to page.
player1.innerHTML += `
  <div class="character">
    <div class="card character-card">
      <div class="card-header character-card--header"><b>Player 1:</b> ${characters[0].name}</div>
      <img src="https://via.placeholder.com/285x285" class="card-img-top character-card--image" alt="...">
    </div>
  </div>
`;
player2.innerHTML += `
  <div class="character">
    <div class="card character-card">
      <div class="card-header character-card--header"><b>Player 2:</b> ${characters[1].name}</div>
      <img src="https://via.placeholder.com/285x285" class="card-img-top character-card--image" alt="...">
    </div>
  </div>
`;

// Canvas
const canvas = document.getElementById('gameCanvas');
// Check if user browser support canvas.
if (!canvas.getContext) {
	const noCanvas = document.getElementById('noCanvas');
	noCanvas.style.display = 'block';
	canvas.style.display = 'none';
} else {
	const ctx = canvas.getContext('2d');
	ctx.clearRect(0, 0, 800, 800);
}

// Load How to Play modal content from local JSON file.
const htp = document.getElementById('htp');

fetch('../howtoplay.json')
	.then(res => res.json())
	.then(json => {
		htp.innerHTML = json.content;
	})
	.catch(err => console.error(err));
