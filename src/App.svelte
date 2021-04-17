<script>
    import Analyzer from "./components/Analyzer.svelte";
    import Navbar from "./components/Navbar.svelte";
    import {page} from "./stores/activePage.js";
    import Options from "./components/Options.svelte";
</script>

<style lang="scss">
    .page-container {
        margin: 0.4em;
    }
</style>

<Navbar/>
<div class="page-container">
    {#if $page === "analyzer"}
        <Analyzer/>
    {:else if $page === "options"}
        <Options/>
    {/if}
</div>
