import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { error } from "protractor";
import { AlertifyService } from "../services/alertify.service";

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
    private alertService: AlertifyService
  ) {}

  ngOnInit() {}

  login() {
    this.auth.login(this.model).subscribe(
      data => {
        this.alertService.success("User logged in");
      },
      error => {
        this.alertService.error("Login failed");
      }
    );
  }

  logout() {
    this.auth.userToken = null;
    localStorage.removeItem("token");
    this.alertService.message('logged out');
  }

  loggedIn(): boolean {
    return this.auth.loggedIn(); 
  }

}
