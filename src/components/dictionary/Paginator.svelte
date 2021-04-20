<script>
    import {PaginationNav} from "svelte-paginate";

    export let totalItems;
    export let pageSize;
    export let currentPage;
    export let limit;
    export let showStepOptions;
</script>

<style lang="scss">
    @import "../../shared/scss/mixins";

    div {
        :global(.pagination-nav) {
            user-select: none;
            display: flex;
            justify-content: center;
            font-family: sans-serif;
            max-width: 50em;
            margin: auto;

            :global(.option) {
                line-height: 150%;
                width: 4em;
                text-align: center;
                margin: 0.5em;

                @include button;
                padding: 0;
            }

            :global(.disabled) {
                background-color: rgb(180, 180, 180);
                cursor: not-allowed;
            }

            :global(.active) {
                background-color: white;
                font-weight: bold;
            }
        }
    }
</style>

<div>
    <PaginationNav
            {totalItems}
            {pageSize}
            {currentPage}
            {limit}
            {showStepOptions}
            on:setPage
    />
</div>