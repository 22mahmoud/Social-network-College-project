import React from "react";
import ReactDOM from "react-dom";

import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

import App from "./App";

import registerServiceWorker from "./registerServiceWorker";

const client = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  request: async operation => {
    const token = await localStorage.getItem("token");
    operation.setContext({
      headers: {
        Authorization: token
      }
    });
  }
});

const Application = _ => (
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
);

ReactDOM.render(<Application />, document.getElementById("root"));
registerServiceWorker();
