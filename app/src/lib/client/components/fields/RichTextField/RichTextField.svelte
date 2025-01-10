<script lang="ts">
	import { ValidationBadges, ValidationLegend } from "$client/components"
	import { ValidStates } from "$shared/constants"
	import { v4 } from "uuid"
	import type { PopupSettings } from "@skeletonlabs/skeleton"
	import type { FormSchema } from "$shared/validation/base"
	import type { Snippet } from 'svelte'
	import humanizeString from "humanize-string"
	import { onMount, onDestroy } from 'svelte'
	import { Editor, mergeAttributes } from '@tiptap/core'
	import StarterKit from '@tiptap/starter-kit'
	import { TextStyle } from '@tiptap/extension-text-style'
	import Underline from '@tiptap/extension-underline'
	import Link from '@tiptap/extension-link'
	import Superscript from '@tiptap/extension-superscript'
	import Typography from '@tiptap/extension-typography'
	import Placeholder from '@tiptap/extension-placeholder'
	import BaseHeading from '@tiptap/extension-heading'
	import Blockquote from '@tiptap/extension-blockquote'
	import BaseTaskItem from '@tiptap/extension-task-item'
	import TaskList from '@tiptap/extension-task-list'
	import CharacterCount from '@tiptap/extension-character-count'
	import DOMPurify from "isomorphic-dompurify"
	import Icon from "@iconify/svelte"

	////
	// PROPS
	////

	interface Props {
		// Props
		field: string;
		placeholder?: string;
		label?: string;
		autocomplete?: string;

		// Bindables
		form?: FormSchema;
		data?: Record<string, any>;
		errors?: Record<string, any>;
		disabled?: boolean;
		id?: string;
		isTouched?: boolean;

		// Events
		oninput?: (e: Event) => Promise<void> | void
		onfocus?: (e: Event) => Promise<void> | void
		onblur?: (e: Event) => Promise<void> | void

		// Snippets
		prefixSnippet?: Snippet
		suffixSnippet?: Snippet
	}

	let {
		// Props
		field,
		placeholder = "",
		label,

		// Bindables
		form = $bindable(),
		data = $bindable({} as FormDataOf<any>),
		errors = $bindable({}),
		disabled = $bindable(false),
		id = $bindable(v4()),
		isTouched = $bindable(false),

		// Events
		oninput,
		onfocus,
		onblur,

	}: Props = $props();

	////
	// CONSTANTS
	////

	const legendPopup: PopupSettings = ValidationLegend.popupSettings()

	const Heading = BaseHeading.configure({ levels: [1, 2, 3] }).extend({
		renderHTML({ node, HTMLAttributes }) {
			type Levels = 1 | 2 | 3
			const classes: Record<Levels, string> = {
				1: 'text-3xl',
				2: 'text-2xl',
				3: 'text-xl',
			}
			const hasLevel = this.options.levels.includes(node.attrs.level)
			const level: Levels = hasLevel ? node.attrs.level : this.options.levels[0]

			return [
			`h${level}`,
			mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
				class: `${classes[level]}`,
			}),
			0,
			]
		},
	})

	const TaskItem = BaseTaskItem.configure({
      HTMLAttributes: {
        class: "flex gap-2",
      },
    })

	////
	// STATE
	////

	let fieldErrors: FieldErrors = $state({})
	let element: HTMLDivElement = $state()
	let editor: Editor = $state()
	let isBold = $state(false)
	let isItalic = $state(false)
	let isUnderline = $state(false)
	let isStrike = $state(false)
	let isSuperscript = $state(false)
	let isLink = $state(false)
	let isCode = $state(false)
	let isBulletList = $state(false)
	let isOrderedList = $state(false)
	let isTaskList = $state(false)
	let isHeader = $state(false)
	let isBlockquote = $state(false)
	let canUndo = $state(false)
	let canRedo = $state(false)

	////
	// FUNCTIONS
	////

	async function validate() {
		let fieldErrors = await form.fields[field].validate({key:field, data})
		if (Object.keys(fieldErrors).length) {
			errors[field] = fieldErrors
		} else {
			delete errors[field]
		}
	}

	async function touch() {
		isTouched = true
		await validate()
	}

	async function handleOnBlur(e: Event) {
		await touch()
		await onblur?.(e)
	}

	async function handleOnInput(e: Event) {
		await touch()
		await oninput?.(e)
	}

	function focus() {
		if (editor) {
			editor.commands.focus()
		}
	}

	function onUpdate() {
		canUndo = editor.can().undo()
		canRedo = editor.can().redo()
		const html = editor.getHTML()
		const clean = DOMPurify.sanitize(html)
		data[field] = clean
		handleOnInput(null)
	}

	function updateSelectionButtons() {
		isBold = editor.isActive('bold')
		isItalic = editor.isActive('italic')
		isUnderline = editor.isActive('underline')
		isStrike = editor.isActive('strike')
		isSuperscript = editor.isActive('superscript')
		isLink = editor.isActive('link')
		isCode = editor.isActive('code')
		isBulletList = editor.isActive('bulletList')
		isOrderedList = editor.isActive('orderedList')
		isTaskList = editor.isActive('taskList')
		isHeader = editor.isActive('heading', { level: 2 })
	}
	
	function isValidURL(url: string): boolean {
		try {
			new URL(url);
			return true;
		} catch (_) {
			return false;
		}
	}
  
	function toggleBold() {
	  editor.chain().focus().toggleBold().run();
	  updateSelectionButtons()
	}
  
	function toggleItalic() {
	  editor.chain().focus().toggleItalic().run();
	  updateSelectionButtons()
	}
  
	function toggleUnderline() {
	  editor.chain().focus().toggleUnderline().run();
	  updateSelectionButtons()
	}
  
	function setLink() {
		if (isLink) {
			editor.chain().focus().unsetLink().run();
		} else {
			const url = prompt('Enter the URL, i.e. (https://example.com)')
			if (url && isValidURL(url)) {
				editor.chain().focus().setLink({ href: url }).run();
			}
		}
	  updateSelectionButtons()
	}

	function toggleSuperscript() {
		editor.chain().focus().toggleSuperscript().run();
		updateSelectionButtons()
	}

	function toggleStrike() {
		editor.chain().focus().toggleStrike().run();
		updateSelectionButtons()
	}

	function toggleCode() {
		editor.chain().focus().toggleCode().run();
		updateSelectionButtons()
	}

	function toggleBulletList() {
		editor.chain().focus().toggleBulletList().run();
		updateSelectionButtons()
	}

	function toggleOrderedList() {
		editor.chain().focus().toggleOrderedList().run();
		updateSelectionButtons()
	}

	function toggleTaskList() {
		editor.chain().focus().toggleTaskList().run();
		updateSelectionButtons()
	}

	function clearStyles() {
		editor.commands.unsetAllMarks()
		editor.commands.focus()
		editor.chain().focus().unsetLink().run()
		if (editor.isActive('heading', { level: 2 })) {
			editor.chain().focus().toggleHeading({ level: 2 }).run()
		}
		if (editor.isActive('taskList')) {
			editor.chain().focus().toggleTaskList().run()
		}
		updateSelectionButtons()
	}

	function toggleHeader() {
		editor.chain().focus().toggleHeading({ level: 2 }).run();
		updateSelectionButtons()
	}

	function toggleBlockquote() {
		editor.chain().focus().toggleBlockquote().run();
		updateSelectionButtons()
	}

	function undo() {
		editor.chain().focus().undo().run();
	}

	function redo() {
		editor.chain().focus().redo().run();
	}

	////
	// CALCULATED
	////

	let fieldValidator = $derived(form.fields[field])
	let validatorLength = $state(0);
	let attrs: FormFieldAttributes | undefined = $derived(form ? form.fieldAttributes[field] : {})

	let canUnstyle = $derived(
		isHeader || 
		isBold || 
		isItalic || 
		isUnderline || 
		isStrike || 
		isSuperscript || 
		isLink || 
		isCode || 
		isBulletList ||
		isOrderedList ||
		isTaskList
	)

	let validState = $derived(isTouched
		? fieldErrors && Object.keys(fieldErrors).length
			? ValidStates.INVALID
			: data[field]
			  ? ValidStates.VALID
			  : ValidStates.NONE
		: ValidStates.NONE)

	$effect(() => {
		if (!placeholder && attrs) {
			placeholder = attrs.placeholder
		} else if (!placeholder) {
			placeholder = "Write something..."
		}
	})

	$effect(() => {
		if (!label) {
			if (attrs && attrs.label) {
				label = attrs.label
			} else {
				label = humanizeString(field)
			}
		}
	})

	$effect(() => {
		fieldErrors = errors[field] || {}
	})
	
	$effect.pre(() => {
		validatorLength = Object.values(fieldValidator.validators).filter(
			validator => !validator.isHidden
		).length
	});

	////
	// LIFECYCLE
	////

	onMount(() => {
		editor = new Editor({
			element: element,
			extensions: [
				StarterKit.configure({
					bulletList: {
						HTMLAttributes: {
							class: 'list-disc pl-4 ml-2'
						},
					},
					orderedList: {
						HTMLAttributes: {
							class: 'list-decimal pl-4 ml-2'
						},
					},
					code: {
						HTMLAttributes: {
							class: 'bg-surface-600 p-1 rounded-sm'
						},
					},
				}),
				Placeholder.configure({ placeholder }),
				TextStyle,
				Underline,
				Link.configure({
					HTMLAttributes: {
						class: 'text-primary-500 underline',
						target: '_blank'
					}
				}),
				Superscript,
				Typography,
				Heading,
				Blockquote,
				TaskItem,
				TaskList.configure({
					HTMLAttributes: {
						class: 'ml-1'
					},
				}),
				CharacterCount,
			],
			content: data[field],
		});
		editor.on("selectionUpdate", updateSelectionButtons)
		editor.on("update", onUpdate)
		editor.on("blur", () => handleOnBlur(null))
		if (data[field]) { touch() }
	})

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	})

