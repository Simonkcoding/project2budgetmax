module.exports = function(sequelize, DataTypes) {
  var Transaction = sequelize.define("Transaction", {
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    }, 
    category: {
      type: DataTypes.TEXT,
      defaultValue: "Misc",
      allowNull: false
    },
    date: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW,
      allowNull: false
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    memo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      unique: true
    },
    updatedAt: DataTypes.DATE
  });

  // Associating, refer to sequelize last example
  Transaction.associate = function(models) {
    // We're saying that a Post should belong to an Author
    // A Post can't be created without an Author due to the foreign key constraint
    Transaction.belongsTo(models.User, {
      foreignKey:
      {
        allowNull: false
      }
    });
  };

  return Transaction;
};
