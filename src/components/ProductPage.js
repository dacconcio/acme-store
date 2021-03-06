import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  getCreateOrders,
  destroyLineItem,
  updateLineItem,
  createLineItem,
  updateOrder
} from '../store.js';

import { Elevation, Card, Button, ButtonGroup } from '@blueprintjs/core';

const mapDispatchToProps = dispatch => {
  return {
    createLineItem: (lineItem, orderId) =>
      dispatch(createLineItem(lineItem, orderId)),
    updateLineItem: lineItem => dispatch(updateLineItem(lineItem)),
    destroyLineItem: lineItem => dispatch(destroyLineItem(lineItem)),
    getCreateOrders: () => dispatch(getCreateOrders()),
    updateOrder: order => dispatch(updateOrder(order))
  };
};

const mapStateToProps = state => {
  const currentOrder = state.orders.find(order => order.status === 'CART');

  return {
    products: state.products,
    lineItems: state.lineItems,
    currentOrder,
    auth: state.auth
  };
};

class ProductPage extends Component {
  constructor(props) {
    super(props);

    this.incrementProduct = this.incrementProduct.bind(this);
    this.decrementProduct = this.decrementProduct.bind(this);
    this.createOrder = this.createOrder.bind(this);
  }

  componentDidUpdate() {
    if (this.props.currentOrder) {
      console.log(this.props.currentOrder.id);
    }
  }

  createOrder() {
    const updatedOrder = this.props.currentOrder;
    updatedOrder.status = 'ORDER';
    updatedOrder.userId = this.props.auth.id;
    this.props.updateOrder(updatedOrder);
  }

  incrementProduct(productId) {
    const productsLineItem = this.props.lineItems.find(lineItem => {
      return (
        lineItem.productId === productId &&
        lineItem.orderId === this.props.currentOrder.id
      );
    });

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
    const productsLineItem = this.props.lineItems.find(lineItem => {
      return (
        lineItem.productId === productId &&
        lineItem.orderId === this.props.currentOrder.id
      );
    });

    if (!productsLineItem) {
      return;
    }

    if (productsLineItem.quantity === 1) {
      this.props.destroyLineItem(productsLineItem);
    } else {
      productsLineItem.quantity -= 1;
      this.props.updateLineItem(productsLineItem);
    }
  }

  render() {
    return (
      <div align="center">
        <div align="center" className="bp3-callout bp3-intent-primary">
          <h4 className="bp3-heading">Shopping Cart</h4>
          <br />
          {this.props.products.map(product => {
            return (
              <div key={product.id}>
                {this.props.currentOrder &&
                this.props.lineItems.find(lineItem => {
                  return (
                    lineItem.productId === product.id &&
                    lineItem.orderId === this.props.currentOrder.id
                  );
                })
                  ? this.props.lineItems.find(lineItem => {
                      return (
                        lineItem.productId === product.id &&
                        lineItem.orderId === this.props.currentOrder.id
                      );
                    }).quantity + '   '
                  : 0 + '   '}

                {product.name + '   '}

                <ButtonGroup>
                  <Button onClick={() => this.incrementProduct(product.id)}>
                    {' '}
                    + 1{' '}
                  </Button>

                  <Button onClick={() => this.decrementProduct(product.id)}>
                    {' '}
                    - 1{' '}
                  </Button>
                </ButtonGroup>
              </div>
            );
          })}

          <br />
          <Button
            disabled={this.props.auth.id ? false : true}
            onClick={this.createOrder}
          >
            {' '}
            CREATE ORDER{' '}
          </Button>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductPage);
