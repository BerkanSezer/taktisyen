<script>
    import {meaningProperties} from "../../shared/js/dictionaryConstants.js";
    import Chip from "./Chip.svelte";

    export let meaning;
</script>

<style lang="scss">
    h2 {
        margin: 0;
    }

    span.meaning-properties {
        display: inline-flex;
        gap: 0.5em;
        margin-right: 0.5em;
    }

    span.example-text {
        display: inline-block;
    }

    span.writer-name {
        display: inline-block;
        font-weight: bold;
        margin-left: 1em;
    }
</style>

{#if meaning.properties.length !== 0}
    <span class="meaning-properties">
        {#each meaning.properties as property}
            <Chip>{meaningProperties[property]}</Chip>
        {/each}
    </span>
{/if}

<span>{meaning.meaning}</span>

{#if meaning.examples.length !== 0}
    <h2>Örnek kullanımlar:</h2>
    <ol>
        {#each meaning.examples as example}
            <li>
                <span class="example-text">{example.example}</span>
                {#if example.writer}
                    <span class="writer-name">{example.writer.full_name}</span>
                {/if}
            </li>
        {/each}
    </ol>
{/if}
