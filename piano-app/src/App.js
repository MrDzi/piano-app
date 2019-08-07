import React from "react";
import "./app.scss";
import Piano from "./components/Piano";
import AddSongModal from "./components/AddSongModal";
import SongsList from "./components/SongsList";
import RecordButton from "./uiComponents/RecordButton";
import Timer from "./uiComponents/Timer";
import { removeNote } from "./utils/helpers";
import { RECORD, PLAY } from "./utils/constants";

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

    startTimer(duration) {
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

    startPlaying = song => {
        this.setState({
            mode: PLAY,
            currentSongId: song._id,
        });
        this.startTimer(song.duration);
        song.events.forEach(event => {
            this.scheduledEvents.push(
                setTimeout(() => {
                    this.setState({
                        activeNotes: [...this.state.activeNotes, event.note],
                    });
                }, event.startTime),
                setTimeout(() => {
                    const updatedActiveNotes = removeNote(this.state.activeNotes, event.note);
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
        this.scheduledEvents.forEach(v => clearTimeout(v));
    };

    onRecordingSave = () => {
        this.setState({
            showAddSongModal: false,
        });
        this.currentRecording = {};
    };

    onRecordingSaveCancel = () => {
        this.setState({
            showAddSongModal: false,
        });
        this.currentRecording = {};
    };

    render() {
        const { mode, showAddSongModal, activeNotes, songProgress, currentSongId } = this.state;

        const isRecording = mode === RECORD;

        return (
            <div className="app">
                <h1>React Piano Task</h1>
                <Piano
                    isDisabled={showAddSongModal}
                    onPlayNoteInput={this.onPlayNoteInput}
                    onStopNoteInput={this.onStopNoteInput}
                    activeNotes={activeNotes}
                />
                {mode === PLAY ? (
                    <Timer time={songProgress} />
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
                />
                {showAddSongModal && (
                    <AddSongModal
                        currentRecording={this.currentRecording}
                        onSave={this.onRecordingSave}
                        onCancel={this.onRecordingSaveCancel}
                    />
                )}
            </div>
        );
    }
}

export default App;
