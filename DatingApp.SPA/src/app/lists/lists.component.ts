import { Component, OnInit } from '@angular/core';
import { User } from '../_models/user';
import { Pagination } from '../models/pagination';
import { UserService } from '../services/user.service';
import { AlertifyService } from '../services/alertify.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {

users:User[];
pagination:Pagination;

constructor(private userService:UserService,
            private alertService:AlertifyService,
            private route:ActivatedRoute) { }

ngOnInit() {
  this.route.data.subscribe(data=>{
    this.users = data['user']['result'];
    this.pagination = data['user']['pagination'];
  });
}

// loadUsers(){
//   this.userService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, this.userFilter, this.orderBy).subscribe((res:PaginatedResult<User[]>)=>{
//     debugger;
//     this.users = res.result;
//     this.pagination = res.pagination;
//   },
//   err=>{
//     this.alertService.error(err);
//   });
  
}



