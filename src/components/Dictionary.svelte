<script>
    import {dictionary} from "../stores/dictionary.js";
    import Filter from "./dictionary/Filter.svelte";
    import WordList from "./dictionary/WordList.svelte";
    import {restrictionFunctions, valueEnums} from "../shared/js/dictionaryConstants.js";
    import {onMount} from "svelte";

    let filters = [];
    let mruId = 0;

    function add() {
        filters = filters.concat({
            filterId: mruId,
            type: null,
            criteria: null,
            syllableCriteria: [0, 0],
            restriction: "is",
            policy: "select",
            enabled: true
        });
        mruId += 1;
    }

    function filterMissingRequiredFields(filter, fields) {
        for (const field of fields) {
            if (filter[field] === null) {
                return true;
            }
        }
        return false;
    }

    function filterEnum(word, filter) {
        if (filterMissingRequiredFields(filter, ["type", "criteria"])) {
            return true;
        }

        if (filter.type === "originLanguage") {
            /*
             * This filter works at the entry level. Other enum filter types
             * (field, tone and part of speech) require us to inspect each meaning
             * of an entry to give a verdict.
             */
            return word.origin_language === filter.criteria;
        } else if (["tone", "pos", "field"].includes(filter.type)) {
            let match;
            meaningIteration: for (const meaning of word.meanings) {
                for (const property of meaning.properties) {
                    if (filter.criteria === "unspecified") {
                        // Any meaning property of the specified kind will do.
                        if (valueEnums[filter.type].hasOwnProperty(property)) {
                            match = true;
                            break meaningIteration;
                        }
                    } else {
                        // We have to get an exact match.
                        if (property === filter.criteria) {
                            match = true;
                            break meaningIteration;
                        }
                    }
                }
            }
            return match;
        }
    }

    function filterText(word, filter, regex) {
        if (filterMissingRequiredFields(filter, ["type", "criteria", "restriction"])) {
            return true;
        }

        if (filter.type === "meaning") {
            let match;
            for (const meaning of word.meanings) {
                if (filter.restriction === "regex") {
                    try {
                        match = regex.test(meaning.meaning);
                        break;
                    } catch (e) {
                        console.error(e);
                        return false;
                    }
                } else {
                    if (restrictionFunctions[filter.restriction](meaning.meaning, filter.criteria)) {
                        match = true;
                        break;
                    }
                }
            }
            return match;
        } else if (["spelling", "pattern"].includes(filter.type)) {
            let whatToTest;
            if (filter.type === "spelling") {
                whatToTest = word.entry;
            } else if (filter.type === "pattern") {
                whatToTest = word.syllCode.join(filter.criteria.includes("/") ? "/" : "");
            }

            if (filter.restriction === "regex") {
                try {
                    return regex.test(whatToTest);
                } catch (e) {
                    console.error(e);
                    return false;
                }
            } else {
                return restrictionFunctions[filter.restriction](whatToTest, filter.criteria);
            }
        }
    }

    $: {
        let sieved = $dictionary.words;
        for (const filter of filters) {

            if (!filter.enabled || filter.type === null) {
                continue;
            }

            let regex;
            if (filter.restriction === "regex") {
                try {
                    regex = RegExp(filter.criteria);
                } catch (e) {
                    console.error(e);
                    continue;
                }
            }

            let min, max;
            if (filter.type === "syllableCount") {
                min = Math.min(...filter.syllableCriteria);
                max = Math.max(...filter.syllableCriteria);
            }

            let survivedThisFilter = [];
            for (const word of sieved) {
                let didThisWordSurvive;

                if (["originLanguage", "tone", "pos", "field"].includes(filter.type)) {
                    didThisWordSurvive = filterEnum(word, filter);
                } else if (["spelling", "meaning", "pattern"].includes(filter.type)) {
                    filter.policy = "select";
                    didThisWordSurvive = filterText(word, filter, regex);
                } else if (filter.type === "syllableCount") {
                    filter.policy = "select";
                    didThisWordSurvive = min <= word.syllables.length && word.syllables.length <= max;
                }

                if (filter.policy === "deny") {
                    didThisWordSurvive = !didThisWordSurvive;
                }
                if (didThisWordSurvive) {
                    survivedThisFilter.push(word);
                }
            }
            sieved = survivedThisFilter;
        }

        $dictionary.filtered = sieved;
    }

    onMount(() => {
        if ($dictionary.status !== "uninitiated") {
            return;
        }

        $dictionary.status = "waiting";
        fetch("https://cdn.taktisyen.tk/data/db.json")
            .then((response) => {
                $dictionary.status = "parsing";
                return response.json();
            })
            .then((data) => {
                $dictionary.words = data;
                $dictionary.status = "completed";
            })
            .catch(() => {
                $dictionary.status = "failed";
                $dictionary.failed = true;
            });
    });

</script>

<style lang="scss">
    h1, p {
        font-family: sans-serif;
    }

    .info {
        text-align: right;
        font-size: 80%;

        p {
            margin: 0;
        }
    }
</style>

<h1>Sözlük</h1>

{#if $dictionary.status === "completed"}

    <div>
        <button on:click={add}>Filtre Ekle</button>
        <button on:click={() => {filters = [];}}>
            Filtreleri Temizle
        </button>
    </div>

    {#each filters as filter}
        <Filter
                bind:enabled={filter.enabled}
                filterId={filter.filterId}
                bind:type={filter.type}
                bind:criteria={filter.criteria}
                bind:policy={filter.policy}
                bind:syllableCriteria={filter.syllableCriteria}
                bind:restriction={filter.restriction}
                on:remove={() => {filters = filters.filter(f => f.filterId !== filter.filterId);}}
        />
    {/each}

    <WordList/>

    <div class="info">
        <p>{$dictionary.words.length} söz dizinlendi.</p>
        <p>Güncel Türkçe Sözlük &copy; Türk Dil Kurumu</p>
    </div>


{:else if $dictionary.status === "parsing"}
    <p>Sözlük durumu: İşleniyor.</p>
    <p>Sözlük verisi işleniyor. Bu adım genellikle kısa sürer.</p>
{:else if $dictionary.status === "waiting"}
    <p>Sözlük durumu: Beklemede.</p>
    <p>Sözlük verisinin aktarılması bekleniyor. Yavaş bir internet bağlantınız varsa bu uzun sürebilir.</p>
{:else if $dictionary.status === "failed"}
    <p>Sözlük durumu: Başarısız.</p>
    <p>Sözlük verisi işlenirken bir hata oluştu. Daha sonra tekrar deneyin.</p>
{/if}
