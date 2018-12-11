import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { User } from "../../_models/user";
import { ActivatedRoute } from "@angular/router";
import { AlertifyService } from "../../services/alertify.service";
import { NgForm } from "@angular/forms";
import { UserService } from "../../services/user.service";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-member-edit",
  templateUrl: "./member-edit.component.html",
  styleUrls: ["./member-edit.component.css"]
})
export class MemberEditComponent implements OnInit {
  @ViewChild("editForm") public editForm: NgForm;
  constructor(
    private route: ActivatedRoute,
    private alert: AlertifyService,
    private userService: UserService,
    private changeDetctRef: ChangeDetectorRef,
    private auth: AuthService
  ) {}
  user: User;
  photoUrl:string;
  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data["user"];
    });
    this.auth.currentPhotoUrl.subscribe(photoUrl => {
      this.photoUrl = photoUrl;
    })
  }

  updateUser() {
    this.userService.updateUser(this.user.id, this.user).subscribe(
      res => {
        this.alert.success("Profile updated successfully!");
        this.editForm.reset(this.user);
      },
      err => {
        this.alert.error(err);
      }
    );
  }

  updateMainPhoto(url: string){
    debugger;
    this.user.photoUrl = url;
    this.changeDetctRef.detectChanges();
  }
}
