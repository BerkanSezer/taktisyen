<script>
    import {page} from "../stores/stores.js";
    import {fileData} from "../stores/fileData.js";

    let fileMenuActivated = false;
</script>

<style lang="scss">
    @import "src/shared/scss/mixins.scss";

    nav {
        @include menubar;

        & > button, a {
            @include menubar-item;
        }

        & > div {
            @include menubar-item;

            &::before {
                content: attr(data-title);
            }

            & > div {
                display: none;
            }

            &.activate > div {
                position: absolute;
                left: 0.5em;
                top: 1.5em;

                display: flex;
                flex-direction: column;
                width: 10em;

                border: 2px outset lightgray;

                & > button {
                    height: 2em;
                    padding-left: 2em;
                    border: none;
                    cursor: pointer;
                    text-align: left;

                    &:hover {
                        background-color: #91C9F7;
                    }
                }
            }
        }
    }

    span.spacer {
        margin-left: auto;
    }
</style>

<nav>
    <div data-title="Dosya" class:activate={fileMenuActivated} on:click={() => fileMenuActivated = !fileMenuActivated}>
        <div>
            <button on:click={fileData.promptNew}>Yeni</button>
            <button on:click={fileData.promptSave}>Kaydet...</button>
            <button on:click={fileData.promptLoad}>Aç...</button>
        </div>
    </div>
    <button on:click={() => {$page = "analyzer";}}>Analizci</button>
    <button on:click={() => {$page = "options";}}>Seçenekler</button>
    <button on:click={() => {$page = "settings";}}>Ayarlar</button>
    <span class="spacer"></span>
</nav>
