import './App.css';
import aStar, { Node } from './aStar/helperFunctions';
import Map from './aStar/classes';

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
    results: []
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

    // console.log(astarmap.map, mapCopy, results)

    if (results === null) {
      for (let row = 0; row < mapCopy.length; row++) {
        for (let col = 0; col < mapCopy[row].length; col++) {
          mapCopy[row][col] = 4;
        }
      }
    } else {
      results.forEach(coord => {
        // console.log(coord)
        mapCopy[coord[0]][coord[1]] = mapCopy[coord[0]][coord[1]] === 0 ? 5: mapCopy[coord[0]][coord[1]];
      })
    }

    setValues({
      ...values,
      map: mapCopy
    })
  }

  return (
    <div className='map'>
      {values.map.map((row, rowIdx) => {
        return (
          <div key={`row${rowIdx}`} className='row'>
            {values.map[rowIdx].map((col, colIdx) => {
              const colorDict = {
                0: 'white',
                1: 'black',
                2: 'green',
                3: 'orange',
                4: 'red',
                5: 'blue'
              }

              return (
                <button 
                  key={`row${rowIdx}col${colIdx}`} 
                  onClick={() => handleChange(rowIdx, colIdx)}
                  className={colorDict[col]}
                >{col}</button>
              )
            })}
          </div>
        );
      })}

      <div className='setMode'>
        <p>Set Mode</p>
        <div className='buttons'>
          <button onClick={() => changeMode(1)}>Toggle Barriers</button>
          <button onClick={() => changeMode(2)}>Set Start</button>
          <button onClick={() => changeMode(3)}>Set End</button>
          <button onClick={startAStar}>AStar</button>
        </div>
      </div>
    </div>
  );
}

export default App;
