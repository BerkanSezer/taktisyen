<script>
    import {page, settings} from "../stores/stores.js";
</script>

<style lang="scss">
    @import "src/shared/scss/mixins.scss";

    button {
        @include button;
    }

    input[type=checkbox] {
        @include checkbox;
    }

    h1, label {
        font-family: sans-serif;
    }

    div {
        margin-bottom: 1em;
    }
</style>

<h1>Taktisyen Ayarları</h1>

<div>
    <input type="checkbox" id="syll-decorations" bind:checked={$settings.renderSyllsWithDecorations}>
    <label for="syll-decorations">Heceleri görsel süslemelerle göster</label>
</div>
