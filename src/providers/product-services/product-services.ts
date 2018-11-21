import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ProductServicesProvider {

  headers: Headers;
  headersPost: Headers;
  options: RequestOptions;
  idBuscado: any;

  constructor(public http: Http) {
    console.log('Hello ProductServicesProvider Santiago');
  }

  public getMunicipio(token) {
    this.headersPost = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer ' + token
    });

    let optionspost = new RequestOptions({
      headers: this.headersPost
    })

    return new Promise((resolve, reject) => {
      this.http.get('https://ciclotour-2018.herokuapp.com/api/municipio/', optionspost) //Se identifica error en el /
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          resolve(err);
        });
    });
  }

  public buscarId(myId) {
    this.idBuscado = myId;
    console.log("Ingreso asignando id: " + this.idBuscado);
  }

  public newMunicipio(token, postParams) {

    let body = 'nombreMunicipio=' + postParams.nombreMunicipio + '&posx=' + postParams.posx + '&posy=' + postParams.posy + '&departamentoId=' + '5bbac0fdc425060004aeea36' + '&descripcion=' + postParams.descripcion;

    this.headersPost = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer ' + token
    });

    let optionspost = new RequestOptions({
      headers: this.headersPost
    })

    return new Promise((resolve, reject) => {
      this.http.post('https://ciclotour-2018.herokuapp.com/api/municipio/', body, optionspost)//Se identifica error en get
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          resolve(err);
        });
    });
  }

  public deleteMunicipio(token, id) {
    this.headersPost = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*',//Preguntar para que el asterisco
      'Authorization': 'Bearer ' + token
    });

    let optionspost = new RequestOptions({
      headers: this.headersPost
    })

    return new Promise((resolve, reject) => {
      this.http.delete('https://ciclotour-2018.herokuapp.com/api/municipio/' + id, optionspost)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          resolve(err);
        });
    });
  }

  public editarMunicipio(token, postParams) {//En heroku

    let body = 'nombreMunicipio=' + postParams.nombreMunicipio + '&posx=' + postParams.posx + '&posy=' + postParams.posy + '&departamentoId=' + '5bbac0fdc425060004aeea36' + '&descripcion=' + postParams.descripcion;

    this.headersPost = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Access-Control-Allow-Origin': '*',
      'Authorization': 'Bearer ' + token
    });

    let optionspost = new RequestOptions({
      headers: this.headersPost
    })

    return new Promise((resolve, reject) => {
      this.http.put('https://ciclotour-2018.herokuapp.com/api/municipio/' + this.idBuscado, body, optionspost)
        .subscribe(res => {
          resolve(res);
        }, (err) => {
          resolve(err);
        });
    });
  }
}
