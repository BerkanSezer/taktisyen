const element_kalipOut = document.getElementById("kalip-output");
const element_textOut = document.getElementById("text-output");

const element_kalipIn = document.getElementById("kalip-input");
const element_textIn = document.getElementById("text-input");

const element_fileInput = document.getElementById("file-input");

const element_visualDifferenceCheckbox = document.getElementById("visual-difference-checkbox");
const element_stopCharacters = document.getElementById("stop-input");
const element_medliCheckbox = document.getElementById("medli-checkbox");
const element_lastSyllableCheckbox = document.getElementById("last-syllable-checkbox");

const element_filenameInput = document.getElementById("filename-input");
const element_root = document.querySelector(":root");

const overrideRegex = /\[[0123]]/g;
const heceCorrespondence = {
    1: "open",
    2: "closed",
    3: "medli",
};
const heceHumanNotation = {
    1: ".",
    2: "-",
    3: "-.",
};

let kalipData = [];

let medliHece;
let lastSyllableClosed;

const _defaultMetadata = {
    sample: "", // Kalıp sample
    stop: _defaultStopCharacters,
    medli: true,
    lastClosed: true, // Last syllable of lines are assumed closed.
};


function importMetadata(md) {
    let usedMetadata = {..._defaultMetadata, ...md};

    element_kalipIn.value = usedMetadata.sample;

    stopCharacters = usedMetadata.stop;
    element_stopCharacters.value = stopCharacters;

    medliHece = usedMetadata.medli;
    element_medliCheckbox.checked = medliHece;

    lastSyllableClosed = usedMetadata.lastClosed;
    element_lastSyllableCheckbox.checked = lastSyllableClosed;

    if (usedMetadata.sample.length !== 0) {
        on_input_kalip();
    } else {
        on_input_text();
    }
}

function exportMetadata() {
    return {
        sample: element_kalipIn.value,
        stop: stopCharacters,
        medli: medliHece,
        lastClosed: lastSyllableClosed,
    };
}

function destroyClickedElement(event) {
    document.body.removeChild(event.target);
}

function updateAnalysis() {
    on_input_kalip();
}

function fixHece(heceCode) {
    let _info = heceCode.split(":");
    let lastChar = _info[1];
    let text = element_textIn.value;
    if (!alphabet.includes(text[lastChar - 1])) {
        lastChar = previousLetter(text, lastChar) + 1;
    }

    let heceType = _info[2];
    let requiredType = kalipData[heceType];
    if (typeof requiredType === "undefined") {
        requiredType = 0;
    }
    insertIntoText(lastChar, "[".concat(requiredType, "]"));
    on_input_text();
}

function insertIntoText(lastCharIndex, whatToInsert) {
    let text = element_textIn.value;
    let newText;
    newText = text.slice(0, lastCharIndex).concat(whatToInsert, text.slice(lastCharIndex));

    element_textIn.value = newText;
}

function on_input_file() {
    let file = element_fileInput.files[0];
    if (!file) {
        return;
    }
    let reader = new FileReader();
    reader.onload = function (e) {
        let contents = e.target.result;
        let metadata;
        let headerLength = 0;

        if (contents.startsWith("[:Taktisyen:")) {
            let header = contents.split("\n")[0];
            let encodedMetadata = header.split(":")[2];
            headerLength = header.length + 2;
            metadata = JSON.parse(decodeURIComponent(escape(atob(encodedMetadata))));
        } else {
            metadata = _defaultMetadata;
        }

        element_textIn.value = contents.slice(headerLength);
        element_filenameInput.value = file.name;
        importMetadata(metadata);
        switchpage(".page.app");
    };
    reader.readAsText(file);
}

function on_input_kalip() {
    element_kalipOut.innerHTML = "";
    kalipData = [];

    let pureKalip = element_kalipIn.value;
    if (pureKalip.length === 0) {
        return;
    } else {
        let kalipHeceler = hecele(pureKalip);

        let kalipLookup = kalipHeceler
            .map(textHece => isOpen(textHece, {ignoreOverride: true, medli: false}))
            .join("")
            .replace(/1/g, "a")
            .replace(/2/g, "k");
        let useKalipLookup = kalipLookup in kalipNames;

        if (useKalipLookup) {
            element_kalipIn.value = kalipNames[kalipLookup];
            pureKalip = element_kalipIn.value;
            kalipHeceler = hecele(pureKalip);
        }

        for (const hece in kalipHeceler) {
            if (kalipHeceler[hece].length === 0) {
                continue;
            }

            let heceType;
            if (hece == kalipHeceler.length - 1 && lastSyllableClosed) {
                heceType = 2;
            } else {
                heceType = isOpen(kalipHeceler[hece], {
                    ignoreOverride: true,
                    medli: (useKalipLookup ? false : medliHece)
                });
            }
            kalipData.push(heceType);

            let newElement = document.createElement("span");
            newElement.className = heceCorrespondence[heceType];
            newElement.innerText = heceHumanNotation[heceType];

            // let separatorElement = document.createElement("span");
            // separatorElement.className = "separator";

            element_kalipOut.appendChild(newElement);
            // element_kalipOut.appendChild(separatorElement);
        }
    }

    on_input_text();
}

