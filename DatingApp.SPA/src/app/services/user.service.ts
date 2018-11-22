import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import { Http, RequestOptions, Headers} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operator/map';
import { User } from '../_models/user';
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
import { AuthHttp } from 'angular2-jwt';

@Injectable()
export class UserService {
    private baseUrl: string = environment.baseUrl+"/users";
    constructor(private authHttp:AuthHttp) {

    }

    getUsers():Observable<User[]>{
        return this.authHttp.get(`${this.baseUrl}`).map(responsonse=><User[]>responsonse.json()).catch(this.handleError);
    }

    getUser(id:number):Observable<User>{
        return this.authHttp.get(`${this.baseUrl}/${id}`).map(responsonse=><User>responsonse.json()).catch(this.handleError);
    }
    
    updateUser(id: number, user: User){
      return this.authHttp.put(`${this.baseUrl}/${id}`, user).catch(this.handleError);
    }

  private handleError(error: any) {
    const appError = error.headers.get("Application-Error");
    if (appError) {
      return Observable.throw(appError);
    }
    const serverError = error.json();
    let modelStateError = "";
    if (serverError) {
      for (const key in serverError) {
        if (serverError[key]) {
          modelStateError+=serverError[key]+'\n';
        }
      }
    return Observable.throw(modelStateError || 'Server error');
    }
  }
}
