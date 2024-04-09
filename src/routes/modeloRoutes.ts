import express, { Request, Response } from "express";
import { HandleModelo } from "../handlers/modelo";
import { prisma } from "../prisma/client";
import upload from "../middleware/upload";

const router = express.Router();

router.post("/", (req: Request, res: Response) => {
  HandleModelo.crear(req)
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

router.delete("/:id", (req: Request, res: Response) => {
  HandleModelo.eliminar(req)
    .then(async () => {
      await prisma.$disconnect();
      res.send("WIJIU");
    })
    .catch(async (e) => {
      await prisma.$disconnect();
      res.send(e);
    });
});

router.post("/:id/archivo", upload.single("file"), (req, res) => {
  HandleModelo.agregarArchivo(req)
    .then(async () => {
      await prisma.$disconnect();
      res.send("WIJIU");
    })
    .catch(async (e) => {
      await prisma.$disconnect();
      res.send(e);
    });
});

router.get("/:id/archivo", (req: Request, res: Response) => {
  HandleModelo.obtenerArchivo(req)
    .then(async (path) => {
      await prisma.$disconnect();
      if (path) {
        let cleanPath = path.replace(/src\\/g, "");
        const file = `${__dirname}` + "/" + cleanPath;
        res.download(file);
      } else {
        res.send("No hay archivo papu :v");
      }
    })
    .catch(async (e) => {
      await prisma.$disconnect();
      res.send(e);
    });
});

router.post("/guardar/:id/:editor", upload.single("file"), (req, res) => {
  HandleModelo.guardarNuevaVersion(req)
    .then(async () => {
      await prisma.$disconnect();
      res.send("WIJIU");
    })
    .catch(async (e) => {
      await prisma.$disconnect();
      res.send(e);
    });
});

router.get("/empleado/:correo", (req, res) => {
  HandleModelo.filtrarPorEmpleado(req)
    .then(async (modelos) => {
      await prisma.$disconnect();
      res.send(modelos);
    })
    .catch(async (e) => {
      await prisma.$disconnect();
      res.send(e);
    });
});

router.get("/empresa/:correo", (req, res) => {
  HandleModelo.filtrarPorEmpresa(req)
    .then(async (modelos) => {
      await prisma.$disconnect();
      res.send(modelos);
    })
    .catch(async (e) => {
      await prisma.$disconnect();
      res.send(e);
    });
});

router.get("/cliente/:correo", (req, res) => {
  HandleModelo.filtrarPorCliente(req)
    .then(async (modelos) => {
      await prisma.$disconnect();
      res.send(modelos);
    })
    .catch(async (e) => {
      await prisma.$disconnect();
      res.send(e);
    });
});

export default router;
