<script lang="ts">
    import {Tab, TabGroup} from "@skeletonlabs/skeleton"
    

    interface Props {
        parent?: any;
        user?: SelectUser;
    }

    let { parent = null, user = null }: Props = $props();

    let tabSet = $state(0);
    

    const cBase = "card p-4 w-modal shadow-xl space-y-4"
    const cHeader = "text-2xl font-bold"
    const cForm =
        "border border-surface-500 p-4 space-y-4 rounded-container-token"

    // We've created a custom submit function to pass the response and close the modal.
    function onFormSubmit(): void {
        // if ($modalStore[0].response) $modalStore[0].response(formData);
        // modalStore.close();
    }
</script>

<div class="modal-example-form {cBase}">
    <header class={cHeader}>User: {user.username}</header>
    <TabGroup>
        <Tab bind:group={tabSet} name="tab1" value={0}>User</Tab>
        <Tab bind:group={tabSet} name="tab2" value={1}>Email Addresses</Tab>
        <Tab bind:group={tabSet} name="tab3" value={2}>Groups</Tab>
        <!-- Tab Panels --->
        {#snippet panel()}
            
                {#if tabSet === 0}
                    Hello World
                    <!-- <UserAdminReview user={user} mode={ReviewMode.VIEW} /> -->
                {:else if tabSet === 1}
                    (tab panel 2 contents)
                {:else if tabSet === 2}
                    (tab panel 3 contents)
                {/if}
            
            {/snippet}
    </TabGroup>
    <footer class="modal-footer {parent.regionFooter}">
        <button class="btn {parent.buttonNeutral}" onclick={parent.onClose}
            >{parent.buttonTextCancel}</button
        >
        <button class="btn {parent.buttonPositive}" onclick={onFormSubmit}
            >Submit Form</button
        >
    </footer>
</div>
