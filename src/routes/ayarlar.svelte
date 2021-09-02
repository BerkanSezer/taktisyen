<script context="module">
    export const prerender = true;
</script>

<script>
    import {page, settings} from "$lib/stores/stores.js";
</script>

<style lang="scss">
    @import "../lib/mixins.scss";

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

<main class="page-secment">
    <h1>Taktisyen Ayarları</h1>

    <div>
        <input type="checkbox" id="syll-decorations" bind:checked={$settings.renderSyllsWithDecorations}>
        <label for="syll-decorations">Heceleri görsel süslemelerle göster</label>
    </div>
</main>
