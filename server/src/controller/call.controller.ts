import { Response, Router } from "express";
import DatabaseConnection from "../database-connection";
import { Call } from "../entity/call";
import { TypedRequestBody } from "../model/typed-request-body";
import Hashids from "hashids";

const router = Router();
const hashids = new Hashids();

router.post(
  "/",
  async (request: TypedRequestBody<Call>, response: Response) => {
    const call = request.body;
    const savedCall = await DatabaseConnection.getRepository(Call).save(call);
    response.status(200).json({ accessCode: hashids.encode(savedCall.id) });
  }
);

export default router;
