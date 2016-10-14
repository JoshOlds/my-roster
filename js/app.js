var debugFlag = false;


function PlayerService() {
    var _myPlayers = []; //My private array of PlayerService
    var _pageIndex = 0;

    var _nflPlayers = []; // NFL players data
    var _filteredPlayers = [];

    var _users = [];
    loadUsers();

    function User(username){
        this.username = username;
        this.roster = [];
    }

    this.saveUsers = function(){
        localStorage.setItem("users", JSON.stringify(_users));
        console.log("Saving Users!")
    }
    function loadUsers(){
        var localData = localStorage.getItem("users");
        if (localData) {
            _users = JSON.parse(localData);
        }
    }
    this.addUser = function(username){
        _users.push(new User(username));
    }
    this.getUsers = function(){
        return _users;
    }

    function Player(name, team, position, jersey, imageLink, id) {
        this.fullname = name;
        this.pro_team = team;
        this.position = position;
        this.jersey = jersey;
        this.photo = imageLink;
        this.id = id;

        var guid = function () { //Generates a random ID that should never conflict
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                s4() + '-' + s4() + s4() + s4();
        }

        if(id === undefined || id == -1){
            var rando = guid();
            this.id = rando;
        }

    }

    this.getPageIndex = function () {
        return _pageIndex;
    }

    this.setPageIndex = function (index) {
        _pageIndex = index;
        return this.getPageIndex();
    }

    this.getMyPlayers = function () {
        return _myPlayers;
    }

    this.getNFLPlayers = function () {
        return _nflPlayers;
    }
    this.getFilteredPlayers = function(){
        return _filteredPlayers;
    }

    this.setFilteredPlayers = function(players){
        _filteredPlayers = players;
    }

    this.findNFLByID = function(id){
        for(var i = 0; i < _nflPlayers.length; i++){
            if(_nflPlayers[i].id == id){
                return _nflPlayers[i];
            }
        }
        return new Player("error","error", "error", 0, "", -2);
    }
    this.findMyPlayerByID = function(id){
        for(var i = 0; i < _myPlayers.length; i++){
            if(_myPlayers[i].id == id){
                return _myPlayers[i];
            }
        }
        return new Player("error","error", "error", 0, "", -2);
    }

    this.addPlayer = function (name, team, position, jersey, imageLink, id) {
        if (!name || !position || !imageLink || !team) {
            console.log("Tried to add invalid player!");
            return false;
        }
        if(this.findMyPlayerByID(id).id != -2){
            console.log(id);
            console.log(this.findMyPlayerByID(id).id);
            console.log("Player already exists!");
            return false;
        }
        var player = new Player(name, team, position, jersey, imageLink, id);
        _myPlayers.push(player);
        return true;
    }

    this.removePlayer = function (id) {
        _myPlayers.forEach(function (player, index, arr) {
            if (player.id == id) {
                return arr.splice(index, 1);
            }
        });
    }

    this.saveUserData = function(rosterName){
        localStorage.setItem(rosterName, JSON.stringify(_myPlayers));
    }

    this.loadUserData = function (rosterName){
        //Check out local storage to see if we have data stored already
        
        var localData = localStorage.getItem(rosterName);
        if (localData) {
            _myPlayers = JSON.parse(localData);
        }else{
            _myPlayers = [];
        }
        updateMyRoster(_myPlayers);
    }

    this.getNFL = function loadPlayersData(callback) {
        var apiURL = "https://api.cbssports.com/fantasy/players/list?version=3.0&SPORT=football&response_format=json";

        //Check out local storage to see if we have data stored already
        var localData = localStorage.getItem('_nflPlayers');
        if (localData) {
            _nflPlayers = JSON.parse(localData);
            return callback(_nflPlayers);
        }

        var url = "https://bcw-getter.herokuapp.com/?url=";
        var endPointUrl = url + encodeURIComponent(apiURL);
        $.getJSON(endPointUrl, function (data) {
            console.log(data);
            _nflPlayers = data.body.players;
            if (debugFlag) {
                console.log("Player Data Ready");
                console.log("Writing Player data to local storage...");
            }
            localStorage.setItem("_nflPlayers", JSON.stringify(_nflPlayers));
            if (debugFlag) { console.log("Completed writing Player Data to local storage!"); }
            callback(_nflPlayers);
        });
    }

    this.massageNFL = function () {
        var newArr = _nflPlayers.filter(function (player) {
            if (player.firstname == "" || player.pro_status == null) {
                return false;
            }
            return true;
        });

        _nflPlayers = newArr;

        _nflPlayers.forEach(function(player){
            if(player.jersey === undefined){
                player.jersey = 00;
            }
        });

        _nflPlayers.forEach(function(player){
            if(!player.photo.includes("https")){
                player.photo = player.photo.replace("http", "https");
            }
            
        });

        _filteredPlayers = _nflPlayers;

        if (debugFlag) { console.log(_nflPlayers); }


    }

    this.formatPosition = function (positionText) {
        switch (positionText) {
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

    this.formatTeam = function (teamText) {
        switch (teamText) {
            case 'ARI':
                return 'Arizona Cardinals';
            case 'ATL':
                return 'Atlanta Falcons';
            case 'BAL':
                return 'Baltimore Ravens';
            case 'BUF':
                return 'Buffalo Bills';
            case 'CAR':
                return 'Carolina Panthers';
            case 'CHI':
                return 'Chicago Bears'
            case 'CIN':
                return 'Cincinnati Bengals';
            case 'CLE':
                return 'Cleveland Browns';
            case 'DAL':
                return 'Dallas Cowboys';
            case 'DEN':
                return 'Denver Broncos';
            case 'DET':
                return 'Detroit Lions';
            case 'GB':
                return 'Green Bay Packers';
            case 'HOU':
                return 'Houston Texans';
            case 'IND':
                return 'Indianapolis Colts';
            case 'JAC':
                return 'Jacksonville Jaguars';
            case 'KC':
                return 'Kansas City Chiefs';
            case 'LAR':
                return 'Los Angelos Rams';
            case 'MIA':
                return 'Miami Dolphins';
            case 'MIN':
                return 'Minnesota Vikings';
            case 'NE':
                return 'New England Patriots';
            case 'NO':
                return 'New Orleans Saints';
            case 'NYG':
                return 'New York Giants';
            case 'NYJ':
                return 'New York Jets';
            case 'OAK':
                return 'Oakland Raiders';
            case 'PHI':
                return 'Philadelphia Eagles';
            case 'PIT':
                return 'Pittsburgh Steelers';
            case 'SD':
                return 'San Diego Chargers';
            case 'SEA':
                return 'Seattle Seahawks';
            case 'SF':
                return 'San Francisco 49ers';
            case 'TB':
                return 'Tampa Bay Buccaneers';
            case 'TEN':
                return 'Tennessee Titans';
            case 'WAS':
                return 'Washington Redskins';
        }
        return 'Invalid Position';
    }
}

var myPlayerService = new PlayerService();
myPlayerService.getNFL(function (item) {
    myPlayerService.massageNFL();
    updateNFLRoster(myPlayerService.getNFLPlayers());
});
updateUserList();

function updateMyRoster(playerArr) {
    var template = '';


    playerArr.forEach(function (player) {
        template += `
        <div class="column small-8 large-3 card-container">
      <div class="card text-center">
        <button id="remove-${player.id}" class="button alert remove-button">Remove Player</button>
        <img class="player-image" src="${player.photo}" alt="Photo of: ${player.fullname}">
        <p class="player-name">${player.fullname}</p>
        <p class="player-position">${myPlayerService.formatTeam(player.pro_team)}</p>
        <p class="player-position">${myPlayerService.formatPosition(player.position)}</p>
        <p class="player-number">#${player.jersey}</p>
      </div>
    </div>
    `
    });

    if(template == ''){
        template +=`
            <div class="column small-8 large-3 card-container">
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

function updateNFLRoster(playerArr) {
    var template = "";
    var pageIndex = myPlayerService.getPageIndex() * 50;

    var tempArr = playerArr.slice(pageIndex, pageIndex + 50);

    var nextButton = ``;
    var prevButton = ``;

    if((pageIndex+50) <= playerArr.length ){
        nextButton = `<button id="next" class="button success next-button">NEXT</button>`
    }
    if((pageIndex-50) >= 0){
        prevButton = `<button id="prev" class="button success prev-button">PREV</button>`
    }

    template += `
        <div class="column small-4 text-right">
        ${prevButton}
        </div>
        <div class="column small-4 text-center">
            <p class="text-center">Showing ${pageIndex} - ${pageIndex + tempArr.length} of ${playerArr.length}</p> 
        </div>
        <div class="column small-4">
        ${nextButton}
        </div>
    `

    tempArr.forEach(function (player) {
        template += `
        <div class="column small-8 large-3 card-container">
      <div class="card text-center">
        <button id="add-${player.id}" class="button success add-button">Add Player To Roster</button>
        <img class="player-image" src="${player.photo}" alt="Photo of: ${player.fullname}">
        <p class="player-name">${player.fullname}</p>
        <p class="player-position">${myPlayerService.formatTeam(player.pro_team)}</p>
        <p class="player-position">${myPlayerService.formatPosition(player.position)}</p>
        <p class="player-number">#${player.jersey}</p>
      </div>
    </div>
    `
    });

    var element = $('#row-nfl-container');
    element.empty();
    element.append(template);
}

function filter(playerArr){
    var name = $('#nfl-search-name').val();
    var team = $('#nfl-search-team').val();
    var pos = $('#nfl-search-position').val();
    var num = $('#nfl-search-number').val();
    var tempArr = playerArr;

    tempArr = tempArr.filter(function(player){
        if(player.fullname.toLowerCase().includes(name.toLowerCase()) || name == ""){return true}
        return false;
    })

    tempArr = tempArr.filter(function(player){
        if(player.pro_team == team || team == 'ANY'){return true}
        return false;
    })

    tempArr = tempArr.filter(function(player){
        if(player.position == pos || pos == 'ANY'){return true}
        return false;
    })

    tempArr = tempArr.filter(function(player){
        if(player.jersey == num || num == ""){return true}
        return false;
    })
    myPlayerService.setFilteredPlayers(tempArr);
    return tempArr;
}

function clearFilter(){
    var name = $('#nfl-search-name').val("");
    var team = $('#nfl-search-team').val('ANY');
    var pos = $('#nfl-search-position').val('ANY');
    var num = $('#nfl-search-number').val("");
}

function getElementPlayerID(element){
    var index = element.id.indexOf('-') + 1;
    var id = element.id.slice(index, element.id.length);
    return id;
}

function updateAddPlayerClicked(id){
    var element = $('#add-'+id);
    element.text("Player Added!");
    element.removeClass("success");
    element.addClass("button-glow");
}


function updateUserList(){
    var users = myPlayerService.getUsers();
    var template = ``;
    users.forEach(function(item){
        template += `
            <option>${item.username}</option>
        `
    });
    var elem = $('#user-select');
    elem.empty();
    elem.append(template);  
}

function savedAnimation(){
    var button = $("#button-save");
    button.text("Roster Saved!");
    setTimeout(function(){
        button.text("Save Roster");
    }, 1000);
}

$('#button-filter').on('click', function(e){
    e.preventDefault();
    if(debugFlag){console.log("Filter clicked!")} 
    myPlayerService.setPageIndex(0);
    updateNFLRoster(filter(myPlayerService.getNFLPlayers()))
});

$('#button-filter-clear').on('click', function(e){
    e.preventDefault();
    if(debugFlag){console.log("Filter Clear clicked!")} 
    myPlayerService.setPageIndex(0);
    updateNFLRoster(myPlayerService.getNFLPlayers())
    clearFilter();
});

$('#button-add-custom').on('click', function(e){
    e.preventDefault();
    var url = $('#nfl-add-url').val();
    if(debugFlag){console.log("Add Custom clicked!")} 
    if(url == ""){url = "resources/player-shadow.jpg"}
    var success = myPlayerService.addPlayer(
        $('#nfl-add-name').val(),
        $('#nfl-add-team').val(),
        $('#nfl-add-position').val(),
        $('#nfl-add-number').val(),
        url
    )
    updateMyRoster(myPlayerService.getMyPlayers());
    if(success){
        $("html, body").animate({ scrollTop: 0 }, "slow");
    }
});

//Event Delegation
$('#row-roster-container').on('click', '.remove-button', function (e) {
    e.preventDefault();
    var id = getElementPlayerID(this);
    myPlayerService.removePlayer(id);
    updateMyRoster(myPlayerService.getMyPlayers());
});

$('#row-nfl-container').on('click', '.add-button', function (e) {
    e.preventDefault();
    var id = getElementPlayerID(this);
    var player = myPlayerService.findNFLByID(id);
    myPlayerService.addPlayer(player.fullname, player.pro_team, player.position, player.jersey, player.photo, player.id);
    updateMyRoster(myPlayerService.getMyPlayers());
    updateAddPlayerClicked(id);
});

$('#row-nfl-container').on('click', '.next-button', function (e) {
    e.preventDefault();
    myPlayerService.setPageIndex((myPlayerService.getPageIndex() + 1));
    updateNFLRoster(myPlayerService.getFilteredPlayers())
});

$('#row-nfl-container').on('click', '.prev-button', function (e) {
    e.preventDefault();
    myPlayerService.setPageIndex((myPlayerService.getPageIndex() - 1));
    updateNFLRoster(myPlayerService.getFilteredPlayers())
});

$('#add-user').on('click', function (e) {
    e.preventDefault();
    var elem = $('#add-user-area')
    elem.empty();
    elem.append(`
        <form id="form-new-user">
                <input id="field-new-user"  type="text" placeholder="Username" >
            </form> 
    `);
    
});

$("#header-area").on('submit', "#form-new-user", function(e){
       // debugger;
        e.preventDefault;
        console.log("test");
        myPlayerService.addUser($('#field-new-user').val())
        $('#field-new-user').remove();
        updateUserList();
        $('#add-user-area').empty();
        myPlayerService.saveUsers();
        return false;
    });

$("#button-save").on('click', function(e){
    var elem = $('#user-select');
    myPlayerService.saveUserData(elem.val());
    savedAnimation();
});
$("#button-load").on('click', function(e){
    var elem = $('#user-select');
    myPlayerService.loadUserData(elem.val());
});






