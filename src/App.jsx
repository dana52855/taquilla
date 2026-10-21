import { useEffect, useState } from "react";
import Navbar from "./components/Navbar"
import {useTextos} from "./hooks/useTextos";

function leerSeccion() {
  return window.location.hash.slice(1) || "inicio";
}

function App () {
  const [idioma, setIdioma] = useState ("es");
  const [activo, setActivo] = useState(leerSeccion);
  const [consulta, setConsulta] = useState("");
  const [textoGrande, setTextoGrande] = useState(false);
  const datos = useTextos(idioma);
  console.log(datos);

  const ingles = idioma === "en";
  const titulo = activo === "favoritos" 
  ? datos.textos?.navbar.botones.favoritos
  : datos.textos?.navbar.enlaces[activo];

  useEffect(() => {
    function actualizar() {
      setActivo  (leerSeccion());
      setConsulta("");
    }
    window.addEventListener("hashchange", actualizar);
    return () => window.removeEventListener ("hashchange", actualizar);
  }, []);

  useEffect(() => { document.documentElement.lang; }, [idioma]);
  useEffect(() => {
      document.documentElement.style.fontSize = textoGrande ? "112%" : "";
      return () => {
          document.documentElement.style.fontSize = "";
      };
  }, [textoGrande]);

  function buscar(valor) {
      setConsulta(valor);
      setActivo("heroes")
      window.history.replaceState(null, "", "#heroes");
  }

  return (
    <div className="sitio">
        <Navbar
            {...datos}
            idioma={idioma}
            cambiarIdioma={setIdioma}
            activo={activo}
            onBuscar={buscar}
            texto={textoGrande}
            alternarTexto={()=>setTextoGrande(valor => !valor)}
        />
    </div>
);
}

export default App