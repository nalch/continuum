var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var dirtyChai = require('dirty-chai');
chai.use(dirtyChai);
var expect = chai.expect;

var server = require('../../app').server;
var fixture = require('../fixture');

describe('API: Player', function() {
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

  describe('list', function() {
    it('should get all players', function() {
      var expectedplayerIds = ['testplayer1', 'testplayer2'];

      var agent = chai.request.agent(server);
      return agent
        .get('/api/players')
        .then(function(res) {
          // test type of response
          expect(res).to.have.status(200);
          expect(res).to.be.json();
          expect(res.body).to.be.a('array');

          // test actual response
          var players = res.body;
          expect(players).to.have.lengthOf(2);
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
