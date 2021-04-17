import {writable} from "svelte/store";

export const page = writable("analyzer");

export const settings = writable({
    renderSyllsWithDecorations: false
});
