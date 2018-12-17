import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../_models/user';
import { AlertifyService } from '../../services/alertify.service';
import { PaginatedResult, Pagination, UserFilter } from '../../models/pagination';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  users:User[];
  userFilter: UserFilter;
  loggedUser:User = JSON.parse(localStorage.getItem('user'));

  orderBy:string = 'lastActive';

  orderByList=[
    {value: 'created', display: 'Created Date', selected: false},
    {value: 'lastActive', display: 'Last Active Date',selected: true},
  ];

  genderList=[
    {value: 'male', display: 'Males', selected: this.loggedUser.gender=='female'},
    {value: 'female', display: 'Females',selected: this.loggedUser.gender=='male'},
  ];
  pagination:Pagination;
  
  constructor(private userService:UserService,
              private alertService:AlertifyService,
              private route:ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(data=>{
      this.users = data['user']['result'];
      this.pagination = data['user']['pagination'];
    });
    this.userFilter = {minAge:18, maxAge: 99, gender: this.loggedUser.gender=='male'?'female':'male'};
  }

  loadUsers(){
    this.userService.getUsers(this.pagination.currentPage, this.pagination.itemsPerPage, this.userFilter, this.orderBy).subscribe((res:PaginatedResult<User[]>)=>{
      debugger;
      this.users = res.result;
      this.pagination = res.pagination;
    },
    err=>{
      this.alertService.error(err);
    });
    
  }

  pageChanged(event: any): void {
    this.pagination.currentPage = event.page;
    this.loadUsers();
  }

  aplyFilter(){
    this.loadUsers();
  }
  
  resetFilter(){
    this.userFilter = {minAge:18, maxAge: 99, gender: this.loggedUser.gender=='male'?'female':'male'};
    this.loadUsers();
  }

  changeOrder(){
    this.loadUsers();
  }
}
