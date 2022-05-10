export default class Map {
    /**
     * 
     * @param {Node} startingNode Node representing the starting position
     * @param {Node} endingNode   Node representing the ending position
     * @param {2dMatrix} map      2d matrix that A* will traverse
     */
    constructor(startingNode = null, endingNode = null, map = null) {
        this.map = map;
        this.startingNode = startingNode;
        this.endingNode = endingNode;
    }

    // Did no need these as it can be done with React JS
    // toggleWalls(row, col) {
    //     this.map[row][col] = this.map[row][col] === 0 ? 1 : 0;
    // }

    // setStart(row, col) {
    //     this.map[row][col] = 2;
    // }

    // setEnd(row, col) {
    //     this.map[row][col] = 3;
    // }
}