<script>
    import Panel from "./Panel.svelte";

    export let word;
    export let show;

    let textElement;

</script>

<style lang="scss">
    span {
        cursor: pointer;
    }
</style>

<span bind:this={textElement} on:click={() => {show = !show;}}>{word.entry}</span>
<Panel {word} bind:show={show}/>
