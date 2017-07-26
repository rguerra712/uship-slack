const lib = require('lib')({token: process.env.STDLIB_TOKEN});
const rivership = require('rivership-functions');

let days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
  "tomorrow"
];

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function isLunchQuery(text) {
  var isLunch = text.toLowerCase().indexOf('lunch') !== -1;
  return isLunch;
}

function getDay(text) {
  for (var dayIndex in days) {
    var day = days[dayIndex];
    if (text.indexOf(day) !== -1) {
      return days[dayIndex];
    }
  }
  return;
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
  let callCallback = message => {
    callback(null, {
        response_type: 'in_channel',
        text: `@${user_name}: ${message}`
      });
  }
  var tokens = text.split(' ');
  var command = tokens[0].toLowerCase();
  var input = '';

  
  if (isLunchQuery(text)) {
    var day = getDay(text);
    if (day) {
      rivership.whatIsLunch(day)
        .then(result => callCallback(`${capitalizeFirstLetter(day)}'s Lunch: ${result}`))
        .catch(error => callCallback(`I'm not sure what's for lunch on: ${day}.`));
    }
    else {
      rivership.whatIsLunch()
        .then(result => callCallback(`Today's Lunch: ${result}`))
        .catch(error => callCallback(`I'm not sure what's for lunch today.`));
    }
  } 
  else if (command == 'where') {
    if (tokens[1] == 'is') {
      input = tokens.slice(2).join(' ');
    }
    else {
      input = tokens.slice(1).join(' ');
    }

    rivership.whereIs(input)
      .then(result => callCallback(`${input}? ${result}`))
      .catch(error => callCallback(`I'm not sure.`));
      //.catch(error => callCallback(`I'm not sure. Geek stuff here: ${JSON.stringify(input)} ${JSON.stringify(error)}`));
  }
  else {
    callCallback(`Ask me \`where <someone | some room>\` is or ask me \`what's for lunch <optional day>\`.`);
  }
};
