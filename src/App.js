import './App.css';
import aStar, { Node } from './aStar/helperFunctions';
import Map from './aStar/classes';
import AStarButtons from './components/aStar/AStarButtons';
import AStarDisplay from './components/aStar/AStarDisplay';

import { useState } from 'react';

function App() {
  const initialValues = {
    mode: null,
    start: [null, null],
    end: [null, null],
    map: [
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    results: [],
    disableButtons: false
  }
  const [values, setValues] = useState(initialValues);

  // Changes between Barriers (1), Starting Position (2), Ending Position (3),
  // and AStar (5)
  const changeMode = mode => {
    setValues({
      ...values,
      mode: mode
    })
  }

  // Changes the value of values.map[row][col] to whatever the current mode is
  // (1, 2, 3, or 5)
  const handleChange = (row, col) => {
    let arrayCopy = [...values.map]; // Make a copy of the map/2d matrix
    
    if (values.mode === 1) {
      // Go here if the mode is set to barriers.
      
      // Todo: Fix this as it can replace the starting and ending position.
      arrayCopy[row][col] = (arrayCopy[row][col] === 0 || arrayCopy[row][col] !== values.mode) ? values.mode : 0;

      setValues({
        ...values,
        map: arrayCopy
      })
    } else if (values.mode === 2) {
      // Go here if the mode is set to Starting Position

      // Set the value of the chosen location in arrayCopy
      // to 2
      arrayCopy[row][col] = 2;

      // If another location is chosen as the starting position, change the current location
      // to 0 (nothing)
      if(values.start[0] !== null && (row !== values.start[0] || col !== values.start[1])) {
        arrayCopy[values.start[0]][values.start[1]] = 0;
      }

      setValues({
        ...values,
        map: arrayCopy,
        start: [row, col]
      })
    } else if (values.mode === 3) {
      arrayCopy[row][col] = 3;
      
      if(values.end[0] !== null && (row !== values.end[0] || col !== values.end[1])) {
        arrayCopy[values.end[0]][values.end[1]] = 0;
      }

      setValues({
        ...values,
        map: arrayCopy,
        end: [row, col]
      })
    }
  }

  // Runs AStar and modifies the map with the path from start to finish denoted as 5.
  // If no path is found, each value in values.map will be 4
  const startAStar = () => {
    const firstNode = new Node(values.start[0], values.start[1]); // Makes the starting node
    const secNode = new Node(values.end[0], values.end[1]);       // Makes the ending node
    const astarmap = new Map(firstNode, secNode, values.map);     // Makes a new Map
    const results = aStar(astarmap);                              // Runs aStar
    let mapCopy = [...values.map];                                // Make a copy of the current map

    if (results === null) {
      // If no path is found, set each slot in mapCopy to 4 (Will be red visually)
      for (let row = 0; row < mapCopy.length; row++) {
        for (let col = 0; col < mapCopy[row].length; col++) {
          mapCopy[row][col] = 4;
        }
      }
    } else {
      // If a path is found, set each position to a 5
      results.forEach(coord => {
        mapCopy[coord[0]][coord[1]] = mapCopy[coord[0]][coord[1]] === 0 ? 5: mapCopy[coord[0]][coord[1]];
      })
    }

    // We want to disable the buttons that represent values.map
    // as we don't want to modify the map once the path is found
    setValues({
      ...values,
      map: mapCopy,
      mode: 5,
      disableButtons: true
    })
  }

  // Resets values by giving it initialValues
  const reset = () => {
    setValues(initialValues);
  }

  return (
    <div className='page'>
      <AStarButtons changeMode={changeMode} startAStar={startAStar} reset={reset} mode={values.mode} />
      <AStarDisplay map={values.map} disableButtons={values.disableButtons} handleChange={handleChange} />
    </div>
  );
}

export default App;
