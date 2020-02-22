import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormControl } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit, ElementRef, ViewChild, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { UserService } from 'src/app/shared/dbAccess/user.service';
import { startWith, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-edit-classes',
  templateUrl: './edit-classes.component.html',
  styleUrls: ['./edit-classes.component.css']
})
export class EditClassesComponent implements OnInit {

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
  classCtrl = new FormControl();
  //Will hold the autocomplete results from the api as we type in the FormControl
  filteredClasses: Observable<string[]>;
  //Will hold the classes that the user currently knows
  classes: string[] = [];
  /**
   * @deprecated used to hold the resulting classes from the api calls
   */
  allClasses: string[] = [];

  @ViewChild('classInput') classInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto2') matAutocomplete2: MatAutocomplete;

  /**
  * @author Edwin Quintuna
  * 
  *	@brief Constructor that will create an instance of EditClassesComponent dialog 
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
    //Handles the openning/closing of the Dialog
    public dialogRef: MatDialogRef<EditClassesComponent>,
    //Handles passing of data from/to component opening the dialog
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  /**
  * @author Edwin Quintuna
  * 
  *	@brief Function that will be called once Angular has finished initializing and setting up the component.
  *        Will retrieve data from the instance of the Component that openned this dialog. Also initializes
  *        a listener on the formControl to listen for user inputs and make an api call with the value in the
  *       formControl
  *	@return nothing
  */
  ngOnInit() {
    this.classes = this.data.userData['classes'];
    this.classCtrl.valueChanges.pipe(
      startWith(null),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap( (query: string) => this.userService.searchClasses(query)  )
      ).subscribe( (classes: Observable<string[]>) => this.filteredClasses = classes["matches"] );
  }

  /**
  * @author Edwin Quintuna
  * 
  *	@brief Function that will handle adding classes to the users class array. The array will be updated both locally
  *        and in the database.
  * @param[event] ,Emitted when a chip is to be added
  *	@return nothing
  */
  addClass(event: MatChipInputEvent): void {

    // Add element only when MatAutocomplete is not open
    // To make sure this does not conflict with OptionSelected Event
    if(!this.matAutocomplete2.isOpen){

      const input = event.input;
      const value = event.value;

      // Add element only when MatAutocomplete is not open
      // To make sure this does not conflict with OptionSelected Event
      if((value || '').trim()) {
        this.classes.push(value.trim());
      }
  
      if(input) {
        input.value = '';
      } 

      this.classCtrl.setValue(null);
    }
  }

  /**
  * @author Edwin Quintuna
  * 
  *	@brief Function that will handle removing a class from the users classes
  *        list depending on the chip that was pressed in the mat-chip-list.
  * @param['_class'] Single element from the class list, it's index will be use for its removel
  * 
  *	@return nothing
  */
  removeClass(_class: string): void {
    const index = this.classes.indexOf(_class);

    if (index >= 0) {
      this.classes.splice(index, 1);
    }
  }

  /**
  * @author Edwin Quintuna
  * 
  *	@brief Function that will add a class to the users class list when the user clicks a class from
  *        from the autocomplete list.
  * 
  * @param['event'] Varaible that will hold values of an Event that is emitted when an option from the list is selected
  * 
  *	@return nothing
  */
  selectedClass(event: MatAutocompleteSelectedEvent): void {
    this.classes.push(event.option.viewValue);
    this.classInput.nativeElement.value = '';
    this.classCtrl.setValue(null);
  }

  /**
  * @author Edwin Quintuna
  * 
  *	@brief Function that will use the userService to make an api call that will update the users class list on the database with the 
  *        'classes[]' array. This function will also close the dialog where this component is being displayed
  *        by calling the close() function.
  * 
  *	@return nothing
  */
  update(){
    this.userService.updateUserclass(this.classes).subscribe(result => {});
    this.dialogRef.close();
  }

}
