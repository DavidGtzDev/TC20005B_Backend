import { prisma } from "../prisma/client";
import { Request } from "express";
interface Modelo{
  correo_creador: string,
  correo_cliente: string
}
export module HandleModelo {
  export async function crear(req: Request) {
    //Crear una interfaz en typescript
    let json = req.body as Modelo;

    const clienteModelo = await prisma.cliente.findUnique({
      where: {
        correo_cliente: json.correo_cliente,
      },
    });

    const nuevoModelo = await prisma.modelo.create({
      data: {
        correo_creador: json.correo_creador,
        correo_cliente: json.correo_cliente,
        correo_empresa: clienteModelo?.correo_empresa || "",
      },
    })

    const nuevoCreado = await prisma.creador.create({
      data: {
        correo_creador: json.correo_creador,
        id_modelo: nuevoModelo.id_modelo,
      },
    });


  }

  export async function obtener() {
    const modelos = await prisma.modelo.findMany({
      select: {
        id_modelo: true,
        fecha_de_creacion: true,
        correo_creador: true,
        correo_empresa: true,
        correo_cliente: true,
        archivo: false,
      },
    });
    return modelos;
  }

  export async function eliminar(req: Request) {
    if (!req.params["id"]) {
      throw new Error("No pusiste id en la direccion papu :v");
    }

    const modelo = await prisma.modelo.deleteMany({
      where: {
        id_modelo: parseInt(req.params["id"]) || 0,
      },
    });
  }

  export async function agregarArchivo(req: Request) {
    //Esta diciendo que el archivo es undefined
    const file = req.file?.path;

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
        archivo: file,
      },
    });
  }

  export async function obtenerArchivo(req: Request) {
    if (!req.params["id"]) {
      throw new Error("No pusiste id en la direccion papu :v");
    }

    const model = await prisma.modelo.findUnique({
      where: {
        id_modelo: Number(req.params["id"]) || 0,
      },
    });

    return model?.archivo;
  }

  export async function guardarNuevaVersion(req: Request) {
    //TODO: Checar que quien guarde si sea editor de ese archivo
    const file = req.file?.path;

    if (!file) {
      throw new Error("No hay archivo papu :v");
    }

    if (!req.params["id"] || !req.params["editor"]) {
      throw new Error("No pusiste id en la direccion papu :v");
    }

    await prisma.creador.findMany({
      where: {
        correo_creador: req.params["editor"],
        id_modelo: parseInt(req.params["id"]) || 0,
      },
    }).then((creador) => {
      if (creador.length === 0) {
        throw new Error("No tienes permiso para editar este archivo");
      }
    } );

    await prisma.editoresDeModelos.findMany({
      where: {
        correo_editor: req.params["editor"],
        id_modelo: parseInt(req.params["id"]) || 0,
      },
    }).then((editor) => {
      if (editor.length === 0) {
        throw new Error("No tienes permiso para editar este archivo");
      }
    });

    
    const modelo = await prisma.modelo.findUnique({
      where: {
        id_modelo: parseInt(req.params["id"]) || 0,
      },
    });

    const nuevaEdicion = await prisma.edicion.create({
      data: {
        id_modelo: modelo?.id_modelo || 0,
        correo_empleado: req.params["editor"] || "",
        archivo: file,
      },
    });

    const actualizarModelo = await prisma.modelo.update({
      where: {
        id_modelo: parseInt(req.params["id"]) || 0,
      },
      data: {
        archivo: file,
      },
    });
  }

  export async function filtrarPorEmpleado(req: Request) {
    if (!req.params["correo"]) {
      throw new Error("No pusiste correo_empleado en la direccion papu :v");
    }

    const modelos = await prisma.modelo.findMany({
      where: {
        correo_creador: req.params["correo"],
      },
    });

    return modelos;
  }

  export async function filtrarPorEmpresa(req: Request) {
    if (!req.params["correo"]) {
      throw new Error("No pusiste correo_empresa en la direccion papu :v");
    }

    const modelos = await prisma.modelo.findMany({
      where: {
        correo_empresa: req.params["correo"],
      },
    });

    return modelos;
  }

  export async function filtrarPorCliente(req: Request) {
    if (!req.params["correo"]) {
      throw new Error("No pusiste correo_cliente en la direccion papu :v");
    }

    const modelos = await prisma.modelo.findMany({
      where: {
        correo_cliente: req.params["correo"],
      },
    });

    return modelos;
  }
}
