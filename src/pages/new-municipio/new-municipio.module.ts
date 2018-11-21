import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NewMunicipioPage } from './new-municipio';
import { HttpModule } from '@angular/http';

@NgModule({
  declarations: [
    NewMunicipioPage,
  ],
  imports: [
    IonicPageModule.forChild(NewMunicipioPage),
    HttpModule
  ],
})
export class NewMunicipioPageModule { }
