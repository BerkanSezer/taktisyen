<script>
    import {
        findPresetPattern,
        getSyllType as _getSyllType,
        hecele as _hecele,
        humanReadableSyllTypeLookupTable
    } from "$lib/hecele.js";
    import Syll from "$lib/components/Syll.svelte";
    import {fileData} from "$lib/stores/fileData.js";

    const hecele = txt => _hecele(txt, $fileData.meta.stoppingCharacters)
    const getSyllType = (syll, ignoreOverride) => _getSyllType(
        syll,
        $fileData.meta.stoppingCharacters,
        $fileData.meta.medli,
        ignoreOverride
    )

    let pattern;
    $: {
        pattern = hecele($fileData.meta.pattern || "")
            .filter(Boolean)
            .map(syll => ({
                type: getSyllType(syll, true),
                text: syll
            }));
        if (pattern.length && $fileData.meta.assumeLastClosed) {
            pattern[pattern.length - 1].type = 2;
        }
    }

    function changePatternWithPreset() {
        let preset = findPresetPattern(pattern);
        if (preset !== null) {
            $fileData.meta.pattern = preset;
        }
    }

    let sylledText;
    $: {
        sylledText = $fileData.text
            .split("\n")
            .map(line => {
                let syllables = hecele(line)
                    .filter(Boolean)
                    .map(syll => ({
                        type: getSyllType(syll, false),
                        text: syll
                    }));
                if (syllables.length && $fileData.meta.assumeLastClosed) {
                    syllables[syllables.length - 1].type = 2;
                }
                return syllables;
            });
    }
</script>

<style lang="scss">
    @import "../lib/mixins.scss";

    .container {
        display: grid;
        grid-template-areas:
        "kalip-input-label   kalip-output-label"
        "kalip-input-element kalip-output-element"
        "text-input-label    text-output-label"
        "text-input-element  text-output-element";
        grid-template-columns: repeat(2, 1fr);
        grid-column-gap: 1em;
        grid-row-gap: 2px;
    }

    @each $holder in ("kalip-input", "kalip-output", "text-input", "text-output") {
        label[for="#{$holder}"] {
            grid-area: #{$holder}-label;
        }

        ##{$holder} {
            grid-area: #{$holder}-element;
        }
    }

    textarea, #hidden-div {
        resize: none;
        overflow: hidden;
    }

    span.separator::after {
        content: "\5C";
        margin: 0 .1em;
    }

    input[type=text], textarea, #text-output, #kalip-output {
        @include text-input;
        font-size: 1rem;
    }

    #kalip-output {
        font-family: monospace;
        letter-spacing: 0.3em;
        line-height: 160%;
        background-color: rgb(240, 240, 240);
        box-shadow: inset 0 0 4px lightgray;
    }

    *[id^="text"], #kalip-input, #hidden-div {
        font-family: serif;
    }

    label {
        font-family: sans-serif;
    }

    #hidden-div {
        display: none;
        white-space: pre-wrap;
        word-wrap: break-word;
    }
</style>

<div class="container">
    <label for="kalip-input">Kalıp Örneği</label>
    <input type="text"
           id="kalip-input"
           bind:value={$fileData.meta.pattern}
           on:focusout={changePatternWithPreset}
    >

    <label for="kalip-output">Kalıp Analizi</label>
    <div id="kalip-output">
        {#if pattern.length > 0}
            {#each pattern as patternSyll}
                <Syll type={patternSyll.type}>{humanReadableSyllTypeLookupTable[patternSyll.type]}</Syll>
            {/each}
        {/if}
    </div>

    <label for="text-input">Metin Girişi</label>
    <textarea
            id="text-input"
            placeholder="Bütün dünyâya küskündüm, dün akşam pek bunalmıştım..."
            rows="5"
            bind:value={$fileData.text}
    ></textarea>

    <label for="text-output">Metin Analizi</label>
    <div id="text-output">
        {#each sylledText as line}
            {#each line as syllable, syllNumber}
                <Syll
                        type={syllable.type}
                        errored={pattern.length > syllNumber && syllable.type !== pattern[syllNumber].type}
                >{syllable.text}</Syll>
                <span class="separator"></span>
            {/each}
            <br/>
        {/each}
    </div>
</div>
