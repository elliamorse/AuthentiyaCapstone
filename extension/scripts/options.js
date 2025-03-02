const headerElement = document.getElementById("table-header");
const bodyElement = document.getElementById("table-body");

const tableHeader = (labels) => {
    let ths = labels.reduce((acc, label) => {
        return acc + `<th scope="col">${label}</th>`;
    }, "");
    return `<tr>${ths}</tr>`;
};

const tableRow = (data) => {
    let tds = data.reduce((acc, datum) => {
        return acc + `<td>${datum}</td>`;
    }, "");
    return `<tr>${tds}</tr>`;
};

const renderTable = async () => {
    let data = await chrome.storage.local.get(["keystrokeData"]);
    let keystrokeData = data?.keystrokeData?.data;
    let label = data?.keystrokeData?.label;
    if (!keystrokeData || !label) {
        return;
    }
    headerElement.innerHTML = tableHeader(label);
    let table = keystrokeData?.reduce((acc, data) => {
        return acc + tableRow(data);
    }, "");
    bodyElement.innerHTML = table;
};

renderTable();