<script>
    export let type;
    export let errored = false;
</script>

<style lang="scss">
    $hece-colors: (
            "t1": rgba(63, 127, 255, 0.25),
            "t2": rgba(255, 255, 0, 0.25),
            "t3": rgba(255, 0, 0, 0.25),
    );

    $hece-decorations: (
            "t1": 1px double underline,
            "t2": 3px solid underline,
            "t3": 3px dotted underline,
    );

    @each $type, $color in $hece-colors {
        span.#{$type} {
            background-color: $color;
            //text-decoration: map-get($hece-decorations, $type);
        }
    }

    span.errored {
        border: 1px dashed red;
    }
</style>

<span class="t{type}" class:errored={errored}>
    <slot/>
</span>
