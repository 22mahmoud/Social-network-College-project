import React from 'react';
import gql from 'graphql-tag';
import { Card, Image, Feed } from 'semantic-ui-react';
import { Query } from 'react-apollo';

import { GET_USER_QUERY } from './Search';
import UserFriendButtonState from '../components/User/UserFriendButtonState';
import Post from '../components/Post/Post';

const GET_PROFILE_QUERY = gql`
  query($id: String!) {
    getProfile(id: $id) {
      id
      firstName
      lastName
      email
      birthDate
      gender
      nickName
      profilePicture
      hometown
      aboutMe
      relationship
    }
  }
`;

const GET_USER_POSTS = gql`
  query($userId: String!) {
    getUserPosts(userId: $userId) {
      isOk
      post {
        id
        imageUrl
        caption
        createdAt
        likesCount
        user {
          id
          nickName
          profilePicture
        }
      }
      errors {
        path
        message
      }
    }
  }
`;

const Profile = ({ history, match: { params: id }, me }) => (
  <Query query={GET_PROFILE_QUERY} variables={id}>
    {({ loading, error, data }) => {
      if (loading) return 'Loading...';
      if (error) return 'ERROR';
      const { getProfile } = data;
      return (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <Card>
            <Query query={GET_USER_QUERY} variables={{ email: getProfile.email }}>
              {({ loading: l, error: e, data: d }) => {
                if (l) return 'Loading';
                if (e) return 'Error';

                return d.getUser.id !== me.id ? (
                  <Card.Content extra>
                    <UserFriendButtonState data={{ ...d.getUser, eQuery: getProfile.email }} />
                  </Card.Content>
                ) : null;
              }}
            </Query>
            <Image
              src={`http://localhost:4000/${getProfile.profilePicture.replace('public/', '')}`}
            />
            <Card.Content>
              <Card.Header>{`${getProfile.firstName} ${getProfile.lastName}`}</Card.Header>
              <Card.Description>
                <div>
                  <h4>
                    Gender: <span style={{ color: '#000' }}>{getProfile.gender} </span>
                  </h4>
                  <h4>
                    Bithdate: <span style={{ color: '#000' }}>{getProfile.birthDate} </span>
                  </h4>

                  {getProfile.nickName && (
                    <h4>
                      Nickname: <span style={{ color: '#000' }}>{getProfile.nickName} </span>
                    </h4>
                  )}
                  {getProfile.hometown && (
                    <h4>
                      Hometown: <span style={{ color: '#000' }}>{getProfile.hometown} </span>
                    </h4>
                  )}
                  {getProfile.relationship && (
                    <h4>
                      Relationship:{' '}
                      <span style={{ color: '#000' }}>{getProfile.relationship} </span>
                    </h4>
                  )}
                  {getProfile.aboutMe && (
                    <h4>
                      About: <span style={{ color: '#000' }}>{getProfile.aboutMe} </span>
                    </h4>
                  )}
                </div>
              </Card.Description>
            </Card.Content>
          </Card>
          <div style={{ marginLeft: '7rem', flex: '1' }}>
            <Query
              query={GET_USER_POSTS}
              fetchPolicy="cache-and-network"
              variables={{ userId: getProfile.id }}
            >
              {({ loading: l, error: e, data: d }) => {
                if (l) return 'Loading ...';
                if (e) return 'ERROR';

                if (
                  d.getUserPosts[0] &&
                  d.getUserPosts[0].errors &&
                  d.getUserPosts[0].errors[0].path === 'posts'
                ) {
                  return (
                    <Feed>
                      <Feed.Event
                        style={{
                          padding: '30px',
                          marginBottom: '10px',
                          backgroundColor: '#fff',
                          borderRadius: 5,
                        }}
                      >
                        <h1> only friends </h1>
                      </Feed.Event>
                    </Feed>
                  );
                }

                return (
                  <Feed>
                    {d.getUserPosts.map(({ post }) => (
                      <Post history={history} key={post.id} post={post} />
                    ))}
                  </Feed>
                );
              }}
            </Query>
          </div>
        </div>
      );
    }}
  </Query>
);

export default Profile;
