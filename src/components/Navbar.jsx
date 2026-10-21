import { useEffect, useRef, useState } from "react";
import Icono from "./Icono"
import Logo from "../assets/logos/logo-normal.svg";
import "./Navbar.css";

const DESTINOS = {
  explorar: "#explorar",
  conciertos: "#conciertos",
  teatro: "#teatro",
  deportes: "#deportes",
  festivales: "#festivales",
};

export default function Navbar({ textos, cargando, error, recargar, idioma, cambiarIdioma, activo, onBuscar, textoGrande, alternarTexto }) {
  const [abierto, setAbierto] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const botonMenu = useRef(null);
  const campoBusqueda = useRef(null);
  const nav = textos?.navbar;
  const ingles = idioma === "en";
  const abrir = textos?.menuMovil.abrir ?? (ingles ? "Open menu" : "Abrir menú");
  const cerrar = textos?.menuMovil.cerrar ?? (ingles ? "Close menu" : "Cerrar menú");
  const enlaces = Object.entries(nav?.enlaces ?? {}).filter(([clave]) => DESTINOS[clave]);
  const vendeTusEventos = textos?.menuMovil.enlaces.venderEventos ?? (ingles ? "Sell your events" : "Vende tus eventos");

  useEffect(() => {
    function cerrarConEscape(evento) {
      if (evento.key === "Escape" && abierto) {
        setAbierto(false);
        botonMenu.current?.focus();
      }
    }
    document.addEventListener("keydown", cerrarConEscape);
    return () => document.removeEventListener("keydown", cerrarConEscape);
  }, [abierto]);

  function abrirBusqueda() {
    setAbierto(true);
    requestAnimationFrame(() => campoBusqueda.current?.focus());
  }

  function buscar(evento) {
    evento.preventDefault();
    const consulta = busqueda.trim();
    if (!consulta) return;
    onBuscar(consulta);
    setAbierto(false);
  }

  return (
    <header className="navbar">
      <nav className="navbar-interior" aria-label={nav?.aria.menu ?? "Navegación principal"}>
        <a className="navbar-marca" href="#inicio" aria-label={nav?.logo.aria ?? "Inicio"} onClick={() => setAbierto(false)}>
          <img src={Logo} alt="" />
        </a>

        <div className="navbar-movil-acciones">
          <button type="button" className="navbar-icono" aria-label={nav?.buscador.aria ?? "Buscar"} disabled={!nav} onClick={abrirBusqueda}><Icono nombre="buscar" /></button>
          {nav && <a className="navbar-icono" href="#favoritos" aria-label={nav.botones.favoritos} onClick={() => setAbierto(false)}><Icono nombre="favoritos" /></a>}
          <button ref={botonMenu} type="button" className="navbar-icono" aria-label={abierto ? cerrar : abrir} aria-expanded={abierto} aria-controls="navbar-panel" onClick={() => setAbierto((valor) => !valor)}><Icono nombre={abierto ? "cerrar" : "menu"} /></button>
        </div>

        <div id="navbar-panel" className={`navbar-panel${abierto ? " is-abierto" : ""}`} aria-busy={cargando}>
          {cargando && <p className="navbar-estado" role="status">{ingles ? "Loading navigation…" : "Cargando navegación…"}</p>}
          {error && <div className="navbar-estado" role="alert"><p>{ingles ? "Navigation could not be loaded." : "No pudimos cargar el menú."}</p><button type="button" onClick={recargar}>{ingles ? "Try again" : "Reintentar"}</button></div>}
          {nav && <>
            <ul className="cuerpo-p-fuerte navbar-enlaces">
              {enlaces.map(([clave, etiqueta]) => <li key={clave}><a href={DESTINOS[clave]} aria-current={activo === clave ? "page" : undefined} onClick={() => setAbierto(false)}>{etiqueta}</a></li>)}
            </ul>
            <form className="cuerpo-p navbar-buscador" role="search" aria-label={nav.buscador.aria} onSubmit={buscar}>
              <button type="submit" aria-label={nav.buscador.boton}><Icono nombre="buscar" /></button>
              <input ref={campoBusqueda} type="search" value={busqueda} onChange={(evento) => setBusqueda(evento.target.value)} placeholder={nav.buscador.placeholder} aria-label={nav.buscador.aria} required />
            </form>

            <a className="cuerpo-p-fuerte navbar-venta" href="#vendeTusEventos" onClick={() => setAbierto(false)}>
              {vendeTusEventos}
            </a>

          </>}
          <div className="navbar-utilidades">
            <label className="navbar-idioma"><Icono nombre="idioma" /><select value={idioma} onChange={(evento) => cambiarIdioma(evento.target.value)} aria-label={nav?.aria.idioma ?? "Cambiar idioma"}><option value="es">ES</option><option value="en">EN</option></select></label>
            <button className="navbar-icono navbar-accesibilidad" type="button" aria-label={ingles ? "Enlarge text" : "Aumentar texto"} aria-pressed={textoGrande} onClick={alternarTexto}><Icono nombre="accesibilidad" /></button>
            {nav && <a className="cuerpo-p-fuerte navbar-accion" href="#ingresar" onClick={() => setAbierto(false)}>{nav.botones.ingresar}</a>}
          </div>
        </div>
      </nav>
    </header>
  );
}
