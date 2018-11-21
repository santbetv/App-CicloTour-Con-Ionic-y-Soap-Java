import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ProductServicesProvider } from '../../providers/product-services/product-services';
import { HomePage } from '../home/home';
import { MenuPage } from '../menu/menu';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WsProvider } from '../../providers/ws/ws';

@IonicPage()
@Component({
  selector: 'page-editar-peso-arista',
  templateUrl: 'editar-peso-arista.html',
})
export class EditarPesoAristaPage {

  basepathjava = "/wsciclotour";
  token: String;
  form;
  testRadioOpen = false;
  resultadoOrigen = 0;
  testCheckboxOpen = false;
  resultadoDestino = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public productServices: ProductServicesProvider,
    public alertCtrl: AlertController,
    public ws: WsProvider) {
    this.token = navParams.get('token');


    this.form = new FormGroup({
      nuevoPeso: new FormControl("", Validators.required)
    });
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
                    label: "" + obj2[index]["codigo"] + ", Municipio: " + obj2[index]["dato"]["nombre"],
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
                    label: "" + obj2[index]["codigo"] + ", Municipio: " + obj2[index]["dato"]["nombre"],
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

  editarPesoRuta() {
    let postParams = {
      nuevoPeso: this.form.value.nuevoPeso
    }

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
            //this.mensajesDeUsuario("" + this.resultadoDestino);
            if (this.resultadoDestino === 0) {
              this.mensajesDeUsuario("Seleccione Destino");
            } else {
              if (this.resultadoOrigen === 0) {
                this.mensajesDeUsuario("Seleccione Origen");
              } else {
                if (postParams.nuevoPeso === "") {
                  this.mensajesDeUsuario("Ingrese peso");
                } else {
                  if (postParams.nuevoPeso > 0) {
                    this.ws.editarPesoArista('editarPesoArista', this.resultadoOrigen, this.resultadoDestino, postParams.nuevoPeso)
                      .then((respuesta) => {
                        //console.log(respuesta);
                        this.mensajesDeUsuario(respuesta["S:Envelope"]["S:Body"]["ns2:editarPesoAristaResponse"].return + " En aplicacion Java");
                        this.navCtrl.setRoot(MenuPage, {
                          token: this.token
                        })
                      }).catch((err) => {
                        this.mensajesDeUsuario("Fallo: " + err);
                      })
                  } else {
                    this.mensajesDeUsuario("Se requiere datos numericos > 0");
                  }
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

  mensajesDeUsuario(dato: string) {//Nuevo metodo de validar mensajes
    let alert = this.alertCtrl.create({
      title: 'Mensaje',
      subTitle: dato,
      buttons: ['Ok']
    });

    alert.present();
  }


}
