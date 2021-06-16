// inicializamos la conexion
const socket = io.connect();

//Se renderiza la tabla utilizando una template de Handlebars
let renderTabla = Handlebars.compile(`<style>
.table td, .table th {
    vertical-align: middle;
}
h1 {
    color: blue;
}
hr {
    background-color: #ddd;
}
.jumbotron {
    min-height: 100vh;
}
</style>

<div class="jumbotron">
<h1>Vista de Productos</h1>
<br>

{{#if hayProductos}} 
    <div class="table-responsive">
        <table class="table table-dark">
            <tr> <th>Nombre</th> <th>Precio</th> <th>Foto</th></tr>
            {{#each productos}}
                <tr> <td>{{this.title}}</td> <td>{{this.price}}</td> <td><img width="50" src={{this.thumbnail}} alt="not found"></td> </tr>
            {{/each}}
        </table>
    </div>
{{else}}  
    <h3 class="alert alert-warning">No se encontraron productos</h3>
{{/if}}
</div>`);

//Recibo el evento content desde el server con los datos de los productos.
socket.on('content', ({hayProductos, productos}) => {
    console.log("Detecto un mensaje entrante desde el server!");
    let contenido = renderTabla({hayProductos, productos}); //Completamos los datos de la tabla con los datos recibidos desde el server
    document.querySelector("#tablaDinamica").innerHTML = contenido;
});

//Por cada submit se hace un evento
document.querySelector('form').addEventListener('submit', (e)=>{
    e.preventDefault(); //Prevenimos la recarga

    //Captura de datos
    const nombre = document.querySelector("#name").value;
    const price = document.querySelector("#price").value;
    const thumb = document.querySelector("#thumb").value;
    objeto = {title: nombre, price: price, thumbnail: thumb};

    //Configuración de mi JSON para enviarlo a la ruta correspondiente utilizando fetch
    //Hay que configurar el content-type del tipo json, sino no lo toma el server.
    fetch('/api/productos/guardar',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(objeto)
    })
    .then (()=> socket.emit("contentSent")) //Una vez hecho el post lo emitimos al server
    .catch((e)=> console.log("Ooops, error: ", e)); //Catch errors
})

socket.on('messages', (data)=> {
    console.log(data);
    render(data);
})

function render(data) {
    var html = data.map((elem, index) => {
        return (`<div>
            <strong class='fw-bold text-primary' >${elem.author}</strong>
            <span class='text-warning'>[${elem.date}]</span>
            <em class= 'fst-italic text-success'>${elem.text}</em>
            </div>
        `);
    }).join(" ");

    // inyecta el html en el elemento con id messages
    document.getElementById("messages").innerHTML = html;
}

document.querySelector('#formulario').addEventListener('submit', (e)=>{
    e.preventDefault();
    fecha = (new Date()).toLocaleString();
    // crea un mensaje y lo emite para ser enviado al servidor
    var mensaje = {
        author: document.getElementById('username').value,
        text: document.getElementById('texto').value,
        date: fecha
    };
    console.log(mensaje);
    socket.emit('new-message', mensaje);
    document.getElementById('texto').value = '';
    document.getElementById('texto').focus();
    return false;
})