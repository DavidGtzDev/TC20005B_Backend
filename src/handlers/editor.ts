import { prisma } from "../prisma/client";
import { Request } from "express";
import jwt from "jsonwebtoken";

interface Editor {
  correo_editor: string;
  id_modelo: number;
}
export module HandleEditor {
  export async function crear(req: Request) {
    let json = req.body as Editor;

    let token = req.params.token;
    let decoded = jwt.verify(token, "secret")

    if (!decoded) {
      throw new Error("Token invalido");
    }
    
    await prisma.creador
      .findMany({
        where: {
          correo_creador: json.correo_editor,
          id_proyecto: json.id_modelo,
        },
      })
      .then((creador) => {
        if (creador.length > 0) {
          throw new Error("El creador no puede ser editor de su propio modelo");
        }
      });

    const nuevoEditor = await prisma.editor.create({
      data: {
        correo_editor: json.correo_editor,
      },
    });

    const nuevaRelacionEditorModelo = await prisma.editoresDeModelos.create({
      data: {
        correo_editor: json.correo_editor,
        id_proyecto: json.id_modelo,
      },
    });
  }

  export async function obtener(req: Request) {

    let token = req.params.token;
    let decoded = jwt.verify(token, "secret")

    if (!decoded) {
      throw new Error("Token invalido");
    }

    if (!req.params["id"]) {
      throw new Error("No pusiste id en la direccion papu :v");
    }

    const editores = await prisma.editoresDeModelos.findMany({
      where: {
        id_proyecto: parseInt(req.params["id"]) || 0,
      },
    });

    return editores;
  }

  export async function eliminar(req: Request) {
    let token = req.params.token;
    let decoded = jwt.verify(token, "secret")

    if (!decoded) {
      throw new Error("Token invalido");
    }
    
    if (!req.params["id"]) {
      throw new Error("No pusiste id en la direccion papu :v");
    }

    if (!req.params["editor"]) {
      throw new Error("No pusiste editor en la direccion papu :v");
    }

    const editor = req.params["editor"];
    const id = parseInt(req.params["id"]) || 0;

    const editorModelo = await prisma.editoresDeModelos.deleteMany({
      where: {
        correo_editor: editor,
        id_proyecto: id,
      },
    });
  }
}
