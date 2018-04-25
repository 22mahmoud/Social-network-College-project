import React from 'react';
// React
import ReactDOM from 'react-dom';
// Apollo
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
// React-Router
import { BrowserRouter } from 'react-router-dom';

import App from './routes';

import registerServiceWorker from './registerServiceWorker';
// eslint-disable-next-line import/first
import 'semantic-ui-css/semantic.min.css';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
  request: (operation) => {
    const token = localStorage.getItem('token');
    operation.setContext({
      headers: {
        Authorization: token,
      },
    });
  },
});

const Application = () => (
  <ApolloProvider client={client}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ApolloProvider>
);

ReactDOM.render(<Application />, document.getElementById('root'));
registerServiceWorker();
