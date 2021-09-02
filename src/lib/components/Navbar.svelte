<script>
    import {page} from "$lib/stores/stores.js";
    import {fileData} from "$lib/stores/fileData.js";
    
    let fileMenuActivated = false;
</script>

<style lang="scss">
    @import "../mixins.scss";

    nav {
        @include menubar;
        height: 1.5em;

        & button, a {
            @include menubar-item;

            color: black;
            text-decoration: none;
        }

        & > div {
            @include menubar-item;

            &::before {
                content: attr(data-title);
            }

            & > .buttons-container {
                display: none;
            }

            &.activate > .buttons-container {
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

                    background: #f0f0f0;

                    &:hover {
                        background-color: #91C9F7;
                    }
                }
            }
        }

        & > img {
            padding: 0.1em;
        }
    }

    span.spacer {
        margin-left: auto;
    }

    span.separator {
        border-right: 1px solid gray;
        margin: 0 0.5em;
    }
</style>

<nav>
    <div data-title="Dosya" class:activate={fileMenuActivated} on:click={() => fileMenuActivated = !fileMenuActivated}>
        <div class="buttons-container">
            <button on:click={fileData.promptNew}>Yeni</button>
            <button on:click={fileData.promptSave}>Kaydet...</button>
            <button on:click={fileData.promptLoad}>Aç...</button>
        </div>
    </div>
    <span class="separator"></span>
    <a href="/analiz">Analizci</a>
    <a href="/secenekler">Seçenekler</a>
    <a href="/ayarlar">Ayarlar</a>
    <a href="/hakkinda">Hakkında</a>
    <span class="spacer"></span>
    <img src="/favicon.png" alt="Taktisyen">
</nav>
