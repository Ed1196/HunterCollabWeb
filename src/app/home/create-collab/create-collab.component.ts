import { CollabModel } from 'src/app/shared/models/collab.model';
import { UserService } from 'src/app/shared/dbAccess/user.service';
import { CollabsService } from 'src/app/shared/dbAccess/collabs.service';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Observable, from } from 'rxjs';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { map, startWith, debounceTime, distinctUntilChanged, switchMap, } from 'rxjs/operators';
import { Router } from '@angular/router';
import { query } from '@angular/animations';

@Component({
  selector: 'create-collab',
  templateUrl: './create-collab.component.html',
  styleUrls: ['./create-collab.component.css']
})
export class CreateCollabComponent implements OnInit {
  @Input() currentCollab: CollabModel;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  //Variables for Skills.
  skillCtrl = new FormControl();
  filteredSkills: Observable<string[]>;
  skills: string[] = [];
  allSkills: string[] = [];

  //Variables for Classes.
  classCtrl = new FormControl();
  filteredClasses: Observable<string[]>;
  classes: string[] = [];
  allClasses: string[] = [];

  collabData: CollabModel;

  @ViewChild('skillInput') skillInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete1: MatAutocomplete;

  @ViewChild('classInput') classInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto2') matAutocomplete2: MatAutocomplete;

  /**
  * @author Edwin Quintuna
  * 
  *	@brief Constructor that will create an instance of CreateCollabComponent 
  *        and allow us to inject our dependencies; services that will be needed in the component
  *
  *	@param[formBuilder]   ,  Creates an AbstractControl from a user-specified configuration
  *	@param[userService]    ,  service that will handle both retrival and updating user data via http requests
  *	@param[collabService]  ,  service that will handle all collaboration related http requests
  *	@param[router]         ,  enables navigation from one view to the next as users perform application tasks
  *
  * @pre nothing is set
  * @post A new instance of CollabModel is initialized
  * 
  *	@return nothing
  */
  constructor(private _formBuilder: FormBuilder, 
              private userService : UserService, 
              private collabService: CollabsService,
              private router: Router) {
    this.collabData = new CollabModel;
   }

  /**
  * @author Edwin Quintuna
  * 
  *	@brief Function that will be called once Angular has finished initializing and setting up the component.
  *        Also initializes a listener on the formControl to listen for user inputs and make an api call with
  *        the value in the formControl. This is done for both the formControl for skills and classes. If the values 
  *        change, make an api call to search the database. Initializes our form using the formBuilder.
  * 
  * @pre FormControls are not set. Form is not built
  * @post , form is built with child controls title, description, location, size, date and duration. 
  *         Validators for each AbstractControlOption are specified. These fields are connected to the 
  *         HTML fields that have the same formControlName as the child control.
  *        
  *	@return nothing
  */ 
  ngOnInit() {
    
    this.skillCtrl.valueChanges.pipe(
      
      startWith(null),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap( (query: string) => this.userService.searchSkills(query)  )
      ).subscribe( (skills: Observable<string[]>) => this.filteredSkills = skills["matches"] );

      this.classCtrl.valueChanges.pipe(
      startWith(null),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap( (query: string) => this.userService.searchClasses(query)  )
      ).subscribe( (classes: Observable<string[]>) => this.filteredClasses = classes["matches"] );


      
    this.firstFormGroup = this._formBuilder.group({
      title: [this.collabData.title, Validators.required],
      description: [this.collabData.description, Validators.required],
      location: [this.collabData.location, Validators.required],
      size: [this.collabData.size, Validators.required],
      date: [this.collabData.date, Validators.required],
      duration: [this.collabData.duration, Validators.required],
    });
    
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
  *	@brief Function that will handle adding classes to the users class array. The array will be updated both locally
  *        and in the database.
  * @param[event] ,Emitted when a chip is to be added
  *	@return nothing
  */
  addClass(event: MatChipInputEvent): void {

    if(!this.matAutocomplete2.isOpen){

      const input = event.input;
      const value = event.value;

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
  * @param[_class] Single element from the class list, it's index will be use for its removel
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
  *	@brief Function that will add a class to the user's class list when the user clicks a class from
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
  *	@brief Function that will use the collabService to create a new collaboration using the collabModel.
  *
  * @pre all fields of the collanModel are field
  * @post createCollab is called from the collabService, which if it succesfully creates a collab, we will be routed to the home page
  *       We should be able to see the collab under the 'My Collabs' category
  * 
  *	@return nothing
  */
  createCollab(){    
    this.collabData = Object.assign({}, this.firstFormGroup.value);
    this.collabData.skills = this.skills;
    this.collabData.classes = this.classes;
    this.collabData.date = (this.collabData.date).valueOf();
    this.collabData.duration *= 86400000;
    this.collabData.duration += this.collabData.date;
    let createResult: boolean;
    this.collabService.createCollab(this.collabData)
      .subscribe(result => { 
        if(result['success']){
          this.router.navigate(['/home'])
        } else {
          error => {console.error('success' + error)}
        }

       } );
    
    
  }
  
  

}
