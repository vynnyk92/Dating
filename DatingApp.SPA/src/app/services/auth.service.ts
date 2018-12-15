import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";
import { tokenNotExpired, JwtHelper } from "angular2-jwt";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
import { environment } from "../../environments/environment";
import { User } from "../_models/user";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

@Injectable()
export class AuthService {
  private baseUrl: string = environment.baseUrl + "/auth";
  userToken: any;
  decodedToken: any;
  currenUser: User;
  jwtHelper: JwtHelper = new JwtHelper();
  private photoUrl = new BehaviorSubject<string>("../assets/user.png");
  currentPhotoUrl = this.photoUrl.asObservable();

  constructor(private http: Http) {}

  changeMemberPhoto(photoUrl: string) {
    
      this.photoUrl.next(photoUrl);

  }

  loggedIn() {
    return tokenNotExpired("token");
  }

  login(model: any) {
    return this.http
      .post(this.baseUrl + "/login", model, this.requestOptions())
      .map(res => {
        const user = res.json();
        if (user) {
          localStorage.setItem("token", user.tokenString);
          localStorage.setItem("user", JSON.stringify(user.user));
          this.decodedToken = this.jwtHelper.decodeToken(user.tokenString);
          console.log(this.decodedToken);
          this.userToken = user.tokenString;
          this.currenUser = user.user;
          if (this.currenUser.photoUrl !== null) {
            this.changeMemberPhoto(this.currenUser.photoUrl);
          } else {
            this.changeMemberPhoto("../assets/user.png");
          }
        }
        if (user) {
          localStorage.setItem("token", user.tokenString);
          localStorage.setItem("user", JSON.stringify(user.user));
          this.decodedToken = this.jwtHelper.decodeToken(user.tokenString);
          console.log(this.decodedToken);
          this.userToken = user.tokenString;
          this.currenUser = user.user;
        }
        if (user) {
          localStorage.setItem("token", user.tokenString);
          localStorage.setItem("user", JSON.stringify(user.user));
          this.decodedToken = this.jwtHelper.decodeToken(user.tokenString);
          console.log(this.decodedToken);
          this.userToken = user.tokenString;
          this.currenUser = user.user;
        }
      })
      .catch(this.handleError);
  }

  register(model: any) {
    return this.http
      .post(this.baseUrl + "/register", model, this.requestOptions())
      .catch(this.handleError);
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
          modelStateError += serverError[key] + "\n";
        }
      }
      return Observable.throw(modelStateError || "Server error");
    }
  }
}
