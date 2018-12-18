import { Resolve, Router, ActivatedRouteSnapshot } from "@angular/router";
import { User } from "../_models/user";
import { Injectable } from "@angular/core";
import { UserService } from "../services/user.service";
import { AlertifyService } from "../services/alertify.service";
import { Observable } from "rxjs";
import "rxjs/add/operator/catch";
import { AuthService } from "../services/auth.service";
import { PaginatedResult, UserFilter } from "../models/pagination";

@Injectable()
export class ListResolver implements Resolve<PaginatedResult<User[]>>{

    pageSize: number = 10;
    pageNumber: number = 1;
    loggedUser:User = JSON.parse(localStorage.getItem('user'));
    userFilter: UserFilter = {minAge:18, maxAge: 99, gender: this.loggedUser.gender=='male'?'female':'male'};
    constructor(private userService: UserService, private router: Router, private alertify:AlertifyService,
        private authServ:AuthService){

    }

    resolve(route: ActivatedRouteSnapshot):Observable<PaginatedResult<User[]>>{
        return this.userService.getUsers(this.pageNumber, this.pageSize,  this.userFilter, '', 'Likers')
        .catch(err=>{
            this.alertify.error('Problem retriving data');
            this.router.navigate(['/home']);
            return Observable.of(null);
        });
    }
}