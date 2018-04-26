import React from 'react';
import { Form, TextArea, Button, Header, Icon, Modal } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { graphql, compose } from 'react-apollo';
import { withFormik } from 'formik';
import { withRouter } from 'react-router-dom';

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

const CreatePostModal = ({
  trigger,
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  handleSubmit,
  isSubmitting,
}) => (
  <Modal
    trigger={trigger}
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
      <Button color="green" onClick={handleSubmit} inverted>
        <Icon name="checkmark" /> Post
      </Button>
    </Modal.Actions>
  </Modal>
);

export default withRouter(compose(
  graphql(CREATE_POST_MUTATION),

  withFormik({
    mapPropsToValues: () => ({ caption: '' }),
    handleSubmit: async (
      { caption },
      { props: { mutate, history }, setSubmitting, setErrors },
    ) => {
      const res = await mutate({
        variables: { caption },
      });
      const {
        data: {
          createPost: { isOk },
        },
      } = res;
      if (isOk) {
        setSubmitting(false);
        history.push('/');
      }
    },
  }),
)(CreatePostModal));
