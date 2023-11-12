import { Sequelize } from "sequelize";
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
    },
    password: {
      type: DataTypes.STRING,
    },
    age: {
      type: DataTypes.INTEGER,
      defaultValue: 21,
    },
    WithCodeRocks: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    freezeTableName: true,
  }
);

//User.drop() ->This returns a promise and we can use it to drop a table

User.sync({ alter: true })
  .then(() => {
    return User.findAll({
      //Check where length of the username is 6
      where: sequelize.fn("char_length", sequelize.col("username"), 6),
    });
  })
  .then((data) => {
    const item = data.map((i) => i.toJSON());
    console.log(item);
  })
  .catch((err) => {
    console.log(err);
    console.log("An unknown error occured");
  });
