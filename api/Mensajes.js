const fs = require('fs');

class Mensajes {
    constructor(){
        this.mensajes = [];
    }

    leerMensajes(){
        try{
            let contenido = fs.readFileSync( __dirname + '/log.txt', 'utf-8');
            if (contenido) {
                this.mensajes = JSON.parse(contenido);
                return this.mensajes;
            }else { throw new Error("No content or no such file!") }
        }
        catch (e) {
            console.log("Entro a error!")
            let fecha = (new Date()).toLocaleString();
            let defaultMensaje = { author: 'Admin', text: 'Desafío chat global y vista de productos utilizando WebSocket en NodeJS', date: fecha}
            this.mensajes.push(defaultMensaje);
            fs.appendFileSync(__dirname + '/log.txt', JSON.stringify(this.mensajes, null, '\t'))
            return this.mensajes;
        }
    }

    guardarMensajes(mensaje){
        console.log("Entro a guardar");
        console.log(mensaje);
        this.mensajes.push(mensaje);
        fs.writeFileSync(__dirname + "/log.txt", JSON.stringify(this.mensajes, null, '\t'));
    }
}

module.exports = Mensajes;