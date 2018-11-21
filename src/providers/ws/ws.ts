import { url } from 'inspector';
import { StatusBar } from '@ionic-native/status-bar';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import xml2js from 'xml2js';
import 'rxjs/add/operator/map';
import { NavController, ToastController } from 'ionic-angular';
import { LoadingController } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { AlertController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import { HttpClient } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/do';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';

///////////////////////////////7let testUrl = "http://localhost:8080/grafociclotour/WsGrafoCicloTour?WSDL";
let testUrl = "http://109.74.193.109:8080/grafociclotour/WsGrafoCicloTour?WSDL";
var xhr = new XMLHttpRequest();
var obj = [{}];
@Injectable()
export class WsProvider {

  basepath = "/restheroku";
  basepathjava = "/wsciclotour";
  loading;
  idBuscado: any;

  constructor(public http: Http, public loadingCtrl: LoadingController, public network: Network, public alertCtrl: AlertController,
    public toast: ToastController, public platform: Platform) {
    console.log('Hello WsProvider Provider Santiago');
    /* if (this.network.type == "unknown" || this.network.type == "none" || this.network.type == undefined) {
      this.mensajesDeUsuario("No hay conectividad...");
    } else {
      this.mensajesDeUsuario("El internet esta Conectado ok...");
    }
    this.loading = this.loadingCtrl.create({
      content: 'Espere porfavor...',
    }) */
    if (this.platform.is("cordova")) {
      this.basepath = "https://ciclotour-2018.herokuapp.com/";
    }
  }

  validarServicioJavaEE() {
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
            console.log("Ok 200");
          }
        } else {
          this.mensajesDeUsuario("Error en servidor");
          console.log("Error en servidor");
        }
      }
    }
    xhr.send(null);
  }

  public getListaDeVertices(url) {
    return new Promise((resolve, reject) => {
      var soapMessage = null;
      soapMessage = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://servicios.grafociclotour/">';
      //soapMessage = soapMessage + '<soapenv:Header/>';
      soapMessage = soapMessage + '<soapenv:Body>';
      soapMessage = soapMessage + '<ser:' + url + '/>';
      soapMessage = soapMessage + '</soapenv:Body>';
      soapMessage = soapMessage + '</soapenv:Envelope>';
      xhr.open("POST", testUrl, true);
      xhr.setRequestHeader("Content-Type", "text/xml");
      let res;
      xhr.onload = () => { // Call a function when the state changes.
        if (xhr.readyState === xhr.DONE && xhr.status === 200) {
          xml2js.parseString(xhr.responseText, { explicitArray: false }, (error, result) => {
            if (error) {
              //throw new Error(error); 
              reject(xhr.statusText);
            } else {
              res = result;
              resolve(result);
              obj = res;
              console.log("Primera prueba");
              //console.log(obj["S:Envelope"]["S:Body"]["ns2:listarVerticesResponse"].return);
              /*var obj2 = [{}];
              obj2 = obj["S:Envelope"]["S:Body"]["ns2:listarVerticesResponse"].return;
              for (let index = 0; index < obj2.length; index++) {
                console.log(obj2[index]["dato"]["nombre"]);
              } */
            }
          });
        }
      }
      xhr.onerror = () => {
        reject(xhr.statusText);
      }
      xhr.send(soapMessage);
    });
  }

  public getListaDeAristas(url) {
    return new Promise((resolve, reject) => {
      var soapMessage = null;
      soapMessage = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://servicios.grafociclotour/">';
      //soapMessage = soapMessage + '<soapenv:Header/>';
      soapMessage = soapMessage + '<soapenv:Body>';
      soapMessage = soapMessage + '<ser:' + url + '/>';
      soapMessage = soapMessage + '</soapenv:Body>';
      soapMessage = soapMessage + '</soapenv:Envelope>';
      xhr.open("POST", testUrl, true);
      xhr.setRequestHeader("Content-Type", "text/xml");
      let res;
      xhr.onload = () => { // Call a function when the state changes.
        if (xhr.readyState === xhr.DONE && xhr.status === 200) {
          xml2js.parseString(xhr.responseText, { explicitArray: false }, (error, result) => {
            if (error) {
              //throw new Error(error); 
              reject(xhr.statusText);
            } else {
              res = result;
              resolve(result);
              obj = res;
              console.log("Primera prueba");
              console.log(obj["S:Envelope"]["S:Body"]["ns2:listarAristasResponse"].return);
              /*var obj2 = [{}];
              obj2 = obj["S:Envelope"]["S:Body"]["ns2:listarVerticesResponse"].return;
              for (let index = 0; index < obj2.length; index++) {
                console.log(obj2[index]["dato"]["nombre"]);
              } */
            }
          });
        }
      }
      xhr.onerror = () => {
        reject(xhr.statusText);
      }
      xhr.send(soapMessage);
    });
  }

  public borrarVertice(url, vertice) {
    return new Promise((resolve, reject) => {
      var soapMessage = null;
      soapMessage = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://servicios.grafociclotour/">';
      //soapMessage = soapMessage + '<soapenv:Header/>';
      soapMessage = soapMessage + '<soapenv:Body>';
      soapMessage = soapMessage + '<ser:' + url + '>';
      soapMessage = soapMessage + '<borarVerice>' + vertice + '</borarVerice>';
      soapMessage = soapMessage + '</ser:' + url + '>';
      soapMessage = soapMessage + '</soapenv:Body>';
      soapMessage = soapMessage + '</soapenv:Envelope>';
      xhr.open("POST", testUrl, true);
      xhr.setRequestHeader("Content-Type", "text/xml");
      let res;
      xhr.onload = () => { // Call a function when the state changes.
        if (xhr.readyState === xhr.DONE && xhr.status === 200) {
          xml2js.parseString(xhr.responseText, { explicitArray: false }, (error, result) => {
            if (error) {
              //throw new Error(error); 
              reject(xhr.statusText);
            } else {
              res = result;
              resolve(result);
              /*obj = res;
              console.log("Primera prueba");
              console.log(obj);
              var obj2 = [{}];
              obj2 = obj["S:Envelope"]["S:Body"]["ns2:listarVerticesResponse"].return;
              for (let index = 0; index < obj2.length; index++) {
                console.log(obj2[index]["dato"]["nombre"]);
              } */
            }
          });
        }
      }
      xhr.onerror = () => {
        reject(xhr.statusText);
      }
      xhr.send(soapMessage);
    });
  }


  public buscarId(myId) {
    this.idBuscado = myId;
    console.log("Ingreso asignando id: " + this.idBuscado);
  }

  public editarVertice(url, nombre, posx, posy) {

    return new Promise((resolve, reject) => {
      var soapMessage = null;
      soapMessage = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://servicios.grafociclotour/">';
      soapMessage = soapMessage + '<soapenv:Body>';
      soapMessage = soapMessage + '<ser:' + url + '>';
      soapMessage = soapMessage + '<codigo>' + this.idBuscado + '</codigo>';
      soapMessage = soapMessage + '<nombre>' + nombre + '</nombre>';
      soapMessage = soapMessage + '<posx>' + posx + '</posx>';
      soapMessage = soapMessage + '<posy>' + posy + '</posy>';
      soapMessage = soapMessage + '</ser:' + url + '>';
      soapMessage = soapMessage + '</soapenv:Body>';
      soapMessage = soapMessage + '</soapenv:Envelope>';
      xhr.open("POST", testUrl, true);
      xhr.setRequestHeader("Content-Type", "text/xml");
      let res;
      xhr.onload = () => { // Call a function when the state changes.
        if (xhr.readyState === xhr.DONE && xhr.status === 200) {
          xml2js.parseString(xhr.responseText, { explicitArray: false }, (error, result) => {
            if (error) {
              //throw new Error(error); 
              reject(xhr.statusText);
            } else {
              res = result;
              resolve(result);
              /*obj = res;
              console.log("Primera prueba");
              console.log(obj);
              var obj2 = [{}];
              obj2 = obj["S:Envelope"]["S:Body"]["ns2:listarVerticesResponse"].return;
              for (let index = 0; index < obj2.length; index++) {
                console.log(obj2[index]["dato"]["nombre"]);
              } */
            }
          });
        }
      }
      xhr.onerror = () => {
        reject(xhr.statusText);
      }
      xhr.send(soapMessage);
    });
  }

  public crearVertice(url, nombre, posx, posy) {
    return new Promise((resolve, reject) => {
      var soapMessage = null;
      soapMessage = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://servicios.grafociclotour/">';
      soapMessage = soapMessage + '<soapenv:Body>';
      soapMessage = soapMessage + '<ser:' + url + '>';
      soapMessage = soapMessage + '<nombre>' + nombre + '</nombre>';
      soapMessage = soapMessage + '<posx>' + posx + '</posx>';
      soapMessage = soapMessage + '<posy>' + posy + '</posy>';
      soapMessage = soapMessage + '</ser:' + url + '>';
      soapMessage = soapMessage + '</soapenv:Body>';
      soapMessage = soapMessage + '</soapenv:Envelope>';
      xhr.open("POST", testUrl, true);
      xhr.setRequestHeader("Content-Type", "text/xml");
      let res;
      xhr.onload = () => { // Call a function when the state changes.
        if (xhr.readyState === xhr.DONE && xhr.status === 200) {
          xml2js.parseString(xhr.responseText, { explicitArray: false }, (error, result) => {
            if (error) {
              //throw new Error(error); 
              reject(xhr.statusText);
            } else {
              res = result;
              resolve(result);
              /*obj = res;
              console.log("Primera prueba");
              console.log(obj);
              var obj2 = [{}];
              obj2 = obj["S:Envelope"]["S:Body"]["ns2:listarVerticesResponse"].return;
              for (let index = 0; index < obj2.length; index++) {
                console.log(obj2[index]["dato"]["nombre"]);
              } */
            }
          });
        }
      }
      xhr.onerror = () => {
        reject(xhr.statusText);
      }
      xhr.send(soapMessage);
    });
  }

  public rutaCorta(url, inicio, destino) {
    return new Promise((resolve, reject) => {
      var soapMessage = null;
      soapMessage = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://servicios.grafociclotour/">';
      soapMessage = soapMessage + '<soapenv:Body>';
      soapMessage = soapMessage + '<ser:' + url + '>';
      soapMessage = soapMessage + '<inicio>' + inicio + '</inicio>';
      soapMessage = soapMessage + '<destino>' + destino + '</destino>';
      soapMessage = soapMessage + '</ser:' + url + '>';
      soapMessage = soapMessage + '</soapenv:Body>';
      soapMessage = soapMessage + '</soapenv:Envelope>';
      xhr.open("POST", testUrl, true);
      xhr.setRequestHeader("Content-Type", "text/xml");
      let res;
      xhr.onload = () => { // Call a function when the state changes.
        if (xhr.readyState === xhr.DONE && xhr.status === 200) {
          xml2js.parseString(xhr.responseText, { explicitArray: false }, (error, result) => {
            if (error) {
              //throw new Error(error); 
              reject(xhr.statusText);
            } else {
              res = result;
              resolve(result);
              /*obj = res;
              console.log("Primera prueba");
              console.log(obj);
              var obj2 = [{}];
              obj2 = obj["S:Envelope"]["S:Body"]["ns2:obtenerRutaMasCortaXCodigoRecursivaResponse"].return;
              for (let index = 0; index < obj2.length; index++) {
                console.log(obj2[index]["dato"]["nombre"]);
              }*/
            }
          });
        }
      }
      xhr.onerror = () => {
        reject(xhr.statusText);
      }
      xhr.send(soapMessage);
    });
  }


  public crearArista(url, origen, destino, peso) {
    return new Promise((resolve, reject) => {
      var soapMessage = null;
      soapMessage = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://servicios.grafociclotour/">';
      soapMessage = soapMessage + '<soapenv:Body>';
      soapMessage = soapMessage + '<ser:' + url + '>';
      soapMessage = soapMessage + '<origen>' + origen + '</origen>';
      soapMessage = soapMessage + '<destino>' + destino + '</destino>';
      soapMessage = soapMessage + '<peso>' + peso + '</peso>';
      soapMessage = soapMessage + '</ser:' + url + '>';
      soapMessage = soapMessage + '</soapenv:Body>';
      soapMessage = soapMessage + '</soapenv:Envelope>';
      xhr.open("POST", testUrl, true);
      xhr.setRequestHeader("Content-Type", "text/xml");
      let res;
      xhr.onload = () => { // Call a function when the state changes.
        if (xhr.readyState === xhr.DONE && xhr.status === 200) {
          xml2js.parseString(xhr.responseText, { explicitArray: false }, (error, result) => {
            if (error) {
              //throw new Error(error); 
              reject(xhr.statusText);
            } else {
              res = result;
              resolve(result);
              /*obj = res;
              console.log("Primera prueba");
              console.log(obj);
              var obj2 = [{}];
              obj2 = obj["S:Envelope"]["S:Body"]["ns2:listarVerticesResponse"].return;
              for (let index = 0; index < obj2.length; index++) {
                console.log(obj2[index]["dato"]["nombre"]);
              } */
            }
          });
        }
      }
      xhr.onerror = () => {
        reject(xhr.statusText);
      }
      xhr.send(soapMessage);
    });
  }

  public eliminarArista(url, origen, destino) {
    return new Promise((resolve, reject) => {
      var soapMessage = null;
      soapMessage = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://servicios.grafociclotour/">';
      soapMessage = soapMessage + '<soapenv:Body>';
      soapMessage = soapMessage + '<ser:' + url + '>';
      soapMessage = soapMessage + '<origen>' + origen + '</origen>';
      soapMessage = soapMessage + '<destino>' + destino + '</destino>';
      soapMessage = soapMessage + '</ser:' + url + '>';
      soapMessage = soapMessage + '</soapenv:Body>';
      soapMessage = soapMessage + '</soapenv:Envelope>';
      xhr.open("POST", testUrl, true);
      xhr.setRequestHeader("Content-Type", "text/xml");
      let res;
      xhr.onload = () => { // Call a function when the state changes.
        if (xhr.readyState === xhr.DONE && xhr.status === 200) {
          xml2js.parseString(xhr.responseText, { explicitArray: false }, (error, result) => {
            if (error) {
              //throw new Error(error); 
              reject(xhr.statusText);
            } else {
              res = result;
              resolve(result);
              /*obj = res;
              console.log("Primera prueba");
              console.log(obj);
              var obj2 = [{}];
              obj2 = obj["S:Envelope"]["S:Body"]["ns2:listarVerticesResponse"].return;
              for (let index = 0; index < obj2.length; index++) {
                console.log(obj2[index]["dato"]["nombre"]);
              } */
            }
          });
        }
      }
      xhr.onerror = () => {
        reject(xhr.statusText);
      }
      xhr.send(soapMessage);
    });
  }

  public editarPesoArista(url, origen, destino, nuevoPeso) {
    return new Promise((resolve, reject) => {
      var soapMessage = null;
      soapMessage = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://servicios.grafociclotour/">';
      soapMessage = soapMessage + '<soapenv:Body>';
      soapMessage = soapMessage + '<ser:' + url + '>';
      soapMessage = soapMessage + '<origen>' + origen + '</origen>';
      soapMessage = soapMessage + '<destino>' + destino + '</destino>';
      soapMessage = soapMessage + '<pesoNuevo>' + nuevoPeso + '</pesoNuevo>'
      soapMessage = soapMessage + '</ser:' + url + '>';
      soapMessage = soapMessage + '</soapenv:Body>';
      soapMessage = soapMessage + '</soapenv:Envelope>';
      xhr.open("POST", testUrl, true);
      xhr.setRequestHeader("Content-Type", "text/xml");
      let res;
      xhr.onload = () => { // Call a function when the state changes.
        if (xhr.readyState === xhr.DONE && xhr.status === 200) {
          xml2js.parseString(xhr.responseText, { explicitArray: false }, (error, result) => {
            if (error) {
              //throw new Error(error); 
              reject(xhr.statusText);
            } else {
              res = result;
              resolve(result);
              /*obj = res;
              console.log("Primera prueba");
              console.log(obj);
              var obj2 = [{}];
              obj2 = obj["S:Envelope"]["S:Body"]["ns2:listarVerticesResponse"].return;
              for (let index = 0; index < obj2.length; index++) {
                console.log(obj2[index]["dato"]["nombre"]);
              } */
            }
          });
        }
      }
      xhr.onerror = () => {
        reject(xhr.statusText);
      }
      xhr.send(soapMessage);
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
}