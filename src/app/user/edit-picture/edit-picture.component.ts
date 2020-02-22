import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EditClassesComponent } from './../edit-classes/edit-classes.component';
import { UserService } from './../../shared/dbAccess/user.service';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-edit-picture',
  templateUrl: './edit-picture.component.html',
  styleUrls: ['./edit-picture.component.css']
})
export class EditPictureComponent implements OnInit {

  //default variable for selected file.
  fileToUpload: File = null;
  submitPressed = false;

  /**
  * @author Edwin Quintuna
  * 
  *	@brief Constructor that will create an instance of EditSkillsComponent dialog 
  *        and allow us to inject our dependencies; services that will be needed in the component
  *
  *	@param[userService]  ,  service that will handle both retrival and updating user data via http requests
  *	@param[dialogRef]    ,  reference to the newly-opened dialog with an instance of component EditClassesComponent
  *	@param[data]         ,  handles passing of data from/to component opening the dialog
  *                         @Inject() lets Angular know that a parameter must be injected
  *	@return nothing
  */
  constructor(
    private userService: UserService,
    public dialogRef: MatDialogRef<EditClassesComponent>,
    //Handles passing of data from/to component opening the dialog
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  //function which you use in (change)-event of your file input tag:
 handleFileInput(files: FileList) {
  this.fileToUpload = files.item(0);
  }

  async uploadFileToActivity() {
  await this.userService.uploadProfilePicture(this.fileToUpload).subscribe((data: any)=>{
    console.log(data)
  })
  this.submitPressed = true;
  this.dialogRef.close(this.submitPressed);

  }

}
