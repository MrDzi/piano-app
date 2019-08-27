import React, { useState } from "react";
import PropTypes from "prop-types";
import LocalStorageService from "../../services/LocalStorage";
import { RECORD_BUTTON_INFO_SEEN } from "../../utils/constants";
import "./recordButton.scss";

const RecordButton = ({ onRecordClick, onStopClick, isRecording }) => {
    const [infoSeen, setInfoSeen] = useState(LocalStorageService.get(RECORD_BUTTON_INFO_SEEN));

    const recordClick = () => {
        if (!infoSeen) {
            setInfoSeen(true);
            LocalStorageService.set(RECORD_BUTTON_INFO_SEEN, true);
        }
        onRecordClick();
    };

    return (
        <div>
            {isRecording ? (
                <button className="button button--stop" onClick={onStopClick} />
            ) : (
                <div className="button-wrapper">
                    <button className="button button--record" onClick={recordClick} />
                    {!infoSeen && (
                        <div className="button-info">
                            <span className="button-info__arrow">&#8592;</span>
                            <span>Click to start recording</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

RecordButton.propTypes = {
    onRecordClick: PropTypes.func.isRequired,
    onStopClick: PropTypes.func.isRequired,
    isRecording: PropTypes.bool,
};

export default RecordButton;
