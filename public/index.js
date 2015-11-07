var socket = io.connect(location.host);

var controller = new Leap.Controller({enableGestures: true});
var choice = "";
controller.on('deviceFrame', function(frame) {
  for (var i = 0; i < frame.hands.length; i++) {
    var hand = frame.hands[i];

    if (hand.grabStrength > 0.6) {
      choice = "rock";
    } else if (hand.grabStrength < 0.3 && !hand.ringFinger.extended && !hand.pinky.extended) {
      choice = "scissors";
    } else if (hand.grabStrength < 0.4 && hand.thumb.extended && hand.indexFinger.extended
            && hand.middleFinger.extended && hand.ringFinger.extended && hand.pinky.extended) {
      choice = "paper";
    }
    document.getElementById('player-choice').innerHTML = choice;
  }
});

controller.connect();

socket.on('countdown', function(data) {
  setTimeout(function() { document.getElementById('output').innerHTML = 3 }, 1000);
  setTimeout(function() { document.getElementById('output').innerHTML = 2 }, 2000);
  setTimeout(function() { document.getElementById('output').innerHTML = 1 }, 3000);
  setTimeout(function() { document.getElementById('output').innerHTML = 'GO' }, 4000);
  setTimeout(collectData(), 4000);
});

function collectData() {
  socket.emit('submit', {move: 'rock'});
}

socket.on('result', function(data){
  document.getElementById('output').innerHTML = data.result;
  socket.disconnect();
});

function reconnect(){
  socket.socket.connect()
};
