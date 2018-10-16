module.exports = function(db) {
  return User = db.define('user', {
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
};
