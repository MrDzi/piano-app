export const removeFromArray = (array, item) => {
    const index = array.indexOf(item);
    if (index === -1) {
        return array;
    }
    const newArray = [...array];
    newArray.splice(index, 1);
    return newArray;
};

export const toDoubleDigit = number => (number < 10 ? "0" + number : number.toString());

export const formatTime = miliseconds => {
    const date = new Date(miliseconds);
    const m = date.getMinutes();
    const s = date.getSeconds();
    return `${toDoubleDigit(m)} : ${toDoubleDigit(s)}`;
};
