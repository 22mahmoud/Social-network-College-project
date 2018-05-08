import React from 'react';
import { Button, Form, Message, Header, Icon } from 'semantic-ui-react';
import { Formik } from 'formik';
import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';
import Dropzone from 'react-dropzone';

const SIGNUP_MUTATION = gql`
  mutation Signup(
    $firstName: String!
    $lastName: String!
    $password: String!
    $email: String!
    $birthDate: Date!
    $gender: String!
    $nickName: String
    $profilePicture: Upload
    $hometown: String
    $relationship: String
    $aboutMe: String
  ) {
    signup(
      firstName: $firstName
      lastName: $lastName
      password: $password
      email: $email
      birthDate: $birthDate
      gender: $gender
      nickName: $nickName
      profilePicture: $profilePicture
      hometown: $hometown
      relationship: $relationship
      aboutMe: $aboutMe
    ) {
      isOk
      token
      errors {
        path
        message
      }
    }
  }
`;

const Signup = ({ history }) => {
  let dropzoneRef;
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        minHeight: '100vh',
        margin: '0 auto',
        padding: '5em 0 5em 0',
        alignItems: 'center',
        background: '#ebebeb',
      }}
    >
      <ApolloConsumer>
        {client => (
          <Formik
            initialValues={{
              firstName: '',
              lastName: '',
              password: '',
              email: '',
              birthDate: '',
              gender: '',
              nickName: '',
              profilePicture: '',
              hometown: '',
              relationship: '',
              aboutMe: '',
            }}
            onSubmit={async (values, { setSubmitting, setErrors }) => {
              const {
                data: {
                  signup: { isOk, errors, token },
                },
              } = await client.mutate({
                mutation: SIGNUP_MUTATION,
                variables: {
                  ...values,
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
                  <Icon name="signup" />
                  <Header.Content>
                    Signup
                    <Header.Subheader>
                      already have an account ?
                      <a href="" onClick={() => history.push('/login')}>
                        sign in here
                      </a>
                    </Header.Subheader>
                  </Header.Content>
                </Header>
                {errors &&
                  Object.keys(errors).length > 0 && (
                    <Message error header="Registration errors" list={[...Object.values(errors)]} />
                  )}
                <Form onSubmit={handleSubmit}>
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
                    onChange={handleChange}
                    type="email"
                    name="email"
                    onBlur={handleBlur}
                    value={values.email}
                    icon="mail"
                  />
                  <Form.Input
                    error={errors && !!errors.nickName}
                    label="Nickname"
                    placeholder="Mo"
                    onChange={handleChange}
                    type="text"
                    name="nickName"
                    onBlur={handleBlur}
                    value={values.nickName}
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
                  <Form.Group widths="equal">
                    <Form.Select
                      required
                      label="Gender"
                      value={values.gender}
                      onChange={(_, data) => setFieldValue('gender', data.value)}
                      name="gender"
                      placeholder="Select your Gender "
                      options={[
                        { key: 'male', value: 'male', text: 'male' },
                        { key: 'female', value: 'female', text: 'female' },
                      ]}
                    />
                    <Form.Input
                      label="birthDate"
                      value={values.birthDate}
                      required
                      type="date"
                      onChange={(_, data) => {
                        setFieldValue('birthDate', data.value);
                      }}
                    />
                  </Form.Group>
                  <Dropzone
                    style={{}}
                    ref={(node) => {
                      dropzoneRef = node;
                    }}
                    onDrop={([file]) => {
                      setFieldValue('profilePicture', file);
                    }}
                  />
                  <Form.Group widths="equal">
                    <Form.Button
                      icon="cloud upload"
                      label="Profile Picture"
                      content="upload Image"
                      onClick={(e) => {
                        e.preventDefault();
                        dropzoneRef.open();
                      }}
                    />
                    <Form.Input
                      label="Hometown"
                      placeholder="Alexandria"
                      type="text"
                      name="hometown"
                      value={values.hometown}
                      onBlur={handleBlur}
                      onChange={handleChange}
                    />
                    <Form.Input
                      label="Relationship"
                      placeholder="Single"
                      type="text"
                      name="relationship"
                      value={values.relationship}
                      onBlur={handleBlur}
                      onChange={handleChange}
                    />
                  </Form.Group>
                  <Form.TextArea
                    label="About Me"
                    placeholder="null"
                    type="text"
                    name="aboutMe"
                    value={values.aboutMe}
                    onBlur={handleBlur}
                    onChange={handleChange}
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
};
export default Signup;
