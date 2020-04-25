let kalipOut = $("#kalip-output");
let textOut = $("#text-output");

let kalipIn = $("#kalip-input");
let textIn = $("#text-input");

const overrideRegex = /\[[0123]\]/g;

const heceCorrespondence = {
    1: "open",
    2: "closed",
    3: "medli",
}
const heceHumanNotation = {
    1: ".",
    2: "-",
    3: "-.",
}
let kalipData = [];

let medliHece;
let lastSyllableClosed;

const _defaultMetadata = {
    sample: "", // Kalıp sample
    stop: _defaultStopCharacters,
    medli: true,
    lastClosed: true, // Last syllable of lines are assumed closed.
}

importMetadata({});

kalipIn.on("input", function () {
    kalipOut.empty();
    kalipData = [];

    let pureKalip = this.value;
    if (pureKalip.length === 0) {
        return;
    } else {
        let kalipHeceler = hecele(pureKalip);
        for (const hece in kalipHeceler) {
            if (kalipHeceler[hece].length === 0) {
                continue;
            }

            let heceType;
            if (hece == kalipHeceler.length - 1 && lastSyllableClosed) {
                heceType = 2;
            } else {
                heceType = isOpen(kalipHeceler[hece], {ignoreOverride: true, medli: medliHece});
            }
            kalipData.push(heceType);

            let newElement = document.createElement(heceCorrespondence[heceType]);
            //let separatorElement = document.createElement("separator");
            newElement.innerText = heceHumanNotation[heceType];
            kalipOut.append(newElement/*, separatorElement*/);
        }
    }

    textIn.trigger("input");
});

textIn.on("input", function () {
    textOut.empty();
    let pureText = this.value;

    let lastCharIndex = 0;

    let lines = pureText.split("\n");
    for (const line of lines) {
        if (line.length === 0) {
            textOut.append($("<br>"));
        } else if (line.startsWith("[0]")) {
            textOut.append($("<span></span>").text(line.replace(overrideRegex, "")), "<br>");
            lastCharIndex += line.length;
        } else {
            let emptyKalipData = _.isEqual(kalipData, []);
            if (emptyKalipData && lines.length > 1) {
                kalipIn.val(line);
                kalipIn.trigger("input");
                return;
                // When we trigger input on kalipIn, kalipIn triggers input on textIn and thus this function
                // is called and text gets analyzed and printed to output. We don't need to do this again. Just stop.
            }

            let paragraphElement = $("<span></span>");

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

                let newElement = $(document.createElement(heceCorrespondence[heceType]));
                let separatorElement = document.createElement("separator");
                newElement.text(lineHeceler[hece].replace(overrideRegex, ""));
                if (!emptyKalipData && kalipData[hece] !== heceType && !lineHeceler[hece].endsWith("[0]")) {
                    newElement.addClass("errored");
                    newElement.on("click", function () {
                        fixHece(newElement.attr("id"));
                    });
                }
                newElement.attr("id", "9:".concat((lastCharIndex).toString(), ":", hece));
                paragraphElement.append(newElement, separatorElement);

            }
            textOut.append(paragraphElement, $("<br>"));
        }


        lastCharIndex += 1;
    }

    textIn.height(Math.max(textOut.height(), 120));
});

function exportMetadata () {
    return {
        sample: kalipIn.val(),
        stop: stopCharacters,
        medli: medliHece,
        lastClosed: lastSyllableClosed,
    };
}

$("#save-button").on("click", function () {
    let textToWrite = "";

    let _data = btoa(unescape(encodeURIComponent(JSON.stringify(exportMetadata()))));

    textToWrite = textToWrite.concat("[:Taktisyen:", _data, ":]\n\n");

    textToWrite = textToWrite.concat(document.getElementById("text-input").value);
    let textFileAsBlob = new Blob([textToWrite], {type: "text/plain"});
    let fileNameToSaveAs = $("#filename-input").val();

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
});

$("#open-button").on("click", function () {
    $("#file-input").trigger("click").val("");
});

function importMetadata (md) {
    let usedMetadata = {..._defaultMetadata, ...md};
    kalipIn.val(usedMetadata.kalipSample);
    stopCharacters = usedMetadata.stop;
    $("#stop-input").val(stopCharacters);
    medliHece = usedMetadata.medli;
    $("#medli-checkbox").prop("checked", medliHece);
    lastSyllableClosed = usedMetadata.lastClosed;
    $("#last-syllable-checkbox").prop("checked", lastSyllableClosed);

    if (usedMetadata.sample.length !== 0) {
        kalipIn.trigger("input");
    } else {
        textIn.trigger("input");
    }
}

$("#file-input").on("input", function () {
    let file = this.files[0];
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
            headerLength = header.length + 2; // There are two newline characters after the header
            // [:Taktisyen:DATA:]
            metadata = JSON.parse(decodeURIComponent(escape(atob(encodedMetadata))));
        } else {
            metadata = _defaultMetadata;
        }

        textIn.val(contents.slice(headerLength));
        $("#filename-input").val(file.name);

        importMetadata(metadata);
    };
    reader.readAsText(file);
});

$("#new-button").on("click", function () {
    $("#filename-input").val(_defaultFilename);
    importMetadata({});
    updateTextAnalysis();
});

function destroyClickedElement(event) {
    // remove the link from the DOM
    document.body.removeChild(event.target);
}

function updateTextAnalysis() {
    if (kalipIn.val().length === 0) {
        textIn.trigger("input");
    } else {
        kalipIn.trigger("input");
    }
}

$("#last-syllable-checkbox").on("change", function () {
    lastSyllableClosed = $(this).prop("checked");
    updateTextAnalysis();
});

$("#medli-checkbox").on("change", function () {
    medliHece = $(this).prop("checked");
    updateTextAnalysis();
});

$("#stop-input").val(stopCharacters).on("input", function () {
    stopCharacters = $(this).val().replace(/[\[\]]/g, "");
    updateTextAnalysis();
    this.value = stopCharacters;
});

$("#filename-input").val(_defaultFilename);

function fixHece(heceCode) {
    let _info = heceCode.split(":");
    let lastChar = _info[1];
    let text = textIn.val();
    if (!alphabet.includes(text[lastChar - 1])) {
        lastChar = previousLetter(text, lastChar) + 1;
    }

    let heceType = _info[2];
    let requiredType = kalipData[heceType];
    if (typeof requiredType === "undefined") {
        requiredType = 0;
    }
    insertIntoText(lastChar, "[".concat(requiredType, "]"));
    textIn.trigger("input");
}

function insertIntoText(lastCharIndex, whatToInsert) {
    let text = textIn.val();
    let newText;
    newText = text.slice(0, lastCharIndex).concat(whatToInsert, text.slice(lastCharIndex));

    textIn.val(newText);
}
