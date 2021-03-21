const dbURL = "https://cdn.taktisyen.tk/data/db.json";
const dictButton = document.getElementById("dictionary-access-button");

const OriginLanguages = {
    0: "Orijinal",
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

const MeaingProperties = {
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
const element_kalipFilterPolicy = document.getElementById("kalip-filter-policy");

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

    let acceptedEntries = [];
    for (let entry of input) {

        let filterValue = element_kalipFilterValue.value;
        let joiner = (filterValue.search("/") === -1) ? "" : "/";
        let hecelerHumanReadable = humanReadableHecele(entry.entry, joiner);

        let acceptance = restrictionFunctions[element_kalipFilterRestriction.value](hecelerHumanReadable, filterValue);

        if (element_kalipFilterPolicy.value === "deny") {
            acceptance = !acceptance;
        }

        if (acceptance) {
            acceptedEntries.push(entry);
        }
    }
    return acceptedEntries;
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

    let acceptedEntries = [];
    for (let entry of input) {
        let syllableAmount = 0;
        for (let letter of entry.entry) {
            if (vowels.includes(letter)) {
                syllableAmount += 1;
            }
        }

        if (syllableAmount > upperBound) { continue; }
        if (syllableAmount < lowerBound) { continue; }
        acceptedEntries.push(entry);
    }
    return acceptedEntries;
}

const element_filteredWords = document.getElementById("filtered-words");


function applyFilters() {
    let elementsToBeRemoved = document.querySelectorAll("ol#filtered-words li");
    if (elementsToBeRemoved !== null) {
        for (let element of elementsToBeRemoved) {
            element_filteredWords.removeChild(element);
        }
    }

    let stage = applyKalipFilters(db);
    stage = applySyllableCountFilters(stage);

    for (let entry of stage) {
        let element = document.createElement("li");
        let data_spelling = document.createElement("span");
        data_spelling.innerText = entry.entry;
        let data_kalip = document.createElement("span");
        data_kalip.setAttribute("data-kalip", "");

        let joiner = (element_kalipFilterValue.value.search("/") === -1) ? "" : "/";
        data_kalip.innerText = humanReadableHecele(entry.entry, joiner);

        element.appendChild(data_spelling);
        element.appendChild(data_kalip);
        element_filteredWords.appendChild(element);
    }
}
