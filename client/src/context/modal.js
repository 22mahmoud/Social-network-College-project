import React from 'react';

export const Ctx = React.createContext();

export default class ModalPorovider extends React.Component {
  state = {
    modal: {
      open: false,
    },
  };

  toggleModalState = () => this.setState({ modal: { open: !this.state.modal.open } });

  render() {
    return (
      <Ctx.Provider value={{ modal: this.state.modal, toggleModalState: this.toggleModalState }}>
        {this.props.children}
      </Ctx.Provider>
    );
  }
}
