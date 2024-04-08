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

  export async function guardarNuevaVersionDelModelo(
    req: Request,
    prisma: PrismaClient
  ) {
    const file = req.file?.path;

    if (!file) {
      throw new Error("No hay archivo papu :v");
    }

    if (!req.params["id"] || !req.params["editor"]) {
      throw new Error("No pusiste id en la direccion papu :v");
    }

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

  export async function crearNuevaPeticion(req: Request, prisma: PrismaClient) {
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

  export async function obtenerPeticionesDeUnArchivo(
    req: Request,
    prisma: PrismaClient
  ) {
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

  export async function eliminarEditorDeModelo(
    req: Request,
    prisma: PrismaClient
  ) {
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

  export async function actualizarPeticion(req: Request, prisma: PrismaClient) {
    let json = req.body;

    if (!req.params["id"]) {
      throw new Error("No pusiste id en la direccion papu :v");
    }


    if (!json || !json["status"] || !json["correo_cliente"] || !json["contenido"]) {
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

  export async function eliminarPeticion(req: Request, prisma: PrismaClient) {
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

  export async function obtenerModelosHechosPorUnEmpleado (
    req: Request,
    prisma: PrismaClient
  ) {
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

  export async function obtenerModelosDeUnaEmpresa (
    req: Request,
    prisma: PrismaClient
  ) {
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

  export async function obtenerModelosDeUnCliente (
    req: Request,
    prisma: PrismaClient
  ) {
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
