import React from 'react';
import { Menu, Input, Form, Dropdown, Icon, Container } from 'semantic-ui-react';
import { ApolloConsumer } from 'react-apollo';

import CreatePostModal from './CreatePostModal';
import { Ctx } from '../context/modal';

const NavBar = ({ me, history }) => {
  const inputRef = React.createRef();

  return (
    <Menu style={{ borderRadius: 0 }} fixed="top">
      <Container>
        <Menu.Item name="home" onClick={() => history.push('/')}>
          <Icon name="home" />
          Home
        </Menu.Item>
        <Menu.Item>
          <Form
            onSubmit={() => {
              const {
                current: {
                  inputRef: { value },
                },
              } = inputRef;
              if (value.trim().length > 0) {
                history.push(`/search/${value.trim()}`);
                inputRef.current.inputRef.value = '';
              }
            }}
          >
            <Input ref={inputRef} className="icon" icon="search" placeholder="Search friends..." />
          </Form>
        </Menu.Item>

        <Menu.Menu position="right">
          <Dropdown item icon="setting" simple>
            <Dropdown.Menu>
              <Dropdown.Item>Friend Requests </Dropdown.Item>
              <Dropdown.Item>Settings</Dropdown.Item>
              <Dropdown.Divider />
              <ApolloConsumer>
                {client => (
                  <Dropdown.Item
                    name="logout"
                    onClick={() => {
                      localStorage.removeItem('token');
                      client.resetStore();
                      history.push('/login');
                    }}
                  >
                    logout
                  </Dropdown.Item>
                )}
              </ApolloConsumer>
            </Dropdown.Menu>
          </Dropdown>

          <Menu.Item name="firstname" onClick={() => {}}>
            {me.firstName}
          </Menu.Item>
          <Ctx.Consumer>
            {({ toggleModalState }) => (
              <Menu.Item onClick={() => toggleModalState()} name="upcomingEvents">
                <Icon name="add circle" />
              </Menu.Item>
            )}
          </Ctx.Consumer>
          <CreatePostModal history={history} />
        </Menu.Menu>
      </Container>
    </Menu>
  );
};

export default NavBar;
