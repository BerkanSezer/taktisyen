const dbURL = "https://cdn.taktisyen.tk/data/db.json";
const dictButton = document.getElementById("dictionary-access-button");

const OriginLanguages = {
    0: "Belirtilmemiş veya Orijinal",
    19: "Bileşik",

    11: "Arapça",
    12: "Farsça",
    13: "Fransızca",
    14: "İtalyanca",
    15: "Yunanca",
    16: "Latince",
    18: "İngilizce",
    20: "İspanyolca",
    21: "Ermenice",
    22: "Rusça",
    23: "Almanca",
    24: "Slavca",
    25: "İbranice",
    26: "Macarca",
    27: "Bulgarca",
    28: "Portekizce",

    346: "Japonca",
    348: "Arnavutça",

    354: "Moğolca",
    153: "Moğolca(2)",

    392: "Fince",
    393: "Rumca",
    395: "Soğdanca",
    486: "Sırpça",
    420: "Korece",
};

const Tones = {
    30: "argo (üslup)",
    31: "eskimiş (üslup)",
    32: "mecaz (üslup)",
    33: "halk ağzında (üslup)",
    34: "teklifsiz konuşmada (üslup)",
    35: "alay yollu (üslup)",
    36: "kaba konuşmada (üslup)",
    37: "şaka yollu (üslup)",
    38: "hakaret yollu (üslup)",
};

const PartsOfSpeech = {
    18: "ünlem (sözcük türü)",
    19: "isim (sözcük türü)",
    20: "sıfat (sözcük türü)",
    21: "-e (sözcük türü)",
    22: "-i (sözcük türü)",
    23: "nesnesiz (sözcük türü)",
    24: "zarf (sözcük türü)",
    25: "-le (sözcük türü)",
    26: "-den (sözcük türü)",
    27: "edat (sözcük türü)",
    28: "bağlaç (sözcük türü)",
    29: "zamir (sözcük türü)",
    82: "yardımcı  fiil (sözcük türü)",
    83: "-de (sözcük türü)",
};

const Fields = {
    39: "müzik (alan)",
    40: "spor (alan)",
    41: "bitki bilimi (alan)",
    42: "denizcilik (alan)",
    43: "tarih (alan)",
    44: "gök bilimi (alan)",
    45: "coğrafya (alan)",
    46: "dil bilgisi (alan)",
    47: "ruh bilimi (alan)",
    48: "kimya (alan)",
    49: "anatomi (alan)",
    50: "ticaret (alan)",
    51: "hukuk (alan)",
    52: "matematik (alan)",
    53: "hayvan bilimi (alan)",
    54: "edebiyat (alan)",
    55: "sinema (alan)",
    56: "biyoloji (alan)",
    57: "felsefe (alan)",
    58: "fizik (alan)",
    59: "tiyatro (alan)",
    60: "jeoloji (alan)",
    61: "teknik (alan)",
    62: "toplum bilimi (alan)",
    63: "fizyoloji (alan)",
    64: "meteoroloji (alan)",
    65: "mantık (alan)",
    66: "ekonomi (alan)",
    67: "mimarlık (alan)",
    68: "mineraloji (alan)",
    69: "eğitim bilimi (alan)",
    73: "askerlik (alan)",
    80: "geometri (alan)",
    81: "teknoloji (alan)",
    84: "dil bilimi (alan)",
    85: "tıp (alan)",
    87: "televizyon (alan)",
    88: "din bilgisi (alan)",
    96: "madencilik (alan)",
    98: "bilişim (alan)",
    99: "mit. (alan)",
    105: "antropoloji (alan)",
};

