import {
  ApolloClient, ApolloLink, HttpLink, InMemoryCache
} from 'apollo-boost';
import { getAccessToken } from '../auth';

const httpUrl = 'http://localhost:9000/graphql';

const httpLink = ApolloLink.from([
  new ApolloLink((operation, forward) => {
    const token = getAccessToken();
    if (token) {
      operation.setContext({headers: {'authorization': `Bearer ${token}`}});
    }
    return forward(operation);
  }),
  new HttpLink({uri: httpUrl})
]);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: httpLink,
  defaultOptions: {query: {fetchPolicy: 'no-cache'}}
});

export default client;
