import { CollabModel } from 'src/app/shared/models/collab.model';
import { UserService } from 'src/app/shared/dbAccess/user.service';
import { CollabsService } from 'src/app/shared/dbAccess/collabs.service';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { map, startWith, debounceTime, distinctUntilChanged, switchMap, } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-edit-collab',
  templateUrl: './edit-collab.component.html',
  styleUrls: ['./edit-collab.component.css']
})
export class EditCollabComponent implements OnInit {
  @Input() currentCollab: CollabModel;

  formGroup: FormGroup;
  _id: string;
  myCollab: CollabModel;

  
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
  *	@brief Constructor that will create an instance of EditCollabComponent 
  *        and allow us to inject our dependencies; services that will be needed in the component
  *
  *	@param[userService]    ,  service that will handle both retrival and updating user data via http requests
  *	@param[collabService]  ,  service that will handle all collaboration related http requests
  *	@param[activeRoute]    ,  will allow us to retrieve path parameters if they are set
  *	@param[router]         ,  enables navigation from one view to the next as users perform application tasks
  *
  * @pre nothing is set
  * @post A new instance of CollabModel is started and if there is a paremeter in the url, it is retrieved by the activeRoute
  * 
  *	@return nothing
  */
  constructor(
              private userService : UserService, 
              private collabService: CollabsService,
              private activeRoute: ActivatedRoute,
              private router : Router) {
            
    this.collabData = new CollabModel;
    this.activeRoute.paramMap
    .subscribe(params => {
      this._id = params.get('_id');
    })
   }

  /**
  * @author Edwin Quintuna
  * 
  *	@brief Function that will be called once Angular has finished initializing and setting up the component.
  *        Will retrieve all the data from the collaboration that is going to be edited using the id from the url.
  *        Also initializes a listener on the formControl to listen for user inputs and make an api call with
  *        the value in the formControl. This is done for both the formControl for skills and classes. If the values 
  *         change, make an api call to search database.
  * 
  * @pre no data for the collab to be edited is available. FormControls are not set
  * @post data has been retrieved for the collaboration and is displayed for the user and formControls are set up
  *       to react whenever the user is typing on the FormControl.
  *        
  *	@return nothing
  */ 
  async ngOnInit() {
    await this.getCollabDetails(this._id);
    
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
    
  }

  /**
  * @author Edwin Quintuna
  * 
  *	@brief Function that will retrieve the data for one collaboration from the database.
  *
  * @param[id] ,id for the collaboration that needs to be retrieved
  * 
  * @pre variables collabData, skills and classes hold no data
  * @post variables collabData, skills and classes hold all the data pertaining to the collab being edited
  * 
  *	@return nothing
  */
  getCollabDetails(id: string){
    this.collabService.getSingleCollab(id).subscribe(res => {
      this.collabData = res['0'];
      this.skills = res['0']['skills'];
      this.classes = res['0']['classes'];
    });
  }

  /**
  * @author Edwin Quintuna
  * 
  *	@brief Function that will use the collabService to make an api call that will update a collaboration in the database with the 
  *        data from the CollabModel.
  *
  * @pre Collaboration has old data and we are on the edit collab page
  * @post Request to update the data has been sent and if we get a succesful message in return, we navigate to the home page.
  * 
  *	@return nothing
  */
  async update(collabUpdatedData){
    
    this.collabData = collabUpdatedData;
    this.collabData.skills = this.skills;
    this.collabData.classes = this.classes;
    this.collabData._id = this._id;
  
    await this.collabService.editCollab(this.collabData, this._id)
      .subscribe(res => { 
          if(res['success']){ 
            this.router.navigate(['/home'])
           } else {
            console.error(res);
          }
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

  
  
  

}
