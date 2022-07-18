import Tile from './Tile';
import {theWords, allWords} from './words';

export default {

    guessesAllowed: 6, 
    theWord: theWords[Math.floor(Math.random() * theWords.length)],
    correctLetters: [],
    presentLetters: [],
    absentLetters: [],
    currentRowIndex: 0,
    currentTileIndex: 0,
    state: 'active', // pending, active, complete
    errors: false,
    message: '',

    letters: [
        'QWERTYUIOP'.split(''),
        'ASDFGHJKL'.split(''),
        ['Enter', ...'ZXCVBNM'.split(''), 'Backspace'],
    ],

    get currentRow() {
        return this.board[this.currentRowIndex];
    },

    get currentGuess() {
        return this.currentRow.map(tile => tile.letter).join('');
    },

    get remainingGuesses() {
        return this.guessesAllowed - this.currentRowIndex - 1;
    },

    init() {
        this.board = Array.from({length: this.guessesAllowed}, () => {
            return Array.from({ length: this.theWord.length}, (item, index) => new Tile(index));
        });
    },

    matchingTileForKey(key) {
        if (this.correctLetters.includes(key.toLowerCase())) {
            return 'correct';
        } else if (this.presentLetters.includes(key.toLowerCase())) {
            return 'present';
        } else if (this.absentLetters.includes(key.toLowerCase())) {
            return 'absent';
        }
        return '';
    },

    onKeyPress(key) {
        this.message = '';
        this.errors = false;

        if (this.state !== 'complete') {
            // validation
            if (/^[A-Za-z]$/.test(key)) {
                this.fillTile(key);
            } else if (key === 'Backspace') {
                this.emptyTile();
            } else if (key === 'Enter') {
                this.submitGuess();
            } 
        }
    },

    fillTile(key) {
        for (let tile of this.currentRow) {
            if (! tile.letter) {
                tile.fill(key);
                break;
            }
        }
    },

    emptyTile() {
        for (let tile of [...this.currentRow].reverse()) {
            if (tile.letter) {
                tile.empty();
                break;
            }
        }
    }, 
    
    submitGuess() {
        if(this.currentGuess.length < this.theWord.length) {
            return;
        }

        if (! allWords.includes(this.currentGuess)) {
            this.errors = true;
            this.message = 'Invalid word...';
            return;
        }

        for (let tile of this.currentRow) {
            tile.updateStatus(this.theWord);
        }

        let occurances = new Array();
        for (let tile of this.currentRow) {
            occurances[tile.letter] = this.theWord.split(tile.letter).length - 1;
        }

        for (let tile of this.currentRow) {
            if (tile.status === 'correct') {
                this.correctLetters.push(tile.letter); 
                occurances[tile.letter] = occurances[tile.letter] - 1;
            }
        }

        for (let tile of this.currentRow) {
            if(tile.status ==='present' && occurances[tile.letter]>0) {
                this.presentLetters.push(tile.letter); 
                occurances[tile.letter]--;
            } else if (tile.status !== 'correct') {
                tile.status = 'absent';
                this.absentLetters.push(tile.letter); 
            }
        }

        if (this.currentGuess === this.theWord) {
            this.state = 'complete';
            this.message = 'You win!';
        } else if (!this.remainingGuesses) {
            this.state = 'complete';
            this.message = 'Game Over. The word was: ' + this.theWord;
        } else {
            this.currentRowIndex++;
            this.message = 'Incorrect';
        }
    },
    /*
    matchingTileForKey(key) {
        return this.board
            .flat()
            .filter((tile) => tile.status)
            .sort((t1, t2) => t2.status === "correct")
            .find((tile) => tile.letter === key.toLowerCase());
    },*/
};

