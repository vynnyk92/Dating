import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertifyService } from '../services/alertify.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() cancelRegister = new EventEmitter();
  model:any = {};
  constructor(private auth: AuthService, private alertService: AlertifyService) { }

  ngOnInit() {
  }

  register(){
    this.auth.register(this.model).subscribe((response)=>{
      this.alertService.success('Register success!');
    }, error=>{
      this.alertService.error(error);
    });
  }
  cancel(){
    this.cancelRegister.emit(false);
  }
}
