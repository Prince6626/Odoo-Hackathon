const mongoose = require("mongoose");

const connetDB = async () => {
  await mongoose.connect(
    "mongodb+srv://nayanprajapati2199:cHEnbtpTjseq2Fuy@mongodb.d9tny.mongodb.net/devTinder"
  );
};

module.exports = connetDB;
