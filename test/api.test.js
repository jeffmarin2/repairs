//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
let async = require('async');

chai.use(chaiHttp);

var token = '', base = 'http://localhost:8081';

function p(url, data, status, done) {
		chai.request(base)
		.post(url)
		.set('x-access-token', token)
		.send(data)
		.end((err, res) => {
			res.should.have.status(status);
			done(null, res.body);
		});	
}

describe('API Tests', () => {
	it('Cannot get user list without a login token', (done) => {
		p('/api/managers/users', '', 401, done);
	});

	it('Bad Login', (done) => {
		let manager = {uname:'jmarin', pwd:'j2'};
		p('/api/login', manager, 404, done);
	});

	it('Login and Create New User', (done) => {
		async.waterfall([
			function(cbAsync) {
				let manager = {uname:'jmarin', pwd:'j'};
				p('/api/login', manager, 200, cbAsync);
			},
			function(body, cbAsync) {
				token = body.token;
				p('/api/managers/users', '', 200, cbAsync);
			},
			function(body, cbAsync) {
				body.should.have.lengthOf(3);

				var newuser = {id: 4, uname:'daffy', pwd:'duck', role:'user'};
				p('/api/managers/users/add', newuser, 200, cbAsync);
			},
			function(body, cbAsync) {
				body.should.have.lengthOf(4);
				done();
			}
		])
	});
});