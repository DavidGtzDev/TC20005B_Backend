import { PrismaClient } from "@prisma/client";
import { Request } from "express";

export module QueryHandler {
  export async function darDeAltaEmpleado(req: Request, prisma: PrismaClient) {
    let json = req.body;

    if (Array.isArray(json)) {
      for (const data of json) {
        const empleado = await prisma.empleado.create({
          data: data,
        });
      }
    } else {
      const empleado = await prisma.empleado.create({
        data: json,
      });
    }
  }

  export async function verEmpleados(prisma: PrismaClient) {
    const empleados = await prisma.empleado.findMany();
    return empleados;
  }

  export async function darDeAltaEmpresa(req: Request, prisma: PrismaClient) {
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

  export async function verEmpresas(prisma: PrismaClient) {
    const empresas = await prisma.empresa.findMany();
    return empresas;
  }

  export async function darDeAltaCliente(req: Request, prisma: PrismaClient) {
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

  export async function agregarArchivoAModelo(
    req: Request,
    prisma: PrismaClient
  ) {
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

  export async function obtenerArchivoModelo(
    req: Request,
    prisma: PrismaClient
  ) {
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

  export async function agregarEditores(req: Request, prisma: PrismaClient) {
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

  export async function obtenerEditoresDeUnArchivo(
    req: Request,
    prisma: PrismaClient
  ) {
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

  export async function guardarNuevaVersionDelModelo(req: Request, prisma: PrismaClient){
    const file = req.file?.path;

    if (!file) {
      throw new Error("No hay archivo papu :v");
    }

    let json = req.body;

    if (!json || !json["editor"] || !json["id_modelo"]) {
      throw new Error("Missing 'correo_creador' field in JSON");
    }

    const modelo = await prisma.modelo.findUnique({
      where: {
        id_modelo: parseInt(json["id_modelo"]) || 0,
      },
    });

    const nuevaEdicion = await prisma.edicion.create({
      data: {
        id_modelo:  modelo?.id_modelo || 0,
        correo_empleado:  json["editor"] || "",
        archivo: file
      },
    });

    /**
     const nuevaEdicion = await prisma.edicion.create({
      data: {
        
      },
    });
     */
    
  }
}
