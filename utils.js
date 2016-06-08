/**
 * module for utility functions
 */

/**
 * generate a unique id in the form of [0-9a-f]{4}
 * @return {String} unique id like a7e1
 */
function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

/**
 * export a function to generate unique ids in the form of [0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}
 * @return {String} unique id
 */
exports.guid = function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
};