const MeaningProperties = {
    18: "ünlem (sözcük türü)",
    19: "isim (sözcük türü)",
    20: "sıfat (sözcük türü)",
    21: "-e (sözcük türü)",
    22: "-i (sözcük türü)",
    23: "nesnesiz (sözcük türü)",
    24: "zarf (sözcük türü)",
    25: "-le (sözcük türü)",
    26: "-den (sözcük türü)",
    27: "edat (sözcük türü)",
    28: "bağlaç (sözcük türü)",
    29: "zamir (sözcük türü)",
    30: "argo (üslup)",
    31: "eskimiş (üslup)",
    32: "mecaz (üslup)",
    33: "halk ağzında (üslup)",
    34: "teklifsiz konuşmada (üslup)",
    35: "alay yollu (üslup)",
    36: "kaba konuşmada (üslup)",
    37: "şaka yollu (üslup)",
    38: "hakaret yollu (üslup)",
    39: "müzik (alan)",
    40: "spor (alan)",
    41: "bitki bilimi (alan)",
    42: "denizcilik (alan)",
    43: "tarih (alan)",
    44: "gök bilimi (alan)",
    45: "coğrafya (alan)",
    46: "dil bilgisi (alan)",
    47: "ruh bilimi (alan)",
    48: "kimya (alan)",
    49: "anatomi (alan)",
    50: "ticaret (alan)",
    51: "hukuk (alan)",
    52: "matematik (alan)",
    53: "hayvan bilimi (alan)",
    54: "edebiyat (alan)",
    55: "sinema (alan)",
    56: "biyoloji (alan)",
    57: "felsefe (alan)",
    58: "fizik (alan)",
    59: "tiyatro (alan)",
    60: "jeoloji (alan)",
    61: "teknik (alan)",
    62: "toplum bilimi (alan)",
    63: "fizyoloji (alan)",
    64: "meteoroloji (alan)",
    65: "mantık (alan)",
    66: "ekonomi (alan)",
    67: "mimarlık (alan)",
    68: "mineraloji (alan)",
    69: "eğitim bilimi (alan)",
    73: "askerlik (alan)",
    80: "geometri (alan)",
    81: "teknoloji (alan)",
    82: "yardımcı  fiil (sözcük türü)",
    83: "-de (sözcük türü)",
    84: "dil bilimi (alan)",
    85: "tıp (alan)",
    87: "televizyon (alan)",
    88: "din bilgisi (alan)",
    96: "madencilik (alan)",
    98: "bilişim (alan)",
    99: "mit. (alan)",
    105: "antropoloji (alan)",
};

let db;

fetch(dbURL)
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        dictButton.classList.remove("inactive");
        db = data;

        for (let element of document.getElementsByClassName("dict-size")) {
            element.innerText = db.length;
        }
    })
    .catch(() => { dictButton.classList.add("inactive"); }
    );

const syllableTypeLookup = {
    3: "-.",
    2: "-",
    1: "."
};


const element_kalipFilterEnabled = document.getElementById("kalip-filter-enabled");
const element_kalipFilterValue = document.getElementById("kalip-filter-value");
const element_kalipFilterRestriction = document.getElementById("kalip-filter-restriction");

const restrictionFunctions = {
    "is": (syll, filter) => syll === filter,
    "startswith": (syll, filter) => syll.startsWith(filter),
    "endswith": (syll, filter) => syll.endsWith(filter)
};


let computerReadableHeceTypeFinder = hece => isOpen(hece, {medli: true});
let humanReadableHecele = (word, joiner) => hecele(word).map(computerReadableHeceTypeFinder).map(h => syllableTypeLookup[h] ).join(joiner);


function applyKalipFilters(input) {
    if (!element_kalipFilterEnabled.checked) {
        return input;
    }

    let filterValue = element_kalipFilterValue.value;
    let restriction = element_kalipFilterRestriction.value;

    return input.filter(entry =>
        restrictionFunctions[restriction](
            humanReadableHecele(
                entry.entry,
                (filterValue.search("/") === -1) ? "": "/"
            ),
            filterValue
        )
    );
}


const element_syllableCountFilterBound1 = document.getElementById("syllable-count-filter-bound-1");
const element_syllableCountFilterBound2 = document.getElementById("syllable-count-filter-bound-2");
const element_syllableCountFilterEnabled = document.getElementById("syllable-count-filter-enabled");

