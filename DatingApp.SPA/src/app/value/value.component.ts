import { Component, OnInit } from "@angular/core";
import { Http } from "@angular/http";
import{ Value} from '../models/value';
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";

@Component({
  selector: "app-value",
  templateUrl: "./value.component.html",
  styleUrls: ["./value.component.css"]
})
export class ValueComponent implements OnInit {
  values: any;
  constructor(private http: Http) {}

  ngOnInit() {
    this.getValues();
  }
  getValues() {
    this.http.get('http://localhost:23164/api/values').subscribe(response=>{
      this.values=response.json();
    });
  }
}
