import { Injectable } from '@angular/core';
import {environment} from '../../environments/environment';
import { Http, RequestOptions, Headers, Response} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operator/map';
import { User } from '../_models/user';
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
import { AuthHttp } from 'angular2-jwt';
import { PaginatedResult, UserFilter } from '../models/pagination';
import { HttpResponse } from 'selenium-webdriver/http';

@Injectable()
export class UserService {

    private baseUrl: string = environment.baseUrl+"/users";
    constructor(private authHttp:AuthHttp) {

    }

    getUsers(page: number, itemsPerPage: number, userFilter: UserFilter, orderBy: string, likeParam?:string):Observable<PaginatedResult<User[]>>{
        const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<User[]>();
        let queryString = '?';
        if (page!= null && itemsPerPage!= null){
          queryString+=`pageNumber=${page}&pageSize=${itemsPerPage}`
        }
        if(userFilter.gender){
          queryString+=`&gender=${userFilter.gender}`
        }
        
        if(userFilter.minAge){
          queryString+=`&minAge=${userFilter.minAge}`
        }
        
        if(userFilter.maxAge){
          queryString+=`&maxAge=${userFilter.maxAge}`
        }
        
        if(orderBy){
          queryString+=`&orderBy=${orderBy}`
        }

        if(likeParam==='Likers'){
          queryString+=`&likers=true`
        }
        if(likeParam==='Likees'){
          queryString+=`&likees=true`
        }

        return this.authHttp.get(`${this.baseUrl}`+queryString).map((responsonse: Response)=>{
        paginatedResult.result = responsonse.json();

        if(responsonse.headers.get('pagination')!== null){
          paginatedResult.pagination = JSON.parse(responsonse.headers.get('pagination'));
        }

        return paginatedResult;
        }).catch(this.handleError);
    }

    getUser(id:number):Observable<User>{
        return this.authHttp.get(`${this.baseUrl}/${id}`).map(responsonse=><User>responsonse.json()).catch(this.handleError);
    }
    
    updateUser(id: number, user: User){
      return this.authHttp.put(`${this.baseUrl}/${id}`, user).catch(this.handleError);
    }

  private handleError(error: any) {
    if(error.status===400){
      return Observable.throw(error._body);
    }
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

  public addLike(senderId: number, recipientId: number){
    let query: string= `/${senderId}/like/${recipientId}`;
    return this.authHttp.post(this.baseUrl+query, {}).catch(this.handleError);
  }
}
