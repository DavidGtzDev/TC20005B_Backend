import { prisma } from "../prisma/client";
import { Request } from "express";
import jwt from "jsonwebtoken";

interface Proyecto{
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
    return await prisma.proyecto.findMany();
    
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

    //Eliminar modelos
    await prisma.modelo.deleteMany({
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
    let id = parseInt(req.params.id);

    //Guardar archivo
    await prisma.modelo.create({
      data: {
        archivo_modelo: file || "",
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

    //Obtener archivo
    return await prisma.proyecto.findUnique({
      where: {
        id_proyecto: id,
      },
      select: {
        Modelo: true,
      },
    });

    
  }
  

  export async function filtrarPorEmpleado(req: Request) {
    let token = req.params.token;
    let decoded = jwt.verify(token, "secret")

    if (!decoded) {
      throw new Error("Token invalido");
    }

    let correo = req.params.correo;

    //Obtener proyectos de empleado
    return await prisma.creador.findMany({
      where: {
        correo_creador: correo,
      },
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
