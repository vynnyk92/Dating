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
import { PhotoEditorComponent } from '../members/photo-editor/photo-editor.component';

@Injectable()
export class PhotoService {
    private baseUrl: string = environment.baseUrl+"/users";
    constructor(private authHttp:AuthHttp) {
    }
    
    setMainPhoto(id: number, userId: number){
      return this.authHttp.post(`${this.baseUrl}/${userId}/photos/${id}/setMain`, null).catch(this.handleError);
    }

    deletePhoto(id: number, userId: number){
      return this.authHttp.delete(`${this.baseUrl}/${userId}/photos/${id}`).catch(this.handleError);
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
