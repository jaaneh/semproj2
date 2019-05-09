/*
	Bugs/Missing:
	- No double if trap is hit by a 6 dice roll. (?)
	- Winner page

	Needs done:
	- New page design.
		- Find a color scheme.
			- Use these colors for everything from navbar to player tokens. 
		- New path tile designs.
		- New trap tile designs.
	- Image for all 10 characters. (Stick to face & only outlines. Transparent background, 250x250px).
*/

// const declarations.
const canvas = document.getElementById('gameCanvas'),
	ctx = canvas.getContext('2d'),
	player1 = document.getElementById('player1'),
	player2 = document.getElementById('player2'),
	player1hr = document.getElementById('player1-hr'),
	player2hr = document.getElementById('player2-hr'),
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
			color: '#a6444c',
			pos: 0,
			locX: 0,
			locY: 0
		},
		{
			id: getPlayer2,
			name: getPlayer2Name,
			color: '#222',
			pos: 0,
			locX: 0,
			locY: 0
		}
	],
	trapArray = [ 6, 11, 16, 21, 27 ];

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
	playerIcon,
	otherPlayer = 0;

trap.onload = function() {
	checkCtx();
};

// Set images for the path, trap, player1 token, & player2 token.
path.src = 'images/board/icon_new.png';
trap.src = 'images/board/trap_new.png';

// Fetch tile positions.
fetch('../tilePositions.json')
	.then(res => res.json())
	.then(json => {
		tilePos = json;
	})
	.catch(err => console.error(err));

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

function getDevice() {
	const isMobile = new RegExp('Android|webOS|iPhone|iPad|BlackBerry|Windows Phone|Opera Mini|IEMobile|Mobile', 'i');
	if (isMobile.test(navigator.userAgent)) {
		return 'touchstart';
	} else {
		return 'click';
	}
}

function announceWinner(playerTurn) {
	// clear sessionStorage.
	sessionStorage.clear();
	/* 
	Instead of adding player name, id, etc. seperately to sessionStorage, we can 
	add the whole object. We'll have to wrap it in JSON.stringify(), then we'll 
	use JSON.parse() when getting the player again in the winner.js file.
	*/
	sessionStorage.setItem('winner', JSON.stringify(players[playerTurn]));
	canvas.removeEventListener('click', canvasDiceEvt, false);

	// Redirect to winners page
	setTimeout(() => {
		location.href = '/winner.html';
	}, 1500);
}

function playAudio() {
	audio.load(); // Load audio to prevent audio from not playing sometimes.
	audio.volume = 0.5; // 50% volume
	return audio.play();
}

function checkOnButton(pos, button) {
	return pos.x > button.x && pos.x < button.x + button.width && pos.y < button.y + button.heigth && pos.y > button.y;
}

