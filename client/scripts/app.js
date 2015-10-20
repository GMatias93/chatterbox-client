// YOUR CODE HERE:

window.app = {};

app.init = function(){
  app.server = 'https://api.parse.com/1/classes/chatterbox';
  app.fetch();

  $(document).ready(function(){
    $(".username").on("click", app.addFriend());
  });

 $(document).ready(function(){
    $(".button").on("click", app.handleSubmit());
  })

 
};

// var message = {
// "username": username,
// "text": text,
// "roomname": roomname
// }

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
    url: app.server,
    type: 'GET',
    // data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      for(var i = 0; i < data.length; i++){
        for(var key in data[i])
        $(".chat").append(data[i][key]);
      }
      console.log(data);
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

app.addMessage = function(message, username){
  var node = document.createElement("div");
  var messageNode = document.createTextNode(message);
  node.appendChild(messageNode);
  document.getElementById("chats").appendChild(node);
  app.send(message);
};

app.addRoom = function(roomName){
  var node = document.createElement("option");
  var newRoom = document.createTextNode(roomName);
  node.appendChild(newRoom);
  document.getElementById("roomSelect").appendChild(node); 
};

app.handleSubmit = function(){
  $(document).ready(function(){
    $(".button").on("click", function(){
    event.preventDefault();
    var userMessage = $("#message").val()
    app.addMessage(userMessage);
    });
  });
};

app.addFriend = function(){

};


$(document).ready(function(){
  app.init();
})








