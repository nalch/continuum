var chai = require('chai');
var dirtyChai = require('dirty-chai');
chai.use(dirtyChai);
var expect = chai.expect;
var Matrix = require('node-matrix');

var fixture = require('../test/fixture');
var moveModule = require('../routes/move');

var BoardPiece = require('../models/game').BoardPiece;

/**
 * Return a new matrix with some default values (fields, that are not specified
 * are filled with BoardPiece.UNDEFINED.value)
 * @param {list} mapping a list of lists, that describe the fields content
 *   [[1,1,6],[1,2,7]] ->
 *   { '0': [ 0, 0, 0, 0, 0, 0, 0 ],
       '1': [ 0, 6, 7, 0, 0, 0, 0 ],
       '2': [ 0, 0, 0, 0, 0, 0, 0 ],
       '3': [ 0, 0, 0, 0, 0, 0, 0 ],
       '4': [ 0, 0, 0, 0, 0, 0, 0 ],
       numRows: 5,
       numCols: 7,
       dimensions: [ 5, 7 ]
     }
 * @return {Matrix} a Matrix (node-matrix) with the defined fields
 */
var prepareBoard = function(mapping) {
  var matrix = new Matrix({
    rows: 5,
    columns: 7,
    values: BoardPiece.UNDEFINED.value
  });

  for (var i = 0; i < mapping.length; i++) {
    matrix[mapping[i][0]][mapping[i][1]] = mapping[i][2];
  }

  return matrix;
};

describe('Test for Routes: Move', function() {
  before(function(done) {
    fixture.createTestDB(done);
  });

  after(function() {
    fixture.dropTestDB();
  });

  beforeEach(function() {
  });

  afterEach(function() {
  });

  describe('#isLegal', function() {
    it('should test for invalid rows', function() {
      return fixture.player1.exec().then(function(player1) {
        return fixture.testgamePlaying.populate('owner opponent').exec().then(function(game) {
          var testmove = {
            game: game._id,
            number: game.moves.length + 1,
            column: -8,
            downward: false
          };
          // column is not in bounds
          expect(moveModule.isLegal(player1, game, testmove)).to.be.false();
          testmove.downward = true;
          expect(moveModule.isLegal(player1, game, testmove)).to.be.false();
        });
      });
    });

    it('should test for the right player\'s turn', function() {
      return fixture.player1.exec().then(function(player1) {
        return fixture.player2.exec().then(function(player2) {
          return fixture.testgamePlaying.populate('owner opponent').exec().then(function(game) {
            var testmove = {
              game: game._id,
              number: game.moves.length + 1,
              column: 2,
              downward: false
            };
            // owner wants to set move
            expect(moveModule.isLegal(player1, game, testmove)).to.be.true();
            // opponent wants to set move
            expect(moveModule.isLegal(player2, game, testmove)).to.be.false();
            testmove.number += 1;
            expect(moveModule.isLegal(player2, game, testmove)).to.be.true();
            expect(moveModule.isLegal(player1, game, testmove)).to.be.false();
            testmove.number = game.moves.length + 1;
          });
        });
      });
    });

    it('should test for full columns', function() {
      return fixture.player1.exec().then(function(player1) {
        return fixture.testgamePlaying.populate('owner opponent').exec().then(function(game) {
          var testmove = {
            game: game._id,
            number: game.moves.length + 1,
            column: 2,
            downward: true
          };

          game.board = prepareBoard([
            [2, 2, BoardPiece.OWNER],
            [1, 2, BoardPiece.OPPONENT],
            [0, 2, BoardPiece.OWNER],
            [3, 2, BoardPiece.OPPONENT]
          ]);
          /*
           * 0 - - X
           * 1 - - O
           * 2 - - X
           * 3 - - O
           * 4 - - -
           */

          expect(moveModule.isLegal(player1, game, testmove)).to.be.false();
          testmove.downward = false;
          expect(moveModule.isLegal(player1, game, testmove)).to.be.true();

          game.board[4][2] = BoardPiece.OWNER;
          expect(moveModule.isLegal(player1, game, testmove)).to.be.false();
        });
      });
    });
  });

  describe('#isFinished', function() {
    it('should return false for not finished games', function() {
      return fixture.testgamePlaying.populate('owner opponent').exec().then(function(game) {
        game.board[2][2] = BoardPiece.OWNER.value;
        expect(moveModule.isFinished(game, {column: 2, row: 2})).to.be.false();

        game.board[1][2] = BoardPiece.OPPONENT.value;
        game.board[0][2] = BoardPiece.OWNER.value;
        expect(moveModule.isFinished(game, {column: 2, row: 2})).to.be.false();

        game.board = prepareBoard([
          [0, 2, BoardPiece.OWNER.value],
          [1, 2, BoardPiece.OPPONENT.value],
          [2, 2, BoardPiece.OWNER.value],
          [3, 2, BoardPiece.OPPONENT.value],
          [4, 2, BoardPiece.OWNER.value]
        ]);
        expect(moveModule.isFinished(game, {column: 2, row: 2})).to.be.false();

        game.board = prepareBoard([
          [2, 2, BoardPiece.OWNER.value],
          [2, 3, BoardPiece.OPPONENT.value],
          [3, 3, BoardPiece.OWNER.value]
        ]);
        expect(moveModule.isFinished(game, {column: 2, row: 2})).to.be.false();
      });
    });

    it('should return true for finished games', function() {
      return fixture.testgamePlaying.populate('owner opponent').exec().then(function(game) {
        game.board = prepareBoard([
          [2, 2, BoardPiece.OWNER.value],
          [1, 2, BoardPiece.OWNER.value],
          [0, 2, BoardPiece.OWNER.value],
          [3, 2, BoardPiece.OWNER.value]
        ]);
        expect(moveModule.isFinished(game, {column: 2, row: 2})).to.be.true();

        game.board = prepareBoard([
          [2, 2, BoardPiece.OPPONENT.value],
          [2, 3, BoardPiece.OPPONENT.value],
          [2, 4, BoardPiece.OPPONENT.value],
          [2, 5, BoardPiece.OPPONENT.value]
        ]);
        expect(moveModule.isFinished(game, {column: 2, row: 2})).to.be.true();
      });
    });
  });
});
