# Dev notes for Apollo/Client installation (WIP)

Install apollo-client with subscription in our Svelte app
`bash>npm install @apollo/client svelte-apollo apollo-utilities graphql graphql-tag -SE`

Note: subscriptions-transport-ws not activly maintained!! Using for now check alternative used by @apollo/link-ws

Thrown `Error: Unable to find native implementation, or alternative implementation for WebSocket!`

Missing ws library `npm i websocket -SE` add globally if not in browser --> ssr render or add it to the final link.

Adding `cross-fetch` with `npm i cross-fetch -SE`. Required because there was an issue from Docker "fetch has not been found globally" caused by Apollo/client HttpLink.

--
Removed Adminer as Hasura can also display/manage the database