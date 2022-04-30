export default class Map {
    constructor(startingNode = null, endingNode = null, map = null) {
        this.map = map;
        this.startingNode = startingNode;
        this.endingNode = endingNode;
    }

    toggleWalls(row, col) {
        this.map[row][col] = this.map[row][col] === 0 ? 1 : 0;
    }

    setStart(row, col) {
        this.map[row][col] = 2;
    }

    setEnd(row, col) {
        this.map[row][col] = 3;
    }
}