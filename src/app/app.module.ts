import { Network } from '@ionic-native/network';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { NewMunicipioPage } from "../pages/new-municipio/new-municipio";
import { EditarMunicipioPage } from "../pages/editar-municipio/editar-municipio";
import { MenuPage } from '../pages/menu/menu';
import { CrearAristaPage } from '../pages/crear-arista/crear-arista';
import { EditarPesoAristaPage } from '../pages/editar-peso-arista/editar-peso-arista';
import { EliminarAristaPage } from '../pages/eliminar-arista/eliminar-arista';
import { LoginServicesProvider } from '../providers/login-services/login-services';
import { ProductServicesProvider } from '../providers/product-services/product-services';
import { WsProvider } from '../providers/ws/ws';

@NgModule({
  declarations: [ //Declarando componentes iniciales
    MyApp,
    HomePage,
    LoginPage,
    NewMunicipioPage,
    EditarMunicipioPage,
    MenuPage,
    CrearAristaPage,
    EditarPesoAristaPage,
    EliminarAristaPage
  ],
  imports: [ //Importando modulos
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp], // bootstrap de la aplicacion
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    NewMunicipioPage,
    EditarMunicipioPage,
    MenuPage,
    CrearAristaPage,
    EditarPesoAristaPage,
    EliminarAristaPage
  ],
  providers: [ //Servicios globales que actuan sobre patron singlenton, se crea una ves y se llaman cuantas veces requiera
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    LoginServicesProvider,
    ProductServicesProvider,
    WsProvider, Network
  ]
})
export class AppModule { }