function on_input_text() {
    element_textOut.innerHTML = "";
    let pureText = element_textIn.value;
    let lastCharIndex = 0;

    let lines = pureText.split("\n");
    for (const line of lines) {
        if (line.length === 0) {
            element_textOut.appendChild(document.createElement("br"));
        } else if (line.startsWith("[0]")) {
            let tempElement = document.createElement("p");
            tempElement.innerText = line.replace(overrideRegex, "").trim();
            element_textOut.appendChild(tempElement);
            lastCharIndex += line.length;
        } else {
            let emptyKalipData = !kalipData?.length; // jshint ignore:line
            if (emptyKalipData && lines.length > 1) {
                element_kalipIn.value = line;
                on_input_kalip();
                return;
                // When we trigger input on kalipIn, kalipIn triggers input on textIn and thus this function
                // is called and text gets analyzed and printed to output. We don't need to do this again. Just stop.
            }

            let paragraphElement = document.createElement("p");
            let lineHeceler = hecele(line);
            for (const hece in lineHeceler) {
                lastCharIndex += lineHeceler[hece].length;

                if (lineHeceler[hece].length === 0) {
                    continue;
                }

                let heceType;
                if (hece == lineHeceler.length - 1 && lastSyllableClosed) {
                    heceType = 2;
                } else {
                    heceType = isOpen(lineHeceler[hece], {ignoreOverride: false, medli: medliHece});
                }

                let newElement = document.createElement("span");
                newElement.className = heceCorrespondence[heceType];
                let separatorElement = document.createElement("span");
                separatorElement.className = "separator";
                newElement.innerText = lineHeceler[hece].replace(overrideRegex, "");
                if (!emptyKalipData && kalipData[hece] !== heceType && !lineHeceler[hece].endsWith("[0]")) {
                    newElement.classList.add("errored");
                    let hid = `9:${lastCharIndex}:${hece}`;
                    newElement.setAttribute("onclick", `fixHece("${hid}");`);
                }
                paragraphElement.appendChild(newElement);
                paragraphElement.appendChild(separatorElement);
            }
            element_textOut.appendChild(paragraphElement);
        }
        lastCharIndex += 1;
    }
    element_textIn.style.height = Math.max(element_textOut.clientHeight, 120).toString().concat("px");
}

function switchpage(selector) {
    for (const page of document.getElementsByClassName("page")) {
        page.classList.add("inactive");
    }
    document.querySelector(selector).classList.remove("inactive");
}

function on_click_new() {
    element_filenameInput.value = _defaultFilename;
    element_textIn.value = "";
    importMetadata({});
    updateAnalysis();
    switchpage(".page.app");
}

function on_click_save() {
    let textToWrite = "";

    let _data = btoa(unescape(encodeURIComponent(JSON.stringify(exportMetadata()))));

    textToWrite = textToWrite.concat("[:Taktisyen:", _data, ":]\n\n");
    textToWrite = textToWrite.concat(element_textIn.value);

    let textFileAsBlob = new Blob([textToWrite], {type: "text/plain"});
    let fileNameToSaveAs = element_filenameInput.value;

    let downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Dosyayı İndir";
    if (window.webkitURL != null) {
        // Chrome allows the link to be clicked without actually adding it to the DOM.
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    } else {
        // Firefox requires the link to be added to the DOM before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }

    downloadLink.click();
}

function on_click_open() {
    element_fileInput.click();
    element_fileInput.value = "";
}


function download() {
    let content = ["<!DOCTYPE html>\n", document.documentElement.outerHTML];
    let blob = new Blob(content, {type: "text/html"});
    let anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(blob);
    anchor.download = "Taktisyen.html";
    anchor.hidden = true;
    document.body.appendChild(anchor);
    anchor.click();
}


function updateVisualDifference(enabled) {
    ["open", "closed", "medli"].forEach(type => {
        element_root.style.setProperty(
            `--used-${type}-decoration`,
            enabled ? `var(--visible-${type}-decoration)` : "none");
    });
    localStorage.setItem("visualDifferenceForHeceTypes", String(enabled));
}

function setupDefaultStorage() {
    if (!localStorage.getItem("storageSchemaVersion")) {
        localStorage.setItem("storageSchemaVersion", "1");
        localStorage.setItem("visualDifferenceForHeceTypes", "false");
    }
}

function retrieveOptionsFromDefaultStorage() {
    element_visualDifferenceCheckbox.checked = localStorage.getItem("visualDifferenceForHeceTypes") === "true";
    updateVisualDifference(element_visualDifferenceCheckbox.checked);
}

setupDefaultStorage();
retrieveOptionsFromDefaultStorage();

on_click_new();

switchpage(".page.app");
document.getElementById("viewport").hidden = false;
