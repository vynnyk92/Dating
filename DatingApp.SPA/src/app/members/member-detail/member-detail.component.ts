import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { AlertifyService } from '../../services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../_models/user';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {

  constructor(private userServ:UserService, private alertServ:AlertifyService, private route:ActivatedRoute) { }
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  user: User;
  ngOnInit() {
    this.route.data.subscribe(data=>{
      this.user = data['user'];
    });

    this.galleryOptions =[{
      width: '500px',
      height: '500px',
      thumbnailsColumns: 4,
      imagePercent: 100,
      imageAnimation: NgxGalleryAnimation.Slide,
      preview:false
    }];
    this.galleryImages = this.getImages();
  }

  getImages(){
    const imageUrls =[];
    for (let index = 0; index < this.user.photos.length; index++) {
      imageUrls.push({
        small: this.user.photos[index].url,
        medium: this.user.photos[index].url,
        big: this.user.photos[index].url,
        description: this.user.photos[index].description
      });
    }
    return imageUrls;
  }
  
  // getUserDetails(){
  //   debugger;
  //   this.userServ.getUser(+this.route.snapshot.params['id']).subscribe((res:User)=>{
  //       this.user = res;
  //   },
  //   (err)=>{
  //    this.alertServ.error(err);
  //   });
  // }


}
