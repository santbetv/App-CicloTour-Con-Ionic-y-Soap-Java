import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditarMunicipioPage } from './editar-municipio';
import { HttpModule } from '@angular/http';

@NgModule({
  declarations: [
    EditarMunicipioPage,
  ],
  imports: [
    IonicPageModule.forChild(EditarMunicipioPage),
    HttpModule
  ],
})
export class EditarMunicipioPageModule {}
