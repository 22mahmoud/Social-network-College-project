import React from 'react';
import { Form, Message } from 'semantic-ui-react';
import { Formik } from 'formik';
import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';

const UPDATE_PASSWORD_MUTATION = gql`
  mutation UpdateUserPassword($id: String!, $oldPassword: String, $newPassword: String) {
    updateUserPassword(id: $id, oldPassword: $oldPassword, newPassword: $newPassword) {
      isOk

      errors {
        path
        message
      }
    }
  }
`;

const UpdatePassword = ({ id, history }) =>
  console.log(history) || (
    <ApolloConsumer>
      {client => (
        <Formik
          initialValues={{ oldPassword: '', newPassword: '' }}
          onSubmit={async (values, { setSubmitting, setErrors, setStatus }) => {
            const { data } = await client.mutate({
              mutation: UPDATE_PASSWORD_MUTATION,
              variables: { oldPassword: values.oldPassword, newPassword: values.newPassword, id },
            });
            const { updateUserPassword } = data;
            if (updateUserPassword.errors) {
              const formatedErrors = updateUserPassword.errors.reduce((acc, cv) => {
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

            if (updateUserPassword.isOk) {
              localStorage.removeItem('token');
              client.resetStore();
            }
          }}
          render={({
 values, handleBlur, handleSubmit, isSubmitting, errors, handleChange,
}) => (
  <React.Fragment>
    {errors &&
                Object.keys(errors).length > 0 && (
                  <Message error header="Registration errors" list={[...Object.values(errors)]} />
                )}

    <Form onSubmit={handleSubmit}>
      <Form.Input
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.oldPassword}
        name="oldPassword"
        label="Old Password"
        type="password"
        placeholder="password..."
        icon="unlock alternate"
      />
      <Form.Input
        onChange={handleChange}
        onBlur={handleBlur}
        value={values.newPassword}
        name="newPassword"
        label="New Password"
        type="password"
        placeholder="password..."
        icon="unlock alternate"
      />
      <Form.Button loading={isSubmitting} type="submit" content="Save" color="blue" />
    </Form>
  </React.Fragment>
          )}
        />
      )}
    </ApolloConsumer>
  );

export default UpdatePassword;
