let kalip_out = $("#kalip-output");
let text_out = $("#text-output");

let kalip_in = $("#kalip-input");
let text_in = $("#text-input");

const override_regex = /\[[0123]\]/g;

const hece_correspondence = {
    1: "open",
    2: "closed",
    3: "medli",
}
const hece_human_notation = {
    1: ".",
    2: "-",
    3: "-.",
}
let kalip_data = [];

let medliHece;
let lastSyllableClosed;

const _default_metadata = {
    sample: "", // Kalıp sample
    stop: _default_stop_characters,
    medli: true,
    lastClosed: true, // Last syllable of lines are assumed closed.
}

import_metadata({});

kalip_in.on("input", function () {
    kalip_out.empty();
    kalip_data = [];

    let kalip_pure = this.value;
    if (kalip_pure.length === 0) {
        return;
    } else {
        let kalip_heceler = hecele(kalip_pure);
        for (const hece in kalip_heceler) {
            if (kalip_heceler[hece].length === 0) {
                continue;
            }

            let hece_type;
            if (hece == kalip_heceler.length - 1 && lastSyllableClosed) {
                hece_type = 2;
            } else {
                hece_type = is_open(kalip_heceler[hece], {ignoreOverride: true, medli: medliHece});
            }
            kalip_data.push(hece_type);

            let new_element = document.createElement(hece_correspondence[hece_type]);
            //let separator_element = document.createElement("separator");
            new_element.innerText = hece_human_notation[hece_type];
            kalip_out.append(new_element/*, separator_element*/);
        }
    }

    text_in.trigger("input");
});

text_in.on("input", function () {
    text_out.empty();
    let text_pure = this.value;

    let lastCharIndex = 0;

    let lines = text_pure.split("\n");
    for (const line of lines) {
        if (line.length === 0) {
            text_out.append($("<br>"));
        } else if (line.startsWith("[0]")) {
            text_out.append($("<span></span>").text(line.replace(override_regex, "")), "<br>");
            lastCharIndex += line.length;
        } else {
            let empty_kalip_data = _.isEqual(kalip_data, []);
            if (empty_kalip_data && lines.length > 1) {
                kalip_in.val(line);
                kalip_in.trigger("input");
                return;
                // When we trigger input on kalip_in, kalip_in triggers input on text_in and thus this function
                // is called and text gets analyzed and printed to output. We don't need to do this again. Just stop.
            }

            let paragraph_element = $("<span></span>");

            let line_heceler = hecele(line);
            for (const hece in line_heceler) {
                lastCharIndex += line_heceler[hece].length;

                if (line_heceler[hece].length === 0) {
                    continue;
                }

                let hece_type;
                if (hece == line_heceler.length - 1 && lastSyllableClosed) {
                    hece_type = 2;
                } else {
                    hece_type = is_open(line_heceler[hece], {ignoreOverride: false, medli: medliHece});
                }

                let new_element = $(document.createElement(hece_correspondence[hece_type]));
                let separator_element = document.createElement("separator");
                new_element.text(line_heceler[hece].replace(override_regex, ""));
                if (!empty_kalip_data && kalip_data[hece] !== hece_type && !line_heceler[hece].endsWith("[0]")) {
                    new_element.addClass("errored");
                    new_element.on("click", function () {
                        fix_hece(new_element.attr("id"));
                    });
                }
                new_element.attr("id", "9:".concat((lastCharIndex).toString(), ":", hece));
                paragraph_element.append(new_element, separator_element);

            }
            text_out.append(paragraph_element, $("<br>"));
        }


        lastCharIndex += 1;
    }

    text_in.height(Math.max(text_out.height(), 120));
});

function export_metadata () {
    return {
        sample: kalip_in.val(),
        stop: stop_characters,
        medli: medliHece,
        lastClosed: lastSyllableClosed,
    }
}

$("#save-button").on("click", function () {
    let textToWrite = "";

    let _data = btoa(unescape(encodeURIComponent(JSON.stringify(export_metadata()))));

    textToWrite = textToWrite.concat("[:Aruzcu:", _data, ":]\n\n")

    textToWrite = textToWrite.concat(document.getElementById('text-input').value);
    let textFileAsBlob = new Blob([textToWrite], {type: 'text/plain'});
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

function import_metadata (md) {
    let use_metadata = {..._default_metadata, ...md};
    kalip_in.val(use_metadata.kalip_sample);
    stop_characters = use_metadata.stop;
    $("#stop-input").val(stop_characters);
    medliHece = use_metadata.medli;
    $("#medli-checkbox").prop("checked", medliHece);
    lastSyllableClosed = use_metadata.lastClosed;
    $("#last-syllable-checkbox").prop("checked", lastSyllableClosed);

    if (use_metadata.sample.length !== 0) {
        kalip_in.trigger("input");
    } else {
        text_in.trigger("input");
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
        let header_length = 0;

        if (contents.startsWith("[:Aruzcu:")) {
            let header = contents.split("\n")[0];
            let encoded_metadata = header.split(":")[2];
            header_length = header.length + 2; // There are two newline characters after the header
            // [:Aruzcu:DATA:]
            metadata = JSON.parse(decodeURIComponent(escape(atob(encoded_metadata))))
        } else {
            metadata = _default_metadata;
        }

        text_in.val(contents.slice(header_length));
        $("#filename-input").val(file.name);

        import_metadata(metadata);
    };
    reader.readAsText(file);
});

$("#new-button").on("click", function () {
    $("#filename-input").val(_default_filename);
    import_metadata({});
    update_text_analysis();
});

function destroyClickedElement(event) {
    // remove the link from the DOM
    document.body.removeChild(event.target);
}

function update_text_analysis() {
    if (kalip_in.val().length === 0) {
        text_in.trigger("input");
    } else {
        kalip_in.trigger("input");
    }
}

$("#last-syllable-checkbox").on("change", function () {
    lastSyllableClosed = $(this).prop("checked");
    update_text_analysis();
});

$("#medli-checkbox").on("change", function () {
    medliHece = $(this).prop("checked");
    update_text_analysis();
});

$("#stop-input").val(stop_characters).on("input", function () {
    stop_characters = $(this).val().replace(/[\[\]]/g, "");
    update_text_analysis();
    this.value = stop_characters;
});

$("#filename-input").val(_default_filename);

function fix_hece(hece_code) {
    let _info = hece_code.split(":");
    if (_info[0] !== "9") {
        console.warn("9 magic not present. Trying to fix anyway.")
    }
    let lastChar = _info[1];
    let text = text_in.val();
    if (!alphabet.includes(text[lastChar - 1])) {
        lastChar = previous_letter(text, lastChar) + 1;
    }

    let heceType = _info[2];
    let requiredType = kalip_data[heceType]
    if (requiredType === undefined) {
        requiredType = 0;
    }
    insert_into_text(lastChar, "[".concat(requiredType, "]"));
    text_in.trigger("input");
}

function insert_into_text(lastCharIndex, whatToInsert) {
    let text = text_in.val();
    let newText;
    newText = text.slice(0, lastCharIndex).concat(whatToInsert, text.slice(lastCharIndex));

    text_in.val(newText);
}
