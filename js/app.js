const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');
const paginacionDiv = document.querySelector('#paginacion');

const resgistrosPagina = 40;
let totalPaginas;
let iterador;
let paginasActual = 1;


window.onload = ()=>{
    formulario.addEventListener('submit',validarFormualario)


}



function validarFormualario(e){
    e.preventDefault();

    const termino= document.querySelector('#termino').value;

    if(termino===""){
        imprimirMensaje('Agrega un termino de busqueda');
        return;
    }

    buscarImagenes();

}


function imprimirMensaje(mensaje){

    const existeAlerta = document.querySelector('.bg-red-100')

    if(!existeAlerta){

        const alerta = document.createElement('p');
   alerta.classList.add('bg-red-100','border-red-400','text-red-700','px-4','py-3','rounded','max-w-lg','max-auto','mt-6','text-center');

   alerta.innerHTML = `
   
   <strong class="font-bold" >Error!</strong>
    <span class="block sm:inline"> ${mensaje}</span>

   `

   formulario.appendChild(alerta)

   setTimeout(()=>{
        alerta.remove();
   },3000)
    }
   
}


function buscarImagenes (){
    const termino= document.querySelector('#termino').value;
    key = "19399336-8dce5a72ed2c1c3ad41844b53";
    url = `https://pixabay.com/api/?key=${key}&q=${termino}&per_page=${resgistrosPagina}&page=${paginasActual}`;

   fetch(url)
        .then(respuesta=> respuesta.json())
        .then(resultado=> {
            totalPaginas = calcularPaginas(resultado.totalHits);
            console.log(totalPaginas)
            mostrarImagenes(resultado.hits)
            
        })
}


function mostrarImagenes (imagenes){

    console.log(imagenes)

    while(resultado.firstChild){

        resultado.removeChild(resultado.firstChild)
    }

    //ITERAR SOBRE EL ARREGLO DE IMEGENES Y GENERAR EL HTML

    imagenes.forEach( imagen => {
            const {previewURL,likes,views,largeImageURL} = imagen;

            resultado.innerHTML+= `
            <div class="w-1/2 md:w-1/3 lg:w-1/4 p-3 mb-4">
                <div class="bg-white" >
                     <img class="w-full" src="${previewURL}" >
                     <div class="p-4">
                            <p class="font-bold"> ${likes} <span class="font-light">Me gustas</span></p>
                            <p class="font-bold"> ${views} <span class="font-light">Veces Vistas</span></p>
                            <a  class="block w-full bg-blue-800 hover:bg-blue-500 text-white uppercase font-bold text-center rounded mt-5 p-1"
                                href="${largeImageURL}" target="_blank" rel="noopener noreferrer">
                            Ver Imagen </a>
                     </div>
                </div>
            </div>
            `;
        
        
    });
    
    while(paginacionDiv.firstChild){
        paginacionDiv.removeChild(paginacionDiv.firstChild);
    }

    imprimirPaginador()
}


function calcularPaginas (total){
    return parseInt( Math.ceil(total/resgistrosPagina));
}

function * crearPaginador(total){
    for(let i = 1;i<=total;i++){
        yield i;
    }

}

function imprimirPaginador(){
    iterador =crearPaginador(totalPaginas);

    while(true){
        const {value,done}= iterador.next();
        if(done) return;

        //en caso contrario genera un boton por cada elemento en el generador

        const boton = document.createElement('a');
        boton.href = '#';
        boton.dataset.pagina = value;
        boton.textContent= value;
        boton.classList.add('siguiente','mb-4','bg-yellow-800','px-4','py-1','mr-2','font-bold','uppercase','roundend')
        boton.onclick=()=>{
            paginasActual=value;

            buscarImagenes()
            console.log(paginasActual)
        }
        paginacionDiv.appendChild(boton)
    }
}