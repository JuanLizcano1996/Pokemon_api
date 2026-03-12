const contenedor = document.getElementById("lista");

const coloresTipo = {// esto unicamente lo hice para el color de las cards no pude hacerlo en css
fire:"#F08030",
water:"#6890F0",
grass:"#78C850",
electric:"#F8D030",
poison:"#A040A0",
bug:"#A8B820",
flying:"#A890F0",
normal:"#A8A878",
ground:"#E0C068",
rock:"#B8A038",
psychic:"#F85888",
ice:"#98D8D8",
ghost:"#705898",
steel:"#B8B8D0",
fairy:"#EE99AC",
fighting:"#C03028",
dragon:"#7038F8",
};

async function obtenerKanto() {
  try {

    const response = await fetch("https://pokeapi.co/api/v2/generation/1");//traemos la api 
    const data = await response.json();

    data.pokemon_species.sort((a, b) => {
      const idA = a.url.split("/")[6];
      const idB = b.url.split("/")[6];
      return idA - idB;
    });

    for (const poke of data.pokemon_species) {//un for of para recorrer cada pokemon de la region kanto

      const urlPartes = poke.url.split("/");//separamos la url del pokemon en partes usando el caracter "/"
      const id = urlPartes[urlPartes.length - 2];//obtenemos el id del pokemon que se encuentra en la penultima posicion del array resultante

      const numero = String(id).padStart(3, "0");//convertimos el id a string y lo rellenamos con ceros a la izquierda hasta tener 3 caracteres, para que se vea uniforme en la lista

      const respuestaPokemon = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);//hacemos una solicitud a la API para obtener los detalles del pokemon usando su id
      const dataPokemon = await respuestaPokemon.json();//convertimos la respuesta a formato JSON para poder acceder a sus propiedades

      const tiposArray = dataPokemon.types.map(t => t.type.name);
      const tipos = tiposArray.join(", ");//obtenemos los tipos del pokemon, mapeamos el array de tipos para obtener solo el nombre de cada tipo y luego los unimos en una cadena separada por comas

      console.log(`#${numero} - ${poke.name} - ${tipos}`);//imprimimos en la consola el numero, nombre y tipos del pokemon para verificar que estamos obteniendo la informacion correctamente

      const card = document.createElement("div");//creamos un elemento div para representar la tarjeta del pokemon
      card.dataset.tipo = tipos; //asignamos el tipo del pokemon como un atributo de datos al elemento card para poder usarlo posteriormente en la funcionalidad de filtrado
      if(tiposArray.length === 1){
        card.style.background = coloresTipo[tiposArray[0]];
      }else{
        card.style.background = `linear-gradient(135deg, ${coloresTipo[tiposArray[0]]}, ${coloresTipo[tiposArray[1]]})`;//si el pokemon tiene un solo tipo, asignamos el color de fondo correspondiente a ese tipo usando el objeto coloresTipo, si el pokemon tiene dos tipos, creamos un fondo con un degradado lineal que combina los colores de ambos tipos para darle un aspecto visual atractivo a la tarjeta del pokemon

}
      const nombrepoke = document.createElement("p");//creamos un elemento p para mostrar el nombre del pokemon en la tarjeta
      nombrepoke.textContent = `#${numero} - ${poke.name} - ${tipos}`;//asignamos el texto del elemento p con el numero, nombre y tipos del pokemon para mostrarlo en la tarjeta

      const imagen = document.createElement("img");//creamos un elemento img para mostrar la imagen del pokemon en la tarjeta
      imagen.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;//asignamos la fuente de la imagen usando la url de la imagen oficial del pokemon, que se encuentra en el repositorio de sprites de la API de Pokemon

      card.appendChild(nombrepoke);//agregamos el elemento p con el nombre del pokemon a la tarjeta
      card.appendChild(imagen);//agregamos el elemento img con la imagen del pokemon a la tarjeta

      card.addEventListener("click", () =>{

        const modal = document.getElementById("modalPokemon");
        document.getElementById("nombrePokemon").textContent = poke.name;
        document.getElementById("imagenPokemon").src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`

        document.getElementById("tiposPokemon").textContent = "Tipo: " + tipos;//mostramos los tipos del pokemon en el modal
        
        const stats=dataPokemon.stats
          .map(s=> `${s.stat.name}: ${s.base_stat}`)
          .join("<br>");

          document.getElementById("statsPokemon").innerHTML= stats;//mostramos las estadisticas del pokemon en el modal
          modal.style.display = "flex";//mostramos el modal

        const sonido = new Audio(`https://play.pokemonshowdown.com/audio/cries/${poke.name}.mp3`);
        sonido.play(); //cuando se hace click en la tarjeta, se reproduce el sonido del pokemon
      })
      contenedor.appendChild(card);//agregamos la tarjeta completa al contenedor en el DOM para que se muestre en la pagina

    }

  } catch (error) {//si pasa algun error durante la obtencion de los datos de los pokemon, lo capturamos y mostramos un mensaje de error en la consola para facilitar la correccion del problema
    console.error("Error al obtener pokemon:", error);
  }
}

