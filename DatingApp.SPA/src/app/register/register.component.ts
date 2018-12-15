import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertifyService } from '../services/alertify.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { User } from '../_models/user';
import { BsDatepickerConfig } from 'ngx-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() cancelRegister = new EventEmitter();
  userModel:User;
  constructor(
    private auth: AuthService, 
    private alertService: AlertifyService,
    private fb: FormBuilder,
    private router: Router) { }
  
  
  registerForm: FormGroup;
  
  colorTheme = 'theme-red';
  bsConfig: Partial<BsDatepickerConfig>;

  createRegisterForm(){
    this.registerForm = this.fb.group({
      gender: ['male'],
      username:['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: [null, Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.maxLength(8), Validators.minLength(4)]],
      confirmPassword: ["",[ Validators.required]]
    }, {validator: this.passwordMatches});
  }

  ngOnInit() {
    this.bsConfig = { containerClass: this.colorTheme };
    this.createRegisterForm();
  }

  passwordMatches(fg: FormGroup){
    return fg.get('password').value === fg.get('confirmPassword').value? null : {'mismatch': true};
  }

  register(){
    if(this.registerForm.valid){
      this.userModel = Object.assign({}, this.registerForm.value)
      this.auth.register(this.userModel).subscribe((response)=>{
        this.alertService.success('Register success!');
      }, error=>{
        this.alertService.error(error);
      }, ()=> {
        this.auth.login(this.userModel).subscribe(()=>{
          this.router.navigate(['/members']);
        });
      });
    }
   
    console.log(this.registerForm.value);
  }
  cancel(){
    this.cancelRegister.emit(false);
  }
}
