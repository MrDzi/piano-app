const LocalStorageService = {
    get(item) {
        return JSON.parse(window.localStorage.getItem(item));
    },
    set(item, value) {
        window.localStorage.setItem(item, JSON.stringify(value));
    },
};

export default LocalStorageService;
