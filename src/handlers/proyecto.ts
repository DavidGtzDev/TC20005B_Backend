  import { prisma } from "../prisma/client";
  import { Request } from "express";
  import jwt from "jsonwebtoken";

  interface Proyecto{ 
    nombre_proyecto: string;
    correo_creador: string;
    correo_cliente: string;
  }

  interface Modelo{
    archivo_modelo: string;
    id_proyecto: number;
  }

  interface Creador {
    correo_creador: string;
    id_proyecto: number;
  }

  export module HandleProyecto {
    export async function crear(req: Request) {
      //Check webtoken in params
      let token = req.params.token;
      let decoded = jwt.verify(token, "secret")

      if (!decoded) {
        throw new Error("Token invalido");
      }

      let json = req.body as Proyecto;

      const Cliente = await prisma.cliente.findUnique({
        where: {
          correo_cliente: json.correo_cliente,
        },
      });

      const NewProject = await prisma.proyecto.create({
        data: {
          nombre_proyecto: json.nombre_proyecto,
          correo_creador: json.correo_creador,
          correo_empresa: Cliente?.correo_empresa || "",
          correo_cliente: json.correo_cliente,
        },
      });

      //Registrar creador
      await prisma.creador.create({
        data: {
          correo_creador: json.correo_creador,
          id_proyecto: NewProject.id_proyecto,
        },
      });

    }

    export async function obtener(req:Request): Promise<Proyecto[]> {
      //Obtener todos los proyectos
      let token = req.params.token;
      let decoded = jwt.verify(token, "secret")

      if (!decoded) {
        throw new Error("Token invalido");
      }
      console.log("AAAAA")
      return await prisma.proyecto.findMany({
        orderBy: [
          {
            id_proyecto: "desc"
          }
        ],
      });
      
    }

    export async function eliminar(req: Request) {
      let token = req.params.token;
      let decoded = jwt.verify(token, "secret")

      if (!decoded) {
        throw new Error("Token invalido");
      }

      let id = parseInt(req.params.id);

      //Eliminar proyecto
      await prisma.proyecto.delete({
        where: {
          id_proyecto: id,
        },
      });

      //Eliminar creador
      await prisma.creador.deleteMany({
        where: {
          id_proyecto: id,
        },
      });

      
    }

    export async function agregarArchivo(req: Request) {
      let token = req.params.token;
      let decoded = jwt.verify(token, "secret")

      if (!decoded) {
        throw new Error("Token invalido");
      }

      const file = req.file?.path;
      const name = req.file?.originalname;
      let id = parseInt(req.params.id);

      //Guardar archivo
      const modelo = await prisma.modelo.create({
        data: {
          archivo_modelo: file || "",
          nombre_modelo: req.params.name || "",
        },
      });

      await prisma.modeloProyecto.create({
        data: {
          id_modelo: modelo.id_modelo,
          id_proyecto: id,
        },
      });
      
    }

    export async function obtenerArchivo(req: Request) {
      let token = req.params.token;
      let decoded = jwt.verify(token, "secret")

      if (!decoded) {
        throw new Error("Token invalido");
      }

      let id = parseInt(req.params.id);

      const relaciones = await prisma.modeloProyecto.findMany({
        where: {
          id_proyecto: id,
        },
      });

      let archivos: Modelo[] = [];

      for (let i = 0; i < relaciones.length; i++) {
        let archivo = await prisma.modelo.findUnique({
          where: {
            id_modelo: relaciones[i].id_modelo,
          },
        });

        archivos.push({
          archivo_modelo: archivo?.archivo_modelo || "",
          id_proyecto: id,
        });
      }

      return archivos;
    }
    

    export async function filtrarPorEmpleado(req: Request) {
      let token = req.params.token;
      let decoded = jwt.verify(token, "secret")

      if (!decoded) {
        throw new Error("Token invalido");
      }

      let correo = req.params.correo;

      //Obtener proyectos de empleado
      await prisma.creador.findMany({
        where: {
          correo_creador: correo,
        },
      });

      return await prisma.proyecto.findMany({
        where: {
          correo_creador: correo,
        },
        orderBy: {
          fecha_de_creacion: 'desc',
        }
      });
      
    }

    export async function filtrarPorEmpresa(req: Request) {
      let token = req.params.token;
      let decoded = jwt.verify(token, "secret")

      if (!decoded) {
        throw new Error("Token invalido");
      }


      let correo = req.params.correo;

      //Obtener proyectos de empresa
      return await prisma.proyecto.findMany({
        where: {
          correo_empresa: correo,
        },
      });
      
    }

    export async function filtrarPorCliente(req: Request) {
      let token = req.params.token;
      let decoded = jwt.verify(token, "secret")

      if (!decoded) {
        throw new Error("Token invalido");
      }

      let correo = req.params.correo;

      //Obtener proyectos de cliente
      return await prisma.proyecto.findMany({
        where: {
          correo_cliente: correo,
        },
      });
      
    }
  }
