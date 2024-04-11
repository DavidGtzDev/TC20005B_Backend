import express, { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { HandleLogin } from "../handlers/login";

const router = express.Router();

router.post("/", (req: Request, res: Response) => {
  HandleLogin.login(req)
    .then(async (empleado) => {
      await prisma.$disconnect();
      res.send(empleado);
    })
    .catch(async (e) => {
      await prisma.$disconnect();
      res.send(e);
    });
});

export default router;
