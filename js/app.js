var debugFlag = true;

var playerArr = [];


function PlayerService() {
    var _players = []; //My private array of PlayerService

    var playersData = []; // NFL players data

    function Player(name, position, playerNumber, imageLink) {
        this.name = name;
        this.position = position;
        this.playerNumber = playerNumber;
        this.imageLink = imageLink;
        this.id = guid();

        var guid = function () { //Generates a random ID that should never conflict
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        }

    }

    this.getPlayers = function () {
        return _players;
    }

    this.addPlayers = function (name, position, playerNumber) {
        if (!name || !position || !playerNumber) {
            return;
        }
        var player = new Player(name, position, playerNumber);
        _players.push(player);
    }

    this.removePlayer = function (id) {
        _players.forEach(function (player, index, arr) {
            if (player.id == id) {
                return arr.splice(index, 1);
            }
        });
    }

    this.getNFL = function loadPlayersData(callback) {
        var apiURL = "http://api.cbssports.com/fantasy/players/list?version=3.0&SPORT=football&response_format=json";

        //Check out local storage to see if we have data stored already
        var localData = localStorage.getItem('playersData');
        if (localData) {
            playersData = JSON.parse(localData);
            return callback(playersData);
        }

        var url = "http://bcw-getter.herokuapp.com/?url=";
        var endPointUrl = url + encodeURIComponent(apiURL);
        $.getJSON(endPointUrl, function (data) {
            console.log(data);
            playersData = data.body.players;
            if (debugFlag) {
                console.log("Player Data Ready");
                console.log("Writing Player data to local storage...");
            }
            localStorage.setItem("playersData", JSON.stringify(playersData));
            if (debugFlag) { console.log("Completed writing Player Data to local storage!"); }
            callback(playersData);
        });
    }

    this.massageNFL = function () {
        var newArr = playersData.filter(function (player) {
            if (player.firstname == "" || player.pro_status == null) {
                return false;
            }
            return true;
        });

        playersData = newArr;
        if (debugFlag) { console.log(playersData); }

        // var tempArr = [];
        // playersData.forEach(function (player) {
        //     //tempArr.push(player.pro_team);
        //     tempArr.push(player.position)
        // });
        // console.log(tempArr);
        // var uniqueNames = [];
        // $.each(tempArr, function (i, el) {
        //     if ($.inArray(el, uniqueNames) === -1) uniqueNames.push(el);
        // });
        
        // console.log(uniqueNames.sort());

    }

    this.formatPosition = function(positionText){
        switch(positionText){
            case 'DB':  
                return 'Defensive Back';
            case 'DL':
                return 'Defensive Line';
            case 'K':
                return 'Kicker';
            case 'LB': 
                return 'Linebacker';
            case 'QB':
                return 'Quarterback';
            case 'RB':
                return 'Running Back'
            case 'TE':
                return 'Tight End';
            case 'WR':
                return 'Wide Receiver';
        }
        return 'Invalid Position';
    }


}

var myPlayerService = new PlayerService();
myPlayerService.getNFL(function (item) {
    console.log(item);
});
myPlayerService.massageNFL();




$('form').on('submit', function (e) {
    e.preventDefault();
    var form = this;
    var player = new Player(form.playerName.value, form.playerPosition.value, form.playerNumber.value)
    if (debugFlag) { console.log(player); }
    playerArr.push(player)

    if (debugFlag) { console.log(playerArr); }
    updateMyRoster(playerArr);
    //form.reset();
})

function updateMyRoster(playerArr) {
    var template = '';

    playerArr.forEach(function (player) {
        template += `
        <div class="column small-6 large-3 card-container">
      <div class="card text-center">
        <button id="remove-${player.id}" class="button alert remove-button">Remove Player</button>
        <img class="player-image" src="${player.photo}" alt="NFL Player Silhouette">
        <p class="player-name">${player.fullname}</p>
        
        <p class="player-position">${myPlayerService.formatPosition(player.position)}</p>
        <p class="player-number">#${player.playerNumber}</p>
      </div>
    </div>
    `
    });

    if (template == "") { //Blank card if empty
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

function updateNFLRoster(playerArr, pageIndex){
    var template = "";
    var indexStart = pageIndex * 50;
    var indexEnd = indexStart + 50;
    
    for(var i = 0; i < 50; i++){
        var player = playerArr[i];
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
    }
}

//Event Delegation
$('#row-roster-container').on('click', '.remove-button', function (e) {
    console.log("Remove clicked!!");
    console.log(this);
});

