const Sequalize = require('sequelize');
const db = new Sequalize(process.env.DATABASE_URL);

const User = db.define('user', {
  name: {
    type: db.Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  password: {
    type: db.Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    }
  }
});

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
