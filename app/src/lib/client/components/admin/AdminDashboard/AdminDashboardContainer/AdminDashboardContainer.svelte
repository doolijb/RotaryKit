<script lang="ts">
    import { onMount } from "svelte"
    import { createSwapy, type Swapy } from "swapy"

    let swapy: Swapy
    let enabled = true

    onMount(() => {
        const container = document.querySelector(".container")
        if (container) {
            // Initialize
            swapy = createSwapy(container, {})

            // Add listeners
            swapy.onSwap(event => {
                console.log(event.data.object);
                console.log(event.data.array);
                console.log(event.data.map);
            })

            // Enable
            swapy.enable(enabled)
        } else {
            console.error("Container element not found")
        }
    })

    function toggleSwapy() {
        swapy.enable(!enabled)
        enabled = !enabled
    }

</script>
<div>
<span>
    <button class="btn variant-filled-primary" on:click={toggleSwapy}>Toggle</button>
</span>
</div>
<div>
    <span>
        Status: {enabled ? "Enabled" : "Disabled"}
    </span>
</div>


<div class="container grid grid-cols-2 gap-4">
	<div class="section-1" data-swapy-slot="foo">
		<div class="card p-4" data-swapy-item="a">
            Hello World 1
        </div>
	</div>

	<div class="section-2" data-swapy-slot="bar">
		<div class="card p-4" data-swapy-item="b">
            Hello World 2
        </div>
	</div>

	<div class="section-3" data-swapy-slot="baz">
		<div class="card p-4" data-swapy-item="c">
            Hello World 3
        </div>
	</div>

    <!-- <div class="section-4" data-swapy-slot="qux">
    </div>

    <div class="section-5" data-swapy-slot="quux">
    </div>

    <div class="section-6" data-swapy-slot="corge">
    </div> -->
</div>
