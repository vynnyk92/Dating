import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

    private baseUrl: string = "http://localhost:23164/api/auth";
    userToken: any;
    constructor(private http:Http) { }

    login(model:any){
     
        return this.http.post(this.baseUrl+'/login', model, this.requestOptions()).map((res)=>{
            const user = res.json();
            if(user){
                localStorage.setItem('token', user.tokenString);
                this.userToken = user.tokenString;
            }
        });
    }
    
    register(model:any) {
        return this.http.post(this.baseUrl+'/register', model, this.requestOptions());
    }
    
    private requestOptions():RequestOptions{
        const headers = new Headers({'Content-type': 'application/json'});
        const options = new RequestOptions({headers: headers});

        return options;
    }
}
