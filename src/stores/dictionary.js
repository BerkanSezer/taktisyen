import {writable} from "svelte/store";

export const dictionary = writable({
    words: [],
    filtered: [],
    status: "uninitiated",
    failed: false,
});
