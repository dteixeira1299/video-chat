import { DataSource } from "typeorm";
import { Call } from "./entity/call";

export const DatabaseConnection = new DataSource({
  type: "mariadb",
  host: "localhost",
  port: 5432,
  username: "test",
  password: "test",
  database: "test",
  synchronize: true,
  logging: true,
  entities: [Call],
  migrations: [],
});

export default DatabaseConnection;
