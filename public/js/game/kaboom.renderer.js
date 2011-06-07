function KaboomRenderer(target, game) {

    this.previousTick = [];
    this.mapBuilder = new MapBuilder(target, game);
    
    this.initialise = function() {
        this.mapBuilder.build(game.level);
        this.createPlayers();
    };

    this.createPlayers = function() {
        for (var player = 0; player < game.players.length; player++) {
            this.createPlayer(player + 1, game.players[player]);
        }
    };

  this.createPlayer = function(num, player) {
    var playerDiv = $('<div id="player_' + num + '" class="player" style="width: 36px;" />');

    playerDiv.sprite({fps: 3, no_of_frames: 3}).active();
    playerDiv.spStart();

    target.holding.append(playerDiv);

    this.ensureVelocityIsInitialised(player);
    this.cacheLatestPlayerData(playerDiv, player);

  };

  this.makePlayerActive = function(playerDiv){
      target.playerLayer.append(playerDiv);
      playerDiv.data('isInPlay', true);
  };

  this.playerHasMovedSinceLastDraw = function(playerDiv, player){
    var cachedX = playerDiv.data('x');
    var cachedY = playerDiv.data('y');
    var cachedDX = playerDiv.data('dx');
    var cachedDY = playerDiv.data('dy');
    var direction = this.getPlayerDirectionFromVelocity(player);

    var lastDirection =  playerDiv.data('lastDirection');
    if(direction !== lastDirection) {
        return true;
    }
    if (cachedY !== player.position.y){
        return true;
    }
    if (cachedX != player.position.x){
        return true;
    }
    if (cachedDX !== player.velocity.dx){
        return true;
    }
    if(cachedDY !== player.velocity.dy){
        return true;
    }

    return false;
  };

this.cacheLatestPlayerData = function(playerDiv, player){
    playerDiv.data('x', playerDiv.position.x);
    playerDiv.data('y', playerDiv.position.y);
    playerDiv.data('dx', player.velocity.x);
    playerDiv.data('dy', player.velocity.y);

    var direction = this.getPlayerDirectionFromVelocity(player);
    playerDiv.data('lastDirection', direction);
};

  this.ensureVelocityIsInitialised = function(player) {
      if (player.velocity == "undefined") {
          player.velocity = new Velocity(0,0);
      }
  };

  this.getPlayerDirectionFromVelocity = function(player){
        if (player.velocity.dy < 0) {
            return "down";
        } else if (player.velocity.dy > 0) {
            return "up";
        } else if (player.velocity.dx < 0) {
            return "left";
        } else if (player.velocity.dx > 0) {
            return "right";
        } else{
            return "stopped";
        }
  };

   this.updatePlayerSpriteForDirection = function(direction) {
        if (direction === "up") {

        } else if (direction === "down") {

        } else if (direction === "left") {

        } else if (direction === "right") {

        } else if (direction === "stopped") {

        }
    };

 this.updatePlayerLocations = function() {
    for (var i = 0; i < game.players.length; i++) {
        var player = game.players[i];
        if (player != null) {
            this.updatePlayer(i, player);
        }
    }
  };

 this.updatePlayer = function(playerId, player) {
        var playerDiv = $('#player_' + (playerId + 1));
        if (!playerDiv.data('isInPlay')) {
            this.makePlayerActive(playerDiv);
        }

        if (!this.playerHasMovedSinceLastDraw(playerDiv, player)) {
            return;
        }

        //this.ensureVelocityIsInitialised(player);

        var direction = this.getPlayerDirectionFromVelocity(player);
        this.updatePlayerSpriteForDirection(direction);

        playerDiv.css({
            position: 'absolute',
            top: player.position.y + 'px',
            left: player.position.x + 'px'
        });

        this.cacheLatestPlayerData(playerDiv, player);
    };

  
  this.updateItems = function() {
    for (var rowIndex = 0; rowIndex < game.level.rows.length; rowIndex++) {
      for (var tileIndex = 0; tileIndex < game.level.rows[rowIndex].length; tileIndex++) {
        var tile = game.level.rows[rowIndex][tileIndex];
        var tileDiv = $('#tile_' + rowIndex + '_' + tileIndex);
        
        var url = null;
		    
		    if (tile == null) {
          url = 'url(images/blank.png)';
        } else {
    		  url = 'url(' + this.itemImages[tile.tileType] + ')';
    		}
    		
        if (tileDiv.data('background') != url)
			    tileDiv.css('background', url);
			    tileDiv.data('background', url);
       }
    }
  };
  
  this.update = function() {
    this.updatePlayerLocations();
    this.updateItems();
  };
  
  this.initialise();
}

function MapBuilder(target, game){

    this.itemImages = ["images/solid-block.png",
						"images/destroyable-block.png",
						"images/blank.png" ];

    this.build = function(level) {

        for (var row = 0; row < level.rows.length; row++) {
            var rowDiv = $('<div class="row" style="position:absolute;top:' + row * game.TILE_SIZE + 'px;height:' + game.TILE_SIZE + 'px;width:' + game.TILE_SIZE * level.rows[row].length + 'px" />');

            for (var tileIndex = 0; tileIndex < level.rows[row].length; tileIndex++) {
                var tile = level.rows[row][tileIndex];
                var tileDiv = $('<div id="tile_' + row + '_' + tileIndex + '" class="tile" style="position:absolute;height:' + game.TILE_SIZE + 'px;width:' + game.TILE_SIZE + 'px;top:0;left:' + tileIndex * game.TILE_SIZE + 'px" />');

                if (tile != null) {
                    tileDiv.css('background', 'url(' + this.itemImages[tile.tileType] + ')');
                }

                rowDiv.append(tileDiv);
            }

            target.arena.append(rowDiv);
        }
    };
}