function movePlayers(playerTurn, dice, newX, newY, doubleSix) {
	let player = players[playerTurn];

	otherPlayer = playerTurn === 0 ? 1 : 0;

	// Clear rect using old location.
	drawCanvas();
	if (players[otherPlayer].locX || players[otherPlayer].locY) {
		ctx.fillStyle = players[otherPlayer].color;
		if (playerTurn === 0) {
			ctx.fillRect(tilePos[players[1].pos].x + 18, tilePos[players[1].pos].y + 18, 35, 35);
		} else {
			ctx.fillRect(tilePos[players[0].pos].x + 8, tilePos[players[0].pos].y + 8, 35, 35);
		}
	}

	// Save new location to players array.
	player.locX = newX;
	player.locY = newY;

	// Check if new position is more than 30, if so set position to 30. else, keep new position.
	if (player.pos + dice >= 30) {
		player.pos = 30;
		announceWinner(playerTurn);
	} else {
		player.pos = player.pos + dice;
	}

	// Check if player lands on a trap tile.
	if (trapArray.includes(player.pos)) {
		switch (player.pos) {
		case 6:
			drawTrapMessage(6, 2, 4, playerTurn);
			player.pos = 4;
			ctx.fillStyle = players[playerTurn].color;
			if (playerTurn === 0) {
				player.locX = 201 + 8;
				player.locY = 0 + 8;
				ctx.fillRect(201 + 8, 0 + 8, 35, 35);
			} else {
				player.locX = 201 + 18;
				player.locY = 0 + 18;
				ctx.fillRect(201 + 18, 0 + 18, 35, 35);
			}
			break;
		case 11:
			drawTrapMessage(11, 3, 8, playerTurn);
			player.pos = 8;
			ctx.fillStyle = players[playerTurn].color;
			if (playerTurn === 0) {
				player.locX = 469 + 8;
				player.locY = 0 + 8;
				ctx.fillRect(469 + 8, 0 + 8, 35, 35);
			} else {
				player.locX = 469 + 18;
				player.locY = 0 + 18;
				ctx.fillRect(469 + 18, 0 + 18, 35, 35);
			}
			break;
		case 16:
			drawTrapMessage(16, 2, 14, playerTurn);
			player.pos = 14;
			ctx.fillStyle = players[playerTurn].color;
			if (playerTurn === 0) {
				player.locX = 536 + 8;
				player.locY = 335 + 8;
				ctx.fillRect(536 + 8, 335 + 8, 35, 35);
			} else {
				player.locX = 536 + 18;
				player.locY = 335 + 18;
				ctx.fillRect(536 + 18, 335 + 18, 35, 35);
			}
			break;
		case 21:
			drawTrapMessage(21, 3, 18, playerTurn);
			player.pos = 18;
			ctx.fillStyle = players[playerTurn].color;
			if (playerTurn === 0) {
				player.locX = 402 + 8;
				player.locY = 469 + 8;
				ctx.fillRect(402 + 8, 469 + 8, 35, 35);
			} else {
				player.locX = 402 + 18;
				player.locY = 469 + 18;
				ctx.fillRect(402 + 18, 469 + 18, 35, 35);
			}
			break;
		case 27:
			drawTrapMessage(27, 4, 23, playerTurn);
			player.pos = 23;
			ctx.fillStyle = players[playerTurn].color;
			if (playerTurn === 0) {
				player.locX = 0 + 8;
				player.locY = 268 + 8;
				ctx.fillRect(67 + 8, 469 + 8, 35, 35);
			} else {
				player.locX = 0 + 18;
				player.locY = 268 + 18;
				ctx.fillRect(67 + 18, 469 + 18, 35, 35);
			}
			break;
		}
	} else {
		if (dice === 6 && player.pos < 30 && doubleSix !== 2) drawDoubleMessage(playerTurn); // draw double 6 text.
		ctx.fillStyle = players[playerTurn].color;
		ctx.fillRect(newX, newY, 35, 35);
	}
}

function rollDice() {
	let player = players[playerTurn];
	const dice = Math.floor(Math.random() * 6) + 1; // dice
	console.log(`Dice rolled ${dice}`);
	playAudio();

	// Set newX & newY to 30 if new position + dice is more than 30.
	if (player.pos + dice >= 30) {
		if (playerTurn === 0) {
			newX = tilePos[30].x + 8;
			newY = tilePos[30].y + 8;
		} else {
			newX = tilePos[30].x + 18;
			newY = tilePos[30].y + 18;
		}
		player.pos = 30;
	} else {
		if (playerTurn === 0) {
			newX = tilePos[player.pos + dice].x + 8;
			newY = tilePos[player.pos + dice].y + 8;
		} else {
			newX = tilePos[player.pos + dice].x + 18;
			newY = tilePos[player.pos + dice].y + 18;
		}
	}
	if (dice === 6) {
		doubleSix = doubleSix + 1;
		movePlayers(playerTurn, dice, newX, newY, doubleSix); // move player
		if (doubleSix === 2) {
			// since doubleSix is equal 2, we need to reset it back to 0. We also need to switch player turns.
			doubleSix = 0;
			playerTurn = playerTurn === 1 ? 0 : 1;
		} else {
			playerTurn = playerTurn === 1 ? 1 : 0;
		}
		drawRollDiceButton(playerTurn); // draw roll dice button.
	} else if (dice !== 6) {
		movePlayers(playerTurn, dice, newX, newY, doubleSix); // move player
		doubleSix = 0;
		playerTurn = playerTurn === 1 ? 0 : 1;
		drawRollDiceButton(playerTurn); // draw roll dice button.
	}
	drawDice(dice);
}

