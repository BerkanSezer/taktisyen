import {writable} from "svelte/store";
import {_defaultStopCharacters} from "../shared/js/hecele";

export const defaultData = Object.freeze({
    text: "",
    filename: "Taktisyen Şiiri.txt",
    meta: {
        pattern: "",
        medli: true,
        assumeLastClosed: true,
        stoppingCharacters: _defaultStopCharacters,
    }
});

function createFileData() {
    const {subscribe, set, update} = writable(JSON.parse(JSON.stringify(defaultData)));
    return {
        subscribe, set, update,
        promptNew: () => update(data => {
            if (data.text.length > 0 && confirm("Yazılmış şiir silinecek.")) {
                return JSON.parse(JSON.stringify(defaultData));
            }
            return data;
        }),
        promptSave: () => update(data => {
            let text = "";
            let header = btoa(unescape(encodeURIComponent(JSON.stringify(data.meta))));

            text = text.concat("[:Taktisyen:", header, ":]\n\n", data.text);

            let blob = new Blob([text], {type: "text/plain"});

            let downloadLink = document.createElement("a");
            downloadLink.download = data.filename;
            if (window.webkitURL != null) {
                downloadLink.href = window.webkitURL.createObjectURL(blob);
            } else {
                downloadLink.href = window.URL.createObjectURL(blob);
                downloadLink.onclick = (e) => document.body.removeChild(e.target);
                downloadLink.style.display = "none";
                document.body.appendChild(downloadLink);
            }
            downloadLink.click();

            return data;
        }),
        promptLoad: () => {
            let fileInput = document.createElement("input");
            fileInput.accept = "text/plain";
            fileInput.hidden = true;
            fileInput.type = "file";
            fileInput.oninput = () => {
                let file = fileInput.files[0];
                if (!file) {
                    return;
                }
                let reader = new FileReader();
                reader.onload = e => {
                    let contents = e.target.result;
                    let metadata;
                    let headerLength = 0;

                    if (contents.startsWith("[:Taktisyen:")) {
                        let header = contents.split("\n", 1)[0];
                        let encodedMetadata = header.split(":")[2];
                        headerLength = header.length + 2;
                        metadata = JSON.parse(decodeURIComponent(escape(atob(encodedMetadata))));
                        if (metadata.hasOwnProperty("lastClosed")) {
                            metadata = {
                                pattern: metadata.sample,
                                medli: metadata.medli,
                                assumeLastClosed: metadata.lastClosed,
                                stoppingCharacters: metadata.stop,
                            }
                        }
                    } else {
                        metadata = JSON.parse(JSON.stringify(defaultData.meta));
                    }

                    set({
                        text: contents.slice(headerLength),
                        meta: metadata,
                        filename: file.name
                    });
                };
                reader.readAsText(file);
            }
            fileInput.click();
            fileInput.value = "";
        }
    }
}

export const fileData = createFileData();
