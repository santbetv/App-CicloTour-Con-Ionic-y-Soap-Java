import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
//Indicar al framework angular donde se va a ejecutar la aplicacion

import { AppModule } from './app.module';
//Nuestro modulo de aplicacion

platformBrowserDynamic().bootstrapModule(AppModule);
//Realiza la inicializar apartir de appmodule, una ves cargado aparatir del modulo en un main en java
