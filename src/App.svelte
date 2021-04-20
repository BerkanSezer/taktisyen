<script>
    import {page} from "./stores/stores.js";
    import Analyzer from "./components/Analyzer.svelte";
    import Navbar from "./components/Navbar.svelte";
    import Options from "./components/Options.svelte";
    import Settings from "./components/Settings.svelte";
    import Dictionary from "./components/Dictionary.svelte";
    import About from "./components/About.svelte";
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
    {:else if $page === "dictionary"}
        <Dictionary/>
    {:else if $page === "about"}
        <About/>
    {/if}
</div>