function drawRollDiceButton(playerTurn) {
	let buttonBgColor = players[playerTurn].color;
	let fontColor;
	fontColor = playerTurn === 0 ? '#fff' : '#fff'; // change font color to match player color.

	ctx.clearRect(200, 150, 200, 80); // clear current button
	ctx.beginPath();
	ctx.rect(200, 150, 200, 80);
	ctx.fillStyle = buttonBgColor;
	ctx.fill();
	ctx.lineWidth = 0.7;
	ctx.strokeStyle = '#000';
	ctx.stroke();
	ctx.closePath();
	ctx.font = '24px SortsMillGoudy-Regular';
	ctx.fillStyle = fontColor;
	ctx.fillText(`Player ${playerTurn + 1}`, 265, 185);
	ctx.fillText('Roll Dice', 255, 212);
	ctx.fillStyle = '#fff';
}

function drawTrapMessage(oldTile, spaces, newTile, playerTurn) {
	ctx.font = '18px SortsMillGoudy-Regular';
	ctx.fillStyle = '#000';
	ctx.fillText(`Player ${playerTurn + 1} hit a trap on tile ${oldTile}.`, 210, 365);
	ctx.fillText(`You were moved ${spaces} spaces to tile ${newTile}.`, 178, 385);
}

function drawDoubleMessage(playerTurn) {
	ctx.font = '18px SortsMillGoudy-Regular';
	ctx.fillStyle = '#000';
	ctx.fillText(`Player ${playerTurn + 1} rolled a 6 and gets another go!`, 170, 365);
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

	// Reset posY & posX to 0, so canvas tiles will be drawn from 0, 0 again.
	posY = 0;
	posX = 0;

	// Clear current canvas before starting the redraw.
	ctx.clearRect(0, 0, canvas.width, canvas.height);

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
				ctx.textAlign = 'center'; // center numbers for tiles
				ctx.fillText(tileNum, posX + 31, posY + 36, 62, 62);
				ctx.textAlign = 'start'; // reset to default.
			}
			posX += 67;
		}
		posX = 0;
		posY += 67;
	}
	drawRollDiceButton(playerTurn);
}

// event listener for dice event

const canvasDiceEvt = function(e) {
	e.preventDefault();
	const mousePos = getMousePos(canvas, e);
	if (checkOnButton(mousePos, rollDiceButton)) {
		rollDice();
	}
};

canvas.addEventListener(getDevice(), canvasDiceEvt, false);

function checkCtx() {
	if (!ctx) {
		const noCanvas = document.getElementById('noCanvas');
		noCanvas.style.display = 'block';
		canvas.style.display = 'none';
	} else {
		drawCanvas();
	}
}

// Add playing characters to page.
if (getPlayer1 && getPlayer1Name && getPlayer2 && getPlayer2Name) {
	player1.innerHTML += `
	<div class="character">
		<div class="card character-card--game">
			<div class="card-header character-card--header-game"><b>Player 1:</b> ${players[0].name}</div>
			<img src="images/characters/${players[0].id}.png" class="mx-auto card-img-top character-card--game-image" alt="...">
		</div>
	</div>
`;
	player2.innerHTML += `
	<div class="character">
		<div class="card character-card--game">
			<div class="card-header character-card--header-game"><b>Player 2:</b> ${players[1].name}</div>
			<img src="images/characters/${players[1].id}.png" class="mx-auto card-img-top character-card--game-image" alt="...">
		</div>
	</div>
`;
	player1hr.style.backgroundColor = players[0].color;
	player2hr.style.backgroundColor = players[1].color;

	checkCtx();
} else {
	$('#missingPlayers').modal('show');
}
