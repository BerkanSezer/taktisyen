<script>
    import {createEventDispatcher} from "svelte";
    import {valueEnums} from "../../shared/js/dictionaryConstants.js";

    const dispatch = createEventDispatcher();

    export let enabled;
    export let filterId;
    export let type;
    export let criteria;
    export let policy;
    export let syllableCriteria;
    export let restriction;

</script>

<style lang="scss">
    div.filter {
        font-family: sans-serif;
        margin: 0.4em 0;
    }

    input[type=text] {
        font-family: monospace;
    }

    span.actions {
        padding: 0.3em;
        border-right: 1px solid black;
    }
</style>

<div class="filter">

    <span class="actions">
        <input id="enabled-checkbox" type="checkbox" bind:checked={enabled}>
        <label for="enabled-checkbox">Etkinleştir</label>

        <button
                on:click={() => {dispatch("remove");}}
        >Kaldır
        </button>
    </span>

    Sözün
    <select bind:value={type}>
        <option value={null} disabled>...</option>
        <option value="spelling">yazılışı</option>
        <option value="meaning">anlamlarından birisi</option>
        <option value="pattern">hece kalıbı</option>
        <option value="syllableCount">hece sayısı</option>
        <option value="originLanguage">köken dili</option>
        <option value="tone">anlamlarından birinin üslubu</option>
        <option value="pos">türü, işlevi veya kullanımı</option>
        <option value="field">alanı</option>
    </select>
    {#if type === null}
        ...
    {:else}
        <!-- There's a filter type selected. -->
        {#if ["originLanguage", "tone", "pos", "field"].includes(type)}
            <!-- An enum filter type is selected. -->
            <select bind:value={criteria}>
                <option value={null} disabled>...</option>
                {#each valueEnums[type] as criteria}
                    <option value={criteria[0]}>{criteria[1]}</option>
                {/each}
            </select>

            ise sözü

            <select bind:value={policy}>
                <option value="select">seç ve dahil et</option>
                <option value="deny">dahil etme</option>
            </select>
        {:else if type === "syllableCount"}
            <input type="number" min={0} max={43} bind:value={syllableCriteria[0]}>
            ile
            <input type="number" min={0} max={43} bind:value={syllableCriteria[1]}>
            arasındaysa sözü
            <select bind:value={policy} disabled>
                <option value="select">seç ve dahil et</option>
            </select>
        {:else if ["spelling", "meaning", "pattern"].includes(type)}
            <input type="text"
                   pattern={type === "pattern" ? "[-.\/]+" : "[\\d\\D]*"}
                   placeholder={type === "pattern" ? "örn: -. veya ././-/-" : ""}
                   bind:value={criteria}
            >
            <select bind:value={restriction}>
                <option value="is">ile aynen eşleşirse</option>
                <option value="includes">içerirse</option>
                <option value="startswith">ile başlarsa</option>
                <option value="endswith">ile biterse</option>
                <option value="regex">kurallı ifadesini doğrularsa</option>
            </select>
            sözü
            <select bind:value={policy} disabled>
                <option value="select">seç ve dahil et</option>
            </select>
        {/if}
    {/if}
</div>