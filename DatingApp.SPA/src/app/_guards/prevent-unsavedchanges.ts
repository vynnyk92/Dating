import { Injectable } from "@angular/core";
import { CanDeactivate } from "@angular/router";
import { MemberEditComponent } from "../members/member-edit/member-edit.component";
import { MemberDetailComponent } from "../members/member-detail/member-detail.component";
import { IfObservable } from "rxjs/observable/IfObservable";

@Injectable()
export class PreventUnsavedchanges implements CanDeactivate<MemberEditComponent> {

    canDeactivate(component:MemberEditComponent){
        if(component.editForm.dirty){
            return confirm('Are you sure you want leave without saving form data?');
        }
        return true;
    }   
}
