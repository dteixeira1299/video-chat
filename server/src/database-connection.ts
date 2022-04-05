import { DataSource } from "typeorm";
import { Call } from "./entity/call";

export const DatabaseConnection = new DataSource({
  type: "mariadb",
  host: "localhost",
  port: 3306,
  username: "chat",
  password: "123456",
  database: "chat",
  synchronize: true,
  entities: [Call],
  migrations: [],
});

export default DatabaseConnection;
