import React from "react";
import PropTypes from "prop-types";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import cx from "classnames";
import Timer from "../Timer";
import "./songsList.scss";

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

const SongsList = ({ onPlay, onStop, currentSongId, isPlayingDisabled }) => {
    const { loading, error, data } = useQuery(GET_SONGS);

    if (loading) return <div className="spacing-top">Loading...</div>;
    if (error) return <div className="spacing-top">Error! {error.message}</div>;

    const songsListClasses = cx("songs-list", {
        "songs-list--with-items": data.songs && data.songs.length,
    });

    return (
        <ul className={songsListClasses}>
            {data.songs &&
                data.songs.length > 0 &&
                data.songs.map(song => {
                    const songTitleClasses = cx("song__title", {
                        "song__title--is-disabled": currentSongId && currentSongId !== song._id,
                    });
                    return (
                        <li className="songs-list__item song" key={song._id}>
                            <span className={songTitleClasses}>{song.title}</span>
                            <button
                                className="button button--small button--play"
                                onClick={() => onPlay(song)}
                                disabled={isPlayingDisabled || currentSongId}
                            />
                            {currentSongId === song._id && (
                                <button
                                    className="button button--small button--stop"
                                    onClick={onStop}
                                />
                            )}
                            <Timer time={song.duration} />
                        </li>
                    );
                })}
        </ul>
    );
};

SongsList.propTypes = {
    onPlay: PropTypes.func.isRequired,
    onStop: PropTypes.func.isRequired,
    currentSongId: PropTypes.string,
    isPlayingDisabled: PropTypes.bool,
};

export default SongsList;
