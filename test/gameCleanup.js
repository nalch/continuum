var chai = require('chai');
var dirtyChai = require('dirty-chai');
chai.use(dirtyChai);
var expect = chai.expect;

var fixture = require('../test/fixture');

var closeStaleGames = require('../tasks/gameCleanup').closeStaleGames;
var GameState = require('../models/game').GameState;

describe('Test for Tasks', function() {
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

  describe('gameCleanup', function() {
    it('should close all old games', function() {
      return fixture.testgames.exec().then(function(games) {
        expect(games.length).to.equal(1);
        expect(games[0].state).to.equal(GameState.PLAYING.value);
        closeStaleGames(function() {
          expect(games[0].state).to.equal(GameState.FINISHED.value);
        });
      });
    });
  });
});

