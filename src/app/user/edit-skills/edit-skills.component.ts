import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CollabsService } from './../../shared/dbAccess/collabs.service';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UserService } from 'src/app/shared/dbAccess/user.service';
import { startWith, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-edit-skills',
  templateUrl: './edit-skills.component.html',
  styleUrls: ['./edit-skills.component.css']
})
export class EditSkillsComponent implements OnInit {

  /** 
  * @brief Properties for mat-chip-list Angular Material component with autocomplete.
  */
  //Whether or not an html element is visible
  visible = true;
  //Determines whether the selected states for all the chips inside the list are ignored
  selectable = true;
  //Determines whether or not a chip from a list displays the remove styling and emits removed events
  removable = true;
  //Will emit the chipEnd; finished entering string for a chip, event when the input is blurred
  addOnBlur = true;
  //Key inputs that will trigger a chipEnd event.
  separatorKeysCodes: number[] = [ENTER, COMMA];
  //formControl directive
  skillCtrl = new FormControl();
  //Will hold the autocomplete results from the api as we type in the FormControl
  filteredSkills: Observable<string[]>;
  //Will hold the skills that the user currently knows
  skills: string[] = [];
  /**
   * @deprecated used to hold the resulting skills from the api calls
   */
  allSkills: string[] = [];

  @ViewChild('skillInput') skillInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete1: MatAutocomplete;

  /**
  * @author Edwin Quintuna
  * 
  *	@brief Constructor that will create an instance of EditSkillsComponent dialog 
  *        and allow us to inject our dependencies; services that will be needed in the component
  *
  *	@param[userService]  ,  service that will handle both retrival and updating user data via http requests
  *	@param[dialogRef]    ,  reference to the newly-opened dialog with an instance of component EditSkillsComponent
  *	@param[data]         ,  handles passing of data from/to component opening the dialog
  *                         @Inject() lets Angular know that a parameter must be injected
  *	@return nothing
  */
  constructor(
    private userService : UserService, 
    private collabService: CollabsService,
    //Handles the openning/closing of the Dialog
    public dialogRef: MatDialogRef<EditSkillsComponent>,
    //Handles passing of data from/to component opening the dialog
      //Has a parameter decorator that specifies a custom provider of the dependency
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  /**
  * @author Edwin Quintuna
  * 
  *	@brief Function that will be called once Angular has finished initializing and setting up the component
  *        Will retrieve data from the instance of the Component that openned this dialog. Also initializes
  *        a listener on the formControl to listen for user inputs and make an api call with the value in the
  *       formControl
  *	@return nothing
  */
  ngOnInit() {

    //Loads array of skills from the data, of type UserModel, that was passed down to this dialog
    this.skills = this.data.userData['skills'];

    //Will handle the autocomplete once we start typing in the FormControl 'skillCtrl'
    this.skillCtrl.valueChanges.pipe(
      
      startWith(null),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap( (query: string) => this.userService.searchSkills(query)  )
      ).subscribe( (skills: Observable<string[]>) => this.filteredSkills = skills["matches"] );
  }

  /**
  * @author Edwin Quintuna
  * 
  *	@brief Function that will handle adding skills to the users skill array. The array will be updated both locally
  *        and in the database.
  * @param[event] ,Emitted when a chip is to be added
  *	@return nothing
  */
  addSkill(event: MatChipInputEvent): void {

    // Add element only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if(!this.matAutocomplete1.isOpen){

      const input = event.input;
      const value = event.value;

      if((value || '').trim()) {
        this.skills.push(value.trim());
      }
  
      if(input) {
        input.value = '';
      } 

      this.skillCtrl.setValue(null);
      
    }
  }

  /**
  * @author Edwin Quintuna
  * 
  *	@brief Function that will handle removing a skill from the users skills
  *        list depending on the chip that was pressed in the mat-chip-list.
  * @param['skill'] Single element from the skills list, it's index will be use for its removel
  * 
  *	@return nothing
  */
  removeSkill(skill: string): void {
    const index = this.skills.indexOf(skill);

    if (index >= 0) {
      this.skills.splice(index, 1);
    }
  }

  /**
  * @author Edwin Quintuna
  * 
  *	@brief Function that will add a skill to the users skill list when the user clicks a skill from
  *        from the autocomplete list.
  * 
  * @param['event'] Varaible that will hold values of an Event that is emitted when an option from the list is selected
  * 
  *	@return nothing
  */
  selectedSkill(event: MatAutocompleteSelectedEvent): void {
    this.skills.push(event.option.viewValue);
    this.skillInput.nativeElement.value = '';
    this.skillCtrl.setValue(null);

  }

  /**
  * @author Edwin Quintuna
  * 
  *	@brief Function that will make an api call that will update the users skill list on the database with the 
  *        'skills[]' array. This function will also close the dialog where this component is being displayed
  *        by calling the close() function.
  * 
  *	@return nothing
  */
  update(){
    this.userService.updateUserSkills(this.skills).subscribe(result => { });
    this.dialogRef.close();
  }

}
