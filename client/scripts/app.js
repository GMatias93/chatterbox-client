// YOUR CODE HERE:

window.app = {};

app.init = function(){
  app.server = 'https://api.parse.com/1/classes/chatterbox';
  app.fetch();

 
};

 $(document).ready(function(){
    app.init();
    $(".button").on("click", function(){
      event.preventDefault();
      app.handleSubmit()
    });
  })
  $(document).ready(function(){
    app.init();
    $(".username").on("click", app.addFriend());
  });

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
         for(var i = 0; i < data.results.length; i++){
        var message = data.results[i]
        if(message.text !== undefined){
          if(message.username===undefined){ return; }
          app.addMessage(message)
        }
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

app.addMessage = function(message){
  $(".chat").prepend("<div class=username>"+ message.username + ": "+"</div>"+"<div>"+message.text+"</div>")

  app.send(message);
};

app.addRoom = function(roomName){
  var node = document.createElement("option");
  var newRoom = document.createTextNode(roomName);
  node.appendChild(newRoom);
  document.getElementById("roomSelect").appendChild(node); 
};

app.handleSubmit = function(){
  // $(document).ready(function(){
    // $(".button").on("click", function(){
    
    var userMessage = {};
    userMessage.username = $("#username").val()
    userMessage.text = $("#message").val()
    app.addMessage(userMessage);
    app.send(userMessage)
    // });
  // });
};

app.addFriend = function(){

};



$(document).ready(function(){
  setInterval(app.init, 1000);
});








