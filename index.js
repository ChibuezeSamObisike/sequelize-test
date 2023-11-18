import { Sequelize, where } from "sequelize";
import bcrypt from "bcrypt";
import zlib from "zlib";
import { Buffer } from "buffer";

const sequelize = new Sequelize("sequelize-video", "root", "", {
  dialect: "mysql",
  //   define: {
  //     freezeTableName: true,
  //   },
});

//sequelize.sync({ alter: true }); -> This affect all instances of the application

const { DataTypes, Op } = Sequelize;

const User = sequelize.define(
  "user",
  {
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      get() {
        const rawVal = this.getDataValue("username") + "";
        return rawVal.toUpperCase();
      },
      validate: {
        len: [2, 10],
      },
    },
    password: {
      type: DataTypes.STRING,
      set(value) {
        const salt = bcrypt.genSaltSync(12);
        const hash = bcrypt.hashSync(value, salt);
        this.setDataValue("password", hash);
      },
    },
    age: {
      type: DataTypes.INTEGER,
      defaultValue: 21,
    },
    WithCodeRocks: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
      set(value) {
        const compressed = zlib.deflateSync(value).toString("base64");
        this.setDataValue("description", compressed);
      },
      get() {
        const value = this.getDataValue("description");
        const uncompressed = zlib.inflateSync(Buffer.from(value, "base64"));
        return uncompressed.toString();
      },
    },
    aboutUser: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.username;
      },
    },
  },
  {
    freezeTableName: true,
  }
);

//User.drop() ->This returns a promise and we can use it to drop a table

User.sync({ alter: true })
  .then(() => {
    return User.findOne({ where: { username: "Nyerishi" } });
  })
  .then((data) => {
    console.log("Answer", data.aboutUser);
    //This returns rows and counts when destructured from data
  })
  .catch((err) => {
    console.log(err);
    console.log("An unknown error occured");
  });
