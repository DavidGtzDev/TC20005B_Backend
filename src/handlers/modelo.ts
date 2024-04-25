import { prisma } from "../prisma/client";
import { Request } from "express";
import jwt from "jsonwebtoken";

interface Modelo {
  archivo_modelo: string;
  id_proyecto: number;
}

export module HandleModelo {
  export async function obtener() {
    const modelos = await prisma.modelo.findMany({
      orderBy: {
        id_modelo: 'desc',
      }
    });
    modelos.forEach(item => {
      item.archivo_modelo = item.archivo_modelo.replace('src\\uploads\\', '');
    });
    return modelos;
  }

  export async function obtenerPorProyecto(req: Request) {
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

    archivos.forEach(item => {
      item.archivo_modelo = item.archivo_modelo.replace('src\\uploads\\', '');
    });

    return archivos;
  }

  export async function obtenerModelosPorEmpleado(req: Request){
    let correo = req.params.correo;

    const proyectos = await prisma.creador.findMany({
      where: {
        correo_creador: correo,
      },
    });
    
    let modelos: Modelo[] = [];

    for (let i = 0; i < proyectos.length; i++) {
      const relaciones = await prisma.modeloProyecto.findMany({
        where: {
          id_proyecto: proyectos[i].id_proyecto,
        },
      });
      
      

      for (let j = 0; j < relaciones.length; j++) {
        let archivo = await prisma.modelo.findUnique({
          where: {
            id_modelo: relaciones[j].id_modelo,
          },
        });

        modelos.push({
          archivo_modelo: archivo?.archivo_modelo || "",
          id_proyecto: proyectos[i].id_proyecto,
        });
      }
    }

    modelos.forEach(item => {
      item.archivo_modelo = item.archivo_modelo.replace('src\\uploads\\', '');
    });

    return modelos;
  }

  export async function obtenerModelosPorEmpresa(req: Request) {
    let correo = req.params.correo;

    const proyectos = await prisma.proyecto.findMany({
      where: {
        correo_empresa: correo,
      },
    });

    let modelos: Modelo[] = [];

    for (let i = 0; i < proyectos.length; i++) {
      const relaciones = await prisma.modeloProyecto.findMany({
        where: {
          id_proyecto: proyectos[i].id_proyecto,
        },
      });

      for (let j = 0; j < relaciones.length; j++) {
        let archivo = await prisma.modelo.findUnique({
          where: {
            id_modelo: relaciones[j].id_modelo,
          },
        });

        modelos.push({
          archivo_modelo: archivo?.archivo_modelo || "",
          id_proyecto: proyectos[i].id_proyecto,
        });
      }
    }

    modelos.forEach(item => {
      item.archivo_modelo = item.archivo_modelo.replace('src\\uploads\\', '');
    });

    return modelos;
  }

  export async function borrarModelo(req: Request) {
    let token = req.params.token;
    let decoded = jwt.verify(token, "secret")
    

    if (!decoded) {
      throw new Error("Token invalido");
    }

    let id = parseInt(req.params.id);

    await prisma.modeloProyecto.deleteMany({
      where: {
        id_modelo: id,
      },
    });

    await prisma.modelo.delete({
      where: {
        id_modelo: id,
      },
    });

  }
} 
