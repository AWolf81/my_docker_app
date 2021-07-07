<script lang="ts">
	import Counter from '$lib/Counter.svelte';
	import { gql } from '@apollo/client/core/core.cjs';
	import { mutation, subscribe } from "svelte-apollo";

	let todo = {
		title: "",
		completed: false
	}

	const insertMutation = gql`
	mutation InsertTodo($title: String!, $completed: Boolean) {
		insert_todo(objects: {completed: $completed, title: $title}) {
			affected_rows
			returning {
			id
			}
		}
	}
	`
	const insertData = mutation(insertMutation);

	async function insertTodo() {
		insertData({
			variables: {
				title: todo.title,
				completed: todo.completed
			}
		})
	}

	const queryTodo = gql`
	subscription TodosQuery {
		todo {
			completed
			id
			title
		}
	}
	`

	// todos will be a store --> in html we need to access this with $todos (Svelte store)
	const todos = subscribe(queryTodo)
</script>

<main>
	<h1>Hello world!</h1>

	<Counter />

	<form on:submit|preventDefault={insertTodo}>
		<input placeholder="enter Todo title" bind:value={todo.title}/>
		<label for="completed">Completed: <input id="completed" type="checkbox" bind:checked={todo.completed}/></label>
		<button type="submit">Submit</button>
	</form>

	{#if $todos.loading}
	Loading todos...
	{:else if $todos.data}
		<ul>
			{#each $todos.data.todo as todo}
				<li>
					{todo.title} - {todo.completed ? "done" : "open"}
				</li>
			{/each}
		</ul>	
	{/if}

	<p>Visit <a href="https://svelte.dev">svelte.dev</a> to learn how to build Svelte apps.</p>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4rem;
		font-weight: 100;
		line-height: 1.1;
		margin: 4rem auto;
		max-width: 14rem;
	}

	p {
		max-width: 14rem;
		margin: 2rem auto;
		line-height: 1.35;
	}

	@media (min-width: 480px) {
		h1 {
			max-width: none;
		}

		p {
			max-width: none;
		}
	}
</style>
