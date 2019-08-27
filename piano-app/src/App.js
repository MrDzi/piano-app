import React from "react";
import cx from "classnames";
import Piano from "./components/Piano";
import AddSongModal from "./components/AddSongModal";
import SongsList from "./components/SongsList";
import RecordButton from "./components/RecordButton";
import Timer from "./components/Timer";
import { removeFromArray } from "./utils/helpers";
import { RECORD, PLAY } from "./utils/constants";
import "./app.scss";

class App extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            mode: "",
            activeNotes: [],
            showAddSongModal: false,
            currentSongId: null,
            songProgress: 0,
        };
        this.currentNotes = {};
        this.currentRecording = {
            events: [],
            startTime: null,
            endTime: null,
        };
        this.scheduledEvents = [];
    }

    onPlayNoteInput = (note, { prevActiveNotes }) => {
        if (this.state.mode === RECORD && !this.currentNotes[note]) {
            this.currentNotes = {
                ...this.currentNotes,
                [note]: new Date().getTime() - this.currentRecording.startTime,
            };
        }
    };

    onStopNoteInput = (note, { prevActiveNotes }) => {
        if (!this.currentNotes[note]) {
            return;
        }
        if (this.state.mode === RECORD) {
            const startTime = this.currentNotes[note];
            const endTime = new Date().getTime() - this.currentRecording.startTime;
            this.currentNotes = {
                ...this.currentNotes,
                [note]: null,
            };
            this.currentRecording.events = [
                ...this.currentRecording.events,
                { note, startTime, endTime },
            ];
        }
    };

    startRecording = () => {
        this.setState({
            mode: RECORD,
        });
        this.currentRecording.startTime = new Date().getTime();
    };

    stopRecording = () => {
        this.setState({
            mode: "",
            showAddSongModal: true,
        });
        this.currentRecording.endTime = new Date().getTime();
    };

    startPlaying = song => {
        this.setState({
            mode: PLAY,
            currentSongId: song._id,
        });
        this.startPlayTimer(song.duration);
        song.events.forEach(event => {
            this.scheduledEvents.push(
                setTimeout(() => {
                    this.setState({
                        activeNotes: [...this.state.activeNotes, event.note],
                    });
                }, event.startTime),
                setTimeout(() => {
                    const updatedActiveNotes = removeFromArray(this.state.activeNotes, event.note);
                    this.setState({
                        activeNotes: updatedActiveNotes,
                    });
                }, event.endTime)
            );
        });
    };

    stopPlaying = () => {
        this.setState({
            mode: "",
            activeNotes: [],
            currentSongId: null,
            songProgress: 0,
        });
        clearInterval(this.timerInterval);
        this.scheduledEvents.forEach(e => clearTimeout(e));
    };

    startPlayTimer(duration) {
        const interval = 1000;
        let timePassed = 0;
        this.timerInterval = setInterval(() => {
            this.setState({
                songProgress: timePassed + interval,
            });
            timePassed = timePassed + interval;
            if (timePassed > duration) {
                this.stopPlaying();
            }
        }, interval);
    }

    onAddSongModalClose = () => {
        this.setState({
            showAddSongModal: false,
        });
        this.resetCurrentRecording();
    };

    resetCurrentRecording = () => {
        this.setState({
            currentRecording: {
                events: [],
                startTime: null,
                endTime: null,
            },
        });
    };

    render() {
        const { mode, showAddSongModal, activeNotes, songProgress, currentSongId } = this.state;

        const isRecording = mode === RECORD;
        const appClasses = cx("app", {
            "app--is-recording": isRecording,
        });

        return (
            <div className={appClasses}>
                <h1>React Piano Task</h1>
                <Piano
                    onPlayNoteInput={this.onPlayNoteInput}
                    onStopNoteInput={this.onStopNoteInput}
                    activeNotes={activeNotes}
                    isDisabled={showAddSongModal}
                />
                {mode === PLAY ? (
                    <Timer time={songProgress} type="big" />
                ) : (
                    <RecordButton
                        onRecordClick={this.startRecording}
                        onStopClick={this.stopRecording}
                        isRecording={isRecording}
                    />
                )}
                <SongsList
                    onPlay={this.startPlaying}
                    onStop={this.stopPlaying}
                    currentSongId={currentSongId}
                    isPlayingDisabled={isRecording}
                />
                {showAddSongModal && (
                    <AddSongModal
                        currentRecording={this.currentRecording}
                        onClose={this.onAddSongModalClose}
                    />
                )}
                {isRecording && (
                    <div className="recording-status">
                        REC <span className="recording-status__icon" />
                    </div>
                )}
            </div>
        );
    }
}

export default App;
