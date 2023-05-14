import { setContext } from '@apollo/client/link/context';
import { getToken } from '../../providers/user/userSessionManager';
import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

const SERVER_LOCATION = process.env.REACT_APP_GRAPH_QL_SERVER_LOCATION || 'http://192.168.8.190:3001';

const httpLink = createHttpLink({
    uri: `${SERVER_LOCATION}/graphql`
});

const authLink = setContext((_, { headers }) => {
    const token = getToken();
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ''
        }
    };
});

export const apolloClient = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});
