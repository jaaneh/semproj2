const winnerSpan = document.getElementById('winner');
const winner = sessionStorage.getItem('Winner_Name');

winnerSpan.innerHTML = winner;