</script>

{#snippet styleButton(content: string, title:string, onclick: () => void, active: boolean, disabled: boolean = false, icon: string = "")}
	<button 
		class="btn btn-sm rounded-sm" 
		class:variant-filled={!active}
		class:variant-filled-primary={active}
		type="button"
		{onclick} 
		{title}
		{disabled}
		tabindex="-1"
	>
		{#if icon}
			<Icon icon={icon} class="text-xl"/>
		{:else}
			{@html content}
		{/if}
	</button>
{/snippet}

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div class="mb-2">
	<div class="flex items-center">
		<label class="label inline-flex pb-2" for={id} onclick={focus}>
			<span class="cursor-pointer select-none" class:text-gray-500={disabled}>
				{label}
			</span>
		</label>
		{#if !disabled}
			<ValidationBadges {fieldValidator} bind:fieldErrors />
		{/if}
	</div>

	<div 
		class="rounded bg-surface-700 transition duration-300 ease-in-out p-4 mb-4 opacity-75 [&:has(:focus-visible)]:opacity-100 hover:opacity-100 border border-surface-500 brightness-105" 
		class:[&:has(:focus-visible)]:border-primary-500={validState !== ValidStates.INVALID} 
		class:border-error-500={validState === ValidStates.INVALID}
	>
		<div class="toolbar mb-4 grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:flex gap-1">
		  {@render styleButton('Heading', 'Heading', toggleHeader, isHeader, false, "tabler:heading")}
		  {@render styleButton('<b>B</b>', 'Bold', toggleBold, isBold, false, "tabler:bold")}
		  {@render styleButton('<i>I</i>', 'Italic', toggleItalic, isItalic, false, "tabler:italic")}
		  {@render styleButton('<u>U</u>', 'Underline', toggleUnderline, isUnderline, false, "tabler:underline")}
		  {@render styleButton('<s>&nbsp;S&nbsp;</s>', 'Strike', toggleStrike, isStrike, false, "tabler:strikethrough")}
		  {@render styleButton('^', 'Superscript', toggleSuperscript, isSuperscript, false, "tabler:superscript")}
		  {@render styleButton('Link', 'Link', setLink, isLink, false, "tabler:link")}
		  {@render styleButton("Blockquote", "Blockquote", toggleBlockquote, isBlockquote, false, "tabler:quote")}
		  {@render styleButton('Code', 'Code', toggleCode, isCode, false, "tabler:code")}
		  {@render styleButton('Bullet List', 'Bullet List', toggleBulletList, isBulletList, false, "tabler:list")}
		  {@render styleButton('Ordered List', 'Ordered List', toggleOrderedList, isOrderedList, false, "tabler:list-numbers")}
		  {@render styleButton('Task List', 'Task List', toggleTaskList, isTaskList, false, "tabler:list-details")}
		  {@render styleButton('Unstyle', 'Unstyle', clearStyles, false, !canUnstyle, "tabler:paint-off")}
		  {@render styleButton('Undo', 'Undo', undo, false, !canUndo, "tabler:arrow-back-up")}
		  {@render styleButton('Redo', 'Redo', redo, false, !canRedo, "tabler:arrow-forward-up")}
		</div>
		  <div {id} bind:this={element} class="editor-container"></div>
	</div>
</div>

<style lang="postcss">
	.editor-container {
	  overflow-y: auto; /* Add a scrollbar if content exceeds the height */
	}

	/* Use global to prevent svelte from pruning "unused" css attributes */
	:global(.tiptap p.is-editor-empty:first-child::before) {
		opacity: 0.5;
		content: attr(data-placeholder);
		float: left;
		height: 0;
		pointer-events: none;
	}
</style>
