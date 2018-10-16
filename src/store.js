import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import axios from 'axios';
import logger from 'redux-logger';

const ADD_INITIAL_PRODUCTS_TO_STORE = 'ADD_INITIAL_PRODUCTS_TO_STORE';
const GET_CREATE_ORDER = 'GET_CREATE_ORDER';

const CREATE_LINE_ITEM = 'CREATE_LINE_ITEM';
const UPDATE_LINE_ITEM = 'UPDATE_LINE_ITEM';
const DESTROY_LINE_ITEM = 'DESTROY_LINE_ITEM';

const UPDATE_ORDER = 'UPDATE_ORDER';

const SET_AUTH = 'SET_AUTH';

const setAuth = auth => {
  return {
    type: SET_AUTH,
    auth
  };
};

const exchangeTokenForAuth = history => {
  return dispatch => {
    const token = window.localStorage.getItem('token');
    if (!token) {
      return;
    }
    return axios
      .get('/api/auth', {
        headers: {
          authorization: token
        }
      })
      .then(response => response.data)
      .then(auth => {
        dispatch(setAuth(auth));
        if (history) {
          history.push('/users');
        }
      })
      .catch(ex => window.localStorage.removeItem('token'));
  };
};

export const logout = () => {
  window.localStorage.removeItem('token');
  return setAuth({});
};

export const login = (credentials, history) => {
  return dispatch => {
    return axios
      .post('/api/auth', credentials)
      .then(response => response.data)
      .then(data => {
        window.localStorage.setItem('token', data.token);
        dispatch(exchangeTokenForAuth(history));
      });
  };
};

const updateOrderOnState = order => {
  return {
    type: UPDATE_ORDER,
    order
  };
};

export const updateOrder = order => {
  return dispatch => {
    axios
      .put(`api/orders/${order.id}`, order)
      .then(response => dispatch(updateOrderOnState(response.data)))
      .then(() => dispatch(getCreateOrders()))
      .catch(err => console.log(err));
  };
};

const destroyLineItemOnState = lineItem => {
  return {
    type: DESTROY_LINE_ITEM,
    lineItem
  };
};

export const destroyLineItem = lineItem => {
  return dispatch => {
    axios
      .delete(`api/orders/${lineItem.orderId}/lineItems/${lineItem.id}`)
      .then(() => dispatch(destroyLineItemOnState(lineItem)))
      .catch(err => console.log(err));
  };
};

const updateLineItemOnState = lineItem => {
  return {
    type: UPDATE_LINE_ITEM,
    lineItem
  };
};

export const updateLineItem = lineItem => {
  return dispatch => {
    axios
      .put(`api/orders/${lineItem.orderId}/lineItems/${lineItem.id}`, lineItem)
      .then(response => dispatch(updateLineItemOnState(response.data)))
      .catch(err => console.log(err));
  };
};

const addOrdersToState = orders => {
  return {
    type: GET_CREATE_ORDER,
    orders
  };
};

export const getCreateOrders = () => {
  return dispatch => {
    axios
      .get('/api/orders')
      .then(response => dispatch(addOrdersToState(response.data)))
      .catch(err => console.log(err));
  };
};

const addLineItemToStore = lineItem => {
  return {
    type: CREATE_LINE_ITEM,
    lineItem
  };
};

export const createLineItem = lineItem => {
  return dispatch => {
    axios
      .post(`/api/orders/${lineItem.orderId}/lineItems/`, lineItem)
      .then(response => dispatch(addLineItemToStore(response.data)))
      .then(err => console.log(err));
  };
};

const addInitialProductsToStore = products => {
  return {
    type: ADD_INITIAL_PRODUCTS_TO_STORE,
    products
  };
};

export const getInitialProductsFromServer = () => {
  return dispatch => {
    axios
      .get('/api/products')
      .then(response => dispatch(addInitialProductsToStore(response.data)))
      .catch(err => console.log(err));
  };
};

const initialState = {
  products: [],
  lineItems: [],
  orders: [],
  auth: {}
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_AUTH:
      return Object.assign({}, state, { auth: action.auth });

    case UPDATE_ORDER:
      const updatedOrders = [...state.orders].filter(
        order => order.id !== action.order.id
      );

      updatedOrders.push(action.order);

      return Object.assign({}, state, { orders: updatedOrders });

    case DESTROY_LINE_ITEM:
      const updatedLineItemsDestroy = [...state.lineItems].filter(
        lineItem => lineItem.id !== action.lineItem.id
      );

      return Object.assign({}, state, { lineItems: updatedLineItemsDestroy });

    case UPDATE_LINE_ITEM:
      const updatedLineItemsUpdate = [...state.lineItems].filter(
        lineItem => lineItem.id !== action.lineItem.id
      );

      updatedLineItemsUpdate.push(action.lineItem);
      return Object.assign({}, state, { lineItems: updatedLineItemsUpdate });

    case CREATE_LINE_ITEM:
      const updatedLineItemsCreate = [...state.lineItems].filter(
        lineItem => lineItem.id !== action.lineItem.id
      );

      updatedLineItemsCreate.push(action.lineItem);
      return Object.assign({}, state, { lineItems: updatedLineItemsCreate });

      return Object.assign({}, state, {
        lineItems: [action.lineItem]
      });

    case ADD_INITIAL_PRODUCTS_TO_STORE:
      return Object.assign({}, state, {
        products: action.products
      });

    case GET_CREATE_ORDER:
      return Object.assign({}, state, {
        orders: action.orders
      });

    default:
      return state;
  }
};

export const store = createStore(reducer, applyMiddleware(thunk, logger));
