import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { QueryHandler } from "./querys";
import multer from "multer";

const prisma = new PrismaClient();
const app = express();
const port = process.env.PORT || 3000;
const upload = multer({ dest: "src/uploads/" });

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
  //console.log(req.file?.path)
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

//app.use('/static', express.static('public'))

app.get("/modelos/:id/archivo", (req, res) => {
  QueryHandler.obtenerArchivoModelo(req, prisma)
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

app.post("/editores", (req, res) => {
  QueryHandler.agregarEditores(req, prisma)
    .then(async () => {
      await prisma.$disconnect();
      res.send("WIJIU");
    })
    .catch(async (e) => {
      await prisma.$disconnect();
      res.send(e);
    });
});

app.get("/editores/:id", (req, res) => {
  QueryHandler.obtenerEditoresDeUnArchivo(req, prisma)
    .then(async (editores) => {
      await prisma.$disconnect();
      res.send(editores);
    })
    .catch(async (e) => {
      await prisma.$disconnect();
      res.send(e);
    });
});   

app.post("/guardar", upload.single("file"), (req, res) => {   
  QueryHandler.guardarNuevaVersionDelModelo(req, prisma)
    .then(async() => {
      await prisma.$disconnect();
      res.send("WIJIU")
    })
    .catch(async (e) => {
      await prisma.$disconnect();
      res.send(e);
    });
})

app.get("/peticion", (req, res) => {

})

app.post("/peticion", (req, res) => {

})

app.put("/peticion", (req, res) => {

})

app.get("/empleado/:correo/modelos", (req, res) => {

})

app.get("/empresa/:correo/modelos", (req, res) => {
  
})

app.get("/cliente/:correo/modelos", (req, res) => {
  
})


app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
