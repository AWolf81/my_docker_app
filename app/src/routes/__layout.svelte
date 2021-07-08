<script lang="ts">
	import { setContext } from 'svelte';
	import '../app.css';
	import {key, client} from '$lib/graphql-client';


	// working
	/*
	setContext(key, {
		getClient: () => client
	})*/

	// svelte-apollo approach --> working
	setContext(key, 
	 	client
	)


	// not working - why?
	// import { setClient } from "svelte-apollo/dist/svelte-apollo.es.js";
	// setClient(client);
</script>

<slot />
