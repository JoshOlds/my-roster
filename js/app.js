var debugFlag = true;

var playerArr = [];

function Player(name, position, playerNumber, imageLink) {
    this.name = name;
    this.position = position;
    this.playerNumber = playerNumber;
    this.imageLink = imageLink;
}

$('form').on('submit', function (e) {
    e.preventDefault();
    var form = this;
    var player = new Player(form.playerName.value, form.playerPosition.value, form.playerNumber.value)
    if (debugFlag) { console.log(player); }
    playerArr.push(player)

    if (debugFlag) { console.log(playerArr); }
    update(playerArr);
    //form.reset();
})

function update(playerArr) {
    var template = '';

    playerArr.forEach(function (player) {
        template += `
        <div class="column small-6 large-3 card-container">
      <div class="card text-center">
        <button class="button alert remove-button">Remove Player</button>
        <img class="player-image" src="resources/player-shadow.jpg" alt="NFL Player Silhouette">
        <p class="player-name">${player.name}</p>
        <p class="player-position">${player.position}</p>
        <p class="player-number">#${player.playerNumber}</p>
      </div>
    </div>
    `
    });

    if(template == ""){ //Blank card if empty
        template = `
        <div class="column small-6 large-3 card-container">
      <div class="card text-center">
        <button class="button alert remove-button disabled">Remove Player</button>
        <img class="player-image" src="resources/player-shadow.jpg" alt="NFL Player Silhouette">
        <p class="player-name">----</p>
        <p class="player-position">----</p>
        <p class="player-number">----</p>
      </div>
    </div>
        `
    }

    var element = $('#row-roster-container');
    element.empty();
    element.append(template);

}

//Event Delegation
$('#row-roster-container').on('click', '.remove-button', function(e){
    console.log("Remove clicked!!");
    console.log(this);
});

