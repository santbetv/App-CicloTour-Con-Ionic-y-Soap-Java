import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ProductServicesProvider } from '../../providers/product-services/product-services';
import { WsProvider } from '../../providers/ws/ws';
import { HomePage } from '../home/home';
import { MenuPage } from '../menu/menu';
import { FormGroup, FormControl, Validators } from '@angular/forms';



@IonicPage()
@Component({
  selector: 'page-editar-municipio',
  templateUrl: 'editar-municipio.html',
})
export class EditarMunicipioPage {
  idTotal: any;
  token: String;
  form;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public productServices: ProductServicesProvider, public alertCtrl: AlertController, public ws: WsProvider) {
    this.token = navParams.get('token');

    this.form = new FormGroup({
      nombreMunicipio: new FormControl("", Validators.required),
      posx: new FormControl("", Validators.required),
      posy: new FormControl("", Validators.required),
      descripcion: new FormControl("", Validators.required)
    });
  }

  editarMunicipios() {//Nuevo metodo mejorado para guardar municipios heroku
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
          message: 'Esta seguro que desea editar un municipio!',
          buttons: [
            {
              text: 'Si',
              handler: () => {
                this.productServices.editarMunicipio(this.token, postParams).then((pdct) => {
                  //alert(pdct["statusText"]);
                  this.mensajesDeUsuario(pdct["statusText"] + " ¡Editado con Exito!");
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
                this.mensajesDeUsuario("No se adiciono edicion");
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

  editarVertice() {//Nuevo metodo de Web Service JAVA
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
          message: 'Esta seguro que desea editar un municipio!',
          buttons: [
            {
              text: 'Si',
              handler: () => {
                this.ws.editarVertice('editarVertice', postParams.nombreMunicipio, postParams.posx, postParams.posy)
                  .then((respuesta) => {
                    this.mensajesDeUsuario(respuesta["S:Envelope"]["S:Body"]["ns2:editarVerticeResponse"].return + " En aplicacion Java");
                    this.navCtrl.setRoot(MenuPage, {
                      token: this.token
                    })
                  }).catch((err) => {
                    this.mensajesDeUsuario("Fallo: " + err);
                  })
              }
            },
            {
              text: 'No',
              handler: () => {
                this.mensajesDeUsuario("No se adiciono edicion");
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

  mensajesDeUsuario(dato: string) {//Nuevo metodo de validar mensajes
    let alert = this.alertCtrl.create({
      title: 'Mensaje',
      subTitle: dato,
      buttons: ['Ok']
    });

    alert.present();
  }
}
