import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { AlertifyService } from '../services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Pagination, PaginatedResult } from '../models/pagination';
import { Message } from '../_models/Message';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  pagination:Pagination;
  messages: Message[];
  messageContainer:string = 'Unred';
  
  constructor(private authService:AuthService,
    private userService:UserService,
              private alertService:AlertifyService,
              private route:ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data=>{
      this.messages = data['messages']['result'];
      this.pagination = data['messages']['pagination'];
    });
  }

  loadMessage(){
    this.userService.getMessages(this.authService.decodedToken.nameid, this.pagination.currentPage,
      this.pagination.itemsPerPage, this.messageContainer)
      .subscribe((res: PaginatedResult<Message[]>)=>{
        this.messages = res.result;
        this.pagination = res.pagination;
      }, err=>{
        this.alertService.error(err);
      });
  }

  pageChanged(event: any){
    this.pagination.currentPage = event.page;
    this.loadMessage();
  }

}
