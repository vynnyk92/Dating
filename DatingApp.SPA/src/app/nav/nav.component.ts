import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { error } from "protractor";
import { AlertifyService } from "../services/alertify.service";
import { Route, Router } from "@angular/router";

@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.css"]
})
export class NavComponent implements OnInit {
  model: any = {};
  private isLoggedIn: boolean = false;
  constructor(
    private auth: AuthService,
    private alertService: AlertifyService,
    private router:Router
  ) {}

  ngOnInit() {}

  login() {
    this.auth.login(this.model).subscribe(
      data => {
        this.alertService.success("User logged in");
      },
      error => {
        this.alertService.error("Login failed");
      },
      ()=>{
          this.router.navigate(['/members']);
      });
  }

  logout() {
    this.auth.userToken = null;
    localStorage.removeItem("token");
    this.alertService.message('logged out');
    this.router.navigate(['/home']);
  }

  loggedIn(): boolean {
    return this.auth.loggedIn(); 
  }

}
