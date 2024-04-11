import { prisma } from "../prisma/client";
import { Request } from "express";
import * as argon2 from "argon2";
import jwt from "jsonwebtoken";

export module HandleLogin {
    export async function login(req: Request) {
        let json = req.body;

        if (!json["correo_empleado"] || !json["password_empleado"]) {
            throw new Error("Faltan campos en el JSON");
        }

        const empleado = await prisma.empleado.findUnique({
            where: {
                correo_empleado: json["correo_empleado"],
            },
        });

        if (!empleado) {
            throw new Error("No existe el empleado");
        }

        if (!await argon2.verify(empleado.password_empleado, json["password_empleado"])) {
            throw new Error("Contraseña incorrecta");
        }

        const token = jwt.sign({ correo_empleado: empleado.correo_empleado }, "secret", { expiresIn: "1h" });
        return {
            token: token,
            empleado: empleado,
        }
    }
}

