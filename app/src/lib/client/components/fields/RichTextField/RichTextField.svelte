<script lang="ts">
	import { FieldBase } from "$client/components"
	import { ValidStates } from "$shared/constants"
	import type { Component, ComponentProps, SvelteComponent } from 'svelte'
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
	import * as Icon from "lucide-svelte"

	////
	// PROPS
	////

	interface Props extends Omit<ComponentProps<typeof FieldBase>, "children"> {
		enableLinks?: boolean
	}

	let {
		enableLinks = false,
		ref = $bindable(undefined),
		...restProps
	}: Props = $props()

	////
	// CONSTANTS
	////

	const formCtx = restProps.form.getContext()

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
	
	let prepared: ComponentProps<typeof FieldBase>["prepared"] = $state()
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

	function focus() {
		if (editor) {
			editor.commands.focus()
		}
	}

	function onUpdate() {
		canUndo = editor.can().undo()
		canRedo = editor.can().redo()
		const html = editor.getHTML()
		let clean = DOMPurify.sanitize(html)
		// make sure clean isn't just an empty p tag
		if (clean === '<p></p>') clean = ''
		formCtx.data[restProps.field] = clean
	}

	function updateSelectionButtons() {
		isBold = editor.isActive('bold')
		isItalic = editor.isActive('italic')
		isUnderline = editor.isActive('underline')
		isStrike = editor.isActive('strike')
		isSuperscript = editor.isActive('superscript')
		isLink = enableLinks ? editor.isActive('link') : false
		isCode = editor.isActive('code')
		isBulletList = editor.isActive('bulletList')
		isOrderedList = editor.isActive('orderedList')
		isTaskList = editor.isActive('taskList')
		isHeader = editor.isActive('heading', { level: 2 })
	}
	
	function isValidURL(url: string): boolean {
		try {
			new URL(url)
			return true
		} catch (_) {
			return false
		}
	}
  
	function toggleBold() {
	  editor.chain().focus().toggleBold().run()
	  updateSelectionButtons()
	}
  
	function toggleItalic() {
	  editor.chain().focus().toggleItalic().run()
	  updateSelectionButtons()
	}
  
	function toggleUnderline() {
	  editor.chain().focus().toggleUnderline().run()
	  updateSelectionButtons()
	}
  
	function setLink() {
		if (enableLinks && isLink) {
			editor.chain().focus().unsetLink().run()
		} else {
			const url = prompt('Enter the URL, i.e. (https://example.com)')
			if (url && isValidURL(url)) {
				editor.chain().focus().setLink({ href: url }).run()
			}
		}
	  updateSelectionButtons()
	}

	function toggleSuperscript() {
		editor.chain().focus().toggleSuperscript().run()
		updateSelectionButtons()
	}

	function toggleStrike() {
		editor.chain().focus().toggleStrike().run()
		updateSelectionButtons()
	}

	function toggleCode() {
		editor.chain().focus().toggleCode().run()
		updateSelectionButtons()
	}

	function toggleBulletList() {
		editor.chain().focus().toggleBulletList().run()
		updateSelectionButtons()
	}

	function toggleOrderedList() {
		editor.chain().focus().toggleOrderedList().run()
		updateSelectionButtons()
	}

	function toggleTaskList() {
		editor.chain().focus().toggleTaskList().run()
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
		editor.chain().focus().toggleHeading({ level: 2 }).run()
		updateSelectionButtons()
	}

	function toggleBlockquote() {
		editor.chain().focus().toggleBlockquote().run()
		updateSelectionButtons()
	}

	function undo(e) {
		editor.chain().focus().undo().run()
		prepared.oninput(e)
	}

	function redo(e) {
		editor.chain().focus().redo().run()
		prepared.oninput(e)
	}

	////
	// CALCULATED
	////

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

	////
	// LIFECYCLE
	////

	onMount(() => {
		const extensions = [
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
						class: 'bg-surface-600 p-1 rounded-xs'
					},
				},
			}),
			Placeholder.configure({ placeholder: prepared.attrs.placeholder }),
			TextStyle,
			Underline,
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
		]
		if (enableLinks) {
			extensions.push(Link.configure({
				HTMLAttributes: {
					class: 'text-primary-500 underline',
					target: '_blank'
				}
			}))
		}
		editor = new Editor({
			element: element,
			extensions,
			content: formCtx.data[restProps.field],
		})
		editor.on("selectionUpdate", updateSelectionButtons)
		editor.on("update", onUpdate)
		editor.on("blur", (e) => prepared.onblur(e.event))
	})

	onDestroy(() => {
		if (editor) {
			editor.destroy()
		}
	})

