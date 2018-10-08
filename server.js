const Sequalize = require('sequelize');

const db = new Sequalize(process.env.DATABASE_URL);

const Product = db.define('product', {
  name: {
    type: db.Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true
    }
  }
});

const Order = db.define('order', {
  id: {
    type: db.Sequelize.UUID,
    defaultValue: db.Sequelize.UUIDV4,
    primaryKey: true
  },
  status: {
    type: db.Sequelize.ENUM('CART', 'ORDER'),
    allowNull: false,
    defaultValue: 'CART'
  }
});

const LineItem = db.define('lineItem', {
  quantity: {
    type: db.Sequelize.INTEGER,
    defaultValue: 1
  }
});

LineItem.belongsTo(Product);
LineItem.belongsTo(Order);
Order.hasMany(LineItem);

db.sync({ force: true }).then(() => {
  const foo = Product.create({
    name: 'foo'
  });

  const bar = Product.create({
    name: 'bar'
  });
});

const Express = require('express');
const app = new Express();
const path = require('path');
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use('/dist', Express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res, next) => {
  res.sendFile(path.join(__dirname, 'dist/index.html'));
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
