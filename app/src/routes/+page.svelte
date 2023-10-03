<script lang="ts">
    import axios from 'axios'
    
    let username = ''
    let email = ''
    let passphrase = ''
    let passphraseConfirm = ''

    async function submit () {
        const data = {
            username,
            email,
            passphrase,
            passphraseConf
        }
        const res = await axios.post(
            '/api/auth/register',
            data,
        )
    }

</script>

<h1>Register</h1>
<input type="text" bind:value={username} placeholder="Username"><br>
<input type="text" bind:value={email} placeholder="Email Address"><br>
<input type="passphrase" bind:value={passphrase} placeholder="Passphrase"><br>
<input type="passphrase" bind:value={passphraseConf} placeholder="Passphrase"><br>
<button on:click={submit}>Register</button> 