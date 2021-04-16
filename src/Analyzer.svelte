<script>
    import {findPresetPattern, getSyllType, hecele, humanReadableSyllTypeLookupTable} from "./hecele.js";
    import Syll from "./Syll.svelte";

    let patternInput = "";
    let pattern;
    $: pattern = hecele(patternInput).filter(Boolean).map(getSyllType);

    function changePatternWithPreset() {
        let preset = findPresetPattern(pattern);
        if (preset !== null) {
            patternInput = preset;
        }
    }

    let textInput = "";
    let sylledText;
    $: sylledText = textInput.split("\n").map(line => hecele(line).filter(Boolean).map(syll => ({
        type: getSyllType(syll),
        text: syll
    })));
</script>

<style lang="scss">
    .grid-container {
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

    @mixin text-input {
        border-radius: 5px;
        border: 2px groove lightgray;
        padding: 0.2em 0.4em;
    }

    textarea, #hidden-div {
        resize: none;
        overflow: hidden;
    }

    span.separator::after {
        content: "\5C";
        color: gray;
    }

    input[type=text], textarea, #text-output, #kalip-output {
        @include text-input;
    }

    #kalip-output {
        font-family: monospace;
        letter-spacing: 0.3em;
        line-height: 160%;
        background-color: rgb(240, 240, 240);
        box-shadow: inset 0 0 4px lightgray;
    }

    *[id^="text"], #hidden-div {
        font-family: serif;
    }

    #hidden-div {
        display: none;
        white-space: pre-wrap;
        word-wrap: break-word;
    }
</style>

<div class="grid-container">
    <label for="kalip-input">Kalıp Örneği</label>
    <input type="text"
           id="kalip-input"
           bind:value={patternInput}
           on:focusout={changePatternWithPreset}
    >

    <label for="kalip-output">Kalıp Analizi</label>
    <div id="kalip-output">
        {#if pattern.length > 0}
            {#each pattern as patternSyll}
                <Syll type={patternSyll}>{humanReadableSyllTypeLookupTable[patternSyll]}</Syll>
            {/each}
        {/if}
    </div>

    <label for="text-input">Metin Girişi</label>
    <textarea
            id="text-input"
            placeholder="Bütün dünyâya küskündüm, dün akşam pek bunalmıştım..."
            rows="5"
            bind:value={textInput}
    ></textarea>

    <label for="text-output">Metin Analizi</label>
    <div id="text-output">
        {#each sylledText as line}
            <span class="separator"></span>
            {#each line as syllable, syllNumber}
                <Syll
                        type={syllable.type}
                        errored={pattern.length > syllNumber && syllable.type !== pattern[syllNumber]}
                >{syllable.text}</Syll>
                <span class="separator"></span>
            {/each}
            <br/>
        {/each}
    </div>
</div>
