import express, { Request, Response } from "express";
import { HandleEmpresa } from "../handlers/empresa";
import { prisma } from "../prisma/client";

const router = express.Router();

router.post("/", (req: Request, res: Response) => {
  HandleEmpresa.crear(req)
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
  HandleEmpresa.obtener()
    .then(async (lista) => {
      await prisma.$disconnect();
      res.send(lista);
    })
    .catch(async (e) => {
      await prisma.$disconnect();
      res.send(e);
    });
});

router.delete("/:correo", (req: Request, res: Response) => {
  HandleEmpresa.eliminar(req)
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