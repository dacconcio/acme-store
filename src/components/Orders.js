import React from 'react';
import { connect } from 'react-redux';

const mapStateToProps = state => {
  const nonCartOrders = state.orders.filter(order => order.status !== 'CART');

  return {
    orders: nonCartOrders,
    products: state.products
  };
};

const Orders = props => {
  return (
    <div>
      <div align="center" className="bp3-callout bp3-intent-primary">
        <h4 className="bp3-heading">Orders</h4>
      </div>
      <br />
      <br />
      {props.orders.map(order => {
        return (
          <div key={order.id}>
            Order Number: {order.id}
            {order.lineItems.map(lineItem => {
              const lineItemsProduct = props.products.find(
                product => product.id === lineItem.productId
              );

              return (
                <div
                  key={lineItem.id}
                  align="center"
                  className="bp3-callout bp3-intent-primary"
                >
                  {'Product: ' +
                    lineItemsProduct.name +
                    '   Quantity: ' +
                    lineItem.quantity}
                </div>
              );
            })}
            <br />
          </div>
        );
      })}
    </div>
  );
};

export default connect(mapStateToProps)(Orders);
