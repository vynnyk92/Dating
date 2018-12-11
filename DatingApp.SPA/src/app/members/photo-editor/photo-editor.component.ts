import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FileUploader } from '../../../../node_modules/ng2-file-upload';
import { Photo } from '../../_models/user';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';
import { AlertifyService } from '../../services/alertify.service';
import { PhotoService } from '../../services/photo.service';
import * as _ from 'underscore';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {

  @Input() photos: Photo[];
  @Output() change: EventEmitter<string> = new EventEmitter<string>();
  public uploader: FileUploader;
  public hasBaseDropZoneOver:boolean = false;
  baseUrl = environment.baseUrl;
  public currentMain: Photo;
  
  constructor(private authService: AuthService, private alertServ: AlertifyService, private photoService: PhotoService) { }

  ngOnInit() {
    this.initializeUploader();
  }

  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader(){
    debugger;
    this.uploader = new FileUploader({
      url: this.baseUrl+'/users/'+this.authService.decodedToken.nameid+'/photos',
      authToken: 'Bearer '+localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10*1024*1024
    });

    this.uploader.onSuccessItem = (item, response, status, headers)=>{
      if(response){
        const res: Photo = JSON.parse(response);
        const photo={
          id: res.id,
          url: res.url,
          dateAdded: res.dateAdded,
          description: res.description,
          mainPhoto: res.mainPhoto
        };

        this.photos.push(photo);
      }
      else{
        this.alertServ.error('Download failed');
      }
    }
  }

  setMainPhoto(photo: Photo){
    this.photoService.setMainPhoto(photo.id, this.authService.decodedToken.nameid).subscribe(
      res => {
        debugger;
        this.currentMain = _.findWhere(this.photos, {mainPhoto: true});
        //this.currentMain = _.findWhere(this.photos, {mainPhoto: true});
        this.currentMain.mainPhoto = false;
        photo.mainPhoto = true;
        this.authService.changeMemberPhoto(photo.url);
        this.authService.currenUser.photoUrl = photo.url;
        this.alertServ.success("Main photo updated successfully!");
        localStorage.setItem('user', JSON.stringify(this.authService.currenUser));
        //this.change.emit(photo.url);
      },
      err => {
        this.alertServ.error(err);
      }
    );
  }

  deletePhoto(photoId: number){
    this.photoService.deletePhoto(photoId, this.authService.decodedToken.nameid).subscribe(
      res => {
            //this.alertServ.success("Main photo updated successfully!");
            let index = this.photos.findIndex(p=>p.id==photoId);

            this.photos.splice(index,1);           
          },
          err => {
            this.alertServ.error(err);
          }
    );
  }
}
