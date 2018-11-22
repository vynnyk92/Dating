import { Component, OnInit, ViewChild } from "@angular/core";
import { User } from "../../_models/user";
import { ActivatedRoute } from "@angular/router";
import { AlertifyService } from "../../services/alertify.service";
import { NgForm } from "@angular/forms";
import { UserService } from "../../services/user.service";

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
    private userService: UserService
  ) {}
  user: User;
  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data["user"];
    });
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
}
