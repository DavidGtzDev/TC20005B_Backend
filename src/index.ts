import express from "express";
import empleadoRoutes from "./routes/empleadoRoutes";
import empresaRoutes from "./routes/empresaRoutes";
import editorRoutes from "./routes/editorRoutes";
import clienteRoutes from "./routes/clienteRoutes";
import proyectoRoutes from "./routes/proyectoRoutes";
import loginRoute from "./routes/loginRoute";
import modelosRoute from "./routes/modelosRoutes";
import cors from "cors";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use("/empleado", empleadoRoutes);
app.use("/empresa", empresaRoutes);
app.use("/editor", editorRoutes);
app.use("/cliente", clienteRoutes);
app.use("/proyecto", proyectoRoutes);
app.use("/login", loginRoute);
app.use("/modelo", modelosRoute);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});