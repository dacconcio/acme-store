module.exports = function(db) {
  return (LineItem = db.define('lineItem', {
    quantity: {
      type: db.Sequelize.INTEGER,
      defaultValue: 1
    }
  }));
};
