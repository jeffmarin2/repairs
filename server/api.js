var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

// data
var users = [
	{ id: 1, uname: 'jmarin', pwd: 'j', role: 'manager'},
	{ id: 2, uname: 'mmouse', pwd: 'm', role: 'user'},
	{ id: 3, uname: 'dduck', pwd: 'd', role: 'user'}
];

var repairs = [
	{ id: 1, desc: 'Fill Pothole', date: '2017-09-13', time:'07:00', assignedTo: '', completed: 'Not Completed', approved: 'Not Approved', comments: ''},
	{ id: 2, desc: 'Replace Window', date: '2017-09-13', time:'08:00', assignedTo: 'mmouse', completed: 'Not Completed', approved: 'Not Approved', comments: 'See Superintendant'},
	{ id: 3, desc: 'Drain Flood', date: '2017-09-13', time:'09:00', assignedTo: 'dduck', completed: 'Not Completed', approved: 'Not Approved', comments: 'Use Pump'},
	{ id: 4, desc: 'Replace Another Window', date: '2017-09-13', time:'10:00', assignedTo: 'mmouse', completed: 'Not Completed', approved: 'Not Approved', comments: 'See Superintendant'},
];

// helper functions
function getNextId(array) {
	var max = 0;
	for(var i=0; i<array.length;i++)
		if (array[i].id > max)
			max = array[i].id;
	return max+1;
}

function sortById(array) {
	return array.sort(function(obj1, obj2) {
		return obj1.id-obj2.id;
	})
}

function getRepairStart(repair) {
	var start = new Date(Date.parse(repair.date + 'T' + repair.time + ':00.000Z'));
	start.setTime(start.getTime()+start.getTimezoneOffset()*60*1000);
	return start;
}

function checkForRepairCollisions(newRepair, repairs) {
	var newStart = getRepairStart(newRepair);
	var isCollision = false, otherRepairDesc = '';

	for(var i=0;i<repairs.length;i++) {
  	var otherStart = getRepairStart(repairs[i]);
  	var diff = newStart.getTime() - otherStart.getTime();

  	if (diff > 0 && diff < (60*60*1000)) {
			isCollision = true;
			otherRepairDesc = repairs[i].desc;
			break;
		}
	}

	var ret = {
		isCollision: isCollision,
		otherRepairDesc: otherRepairDesc
	};

	return ret;
}

// available to all
router.route('/login')
	.post(function(req, res) {
		var filtered=users.filter(function(user){
			return (user.uname==req.body.uname) && (user.pwd==req.body.pwd);
		});

		if (filtered.length > 0) {
			var token = jwt.sign({ uname: filtered[0].uname, role: filtered[0].role }, 'reactrepairs');
    	res.status(200).send({ uname: filtered[0].uname, role: filtered[0].role, token: token });
		} else {
			res.status(404).send('No user found.');
		}
	});

router.route('/register')
	.post(function(req, res) {
		var filtered=users.filter(function(user){
			return (user.uname==req.body.uname);
		});

		if (filtered.length > 0) {
			res.status(404).send('User already exists.');
		} else {
			var token = jwt.sign({ uname: filtered[0].uname, role: filtered[0].role }, 'reactrepairs');
    	var newUser = {
    		uname: req.body.uname,
    		pwd: req.body.pwd,
    		role: 'user'
    	}
    	users.push(newUser);
    	res.status(200).send({ uname: req.body.uname, role: 'user', token: token });
		}
	});

// only managers
router.route('/managers/users')
	.post(function(req, res) {
		res.json(users);
	});

router.route('/managers/users/add')
	.post(function(req, res) {
		var newUsers = [];
  	newUsers.push(req.body);
  	newUsers[0].id = getNextId(users);
  	users.push(newUsers[0]);
  	res.json(users);
	});

router.route('/managers/users/del')
	.post(function(req, res) {
		var filtered=users.filter(function(user){
			return user.id!=req.body.id;
		});
		users = filtered;
  	res.json(users);
	});	

router.route('/managers/users/edit')
	.post(function(req, res) {
		var filtered=users.filter(function(user){
			return user.id!=req.body.id;
		});
		users = filtered;
		users.push(req.body);
		users = sortById(users);
  	res.json(users);
	});	

router.route('/managers/repairs/add')
	.post(function(req, res) {
		var filtered=users.filter(function(user){
			return user.uname==req.body.assignedTo;
		});

		if (filtered.length == 0) {
			res.status(404).send('User: ' + req.body.assignedTo + ' does not exist');
		} else {

			var newRepairs = [];
	  	newRepairs.push(req.body);

	  	var newRepair = newRepairs[0];

			var ret = checkForRepairCollisions(newRepair, repairs);
			if (ret.isCollision)
				res.status(404).send('This will collide with ' + ret.otherRepairDesc);
			else {
		  	newRepairs[0].id = getNextId(repairs);
		  	repairs.push(newRepairs[0]);
		  	res.json(repairs);
		  }
	  }
	});

router.route('/managers/repairs/del')
	.post(function(req, res) {
		var filtered=repairs.filter(function(repair){
			return repair.id!=req.body.id;
		});

 		repairs = filtered;
  	res.json(repairs);
	});	

router.route('/managers/repairs/edit')
	.post(function(req, res) {
		var filtered=users.filter(function(user){
			return user.uname==req.body.assignedTo;
		});

		if (filtered.length == 0) {
			res.status(404).send('User: ' + req.body.assignedTo + ' does not exist');
		} else {
			filtered=repairs.filter(function(repair){
				return repair.id!=req.body.id;
			});

	  	var edittedRepair = req.body;
			var ret = checkForRepairCollisions(edittedRepair, filtered);
			if (ret.isCollision)
				res.status(404).send('This will collide with ' + ret.otherRepairDesc);
			else {
				repairs = filtered;
				repairs.push(req.body);
				repairs = sortById(repairs);
				res.json(repairs);
			}
		}
	});

router.route('/managers/repairs')
	.post(function(req, res) {
		var filtered=repairs.filter(function(repair){
			var passed = true;
			if (req.body.date)
				passed = (repair.date==req.body.date);
			if (passed && req.body.time)
				passed = (repair.time==req.body.time);
			if (passed && req.body.assignedTo)
				passed = (repair.assignedTo==req.body.assignedTo);
			if (passed && req.body.completed)
				passed = (repair.completed==req.body.completed);
			return passed;
		});

		res.json(filtered);
	});

// only users
router.route('/users/repairs/:uname')
	.post(function(req, res) {
		var filtered=repairs.filter(function(repair){
			var passed = (repair.assignedTo==req.params.uname);
			if (passed && req.body.date)
				passed = (repair.date==req.body.date);
			if (passed && req.body.time)
				passed = (repair.time==req.body.time);
			if (passed && req.body.completed)
				passed = (repair.completed==req.body.completed);
			return passed;
		});
		res.json(filtered);
	});

router.route('/users/repairs/complete/:uname')
	.post(function(req, res) {
		var filtered=repairs.filter(function(repair){
			return repair.id==req.body.repairid;
		});
		filtered[0].completed = 'Completed';

		filtered=repairs.filter(function(item){
			return item.assignedTo==req.params.uname;
		});
		res.json(filtered);
	});	

module.exports = router;
