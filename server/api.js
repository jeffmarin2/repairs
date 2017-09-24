const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// data
let users = [
    { id: 1, uname: 'jmarin', pwd: 'j', role: 'manager' },
    { id: 2, uname: 'mmouse', pwd: 'm', role: 'user' },
    { id: 3, uname: 'dduck', pwd: 'd', role: 'user' }
];

let repairs = [
    { id: 1, desc: 'Fill Pothole', date: '2017-09-13', time: '07:00', assignedTo: '', completed: 'Not Completed', approved: 'Not Approved', comments: '' },
    { id: 2, desc: 'Replace Window', date: '2017-09-13', time: '08:00', assignedTo: 'mmouse', completed: 'Not Completed', approved: 'Not Approved', comments: 'See Superintendant' },
    { id: 3, desc: 'Drain Flood', date: '2017-09-13', time: '09:00', assignedTo: 'dduck', completed: 'Not Completed', approved: 'Not Approved', comments: 'Use Pump' },
    { id: 4, desc: 'Replace Another Window', date: '2017-09-13', time: '10:00', assignedTo: 'mmouse', completed: 'Not Completed', approved: 'Not Approved', comments: 'See Superintendant' }
];

// helper functions
function getNextId(array) {
    let max = 0;
    for (let i = 0; i < array.length; i = i + 1)
        if (array[i].id > max)
            max = array[i].id;
    return max + 1;
}

function sortById(array) {
    return array.sort((obj1, obj2) => obj1.id - obj2.id);
}

function getRepairStart(repair) {
    const start = new Date(Date.parse(repair.date + 'T' + repair.time + ':00.000Z'));
    start.setTime(start.getTime() + (start.getTimezoneOffset() * 60 * 1000));
    return start;
}

function checkForRepairCollisions(newRepair, repairs) {
    const newStart = getRepairStart(newRepair);
    let isCollision = false;
    let otherRepairDesc = '';

    for (let i = 0; i < repairs.length; i++) {
        const otherStart = getRepairStart(repairs[i]);
        const diff = newStart.getTime() - otherStart.getTime();

        if (diff >= 0 && diff < (60 * 60 * 1000)) {
            isCollision = true;
            otherRepairDesc = repairs[i].desc;
            break;
        }
    }

    const ret = {
        isCollision,
        otherRepairDesc
    };

    return ret;
}

// available to all
router.route('/login')
    .post((req, res) => {
        const filtered = users.filter(user => user.uname === req.body.uname && user.pwd === req.body.pwd);

        if (filtered.length > 0) {
            const token = jwt.sign({ uname: filtered[0].uname, role: filtered[0].role }, 'reactrepairs');
            res.status(200).send({ uname: filtered[0].uname, role: filtered[0].role, token });
        } else {
            res.status(404).send('No user found.');
        }
    });

router.route('/register')
    .post((req, res) => {
        const filtered = users.filter(user => user.uname === req.body.uname);
        if (filtered.length > 0) {
            res.status(404).send('User already exists.');
        } else {
            const token = jwt.sign({ uname: filtered[0].uname, role: filtered[0].role }, 'reactrepairs');
            const newUser = {
                uname: req.body.uname,
                pwd: req.body.pwd,
                role: 'user'
            };
            users.push(newUser);
            res.status(200).send({ uname: req.body.uname, role: 'user', token });
        }
    });

// only managers
router.route('/managers/users')
    .post((req, res) => {
        res.json(users);
    });

router.route('/managers/users/add')
    .post((req, res) => {
        const newUsers = [];
        newUsers.push(req.body);
        newUsers[0].id = getNextId(users);
        users.push(newUsers[0]);
        res.json(users);
    });

router.route('/managers/users/del')
    .post((req, res) => {
        const filtered = users.filter(user => user.id !== req.body.id);
        users = filtered;
        res.json(users);
    });

router.route('/managers/users/edit')
    .post((req, res) => {
        const filtered = users.filter(user => user.id !== req.body.id);
        users = filtered;
        users.push(req.body);
        users = sortById(users);
        res.json(users);
    });

router.route('/managers/repairs/add')
    .post((req, res) => {
        const filtered = users.filter(user => user.uname === req.body.assignedTo);
        if (filtered.length === 0) {
            res.status(404).send('User: ' + req.body.assignedTo + ' does not exist');
        } else {
            const newRepairs = [];
            newRepairs.push(req.body);

            const newRepair = newRepairs[0];
            const ret = checkForRepairCollisions(newRepair, repairs);

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
    .post((req, res) => {
        const filtered = repairs.filter(repair => repair.id !== req.body.id);
        repairs = filtered;
        res.json(repairs);
    });

router.route('/managers/repairs/edit')
    .post((req, res) => {
        let filtered = users.filter(user => user.uname === req.body.assignedTo);

        if (filtered.length === 0) {
            res.status(404).send('User: ' + req.body.assignedTo + ' does not exist');
        } else {
            filtered = repairs.filter(repair => repair.id !== req.body.id);

            const edittedRepair = req.body;
            const ret = checkForRepairCollisions(edittedRepair, filtered);

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
    .post((req, res) => {
        const filtered = repairs.filter((repair) => {
            let passed = true;
            if (req.body.date)
                passed = (repair.date === req.body.date);
            if (passed && req.body.time)
                passed = (repair.time === req.body.time);
            if (passed && req.body.assignedTo)
                passed = (repair.assignedTo === req.body.assignedTo);
            if (passed && req.body.completed)
                passed = (repair.completed === req.body.completed);
            return passed;
        });
        res.json(filtered);
    });

// only users
router.route('/users/repairs/:uname')
    .post((req, res) => {
        const filtered = repairs.filter((repair) => {
            let passed = (repair.assignedTo === req.params.uname);
            if (passed && req.body.date)
                passed = (repair.date === req.body.date);
            if (passed && req.body.time)
                passed = (repair.time === req.body.time);
            if (passed && req.body.completed)
                passed = (repair.completed === req.body.completed);
            return passed;
        });
        res.json(filtered);
    });

router.route('/users/repairs/complete/:uname')
    .post((req, res) => {
        let filtered = repairs.filter(repair => repair.id === req.body.repairid);
        filtered[0].completed = 'Completed';

        filtered = repairs.filter(item => item.assignedTo === req.params.uname);
        res.json(filtered);
    });

module.exports = router;
