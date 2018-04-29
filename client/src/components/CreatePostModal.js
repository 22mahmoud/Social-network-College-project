import React from 'react';
import { Form, TextArea, Button, Header, Icon, Modal } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { ApolloConsumer } from 'react-apollo';
import { Formik } from 'formik';
import { withRouter } from 'react-router-dom';

import { Ctx } from '../context/modal';

const CREATE_POST_MUTATION = gql`
  mutation createPost($imageUrl: String, $caption: String!) {
    createPost(imageUrl: $imageUrl, caption: $caption) {
      isOk
      post {
        id
        imageUrl
        caption
        createdAt
      }
      errors {
        path
        message
      }
    }
  }
`;

const CreatePostModal = () => (
  <Ctx.Consumer>
    {({ modal, toggleModalState }) => (
      <ApolloConsumer>
        {client => (
          <Formik
            initialValues={{ caption: '' }}
            onSubmit={async ({ caption }, { setSubmitting, setErrors }) => {
              const {
                data: {
                  createPost: { errors, isOk },
                },
              } = await client.mutate({
                mutation: CREATE_POST_MUTATION,
                variables: { caption },
              });

              if (isOk) {
                setSubmitting(false);
                toggleModalState();
              }
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
              <Modal
                open={modal.open}
                onOpen={toggleModalState}
                onClose={toggleModalState}
                style={{
                  marginTop: '0px !important',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
              >
                <Header icon="pencil" content="Make post" />
                <Modal.Content>
                  <Form>
                    <TextArea
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.caption}
                      id="caption"
                      type="text"
                      autoHeight
                      placeholder="Try adding multiple lines"
                    />
                  </Form>
                </Modal.Content>
                <Modal.Actions>
                  <Button color="green" onClick={handleSubmit} disabled={isSubmitting} inverted>
                    <Icon name="checkmark" /> Post
                  </Button>
                </Modal.Actions>
              </Modal>
            )}
          />
        )}
      </ApolloConsumer>
    )}
  </Ctx.Consumer>
);

export default CreatePostModal;

// export default withRouter(compose(
//   graphql(CREATE_POST_MUTATION),

//   withFormik({
//     mapPropsToValues: () => ({ caption: '' }),
//     handleSubmit: async (
//       { caption },
//       { props: { mutate, history }, setSubmitting, setErrors },
//     ) => {
//       const res = await mutate({
//         variables: { caption },
//       });
//       const {
//         data: {
//           createPost: { isOk },
//         },
//       } = res;
//       if (isOk) {
//         setSubmitting(false);
//         history.push('/');
//       }
//     },
//   }),
// )(CreatePostModal));
