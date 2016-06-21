var chai = require('chai');
var dirtyChai = require('dirty-chai');
chai.use(dirtyChai);
var expect = chai.expect;
var when = require('when');

var fixture = require('./fixture');
var utils = require('./utils');

var closeStaleGames = require('../tasks/gameCleanup').closeStaleGames;
var GameState = require('../models/game').GameState;

describe('Test for Tasks', function() {
  before(function() {
    return fixture.createTestDB();
  });

  after(function() {
    return fixture.dropTestDB();
  });

  beforeEach(function() {
  });

  afterEach(function() {
  });

  describe('gameCleanup', function() {
    it('should close all old games', function() {
      var fixtureKeys = ['testgamePlaying'];
      var fixtures = utils.getFixturePromises(fixtureKeys);
      return when.all(fixtures).then(function(values) {
        var fixtureDict = utils.getFixtureDict(fixtureKeys, values);

        // TODO nalcholina add testgame, that's older than five days or modify fixtureDict.testgamePlaying.updatedAt

        expect(fixtureDict.testgamePlaying.state).to.equal(GameState.PLAYING.value);
        return when.all(closeStaleGames()).then(function() {
          // TODO nalcholina uncomment and see, if it works :)
//          expect(fixtureDict.testgamePlaying.state).to.equal(GameState.FINISHED.value);
        });
      });
    });

    it('should leave new games open', function() {
      var fixtureKeys = ['testgamePlaying'];
      var fixtures = utils.getFixturePromises(fixtureKeys);
      return when.all(fixtures).then(function(values) {
        var fixtureDict = utils.getFixtureDict(fixtureKeys, values);

        expect(fixtureDict.testgamePlaying.state).to.equal(GameState.PLAYING.value);
        return when.all(closeStaleGames()).then(function() {
          expect(fixtureDict.testgamePlaying.state).to.equal(GameState.PLAYING.value);
        });

      });
    });
  });
});
