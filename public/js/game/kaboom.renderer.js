function KaboomRenderer(target, game) {
	this.itemImages = ["images/solid-block.png", 
						"images/destroyable-block.png",
						"images/blank.png" ];
  this.initialise = function() {
    var level = game.level;
    
    // create tiles
    for (var row = 0; row < level.rows.length; row++) {
    	var rowDiv = $('<div class="row" style="position:absolute;top:'+row*game.TILE_SIZE+'px;height:'+game.TILE_SIZE+'px;width:'+game.TILE_SIZE*level.rows[row].length+'px" />');

    	for (var tileIndex = 0; tileIndex < level.rows[row].length; tileIndex++) {
    		var tile = level.rows[row][tileIndex];
    		var tileDiv = $('<div id="tile_' + row + '_' + tileIndex + '" class="tile" style="position:absolute;height:' + game.TILE_SIZE + 'px;width:'+game.TILE_SIZE+'px;top:0;left:'+tileIndex * game.TILE_SIZE+'px" />');

    		if (tile != null) {
  				tileDiv.css('background', 'url(' + this.itemImages[tile.tileType] + ')');
    		}

    		rowDiv.append(tileDiv);
    	}

    	target.arena.append(rowDiv);
    }
    
    // create players
    for (var player = 0; player < game.players.length; player++) {
      this.createPlayer(player + 1);
    }
  };
  
  this.createPlayer = function(num) {
    var playerDiv = $('<div id="player_' + num + '" class="player" style="width: 36px;" />');

	playerDiv.sprite({fps: 3, no_of_frames: 3}).active();
    playerDiv.spStart();

    target.holding.append(playerDiv);
  };

  this.makePlayerActive = function(playerDiv){
      target.playerLayer.append(playerDiv);
      playerDiv.data('isInPlay', true);
  };

  this.playerHasMovedSinceLastDraw = function(playerDiv, serverPlayerState){

    var direction = this.getPlayerDirectionFromVelocity(serverPlayerState);

    if(direction != playerDiv.data('lastDirection', direction)) {
        return true;
    }
    if (playerDiv.data('y') != serverPlayerState.position.y || playerDiv.data('x') != serverPlayerState.position.x) {
        return true;
    }
    if (playerDiv.data('dx') != serverPlayerState.velocity.dx || playerDiv.data('dy') != serverPlayerState.velocity.dy) {
        return true;
    }
    return false;
  };

  this.cacheLatestPlayerData = function(playerDiv, serverPlayerState){
    playerDiv.data('x', serverPlayerState.position.x);
    playerDiv.data('y', serverPlayerState.position.y);
    playerDiv.data('dx', serverPlayerState.velocity.x);
    playerDiv.data('dy', serverPlayerState.velocity.y);

    var direction = this.getPlayerDirectionFromVelocity(serverPlayerState);
    playerDiv.data('lastDirection', direction);
      
  };

  this.ensureVelocityIsInitialised = function (player) {
      if(player.velocity == null){
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

   this.updatePlayerSpriteForDirection = function (direction) {
        if (direction === "up") {

        } else if (direction === "down") {

        } else if (direction === "left") {

        } else if (direction === "right") {

        } else if (direction === "stopped") {

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

        playerDiv.css({
            position: 'absolute',
            top: player.position.y + 'px',
            left: player.position.x + 'px'
        });

        this.ensureVelocityIsInitialised(player);
        this.cacheLatestPlayerData(playerDiv, player);

        var direction = this.getPlayerDirectionFromVelocity(player);
        this.updatePlayerSpriteForDirection(direction);
    };

 this.updatePlayerLocations = function() {
    for (var i = 0; i < game.players.length; i++) {
        var player = game.players[i];
        if (player != null) {
            this.updatePlayer(i, player);
        }
    }
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
