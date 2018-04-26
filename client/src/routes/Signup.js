import React from 'react';
import { Button, Form } from 'semantic-ui-react';
import { Formik } from 'formik';
import { Mutation } from 'react-apollo';
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
  <Mutation
    mutation={SIGNUP_MUTATION}
    ignoreResults={false}
    onCompleted={(data) => {
      if (data && data.signup.isOk) {
        localStorage.setItem('token', data.signup.token);
        history.push('/feed');
      }
    }}
  >
    {(signup, data) => (
      <Formik
        initialValues={{
          email: '',
          firstName: '',
          lastName: '',
          password: '',
        }}
        validate={() => {}}
        onSubmit={(values, { setSubmitting }) => {
          signup({
            variables: {
              firstName: values.firstName,
              lastName: values.lastName,
              email: values.email,
              password: values.password,
            },
          });

          setSubmitting(false);
          console.log('====================================');
          console.log(data);
          console.log('====================================');
          // setSubmitting(false);
          // setErrors(transformMyApiErrors(errors));
        }}
        render={({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <Form onSubmit={handleSubmit}>
            <Form.Input
              label="First name"
              type="text"
              name="firstName"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.firstName}
            />
            <Form.Input
              label="last name"
              type="text"
              name="lastName"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.lastName}
            />
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

export default Signup;
