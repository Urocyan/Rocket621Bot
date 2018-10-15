'use strict'

process.env.NTBA_FIX_319 = 1;

const TelegramBot = require('node-telegram-bot-api');
const token = '582555840:AAFQfHD3db2kc4CS6vWciSYlQnxpFI-L-3c';
const bot = new TelegramBot(token, {polling:true});
const request = require('request');
var fs = require("fs");
var options = {
  url: 'https://e621.net/post/index.json?tags=zaush&limit=10',
  headers: {
    'User-Agent': 'RocketBot/1.0 (by Derfeuerfuchs on e621)'
  }
};

var thisChat;
var tagText;
function getResult() {
	if(tagText.indexOf("/start") < 0) {
	options['url'] = 'https://e621.net/post/index.json?tags=order:score%20'+tagText+'&limit=15';
	console.log(options['url']);
	request(options, callback);	
	}
}
function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}
bot.on('polling_error', (error) => {
	var time = new Date();
	console.log("TIME:", time);
	console.log("CODE:", error.code);  // => 'EFATAL'
	console.log("MSG:", error.message);
	console.log("STACK:", error.stack);
});

function callback(error, response, body) {
  if (!error && response.statusCode == 200) {
	var info = JSON.parse(body);
	if(!(isEmptyObject(info))) {
	console.log(info);
	var length = info.length;
	var randIndex = 0;
	if(length < 15) {
		randIndex = Math.floor(Math.random() * Math.floor(length));
	}
	else {
		randIndex = Math.floor(Math.random() * Math.floor(15));
	}
	var botPic = info[randIndex].file_url;
	var botCap = info[randIndex].artist;
	for(let i = 0; i < 30; i++) {
		let randIndex = Math.floor(Math.random() * Math.floor(15));
		if(botPic.indexOf("swf") > 0) {
			botPic = info[randIndex].file_url;
			botCap = info[randIndex].artist;
			botPic = botPic.toString();
			botCap = botCap.toString();
		}
		else {
			break;
		}
	}
    console.log(info);
	console.log(thisChat);
	if(botPic.indexOf("swf") < 0 && thisChat != null) {
		if(botPic.indexOf("webm") < 0 && botPic.indexOf("mp4") < 0) {
		console.log(thisChat + " " + botPic + " " + botCap);
		bot.sendPhoto(thisChat, botPic);
		}
		else if(botPic.indexOf("webm") > 0) {
			bot.sendMessage(thisChat, botPic);
		}
		else if(botPic.indexOf("mp4") > 0) {
			bot.sendMessage(thisChat, botPic);
		}
		bot.sendMessage(thisChat, "Artist: " + botCap, {
			reply_markup: {
			inline_keyboard: [[{
            text: "More",
            callback_data: "result",
        }]],
		},
		}).then(function() {
		console.log('message sent');
		}).catch(console.error);
	}
	else {
		bot.sendMessage(thisChat, "something went wrong.");
	}
  }
  else {
	  bot.sendMessage(thisChat, "No results.");
  }
  }
}
var q_query;
var q_id;
var userSent;
function callbackInline(error, response, body) {
  var returnJSON = null;
  if (!error && response.statusCode == 200) {
	var info = JSON.parse(body);
	if(!(isEmptyObject(info))) {		
	returnJSON = info;
	getInlineResults(returnJSON);
	}
  }
}
function getInlineResults(returnJSON) {
    
//  var q_from = msg.from;
//  var q_offset = msg.offset;

    var results = [];
	
	if(!(isEmptyObject(returnJSON))) {
	if(returnJSON != null) {	
	console.log(returnJSON);
	for(let i = 0; i < returnJSON.length; i++) {
		if(returnJSON[i].file_ext.indexOf("swf") < 0 && returnJSON[i].file_ext.indexOf("webm") < 0 && returnJSON[i].file_ext.indexOf("mp4") < 0) {
			console.log(returnJSON[i].file_ext);
			if(returnJSON[i].file_url.indexOf("gif") == -1) {
			var InlineQueryResultPhoto = {
					'type': 'photo', 
					'photo_url': returnJSON[i].file_url,
					'thumb_url': returnJSON[i].sample_url,
					'id': returnJSON[i].id,
					'photo_width': 48,
					'photo_height': 48
				};
			results.push(InlineQueryResultPhoto);
			}
			else {
				var InlineQueryResultGif = {
					'type': 'gif', 
					'gif_url': returnJSON[i].file_url,
					'thumb_url': returnJSON[i].sample_url,
					'id': returnJSON[i].id,
					'gif_width': 48,
					'gif_height': 48
				};
			results.push(InlineQueryResultGif);
			console.log(returnJSON[i].file_ext+" is a gif");
			}
		}
	}
	bot.answerInlineQuery(q_id, results);
	}
	}
}

bot.on('message', (msg) => {
	if(msg.from.username == "antlr") {
			bot.sendMessage(msg.chat.id, "You lost your bot privileges.");
	}
	else if(msg.from.username == "Rockitsune") {
	bot.sendMessage(msg.chat.id, "Hey, daddy");
	tagText = msg.text.toString();
	thisChat = msg.chat.id;
	getResult();
	}
	else {
	tagText = msg.text.toString();
	if(tagText.indexOf(" ") > -1) {
		tagText.replace(/ /g,"%20");
	}
	thisChat = msg.chat.id;
	getResult();	
	}
});

bot.on("callback_query", (callbackQuery) => {
    const message = callbackQuery.message;
	const callData = callbackQuery.data;
	console.log(callData);
	if(callData == "result") {
			thisChat =callbackQuery.message.chat.id;
			console.log(callData);
			getResult();
	}		
    bot.answerCallbackQuery(callbackQuery.id)
        .then(() => function() { 
		if(callData == "result") {
			console.log(callData);
			getResult();
		}		
		console.log(callData);
		});
});

bot.on('inline_query', function(msg)
{
	options['url'] = "https://e621.net/post/index.json?tags=order:score%20date:week&limit=10";
	q_query = msg.query.toString();
	q_id = msg.id;
	userSent = msg.from.username;
	if(q_query == "/say") {
		var results = [];
		
		var InlineQueryResultArticle = {
			type: "article",
			id: q_id,
			title: "He's Right",
			input_message_content: {
				message_text: msg.from.first_name+" is right. Totally makes sense.",
			}
		};
		results.push(InlineQueryResultArticle);
		bot.answerInlineQuery(q_id, results);
	}
	else {
	if(q_query.indexOf(" ") > -1) {
	options['url'] = "https://e621.net/post/index.json?tags=order:score%20";
		q_query = q_query.split(" ");
		for(let i = 0; i < q_query.length; i++) {
			if(i < (q_query.length - 1)) {
					options['url'] += (q_query[i] + "%20");
			}
			else {
					options['url'] += (q_query[i] + "&limit=15");
			}
		}
	}
	else {
		options['url'] = "https://e621.net/post/index.json?tags=order:score%20"+q_query+"&limit=10";
	}
	console.log(options['url']);
	request(options, callbackInline);
	}
});
bot.on('chosen_inline_result', function(msg)
{
    console.log('Chosen:' + msg);
});
