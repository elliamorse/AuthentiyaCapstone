const fetchUUID = () => {
    return fetch("https://www.uuidtools.com/api/generate/v1").then(function (
        response
    ) {
        return response.json();
    });
};

const createNewSession = async () => {
    let uuid = (await fetchUUID())[0];
    await chrome.storage.local.clear();
    await chrome.storage.local.set({ sessionKey: uuid });
    console.log("New Session Created");
    return uuid;
};

const convertToCSV = (objArray) => {
    if (!objArray || !objArray.data){
        console.error("convertToCSV: Invalid input, objArray is undefined or missing 'data' property.");
        return "";
    }

    let data = objArray.data;
    let label = objArray.label;
    let csv = label.join(",") + "\n";
    data.forEach(function (row) {
        row = row.map((datum) => `"${datum}"`);
        csv += row.join(",");
        csv += "\n";
    });
    return csv;
};

const getSessionKey = async () => {
    let sessionKey = await chrome.storage.local.get(["sessionKey"]);
    return sessionKey.sessionKey;
}

const DATA_LABELS = ["type", "key", "timestamp", "hostname", "elementID", "elementName"];