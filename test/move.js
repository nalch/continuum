var chai = require('chai');
var expect = chai.expect;

var moveModule = require('../routes/move');
var fixture = require('../test/fixture');

var BoardPiece = require('../models/game').BoardPiece;
var Player = require('../models/player').Player;

describe('Test for Routes: Move', function() {

  before(function (done) {
    fixture.createTestDB(done);
  });
  
  after(function () {
	fixture.dropTestDB();
  });
	
  beforeEach(function () {
  });

  afterEach(function () {
  });

  describe('#isLegal', function() {
    it('should test for invalid rows', function() {
    	return fixture.player1.exec().then(function (player1) {
    	  return fixture.player2.exec().then(function (player2) {
    		return fixture.testgamePlaying.populate('owner opponent').exec().then(function (game) {
    			var testmove = {
				  game: game._id,
				  number: game.moves.length + 1,
				  column: -8,
				  downward: false
				};
    		  // column is not in bounds
			  expect(moveModule.isLegal(player1, game, testmove)).to.be.false;
			  testmove.downward = true;
			  expect(moveModule.isLegal(player1, game, testmove)).to.be.false;
    		});
    	  });
    	});
    });
    
    it('should test for the right player\'s turn', function() {
    	return fixture.player1.exec().then(function (player1) {
    	  return fixture.player2.exec().then(function (player2) {
    		return fixture.testgamePlaying.populate('owner opponent').exec().then(function (game) {
    		  var testmove = {
				game: game._id,
				number: game.moves.length + 1,
				column: 2,
				downward: false
			  };
    		  // owner wants to set move
    		  expect(moveModule.isLegal(player1, game, testmove)).to.be.true;
    		  // opponent wants to set move
    		  expect(moveModule.isLegal(player2, game, testmove)).to.be.false;
    	      testmove.number = testmove.number + 1;
    	      expect(moveModule.isLegal(player2, game, testmove)).to.be.true;
    	      expect(moveModule.isLegal(player1, game, testmove)).to.be.false;
    	      testmove.number = game.moves.length + 1;
    		});
    	  });
    	});
    });
    
    it('should test for full columns', function() {
    	return fixture.player1.exec().then(function (player1) {
    	  return fixture.player2.exec().then(function (player2) {
    		return fixture.testgamePlaying.populate('owner opponent').exec().then(function (game) {
    		  var testmove = {
				game: game._id,
				number: game.moves.length + 1,
				column: 2,
				downward: true
			  };
    		  
    		  game.board[2][2] = BoardPiece.OWNER;
    		  game.board[1][2] = BoardPiece.OPPONENT;
    		  game.board[0][2] = BoardPiece.OWNER;
    		  game.board[3][2] = BoardPiece.OPPONENT;
    		  /*
    		   * 0 - - X
    		   * 1 - - O
    		   * 2 - - X
    		   * 3 - - O
    		   * 4 - - -
    		   */
    		  
    		  expect(moveModule.isLegal(player1, game, testmove)).to.be.false;
    		  testmove.downward = false;
    		  expect(moveModule.isLegal(player1, game, testmove)).to.be.true;
    		  
    		  game.board[4][2] = BoardPiece.OWNER;
    		  expect(moveModule.isLegal(player1, game, testmove)).to.be.false;
    		});
    	  });
    	});
    });

  });
  
  describe('#isFinished', function() {
    it('should return false for not finished games', function() {
      return fixture.testgamePlaying.populate('owner opponent').exec().then(function (game) {
    	game.board[2][2] = BoardPiece.OWNER.value;
    	expect(moveModule.isFinished(game, {column: 2, row: 2})).to.be.false;
    	
		game.board[1][2] = BoardPiece.OPPONENT.value;
		game.board[0][2] = BoardPiece.OWNER.value;
		expect(moveModule.isFinished(game, {column: 2, row: 2})).to.be.false;
      });
    });
    
    it('should return true for finished games', function() {
	  return fixture.testgamePlaying.populate('owner opponent').exec().then(function (game) {
	  	game.board[2][2] = BoardPiece.OWNER.value;
	  	game.board[1][2] = BoardPiece.OWNER.value;
		game.board[0][2] = BoardPiece.OWNER.value;
		game.board[3][2] = BoardPiece.OWNER.value;
		expect(moveModule.isFinished(game, {column: 2, row: 2})).to.be.true;
	    });
	  });
  });
});
