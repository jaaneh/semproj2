const charPick = document.getElementById('charPick'),
	API_URL = 'https://anapioficeandfire.com/api/characters/',
	characters = [ '583', '271', '529', '238', '1052', '148', '1022', '1560', '957', '565' ];

let fetchedCharacters = [],
	key,
	charName,
	firstName,
	player = 0;

for (let i = 0; i < characters.length; i++) {
	fetch(API_URL + characters[i])
		.then(res => res.json())
		.then(json => {
			fetchedCharacters.push(json);
			key = json.url.split('/')[5];
			charName = json.name;
			firstName = charName.split(' ')[0];

			charPick.innerHTML += `
      <div class="col-xl-4 col-md-6 col-xs-12 character">
        <div class="card character-card" id="${key}">
          <div class="card-header character-card--header">${charName}</div>
          <img src="images/characters/${key}.jpg" class="mx-auto card-img-top character-card--home-image" alt="...">
          <div class="card-body character-card--body">
            <button type="button" class="btn character-card--body__read-button" data-readBtn="read-${key}">Read More</button>
            <div class="card-body character-card--body__more hide" style="padding:0.75rem" data-info="${key}">
							<div class="card-text">
								Name: ${charName}<br/>
								Gender: ${json.gender}<br/>
								Born: ${json.born}<br/>
              </div>
            </div>
            <button type="button" class="btn character-card--body__choose-button" id="pickBtn" data-charname="${charName}" data-charid="${key}">Choose ${firstName}</button>
          </div>
        </div>
      </div>
      `;
		})
		.catch(err => console.error(err));
}

// Support modal open on smaller/mobile devices that uses touch screens.
function openHtp() {
	$('#htpModal').modal('show');
}

// function getDevice() {
// 	const isMobile = new RegExp('Android|webOS|iPhone|iPad|BlackBerry|Windows Phone|Opera Mini|IEMobile|Mobile', 'i');
// 	if (isMobile.test(navigator.userAgent)) {
// 		return 'touchstart';
// 	} else {
// 		return 'click';
// 	}
// }

window.onload = function() {
	for (let i = 0; i < characters.length; i++) {
		const btn = document.querySelector(`[data-charid="${characters[i]}"]`);
		const charCard = document.getElementById(`${characters[i]}`);
		const readMore = document.querySelector(`[data-readBtn="read-${characters[i]}"]`);

		// btn event listener
		btn.addEventListener('click', () => {
			charCard.classList.toggle('char-selected');

			let playerSelected = document.createElement('h5');
			playerSelected.setAttribute('id', `selected-${characters[i]}`);

			const isSelected = document.getElementById(`selected-${characters[i]}`);
			if (isSelected) {
				player = player - 1;
				charCard.removeChild(charCard.childNodes[7]);
			} else {
				player = player + 1;
				playerSelected.appendChild(document.createTextNode(`Player ${player}`));
				charCard.appendChild(playerSelected);
			}

			// Using jQuery because Bootstrap supports it.
			if (player === 2) $('#selectedModal').modal('show');

			// Add players to session storage for use on game page.
			// Using session storage as it removes player details when browser/tab is closed.
			// Using if statement to prevent "Player0" to be added when a player is selected then deselected.
			if (player === 1 || player === 2) {
				sessionStorage.setItem(`Player${player}`, `${characters[i]}`);
				sessionStorage.setItem(`Player${player}_Name`, `${fetchedCharacters[i].name}`);
			}
		});

		// readMore event listener
		readMore.addEventListener('click', () => {
			const readMoreChar = document.querySelector(`[data-info="${characters[i]}"]`);
			readMoreChar.classList.toggle('hide');
		});
	}
};
