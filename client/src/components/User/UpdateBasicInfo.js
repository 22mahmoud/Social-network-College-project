import React from 'react';
import { Form, Message } from 'semantic-ui-react';
import { ApolloConsumer } from 'react-apollo';
import { Formik } from 'formik';
import gql from 'graphql-tag';

import { MeQuery } from '../../routes/PrivateRoute';

const UPDATE_BASIC_INFO_MUTATION = gql`
  mutation UpdateUserBasicInfo(
    $id: String!
    $firstName: String
    $lastName: String
    $birthDate: Date
    $gender: String
    $nickName: String
    $hometown: String
    $relationship: String
    $aboutMe: String
  ) {
    updateUserBasicInfo(
      id: $id
      firstName: $firstName
      lastName: $lastName
      birthDate: $birthDate
      gender: $gender
      nickName: $nickName
      hometown: $hometown
      relationship: $relationship
      aboutMe: $aboutMe
    ) {
      isOk
      user {
        id
        firstName
        lastName
        email
        birthDate
        gender
        nickName
        profilePicture
        hometown
        relationship
        aboutMe
      }
      errors {
        path
        message
      }
    }
  }
`;

const UpdateBasicInfo = ({ me }) => (
  <ApolloConsumer>
    {client => (
      <Formik
        initialValues={{
          firstName: me.firstName,
          lastName: me.lastName,
          birthDate: me.birthDate,
          gender: me.gender,
          nickName: me.nickName,
          hometown: me.hometown,
          relationship: me.relationship,
          aboutMe: me.aboutMe,
        }}
        onSubmit={(values, { setSubmitting, setErrors, setStatus }) => {
          setErrors({});
          setStatus();
          client.mutate({
            mutation: UPDATE_BASIC_INFO_MUTATION,
            variables: { ...values, id: me.id },
            update: (store, { data: { updateUserBasicInfo: uui } }) => {
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
        enableReinitialize
        render={({
          values,
          errors,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
          setFieldValue,
          status,
        }) => (
          <React.Fragment>
            {status && <Message positive content={status} />}
            {errors &&
              Object.keys(errors).length > 0 && (
                <Message error header="Registration errors" list={[...Object.values(errors)]} />
              )}
            <Form onSubmit={handleSubmit}>
              <Form.Group widths="equal">
                <Form.Input
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  name="firstName"
                  fluid
                  placeholder="Mahmoud"
                  label="First name"
                  type="text"
                />
                <Form.Input
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name="lastName"
                  fluid
                  placeholder="Ashraf"
                  label="last name"
                  type="text"
                />
              </Form.Group>

              <Form.Input
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.nickName}
                name="nickName"
                label="Nickname"
                placeholder="Mo"
                type="text"
              />
              <Form.Group widths="equal">
                <Form.Select
                  value={values.gender}
                  name="gender"
                  label="Gender"
                  onChange={(_, data) => setFieldValue('gender', data.value)}
                  placeholder="Select your Gender "
                  options={[
                    { key: 'male', value: 'male', text: 'male' },
                    { key: 'female', value: 'female', text: 'female' },
                  ]}
                />
                <Form.Input
                  value={values.birthDate}
                  name="birthdate"
                  label="birthDate"
                  type="date"
                  onChange={(_, data) => {
                    setFieldValue('birthDate', data.value);
                  }}
                />
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Input
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.hometown}
                  name="hometown"
                  label="Hometown"
                  placeholder="Alexandria"
                  type="text"
                />
                <Form.Input
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.relationship}
                  name="relationship"
                  label="Relationship"
                  placeholder="Single"
                  type="text"
                />
              </Form.Group>
              <Form.TextArea
                onChange={handleChange}
                value={values.aboutMe}
                name="aboutme"
                label="About Me"
                placeholder="null"
                type="text"
              />
              <Form.Button disabled={isSubmitting} type="submit" content="Save" color="blue" />
            </Form>
          </React.Fragment>
        )}
      />
    )}
  </ApolloConsumer>
);

export default UpdateBasicInfo;
