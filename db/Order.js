module.exports = function(db) {
  return (Order = db.define('order', {
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
  }));
};
