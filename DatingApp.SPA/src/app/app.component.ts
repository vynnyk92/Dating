import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
import { JwtHelper } from 'angular2-jwt';
import { User } from './_models/user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  
  title = 'app';
  jwtHelper:JwtHelper = new JwtHelper(); 

  constructor(private authServ:AuthService){}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const user: User = JSON.parse(localStorage.getItem('user'));
    if(token){
      this.authServ.decodedToken = this.jwtHelper.decodeToken(token);
    }
    if(user){
      this.authServ.currenUser = user;
      this.authServ.changeMemberPhoto(user.photoUrl);
    }
  }
}
