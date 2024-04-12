import express, { Request, Response } from "express";
import { HandleEditor } from "../handlers/editor";
import { prisma } from "../prisma/client";

const router = express.Router();

router.post("/:token", (req: Request, res: Response) => {
  HandleEditor.crear(req)
    .then(async () => {
      await prisma.$disconnect();
      res.send("WIJIU");
    })
    .catch(async (e) => {
      await prisma.$disconnect();
      res.send(e);
    });
});

router.get("/:id/:token", (req: Request, res: Response) => {
  HandleEditor.obtener(req)
    .then(async (lista) => {
      await prisma.$disconnect();
      res.send(lista);
    })
    .catch(async (e) => {
      await prisma.$disconnect();
      res.send(e);
    });
});

router.delete("/:id/:editor/:token", (req: Request, res: Response) => {
  HandleEditor.eliminar(req)
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