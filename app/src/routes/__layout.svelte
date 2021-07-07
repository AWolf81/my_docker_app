<script>
	import '../app.css';

	// @todo: Check if the Provider is really needed.
	import ApolloProvider from '$lib/ApolloProvider.svelte'
</script>

<ApolloProvider>
	<slot />
</ApolloProvider>
