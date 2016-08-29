const React = require('react');
const StoreConnector = require('./store-connector');
const {{pascalcase name}}Component = require('./{{name}}');
const {{pascalcase name}}Store = require('../stores');

// const debug = require('debug')('mongodb-compass:{{slugcase name}}:index');

class Connected{{pascalcase name}}Component extends React.Component {
  /**
   * Connect {{pascalcase name}}Component to store and render.
   *
   * @returns {React.Component} The rendered component.
   */
  render() {
    return (
      <StoreConnector store={{{pascalcase name}}Store}>
        <{{pascalcase name}}Component />
      </StoreConnector>
    );
  }
}

Connected{{pascalcase name}}Component.displayName = 'Connected{{pascalcase name}}Component';

module.exports = Connected{{pascalcase name}}Component;
