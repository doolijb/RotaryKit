<script lang="ts">
    import { page } from "$app/state"
    import { Main } from "$client/components"
    import Icon from "@iconify/svelte"

    const username: string = page.data.user.username
    const userSince: Date = page.data.user.createdAt

</script>

<Main>
	<div class="m-auto md:w-[35rem]">
		<div class="card p-4 mb-4 border-0">
			<h1 class="h2">
				{page.data.title}
			</h1>
		</div>
	</div>

    <div class="m-auto md:w-[35rem]">
		<div class="card p-4 mb-4 border-0">
			<p>
                <b>Username:</b> {username}
            </p>
            <p>
                <b>User Since:</b> {userSince.toLocaleDateString()}
            </p>
            <div class="grid grid-cols-2 gap-4 mt-2">

                <a href="/profile/image" class="card p-4 border-0 preset-filled ">
                    <div class="grid grid-cols-12">
                        <div class="col-span-4">
                            <Icon icon="mdi:email" class="w-16 h-16" />
                        </div>
                        <div class="col-span-8 text-sm">
                            <h3 class="h4">Profile Image</h3>
                            <p>Set the image associated with you</p>
                        </div>
                    </div>
                </a>
            </div>
		</div>
	</div>

    <div class="m-auto md:w-[35rem]">
		<div class="card p-4 mb-4 border-0">
            <h2 class="h3 mb-2">
                <Icon icon="mdi:cog" class="w-6 h-6 inline" /> Settings
            </h2>
			
            <!-- Create 2x2 colum of card links that is responsive -->
            <div class="grid grid-cols-2 gap-4">

                <a href="/profile/email" class="card p-4 border-0 preset-filled ">
                    <div class="grid grid-cols-12">
                        <div class="col-span-4">
                            <Icon icon="mdi:email" class="w-16 h-16" />
                        </div>
                        <div class="col-span-8 text-sm">
                            <h3 class="h4">Email</h3>
                            <p>Add or update your email addresses</p>
                        </div>
                    </div>
                </a>


                <a href="/profile/passphrase" class="card p-4 border-0 preset-filled ">
                    <div class="grid grid-cols-12">
                        <div class="col-span-4">
                            <Icon icon="mdi:form-textbox-password" class="w-16 h-16" />
                        </div>
                        <div class="col-span-8 text-sm">
                            <h3 class="h4">Passphrase</h3>
                            <p>Update your passphrase</p>
                        </div>
                    </div>
                </a>
		</div>
	</div>
</Main>