import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { QueryHandler } from "./querys";
import multer from "multer";

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3000;
const upload = multer({ storage: multer.memoryStorage() });

app.use(express.json());

app.post("/empleados", (req: Request, res: Response) => {
  QueryHandler.darDeAltaEmpleado(req, prisma)
    .then(async () => {
      await prisma.$disconnect();
      res.send("WIJIU");
    })
    .catch(async (e) => {
      await prisma.$disconnect();
      res.send(e);
    });
});

app.get("/empleados", (req: Request, res: Response) => {
  QueryHandler.verEmpleados(prisma)
    .then(async (lista) => {
      await prisma.$disconnect();
      res.send(lista);
    })
    .catch(async (e) => {
      await prisma.$disconnect();
      res.send(e);
    });
});

app.post("/empresas", (req: Request, res: Response) => {
  QueryHandler.darDeAltaEmpresa(req, prisma)
    .then(async () => {
      await prisma.$disconnect();
      res.send("WIJIU");
    })
    .catch(async (e) => {
      await prisma.$disconnect();
      res.send(e);
    });
});

app.get("/empresas", (req: Request, res: Response) => {
  QueryHandler.verEmpresas(prisma)
    .then(async (lista) => {
      await prisma.$disconnect();
      res.send(lista);
    })
    .catch(async (e) => {
      await prisma.$disconnect();
      res.send(e);
    });
});

app.post("/clientes", (req: Request, res: Response) => {
  QueryHandler.darDeAltaCliente(req, prisma)
    .then(async () => {
      await prisma.$disconnect();
      res.send("WIJIU");
    })
    .catch(async (e) => {
      await prisma.$disconnect();
      res.send(e);
    });
});

app.get("/clientes", (req: Request, res: Response) => {
  QueryHandler.verClientes(prisma)
    .then(async (lista) => {
      await prisma.$disconnect();
      res.send(lista);
    })
    .catch(async (e) => {
      await prisma.$disconnect();
      res.send(e);
    });
});

app.post("/modelos", (req: Request, res: Response) => {
  QueryHandler.crearModelo(req, prisma)
    .then(async () => {
      await prisma.$disconnect();
      res.send("WIJIU");
    })
    .catch(async (e) => {
      await prisma.$disconnect();
      res.send(e);
    });
});

app.get("/modelos", (req: Request, res: Response) => {
  QueryHandler.verModelos(prisma)
    .then(async (lista) => {
      await prisma.$disconnect();
      res.send(lista);
    })
    .catch(async (e) => {
      await prisma.$disconnect();
      res.send(e);
    });
});

app.post("/modelos/:id/archivo", upload.single("file"), (req, res) => {
  //res.send(req.params)
  QueryHandler.agregarArchivoAModelo(req, prisma)
    .then(async () => {
      await prisma.$disconnect();
      res.send("WIJIU");
    })
    .catch(async (e) => {
      await prisma.$disconnect();
      res.send(e);
    });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
