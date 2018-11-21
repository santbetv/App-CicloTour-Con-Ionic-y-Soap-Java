import { AlertController } from 'ionic-angular';
import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ProductServicesProvider } from "../../providers/product-services/product-services";
import { NewMunicipioPage } from "../new-municipio/new-municipio";
import { EditarMunicipioPage } from "../editar-municipio/editar-municipio";
import { MenuPage } from '../menu/menu';
import { WsProvider } from "../../providers/ws/ws";
import { Refresher } from "ionic-angular"
import { MUNICIPIOS } from "../../data/data.municipios";
import { Municipio } from "../../interfaces/municipio.interface"

let urlWSJava = "http://109.74.193.109:8080/grafociclotour/";//pagina 500
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage implements OnInit {

  basepathjava = "/wsciclotour";
  activeM: string;
  token: String;
  municipios: string[];
  municipiosCopia: string[];
  newMunicipios: Municipio[] = [];
  newListaMuni: string[];
  //////////////////////////////////
  listaDeVerticesArray: string[];
  listaDeAristasArray: string[];
  listaDeRutaCortaArray: string[];
  //////////////////////////////////
  testRadioOpen = false;
  resultadoOrigen = 0;
  testCheckboxOpen = false;
  resultadoDestino = 0;


  constructor(public navCtrl: NavController, private navParams: NavParams,
    public productServices: ProductServicesProvider, public alertCtrl: AlertController,
    public ws: WsProvider) {//navControler encargado 
    //alert(navParams.get('token'));
    this.token = navParams.get('token');
    this.newMunicipios = MUNICIPIOS.slice(0);
  }

  ngOnInit() {//Metodo que inicializa los datos
    this.getMunicipios();
  }

  newMunicipio() {//Indicando que se lleve el token para la otra pagina y que pueda ingresar
    this.navCtrl.push(NewMunicipioPage, {
      token: this.token
    });
  }

  irMenu() {//Indicando que se lleve el token para la otra pagina y que pueda ingresar
    this.navCtrl.setRoot(MenuPage, {
      token: this.token
    });
  }

  goBack(): void {
    this.navCtrl.pop();
  }

  getMunicipios() {
    this.productServices.getMunicipio(this.token).then((pdct) => {
      let respuesta = JSON.parse(pdct["_body"]);
      this.municipios = respuesta.municipios;
    }).catch((err) => {
      console.log(err);
    })
  }

  getMunicipiosNew(refresher: Refresher) {//RE nuevo
    this.productServices.getMunicipio(this.token).then((pdct) => {
      let respuesta = JSON.parse(pdct["_body"]);
      console.log("Inicio del refresh");
      setTimeout(() => {
        this.listarVertices();
        console.log("Terminó el refresh");
        this.municipios = respuesta.municipios;
        refresher.complete();
      }, 1500)
    }).catch((err) => {
      console.log(err);
    })
  }

  recargar_municipios(refresher: Refresher) {
    console.log("Inicio del refresh");
    setTimeout(() => {
      console.log("Terminó el refresh");
      this.newMunicipios = MUNICIPIOS.slice(0);
      refresher.complete();
    }, 2000)
  }

  borrar_municipio(idx: number) { //nuevo metodo para eliminaruno por uno desde mi array
    this.newMunicipios.splice(idx, 1);
  }

  deleteMunicipio(id) {
    console.log("Prueba de dato seleccionado" + id);
    this.productServices.deleteMunicipio(this.token, id).then((pdct) => {
      this.getMunicipios();
    }).catch((err) => {
      console.log(err);
    })
  }

  editarMunicipio(id) {//Nuevo metodo para editar
    console.log("Id a editar" + id);
    this.productServices.buscarId(id);
    this.ws.buscarId(id);
    this.navCtrl.push(EditarMunicipioPage, {
      token: this.token,
    });
  }



  listarVertices() {
    var obj2 = [{}];
    var guardarVerices = new Array();
    let j = 0;
    this.ws.getListaDeVertices('listarVertices')
      .then((respuesta) => {
        console.log("Segunda Prueba");
        obj2 = respuesta["S:Envelope"]["S:Body"]["ns2:listarVerticesResponse"].return;
        for (let index = 0; index < obj2.length; index++) {
          guardarVerices[j] = obj2[index]["codigo"] + "," + "  Municipio: " + obj2[index]["dato"]["nombre"];
          console.log(obj2[index]["dato"]["nombre"]);
          j++;
        }
        this.listaDeVerticesArray = guardarVerices;
      }).catch((err) => {
        console.log("Fallo: " + err);
      })
  }

  listarAristas() {
    var obj2 = [{}];
    var guardarArista = new Array();
    let j = 0;
    this.ws.getListaDeAristas('listarAristas')
      .then((respuesta) => {
        obj2 = respuesta["S:Envelope"]["S:Body"]["ns2:listarAristasResponse"].return;
        for (let index = 0; index < obj2.length; index++) {
          guardarArista[j] = "Destino: " + obj2[index]["destino"] + " Origen: " + obj2[index]["origen"] + " Peso: " + obj2[index]["peso"];
          //this.listaDeAristasArray = obj2[index]["dato"]["nombre"];
          console.log(obj2[index]["destino"]);
          j++;
        }
        this.listaDeAristasArray = guardarArista;
      }).catch((err) => {
        console.log("Fallo: " + err);
      })
  }

  limpiarLidstaDeMunicipios() {
    this.listaDeVerticesArray = null;
    this.listaDeAristasArray = null;
  }

  borrarVertice(id: String) {
    let alert = this.alertCtrl.create({
      title: 'Validando',
      message: 'Esta seguro que desea Eliminar el vertice!!!',
      buttons: [
        {
          text: 'Si',
          handler: () => {
            let indice = id.split(',');
            console.log(indice[0]);
            if (this.listaDeVerticesArray != null) {
              this.ws.borrarVertice('borrarVertice', indice[0])
                .then((respuesta) => {
                  this.mensajesDeUsuario("Vertice Eliminado");
                }).catch((err) => {
                  this.mensajesDeUsuario("Fallo: " + err);
                })
            } else {
              this.mensajesDeUsuario("Consulte primero la lista de vertices.");
            }
          }
        },
        {
          text: 'No',
          handler: () => {
            this.mensajesDeUsuario("Eliminación cancelada...")
          }
        }
      ]
    });
    alert.present();
  }

  editarVertice(id: String) {
    let indice = id.split(',');
    this.ws.buscarId(indice[0]);
    this.navCtrl.push(EditarMunicipioPage, {
      token: this.token,
    });
  }

  mensajesDeUsuario(dato: string) {//Nuevo metodo de validar mensajes
    let alert = this.alertCtrl.create({
      title: 'Mensaje',
      subTitle: dato,
      buttons: ['Ok']
    });

    alert.present();
  }


  municipioOrigen() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', `${this.basepathjava}/grafociclotour/`, true);
    xhr.setRequestHeader("Content-Type", "text/xml");
    let protocoloHttp = 0;
    xhr.onload = () => {
      if (xhr.readyState == 4) {
        protocoloHttp = xhr.status;
        if (protocoloHttp < 500) {
          if (protocoloHttp >= 400 && protocoloHttp <= 499) {
            this.mensajesDeUsuario("Pagina no encontrada");
            console.log("Pagina no encontrada");
          } else {
            console.log("Servidor ok");
            let alert = this.alertCtrl.create();
            alert.setTitle('Lista Origen');
            var obj2 = [{}];
            this.ws.getListaDeVertices('listarVertices')
              .then((respuesta) => {
                obj2 = respuesta["S:Envelope"]["S:Body"]["ns2:listarVerticesResponse"].return;
                for (let index = 0; index < obj2.length; index++) {
                  alert.addInput({
                    type: 'radio',
                    label: "  Municipio: " + obj2[index]["dato"]["nombre"],
                    value: "" + obj2[index]["codigo"]
                    //checked: true
                  });
                }
                alert.addButton('Cancel');
                alert.addButton({
                  text: 'Ok',
                  handler: (data: any) => {
                    console.log('Origen data:', data);
                    this.testRadioOpen = false;
                    this.resultadoOrigen = data;
                  }
                });
                alert.present();
              }).catch((err) => {
                console.log("Fallo: " + err);
              })
          }
        } else {
          this.mensajesDeUsuario("Error en servidor");
          console.log("Error en servidor");
        }
      }
    }
    xhr.send(null);
  }

  municipioDestino() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', `${this.basepathjava}/grafociclotour/`, true);
    xhr.setRequestHeader("Content-Type", "text/xml");
    let protocoloHttp = 0;
    xhr.onload = () => {
      if (xhr.readyState == 4) {
        protocoloHttp = xhr.status;
        if (protocoloHttp < 500) {
          if (protocoloHttp >= 400 && protocoloHttp <= 499) {
            this.mensajesDeUsuario("Pagina no encontrada");
            console.log("Pagina no encontrada");
          } else {
            console.log("Servidor ok");
            let alert = this.alertCtrl.create();
            alert.setTitle('Lista Destino');
            var obj2 = [{}];
            this.ws.getListaDeVertices('listarVertices')
              .then((respuesta) => {
                obj2 = respuesta["S:Envelope"]["S:Body"]["ns2:listarVerticesResponse"].return;
                for (let index = 0; index < obj2.length; index++) {
                  alert.addInput({
                    type: 'radio',
                    label: "  Municipio: " + obj2[index]["dato"]["nombre"],
                    value: "" + obj2[index]["codigo"]
                    //checked: true
                  });
                }
                alert.addButton('Cancel');
                alert.addButton({
                  text: 'Ok',
                  handler: (data: any) => {
                    console.log('Destino data:', data);
                    this.testRadioOpen = false;
                    this.resultadoDestino = data;
                  }
                });
                alert.present();
              }).catch((err) => {
                console.log("Fallo: " + err);
              })
          }
        } else {
          this.mensajesDeUsuario("Error en servidor");
          console.log("Error en servidor");
        }
      }
    }
    xhr.send(null);

  }


  calcularRutaCorta() {//Nuevo metodo mejorado para calcular la ruta mas corta
    var xhr = new XMLHttpRequest();
    xhr.open('GET', `${this.basepathjava}/grafociclotour/`, true);
    xhr.setRequestHeader("Content-Type", "text/xml");
    let protocoloHttp = 0;
    xhr.onload = () => {
      if (xhr.readyState == 4) {
        protocoloHttp = xhr.status;
        if (protocoloHttp < 500) {
          if (protocoloHttp >= 400 && protocoloHttp <= 499) {
            this.mensajesDeUsuario("Pagina no encontrada");
            console.log("Pagina no encontrada");
          } else {
            console.log("Servidor ok");
            if (this.resultadoDestino === 0) {
              this.mensajesDeUsuario("Seleccione Destino");
            } else {
              if (this.resultadoOrigen === 0) {
                this.mensajesDeUsuario("Seleccione Origen");
              } else {
                var obj2 = [{}];
                var guardarRutaCorta = new Array();
                let j = 0;
                if (this.resultadoOrigen === this.resultadoDestino) {
                  this.mensajesDeUsuario("Origen y Destino no pueden ser iguales");
                } else {
                  this.ws.rutaCorta('obtenerRutaMasCortaXCodigoRecursiva', this.resultadoOrigen, this.resultadoDestino)
                    .then((respuesta) => {
                      console.log(respuesta);
                      obj2 = respuesta["S:Envelope"]["S:Body"]["ns2:obtenerRutaMasCortaXCodigoRecursivaResponse"].return;
                      for (let index = 0; index < obj2.length; index++) {
                        guardarRutaCorta[j] = obj2[index]["codigo"] + "," + "  Municipio: " + obj2[index]["dato"]["nombre"];
                        console.log(obj2[index]["dato"]["nombre"]);
                        j++;
                      }
                      this.listaDeRutaCortaArray = guardarRutaCorta;
                    }).catch((err) => {
                      console.log("Fallo: " + err);
                    })
                }
              }
            }
          }
        } else {
          this.mensajesDeUsuario("Error en servidor");
          console.log("Error en servidor");
        }
      }
    }
    xhr.send(null);
  }
}