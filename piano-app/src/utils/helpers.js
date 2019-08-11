export const removeNote = (activeNotes, note) => {
    const notes = [...activeNotes];
    const index = notes.indexOf(note);
    if (index !== -1) {
        notes.splice(index, 1);
    }
    return notes;
};

export const toDoubleDigit = number => (number < 10 ? "0" + number : number.toString());

export const formatTime = miliseconds => {
    const date = new Date(miliseconds);
    const m = date.getMinutes();
    const s = date.getSeconds();
    return `${toDoubleDigit(m)} : ${toDoubleDigit(s)}`;
};
