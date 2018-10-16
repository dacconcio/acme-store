module.exports = function(db) {
  return (Product = db.define('product', {
    name: {
      type: db.Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    }
  }));
};
