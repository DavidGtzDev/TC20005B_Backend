import express, { Request, Response } from "express";
import { prisma } from "../prisma/client";
import { HandleModelo } from "../handlers/modelo";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  HandleModelo.obtener()
    .then(async (lista) => {
      await prisma.$disconnect();
      res.send(lista);
    })
    .catch(async (e) => {
      await prisma.$disconnect();
      res.send(e);
    });
});

router.get("/:id", (req: Request, res: Response) => {
  HandleModelo.obtenerPorProyecto(req)
    .then(async (lista) => {
      await prisma.$disconnect();
      res.send(lista);
    })
    .catch(async (e) => {
      await prisma.$disconnect();
      res.send(e);
    });
});

router.get("/empresa/:correo", (req: Request, res: Response) => {
  HandleModelo.obtenerModelosPorEmpresa(req)
    .then(async (lista) => {
      await prisma.$disconnect();
      res.send(lista);
    })
    .catch(async (e) => {
      await prisma.$disconnect();
      res.send(e);
    });
});

router.get("/empleado/:correo", (req: Request, res: Response) => {
  HandleModelo.obtenerModelosPorEmpleado(req)
    .then(async (lista) => {
      await prisma.$disconnect();
      res.send(lista);
    })
    .catch(async (e) => {
      await prisma.$disconnect();
      res.send(e);
    });
});

router.delete("/:id/:token", (req: Request, res: Response) => {
  HandleModelo.borrarModelo(req)
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
