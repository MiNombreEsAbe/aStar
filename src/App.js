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

  const changeMode = mode => {
    setValues({
      ...values,
      mode: mode
    })
  }

  const handleChange = (row, col) => {
    let arrayCopy = [...values.map];
    
    if (values.mode === 1) {
      arrayCopy[row][col] = (arrayCopy[row][col] === 0 || arrayCopy[row][col] !== values.mode) ? values.mode : 0;

      setValues({
        ...values,
        map: arrayCopy
      })
    } else if (values.mode === 2) {
      arrayCopy[row][col] = 2;

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

  const startAStar = () => {
    const firstNode = new Node(values.start[0], values.start[1]);
    const secNode = new Node(values.end[0], values.end[1]);
    const astarmap = new Map(firstNode, secNode, values.map);
    const results = aStar(astarmap);
    let mapCopy = [...values.map];

    if (results === null) {
      for (let row = 0; row < mapCopy.length; row++) {
        for (let col = 0; col < mapCopy[row].length; col++) {
          mapCopy[row][col] = 4;
        }
      }
    } else {
      results.forEach(coord => {
        mapCopy[coord[0]][coord[1]] = mapCopy[coord[0]][coord[1]] === 0 ? 5: mapCopy[coord[0]][coord[1]];
      })
    }

    setValues({
      ...values,
      map: mapCopy,
      mode: 5,
      disableButtons: true
    })
  }

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
