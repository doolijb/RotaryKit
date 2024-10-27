<script lang="ts">
	import { FormBase, TextInput, FileDropField, SelectField } from "$client/components"
	import { ImageResolutions, ImageSizes, ImageStatus } from "$shared/constants"
	import { AdminCreateImage as Form } from "$shared/validation/forms"


	const form = Form.init()


	////
	// PROPS
	////

	interface Props {
		// Props

		// Bindables
		data?: Form["Data"]
		errors?: FormErrors
		disabled?: boolean
		canSubmit?: boolean

		// Events
		onsubmit?: (args: any) => Promise<void>
		oncancel?: (args: any) => Promise<void>
	}

	let {
		// Props

		// Bindables
		data = $bindable({
			title: "",
			image: [],
			maxSize: ImageSizes.LARGE,
			status: ImageStatus.PUBLISHED
		}),
		errors = $bindable({}),
		disabled = $bindable(false),
		canSubmit = $bindable(false),

		// Events
		onsubmit,
		oncancel,
	}: Props = $props()

	////
	// CALCULATED
	////

	$effect.pre(() => {
		// If image[0] and title is empty, set the title to the file name, minus the extension
		if (data.image?.length && !data.title) {
			data.title = data.image[0].name.replace(/\.[^/.]+$/, "")
		}
	});
</script>

<FormBase
	{form}
	bind:data
	bind:errors
	bind:canSubmit
	bind:disabled 
	{onsubmit}
	{oncancel}
	showSubmit={false}
	showCancel={false}
>
	<TextInput
		id="title"
		field="title"
		bind:data
		bind:errors
		{form}
		{disabled}
	/>

	<FileDropField
		id="image"
		field="image"
		bind:data
		{form}
		bind:errors
		{disabled}
	/>

	<div class="card mb-3 hidden lg:block mt-4">
		<section class="p-4">
			<p>
				<b>Max image sizes:</b>
			</p>
			<ul class="mt-1 list">
				<li>
					small -&nbsp; 
					<span>{ImageResolutions.SMALL.join("x")}px<span>
					<span class="opacity-75">(exact size with all smaller sizes included)</span>
				</li>
				<li>
					medium -&nbsp; 
					<span>{ImageResolutions.MEDIUM.join("x")}px<span>
					<span class="opacity-75">(constraint size with all smaller sizes included)</span>
				</li>
				<li>
					large -&nbsp;
					<span>{ImageResolutions.LARGE.join("x")}px</span> <span>Default</span>
					<span class="opacity-75">(constraint size with all smaller sizes included)</span>
				</li>
				<li>
					original -&nbsp; 
					<span>The un-optimized image will be saved</span>
					<span class="opacity-75">(along with all optimized sizes)</span>
				</li>
				<li>
					no optimization -&nbsp; 
					<span>Keep original image only</span>
					<span class="opacity-75">(no file optimizations or additional sizes)</span>
				</li>
			</ul>
		</section>
	</div>

	<SelectField
		id="maxSize"
		field="maxSize"
		bind:data
		{form}
		bind:errors
		{disabled}
	/>
	<SelectField
		id="status"
		field="status"
		bind:data
		{form}
		bind:errors
		{disabled}
	/>
</FormBase>
