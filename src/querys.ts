import { PrismaClient } from "@prisma/client";
import { Request } from "express";

export module QueryHandler {
  export async function darDeAltaEmpleado(req: Request, prisma: PrismaClient) {
    let json = req.body;
    const empleado = await prisma.empleado.create({
      data: json,
    });
  }

  export async function verEmpleados(prisma: PrismaClient) {
    const empleados = await prisma.empleado.findMany();
    return empleados;
  }

  export async function darDeAltaEmpresa(req: Request, prisma: PrismaClient) {
    let json = req.body;
    const empresa = await prisma.empresa.create({
      data: json,
    });
  }

  export async function verEmpresas(prisma: PrismaClient) {
    const empresas = await prisma.empresa.findMany();
    return empresas;
  }

  export async function darDeAltaCliente(req: Request, prisma: PrismaClient) {
    let json = req.body;
    const cliente = await prisma.cliente.create({
      data: json,
    });
  }

  export async function verClientes(prisma: PrismaClient) {
    const clientes = await prisma.cliente.findMany();
    return clientes;
  }

  export async function crearModelo(req: Request, prisma: PrismaClient) {
    let json = req.body;

    if (!json || !json["correo_creador"] || !json["correo_cliente"]) {
      throw new Error("Missing 'correo_creador' field in JSON");
    }

    const creador = json["correo_creador"];
    const cliente = json["correo_cliente"];

    const nuevoCreado = await prisma.creador.create({
      data: {
        correo_creador: creador,
      },
    });

    const clienteModelo = await prisma.cliente.findUnique({
      where: {
        correo_cliente: cliente,
      },
    });

    const nuevoModelo = await prisma.modelo.create({
      data: {
        correo_creador: creador,
        correo_cliente: cliente,
        correo_empresa: clienteModelo?.correo_empresa || "",
      },
    });
  }

  export async function verModelos(prisma: PrismaClient) {
    const modelos = await prisma.modelo.findMany();
    return modelos;
  }

  export async function agregarArchivoAModelo(
    req: Request,
    prisma: PrismaClient
  ) {
    const file = req.file;

    if (!file) {
      throw new Error("No hay archivo papu :v");
    }

    if (!req.params["id"]) {
      throw new Error("No pusiste id en la direccion papu :v");
    }

    await prisma.modelo.update({
      where: {
        id_modelo: Number(req.params["id"]) || 0,
      },
      data: {
        archivo: Buffer.from(file.buffer),
      },
    });
  }
}
