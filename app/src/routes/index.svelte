<script lang="ts">
  import { gql } from '@apollo/client/core/core.cjs.js';
  // import { getClient } from "svelte-apollo"; // use mutation & subscribe later - svelte-apollo not working
  import { client } from '$lib/graphql-client';
  import { identity } from 'svelte/internal';
  // import { getContext } from 'svelte'
  // const client = getContext(key);

  let newTodo = {
    title: '',
    completed: false
  };

  type Todo = typeof newTodo & {
    id;
  };

  const insertMutation = gql`
    mutation InsertTodo($title: String!, $completed: Boolean) {
      insert_todo(objects: { completed: $completed, title: $title }) {
        affected_rows
        returning {
          id
        }
      }
    }
  `;

  function insertTodo() {
    // const insertData = mutation(insertMutation); // works during dev
    client.mutate({
      mutation: insertMutation,
      variables: newTodo
    });
  }

  const queryTodo = gql`
    subscription TodosQuery {
      todo {
        completed
        id
        title
      }
    }
  `;

  // todos will be a store --> in html we need to access this with $todos (Svelte store)
  type TodoStoreType = {
    data: {
      todo: Todo[];
    };
  };

  const todos: SvelteStore<TodoStoreType> = client.subscribe({ query: queryTodo });

  const deleteMutation = gql`
    mutation DeleteTodo($id: uuid!) {
      delete_todo_by_pk(id: $id) {
        id
        title
      }
    }
  `;

  const deleteTodo = (id) => {
    client.mutate({
      mutation: deleteMutation,
      variables: { id }
    });
  };

  const setTodoCompletedMutation = gql`
    mutation SetTodoCompleted($id: uuid!, $completed: Boolean) {
      update_todo_by_pk(pk_columns: { id: $id }, _set: { completed: $completed }) {
        id
      }
    }
  `;

  const toggleTodoCompleted = (todo) => {
    const { id, completed } = todo;
    client.mutate({
      mutation: setTodoCompletedMutation,
      variables: {
        id,
        completed: !completed
      }
    });
  };
</script>

<main class="todo-container">
  <h1 class="heading">Todos</h1>

  <form on:submit|preventDefault={insertTodo}>
    <input
      placeholder="enter Todo title"
      bind:value={newTodo.title}
      type="text"
      class="border py-2 px-3 text-grey-darkest"
    />
    <label for="completed"
      >Completed: <input id="completed" type="checkbox" bind:checked={newTodo.completed} /></label
    >
    <button type="submit">Submit</button>
  </form>

  {#if !$todos}
    Loading todos...
  {:else if $todos.data}
    <ul>
      {#each $todos.data.todo as todo (todo.id)}
        <li on:click={() => toggleTodoCompleted(todo)}>
          {todo.title} - {todo.completed ? 'done' : 'open'}
          <button on:click={() => deleteTodo(todo.id)}>x</button>
        </li>
      {/each}
    </ul>
  {/if}
</main>

<style lang="postcss" scoped>
  .todo-container {
    @apply container mx-auto shadow p-4 mt-10;
  }

  .heading {
    @apply text-2xl font-bold pb-5;
  }
  /* main {
    text-align: center;
    padding: 1em;
    margin: 0 auto;
  } */

  /* h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4rem;
    font-weight: 100;
    line-height: 1.1;
    margin: 4rem auto;
    max-width: 14rem;
  } */

  /* @media (min-width: 480px) {
    h1 {
      max-width: none;
    }
  } */
</style>
