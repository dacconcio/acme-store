const { User, Product, Order, LineItem } = require('./db/models.js');
const Express = require('express');
const app = new Express();
const path = require('path');
const bodyParser = require('body-parser');
const jwt = require('jwt-simple');

app.use(bodyParser.json());
app.use('/dist', Express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.use((req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return next();
  }
  let id;
  try {
    id = jwt.decode(token, process.env.JWT_SECRET).id;
  } catch (ex) {
    return next({ status: 401 });
  }
  User.findById(id)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(next);
});

app.post('/api/auth', (req, res, next) => {
  const { name, password } = req.body;
  User.findOne({
    where: { name, password }
  })
    .then(user => {
      if (!user) {
        return next({ status: 401 });
      }
      const token = jwt.encode({ id: user.id }, process.env.JWT_SECRET);
      res.send({ token });
    })
    .catch(next);
});

app.get('/api/auth', (req, res, next) => {
  if (!req.user) {
    return next({ status: 401 });
  }
  res.send(req.user);
});

app.get('/api/products', (req, res, next) => {
  Product.findAll()
    .then(products => res.send(products))
    .catch(next);
});

app.get('/api/orders', async (req, res, next) => {
  const attr = {
    status: 'CART'
  };
  try {
    let cart = await Order.findOne({ where: attr });
    if (!cart) {
      cart = await Order.create(attr);
    }
    const orders = await Order.findAll({
      include: [LineItem],
      order: [['createdAt', 'DESC']]
    });
    res.send(orders);
  } catch (ex) {
    next(ex);
  }
});

//update line item
app.put('/api/orders/:orderId/lineItems/:id', (req, res, next) => {
  LineItem.findById(req.params.id)
    .then(lineItem => lineItem.update(req.body))
    .then(lineItem => res.send(lineItem))
    .catch(next);
});

//delete lineItem
app.delete('/api/orders/:orderId/lineItems/:id', (req, res, next) => {
  LineItem.destroy({
    where: {
      orderId: req.params.orderId,
      id: req.params.id
    }
  })
    .then(() => res.sendStatus(204))
    .catch(next);
});

//create lineItem
app.post('/api/orders/:orderId/lineItems/', (req, res, next) => {
  LineItem.create({
    orderId: req.params.orderId,
    quantity: req.body.quantity,
    productId: req.body.productId
  })
    .then(lineItem => res.send(lineItem))
    .catch(next);
});

//update order
app.put('/api/orders/:id', (req, res, next) => {
  Order.findById(req.params.id)
    .then(order => order.update(req.body))
    .then(order => res.send(order))
    .catch(next);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App listening in port ${PORT}`);
});