obtenerKanto();

//Tengo que crear otra funcion para filtrar los pokemon por tipo y agregar un evento y constantes para los botones de filtrado.
function mostrarTipo(tipo){//esta funcion se encarga de mostrar los pokemon que coincidan con el tipo seleccionado en el filtro, recibe como parametro el tipo que se desea mostrar

const pokedex = document.getElementById("lista");//obtenemos el contenedor donde se van a mostrar los pokemon


pokedex.style.display = "grid"; // vuelve a mostrar los pokemon


const cards = document.querySelectorAll("#lista div");//obtenemos todas las tarjetas de pokemon que se encuentran dentro del contenedor con id "lista" para poder iterar sobre ellas y mostrar u ocultar segun el tipo seleccionado

cards.forEach(card => {//iteramos sobre cada tarjeta de pokemon para verificar si su tipo coincide con el tipo seleccionado en el filtro

if(tipo === "all"){//si el tipo seleccionado es "all", mostramos todas las tarjetas de pokemon sin importar su tipo, ya que el filtro "all" se utiliza para mostrar todos los pokemon sin aplicar ningun filtro de tipo
card.style.display = "block";//mostramos la tarjeta del pokemon estableciendo su propiedad display a "block", lo que hace que se muestre en la pagina
return;//salimos de la funcion para evitar que se ejecute el resto del codigo, ya que no es necesario verificar el tipo de cada tarjeta si el filtro seleccionado es "all"
}

if(card.dataset.tipo.includes(tipo)){//si el tipo de la tarjeta del pokemon incluye el tipo seleccionado en el filtro, mostramos la tarjeta del pokemon estableciendo su propiedad display a "block", lo que hace que se muestre en la pagina
card.style.display = "block";
}else{//si el tipo de la tarjeta del pokemon no incluye el tipo seleccionado en el filtro, ocultamos la tarjeta del pokemon estableciendo su propiedad display a "none", lo que hace que se oculte en la pagina
card.style.display = "none";
}



});

}
document.getElementById("cerrarModal").addEventListener("click", () => {//cuando se haga click en el boton con el id "cerrarModal", se ejecutara la funcion que ocultara el modal

document.getElementById("modalPokemon").style.display = "none";//establecemos la propiedad display del elemento con el id "modalPokemon" a "none", lo que hace que se oculte el modal

});
const musica = document.getElementById("musicaKanto");//obtenemos el elemento con el id "musicaKanto" y lo guardamos en la variable musica
const boton = document.getElementById("botonMusica");//obtenemos el elemento con el id "botonMusica" y lo guardamos en la variable boton

boton.addEventListener("click", () => {//cuando se haga click en el boton, se ejecutara la funcion que cambiara el estado de la musica
if(musica.paused){
    musica.play();
    boton.textContent = "Pausar Música";
}else{
    musica.pause();
    boton.textContent = "Reproducir Música";
}

});