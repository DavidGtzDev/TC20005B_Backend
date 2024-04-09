import { prisma } from "../prisma/client";
import { Request } from "express";

export module HandleEditor {
  export async function crear(req: Request) {
    let json = req.body;

    if (!json || !json["correo_editor"] || !json["id_modelo"]) {
      throw new Error("Missing 'correo_creador' field in JSON");
    }

    const editor = json["correo_editor"];
    const modelo = json["id_modelo"];

    const nuevoEditor = await prisma.editor.create({
      data: {
        correo_editor: editor,
      },
    });

    const nuevaRelacionEditorModelo = await prisma.editoresDeModelos.create({
      data: {
        correo_editor: editor || "",
        id_modelo: parseInt(modelo) || 0,
      },
    });
  }

  export async function obtener(req: Request) {
    if (!req.params["id"]) {
      throw new Error("No pusiste id en la direccion papu :v");
    }

    const editores = await prisma.editoresDeModelos.findMany({
      where: {
        id_modelo: parseInt(req.params["id"]) || 0,
      },
    });

    return editores;
  }

  export async function eliminar(req: Request) {
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
        id_modelo: id,
      },
    });
  }
}
