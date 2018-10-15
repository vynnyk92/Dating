import { Component, OnInit } from '@angular/core';
import { AuthService } from "../services/auth.service";
import { error } from 'protractor';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model:any = {};
  private isLoggedIn:boolean =false;
  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

  login(){
    this.auth.login(this.model).subscribe(data=>{
      this.isLoggedIn=true;
      console.log("success: "+this.auth.userToken);
    }, error=>{
      console.log("failed");
    });

  }

  logout(){
    this.auth.userToken=null;
    localStorage.setItem("token", null);
    this.isLoggedIn=false;
  }

  loggedIn():boolean{
    return this.isLoggedIn;
  }
}
