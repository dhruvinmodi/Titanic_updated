var express = require('express');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');

var webapp = express();
const ip = '127.0.0.1';
const port = 8082;

webapp.use(bodyParser.urlencoded({ extended: true })); 

var server = webapp.listen(port, ip, function(){

	console.log('connected successfully');

});
webapp.get('/',function(req, res){

	try{

		res.sendFile(__dirname + "/index.html")

	}catch(err){

		console.log(err);

	}

});
webapp.get('/home',function(req, res){

	try{

		res.sendFile(__dirname + "/prediction.html")

	}catch(err){

		console.log(err);

	}

});
webapp.post('/predict',function(req, res){

	try{

		console.log(req.body);
		var weight = [-0.87648865,  2.67402726, -0.12964388,  0.206367,    0.40420933, -0.25887928, -0.61956434, -0.63096111];
		var pclass = parseInt(req.body.pclass) * weight[0]
		var sex = parseInt(req.body.sex) * weight[1]
		var age = parseInt(req.body.age) * weight[2]
		var sib = parseInt(req.body.sib) * weight[3]
		var parch = 0
		var emb = req.body.emb * weight[5]
		var fsize = (parseInt(req.body.sib) + 1) * weight[6]
		var isalone = 0;
		if(parseInt(req.body.sib) + 1 == 1){
			isalone = weight[7]
		}
		if(sigmoid(pclass + sex + age + sib + parch + emb + fsize + isalone) >= 0.5){
			res.json({"key": "survived"});
		}else{
			res.send({"key": "died"});
		}
	}catch(err){

		console.log(err);

	}

});
function sigmoid(t) {
    return 1/(1+Math.pow(Math.E, -t));
}