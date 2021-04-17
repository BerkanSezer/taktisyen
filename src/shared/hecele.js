const _defaultStopCharacters = "-,;:.?!*'\"/\\[]{}()"; // Used when loading files without metadata
const _defaultFilename = "Taktisyen Şiiri.txt";
const shortVowels = "aeıioöuüAEIİOÖUÜ";
const longVowels = "âêîôûÂÊÎÔÛ";
const vowels = shortVowels.concat(longVowels);
const consonants = "bcçdfgğhjklmnprsştvyzqwxBCÇDFGĞHJKLMNPRSŞTVYZQWX";
const alphabet = vowels.concat(consonants);
const kalipNames = {
    "kkaakkkakk": "Mef'û'lu/me'fâ'î'lun/fe'û'lun",
    "kkaakakakk": "Mef'û'lu/me'fâ'i'lun/fe'û'lun",
    "kkakkkkakk": "Fâ'lun/fe'û'lun/fâ'lun/fe'û'lun",
    "aakakaakak": "Mü'te'fâ'i'lun/mü'te'fâ'i'lun",

    "kakkkakkkak": "Fâ'i'lâ'tün/fâ'i'lâ'tün/fâ'i'lun",
    "aakkaakkaak": "Fe'i'lâ'tün/me'fa'î'lun/fe'i'lun",
    "akkkakkkakk": "Me'fâ'î'lun/me'fâ'î'lûn/fe'û'lun",
    "kaakkaakkak": "Müf'te'i'lun/müf'te'i'lun/fâ'i'lun",
    "aakkakakaak": "Fe'i'lâ'tün/fe'î'la'tün/fe'i'lun",
    "akkakkakkak": "Fe'û'lun/fe'û'lun/fe'û'lun/fe'ul",

    "kkaakkkkkaakkk": "Mef'û'lu/me'fâ'î'lun/mef'û'lu/me'fâ'î'lun",
    "kkakakkkkakakk": "Mef'û'lu/fâ'i'lâ'tün/mef'û'lu/fâ'i'lâ'tün",
    "akkkakkakkkakk": "Me'fâ'î'lun/fe'û'lun/me'fâ'î'lun/fe'û'lun",
    "kaakkakkaakkak": "Müf'te'i'lun/fâ'i'lun/müf'te'i'lun/fâ'i'lun",
    "kkaakkkakkkakk": "Mef'û'lu/me'fâ'î'lun/me'fâ'î'lun/fe'û'lun",
    "kkaakkaakkaakk": "Mef'û'lu/me'fâ'î'lu/me'fâ'î'lu/fe'û'lun",
    "kkakakaakkakak": "Mef'û'lu/fâ'i'lâ'tü/me'fâ'î'lu/fâ'i'lun",

    "kakkkakkkakkkak": "Fâ'i'lâ'tün/fâ'i'lâ'tün/fâ'i'lâ'tün/fâ'i'lun",
    "aakkaakkaakkaak": "Fe'i'lâ'tün/fe'i'lâ'tün/fe'i'lâ'tün/fe'i'lun",
    "kakkaakkaakkkak": "Fâ'i'lâ'tün/fe'i'lâ'tün/fe'i'lâ'tün/fâ'i'lun",
    "akakaakkakakaak": "Me'fâ'i'lun/fe'i'lâ'tün/me'fâ'i'lun/fe'i'lun",
    "kkakakkakkakakk": "Mef'û'lu/fâ'i'lâ'tün/me'fâ'î'lu/fâ'i'lâ'tün",

    "akakakakakakakak": "Me'fâ'i'lun/me'fâ'i'lun/me'fâ'i'lun/me'fâ'i'lun",
    "akkkakkkakkkakkk": "Me'fâ'î'lun/me'fâ'î'lun/me'fâ'î'lun/me'fâ'î'lun",
    "kkakkkakkkakkkak": "Müs'tef'i'lun/müs'tef'i'lun/müs'tef'i'lun/müs'tef'i'lun",
    "kaakkaakkaakkaak": "Müf'te'i'lun/müf'te'i'lun/müf'te'i'lun/müf'te'i'lun",
    "aakakakkaakakakk": "Mü'te'fâ'i'lun/fe'û'lun/mü'te'fâ'i'lun/fe'û'lun",
    "kaakakakkaakakak": "Müf'te'i'lun/me'fâ'i'lun/müf'te'i'lun/me'fâ'i'lun",
    "kaakkakakaakkaka": "Müf'te'i'lun/fâ'i'lâ'tü/müf'te'i'lun/fâ'i'lâ'tü",
    "kakkkakkkakkkakk": "Fâ'i'lâ'tün/fâ'i'lâ'tün/fâ'i'lâ'tün/fâ'i'lâ'tün",
    "akakaakkakakaakk": "Me'fâ'i'lun/fe'i'lâ'tün/me'fâ'i'lun/fe'i'lâ'tün",
};
let stopCharacters = _defaultStopCharacters;
const humanReadableSyllTypeLookupTable = Object.freeze({
    1: ".",
    2: "-",
    3: "-."
});

function isVowel(letter) {
    return vowels.includes(letter);
}

