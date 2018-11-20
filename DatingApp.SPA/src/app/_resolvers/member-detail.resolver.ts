import { Resolve, Router, ActivatedRouteSnapshot } from "@angular/router";
import { User } from "../_models/user";
import { Injectable } from "@angular/core";
import { UserService } from "../services/user.service";
import { AlertifyService } from "../services/alertify.service";
import { Observable } from "rxjs";
import "rxjs/add/operator/catch";

@Injectable()
export class MemberDetailResolver implements Resolve<User>{

    constructor(private userService: UserService, private router: Router, private alertify:AlertifyService){

    }

    resolve(route: ActivatedRouteSnapshot):Observable<User>{
        return this.userService.getUser(route.params['id'])
        .catch(err=>{
            this.alertify.error('Problem retriving data');
            this.router.navigate(['/home']);
            return Observable.of(null);
        });
    }


}