</script>

{#snippet styleButton(
	content: string, 
	title: string, 
	onclick: (e?: Event) => void, 
	active: boolean, 
	disabled: boolean = false, 
	Icon: ConstructorOfATypedSvelteComponent | Component<any, any, any>
)}
	<button 
		class="btn btn-sm rounded-xs" 
		class:preset-filled={!active}
		class:preset-filled-primary-500={active}
		type="button"
		{onclick} 
		{title}
		{disabled}
		tabindex="-1"
	>
		{#if Icon}
			<Icon class="text-xl"/>
		{:else}
			{@html content}
		{/if}
	</button>
{/snippet}

<div>
	<FieldBase bind:ref bind:prepared {...restProps} />
	<div 
		class="@container rounded-sm bg-surface-200-800 transition duration-300 ease-in-out p-2 mb-4 opacity-75 [&:has(:focus-visible)]:opacity-100 hover:opacity-100 border border-surface-500 brightness-105 relative w-full" 
		class:[&:has(:focus-visible)]:border-primary-500={formCtx.validStates[prepared.field] !== ValidStates.INVALID} 
		class:border-error-500={formCtx.validStates[prepared.field] === ValidStates.INVALID}
	>
		<div class="toolbar mb-4 grid grid-cols-8 @sm:grid-cols-10 @md:grid-cols-12 @lg:flex gap-1">
			{@render styleButton('Heading', 'Heading', toggleHeader, isHeader, false, Icon.Heading)}
			{@render styleButton('<b>B</b>', 'Bold', toggleBold, isBold, false, Icon.Bold)}
			{@render styleButton('<i>I</i>', 'Italic', toggleItalic, isItalic, false, Icon.Italic)}
			{@render styleButton('<u>U</u>', 'Underline', toggleUnderline, isUnderline, false, Icon.Underline)}
			{@render styleButton('<s>&nbspS&nbsp</s>', 'Strike', toggleStrike, isStrike, false, Icon.Strikethrough)}
			{@render styleButton('^', 'Superscript', toggleSuperscript, isSuperscript, false, Icon.Superscript)}
			{#if enableLinks}
				{@render styleButton('Link', 'Link', setLink, isLink, false, Icon.Link)}
			{/if}
			{@render styleButton("Blockquote", "Blockquote", toggleBlockquote, isBlockquote, false, Icon.Quote)}
			{@render styleButton('Code', 'Code', toggleCode, isCode, false, Icon.Code)}
			{@render styleButton('Bullet List', 'Bullet List', toggleBulletList, isBulletList, false, Icon.List)}
			{@render styleButton('Ordered List', 'Ordered List', toggleOrderedList, isOrderedList, false, Icon.ListOrdered)}
			{@render styleButton('Task List', 'Task List', toggleTaskList, isTaskList, false, Icon.ListCheck)}
			{@render styleButton('Unstyle', 'Unstyle', clearStyles, false, !canUnstyle, Icon.RemoveFormatting)}
			{@render styleButton('Undo', 'Undo', undo, false, !canUndo, Icon.Undo)}
			{@render styleButton('Redo', 'Redo', redo, false, !canRedo, Icon.Redo)}
		</div>
		<div id={prepared.id} bind:this={element} class="editor-container"></div>
	</div>
</div>

{formCtx.data[restProps.field]}

<style lang="postcss">
  @reference "tailwindcss"
	.editor-container {
	  overflow-y: auto /* Add a scrollbar if content exceeds the height */
	}

	/* Use global to prevent svelte from pruning "unused" css attributes */
	:global(.tiptap p.is-editor-empty:first-child::before) {
		opacity: 0.5
		content: attr(data-placeholder)
		float: left
		height: 0
		pointer-events: none
	}

	:global(.tiptap.ProseMirror.ProseMirror-focused) {
		outline: none !important;
	}
</style>
