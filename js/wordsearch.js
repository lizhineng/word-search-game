(function(){
  'use strict';

  // Extend the element method
  Element.prototype.wordSeach = function(settings) {
    return new WordSeach(this, settings);
  }

  /**
   * Word seach
   *
   * @param {Element} wrapWl the game's wrap element
   * @param {Array} settings
   * constructor
   */
  function WordSeach(wrapEl, settings) {
    this.wrapEl = wrapEl;
    this.settings = settings;

    // Check the words' length if it is overflow the grid
    if (this.parseWords(this.settings.gridSize)) {
      // Add words into the martrix data
      var isWorked = false;

      while (isWorked == false) {
        // initialize the application
        this.initialize();

        isWorked = this.addWords();
      }

      // Fill up the remaining blank items
      this.fillUpFools();

      // Draw the martrix into wrap element
      this.drawMartrix();
    }
  }

  /**
   * Put the words into the martrix
   */
  WordSeach.prototype.addWords = function() {
      var keepGoing = true,
        counter = 0,
        isWorked = true;

      while (keepGoing) {
        var dir = Math.rangeInt(3), // Direction
          result = this.addWord(this.settings.words[counter], dir),
          isWorked = true;

        if (result == false) {
          keepGoing = false;
          isWorked = false;
        }

        counter++;
        if (counter >= this.settings.words.length) {
          keepGoing = false;
        }
      }

      return isWorked;
  }

  /**
   * Add word into the martrix
   */
  WordSeach.prototype.addWord = function(word, direction) {
    var itWorked = true;

    switch (direction) {
      case 0: // Horizontal
        // New row(y) and col(x)
        var row = Math.rangeInt(this.settings.gridSize  - 1),
          col = Math.rangeInt(this.settings.gridSize - word.length);

        for (var i = 0; i < word.length; i++) {
          var origin = this.martrix[row][col + i].letter;
          if (origin == '.' || origin == word[i]) {
            this.martrix[row][col + i].letter = word[i];
          } else {
            itWorked = false;
          }
        }
        break;

      case 1: // vertical
        var row = Math.rangeInt(this.settings.gridSize - word.length),
          col = Math.rangeInt(this.settings.gridSize  - 1);

        for (var i = 0; i < word.length; i++) {
          var origin = this.martrix[row + i][col].letter;
          if (origin == '.' || origin == word[i]) {
            this.martrix[row + i][col].letter = word[i];
          } else {
            itWorked = false;
          }
        }
        break;

      case 2: // From top left to bottom right
        var row = Math.rangeInt(this.settings.gridSize - word.length),
          col = Math.rangeInt(this.settings.gridSize - word.length);
        var col = Math.floor(Math.random() * (this.settings.gridSize - word.length + 1)),
          row = Math.floor(Math.random() * (this.settings.gridSize - word.length + 1));

        for (var i = 0; i < word.length; i++) {
          var origin = this.martrix[row + i][col + i].letter;
          if (origin == '.' || origin == word[i]) {
            this.martrix[row + i][col + i].letter = word[i];
          } else {
            itWorked = false;
          }
        }
        break;

      case 3: // From top right to bottom left
        var row = Math.rangeInt(this.settings.gridSize - word.length),
          col = Math.rangeInt(word.length - 1, this.settings.gridSize - 1);

        for (var i = 0; i < word.length; i++) {
          var origin = this.martrix[row + i][col - i].letter;
          if (origin == '.' || origin == word[i]) {
            this.martrix[row + i][col - i].letter = word[i];
          } else {
            itWorked = false;
          }
        }
        break;
    }

    return itWorked;
  }

  /**
   * Initialize the application
   */
  WordSeach.prototype.initialize = function() {
    /**
     * Store the words
     *
     * param {Array}
     */
    this.martrix = [];

    this.initMartrix(this.settings.gridSize);
  }

  WordSeach.prototype.parseWords = function(maxSize) {
    var itWorked = true;

    for (var i = 0; i < this.settings.words.length; i++) {
      // Convert all the letters to upper case
      this.settings.words[i] = this.settings.words[i].toUpperCase();
      var word = this.settings.words[i];

      if (word.length > maxSize) {
        alert('The length of word `' + word + '` is overflow the gridSize.');
        console.error('The length of word `' + word + '` is overflow the gridSize.');
        itWorked = false;
      }
    }

    return itWorked;
  }

  /**
   * Fill default items into the martrix
   */
  WordSeach.prototype.initMartrix = function(size) {
    for (var row = 0; row < size; row++) {
      for (var col = 0; col < size; col++) {
        var item = {
          'letter': '.' // Default value
        }

        if (!this.martrix[row]) {
          this.martrix[row] = [];
        }

        this.martrix[row][col] = item;
      }
    }
  }

  /**
   * Draw the martrix
   */
  WordSeach.prototype.drawMartrix = function() {
    for (var row = 0; row < this.settings.gridSize; row++) {
      // New row
      var divEl = document.createElement('div');
      this.wrapEl.appendChild(divEl);

      for (var col = 0; col < this.settings.gridSize; col++) {
        var cvEl = document.createElement('canvas');
        cvEl.setAttribute('class', 'ws-letter');
        cvEl.setAttribute('width', 40);
        cvEl.setAttribute('height', 40);

        // Fill text in middle center
        var x = cvEl.width / 2,
          y = cvEl.height / 2;

        var ctx = cvEl.getContext('2d');
        ctx.font = '30px Calibri';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#333'; // Text color
        ctx.fillText(this.martrix[row][col].letter, x, y);

        divEl.appendChild(cvEl);
      }
    }
  }

  /**
   * Fill up the remaining blank items
   */
  WordSeach.prototype.fillUpFools = function() {
    for (var row = 0; row < this.settings.gridSize; row++) {
      for (var col = 0; col < this.settings.gridSize; col++) {
        if (this.martrix[row][col].letter == '.') {
          this.martrix[row][col].letter = String.fromCharCode(Math.rangeInt(65, 90));
        }
      }
    }
  }

})();