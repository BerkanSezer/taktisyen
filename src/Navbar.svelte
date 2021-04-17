<script>
    import {fileData} from "./fileData.js";
</script>

<style lang="scss">
    nav {
        display: flex;
        justify-content: space-between;
        background: linear-gradient(to bottom, white, rgb(220, 220, 220));
        padding: 0 0.5em;
    }

    button, a {
        padding: 0.2em 0.5em;
        background: unset;
        border: unset;
        font-size: 1rem;
        font-family: sans-serif;

        $shadow: 0 0 4px rgb(120, 120, 120);

        &:hover {
            box-shadow: $shadow;
            cursor: pointer;
        }

        &:active {
            box-shadow: inset $shadow;
        }
    }

    span.spacer {
        margin-left: auto;
    }
</style>

<nav>
    <button on:click={fileData.promptNew}>Yeni</button>
    <button on:click={fileData.promptSave}>Kaydet...</button>
    <button on:click={fileData.promptLoad}>Aç...</button>
    <span class="spacer"></span>
</nav>
