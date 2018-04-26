import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import { Formik } from 'formik';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';

const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      isOk
      token
      errors {
        path
        message
      }
    }
  }
`;

const Login = ({ history }) => (
  <Mutation
    mutation={LOGIN_MUTATION}
    ignoreResults={false}
    onCompleted={({ login: { isOk, token } }) => {
      if (isOk) {
        localStorage.setItem('token', token);
        history.push('/feed');
      }
    }}
  >
    {login => (
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        validate={() => {}}
        onSubmit={(values, { setSubmitting }) => {
          login({
            variables: {
              email: values.email,
              password: values.password,
            },
          });

          setSubmitting(false);
          // setSubmitting(false);
          // setErrors(transformMyApiErrors(errors));
        }}
        render={({
          values,
          // errors,
          // touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Form.Input
              label="email"
              type="email"
              name="email"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
            />
            <Form.Input
              label="Password"
              type="password"
              name="password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
            />
            <Button type="submit" disabled={isSubmitting}>
              Submit
            </Button>
          </Form>
        )}
      />
    )}
  </Mutation>
);

export default Login;
