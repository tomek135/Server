var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cors = require('cors');
var wiadomosc = "a";
var fs = require('fs');
var PORT = 3000;
//var http = require('http').Server(app);
var server    = app.listen(PORT);
var io = require('socket.io').listen(server);
var jsonObject = require("./history.json");
app.use(bodyParser.urlencoded({ extended:false}));
app.use(bodyParser.json());
app.use(cors());


app.get('/', function(req, res){
  res.sendFile("index.html", {"root": __dirname});
})

app.get('/templates.json', function(req, res){
  res.sendFile("templates.json", {"root": __dirname});
})

app.get('/history.json', function(req, res){
  res.sendFile("history.json", {"root": __dirname});
})

app.get('/styles.css', function(req, res){
  res.sendFile("styles.css", {"root": __dirname});
})

// Nasłuchujemy eventu 'connection', który jest automatycznie wysyłany przez klienta (nie musimy go definiować)
io.on('connection', function(socket){
	// Nasłuchujemy eventu 'message', który zostaje wysłany przez klienta w momencie wysyłania wiadomości
    socket.emit('welcome', { message: 'Welcome!', id: socket.id });
    socket.on('i am client', console.log);
});


	app.post('/', function(req,res){
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear();
		var hh = today.getHours();
		var min = today.getMinutes();
		var ss = today.getSeconds();
		
		if(dd<10) {
			dd = '0'+dd
		} 

		if(mm<10) {
			mm = '0'+mm
		} 
		
		if(hh<10) {
			hh = '0'+hh
		} 

		if(min<10) {
			min = '0'+min
		} 
		
		if(ss<10) {
			ss = '0'+ss
		} 
		
		var date = yyyy+'-'+mm+'-'+dd;
		var time = hh + ":" + min + ":" + ss;
		
		var dateTime = date+' '+time;
		
		jsonObject.messages.push({
			date: dateTime,
			message: req.body.message
		});
		//jsonObject.messages.date = dateTime;
		//jsonObject.messages.message = req.body.message;
		fs.writeFile("history.json", JSON.stringify(jsonObject), "utf8", function(err) {
			if (err) throw err;
			console.log("File saved.");
		});
		wiadomosc = "["+ dateTime + "]:" + " "+ req.body.message;
		console.log("["+ dateTime + "]:" + " "+ req.body.message);
		io.emit('time', { time: wiadomosc});
		writeToFile(wiadomosc);
		var response = "Wiadomość została wysłana.";
		res.sendStatus(200);
	});

console.log("App listening at port: "+ PORT);

function writeToFile(data){
	// file.on('error', function(err) { /* error handling */ });
    data += "\r\n";
	fs.appendFileSync("history.txt", data);
} 



  