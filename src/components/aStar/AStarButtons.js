export default function AStarButtons(props) {
    return (
        <div className='setMode'>
            <p>A* Pathfinder Visualizer</p>
            <div className='buttons'>
                <button 
                    className={props.mode === 1 ? "toggleBarrier active" : "toggleBarrier"} 
                    onClick={() => props.changeMode(1)}
                >Toggle Barriers</button>
                <button 
                    className={props.mode === 2 ? "setStart active" : "setStart"} 
                    onClick={() => props.changeMode(2)}
                >Set Start</button>
                <button 
                    className={props.mode === 3 ? "setEnd active" : "setEnd"} 
                    onClick={() => props.changeMode(3)}
                >Set End</button>
                <button 
                    className={props.mode === 5 ? "startAStar active" : "startAStar"}
                    onClick={props.startAStar}
                >AStar</button>
                <button 
                    className="reset" 
                    onClick={props.reset}
                >Reset</button>
            </div>
        </div>
    );
}