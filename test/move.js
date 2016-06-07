var chai = require('chai');
var expect = chai.expect;
var move = require('../routes/move');
var fixture = require('../test/fixture');
var Player = require('../models/player').Player;

describe('Tests for move routes', function() {

  before(function(done) {
	this.timeout(10000);
    fixture.createTestDB(done);
  });
  
  after(function() {
	fixture.dropTestDB();
  });
	
  beforeEach(function(done) {
    this.isLegal = move.isLegal;
    done();
  });

  afterEach(function() {
  });

  describe('isLegal', function() {
    it('should test for invalid rows', function() {
    	return fixture.player1.exec().then(function (player1) {
    	  return fixture.player2.exec().then(function (player2) {
    		expect(player1.publicId).to.equal('testplayer1');
    	  });
    	});
    });

  });
});
