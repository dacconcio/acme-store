import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Button, Alignment, Navbar, Card, Elevation } from '@blueprintjs/core';
import { logout } from '../store.js';

const mapStateToProps = state => {
  return {
    auth: state.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(logout())
  };
};

const Nav = props => {
  return (
    <div>
      <Navbar>
        <Navbar.Group align={Alignment.LEFT}>
          <Navbar.Heading>ACME STORE</Navbar.Heading>
          <Navbar.Divider />
          <Link to="/">
            <Button
              className="bp3-minimal"
              icon="shopping-cart"
              text="Shopping Cart"
            />
          </Link>

          <Link to="/orders">
            <Button className="bp3-minimal" icon="barcode" text="Orders" />
          </Link>

          <Link to="/login">
            <Button className="bp3-minimal" icon="log-in" text="Login" />
          </Link>

          <Button
            onClick={props.logout}
            className="bp3-minimal"
            icon="log-out"
            text="Logout"
            disabled={props.auth.id ? false : true}
          />
        </Navbar.Group>
      </Navbar>

      <br />
      {props.auth.id ? (
        <Card interactive={true} elevation={Elevation.TWO}>
          YOU ARE NOW LOGGED IN AS: {props.auth.name}
        </Card>
      ) : null}
      <br />
    </div>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Nav);
