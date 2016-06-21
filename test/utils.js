var fixture = require('./fixture');

/**
 * Return all fixture promises as array according to the given names
 * Usage with getFixturePromises:
 *   var fixtureKeys = ['testgamePlaying'];
 *   var fixtures = utils.getFixturePromises(fixtureKeys);
 *   return when.all(fixtures).then(function(values) {
 *     var fixtureDict = utils.getFixtureDict(fixtureKeys, values);
 *     var testgamePlaying = fixtureDict.testgamePlaying;
 * @param {Array} fixtureNames the names of the testfixtures (see fixture module)
 * @return {Array} array with all the fixtures according to the parameter fixtureNames
 */
exports.getFixturePromises = function(fixtureNames) {
  var fixtures = [];
  fixtureNames.forEach(function(item) {
    fixtures.push(fixture[item]);
  });
  return fixtures;
};

/**
 * Return a dict with the fixtureNames as keys and the values as values
 * Usage with getFixturePromises:
 *   var fixtureKeys = ['testgamePlaying'];
 *   var fixtures = utils.getFixturePromises(fixtureKeys);
 *   return when.all(fixtures).then(function(values) {
 *     var fixtureDict = utils.getFixtureDict(fixtureKeys, values);
 *     var testgamePlaying = fixtureDict.testgamePlaying;
 * @param {Array} fixtureNames the names of the testfixtures (see fixture module)
 * @param {Array} returnValues the returnvalues of the fixture promises
 * @return {dict} dict with the fixtureNames as keys and the values as values
 */
exports.getFixtureDict = function(fixtureNames, returnValues) {
  var fixtureDict = {};
  for (var i = 0; i < fixtureNames.length; i++) {
    fixtureDict[fixtureNames[i]] = returnValues[i];
  }
  return fixtureDict;
};
