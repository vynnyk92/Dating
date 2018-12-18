import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { MessagesComponent } from './messages/messages.component';
import { ListsComponent } from './lists/lists.component';
import { AuthGuard } from './_guards/auth.guard';
import { MemberDetailComponent } from './members/member-detail/member-detail.component';
import { MemberDetailResolver } from './_resolvers/member-detail.resolver';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberEditResolver } from './_resolvers/member-edit.resolver';
import { PreventUnsavedchanges } from './_guards/prevent-unsavedchanges';
import { MemberListResolver } from './_resolvers/member-list.resolver';
import { ListResolver } from './_resolvers/list.resolver';

export const appRoutes:Routes=[
    {path: 'home', component: HomeComponent},
    {
        path:'', 
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuard],
        children:[
            {path: 'members', component: MemberListComponent, resolve: {user: MemberListResolver} },
            {path: 'members/edit', component: MemberEditComponent,  resolve: {user: MemberEditResolver}, canDeactivate: [PreventUnsavedchanges]},
            {path: 'members/:id', component: MemberDetailComponent, resolve: {user: MemberDetailResolver}},
            {path: 'messages', component: MessagesComponent},
            {path: 'lists', component: ListsComponent, resolve: {user: ListResolver}},
        ]
    },
   
    {path: '**', redirectTo: 'home', pathMatch: 'full'}
];