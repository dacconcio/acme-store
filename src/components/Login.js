import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout, login } from '../store.js';
import {
  ControlGroup,
  Button,
  ButtonGroup,
  Alignment
} from '@blueprintjs/core';

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    login: userNameAndPw => dispatch(login(userNameAndPw)),
    logout: () => dispatch(logout())
  };
};

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      password: '',
      error: false
    };

    this.onChange = this.onChange.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  login(event) {
    event.preventDefault();
    this.props
      .login(this.state)
      .then(this.setState({ error: false }))
      .catch(ex => this.setState({ error: true }));
  }

  logout(event) {
    event.preventDefault();
    this.props.logout();
  }

  render() {
    return (
      <div align="center" className="bp3-callout bp3-intent-primary">
        <h4 className="bp3-heading">Enter your Name and Password</h4>
        <br />
        <input onChange={this.onChange} name="name" className="bp3-input" />
        <br />
        <input
          onChange={this.onChange}
          type="password"
          name="password"
          className="bp3-input"
        />
        <br />
        <br />
        <ButtonGroup large="true">
          <Button onClick={this.login}>Login</Button>
        </ButtonGroup>
        <br />
        {this.state.error ? <div> LOGIN ERROR!!! </div> : null}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
