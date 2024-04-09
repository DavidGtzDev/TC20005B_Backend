import { prisma } from "../prisma/client";
import { Request } from "express";

export module HandlePeticion {
  export async function crear(req: Request) {
    let json = req.body;

    if (!req.params["id"]) {
      console.log("No pusiste id en la direccion papu :v");
      throw new Error("No pusiste id en la direccion papu :v");
    }

    if (
      !json ||
      !json["correo_cliente"] ||
      !json["status"] ||
      !json["contenido"]
    ) {
      switch (json) {
        case !json:
          console.log("No hay JSON");
        case !json["correo_cliente"]:
          console.log("Missing 'correo_cliente' field in JSON");
        case !json["status"]:
          console.log("Missing 'status' field in JSON");
        case !json["contenido"]:
          console.log("Missing 'contenido' field in JSON");
      }
      throw new Error("Missing 'correo_cliente' field in JSON");
    }

    let contenido = json["contenido"];
    let correoCliente = json["correo_cliente"];
    let status = json["status"];

    const nuevaPeticion = await prisma.peticion.create({
      data: {
        correo_cliente: correoCliente,
        id_modelo: parseInt(req.params["id"]) || 0,
        contenido: contenido,
        estatus: status,
      },
    });
  }

  export async function obtener(req: Request) {
    if (!req.params["id"]) {
      throw new Error("No pusiste id en la direccion papu :v");
    }

    const peticiones = await prisma.peticion.findMany({
      where: {
        id_modelo: parseInt(req.params["id"]) || 0,
      },
    });

    return peticiones;
  }

  export async function actualizar(req: Request) {
    let json = req.body;

    if (!req.params["id"]) {
      throw new Error("No pusiste id en la direccion papu :v");
    }

    if (
      !json ||
      !json["status"] ||
      !json["correo_cliente"] ||
      !json["contenido"]
    ) {
      throw new Error("Missing 'status' field in JSON");
    }

    const status = json["status"];

    const peticion = await prisma.peticion.updateMany({
      where: {
        id_modelo: parseInt(req.params["id"]) || 0,
        correo_cliente: json["correo_cliente"],
        contenido: json["contenido"],
      },
      data: {
        estatus: status,
      },
    });
  }

  export async function eliminar(req: Request) {
    if (!req.params["id"]) {
      throw new Error("No pusiste id en la direccion papu :v");
    }

    if (!req.params["correo_cliente"]) {
      throw new Error("No pusiste correo_cliente en la direccion papu :v");
    }

    if (!req.params["contenido"]) {
      throw new Error("No pusiste contenido en la direccion papu :v");
    }

    const peticion = await prisma.peticion.deleteMany({
      where: {
        id_modelo: parseInt(req.params["id"]) || 0,
        correo_cliente: req.params["correo_cliente"],
        contenido: req.params["contenido"],
      },
    });
  }
}
