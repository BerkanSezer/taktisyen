// Implementation of Emre's algorithm for syllabication of Turkish expressions.

const _default_stop_characters = "-,;:.?!()"; // Used when loading files without metadata
const _default_filename = "Taktisyen Şiiri.txt";
const short_vowels = "aeıioöuüAEIİOÖUÜ";
const long_vowels = "âêîôûÂÊÎÔÛ";
const vowels = short_vowels.concat(long_vowels);
const consonants = "bcçdfgğhjklmnprsştvyzqwxBCÇDFGĞHJKLMNPRSŞTVYZQWX";
const alphabet = vowels.concat(consonants);
let stop_characters = _default_stop_characters

function is_vowel(letter) {
    return vowels.includes(letter);
}

function next_vowel(text, cur) {
    let index = cur;
    while (true) {
        if (index + 1 >= text.length) {
            return cur;
        }
        if (is_vowel(text[index + 1])) {
            return index + 1;
        }
        index += 1;
    }
}

function are_there_letters_between(text, start, end) {
    let slice = text.slice(start + 1, end);
    for (const character of slice) {
        if (alphabet.includes(character)) {
            return true;
        }
    }
    return false;
}

function previous_letter(text, end) {
    let index = end - 1;
    while (true) {
        if (alphabet.concat(stop_characters).includes(text[index])) {
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
    let current_vowel_index = next_vowel(text, -1);
    let syllables = [];
    let last_syllable_index = 0;
    while (true) {
        let _return_until;
        let next_vowel_index = next_vowel(text, current_vowel_index);
        if (next_vowel_index === current_vowel_index) { // This is the last vowel
            syllables.push(text.slice(last_syllable_index));
            break;
        } else if (!are_there_letters_between(text, current_vowel_index, next_vowel_index)) { // There are two neighbor vowels (sa/at)
            _return_until = next_vowel_index;
        } else {
            _return_until = previous_letter(text, next_vowel_index);
        }

        syllables.push(text.slice(last_syllable_index, _return_until));
        last_syllable_index = _return_until;

        current_vowel_index = next_vowel_index;
    }

    return syllables;
}

function hecele_index(text) {
    let current_vowel_index = next_vowel(text, -1);
    let syllables = [];
    let last_syllable_index = 0;
    while (true) {
        let _return_until;
        let next_vowel_index = next_vowel(text, current_vowel_index);
        if (next_vowel_index === current_vowel_index) {
            syllables.push([last_syllable_index, text.length]);
            break;
        } else if (!are_there_letters_between(text, current_vowel_index, next_vowel_index)) {
            _return_until = next_vowel_index;
        } else {
            _return_until = previous_letter(text, next_vowel_index);
        }

        syllables.push([last_syllable_index, _return_until]);

        current_vowel_index = next_vowel_index;
    }

    return syllables;
}

function is_open(syllable, options) {
    let letters = get_letters(syllable);

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
    if (!options.medli) {}
    else if (letters.length === 2) {
        if (long_vowels.includes(letters[0]) &&
            consonants.includes(letters[1])) {
            return 3;
        }
    } else if (letters.length === 3) {
        if (consonants.includes(letters[0]) &&
            long_vowels.includes(letters[1]) &&
            consonants.includes(letters[2])) {
            return 3;
        } else if (short_vowels.includes(letters[0]) &&
            consonants.includes(letters[1]) &&
            consonants.includes(letters[2])) {
            return 3;
        }
    } else if (letters.length === 4) {
        if (consonants.includes(letters[0]) &&
            short_vowels.includes(letters[1]) &&
            consonants.includes(letters[2]) &&
            consonants.includes(letters[3])
        ) {
            return 3;
        }
    }

    // Açık (.) (fr = 1)
    if (short_vowels.includes(letters[previous_letter(letters, letters.length)])) {
        return 1;
    }

    // Kapalı (-) (fr = 2)
    return 2;
}

function get_letters(syllable) {
    let letters = "";
    for (const char of syllable) {
        if (alphabet.includes(char)) {
            letters = letters.concat(char);
        }
    }
    return letters;
}
