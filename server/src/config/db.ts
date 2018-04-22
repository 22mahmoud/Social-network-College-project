import { createConnection } from "typeorm";

createConnection()
  .then(() => {
    console.log("Database server is running 🏃‍ 🏃‍");
  })
  .catch(error => console.log(error));
