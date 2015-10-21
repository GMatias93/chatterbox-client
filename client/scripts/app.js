// YOUR CODE HERE:

var app;
//same as doing $(documen).ready, so that all code runs when doc is ready
$(function(){
  app = {
    //setting up server that will be used for ajax functions
    server : 'https://api.parse.com/1/classes/chatterbox',
    //defined inside of init
    username : "anonymous",
    roomname : "lobby",
    lastMessageID : 0,
    friends: {},

    startSpinner : function(){
      $("spinner img").show();
      $("form input[type=submit]").attr("disabled", "true");
    },

    stopSpinner : function(){
      $(".spinner img").fadeOut("fast");
      $("form input[type=submit]").attr("disabled", null);
    },


    init : function(){
      //getting the username (refer to config.js)
      //substr extracts part of a string from the start value provided
      app.username = window.location.search.substr(10);

      //set jquery selectors for later use
      app.$main = $("#main");
      app.$message = $("#message");
      app.$chats = $("#chats");
      app.$roomSelect = $("#roomSelect");
      app.$send = $("#send");

      //event listeners
      app.$main.on("click", ".username", app.addFriend);
      app.$send.on("submit", app.handleSubmit);
      app.$roomSelect.on("change", app.saveRoom);

      //fetch previous messages
      app.startSpinner();
      app.fetch(false);

      //check for new messages periodically
      setInterval(app.fetch, 1000);
    },

   // $(document).ready(function(){
   //    app.init();
   //    $(".button").on("click", function(){
   //      event.preventDefault();
   //      app.handleSubmit()
   //    });
   //  })
   //  $(document).ready(function(){
   //    app.init();
   //    $(".username").on("click", app.addFriend());
   //  });

  // var message = {
  // "username": username,
  // "text": text,
  // "roomname": roomname
  // }

    send : function(data){
      app.startSpinner();
      //clear message input
      app.$message.val("");
      
      //POST messages to the server
      $.ajax({
        // This is the url you should use to communicate with the parse API server.
        url: app.server,
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function (data) {
          console.log('chatterbox: Message sent');
          //trigger fetch to update the messages
          app.fetch();
        },
        error: function (data) {
          // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
          console.error('chatterbox: Failed to send message');
        }
      });
    },


    fetch : function(animate){
      $.ajax({
        // This is the url you should use to communicate with the parse API server.
        url: app.server,
        type: 'GET',
        contentType: 'application/json',
        //what does this do??!??!?!?!
        data: { order: "-createdAt"},
        success: function (data) {
          console.log('chatterbox: Message sent');
          
          //if there is no new data then return
          if(!data.results || !data.results.length) { return; }
          
          //retrieve last message
          var mostRecentMessage = data.results[data.results.length-1];
          //give the first element in the .chat span the roomname
          var displayedRoom = $(".chat span").first().data("roomname");
          app.stopSpinner();
          //Update DOM if there are new messages
          if(mostRecentMessage.objectId !== app.lastMessageID || app.roomname !== displayedRoom){
            //make created rooms available to all
            app.populateRooms(data.results);

            //update app with fetched messages
            app.populateMessages(data.results, animate);

            //store ID of most recent message
            app.lastMessageID = mostRecentMessage.objectId;
          }
        },
        error: function (data) {
          // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
          console.error('chatterbox: Failed to send message');
        }
      });
    },

    clearMessages : function(){
      app.$chats.html("");
      // var node = document.getElementById("chats");
      // while(node.firstChild){
      //   node.removeChild(node.firstChild);
      // }
    },

    populateMessages : function(results, animate){
      //clear existing messages
      app.clearMessages();
      app.stopSpinner();
      if(Array.isArray(results)){
          //add all fetched messages
          results.forEach(app.addMessage);
      }

      //Make it scroll to the bottom, why?....
      var scrollTop = app.$chats.prop("scrollHeight");
      if(animate){
        app.$chats.animate({
          scrollTop: scrollTop
        });
      } else {
        app.$chats.scrollTop(scrollTop);
      } 
    },

    populateRooms : function(results){
      //WHAT?!
      app.$roomSelect.html('<option value ="__newRoom">New room...</option value="" selected>Lobby</option></select>');

      if(results){
        var rooms = {};
        results.forEach(function(data){
          //sets the roomname property of the users message as the variable roomname
          var roomname = data.roomname;
          if(roomname && !rooms[roomname]){
            //add room to the room select menu
            app.addRoom(roomname);

            //set the room that was added to true
            rooms[roomname] = true;
          }
        });
      }

      //select the menu option??? porque.
      //switched to the newly added room? 
      app.$roomSelect.val(app.roomname);
    },

    addRoom : function(roomname){
      // var node = document.createElement("option");
      // var newRoom = document.createTextNode(roomName);
      // node.appendChild(newRoom);
      // document.getElementById("roomSelect").appendChild(node);
      
      //prevent SSX attacks by using jQuery.text method line 186 does the same thing
      var $option = $("<option/>").val(roomname).text(roomname);
      
      //Add to list of rooms
      app.$roomSelect.append($option);
    },


    addMessage : function(data){
      //check to see if message has a room name attached to it
      if(!data.roomname){
        //if not, place it in the 'lobby' chatroom
        data.roomname = "lobby";
      }

      //Only add messages if its room name matches the current roomname
      if(data.roomname === app.roomname){
        //create a div to hold the chats
        var $chat = $("<span class='chat'/>");
      }

      //Add in the message data using DOM methods to avoid XSS attacks
      var $username = $("<span class='username'/>");
      //store the username in the element's data
      $username.text(data.username + ": ").attr("data-username", data.username).attr("data-roomname", data.roomname).append($chat); 

      //add the friend class if the user is in the the friends obj
      if(app.friends[data.username] === true){
        $username.addClass("friend");

      //append the users message to the chat
      var $message = $("<br><span/>");
      $message.text(data.text).append($chat);

      //add the message to the chat
      app.$chats.append($chat);
      }
    },

    addFriend : function(evt){
      //set the variable username equal to string with the property name of data-username
      var username = $(evt).attr("data-username");

      //if the username is defined 
      if(username !== undefined){
        //lof that the user is being added as a friend
        console.log("chatterbox: Adding %s as a friend", username);

      //store as a friend
      app.friends[username] = true;

      //bold all previous messages by that person
      //escape the username in case it conatains a quote
      var selector = '[data-username="'+username.replace(/"/g, '\\\"')+'"]';
      //give the user the class of name
      var $username = $(selector).addClass("friend");
      }
    },

    saveRoom : function(evt){
      var selectIndex = app.$roomSelect.prop("selectedIndex");
      //new room is always the first option
      if(selectIndex === 0){
        //prompt user to enter room name
        var roomname = prompt("enter room name")
        //if user entered a room name
        if(roomname){
          //set it as the current room
          app.roomname = roomname;

          //add the room name to the menu
          app.$roomSelect.val(roomname);

          //fetch the messages to the new room
          app.fetch();
        } 
      } else {
        app.startSpinner();
        //store undefined if user did not give a room name
        app.roomname = app.$roomSelect.val();

        //fetch the messages to the new room
        app.fetch();
      }
    },
    


    handleSubmit : function(evt){
      // $(document).ready(function(){
        // $(".button").on("click", function();     
        // var userMessage = {};
        // userMessage.username = $("#username").val()
        // userMessage.text = $("#message").val()
        // app.addMessage(userMessage);
        // app.send(userMessage)
        // });
      // });
      var message = {
        username : app.username,
        text : app.$message.val(),
        roomname : app.roomname || "lobby"
      };

      app.send(message);

      //Stop the form form submitting
      evt.preventDefault();
    },

  };

}());






