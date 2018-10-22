import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { tokenNotExpired, JwtHelper } from "angular2-jwt";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";

@Injectable()
export class AuthService {
  private baseUrl: string = "http://localhost:23164/api/auth";
  userToken: any;
  decodedToken: any;
  jwtHelper:JwtHelper = new JwtHelper();
  constructor(private http: Http) {}

  loggedIn(){
     return tokenNotExpired('token');
  }

  login(model: any) {
    return this.http
      .post(this.baseUrl + "/login", model, this.requestOptions())
      .map(res => {
        const user = res.json();
        if (user) {
          localStorage.setItem("token", user.tokenString);
          this.decodedToken = this.jwtHelper.decodeToken(user.tokenString);
          console.log(this.decodedToken);
          this.userToken = user.tokenString;
        }
      }).catch(this.handleError);
  }

  register(model: any) {
    return this.http.post(
      this.baseUrl + "/register",
      model,
      this.requestOptions()
    ).catch(this.handleError);
  }

  private requestOptions(): RequestOptions {
    const headers = new Headers({ "Content-type": "application/json" });
    const options = new RequestOptions({ headers: headers });

    return options;
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
