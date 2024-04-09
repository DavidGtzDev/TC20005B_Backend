import { prisma } from "../prisma/client";
import { Request } from "express";

interface Cliente {
  nombre_cliente: string;
  correo_cliente: string;
  telefono_cliente: string;
  correo_empresa: string;
}

interface ParamEliminar {
  correo: string;
}


export module HandleCliente {
  export async function crear(req: Request) {
    let json = req.body as Cliente[] | Cliente;

    if (Array.isArray(json)) {
      for (const data of json) {
        const cliente = await prisma.cliente.create({
          data: data,
        });
      }
    } else {
      const cliente = await prisma.cliente.create({
        data: json,
      });
    }
  }

  export async function obtener() {
    const clientes = await prisma.cliente.findMany();
    return clientes;
  }

  export async function eliminar(req: Request) {
    let params = req.params as unknown as ParamEliminar;
    
    const cliente = await prisma.cliente.deleteMany({
      where: {
        correo_cliente: params.correo,
      },
    });
  }
}
