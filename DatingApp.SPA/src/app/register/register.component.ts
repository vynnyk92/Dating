import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() cancelRegister = new EventEmitter();
  model:any = {};
  constructor(private auth: AuthService) { }

  ngOnInit() {
  }

  register(){
    this.auth.register(this.model).subscribe((response)=>{
      console.log('Register success!');
    }, error=>{
      console.log(error);
    });
  }
  cancel(){
    this.cancelRegister.emit(false);
  }
}
