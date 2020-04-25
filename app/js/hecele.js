// Implementation of Emre's algorithm for syllabication of Turkish expressions.

const _defaultStopCharacters = "-,;:.?!()"; // Used when loading files without metadata
const _defaultFilename = "Taktisyen Şiiri.txt";
const shortVowels = "aeıioöuüAEIİOÖUÜ";
const longVowels = "âêîôûÂÊÎÔÛ";
const vowels = shortVowels.concat(longVowels);
const consonants = "bcçdfgğhjklmnprsştvyzqwxBCÇDFGĞHJKLMNPRSŞTVYZQWX";
const alphabet = vowels.concat(consonants);
let stopCharacters = _defaultStopCharacters;

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
    while (true) {
        if (alphabet.concat(stopCharacters).includes(text[index])) {
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

function isOpen(syllable, options) {
    let letters = getLetters(syllable);

    if (!options.ignoreOverride) {
        if (syllable.includes("[1]")) {
            return 1;
        } else if (syllable.includes("[2]")) {
            return 2;
        } else if (syllable.includes("[3!]")) {
            return 3;
        } else if (syllable.includes("[3]")) {
            return options.medli;
        }
    }

    // Medli (-.) (fr = 3)
    if (options.medli && isMedli(letters)) {
        return true;
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
