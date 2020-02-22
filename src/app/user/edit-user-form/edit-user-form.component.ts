import { UserService } from 'src/app/shared/dbAccess/user.service';
import { UserModel } from 'src/app/shared/models/user.model';
import { CollabModel } from './../../shared/models/collab.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Input, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-user-form',
  templateUrl: './edit-user-form.component.html',
  styleUrls: ['./edit-user-form.component.css']
})
export class EditUserFormComponent implements OnInit {
  
  //Model for user data
  userData: UserModel;

  //Model for collaboration data
  collabData: CollabModel;

  /**
  * @author Edwin Quintuna
  * 
  *	@brief Constructor that will create an instance of EditUserFormComponent 
  *        and allow us to inject our dependencies; services that will be needed in the component
  *
  *	@param[userService]  ,  service that will handle both retrival and updating user data via http requests
  *	@param[dialogRef]    ,  handles the openning/closing of the Dialog
  *	@param[data]         ,  handles passing of data from/to component opening the dialog
  *	@return nothing
  */
  constructor(
    private userService: UserService,
    private _formBuilder: FormBuilder,
    //Handles the openning/closing of the Dialog
    public dialogRef: MatDialogRef<EditUserFormComponent>,
    //Handles passing of data from/to component opening the dialog
    @Inject(MAT_DIALOG_DATA) public data: any){

    }
  
  
  ngOnInit() {}

  /**
  * @author Edwin Quintuna
  * 
  *	@brief Function that will call the UserService to update user details, once thats done return to UserPageComponent
  *
  *	@param[userData]  ,  UserModel that will hold the fields that will be updated on the database
  *	@return nothing
  */
  update(userData){
    //User userService to make an http request to update the fields specified on the Template Driven Form
    this.userService.updateUserProfile(userData).subscribe(result => { });
    //Will close the dialog and go back to the UserPageComponent
    this.dialogRef.close();
  }

}
