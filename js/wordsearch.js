(function(){

  Element.prototype.wordSeach = WordSeachHelper;

  function WordSeachHelper(settings) {
    return new WordSeach(this, settings);
  }

  /**
   * Word seach
   */
  function WordSeach(wrapEl, settings) {
    this.wrapEl = wrapEl;
    this.settings = settings;

    // Check the words' length if it is overflow the grid
    if (this.parseWords(this.settings.gridSize)) {
      // Add words into the martrix data
      var isWorded = false;

      while (isWorded == false) {
        // initialize the application
        this.initialize();

        isWorded = this.addWords();
      }
      

      // Draw the martrix into wrap element
      this.drawMartrix();

      console.log(this);
    }
  }

  /**
   * Add words into the martrix
   */
  WordSeach.prototype.addWords = function() {
      var keepGoing = true,
        counter = 0,
        isWorded = true;

      while (keepGoing) {
        //var dir = Math.floor(Math.random() * 3),
        var dir = 3,
          result = this.addWord(this.settings.words[counter], dir),
          isWorded = true;

        if (result == false) {
          keepGoing = false;
          isWorded = false;
        }

        counter++;
        if (counter >= this.settings.words.length) {
          keepGoing = false;
        }
      }

      return isWorded;
  }

  /**
   * Add word into the martrix
   */
  WordSeach.prototype.addWord = function(word, direction) {
    var itWorked = true;

    switch (direction) {
      case 0: // Horizontal
        // New row(y) and col(x)
        var row = Math.floor(Math.random() * (this.settings.gridSize  - 1)),
          col = Math.floor(Math.random() * (this.settings.gridSize - word.length + 1));

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
        var col = Math.floor(Math.random() * (this.settings.gridSize  - 1)),
          row = Math.floor(Math.random() * (this.settings.gridSize - word.length + 1));

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
        var col = range(this.settings.gridSize - word.length + 1, this.settings.gridSize - 1),
          row = range(0, this.settings.gridSize - word.length);

        console.log(word, row, col);

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
    var itWord = true;

    this.settings.words.forEach(function(word){
      if (word.length > maxSize) {
        alert('The length of word `' + word + '` is overflow the gridSize.');
        console.error('The length of word `' + word + '` is overflow the gridSize.');
        itWord = false;
      }
    });

    return itWord;
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
        cvEl.setAttribute('width', 40);
        cvEl.setAttribute('height', 40);

        var ctx = cvEl.getContext('2d');
        ctx.fillText(this.martrix[row][col].letter, 0, 20);

        divEl.appendChild(cvEl);
      }
    }
  }

})();