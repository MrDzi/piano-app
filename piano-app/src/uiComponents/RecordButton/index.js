import React from "react";

const RecordButton = ({ onRecordClick, onStopClick, isRecording }) => (
    <div>
        {isRecording ? (
            <button onClick={onStopClick}>Stop</button>
        ) : (
            <button onClick={onRecordClick}>Record</button>
        )}
    </div>
);

export default RecordButton;
