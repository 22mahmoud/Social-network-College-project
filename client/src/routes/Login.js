import React from 'react';
import { Button, Form, Message, Header, Icon } from 'semantic-ui-react';
import { Formik } from 'formik';
import { ApolloConsumer } from 'react-apollo';
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
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      minHeight: '100vh',
      margin: '0 auto',
      alignItems: 'center',
      background: '#ebebeb',
    }}
  >
    <ApolloConsumer>
      {client => (
        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validate={() => {}}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            const {
              data: {
                login: { isOk, errors, token },
              },
            } = await client.mutate({
              mutation: LOGIN_MUTATION,
              variables: {
                email: values.email,
                password: values.password,
              },
            });
            if (errors) {
              const formatedErrors = errors.reduce((acc, cv) => {
                if (cv.path in acc) {
                  acc[cv.path].push(cv.message);
                } else {
                  acc[cv.path] = [cv.message];
                }

                return acc;
              }, {});
              setSubmitting(false);
              setErrors(formatedErrors);
            }

            if (isOk && token) {
              localStorage.setItem('token', token);
              setSubmitting(false);
              history.push('/');
            }
          }}
          render={({
 values, errors, handleChange, handleBlur, handleSubmit, isSubmitting,
}) => (
  <div
    style={{
                flex: '.5 0 auto',
                backgroundColor: '#fff',
                padding: '20px',
                borderRadius: '5',
              }}
  >
    <Header as="h3">
      <Icon name="user" />
      <Header.Content>
                  Login
                  <Header.Subheader>
                    need a new account ?
                    <a href="" onClick={() => history.push('/signup')}>
                      signup here
                    </a>
                  </Header.Subheader>
      </Header.Content>
    </Header>
    <Form onSubmit={handleSubmit} error={errors === undefined}>
      {errors && (
      <Message error header="Registration errors" list={[...Object.values(errors)]} />
                )}

      <Form.Input
        required
        error={errors && !!errors.email}
        label="email"
        placeholder="name@me.com"
        type="email"
        name="email"
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.email}
        icon="mail"
      />
      <Form.Input
        required
        error={errors && !!errors.password}
        label="Password"
        type="password"
        name="password"
        onChange={handleChange}
        placeholder="password..."
        onBlur={handleBlur}
        value={values.password}
        icon="unlock alternate"
      />
      <div
        style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
      >
        <Button type="submit" disabled={isSubmitting}>
                    Submit
                  </Button>
        <p>
                    already have an account ?
                    <a href="" onClick={() => history.push('/login')}>
                      sign in here
                    </a>
        </p>
      </div>
    </Form>
  </div>
          )}
        />
      )}
    </ApolloConsumer>
  </div>
);

export default Login;
