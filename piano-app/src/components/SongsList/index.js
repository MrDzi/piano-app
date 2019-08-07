import React from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import Timer from "../../uiComponents/Timer";

export const GET_SONGS = gql`
    query {
        songs {
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

const SongsList = ({ onPlay, onStop, currentSongId }) => {
    const { loading, error, data } = useQuery(GET_SONGS);

    if (loading) return "Loading...";
    if (error) return `Error! ${error.message}`;

    return (
        <ul>
            {data.songs &&
                data.songs.length > 0 &&
                data.songs.map(song => (
                    <li key={song._id}>
                        <div>{song.title}</div>
                        {!currentSongId && <button onClick={() => onPlay(song)}>Play</button>}
                        {currentSongId === song._id && <button onClick={onStop}>Stop</button>}
                        <Timer time={song.duration} />
                    </li>
                ))}
        </ul>
    );
};

export default SongsList;
