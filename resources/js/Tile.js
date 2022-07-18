export default class Tile {
    letter = '';
    status = ''; // correct, present, absent

    constructor(position) {
        this.position = position;
    }

    updateStatus(theWord) {
        if(! theWord.includes(this.letter)) {
            return this.status = 'absent';
        }

        if (this.letter === theWord[this.position]) {
            return this.status = 'correct';
        }

        this.status = 'present';
    }

    fill(key) {
        this.letter = key.toLowerCase();
    }
    
    empty() {
        this.letter = '';
    }
}