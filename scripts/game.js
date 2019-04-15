// const declarations.
const canvas = document.getElementById('gameCanvas'),
	ctx = canvas.getContext('2d'),
	player1 = document.getElementById('player1'),
	player2 = document.getElementById('player2'),
	getPlayer1 = sessionStorage.getItem('Player1'),
	getPlayer2 = sessionStorage.getItem('Player2'),
	getPlayer1Name = sessionStorage.getItem('Player1_Name'),
	getPlayer2Name = sessionStorage.getItem('Player2_Name'),
	rollDiceButton = { x: 200, y: 150, width: 200, heigth: 80 },
	audio = new Audio('sounds/rolldice.mp3'),
	p1 = new Image(),
	p2 = new Image(),
	path = new Image(),
	trap = new Image(),
	players = [
		{
			id: getPlayer1,
			name: getPlayer1Name,
			locX: 0,
			locY: 0
		},
		{
			id: getPlayer2,
			name: getPlayer2Name,
			locX: 0,
			locY: 0
		}
	];

// let declarations.
let posX = 0,
	posY = 0,
	tileNum = 0,
	playerTurn = 0,
	doubleSix = 0,
	newRoll,
	tilePos,
	oldX = 0,
	oldY = 0,
	newX,
	newY,
	playerIcon;

// Set images for the path, trap, player1 token, & player2 token.
path.src = 'images/board/icon.png';
trap.src = 'images/board/trap.png';
p1.src = 'images/players/player1.png';
p2.src = 'images/players/player2.png';

// Support modal open on smaller/mobile devices that uses touch screens.
function openHtp() {
	$('#htpModal').modal('show');
}

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

function movePlayers(playerTurn, oldX, oldY, newX, newY) {
	// Clear rect using old location.
	if (players[playerTurn].locX && players[playerTurn].locY) {
		ctx.clearRect(oldX, oldY, 50, 50);
	}
	playerTurn === 0 ? (playerIcon = p1) : (playerIcon = p2);

	// Save new location
	players[playerTurn].locX = newX;
	players[playerTurn].locY = newY;

	// Draw image
	ctx.drawImage(playerIcon, newX, newY, 62, 62);
}

fetch('../tilePositions.json')
	.then((res) => res.json())
	.then((json) => {
		tilePos = json;
	})
	.catch((err) => console.error(err));

async function rollDice() {
	const dice = Math.floor(Math.random() * 6) + 1;
	console.log(`Dice rolled ${dice}`);
	playAudio();

	/*
	This whole section is porbably incorrect, and definitely needs refactoring.

	(?) Incorrect calculations for newX & newY.
	(?) Incorrect calculations for player's 2nd go.

	- Figure out best way to clearRect of old position using images. 
		-- Go back to fillRect() instead of drawImage()?
	- Both players using same oldY & oldX, seperate these.
	*/

	players[playerTurn].locX ? (oldX = players[playerTurn].locX) : 0;
	players[playerTurn].locY ? (oldY = players[playerTurn].locY) : 0;
	newX = tilePos[dice].x + oldX;
	newY = tilePos[dice].y + oldY;
	if (dice === 6) {
		movePlayers(playerTurn, oldX, oldY, newX, newY); // moves player
		doubleSix = doubleSix + 1;
		if (doubleSix === 2) {
			doubleSix = 0;
			playerTurn === 1 ? (playerTurn = 0) : (playerTurn = 1);
		} else {
			playerTurn === 1 ? (playerTurn = 1) : (playerTurn = 0);
		}
		drawRollDiceButton(playerTurn); // draw button.
	} else if (dice !== 6) {
		movePlayers(playerTurn, oldX, oldY, newX, newY); // moves player
		doubleSix = 0;
		playerTurn === 1 ? (playerTurn = 0) : (playerTurn = 1);
		drawRollDiceButton(playerTurn); // draw roll dice button.
	}
	drawDice(dice);
}

function drawRollDiceButton(playerTurn) {
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

function drawDice(dice) {
	const diceImage = new Image();
	diceImage.src = `images/dice/${dice}.png`;
	diceImage.onload = function() {
		ctx.drawImage(diceImage, 250, 240, canvas.width / 6, canvas.height / 6);
	};
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

	// event listener for dice event
	canvas.addEventListener(
		'click',
		(e) => {
			const mousePos = getMousePos(canvas, e);
			if (checkOnButton(mousePos, rollDiceButton)) {
				rollDice();
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

	drawRollDiceButton(playerTurn);
}

if (getPlayer1 && getPlayer1Name && getPlayer2 && getPlayer2Name) {
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

	// Check if user browser support canvas.
	if (!ctx) {
		const noCanvas = document.getElementById('noCanvas');
		noCanvas.style.display = 'block';
		canvas.style.display = 'none';
	} else {
		drawCanvas();
	}
} else {
	$('#missingPlayers').modal('show');
}
