import { HttpLink, ApolloClient, split } from '@apollo/client/core/core.cjs';
import { InMemoryCache } from '@apollo/client/cache/cache.cjs';
import { WebSocketLink } from '@apollo/client/link/ws/ws.cjs';

import { getMainDefinition } from 'apollo-utilities'
import websocket from 'ws';

import { browser } from '$app/env';

// Create an http link
// (needed for adding items)
const httpLink = new HttpLink({
    uri: 'http://localhost:8080/v1/graphql'
})

// Create a WebSocket Link
// (needed for realtime updates)

const webSocketConfig:WebSocketLink.Configuration = {
    uri: 'ws://localhost:8080/v1/graphql',
    options: {
        reconnect: true
    }
}

if (!browser) {
    webSocketConfig.webSocketImpl = websocket
}

const wsLink = new WebSocketLink(webSocketConfig)
// const wsLink = WebSocketLink

// Using the ability to split links, you can send data to each link
// depending on waht kind of operation is being sent

const link = split(
    // split based on operation type
    ({ query }) => {
        const definition = getMainDefinition(query);
        return (
            definition.kind === 'OperationDefinition' &&
            definition.operation === 'subscription'
        )
    },
    wsLink,
    httpLink
)

export default browser ? new ApolloClient({
    link,
    cache: new InMemoryCache(),
    ssrForceFetchDelay: 100,
})
: new ApolloClient({
    // Make sure queries run once
    ssrMode: true,
    // Use SchemaLink to run queries on local scheme (no round trips)
    // new SchemaLink(...) // how does it work?
    link,
    // Cache not uses, but required by Apollo
    cache: new InMemoryCache(),
    // Disbale all cache
    defaultOptions: {
        query: {
            fetchPolicy: 'no-cache'
        },
        mutate: {
            fetchPolicy: 'no-cache'
        },
        watchQuery: {
            fetchPolicy: 'no-cache'
        }
    }
})