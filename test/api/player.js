var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var dirtyChai = require('dirty-chai');
chai.use(dirtyChai);
var expect = chai.expect;
var when = require('when');

var server = require('../../app').server;
var fixture = require('../fixture');

describe('API: Player', function() {
  before(function() {
    this.agent = chai.request.agent(server);

    // this gets filled in during promise fetching
    this.dynFixture = {};
    var intermediateVar = this.dynFixture;

    return when.join(
      fixture.createTestDB(),
      this.agent.get('/api/aboutme').then(function(res) {
        // save our session cookie for later requests
        expect(res).to.have.cookie('connect.sid');
        // save the testplayer's publicId into the test scope
        intermediateVar.testplayer = res.body.publicId;
      }));
  });

  after(function() {
    return fixture.dropTestDB();
  });

  beforeEach(function() {
  });

  afterEach(function() {
  });

  describe('aboutme', function() {
    it('should get the current player', function() {
      var expectedPlayerId = this.dynFixture.testplayer;
      return this.agent
        .get('/api/aboutme')
        .then(function(res) {
          // test type of response
          expect(res).to.have.status(200);
          expect(res).to.be.json();
          var player = res.body;
          expect(player).to.be.a('object');

          // test actual response
          expect(player).to.have.property('createdAt');
          expect(player).to.have.property('updatedAt');
          expect(player).to.have.property('publicId');
          expect(player.publicId).to.equal(expectedPlayerId);
        });
    });
  });

  describe('list', function() {
    it('should get all players', function() {
      var expectedplayerIds = ['testplayer1', 'testplayer2', this.dynFixture.testplayer];

      return this.agent
        .get('/api/players')
        .then(function(res) {
          // test type of response
          expect(res).to.have.status(200);
          expect(res).to.be.json();
          expect(res.body).to.be.a('array');

          // test actual response
          var players = res.body;
          expect(players).to.have.lengthOf(expectedplayerIds.length);
          for (var playerIndex = 0; playerIndex < players.length; playerIndex++) {
            var player = players[playerIndex];
            expect(player).to.be.a('object');
            expect(player).to.have.property('publicId');
            expect(expectedplayerIds).to.include(player.publicId);
          }
        });
    });
  });
});
