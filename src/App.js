import './App.css';
import React, { useState } from 'react';

export default function Pokedex() {
  // Definimos los estados
  const [tipo, setTipo] = useState('pokemon');
  const [busqueda, setBusqueda] = useState('');
  const [resultados, setResultados] = useState([]);
  const [esListaGeneral, setEsListaGeneral] = useState(false);
  const [error, setError] = useState('');

  // Función para manejar el envío del formulario
  const buscarEnPokedex = async (evento) => {
    evento.preventDefault();
    setError('');
    setResultados([]);
    const id = busqueda.trim().toLowerCase();
    let urlEndpoint = `https://pokeapi.co/api/v2/${tipo}/`;
    if (id !== "") {
      urlEndpoint += id;
    }

    try {
      // Hacemos la petición a Internet
      const respuesta = await fetch(urlEndpoint);

      if (!respuesta.ok) {
        setError("No se encontró nada con ese ID o nombre.");
        return;
      }

      const datos = await respuesta.json();

      if (id !== "") {
        setResultados([datos]);
        setEsListaGeneral(false);
      } else {
        setResultados(datos.results);
        setEsListaGeneral(true);
      }
    } catch (error) {
      setError("Error de conexión con la API");
    }
  };

  const renderTarjeta = (item, index) => {
    if (tipo === 'pokemon') {
      // Lógica para renderizar tarjeta de pokemon
      const tipos = item.types.map(t => t.type.name).join(', ');
      return (
        <div key={item.id}>
          <img src={item.sprites.front_default} alt={item.name} />
          <h3>{item.name.toUpperCase()}</h3>
          <p><b>Id:</b> {item.id}</p>
          <p><b>Tipos:</b> {tipos}</p>
          <p><b>Altura:</b> {item.height}</p>
          <p><b>Peso:</b> {item.weight}</p>
        </div>
      );
    }
    if (tipo === 'item') {
      // Lógica para renderizar tarjeta de objeto
      return (
        <div key={index}>
          <h3>{item.name.toUpperCase().replace('-', ' ')}</h3>
          <p><b>Id:</b> {item.id}</p>
          <p><b>Coste:</b> {item.cost} ₽</p>
        </div>
      );
    }
    if (tipo === 'location') {
      // Lógica para renderizar tarjeta de ubicación
      return (
        <div key={index}>
          <h3>{item.name.toUpperCase().replace('-', ' ')}</h3>
          <p><b>Id:</b> {item.id}</p>
          <p><b>Region:</b> {item.region ? item.region.name : 'Desconocida'}</p>
        </div>
      );
    }
  };
  return (
    <section className="app">
      <article className="app__card">
        <h1 className="app__card__title">Pokedex</h1>
        <form className="app__card__form" onSubmit={buscarEnPokedex}>
          <label htmlFor="guy">Tipo de busqueda</label>
          <select value={tipo} onChange={(e) => setTipo(e.target.value)} className="app__card__input" id="guy">
            <option value="pokemon">Pokemon</option>
            <option value="item">Objeto</option>
            <option value="location">Ubicacion</option>
          </select>
          <label htmlFor="search">ID</label>
          <input className="app__card__input" type='number' id="search" value={busqueda}onChange={(e) => setBusqueda(e.target.value)} placeholder="Pokemon ID..." />
          <button className="app__card__button" type="submit">Consultar</button>
        </form>
      </article>
      <article className="app__results">
        {resultados.length > 0 && (
          <div>
            {resultados.map((item, index) => renderTarjeta(item, index))}
          </div>
        )}
      </article>
    </section>
  );
}
