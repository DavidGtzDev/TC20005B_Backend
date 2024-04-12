import express, { Request, Response } from "express";
import { HandleCliente } from "../handlers/cliente";
import { prisma } from "../prisma/client";

const router = express.Router();

router.post("/", (req: Request, res: Response) => {
  HandleCliente.crear(req)
    .then(async () => {
      await prisma.$disconnect();
      res.send("WIJIU");
    })
    .catch(async (e) => {
      await prisma.$disconnect();
      res.send(e);
    });
});

router.get("/", (req: Request, res: Response) => {
  HandleCliente.obtener()
    .then(async (lista) => {
      await prisma.$disconnect();
      res.send(lista);
    })
    .catch(async (e) => {
      await prisma.$disconnect();
      res.send(e);
    });
});

router.delete("/:correo/:token", (req: Request, res: Response) => {
  HandleCliente.eliminar(req)
    .then(async () => {
      await prisma.$disconnect();
      res.send("WIJIU");
    })
    .catch(async (e) => {
      await prisma.$disconnect();
      res.send(e);
    });
});

export default router;
