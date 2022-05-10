export class Node {
    /**
     * Each Node represents a location denoted by [row, column] 
     * (Like a graph denotes locations using [x,y])
     * @param {int} row Shows the row where the node is located
     * @param {int} col Shows the column where the node is located
     * @param {Node} prevNode Parent node
     */
    constructor(row, col, prevNode = null) {
        this.prevNode = prevNode;
        this.row = row;
        this.col = col;
        this.f = 0; // f = g + h
        this.h = 0; // Distance between the node and the end
        this.g = 0; // Distance between the start and the node
    }
}

/**
 * 
 * @param {Node} currNode Node that is currently chosen (openList[0])
 * @param {Array} openList List of nodes that will be visited
 * @returns The chosen node and its index in an array
 */
function getCurrentNode(currNode, openList) {
    let chosenNode = currNode;
    let chosenIdx;

    // Go through the openList
    for (let i = 0; i < openList.length; i++) {
        let openListNode = openList[i];

        // If the distance from start to finish through the
        // openListNode is shorter than through chosenNode,
        // choose that node and its index
        if (openListNode.f < chosenNode.f) {
            chosenNode = openListNode;
            chosenIdx = i;
        }
    }

    return [chosenNode, chosenIdx];
}

/**
 * Get the neighbors of currNode
 * @param {Node} currNode The node the program is currently on
 * @param {2dMatrix} map The map which A* must traverse
 * @returns A list of nodes which are currNode's neighbors
 */
function getNeighbors(currNode, map) {
    let posNeighbors = [
        [0, 1],  // Right neighbor
        [1, 0],  // Bottom neighbor
        [0, -1], // Left neighbor
        [-1, 0]  // Top neighbor
    ];
    let posNodes = [] // List of nodes neighboring currNode

    // Go through each position in posNeighbors
    for (let i = 0; i < posNeighbors.length; i++) {
        // Get the [row, column] of the new node based on the position of currNode
        let newPos = [
            currNode.row + posNeighbors[i][0],
            currNode.col + posNeighbors[i][1]
        ];

        // Skips the neighbor if:
        // 1. its position exceeds the left extreme (0)
        // 2. its position exceeds the top extreme (0)
        // 3. its position exceeds the bottom extreme (map.length - 1)
        // 4. its position exceeds the right extreme (map[0].length - 1)
        // 5. its position is a barrier (a barrier is represented as a 1 on the 2d map)
        if (!(
            newPos[0] < 0 || 
            newPos[1] < 0 ||
            newPos[0] > map.length - 1 ||
            newPos[1] > map[0].length - 1 ||
            map[newPos[0]][newPos[1]] === 1
        )) {
            let newNode = new Node(newPos[0], newPos[1]);

            posNodes.push(newNode);
        }
    }

    return posNodes;
}

/**
 * Get a list of good neighbors based on distance
 * @param {Node} currentNode The node the program is currently on
 * @param {Array} openList List of nodes to visit
 * @param {Array} closedList List of visited nodes
 * @param {Array} posNeighbors List of the neighbors of currentNode
 * @param {Node} endingNode The ending position
 * @returns A list of neighbors to currentNode that 
 * would yield the shortest distance from start to finish
 */
function acceptableNeighbors(currentNode, openList, closedList, posNeighbors, endingNode) {
    let neighbors = [];

    // Go through the possible neighbors (posNeighbors)
    for (let i = 0; i < posNeighbors.length; i++) {
        let isInOpenOrClosed = false;

        // Go through the closedList, if the location of a node
        // in the closedList matches possNeighbor, then set
        // isInOpenOrClosd to true.
        for (let j = 0; j < closedList.length; j++) {
            if (
                closedList[j].row === posNeighbors[i].row && 
                closedList[j].col === posNeighbors[i].col
            ) {
                isInOpenOrClosed = true;
            }
        }

        // If the node is in the closedList, skip to the next one
        if (isInOpenOrClosed) continue; 

        // Set the parent of the current posNeighbor to the currentNode
        posNeighbors[i].prevNode = currentNode;
        
        // Since the current posNeighbor is 1 unit away from currNode,
        // set the g of posNeighbor to the g of currentNode and add 1.
        // g is the distance between the starting node and the node that
        // is being worked on.
        posNeighbors[i].g = currentNode.g + 1;

        // Use the distance formula: dist = sqrt((x1 - x2)^2 + (y1 - y2)^2)
        // to find the distance between the node that is being worked on and the
        // ending node. Set h of posNeighbor equal to that distance.
        posNeighbors[i].h = Math.round(
            Math.sqrt((posNeighbors[i].row - endingNode.row) ** 2 + (posNeighbors[i].col - endingNode.col) ** 2)
        );

        // f is just the total cost/distance from the starting node to the ending node
        // through the node that is being worked on.
        // f = g + h
        posNeighbors[i].f = posNeighbors[i].g + posNeighbors[i].h

        for (let j = 0; j < openList.length; j++) {
            // We want to skip posNeighbor if a node in openList has the same location
            // as posNeighbor and if the g of posNeighbor is greater than or equal to the
            // g of the node in openList.
            if (
                (openList[j].row === posNeighbors[i].row && openList[j].col === posNeighbors[i].col) &&
                (posNeighbors[i].g >= openList[j].g) 
            ) { isInOpenOrClosed = true; }
        }

        if (isInOpenOrClosed) continue;

        neighbors.push(posNeighbors[i])
    }

    return neighbors;
}

/**
 * Find the path from start to finish
 * @param {Map} astarmap Contains the map, starting node, and ending node
 * @returns Either a list of positions from the starting node 
 * and the ending node or null if no path is found
 */
export default function aStar(astarmap) {
    const map = astarmap.map;
    const startingNode = astarmap.startingNode;
    const endingNode = astarmap.endingNode;

    let openList = [startingNode]; // List of nodes to visit and initialize it with startingNode
    let closedList = [];           // List of visited nodes

    // Loop while there are nodes in the openList
    while (openList.length > 0) {
        // Get the current node and the index of that node.
        // To start it, give it the first node in openList and openList
        let [currentNode, currentIdx] = getCurrentNode(openList[0], openList);

        // If the location of currentNode and endingNode match, then the path has been found
        if (currentNode.row === endingNode.row && currentNode.col === endingNode.col) {
            let parNode = currentNode;
            let nodes = [];

            // Will stop looping once there are no more parents left
            while (parNode !== null) {
                // We will find the path by going from the final node to the starting node,
                // so we will have to use unshift so that the positions are returned in
                // the order from start to finish
                nodes.unshift([parNode.row, parNode.col])
                parNode = parNode.prevNode; // Set parNode to its parent
            }
            return nodes;
        }

        openList.splice(currentIdx, 1); // Remove currentNode from openList
        closedList.push(currentNode);   // Add currentNode to closedList since it has been visited

        // List of possible neighbors
        let possibleNeighbors = getNeighbors(currentNode, map);

        // List of chosen neighbors
        let neighbors = acceptableNeighbors(currentNode, openList, closedList, possibleNeighbors, endingNode);

        // Add each neighbor in neighbors to openList
        neighbors.forEach(nei => openList.push(nei));
    }

    // If no path is found, return null
    return null;
}