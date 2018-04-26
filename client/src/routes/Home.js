import React from 'react';
import { Menu, Input, Form } from 'semantic-ui-react';
import { ApolloConsumer } from 'react-apollo';
import { Switch } from 'react-router-dom';

import PrivateRoute from '../routes/PrivateRoute';
import CreatePostModal from '../components/CreatePostModal';
import Posts from '../components/Post';
import Search from '../components/Search';

const Home = ({ history, me }) => {
  const inputRef = React.createRef();
  return (
    <React.Fragment>
      <Menu>
        <Menu.Item>
          <Form
            onSubmit={() => {
              let {
                current: {
                  inputRef: { value },
                },
              } = inputRef;
              if (value.length > 0) {
                history.push(`/search/${value}`);
                value = '';
              }
            }}
          >
            <Input ref={inputRef} className="icon" icon="search" placeholder="Search friends..." />
          </Form>
        </Menu.Item>
        <Menu.Menu position="right">
          <ApolloConsumer>
            {client => (
              <Menu.Item
                name="logout"
                onClick={() => {
                  localStorage.removeItem('token');
                  client.resetStore();
                  history.push('/login');
                }}
              >
                logout
              </Menu.Item>
            )}
          </ApolloConsumer>

          <Menu.Item name onClick={() => {}}>
            {me.firstName}
          </Menu.Item>
          <CreatePostModal
            trigger={
              <Menu.Item onClick={() => {}} name="upcomingEvents">
                Create a post
              </Menu.Item>
            }
          />
        </Menu.Menu>
      </Menu>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Switch>
          <PrivateRoute
            exact
            path="/feed"
            component={props => <Posts {...props} userId={me.id} />}
          />
          <PrivateRoute
            exact
            path="/search/:email"
            component={props => <Search {...props} me={me} />}
          />
        </Switch>
      </div>
    </React.Fragment>
  );
};

export default Home;
