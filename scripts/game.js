const player1 = document.getElementById('player1');
const player2 = document.getElementById('player2');
const getPlayer1 = sessionStorage.getItem('Player1');
const getPlayer2 = sessionStorage.getItem('Player2');
const getPlayer1Name = sessionStorage.getItem('Player1_Name');
const getPlayer2Name = sessionStorage.getItem('Player2_Name');

// const API_URL = 'https://anapioficeandfire.com/api/characters/';
const audio = new Audio('sounds/rolldice.mp3');
let playerTurn = 0;
let doubleSix = 0;
const rollDiceButton = { x: 200, y: 150, width: 200, heigth: 80 };
const players = [
	{
		id: getPlayer1,
		name: getPlayer1Name,
		color: '#444',
		player: 0,
		locX: 0,
		locY: 0
	},
	{
		id: getPlayer2,
		name: getPlayer2Name,
		color: '#777',
		player: 1,
		locX: 0,
		locY: 0
	}
];

// Add playing characters to page.
player1.innerHTML += `
	<div class="character">
		<div class="card character-card">
			<div class="card-header character-card--header"><b>Player 1:</b> ${players[0].name}</div>
			<img src="https://via.placeholder.com/278x278" class="card-img-top character-card--image" alt="...">
		</div>
	</div>
`;
player2.innerHTML += `
	<div class="character">
		<div class="card character-card">
			<div class="card-header character-card--header"><b>Player 2:</b> ${players[1].name}</div>
			<img src="https://via.placeholder.com/278x278" class="card-img-top character-card--image" alt="...">
		</div>
	</div>
`;

function getDevice() {
	const isMobile = new RegExp('Android|webOS|iPhone|iPad|BlackBerry|Windows Phone|Opera Mini|IEMobile|Mobile', 'i');
	if (isMobile.test(navigator.userAgent)) {
		return 'touchstart';
	} else {
		return 'click';
	}
}

function getMousePos(canvas, e) {
	const canvasRect = canvas.getBoundingClientRect();
	return {
		x: e.clientX - canvasRect.left,
		y: e.clientY - canvasRect.top
	};
}

function playAudio() {
	audio.load(); // Load audio to prevent audio from not playing sometimes.
	audio.volume = 0.5; // 50% volume
	return audio.play();
}

function checkOnButton(pos, button) {
	return pos.x > button.x && pos.x < button.x + button.width && pos.y < button.y + button.heigth && pos.y > button.y;
}

function rollDice(ctx) {
	const dice = Math.floor(Math.random() * 6) + 1;
	playAudio();
	if (dice === 6) {
		drawRollDiceButton(ctx, playerTurn); // draw button.
		doubleSix = doubleSix + 1;
		if (doubleSix === 2) {
			doubleSix = 0;
			playerTurn === 1 ? (playerTurn = 0) : (playerTurn = 1);
		} else {
			playerTurn === 1 ? (playerTurn = 1) : (playerTurn = 0);
		}
	} else if (dice !== 6) {
		drawRollDiceButton(ctx, playerTurn); // draw button.
		doubleSix = 0;
		playerTurn === 1 ? (playerTurn = 0) : (playerTurn = 1);
	}
	drawDice(ctx, dice);
}

function drawRollDiceButton(ctx, playerTurn) {
	ctx.clearRect(200, 150, 200, 80); // clear current button
	ctx.beginPath();
	ctx.rect(200, 150, 200, 80);
	ctx.fillStyle = 'rgba(225,225,225,0.5)';
	ctx.fill();
	ctx.lineWidth = 1;
	ctx.strokeStyle = '#000';
	ctx.stroke();
	ctx.closePath();
	ctx.font = '20px Arial';
	ctx.fillStyle = '#000';
	ctx.fillText(`Player ${playerTurn + 1}`, 265, 185);
	ctx.fillText('Roll Dice', 260, 210);
	ctx.fillStyle = '#fff';
}

function drawDice(ctx, dice) {
	const diceImage = new Image();
	diceImage.src = `images/dice/${dice}.png`;
	diceImage.onload = function() {
		ctx.drawImage(diceImage, 250, 240, canvas.width / 6, canvas.height / 6);
	};
}

// Canvas
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Check if user browser support canvas.
if (!ctx) {
	const noCanvas = document.getElementById('noCanvas');
	noCanvas.style.display = 'block';
	canvas.style.display = 'none';
} else {
	drawCanvas();
}

function drawCanvas() {
	canvas.style = 'margin-top:15px;';
	ctx.clearRect(0, 0, 600, 600);

	const trapArray = [ 6, 11, 16, 21, 27 ];

	const gameArray = [
		[ 1, 2, 3, 4, 5, 6, 7, 8, 9 ],
		[ 30, 0, 0, 0, 0, 0, 0, 0, 10 ],
		[ 29, 0, 0, 0, 0, 0, 0, 0, 11 ],
		[ 28, 0, 0, 0, 0, 0, 0, 0, 12 ],
		[ 27, 0, 0, 0, 0, 0, 0, 0, 13 ],
		[ 26, 0, 0, 0, 0, 0, 0, 0, 14 ],
		[ 25, 0, 0, 0, 0, 0, 0, 0, 15 ],
		[ 24, 23, 22, 21, 20, 19, 18, 17, 16 ]
	];

	const path = new Image();
	const trap = new Image();
	path.src = 'images/board/icon.png';
	trap.src = 'images/board/trap.png';

	let posX = 0;
	let posY = 0;
	let tileNum = 0;

	// event listener for click event
	canvas.addEventListener(
		getDevice(),
		(e) => {
			const mousePos = getMousePos(canvas, e);
			if (checkOnButton(mousePos, rollDiceButton)) {
				rollDice(ctx);
			}
		},
		false
	);

	setTimeout(() => {
		for (let i = 0; i < gameArray.length; i++) {
			for (let j = 0; j < gameArray[i].length; j++) {
				if (gameArray[i][j] >= 1) {
					if (trapArray.includes(gameArray[i][j])) {
						ctx.drawImage(trap, posX, posY, 62, 62);
					} else {
						ctx.drawImage(path, posX, posY, 62, 62);
					}
					tileNum = gameArray[i][j];
					ctx.font = '18px Arial';
					ctx.fillText(tileNum, posX + 23, posY + 37, 62, 62);
				}
				posX += 67;
			}
			posX = 0;
			posY += 67;
		}
	}, 100);

	drawRollDiceButton(ctx, playerTurn);
}
