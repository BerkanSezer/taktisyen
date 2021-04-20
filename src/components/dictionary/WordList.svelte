<script>
    import {dictionary} from "../../stores/dictionary.js";
    import {paginate} from "svelte-paginate";
    import Paginator from "./Paginator.svelte";
    import Panel from "./Panel.svelte";
    import Word from "./Word.svelte";

    let page = 1;
    let pageSize = 100;

    $: paginatedItems = paginate({items: $dictionary.filtered, pageSize: pageSize, currentPage: page});

    function showPanel(word) {

    }
</script>

<style lang="scss">
    ol {
        border-radius: 5px;
        border: 2px groove lightgray;
        padding: 0.2em 0.4em 0.2em 4em;
    }

    .words-holder {
        margin-top: 2.5em;
    }
</style>

<div class="words-holder">
    <Paginator
            totalItems={$dictionary.filtered.length}
            pageSize={pageSize}
            currentPage={page}
            limit={3}
            showStepOptions={true}
            on:setPage={(e) => page = e.detail.page}
    />

    <div class="listing-container">
        <ol start={(page - 1)*pageSize + 1}>
            {#each paginatedItems as word}
                <li>
                    <Word {word} show={paginatedItems.length === 1} />
                </li>
            {/each}
        </ol>
    </div>

</div>
