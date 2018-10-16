import React, { Component } from 'react';
import { render } from 'react-dom';
import { connect, Provider } from 'react-redux';
import {
  getCreateOrders,
  getInitialProductsFromServer,
  store
} from './store.js';
import ProductPage from './components/ProductPage.js';
import { Route, HashRouter } from 'react-router-dom';
import Orders from './components/Orders.js';
import Nav from './components/Nav.js';
import Login from './components/Login.js';

const mapDispatchToProps = dispatch => {
  return {
    getInitialProductsFromServer: () =>
      dispatch(getInitialProductsFromServer()),
    getCreateOrders: () => dispatch(getCreateOrders())
  };
};

class App extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    this.props.getInitialProductsFromServer();
    this.props.getCreateOrders();
  }

  render() {
    return (
      <HashRouter>
        <div>
          <Route path="/" component={Nav} />
          <Route exact path="/" component={ProductPage} />
          <Route exact path="/orders" component={Orders} />
          <Route exact path="/login" component={Login} />
        </div>
      </HashRouter>
    );
  }
}

const ConnectedApp = connect(
  null,
  mapDispatchToProps
)(App);

render(
  <Provider store={store}>
    <ConnectedApp />
  </Provider>,
  document.getElementById('root')
);
