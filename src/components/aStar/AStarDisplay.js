export default function AStarDisplay(props) {
    return (
        <div className='map'>
            <div className="mapHolder">
                {props.map.map((row, rowIdx) => {
                return (
                    <div key={`row${rowIdx}`} className='row'>
                    {props.map[rowIdx].map((col, colIdx) => {
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
                            onClick={() => props.handleChange(rowIdx, colIdx)}
                            className={colorDict[col]}
                            disabled={props.disableButtons ? true : false}
                        >{col}</button>
                        )
                    })}
                    </div>
                );
                })}
            </div>
        </div>
    );
}