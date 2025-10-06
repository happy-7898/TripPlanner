"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      this.hasOne(models.Otp, {
        foreignKey: "userId",
        as: "otp",
        onDelete: "CASCADE",
      });
    }
  }

  User.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          is: {
            args: [/^\+?[0-9]{10,15}$/],
            msg: "Phone number must be between 10 and 15 digits and can start with +",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            msg: "Must be a valid email address",
          },
        },
      },
      bio: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      followCount: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
      },
      followersCount: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
      },
      tripCount: {
        type: DataTypes.BIGINT,
        defaultValue: 0,
      },
      profilePicture: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isRegistered: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "User",
      tableName: "Users",
      timestamps: true,
    },
  );
  return User;
};
