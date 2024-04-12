import { prisma } from "../prisma/client";
import { Request } from "express";
import jwt from "jsonwebtoken";

export module HandleEmpresa {
  export async function crear(req: Request) {
    let json = req.body;

    if (Array.isArray(json)) {
      for (const data of json) {
        const empresa = await prisma.empresa.create({
          data: data,
        });
      }
    } else {
      const empresa = await prisma.empresa.create({
        data: json,
      });
    }
  }

  export async function obtener() {
    const empresas = await prisma.empresa.findMany();
    return empresas;
  }

  export async function eliminar(req: Request) {
    if (!req.params["correo"]) {
      throw new Error("No pusiste correo_empresa en la direccion papu :v");
    }

    let token = req.params.token;
    let decoded = jwt.verify(token, "secret")

    if (!decoded) {
      throw new Error("Token invalido");
    }

    const empresa = await prisma.empresa.deleteMany({
      where: {
        correo_empresa: req.params["correo"],
      },
    });
  }

}
