import express, { Request, Response } from "express";
import { HandleProyecto } from "../handlers/proyecto";
import { prisma } from "../prisma/client";
import upload from "../middleware/upload";

const router = express.Router();

router.post("/:token", (req: Request, res: Response) => {
  HandleProyecto.crear(req)
    .then(async () => {
      await prisma.$disconnect();
      res.send("WIJIU");
    })
    .catch(async (e) => {
      await prisma.$disconnect();
      res.send(e);
    });
});

router.get("/:token", (req: Request, res: Response) => {
  HandleProyecto.obtener(req)
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
  HandleProyecto.eliminar(req)
    .then(async () => {
      await prisma.$disconnect();
      res.send("WIJIU");
    })
    .catch(async (e) => {
      await prisma.$disconnect();
      res.send(e);
    });
});

router.post("/:id/archivo/:token", upload.single("file"), (req, res) => {
  HandleProyecto.agregarArchivo(req)
    .then(async () => {
      await prisma.$disconnect();
      res.send("WIJIU");
    })
    .catch(async (e) => {
      await prisma.$disconnect();
      res.send(e);
    });
});



router.get("/:id/archivo/:token", (req: Request, res: Response) => {
  HandleProyecto.obtenerArchivo(req)
    .then(async (path) => {
      await prisma.$disconnect();
      if (path) {
        let cleanPath = path.Modelo[0].archivo_modelo.replace(/src\\/g, "");
        let dir =  __dirname
        const file = dir.replace(/\\routes/g, "") + "\\" + cleanPath;
        
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

router.get("/empleado/:correo/:token", (req, res) => {
  HandleProyecto.filtrarPorEmpleado(req)
    .then(async (modelos) => {
      await prisma.$disconnect();
      res.send(modelos);
    })
    .catch(async (e) => {
      await prisma.$disconnect();
      res.send(e);
    });
});

router.get("/empresa/:correo/:token", (req, res) => {
  HandleProyecto.filtrarPorEmpresa(req)
    .then(async (modelos) => {
      await prisma.$disconnect();
      res.send(modelos);
    })
    .catch(async (e) => {
      await prisma.$disconnect();
      res.send(e);
    });
});

router.get("/cliente/:correo/:token", (req, res) => {
  HandleProyecto.filtrarPorCliente(req)
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
