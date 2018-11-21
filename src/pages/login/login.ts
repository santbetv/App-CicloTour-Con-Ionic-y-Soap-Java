import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { LoginServicesProvider } from '../../providers/login-services/login-services';
import { HomePage } from '../home/home';
import { MenuPage } from '../menu/menu';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WsProvider } from "../../providers/ws/ws";
import { url } from 'inspector';
import { ToastController } from 'ionic-angular';
import { Network } from '@ionic-native/network';

let urlHeroku = "https://ciclotour-2018.herokuapp.com/";//pagina 500
let paginaNoEncontrada = "http://109.74.193.109:8080/aerolinea/numero";//pagina 404
let urlWSJava = "http://109.74.193.109:8080/grafociclotour/";//pagina 500

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  basepath = "/restheroku";
  form;
  rootPage: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    public loginService: LoginServicesProvider,
    public navController: NavController, public alertCtrl: AlertController,
    public ws: WsProvider, public network: Network, public toast: ToastController) {

    this.form = new FormGroup({
      email: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required)
    });

    console.log(this.network.type);
  }

  login() {
    let postParams = {
      email: this.form.value.email,
      password: this.form.value.password
    }
    if (postParams.email === "" || postParams.password === "") {
      this.mensajesDeUsuario("Campos vacios valide de nuevo")
    } else {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', `${this.basepath}`, true);
      xhr.setRequestHeader("Content-Type", "text/xml");
      let protocoloHttp = 0;
      xhr.onload = () => {
        if (xhr.readyState == 4) {
          protocoloHttp = xhr.status;
          if (protocoloHttp < 500) {
            if (protocoloHttp >= 400 && protocoloHttp <= 499) {
              this.mensajesDeUsuario("Pagina no encontrada.");
            } else {
              this.loginService.login(postParams)
                .then((user) => {
                  let respuesta = JSON.parse(user["_body"]);
                  let respuestastatus = JSON.parse(user["status"]);
                  console.log(respuesta)
                  this.mensajesDeUsuario(respuesta.message);
                  //alert(respuesta.message);
                  if (respuestastatus >= 200 && respuestastatus <= 399) {//Nuevo codicional para verificacion correcta de log in
                    this.navController.setRoot(HomePage, {
                      token: respuesta.token
                    })
                  }
                }).catch((err) => {
                  this.mensajesDeUsuario(err);
                })
            }
          } else {
            this.mensajesDeUsuario("Error en servidor.");
          }
        }
      }
      xhr.send(null);
    }
  }

  validarJava() {
    this.ws.validarServicioJavaEE();
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
