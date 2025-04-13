// This is a simple JavaScript file that fetches data from the JSHint API
const API_KEY = "ZJFC3nqRz1MSPnrBWI-LN62p-ds";
const API_URL = "https://ci-jshint.herokuapp.com/api";
const resultsModal = new bootstrap.Modal(
    document.getElementById("resultsModal")
);

document
    .getElementById("status")
    .addEventListener("click", (e) => getStatus(e));

document.getElementById("submit").addEventListener("click", (e) => postForm(e));

async function getStatus(e) {
    const queryString = `${API_URL}?api_key=${API_KEY}`;
    const response = await fetch(queryString);
    const data = await response.json();

    if (response.ok) {
        displayStatus(data);
    } else {
        displayException(data);
        throw new Error(data.error);
    }
}

function displayStatus(data) {
    const title = document.getElementById("resultsModalTitle");
    const bodyText = document.getElementById("results-content");
    title.innerText = "API Key Status";
    bodyText.innerHTML = `Your key is valid until ${data.expiry}.`;
    resultsModal.show();
}

function processOptions(form) {
    const optionsArray = [];
    for (let entry of form.entries()) {
        if (entry[0] === "options") {
            optionsArray.push(entry[1]);
        }
    }
    const options = optionsArray.join(); // converts array to string separated by commas
    form.delete("options");
    form.append("options", options);
    return form;
}

async function postForm(e) {
    const form = processOptions(
        new FormData(document.getElementById("checksform"))
    );

    // for (let entry of form.entries()) {
    //     console.log(entry);
    // }
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            Authorization: API_KEY,
        },
        body: form,
    });
    const data = await response.json();
    if (response.ok) {
        // console.log(data);
        displayErrors(data);
    } else {
        displayException(data);
        console.log(data);
        throw new Error(data.error);
    }
}
function displayErrors(data) {
    let heading = `JSHint Results for ${data.file}`;

    if (data.total_errors === 0) {
        results = `<div class="no_errors">No errors reported!</div>`;
    } else {
        results = `<div>Total Errors: <span class="error_count">${data.total_errors}</span></div>`;
        for (let error of data.error_list) {
            results += `<div>At line <span class="line">${error.line}</span>, `;
            results += `column  <span class="column">${error.col}</span></div>`;
            results += `<div class="error">${error.error}</div>`;
        }
    }

    const title = document.getElementById("resultsModalTitle");
    const bodyText = document.getElementById("results-content");
    title.innerText = heading;
    bodyText.innerHTML = results;

    resultsModal.show();
}

function displayException(data) {
    const title = document.getElementById("resultsModalTitle");
    const bodyText = document.getElementById("results-content");
    title.innerText = "An Exception Occurred";

    let results = `<div>The API returned status code <span class="error-code">${data.status_code}</span></div>`;
    results += `<div>Error number: <span class="error-number"><strong>${data.error_no}</strong></span></div>`;
    results += `<div>Error text: <span class="error-status"><strong>${data.error}</strong></span></div>`;

    bodyText.innerHTML = results;
    resultsModal.show();
}
