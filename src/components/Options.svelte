<script>
    import {fileData} from "../stores/fileData.js";
    import {page} from "../stores/stores.js";
</script>

<style lang="scss">
    @import "src/shared/scss/mixins.scss";

    button {
        @include button;
    }

    input[type=text] {
        @include text-input;
        width: 75%;
        float: right;
    }

    input[type=checkbox] {
        @include checkbox;
    }

    label {
        display: inline;

        &:first-child {
            width: 25%;
        }
    }

    label, h2 {
        font-family: sans-serif;
    }

    #stop-characters {
        font-family: monospace;
    }

    div {
        margin-bottom: 1em;
    }
</style>

<h2>Düzenlenen belgenin seçenekleri</h2>

<div>
    <input id="medli" type="checkbox" bind:checked={$fileData.meta.medli}>
    <label for="medli">Medli hece</label>
</div>

<div>
    <input id="assume-last-closed" type="checkbox" bind:checked={$fileData.meta.assumeLastClosed}>
    <label for="assume-last-closed">Mısraların son hecesini her zaman kapalı say</label>
</div>

<div>
    <label for="stop-characters">Hece ayıran karakterler</label>
    <input id="stop-characters" type="text" bind:value={$fileData.meta.stoppingCharacters}>
</div>

<div>
    <label for="filename">Dosya ismi</label>
    <input id="filename" type="text" bind:value={$fileData.filename}>
</div>
