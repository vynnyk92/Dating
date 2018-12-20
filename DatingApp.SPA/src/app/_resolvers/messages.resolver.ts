import { Resolve, Router, ActivatedRouteSnapshot } from "@angular/router";
import { User } from "../_models/user";
import { Injectable } from "@angular/core";
import { UserService } from "../services/user.service";
import { AlertifyService } from "../services/alertify.service";
import { Observable } from "rxjs";
import "rxjs/add/operator/catch";
import { AuthService } from "../services/auth.service";
import { PaginatedResult, UserFilter } from "../models/pagination";
import { Message } from "../_models/Message";

@Injectable()
export class MessagesResolver implements Resolve<PaginatedResult<Message[]>>{
    loggedUser:User = JSON.parse(localStorage.getItem('user'));
    pageSize: number = 5;
    pageNumber: number = 1;
    constructor(private userService: UserService, private router: Router, private alertify:AlertifyService,
        private authServ:AuthService){

    }

    resolve(route: ActivatedRouteSnapshot):Observable<PaginatedResult<Message[]>>{
        return this.userService.getMessages(this.loggedUser.id, this.pageNumber, this.pageSize,  '')
        .catch(err=>{
            this.alertify.error('Problem retriving data');
            this.router.navigate(['/home']);
            return Observable.of(null);
        });
    }
}