function nextVowel(text, cur) {
    let index = cur;
    while (true) {
        if (index + 1 >= text.length) {
            return cur;
        }
        if (isVowel(text[index + 1])) {
            return index + 1;
        }
        index += 1;
    }
}

function areThereLettersBetween(text, start, end) {
    let slice = text.slice(start + 1, end);
    for (const character of slice) {
        if (alphabet.includes(character)) {
            return true;
        }
    }
    return false;
}

function previousLetter(text, end) {
    let index = end - 1;
    const acceptableStops = alphabet.concat(stopCharacters);
    while (true) {
        if (acceptableStops.includes(text[index])) {
            break;
        }
        index -= 1;
        if (index <= 0) {
            break;
        }
    }
    return index;
}

function hecele(text) {
    let currentVowelIndex = nextVowel(text, -1);
    let syllables = [];
    let lastSyllableIndex = 0;
    while (true) {
        let _returnUntil;
        let nextVowelIndex = nextVowel(text, currentVowelIndex);
        if (nextVowelIndex === currentVowelIndex) { // This is the last vowel
            syllables.push(text.slice(lastSyllableIndex));
            break;
        } else if (!areThereLettersBetween(text, currentVowelIndex, nextVowelIndex)) { // There are two neighbor vowels (sa/at)
            _returnUntil = nextVowelIndex;
        } else {
            _returnUntil = previousLetter(text, nextVowelIndex);
        }

        syllables.push(text.slice(lastSyllableIndex, _returnUntil));
        lastSyllableIndex = _returnUntil;

        currentVowelIndex = nextVowelIndex;
    }

    return syllables;
}

function countVowels(text) {
    let vowel_count = 0;
    for (let letter of text) {
        if (vowels.includes(letter)) {
            vowel_count += 1;
        }
    }
    return vowel_count;
}

function getSyllType(syllable, options = {ignoreOverride: false, medli: false}) {
    let letters = getLetters(syllable);

    if (!options.ignoreOverride) {
        if (syllable.includes("[1]")) {
            return 1;
        } else if (syllable.includes("[2]")) {
            return 2;
        } else if (syllable.includes("[3!]")) {
            return 3;
        } else if (syllable.includes("[3]")) {
            if (options.medli) {
                return 3;
            }
            return 2;
        }
    }

    // Medli (-.) (fr = 3)
    if (options.medli && isMedli(letters)) {
        return 3;
    }

    // Açık (.) (fr = 1)
    if (shortVowels.includes(letters[previousLetter(letters, letters.length)])) {
        return 1;
    }

    // Kapalı (-) (fr = 2)
    return 2;
}

function isMedli(input) {
    if (input.length === 2) {
        if (longVowels.includes(input[0]) &&
            consonants.includes(input[1])) {
            return true;
        }
    } else if (input.length === 3) {
        if (consonants.includes(input[0]) &&
            longVowels.includes(input[1]) &&
            consonants.includes(input[2])) {
            return true;
        } else if (shortVowels.includes(input[0]) &&
            consonants.includes(input[1]) &&
            consonants.includes(input[2])) {
            return true;
        }
    } else if (input.length === 4) {
        if (consonants.includes(input[0]) &&
            shortVowels.includes(input[1]) &&
            consonants.includes(input[2]) &&
            consonants.includes(input[3])
        ) {
            return true;
        }
    }
    return false;
}

function getLetters(syllable) {
    let letters = "";
    for (const char of syllable) {
        if (alphabet.includes(char)) {
            letters = letters.concat(char);
        }
    }
    return letters;
}

function lowercase(word, removeUnknowns = true, removeCircumflex = true) {
    let aCircumflexReplacement = removeCircumflex ? "a" : "â";
    let iCircumflexReplacement = removeCircumflex ? "i" : "î";
    let uCircumflexReplacement = removeCircumflex ? "u" : "û";

    let reconstructedWord = "";
    for (const letter of word) {
        let lower = letter.toLowerCase();
        if (letter === "I") {
            reconstructedWord = reconstructedWord.concat("ı");
        } else if (letter === "İ") {
            reconstructedWord = reconstructedWord.concat("i");
        } else if (["â", "Â"].includes(letter)) {
            reconstructedWord = reconstructedWord.concat(aCircumflexReplacement);
        } else if (["î", "Î"].includes(letter)) {
            reconstructedWord = reconstructedWord.concat(iCircumflexReplacement);
        } else if (["û", "Û"].includes(letter)) {
            reconstructedWord = reconstructedWord.concat(uCircumflexReplacement);
        } else if (alphabet.includes(lower) || !removeUnknowns) {
            reconstructedWord = reconstructedWord.concat(lower);
        }
    }
    return reconstructedWord;
}

function findPresetPattern(sylledHumanPattern) {
    let query = sylledHumanPattern
        .join("")
        .replace(/1/g, "a")
        .replace(/2/g, "k");
    if (query in kalipNames) {
        return kalipNames[query];
    } else {
        return null;
    }
}

export {
    hecele, getSyllType, humanReadableSyllTypeLookupTable, findPresetPattern, _defaultStopCharacters
}
