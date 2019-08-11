import React from "react";
import PropTypes from "prop-types";

const RecordButton = ({ onRecordClick, onStopClick, isRecording }) => (
    <div>
        {isRecording ? (
            <button className="button button--stop" onClick={onStopClick} />
        ) : (
            <button className="button button--record" onClick={onRecordClick} />
        )}
    </div>
);

RecordButton.propTypes = {
    onRecordClick: PropTypes.func.isRequired,
    onStopClick: PropTypes.func.isRequired,
    isRecording: PropTypes.bool,
};

export default RecordButton;
