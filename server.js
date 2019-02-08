const express = require('express');
var MongoClient = require('mongodb').MongoClient;
var path = require('path');

var url = "mongodb://admin:arena123@ds213715.mlab.com:13715/aves";

const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static(path.join(__dirname, 'SC3/dist/SC3')));

app.listen(8000, () => {
  console.log('Server started!');
});

app.route('/api/login').post((req, res) => {
	var user = req.body.username;
	var password = req.body.password;
	var data = null;
	MongoClient(url, { useNewUrlParser: true }).connect(function(err, db) {
	  if (err) return res.status(400).send(err);
	  var dbo = db.db('aves');
	  var collection  = dbo.collection('estudiante');
	  collection.findOne({'usuario': user}, (error, search) => {
			if(error) return res.status(400).send(error);
			if(search == null) {
				return res.status(401).send(error)
			} else {
				data = search;
				if(data.codigo == password){
					var tokens = dbo.collection('tokens');
					var new_id = guid();
					tokens.updateOne({'usuario': user}, {
						'usuario': user,
						'token': new_id
					}, { upsert : true }, (err, success)=> {
						if(err) return res.status(400).send(err);
						db.close();
						return res.status(200).send({"token": new_id});

					});	
				}
			}
			
	  });
	});

});

app.route('/api/removeFromAllList').post((req, res) => {
	var userId = req.body.userId
	MongoClient(url, { useNewUrlParser: true }).connect(function(e, db) {
		if(e) return res.status(400).send(e);
		var dbo = db.db('aves');
		var estudiantes  = dbo.collection('estudiante');
		estudiantes.updateOne(
			{"usuario": userId}, 
			{$set: {"id_lista": "0"} }, 
			(err, success) => {
				if(err) return res.status(400).send(err);
				db.close();
				return res.status(200).send({"msg": "success"});	
			}
		);
	});

});

app.route('/api/joinList').post((req, res) => {
	var n = req.body.number;
	var userId = req.body.userId
	MongoClient(url, { useNewUrlParser: true }).connect(function(e, db) {
		if(e) return res.status(400).send(e);
		var dbo = db.db('aves');
		var estudiantes  = dbo.collection('estudiante');
		estudiantes.updateOne(
			{"usuario": userId}, 
			{$set: {"id_lista": n} }, 
			(err, success) => {
				if(err) return res.status(400).send(err);
				db.close();
				return res.status(200).send({"msg": "success"});	
			}
		);
	});

});

/**
 * ruta: baseURL + /api/listas
 */
app.route('/api/listas').get((req, res)=>{
	var data = null;
	MongoClient(url, { useNewUrlParser: true }).connect(function(e, db) {
	  if(e) return res.status(400).send(e);
	  var dbo = db.db('aves');
	  var collection  = dbo.collection('lista');
		data = collection.find().toArray((err, data) => {
			if(err) return res.status(400).send(err);
			db.close();
			return res.status(200).send(data);
		});
		
	});
});

app.route('/api/infoLista/:number').get((req, res) => {
	var n = req.params.number;
	var data = null;
	MongoClient(url, { useNewUrlParser: true }).connect(function(err, db) {
	  if(err) return res.status(400).send(err);
	  var dbo = db.db('aves');
	  var collection  = dbo.collection('lista');
	  collection.findOne({"numero": parseInt(n)}, (error, search) => {
			if(error) return res.status(400).send(error);

			data = search;
			db.close();
			if(data == null){
				return res.status(400).send({"msg":"No se encontró la lista"});

			}
			return res.status(200).send(data);
	  });
	});
});

app.route('/api/infoEstudiante/:usuario').get((req, res) => {
	var usuarioId = req.params.usuario;
	var data = null;
	MongoClient(url, { useNewUrlParser: true }).connect(function(err, db) {
	  if (err) return res.status(400).send(err);
	  var dbo = db.db('aves');
	  var collection  = dbo.collection('estudiante');
	  collection.findOne({'usuario': usuarioId}, (error, search) => {
			if(error) return res.status(400).send(error);

			data = search;
			db.close();
			return res.status(200).send({data: data});
	  });
	});
});

app.route('/api/listaEstudiantes').get((req, res)=>{
	var data = null;
	MongoClient(url, { useNewUrlParser: true }).connect(function(e, db) {
	  if (e) return res.status(400).send(e);
	  var dbo = db.db('aves');
	  var collection  = dbo.collection('estudiante');
		data = collection.find().toArray((err, data) => {
			if(err) return res.status(400).send(err);
			db.close();
			return res.status(200).send(data);
		});
		
	});
});

app.route('*').get((req, res) => {
	res.sendFile(path.resolve('SC3/dist/SC3/index.html')); 
});


function guid() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		return v.toString(16);
	});
}