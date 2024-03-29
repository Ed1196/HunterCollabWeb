import { EditPictureComponent } from "./../edit-picture/edit-picture.component";
import { EditSkillsComponent } from "./../edit-skills/edit-skills.component";
import { EditClassesComponent } from "./../edit-classes/edit-classes.component";
import { EditUserFormComponent } from "./../edit-user-form/edit-user-form.component";
import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";
import { UserService } from "src/app/shared/dbAccess/user.service";
import { Router, ActivatedRoute } from "@angular/router";
import { UserModel } from "src/app/shared/models/user.model";
import { FormControl, Form, FormGroup, FormBuilder } from "@angular/forms";
import { Observable } from "rxjs/Observable";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-user-page",
  templateUrl: "./user-page.component.html",
  styleUrls: ["./user-page.component.css"],
})
export class UserPageComponent implements OnInit {
  canEdit: boolean;

  canMessage: boolean;
  //Will hold our user data.
  userData: UserModel;
  username: string;
  imageLink: any = "https://picsum.photos/200/300";
  linkedIn: string;
  github: string;

  //Auto complete variables.
  classesForm: FormGroup;
  filteredUsers: String[] = [];
  isLoading = false;
  userClass: UserModel["classes"];
  userSkill: UserModel["skills"];

  //place holder of image
  public imageToShow: any;

  //default variable for selected file.
  fileToUpload: File = null;

  /**
   * @author Edwin Quintuna
   *
   *	@brief Constructor that will create an instance of UserPageComponent
   *        and allow us to inject our dependencies; services that will be needed in the component
   *
   *	@param[userService]  ,  service that will handle both retrival and updating user data via http requests
   *	@param[activeRoute]  ,  will allow us to retrieve path parameters if they are set
   *	@param[dialog]       ,  service to open Material Design modal dialogs
   *	@return nothing
   */
  constructor(
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder,
    private activeRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  /**
   * @author Edwin Quintuna
   *
   *	@brief Function that will be called once the Angular has finished initializing and setting up the component
   *        This function is async as we need to wait for data to be retrieved before setting values or doing logic
   *
   *	@return nothing
   */
  async ngOnInit() {
    //Will retrieve the 'username' parameter from the url if set.
    await this.activeRoute.paramMap.subscribe((params) => {
      if (params.has("username")) {
        this.canEdit = false;
        this.canMessage = true;
        this.username = params.get("username");
      } else {
        this.canEdit = true;
        this.username = "None";
      }
    });
    //Load the user data that will be displayed in our html files
    this.loadUserData(this.username);
  }

  messageUser() {
    this.router.navigate(["/conversations/message/", this.username]);
  }

  /**
   * @author Edwin Quintuna
   *
   *	@brief Function that will load a users data or another users data, depending on whether the variable
   *        'username' has been set from the url parameter.
   *
   *	@param[username]  ,  variable that will store the username retrieved from the url parameter
   *	@return nothing
   */
  loadUserData(username: string) {
    this.userService.getMemberdetails(username).subscribe((userData) => {
      this.userData = userData["user"];
      this.userClass = userData["classes"];
      this.userSkill = userData["skills"];
      this.linkedIn = this.cleanLinkedInUrl(userData["user"].linkedIn);
      // github url cleaner
      this.github = this.cleanGithubUrl(userData["user"].github);
    });
    // this.profileMemberPicture(username);
  }

  cleanLinkedInUrl(linkedInUrl: string) {
    let linkedInUsername = linkedInUrl.substring(
      0,
      linkedInUrl.lastIndexOf("/")
    );
    let linkedIn = linkedInUsername.substring(
      linkedInUsername.lastIndexOf("/") + 1
    );
    return linkedIn;
  }

  cleanGithubUrl(githubUrl: string) {
    let githubUsername = githubUrl;
    let github = githubUsername.substring(githubUsername.lastIndexOf("/") + 1);
    return github;
  }

  /**
   * @author Edwin Quintuna
   *
   *	@brief Function that will open a dialog window with the content of EditUserFormComponent
   *        The window will open on the same screen, using the same data as the current screen
   *
   *	@return nothing
   */
  openDialog1(): void {
    //Dialog refeerence that will handle the closing of the dialog and to receive
    //notifiations when the dialog has been closed
    const dialogRef = this.dialog.open(EditUserFormComponent, {
      width: "50%",
      //Data that will be passed to the dialog
      data: {
        userData: this.userData,
      },
    });
    //Logic done after the dialog has been closed from the dialog window
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.userData.username = result.username;
        this.userData.linkedIn = result.linkedIn;
        this.userData.github = result.github;
        this.linkedIn = this.cleanLinkedInUrl(result.linkedIn);
        this.github = this.cleanGithubUrl(result.github);
      }
    });
  }

  /**
   * @author Edwin Quintuna
   *
   *	@brief Function that will open a dialog window with the content of EditClassesComponent
   *        The window will open on the same screen, using the same data as the current screen
   *
   *	@return nothing
   */
  openDialog2(): void {
    //Dialog refeerence that will handle the closing of the dialog and to receive
    //notifiations when the dialog has been closed
    const dialogRef = this.dialog.open(EditClassesComponent, {
      width: "95%",
      data: {
        userData: this.userData,
      },
    });
    //Logic done after the dialog has been closed from the dialog window
    dialogRef.afterClosed().subscribe((result) => {
      //console.log('The dialog was closed');
    });
  }

  /**
   * @author Edwin Quintuna
   *
   *	@brief Function that will open a dialog window with the content of EditSkillsComponent
   *        The window will open on the same screen, using the same data as the current screen
   *
   *	@return nothing
   */
  openDialog3(): void {
    //Dialog refeerence that will handle the closing of the dialog and to receive
    //notifiations when the dialog has been closed
    const dialogRef = this.dialog.open(EditSkillsComponent, {
      width: "70%",
      data: {
        userData: this.userData,
      },
    });
    //Logic done after the dialog has been closed from the dialog window
    dialogRef.afterClosed().subscribe((result) => {
      //console.log('The dialog was closed');
    });
  }

  /**
   * @author Edwin Quintuna
   *
   *	@brief Function that will open a dialog window with the content of EditPictureComponent
   *        The window will open on the same screen, using the same data as the current screen
   *
   *	@return nothing
   */
  openDialog4() {
    //Dialog refeerence that will handle the closing of the dialog and to receive
    //notifiations when the dialog has been closed
    const dialogRef = this.dialog.open(EditPictureComponent, {
      width: "280px",
      data: {
        userData: this.userData,
      },
    });
    //Logic done after the dialog has been closed from the dialog window
    dialogRef.afterClosed().subscribe((result) => {
      //console.log('The dialog was closed' + result);
      if (result == true) {
      }
    });
  }

  changeProfilePic() {
    //console.log("Change profile pic.")
  }

  /**
   * @author Edwin Quintuna
   *
   *	@brief Function that will redirect to a users github page and will open on a separate window
   *
   *	@return nothing
   */
  onNavigateGithub() {
    window.open(this.userData["github"], "_blank");
  }

  /**
   * @author Edwin Quintuna
   *
   *	@brief Function that will redirect to a users linkedIn page and will open on a separate window
   *
   *	@return nothing
   */
  onNavigateLinkedIn() {
    window.open(this.userData["linkedIn"], "_blank");
  }
}
