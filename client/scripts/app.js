// YOUR CODE HERE:

var app = {};

app.init = function(){

};

var Message = function(username, text, roomname){
  var message = {
  "username": username,
  "text": text,
  "roomname": roomname
  }
  return message;
};

app.send = function(message){
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: 'https://api.parse.com/1/classes/chatterbox',
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};

app.fetch = function(){
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: undefined,
    type: 'GET',
    data: JSON.stringify(Message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
}

app.clearMessages = function(){
  var node = document.getElementById("chats");
  while(node.firstChild){
    node.removeChild(node.firstChild);
  }
};

app.addMessage = function(message){
  var node = document.createElement("div");
  var messageNode = document.createTextNode(message);
  node.appendChild(messageNode);
  document.getElementById("chats").appendChild(node);
};

app.addRoom = function(roomName){
  var node = document.createElement("option");
  var newRoom = document.createTextNode(roomName);
  node.appendChild(newRoom);
  document.getElementById("roomSelect").appendChild(node); 
};

app.user = {

}

app.addFriend = function(){

};

$(document).ready(function(){
  $(".username").on("click", app.addFriend());
});










