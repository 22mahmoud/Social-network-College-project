import React from 'react';
import { Form, Button, Header, Icon, Modal, Image, Message } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { ApolloConsumer } from 'react-apollo';
import Dropzone from 'react-dropzone';
import { Ctx } from '../context/modal';

const CREATE_POST_MUTATION = gql`
  mutation createPost($image: Upload, $caption: String!) {
    createPost(image: $image, caption: $caption) {
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

class CreatePostModal extends React.Component {
  state = {
    caption: '',
    image: null,
    isSubmitting: false,
    captionError: null,
  };

  render() {
    return (
      <Ctx.Consumer>
        {({ modal, toggleModalState }) => (
          <ApolloConsumer>
            {client => (
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
                    <Form.TextArea
                      error={!!this.state.captionError}
                      onChange={e => this.setState({ caption: e.target.value, captionError: '' })}
                      id="caption"
                      type="text"
                      autoHeight
                      placeholder="Try adding multiple lines"
                    />
                  </Form>
                  {this.state.captionError && <Message error content={this.state.captionError} />}
                  {this.state.image && (
                    <Image spaced src={this.state.image.preview} size="small" rounded />
                  )}
                </Modal.Content>
                <Modal.Actions>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <Dropzone
                      style={{}}
                      onDrop={([file]) => {
                        this.setState({ image: file });
                      }}
                    >
                      <Button color="violet" onClick={() => {}} inverted>
                        <Icon name="image" />
                      </Button>
                    </Dropzone>
                    <Button
                      disabled={this.state.isSubmitting}
                      color="green"
                      onClick={async () => {
                        this.setState({ isSubmitting: true });
                        const {
                          data: {
                            createPost: { errors, isOk },
                          },
                        } = await client.mutate({
                          mutation: CREATE_POST_MUTATION,
                          variables: {
                            caption: this.state.caption,
                            image: this.state.image,
                          },
                        });

                        if (isOk) {
                          this.setState({ isSubmitting: false });
                          toggleModalState();
                        }

                        if (errors) {
                          this.setState({ isSubmitting: false, captionError: errors[0].message });
                        }
                        this.setState({ isSubmitting: false });
                      }}
                      inverted
                    >
                      <Icon name="checkmark" /> Post
                    </Button>
                  </div>
                </Modal.Actions>
              </Modal>
            )}
          </ApolloConsumer>
        )}
      </Ctx.Consumer>
    );
  }
}

export default CreatePostModal;
