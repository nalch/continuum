(function(exports){

  exports.GameState = {PREPARED: 0, PLAYING: 1, FINISHED: 2};
  exports.BoardPiece = {UNDEFINED: 0, OWNER: 1, OPPONENT: 2};

}(typeof exports === 'undefined' ? this.enumvalues = {} : exports));
