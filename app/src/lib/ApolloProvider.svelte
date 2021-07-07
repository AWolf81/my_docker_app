<script lang="ts">
    import client from '$lib/graphql-client';
	import { setClient } from "svelte-apollo";

	setClient(client);
</script>

<slot />