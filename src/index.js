import React, { Component } from 'react';
import { render } from 'react-dom';
import { connect, Provider } from 'react-redux';
import {
  getCreateOrders,
  getInitialProductsFromServer,
  store
} from './store.js';
import ProductPage from './components/ProductPage.js';

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
    return <ProductPage />;
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
