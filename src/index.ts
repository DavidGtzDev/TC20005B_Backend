import express from "express";
import empleadoRoutes from "./routes/empleadoRoutes";
import empresaRoutes from "./routes/empresaRoutes";
import editorRoutes from "./routes/editorRoutes";
import clienteRoutes from "./routes/clienteRoutes";
import modeloRoutes from "./routes/modeloRoutes";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/empleado", empleadoRoutes);
app.use("/empresa", empresaRoutes);
app.use("/editor", editorRoutes);
app.use("/cliente", clienteRoutes);
app.use("/modelo", modeloRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});