import { Component, OnInit, Input } from '@angular/core';
import { User } from '../../_models/user';
import { UserService } from '../../services/user.service';
import { AlertifyService } from '../../services/alertify.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {

  @Input() user:User;
  constructor(private userServ: UserService, private alertServ: AlertifyService, private authServ: AuthService) { }

  ngOnInit() {
  }

  sendLike(id){
    this.userServ.addLike(this.authServ.decodedToken.nameid, id).subscribe(data=>{
      this.alertServ.success("You've liked: "+ this.user.knownAs);
    }, err=>{
      this.alertServ.error(err);
    });
  }
}
