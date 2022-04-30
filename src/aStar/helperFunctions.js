export class Node {
    constructor(row, col, prevNode = null) {
        this.prevNode = prevNode;
        this.row = row;
        this.col = col;
        this.f = 0;
        this.h = 0;
        this.g = 0;
    }
}

function getCurrentNode(currNode, openList) {
    let chosenNode = currNode;
    let chosenIdx;

    for (let i = 0; i < openList.length; i++) {
        let openListNode = openList[i];

        if (openListNode.f < chosenNode.f) {
            chosenNode = openListNode;
            chosenIdx = i;
        }
    }

    return [chosenNode, chosenIdx];
}

function getNeighbors(currNode, map) {
    let posNeighbors = [
        [0, 1],
        [1, 0],
        [0, -1],
        [-1, 0]
    ];
    let posNodes = []

    for (let i = 0; i < posNeighbors.length; i++) {
        let newPos = [
            currNode.row + posNeighbors[i][0],
            currNode.col + posNeighbors[i][1]
        ];

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

function acceptableNeighbors(currentNode, openList, closedList, posNeighbors, endingNode) {
    let neighbors = [];
    for (let i = 0; i < posNeighbors.length; i++) {
        let isInOpenOrClosed = false;

        for (let j = 0; j < closedList.length; j++) {
            if (
                closedList[j].row === posNeighbors[i].row && 
                closedList[j].col === posNeighbors[i].col
            ) {
                isInOpenOrClosed = true;
            }
        }

        if (isInOpenOrClosed) continue;

        posNeighbors[i].prevNode = currentNode;
        posNeighbors[i].g = currentNode.g + 1;
        posNeighbors[i].h = Math.round(
            Math.sqrt((posNeighbors[i].row - endingNode.row) ** 2 + (posNeighbors[i].col - endingNode.col) ** 2)
        );
        posNeighbors[i].f = posNeighbors[i].g + posNeighbors[i].h

        for (let j = 0; j < openList.length; j++) {
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

export default function aStar(astarmap) {
    const map = astarmap.map;
    const startingNode = astarmap.startingNode;
    const endingNode = astarmap.endingNode;

    let openList = [startingNode];
    let closedList = [];

    while (openList.length > 0) {
        let [currentNode, currentIdx] = getCurrentNode(openList[0], openList);

        if (currentNode.row === endingNode.row && currentNode.col === endingNode.col) {
            let parNode = currentNode;
            let nodes = [];
            while (parNode !== null) {
                nodes.unshift([parNode.row, parNode.col])
                parNode = parNode.prevNode;
            }
            return nodes;
        }

        openList.splice(currentIdx, 1);
        closedList.push(currentNode);

        let possibleNeighbors = getNeighbors(currentNode, map);
        let neighbors = acceptableNeighbors(currentNode, openList, closedList, possibleNeighbors, endingNode);

        neighbors.forEach(nei => openList.push(nei));
    }

    return null;
}