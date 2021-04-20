<script>
    import Meaning from "./Meaning.svelte";
    import Chip from "./Chip.svelte";

    export let word;
    export let show = false;

</script>

<style lang="scss">
    h1 {
        display: inline;
    }

    span.entry-properties {
        margin-left: 1em;
        display: inline-flex;
        gap: 0.5em;
    }

    li.meaning:not(:first-child) {
        margin-top: 1.5em;
    }

    h2 {
        margin-bottom: 0;
    }

    .panel {
        display: none;

        &.active {
            display: block;
            padding-left: 2.5em;
            border-left: 1px solid black;
        }
    }
</style>

<div class="panel" class:active={show}>
    {#if word.order > 0}
        <h1>{word.entry} ({word.order})</h1>
    {:else}
        <h1>{word.entry}</h1>
    {/if}

    <span class="entry-properties">
        {#if word.original}
            <Chip>{word.original}</Chip>
        {/if}

        {#if word.pronunciation}
            <Chip>{word.pronunciation}</Chip>
        {/if}

        {#if word.prefix}
            <Chip>{word.prefix}-</Chip>
        {/if}

        {#if word.suffix}
            <Chip>-{word.suffix}</Chip>
        {/if}

        {#if word.plural}
            <Chip>çoğul</Chip>
        {/if}

        {#if word.plural}
            <Chip>özel</Chip>
        {/if}
    </span>

    <ol>
        {#each word.meanings as meaning}
            <li class="meaning">
                <Meaning meaning={meaning}/>
            </li>
        {/each}
    </ol>

    {#if word.proverbs.length !== 0}
        <h2>Atasözleri, deyimler ve birleşik sözcükler:</h2>
        <ol>
            {#each word.proverbs as proverb}
                <li>{proverb.proverb}</li>
            {/each}
        </ol>
    {/if}

</div>
