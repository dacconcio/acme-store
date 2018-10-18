const Sequalize = require('sequelize');
const db = new Sequalize(process.env.DATABASE_URL);

const User = require('./User.js')(db);
const Product = require('./Product.js')(db);
const Order = require('./Order.js')(db);
const LineItem = require('./LineItem.js')(db);

LineItem.belongsTo(Product);
LineItem.belongsTo(Order);
Order.hasMany(LineItem);

Order.belongsTo(User);
User.hasMany(Order);

db.sync({ force: true }).then(() => {
  const foo = Product.create({
    name: 'foo'
  });

  const bar = Product.create({
    name: 'bar'
  });

  const dave = User.create({
    name: 'dave',
    password: 'DAVE'
  });

  const yinglu = User.create({
    name: 'yinglu',
    password: 'YINGLU'
  });
});

module.exports = {
  Product,
  Order,
  LineItem,
  User
};
