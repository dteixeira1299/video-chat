import { Request, Response, Router } from "express";
import DatabaseConnection from "../database-connection";
import { Call } from "../entity/call";
import { TypedRequestBody } from "../model/typed-request-body";
import Hashids from "hashids";

const router = Router();
const hashids = new Hashids();

router.get("/:hashedId", (request: Request, response: Response) => {
  const hashedId = request.params.hashedId;
  const ids = hashids.decode(hashedId);
  if (ids.length === 0) response.status(404).send();

  const id = ids[0] as number;
  DatabaseConnection.getRepository(Call)
    .findOneByOrFail({ id })
    .then(() => response.status(200).send())
    .catch(() => response.status(404).send());
});

router.post(
  "/",
  async (request: TypedRequestBody<Call>, response: Response) => {
    const call = request.body;
    const savedCall = await DatabaseConnection.getRepository(Call).save(call);
    response.status(200).json({ accessCode: hashids.encode(savedCall.id) });
  }
);

export default router;
