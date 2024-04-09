import express, { Request, Response } from "express";
import { HandlePeticion } from "../handlers/peticion";
import { prisma } from "../prisma/client";

const router = express.Router();

router.post("/", (req: Request, res: Response) => {
  HandlePeticion.crear(req)
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
  HandlePeticion.obtener(req)
    .then(async (lista) => {
      await prisma.$disconnect();
      res.send(lista);
    })
    .catch(async (e) => {
      await prisma.$disconnect();
      res.send(e);
    });
});

router.delete("/:id", (req: Request, res: Response) => {
  HandlePeticion.eliminar(req)
    .then(async () => {
      await prisma.$disconnect();
      res.send("WIJIU");
    })
    .catch(async (e) => {
      await prisma.$disconnect();
      res.send(e);
    });
});

router.put("/:id", (req: Request, res: Response) => {
  HandlePeticion.actualizar(req)
    .then(async () => {
      await prisma.$disconnect();
      res.send("WIJIU");
    })
    .catch(async (e) => {
      await prisma.$disconnect;
      res.send(e);
    });
});

export default router;
