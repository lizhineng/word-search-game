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

    // Add `#ws-area` to wrap element
    this.wrapEl.className += ' ws-area';

    // Default settings
    var default_settings = {
      'directions': ['WE', 'NS', 'SN', 'WN', 'EN'],
      'gridSize': 10,
      'words': ['one', 'two', 'three', 'four', 'five'],
      'debug': false
    }
    this.settings = Object.merge(settings, default_settings);

    this.isClicked = false;

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
      if (!this.settings.debug) {
        this.fillUpFools();
      }

      // Draw the martrix into wrap element
      this.drawMartrix();

      // Registe mouse events
      this.registeMouseEvents();
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
        // Getting random direction
        var dir = this.settings.directions[Math.rangeInt(this.settings.directions.length - 1)],
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
   *
   * @param {String} word
   * @param {Number} direction
   */
  WordSeach.prototype.addWord = function(word, direction) {
    var itWorked = true,
      directions = {
        'WE': [0, 1], // Horizontal (From left to right)
        'NS': [1, 0], // Vertical (From top to bottom)
        'SN': [-1, 0], // Vertical (From bottom to top)
        'WN': [1, 1], // From top left to bottom right
        'EN': [1, -1] // From top right to bottom left
      },
      row, col; // y, x

    switch (direction) {
      case 'WE': // Horizontal (From left to right)
        var row = Math.rangeInt(this.settings.gridSize  - 1),
          col = Math.rangeInt(this.settings.gridSize - word.length);
        break;

      case 'NS': // Vertical (From top to bottom)
        var row = Math.rangeInt(this.settings.gridSize - word.length),
          col = Math.rangeInt(this.settings.gridSize  - 1);
        break;

      case 'SN': // Vertical (From bottom to top)
        var row = Math.rangeInt(word.length - 1, this.settings.gridSize - 1),
          col = Math.rangeInt(this.settings.gridSize  - 1);
        break;

      case 'WN': // From top left to bottom right
        var row = Math.rangeInt(this.settings.gridSize - word.length),
          col = Math.rangeInt(this.settings.gridSize - word.length);
        break;

      case 'EN': // From top right to bottom left
        var row = Math.rangeInt(this.settings.gridSize - word.length),
          col = Math.rangeInt(word.length - 1, this.settings.gridSize - 1);
        break;

      default:
        var error = 'UNKNOWN DIRECTION!';
        alert(error);
        console.log(error);
        break;
    }

    // Add words to the martrix
    for (var i = 0; i < word.length; i++) {
      var newRow = row + i * directions[direction][0],
        newCol = col + i * directions[direction][1];

      // The letter on the board
      var origin = this.martrix[newRow][newCol].letter;

      if (origin == '.' || origin == word[i]) {
        this.martrix[newRow][newCol].letter = word[i];
      } else {
        itWorked = false;
      }
    }

    return itWorked;
  }

  /**
   * Initialize the application
   */
  WordSeach.prototype.initialize = function() {
    /**
     * Letter martrix
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
      divEl.setAttribute('class', 'ws-row');
      this.wrapEl.appendChild(divEl);

      for (var col = 0; col < this.settings.gridSize; col++) {
        var cvEl = document.createElement('canvas');
        cvEl.setAttribute('class', 'ws-col');
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
   * Fill up the remaining items
   */
  WordSeach.prototype.fillUpFools = function() {
    for (var row = 0; row < this.settings.gridSize; row++) {
      for (var col = 0; col < this.settings.gridSize; col++) {
        if (this.martrix[row][col].letter == '.') {
          // Math.rangeInt(65, 90) => A ~ Z
          this.martrix[row][col].letter = String.fromCharCode(Math.rangeInt(65, 90));
        }
      }
    }
  }

  /*
   * Registe mouse events
   */
  WordSeach.prototype.registeMouseEvents = function() {
    var cols = document.querySelectorAll('.ws-col');
    for (var i = 0; i < cols.length; i++) {
      cols[i].addEventListener('mousedown', this.onMouseDownHandler(this));
      cols[i].addEventListener('mouseup', this.onMouseUpHandler(this));
      cols[i].addEventListener('mouseover', this.onMouseOverHandler(this));
    }
  }

  WordSeach.prototype.onMouseDownHandler = function(ws) {
    return function() {
      ws.isClicked = true;
      this.className += ' ws-selected';
    }
  }

  WordSeach.prototype.onMouseUpHandler = function(ws) {
    return function() {
      ws.isClicked = false;

      var selectedEls = document.querySelectorAll('.ws-selected');
      for (var i = 0; i < selectedEls.length; i++) {
        selectedEls[i].setAttribute('class', 'ws-col');
      }
    }
  }

  WordSeach.prototype.onMouseOverHandler = function(ws) {
    return function() {
      if (ws.isClicked) {
        this.className += ' ws-selected';
      }
    }
  }

})();