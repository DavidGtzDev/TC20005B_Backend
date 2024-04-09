import express, { Request, Response } from "express";
import { HandleEmpleado } from "../handlers/empleado";
import { prisma } from "../prisma/client";

const router = express.Router();

router.post("/", (req: Request, res: Response) => {
  HandleEmpleado.crear(req)
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
  HandleEmpleado.obtener()
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
  HandleEmpleado.eliminar(req)
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