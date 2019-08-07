import React, { useState, useEffect, useRef } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";
import { GET_SONGS } from "../SongsList";

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

const AddSongModal = ({ onSave, onCancel, currentRecording }) => {
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
        onCancel();
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
        onSave();
    };

    return (
        <div>
            <input ref={inputEl} type="text" onChange={onChange} onKeyPress={onKeyPress} />
            <button onClick={save}>Save</button>
            <button onClick={cancel}>Cancel</button>
        </div>
    );
};

export default AddSongModal;
