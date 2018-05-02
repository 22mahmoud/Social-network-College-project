import React from 'react';
// React
import ReactDOM from 'react-dom';
// Apollo
// import ApolloClient from 'apollo-boost';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { setContext } from 'apollo-link-context';
import { createUploadLink } from 'apollo-upload-client';
// React-Router
import { BrowserRouter } from 'react-router-dom';

import App from './routes';
import ModalPorovider from './context/modal';

import registerServiceWorker from './registerServiceWorker';
// eslint-disable-next-line import/first
import 'semantic-ui-css/semantic.min.css';

const link = createUploadLink({ uri: 'http://localhost:4000/graphql' });

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(link),
  cache: new InMemoryCache(),
});

// const client = new ApolloClient({
//   uri: 'http://localhost:4000/graphql',
//   request: (operation) => {
//     const token = localStorage.getItem('token');
//     operation.setContext({
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//   },
// });

const Application = () => (
  <ApolloProvider client={client}>
    <BrowserRouter>
      <ModalPorovider>
        <App />
      </ModalPorovider>
    </BrowserRouter>
  </ApolloProvider>
);

ReactDOM.render(<Application />, document.getElementById('root'));
registerServiceWorker();
