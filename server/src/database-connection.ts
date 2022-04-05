import { DataSource } from "typeorm";
import { Call } from "./entity/call";

export const DatabaseConnection = new DataSource({
  type: "mariadb",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "root",
  database: "chat",
  synchronize: true,
  logging: true,
  entities: [Call],
  migrations: [],
});

export default DatabaseConnection;
