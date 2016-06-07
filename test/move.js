var chai = require('chai');
var expect = chai.expect;
var move = require('../routes/move');
var fixture = require('../test/fixture');
var Player = require('../models/player').Player;

describe('Tests for move routes', function() {

  before(function() {
    fixture.createTestDB();
  });
  
  after(function() {
	fixture.dropTestDB();
  });
	
  beforeEach(function() {
    this.isLegal = move.isLegal;
  });

  afterEach(function() {
  });

  describe('isLegal', function() {
    it('should test for invalid rows', function() {
      //expect(this.isLegal(fixture.player1, null, fixture.move)).to.be.false;
      expect(true).to.be.false;
    });
  });
});
