const game = document.getElementById('game');

rollDice = () => {
	const dice = Math.floor(Math.random() * 6) + 1; // +1 for 1-6 instead of 0-5
	return dice;
};

game.innerHTML = `
  <div>
    <button type="button" onclick="rollDice()">Roll Dice</button>
  </div>
`;
