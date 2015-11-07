var Game = function(player1, player2) {
  this.player1 = player1;
  this.player2 = player2;
  this.onSubmit(this.player1, this.player2);
  this.onSubmit(this.player2, this.player1);
  this.player1.emit('countdown', {});
  this.player2.emit('countdown', {});
};

Game.prototype.sendCountdown = function(player, count) {
  player.emit('countdown', {count: count});
};

Game.prototype.onSubmit = function(player, opponent){
  var self = this;
  player.on('submit', function(data) {
    player.move = data.move;
    if (opponent.move) {
      self.getResults(player, opponent);
    }
  });
};

Game.prototype.getResults = function(player, opponent){
  if (player.move == 'rock') {
    if (opponent.move == 'scissors') {
      // player wins
      this.sendResults(player, opponent, 'playerWon');
    } else if (opponent.move == 'paper') {
      // opponent wins
      this.sendResults(player, opponent, 'playerLost');
    } else {
      // tie
      this.sendResults(player, opponent, 'tie');
    }
  } else if (player.move == 'scissors') {
    if (opponent.move == 'rock') {
      // opponent wins
      this.sendResults(player, opponent, 'playerLost');
    } else if (opponent.move == 'paper') {
      // player wins
      this.sendResults(player, opponent, 'playerWon');
    } else {
      // tie
      this.sendResults(player, opponent, 'tie');
    }
  }
  else {  // player threw paper
    if (opponent.move == 'scissors') {
      // opponent wins
      this.sendResults(player, opponent, 'playerLost');
    } else if (opponent.move == 'rock') {
      // player wins
      this.sendResults(player, opponent, 'playerWon');
    } else {
      // tie
      this.sendResults(player, opponent, 'tie');
    }
  }
};

Game.prototype.sendResults = function(player, opponent, result) {
  if (result == 'playerWon') {
    player.emit('result', {result: 'You won!', player: player.move, opponent: opponent.move} );
    opponent.emit('result', {result: 'You lost!', player: opponent.move, opponent: player.move } );
  } else if (result == 'playerLost') {
    player.emit('result', { result: 'You lost!', player: player.move, opponent: opponent.move } );
    opponent.emit('result', { result: 'You won!', player: opponent.move, opponent: player.move } );
  } else {
    player.emit('result', { result: 'You tied!', player: player.move, opponent: opponent.move } );
    opponent.emit('result', { result: 'You tied!', player: opponent.move, opponent: player.move } );
  }
}

module.exports = Game;
