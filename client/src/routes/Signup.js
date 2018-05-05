import React from 'react';
import { Button, Form, Message, Header, Icon } from 'semantic-ui-react';
import { Formik } from 'formik';
import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';

const SIGNUP_MUTATION = gql`
  mutation Signup($firstName: String!, $lastName: String!, $email: String!, $password: String!) {
    signup(firstName: $firstName, lastName: $lastName, email: $email, password: $password) {
      isOk
      token
      errors {
        path
        message
      }
    }
  }
`;

const Signup = ({ history }) => (
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
            firstName: '',
            lastName: '',
            password: '',
          }}
          validate={() => {}}
          onSubmit={async (values, { setSubmitting, setErrors }) => {
            const {
              data: {
                signup: { isOk, errors, token },
              },
            } = await client.mutate({
              mutation: SIGNUP_MUTATION,
              variables: {
                firstName: values.firstName,
                lastName: values.lastName,
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
    <Header as="h3">   <Icon name="signup" />
      <Header.Content>
      Signup
      <Header.Subheader>

                    already have an account ?
                    <a href="" onClick={() => history.push('/login')}>
                      sign in here
                    </a>

      </Header.Subheader>
      </Header.Content> </Header>
    <Form onSubmit={handleSubmit} error={errors === undefined}>
      {errors && (
      <Message error header="Registration errors" list={[...Object.values(errors)]} />
                )}
      <Form.Group widths="equal">
        <Form.Input
          required
          error={errors && !!errors.firstName}
          fluid
          placeholder="Mahmoud"
          label="First name"
          type="text"
          name="firstName"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.firstName}
        />
        <Form.Input
          required
          error={errors && !!errors.lastName}
          fluid
          placeholder="Ashraf"
          label="last name"
          type="text"
          name="lastName"
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.lastName}
        />
      </Form.Group>
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
      <Form.Select
        placeholder="Select your Gender"
        options={[{ key: 'male', value: 'male', text: 'male' }, { key: 'female', value: 'female', text: 'female' }]}
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

export default Signup;
