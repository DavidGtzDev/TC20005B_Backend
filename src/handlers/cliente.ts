import { prisma } from "../prisma/client";
import { Request } from "express";

export module HandleCliente {
  export async function crear(req: Request) {
    let json = req.body;

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
    if (!req.params["correo"]) {
      throw new Error("No pusiste correo_cliente en la direccion papu :v");
    }

    const cliente = await prisma.cliente.deleteMany({
      where: {
        correo_cliente: req.params["correo"],
      },
    });
  }
}
