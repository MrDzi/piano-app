import { toDoubleDigit, formatTime, removeFromArray } from "../utils/helpers";

describe("A Helpers suite", () => {
    it("should return double digit number converted to a string", () => {
        expect(toDoubleDigit(0)).toBe("00");
        expect(toDoubleDigit(2)).toBe("02");
        expect(toDoubleDigit(12)).toBe("12");
    });

    it("should return the time in format 'MM:SS'", () => {
        expect(formatTime(1000)).toBe("00 : 01");
        expect(formatTime(60 * 1000)).toBe("01 : 00");
    });

    it("should return new array with removed note", () => {
        const activeNotes = [46, 47, 48];
        const note1 = 46;
        expect(removeFromArray(activeNotes, note1)).toEqual([47, 48]);

        const note2 = 45;
        expect(removeFromArray(activeNotes, note2)).toEqual([46, 47, 48]);
    });
});
