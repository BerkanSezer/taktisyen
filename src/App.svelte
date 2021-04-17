<script>
    import Analyzer from "./components/Analyzer.svelte";
    import Navbar from "./components/Navbar.svelte";
    import {page} from "./stores/stores.js";
    import Options from "./components/Options.svelte";
    import Settings from "./components/Settings.svelte";
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
    {:else if $page === "settings"}
        <Settings/>
    {/if}
</div>
