import { prisma } from "../prisma/client";
import { Request } from "express";
import * as argon2 from "argon2";
import jwt from "jsonwebtoken";

export module HandleEmpleado {
  export async function crear(req: Request) {
    let json = req.body;
    if (Array.isArray(json)) {
      for (const data of json) {
        if (!data["password_empleado"]) {
          throw new Error("Missing 'password_empleado' field in JSON");
        }
        try {
          data["password_empleado"] = await argon2.hash(
            data["password_empleado"]
          );
          const empleado = await prisma.empleado.create({
            data: data,
          });
        } catch {
          throw new Error("Error en el hash de la contraseña");
        }
      }
    } else {
      const empleado = await prisma.empleado.create({
        data: json,
      });
    }
  }

  export async function obtener() {
    const empleados = await prisma.empleado.findMany();
    return empleados;
  }

  export async function eliminar(req: Request) {
    if (!req.params["correo"]) {
      throw new Error("No pusiste correo_empleado en la direccion papu :v");
    }

    let token = req.params.token;
    let decoded = jwt.verify(token, "secret")

    if (!decoded) {
      throw new Error("Token invalido");
    }

    await prisma.creador.deleteMany({
      where: {
        correo_creador: req.params["correo"],
      },
    });

    await prisma.proyecto.deleteMany({
      where: {
        correo_creador: req.params["correo"],
      },
    });

    const empleado = await prisma.empleado.deleteMany({
      where: {
        correo_empleado: req.params["correo"],
      },
    });
  }

  export async function obtenerPorCorreo(req: Request) {
    if (!req.params["correo"]) {
      throw new Error("No pusiste correo_empleado en la direccion papu :v");
    }

    let token = req.params.token;
    let decoded = jwt.verify(token, "secret")

    if (!decoded) {
      throw new Error("Token invalido");
    }

    const empleado = await prisma.empleado.findUnique({
      where: {
        correo_empleado: req.params["correo"],
      },
    });

    return empleado;
  }


}
