const lib = require('lib')({token: process.env.STDLIB_TOKEN});

let rooms = {
  "lone star": "the smaller board room up front on the first floor",
  "texas": "the big conference room up front on the first floor",
  "fredericksburg": "the room behind the reception area on the first floor",
  "spicewood": "the room by the stairs on the first floor",
  "zilker park": "the small one on one room on the first floor",
  "barton springs": "the small one on one room on the first floor",
  "capitol": "the small one on one room on the second floor",
  "pennybacker": "the room by finance on the third floor",
  "lake travis": "the room outside the mens bathroom on the third floor",
  "new braunfels": "the room in the center of the building on the first floor",
  "austin": "the room in the center of the building on the second floor",
  "round rock": "the room in the center of the building on the third floor"
};

function getConferenceRoom(room) {
  let found = sanitizeRoom(room);
	if (found) {
  	return `${room}? That is ${found}`;
  }
  return `I don't know which room that is: ${room}`;
}

function sanitizeRoom(room) {
  room = room.toLowerCase();
  if (room.startsWith('cr_')){
    room = room.substring(3);
  }
  return rooms[room];
}


/**
* /rivership command to ask where a conference room is
*
*   See https://api.slack.com/slash-commands for more details.
*
* @param {string} user_name The user id of the user that invoked this command (name is usable as well)
* @param {string} channel_name The channel id the command was executed in (name is usable as well)
* @param {string} text The text contents of the command
* @param {string} command The full Slack command object
* @param {string} botToken The bot token for the Slack bot you have activated
* @returns {object}
*/
module.exports = (user_name, channel_name, text = '', command = "", botToken = null, callback) => {
  let message = '';
  if (text){
    message = getConferenceRoom(text);
  }
  else {
    message = "You need to tell me a room name, silly.";
  }
    

  callback(null, {
    response_type: 'ephemeral',
    text: `${message}`
  });

};
