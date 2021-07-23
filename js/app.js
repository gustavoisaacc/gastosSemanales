//variable
const formulario = document.querySelector('#agregar-gasto');
const listGasto = document.querySelector('#gastos ul');


//Evento
eventListener();
function eventListener (){
  document.addEventListener('DOMContentLoaded', ingresarPresupuesto);
  formulario.addEventListener('submit', agregarGastos);
}

//Clases
class Presupestos {
  constructor(presupuesto){
    this.presupuesto = Number(presupuesto)
    this.saldo = Number(presupuesto)
    this.gastos = [];
  
  }

  newGasto (gasto){

    this.gastos = [...this.gastos, gasto];
    this.calcularGasto()
  }

  calcularGasto (){
    const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
    this.saldo = this.presupuesto - gastado;
  }

  eliminarGasto(id){
    this.gastos = this.gastos.filter(gasto=> gasto.id !== id);
    this.calcularGasto()

  }
}

class UI {
  insertarPresupuesto (cantidad){
    const {presupuesto, saldo} = cantidad
    document.querySelector('#total').textContent = presupuesto;
    document.querySelector('#restante').textContent = saldo;
  }

  imprimirMensaje(mensaje, tipo){
    const divAlerta = document.createElement ('div');
    divAlerta.classList.add('text-center', 'alert')

    if(tipo === 'error'){
      divAlerta.classList.add('alert-danger');
    }else{
      divAlerta.classList.add('alert-success');
    }

    divAlerta.textContent = mensaje;

    //insertamos mensjae en el html
    document.querySelector('.primario').insertBefore(divAlerta, formulario)

    setTimeout(()=> {
      divAlerta.remove()
    },3000)
  }

  listarGastoUsuario(gastos) {
    //limpiar html y volver a listar 
    this. limpiarHTML();
    gastos.forEach((gasto) =>{
      const {nombre, cantidad, id} = gasto
      //creamos un li
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      // li.setAttribute('data-id', id);
      li.dataset.id = id; //nueva forma de insertar 
      
      //agregamos al html
      li.innerHTML = `${nombre} <span class="badge badge-primary badge-pill">$ ${cantidad}</span>`

      //boton para borrar al gasto
      const btnBorrar = document.createElement('button');
      btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
      btnBorrar.textContent = 'Borrar';

      btnBorrar.onclick = ()=>{
        eliminarGasto(id);
      }

      li.appendChild(btnBorrar);
    
      //insertar html
      listGasto.appendChild(li)
    })
  
    
  }

  actualizarGasto(saldo){
    document.querySelector('#restante').textContent = saldo;
    
  }

  comprobarPresupuesto (presupuestoObj){
    const {presupuesto, saldo} = presupuestoObj;
    const restante = document.querySelector('.restante')
    if((presupuesto / 4) > saldo ){
      restante.classList.remove('alert-success', 'alert-warning')
      restante.classList.add('alert-danger')
    }else if ((presupuesto / 2) > saldo){
      restante.classList.remove('alert-success')
      restante.classList.add('alert-warning')
    }else{
      restante.classList.remove('alert-danger','alert-warning')
      restante.classList.add('alert-success')
    }


    if(saldo <=0){
      ui.imprimirMensaje('Su saldo es insuficiente para realizar esta operacion', 'error');

      formulario.querySelector('button[type="submit"]').disabled = true;
    }
  }

  limpiarHTML() {
    while(listGasto.firstChild) {
        listGasto.removeChild(listGasto.firstChild);
    }
}


}





//Instancia
const ui = new UI ();
let presupuesto;


//funciones

function ingresarPresupuesto (){
  const presupuestoUsuario = Number(prompt('Ingrese un presupuesto'));

  if(presupuestoUsuario  <= 0 || isNaN(presupuestoUsuario) || presupuestoUsuario === null){
    window.location.reload();
  }

  //obteniendo presupuesto
  presupuesto = new Presupestos(presupuestoUsuario);
 
  ui.insertarPresupuesto(presupuesto);
}

// leer los campos del formulario
function agregarGastos (e){
  e.preventDefault();
  const nombre = document.querySelector('#gasto').value;
  const cantidad = Number(document.querySelector('#cantidad').value);
  
  if(nombre === '' || cantidad === ''){
    ui.imprimirMensaje('Todos los campos son obligatorios', 'error')
    return;

  }else if(cantidad <= 0 || isNaN(cantidad)){
    ui.imprimirMensaje('Cantidad no valida', 'error')
    return;
  }

  //crea un objeto con los gastos del usuario
  const gasto = {nombre, cantidad, id: Date.now()}

  //genera un areglo de obteos con los gastos
  presupuesto.newGasto(gasto)

  //confirma con unmensaje al enlistar los gastos
  ui.imprimirMensaje('Correcto');

  //ingresar listado de gastos
  const {gastos, saldo} = presupuesto;

  ui.listarGastoUsuario(gastos);

  ui.actualizarGasto(saldo)
  ui.comprobarPresupuesto(presupuesto)
  
  formulario.reset();

}

function eliminarGasto (id){
  presupuesto.eliminarGasto(id);

  const {gastos, saldo} = presupuesto
  ui.listarGastoUsuario(gastos)
  ui.actualizarGasto(saldo)
  ui.comprobarPresupuesto(presupuesto)
}