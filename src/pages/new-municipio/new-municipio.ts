import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ProductServicesProvider } from '../../providers/product-services/product-services';
import { HomePage } from '../home/home';
import { MenuPage } from '../menu/menu';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WsProvider } from '../../providers/ws/ws'

@IonicPage()
@Component({
  selector: 'page-new-municipio',
  templateUrl: 'new-municipio.html',
})
export class NewMunicipioPage {

  basepathjava = "/wsciclotour";
  token: String;
  form;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public productServices: ProductServicesProvider
    , public alertCtrl: AlertController, public ws: WsProvider) {
    this.token = navParams.get('token');

    this.form = new FormGroup({
      nombreMunicipio: new FormControl("", Validators.required),
      posx: new FormControl("", Validators.required),
      posy: new FormControl("", Validators.required),
      descripcion: new FormControl("", Validators.required)
    });
  }

  saveMunicipios() {//Metodo de profesor carlos 
    let postParams = {
      nombreMunicipio: this.form.value.nombreMunicipio,
      posx: this.form.value.posx,
      posy: this.form.value.posy,
      descripcion: this.form.value.descripcion
    }

    this.productServices.newMunicipio(this.token, postParams).then((pdct) => {
      alert(pdct["statusText"]);
      this.navCtrl.setRoot(HomePage, {
        token: this.token
      })
    }).catch((err) => {
      console.log(err);
    })
  }

  guardarMunicipios() {//Nuevo metodo mejorado para guardar solo municipios HEROKU
    let postParams = {
      nombreMunicipio: this.form.value.nombreMunicipio,
      posx: this.form.value.posx,
      posy: this.form.value.posy,
      descripcion: this.form.value.descripcion
    }

    if (postParams.nombreMunicipio === "" || postParams.posx === "" || postParams.posy === "" || postParams.descripcion === "") {
      this.mensajesDeUsuario("Textos Vacios validar");
    } else {
      if (postParams.posx > 0 && postParams.posy > 0) {
        let alert = this.alertCtrl.create({
          title: 'Validando',
          message: 'Esta seguro que desea agregar un nuevo municipio!',
          buttons: [
            {
              text: 'Si',
              handler: () => {
                this.productServices.newMunicipio(this.token, postParams).then((pdct) => {
                  //alert(pdct["statusText"]);
                  this.mensajesDeUsuario(pdct["statusText"] + " ¡Agregado con Exito!");
                  this.navCtrl.setRoot(HomePage, {
                    token: this.token
                  })
                }).catch((err) => {
                  console.log(err);
                })
              }
            },
            {
              text: 'No',
              handler: () => {
                this.mensajesDeUsuario("No se adiciono");
              }
            }
          ]
        });
        alert.present();
      } else {
        this.mensajesDeUsuario("Se requiere datos numericos > 0");
      }
    }
  }

  crearVertice() {//Nuevo metodo mejorado para guardar municipios JAVA
    let postParams = {
      nombreMunicipio: this.form.value.nombreMunicipio,
      posx: this.form.value.posx,
      posy: this.form.value.posy,
      descripcion: this.form.value.descripcion
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
            if (postParams.nombreMunicipio === "" || postParams.posx === "" || postParams.posy === "" || postParams.descripcion === "") {
              this.mensajesDeUsuario("Textos Vacios validar");
            } else {
              if (postParams.posx > 0 && postParams.posy > 0) {
                let alert = this.alertCtrl.create({
                  title: 'Validando',
                  message: 'Esta seguro que desea crear un nuevo municipio!',
                  buttons: [
                    {
                      text: 'Si',
                      handler: () => {
                        this.ws.crearVertice('crearVertice', postParams.nombreMunicipio, postParams.posx, postParams.posy)
                          .then((respuesta) => {
                            console.log(respuesta);
                            this.mensajesDeUsuario(respuesta["S:Envelope"]["S:Body"]["ns2:crearVerticeResponse"].return + " En aplicacion Java");
                            this.navCtrl.setRoot(MenuPage, {
                              token: this.token
                            })
                          }).catch((err) => {
                            this.mensajesDeUsuario("Fallo: " + err);
                          })
                        this.productServices.newMunicipio(this.token, postParams).then((pdct) => {
                          this.mensajesDeUsuario(pdct["statusText"] + " ¡ Agregado con Exito! En aplicación Heroku");
                          /* this.navCtrl.setRoot(MenuPage, {
                            token: this.token
                          }) */
                        }).catch((err) => {
                          console.log(err);
                        })
                      }
                    },
                    {
                      text: 'No',
                      handler: () => {
                        this.mensajesDeUsuario("No se adiciono");
                      }
                    }
                  ]
                });
                alert.present();
              } else {
                this.mensajesDeUsuario("Se requiere datos numericos > 0");
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