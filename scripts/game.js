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
	path = new Image(),
	trap = new Image(),
	players = [
		{
			id: getPlayer1,
			name: getPlayer1Name,
			color: '#111',
			pos: 0,
			locX: 0,
			locY: 0
		},
		{
			id: getPlayer2,
			name: getPlayer2Name,
			color: '#999',
			pos: 0,
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

trap.onload = function() {
	checkCtx();
};

// Set images for the path, trap, player1 token, & player2 token.
path.src = 'images/board/icon.png';
trap.src = 'images/board/trap.png';

// Fetch tile positions.
fetch('../tilePositions.json')
	.then((res) => res.json())
	.then((json) => {
		tilePos = json;
	})
	.catch((err) => console.error(err));

// Support modal open on smaller/mobile devices that uses touch screens.
function openHtp() {
	$('#htpModal').modal('show');
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

function movePlayers(playerTurn, dice, newX, newY) {
	let player = players[playerTurn];

	// Clear rect using old location.
	if (player.locX || player.locY) {
		ctx.clearRect(player.locX, player.locY, 35, 35);
	}

	// Save new location to players array.
	player.locX = newX;
	player.locY = newY;

	// check if new position is more than 30, if so set position to 30. else, keep new position.
	player.pos + dice > 30 ? (player.pos = 30) : (player.pos = player.pos + dice);

	// Draw image
	ctx.fillStyle = player.color;
	ctx.fillRect(newX, newY, 35, 35);
}

function rollDice() {
	let player = players[playerTurn];
	const dice = Math.floor(Math.random() * 6) + 1;
	console.log(`Dice rolled ${dice}`);
	playAudio();

	/*
	clearRect() on 2nd+ throws. 
		- Re-draw canvas, keep position of players.

	Check if pos + dice are above pos of tile 30.
		- Announce winner.
			--Disable dice button
			-- Winner modal pop-up.
	*/

	// Set newX & newY to 30 if new position + dice is more than 30.
	if (player.pos + dice >= 30) {
		newX = tilePos[30].x;
		newY = tilePos[30].y;
		player.pos = 30;
	} else {
		newX = tilePos[player.pos + dice].x;
		newY = tilePos[player.pos + dice].y;
	}
	if (dice === 6) {
		movePlayers(playerTurn, dice, newX, newY); // move player
		doubleSix = doubleSix + 1;
		if (doubleSix === 2) {
			// since doubleSix is equal 2, we need to reset it back to 0. We also need to switch player turns.
			doubleSix = 0;
			playerTurn === 1 ? (playerTurn = 0) : (playerTurn = 1);
		} else {
			playerTurn === 1 ? (playerTurn = 1) : (playerTurn = 0);
		}
		drawRollDiceButton(playerTurn); // draw roll dice button.
	} else if (dice !== 6) {
		movePlayers(playerTurn, dice, newX, newY); // move player
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

	// Reset posY & posX to 0, so canvas will be drawn from 0, 0 again.
	posY = 0;
	posX = 0;

	// Clear current canvas before starting the redraw.
	ctx.clearRect(0, 0, canvas.width, canvas.height);

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

	drawRollDiceButton(playerTurn);
}

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

function checkCtx() {
	if (!ctx) {
		const noCanvas = document.getElementById('noCanvas');
		noCanvas.style.display = 'block';
		canvas.style.display = 'none';
	} else {
		drawCanvas();
	}
}

if (getPlayer1 && getPlayer1Name && getPlayer2 && getPlayer2Name) {
	// Add playing characters to page.
	player1.innerHTML += `
	<div class="character">
		<div class="card character-card">
			<div class="card-header character-card--header"><b>Player 1:</b> ${players[0].name}</div>
			<img src="images/characters/${players[0].id}.jpg" class="mx-auto card-img-top character-card--game-image" alt="...">
		</div>
	</div>
`;
	player2.innerHTML += `
	<div class="character">
		<div class="card character-card">
			<div class="card-header character-card--header"><b>Player 2:</b> ${players[1].name}</div>
			<img src="images/characters/${players[1].id}.jpg" class="mx-auto card-img-top character-card--game-image" alt="...">
		</div>
	</div>
`;

	checkCtx();
} else {
	$('#missingPlayers').modal('show');
}
