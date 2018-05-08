import React from 'react';
import { Form, Image, Message } from 'semantic-ui-react';
import { ApolloConsumer } from 'react-apollo';
import { Formik } from 'formik';
import DropZone from 'react-dropzone';
import gql from 'graphql-tag';
import { MeQuery } from '../../routes/PrivateRoute';

const UPDATE_PROFILE_PICTURE = gql`
  mutation UpdateUserProfilePicture($id: String!, $profilePicture: Upload) {
    updateUserProfilePicture(id: $id, profilePicture: $profilePicture) {
      isOk
      user {
        profilePicture
      }
      errors {
        path
        message
      }
    }
  }
`;

let dropzoneRef;
const UpdateProfilePicture = ({ profilePicture, id }) => (
  <ApolloConsumer>
    {client => (
      <Formik
        initialValues={{ profilePicture: '' }}
        onSubmit={async (values, { setSubmitting, setErrors, setStatus }) => {
          await client.mutate({
            mutation: UPDATE_PROFILE_PICTURE,
            variables: { profilePicture: values.profilePicture, id },
            update: (store, { data: { updateUserProfilePicture: uui } }) => {
              if (uui.errors) {
                const formatedErrors = uui.errors.reduce((acc, cv) => {
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

              if (uui.isOk) {
                setStatus('Successfully updated');
                const { me: ME } = store.readQuery({ query: MeQuery });
                store.writeQuery({
                  query: MeQuery,
                  data: {
                    me: {
                      ...ME,
                      ...uui.user,
                    },
                  },
                });
              }
            },
          });
          setSubmitting(false);
        }}
        render={({
 errors, handleSubmit, isSubmitting, setFieldValue, status,
}) => (
  <React.Fragment>
    {status && <Message positive content={status} />}
    {errors &&
              Object.keys(errors).length > 0 && (
                <Message error header="Registration errors" list={[...Object.values(errors)]} />
              )}
    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
      <Form onSubmit={handleSubmit}>
        <DropZone
          style={{}}
          ref={(node) => {
                    dropzoneRef = node;
                  }}
          onDrop={([file]) => {
                    setFieldValue('profilePicture', file);
                  }}
        />

        <Form.Button
          icon="cloud upload"
          label="Profile Picture"
          content="upload Image"
          onClick={(e) => {
                    e.preventDefault();
                    dropzoneRef.open();
                  }}
        />
        <Form.Button disabled={isSubmitting} type="submit" content="Save" color="blue" />
      </Form>
      <Image
        avatar
        src={`http://127.0.0.1:4000/${profilePicture.replace('public/', '')}`}
      />
    </div>
  </React.Fragment>
        )}
      />
    )}
  </ApolloConsumer>
);

export default UpdateProfilePicture;
