<script lang="ts">
  import { gql } from '@apollo/client/core/core.cjs.js';
  import { client } from '$lib/graphql-client';
  import { format } from 'timeago.js';
  import { onMount } from 'svelte';

  let time = Date.now();
  let ticks = 0;
  let refreshTimeStamp = Date.now(); // refresh list time displayevery 30 second

  const REFRESH_INTERVAL = 1000; // every second

  $: {
    // every 30 seconds update todo items
    ticks++;
    if (ticks >= 30) {
      ticks = 0;
      refreshTimeStamp = time;
    }
  }

  const initialTodo = {
    title: '',
    completed: false
  };

  let newTodo = {
    ...initialTodo
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
    time = Date.now(); // update time as our interval could run slower
    refreshTimeStamp = time;

    client.mutate({
      mutation: insertMutation,
      variables: newTodo
    });

    newTodo = {
      ...initialTodo
    };
  }

  const queryTodo = gql`
    subscription TodosQuery {
      todo(order_by: { created_at: desc }) {
        completed
        id
        title
        created_at
      }
    }
  `;

  // todos will be a store --> in html we need to access this with $todos (Svelte store)
  type TodoStoreType = {
    data: {
      todo: Todo[] | [];
    };
  };

  let todos: SvelteStore<TodoStoreType> = client.subscribe({ query: queryTodo });

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

  const moment = (tick, todoTimestamp) => {
    return format(todoTimestamp, 'en_US', { relativeDate: tick });
  };

  onMount(() => {
    const interval = setInterval(() => {
      time = Date.now();
    }, REFRESH_INTERVAL);

    return () => {
      clearInterval(interval);
    };
  });
</script>

<main class="todo-container">
  <nav>
    <div>
      <h1 class="heading">Todos - {new Date(time).toLocaleString()}</h1>
      <form on:submit|preventDefault={insertTodo}>
        <label for="todo">Title </label>
        <input
          id="todo"
          placeholder="Enter todo title..."
          bind:value={newTodo.title}
          type="text"
          class="border border-gray-500 focus:outline-none focus:ring focus:border-blue-300"
        />
        <label for="completed"
          >Completed: <input
            id="completed"
            type="checkbox"
            bind:checked={newTodo.completed}
            class="rounded text-gray-500"
          /></label
        >
        <button
          type="submit"
          class="button"
          title={newTodo.title === '' && 'Title is required'}
          disabled={newTodo.title === ''}>Submit</button
        >
      </form>
    </div>
  </nav>

  <div>
    {#if !$todos}
      <div>Loading todos...</div>
    {:else if $todos.data}
      {#each $todos.data.todo as todo (todo.id)}
        <div on:click={() => toggleTodoCompleted(todo)} class="todo-item">
          <div class={`todo-item-title ${todo.completed ? 'done' : 'open'}`}>{todo.title}</div>
          <span class="todo-timestamp" title={new Date(todo['created_at']).toISOString()}>
            {moment(refreshTimeStamp, todo['created_at'])}
          </span>
          <button class="button" title={`delete ${todo.title}`} on:click={() => deleteTodo(todo.id)}
            >x</button
          >
        </div>
      {/each}
    {/if}
  </div>
</main>

<style lang="postcss" scoped>
  .todo-container {
    @apply container p-5 mx-auto max-w-screen-md shadow-inner;
  }

  nav {
    @apply sticky top-0 z-10 bg-white bg-opacity-90;
  }

  nav > div {
    position: relative;
  }

  .heading {
    @apply text-lg font-bold p-3 text-center;
    @apply md:text-2xl;
  }

  form {
    @apply container content-center p-3 shadow-lg space-x-3 text-lg;
  }

  .button {
    @apply p-3 shadow shadow-xl rounded-md disabled:opacity-50 disabled:cursor-not-allowed;
  }

  .button:hover {
    @apply ring-4 border-blue-300;
  }

  .todo-item {
    @apply items-center w-full p-3 pl-5 mb-2 mt-5 space-x-5 shadow-xl cursor-pointer bg-yellow-100 rounded;
    @apply md:flex;
  }

  .todo-item-title {
    @apply w-2/3 text-base;
    @apply md:text-xl;
  }

  .todo-item:hover {
    @apply relative transform z-10;
    @apply lg:scale-125;
  }

  .todo-timestamp {
    @apply text-xs;
    @apply md:text-sm;
    @apply lg:text-lg;
  }

  .todo-item:nth-child(2n + 1) {
    /* 1,3,5th element */
    @apply transform rotate-2;
  }

  .todo-item:nth-child(2n) {
    /* 2,4,6the elment */
    @apply transform rotate-1;
  }

  .done {
    @apply text-gray-500;
    text-decoration: line-through;
  }

  .open {
    text-decoration: none;
  }
</style>
