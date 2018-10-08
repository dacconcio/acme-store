import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  getCreateOrders,
  destroyLineItem,
  updateLineItem,
  createLineItem
} from '../store.js';

const mapDispatchToProps = dispatch => {
  return {
    createLineItem: (lineItem, orderId) =>
      dispatch(createLineItem(lineItem, orderId)),
    updateLineItem: lineItem => dispatch(updateLineItem(lineItem)),
    destroyLineItem: lineItem => dispatch(destroyLineItem(lineItem)),
    getCreateOrders: () => dispatch(getCreateOrders())
  };
};

const mapStateToProps = state => {
  const currentOrder = state.orders.find(order => order.status === 'CART');

  return {
    products: state.products,
    lineItems: state.lineItems,
    currentOrder
  };
};

class ProductPage extends Component {
  constructor(props) {
    super(props);

    this.incrementProduct = this.incrementProduct.bind(this);
    this.decrementProduct = this.decrementProduct.bind(this);
    this.createOrder = this.createOrder.bind(this);
  }

  createOrder() {
    this.props.getCreateOrders();
  }

  incrementProduct(productId) {
    let productsLineItem = this.props.lineItems.find(
      lineItem => lineItem.productId === productId
    );

    if (!productsLineItem) {
      this.props.createLineItem({
        orderId: this.props.currentOrder.id,
        quantity: 1,
        productId
      });
    } else {
      productsLineItem.quantity += 1;
      this.props.updateLineItem(productsLineItem);
    }
  }

  decrementProduct(productId) {
    let productsLineItem = this.props.lineItems.find(
      lineItem => lineItem.productId === productId
    );

    if (productsLineItem.quantity <= 1) {
      this.props.destroyLineItem(productsLineItem);
    } else {
      productsLineItem.quantity -= 1;
      this.props.updateLineItem(productsLineItem);
    }
  }

  render() {
    return (
      <div>
        {this.props.products.map(product => {
          return (
            <div key={product.id}>
              {this.props.lineItems.find(
                lineItem => lineItem.productId === product.id
              )
                ? this.props.lineItems.find(
                    lineItem => lineItem.productId === product.id
                  ).quantity + '   '
                : 0 + '   '}

              {product.name}
              <button onClick={() => this.incrementProduct(product.id)}>
                {' '}
                + 1{' '}
              </button>
              <button onClick={() => this.decrementProduct(product.id)}>
                {' '}
                - 1{' '}
              </button>
            </div>
          );
        })}

        <br />
        <br />

        <button onClick={this.createOrder}> CREATE ORDER </button>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductPage);
