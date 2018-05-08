import React from 'react';
import { Tab } from 'semantic-ui-react';
import UpdateBasicInfo from '../components/User/UpdateBasicInfo';
import UpdateProfilePicture from '../components/User/UpdateProfilePicture';
import UpdatePassword from '../components/User/UpdatePassword';

const pens = ({ me }) => [
  {
    menuItem: 'Basic Info',
    render: () => (
      <Tab.Pane>
        <UpdateBasicInfo me={me} />
      </Tab.Pane>
    ),
  },
  {
    menuItem: 'Profile Picture',
    render: () => (
      <Tab.Pane>
        <UpdateProfilePicture profilePicture={me.profilePicture} id={me.id} />
      </Tab.Pane>
    ),
  },
  {
    menuItem: 'Password',
    render: () => (
      <Tab.Pane>
        <UpdatePassword id={me.id} />
      </Tab.Pane>
    ),
  },
];

const Settings = ({ me }) => (
  <Tab menu={{ secondary: true, pointing: true }} panes={pens({ me })} />
);

export default Settings;
