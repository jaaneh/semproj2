const charPick = document.getElementById('charPick');
const API_URL = 'https://anapioficeandfire.com/api/characters/';
const characters = [ '583', '271', '529', '238', '1052', '148', '1022', '1560', '957', '565' ];

rollDice = () => {
	const dice = Math.floor(Math.random() * 6) + 1;
	return dice;
};

for (let i = 0; i < characters.length; i++) {
	fetch(API_URL + characters[i])
		.then((res) => res.json())
		.then((json) => {
			charPick.innerHTML += `
      <div class="col-xl-4 col-md-6 col-xs-12 character">
        <div class="card character-card">
        <div class="card-header">${json.name}</div>
          <img src="https://via.placeholder.com/348x275" class="card-img-top character-card--image" alt="...">
          <div class="card-body character-card--body">
            <a href="#" class="btn btn-primary character-card--body__button" id="pickBtn" data-charname="${json.name}" data-charid="${json.url.split(
				'/'
			)[5]}">Choose ${json.name.split(' ')[0]}</a>
          </div>
        </div>
      </div>
      `;
		})
		.catch((err) => console.error(err));
}

setTimeout(() => {
	for (let i = 0; i < characters.length; i++) {
		const btn = document.querySelector(`[data-charid="${characters[i]}"]`);
		btn.addEventListener('click', () => {
			btn.classList.toggle('char-selected');
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
