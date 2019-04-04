const charPick = document.getElementById('charPick');
const API_URL = 'https://anapioficeandfire.com/api/characters/';
const characters = [ '583', '271', '529', '238', '1052', '148', '1022', '1560', '957', '565' ];

rollDice = () => {
	const dice = Math.floor(Math.random() * 6) + 1;
	return dice;
};

let fetchedCharacters = [];
let key;
let charName;
let firstName;

for (let i = 0; i < characters.length; i++) {
	fetch(API_URL + characters[i])
		.then((res) => res.json())
		.then((json) => {
			fetchedCharacters.push(json);
			key = json.url.split('/')[5];
			charName = json.name;
			firstName = charName.split(' ')[0];

			charPick.innerHTML += `
      <div class="col-xl-4 col-md-6 col-xs-12 character">
        <div class="card character-card">
        <div class="card-header">${charName}</div>
          <img src="https://via.placeholder.com/348x275" class="card-img-top character-card--image" alt="...">
          <div class="card-body character-card--body">
            <button type="button" class="btn btn-primary character-card--body__button" id="pickBtn" data-charname="${charName}" data-charid="${key}">Choose ${firstName}</button>
          </div>
        </div>
      </div>
      `;
		})
		.catch((err) => console.error(err));
}

let player = 0;

getDevice = () => {
	const isMobile = new RegExp('Android|webOS|iPhone|iPad|BlackBerry|Windows Phone|Opera Mini|IEMobile|Mobile', 'i');
	if (isMobile.test(navigator.userAgent)) {
		return 'touchstart';
	} else {
		return 'click';
	}
};

setTimeout(() => {
	for (let i = 0; i < characters.length; i++) {
		const btn = document.querySelector(`[data-charid="${characters[i]}"]`);
		btn.addEventListener(getDevice(), () => {
			btn.classList.toggle('char-selected');

			let playerSelected = document.createElement('h5');
			playerSelected.setAttribute('id', `selected-${characters[i]}`);

			const isSelected = document.getElementById(`selected-${characters[i]}`);
			if (isSelected) {
				player = player - 1;
				btn.removeChild(btn.childNodes[1]);
			} else {
				player = player + 1;
				playerSelected.appendChild(document.createTextNode(`Player ${player}`));
				btn.appendChild(playerSelected);
			}

			//if (player === 2) window.location = '/game.html';
			if (player === 2) $('#selectedModal').modal('show');

			// Add players to session storage for use on game page.
			// Using session storage as it removes player details when browser/tab is closed.
			// Using if statement to prevent "Player0" to be added when a player is selected then deselected.
			if (player === 1 || player === 2) {
				sessionStorage.setItem(`Player${player}`, `${characters[i]}`);
				sessionStorage.setItem(`Player${player}_Name`, `${fetchedCharacters[i].name}`);
			}
		});
	}
}, 100);

// Load How to Play modal content from local JSON file.
const htp = document.getElementById('htp');

fetch('../howtoplay.json')
	.then((res) => res.json())
	.then((json) => {
		htp.innerHTML = json.content;
	})
	.catch((err) => console.error(err));
