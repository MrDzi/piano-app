import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { GET_SONGS } from "../SongsList";
import "./addSongModal.scss";

const ADD_SONG = gql`
    mutation AddSong($title: String, $events: [EventInput], $duration: Int) {
        addSong(title: $title, events: $events, duration: $duration) {
            _id
            title
            duration
            events {
                note
                startTime
                endTime
            }
        }
    }
`;

const AddSongModal = ({ currentRecording, onClose }) => {
    const [value, setValue] = useState("");
    const [addSong] = useMutation(ADD_SONG);
    const inputEl = useRef(null);

    useEffect(() => {
        inputEl.current.focus();
    }, []);

    const onChange = e => {
        setValue(e.target.value);
    };

    const onKeyPress = e => {
        if (e.which === 13) {
            save();
        }
    };

    const cancel = () => {
        setValue("");
        onClose();
    };

    const save = () => {
        const duration = currentRecording.endTime - currentRecording.startTime;
        addSong({
            variables: {
                title: value,
                events: currentRecording.events,
                duration: duration,
            },
            refetchQueries: [{ query: GET_SONGS }],
        });
        onClose();
    };

    return (
        <div className="add-song-modal">
            <div className="add-song-modal__inner">
                <input
                    ref={inputEl}
                    className="input"
                    type="text"
                    maxLength={80}
                    placeholder="Enter song name..."
                    onChange={onChange}
                    onKeyPress={onKeyPress}
                />
                <button className="text-button" onClick={save} disabled={!value.length}>
                    Save
                </button>
                <button className="text-button text-button--no-border" onClick={cancel}>
                    Cancel
                </button>
            </div>
        </div>
    );
};

AddSongModal.propTypes = {
    onClose: PropTypes.func,
    currentRecording: PropTypes.object.isRequired,
};

export default AddSongModal;