function applySyllableCountFilters(input) {
    if (!element_syllableCountFilterEnabled.checked) {
        return input;
    }

    let bound1 = element_syllableCountFilterBound1.value;
    let bound2 = element_syllableCountFilterBound2.value;

    let upperBound = Math.max(bound1, bound2);
    let lowerBound = Math.min(bound1, bound2);

    return input.filter(entry => {
        let x = countVowels(entry.entry);
        return (x <= upperBound) && (x >= lowerBound);
    });
}


function applyGenericMeaningPropertyEnumFilter(input, enabled, enumDict, filterValue, acceptancePolicy) {
    if (!enabled) {
        return input;
    }

    let acceptedEntries = [];
    for (let entry of input) {
        let processedEntry = false;
        let matchesFilter = filterValue === "unspecified";

        for (let meaning of entry.meanings) {
            if (processedEntry) { continue; }

            for (let property of meaning.properties) {
                if (processedEntry) { continue; }

                if (filterValue === "unspecified") {
                    if (enumDict.hasOwnProperty(Number(property))) {
                        matchesFilter = false;
                        processedEntry = true;
                    }
                } else {
                    if (property == filterValue) {
                        matchesFilter = true;
                        processedEntry = true;
                    }
                }
            }
        }

        if (acceptancePolicy === "deny") { matchesFilter = !matchesFilter; }
        if (matchesFilter) {
            acceptedEntries.push(entry);
        }
    }
    return acceptedEntries;
}


const element_toneFilterEnabled = document.getElementById("tone-filter-enabled");
const element_toneFilterValue = document.getElementById("tone-filter-value");
const element_toneFilterPolicy = document.getElementById("tone-filter-policy");

function applyToneFilter(input) {
    return applyGenericMeaningPropertyEnumFilter(
        input,
        element_toneFilterEnabled.checked,
        Tones,
        element_toneFilterValue.value,
        element_toneFilterPolicy.value,
    );
}


const element_posFilterEnabled = document.getElementById("pos-filter-enabled");
const element_posFilterValue = document.getElementById("pos-filter-value");
const element_posFilterPolicy = document.getElementById("pos-filter-policy");

function applyPOSFilter(input) {
    return applyGenericMeaningPropertyEnumFilter(
        input,
        element_posFilterEnabled.checked,
        PartsOfSpeech,
        element_posFilterValue.value,
        element_posFilterPolicy.value,
    );
}


const element_originLanguageFilterEnabled = document.getElementById("origin-language-filter-enabled");
const element_originLanguageFilterValue = document.getElementById("origin-language-filter-value");
const element_originLanguageFilterPolicy = document.getElementById("origin-language-filter-policy");

function applyOriginLanguageFilter(input) {
    if (!element_originLanguageFilterEnabled.checked) {
        return input;
    }

    let filterValue = element_originLanguageFilterValue.value;
    let flipDueToPolicy = element_originLanguageFilterPolicy.value === "deny";

    if (!flipDueToPolicy) {
        return input.filter(entry => entry.origin_language == filterValue);
    } else {
        return input.filter(entry => entry.origin_language != filterValue);
    }
}

const element_fieldFilterEnabled = document.getElementById("field-filter-enabled");
const element_fieldFilterValue = document.getElementById("field-filter-value");

function applyFieldFilter(input) {
    return applyGenericMeaningPropertyEnumFilter(
        input,
        element_fieldFilterEnabled.checked,
        Fields,
        element_fieldFilterValue.value,
        "accept",
    );
}


function applyFilters() {
    let wordPre = document.getElementById("filtered-words-pre");
    wordPre.innerText = "";

    let stage = applyKalipFilters(db);
    stage = applySyllableCountFilters(stage);
    stage = applyToneFilter(stage);
    stage = applyOriginLanguageFilter(stage);
    stage = applyPOSFilter(stage);
    stage = applyFieldFilter(stage);

    const mxl = String(stage.length).length;

    let counter = 0;
    wordPre.innerText =
        stage.map( entry => {
            counter += 1;
            return (
                `${String(counter).padStart(mxl)}. ${entry.entry}  ${humanReadableHecele(entry.entry, "/")}`
            );
        }).join("\n");
}
