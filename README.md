Spray and Pray Realtime Multiplayer Browser Game
=============================
For CS494 Final Project

Looking to play some weird multiplayer game with a half-baked concept behind it?
Look somewhere else - this game is legit. 
Choose (get assigned?) a side - GMO Touting Bad Argiculture meets Industry!
OR! Sustainable farm that uses lady bugs and stuff.
(I mean, the sustainable farm loses every time right?)
NO! We made the rules and they could be balanced! (they aren't)

Select a crop, and then plant a crop near your farm. Once a crop is selected, 
you don't have to reselect it. It's a two tile distance limit!

You can put down another farm by selecting it from the menu. There are also 
three other buttons that currently do not do a thing! HOW EXCITING!

If you reach a critical mass of money, you can monopolize and destroy your competition
because that is the obvious goal of any business. THEN YOU WIN! Just earn 5000 to win... 

Don't hesitate! Go online and despair as you realize no one else is playing this 
and the single player mode has been 86'd. 

Please see the attached RFC for the real purpose of this assignment, to make a application layer proctol.
It is currently not fully implemented, because browsers will not allow a direct TCP connection.
(should of thought about that before commiting). Right now the custom procotol uses a Socket.IO/Websocket proxy,
where it sends and recieves messages without using any of the parsing capabilities or extra events that come
with them. Basically we are sending Websocket frames that are so barebones they barely contain anything else
except for our protocol header frame embedded in their payloads. 

View the demo here :
http://68.66.233.10:4004/

## Getting started (Using npm package.json)
* Get node.js
* run `npm install` inside the cloned folder
* run `node app.js` inside the cloned folder
* Visit http://127.0.0.1:4004/?debug

## Getting started (Manual install)

* Get node.js
* Install socket.io `npm install socket.io`
* Install node-udid `npm install node-uuid`
* Install express `npm install express`
* Run `node app.js` inside the cloned folder
* Visit http://127.0.0.1:4004/?debug

## License

MIT Licensed. 
See LICENSE if required.

