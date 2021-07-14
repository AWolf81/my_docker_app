<script lang="ts">
  import '../tailwind.css';
  import '../app.css';
  // import { setContext } from 'svelte';
  // import { client } from '$lib/graphql-client';

  // svelte-apollo approach --> working
  // setContext(key,
  //  	client
  // )

  // not working - why?
  // import { setClient } from "svelte-apollo";
  // setClient(client);
</script>

<slot />
