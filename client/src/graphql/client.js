import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, split } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/client/link/ws'

import { getAccessToken } from '../auth'

const httpUrl = 'http://localhost:9000/graphql'
const wsUrl = 'ws://localhost:9000/graphql'

const httpLink = ApolloLink.from([
    new ApolloLink((operation, forward) => {
        const token = getAccessToken()
        if (token) {
            operation.setContext({
                headers: {
                    'authorization': `Bearer ${token}`
                }
            });
        }
        return forward(operation)
    }),
    new HttpLink({ uri: httpUrl })
]);

const wsLink = new WebSocketLink({
    uri: wsUrl,
    options: {
        lazy: true,
        reconnect: true,
        connectionParams: () => ({
            accessToken: getAccessToken()
        })
    }
})

const isSubscription = ({ query }) => {
    const definition = getMainDefinition(query)

    return definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
}

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: split(isSubscription, wsLink, httpLink),
    defaultOptions: { query: { fetchPolicy: 'no-cache' } }
})

export default client
