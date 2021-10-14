import { FormControl } from '@angular/forms';
import { CollabsService } from './../../shared/dbAccess/collabs.service';
import { UserModel } from './../../shared/models/user.model';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../shared/dbAccess/user.service';
import {Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { CollabModel } from 'src/app/shared/models/collab.model';
import { map, startWith } from 'rxjs/operators';
import { EMPTY } from 'rxjs'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

    //Data model for our user data
    userData: UserModel;
    //Array that will be used to hold our data and display it as it becomes available
    collabData: Observable<CollabModel[]>;
    //Will determine the current tab
    selected = new FormControl(0);
    //Keys for caching
    CACHE_KEY_0 =  'reqCollabsCache';
    CACHE_KEY_1 =  'activeCollabsCache';
    CACHE_KEY_2 = 'myCollabsCache';

  /**
  * @author Edwin Quintuna
  *
  *	@brief Constructor that will create an instance of the HomeComponent
  *        and allow us to inject our dependencies; services that will be needed in the component
  *
  *	@param[userService]   ,  service that will handle both retrival and updating user data via http requests
  *	@param[router]         ,  enables navigation from one view to the next as users perform application tasks
  *	@param[collabService]  ,  service that will handle all collaboration related http requests
  *	@return nothing
  */
  constructor(
      private userService : UserService,
      private router : Router,
      private collabService : CollabsService)
       {
        
        }

  ngOnInit() {
    this.userService.getUserdetails().subscribe((userData) => {
      this.userData = userData['user'];
    });
    this.collabService
      .getRecCollabs()
      .map((data: CollabModel[]) => data["collabs"].reverse())
      .subscribe((result) => (this.collabData = result));
  }

  /**
  *	@deprecated , Not used.
  */
  userPicture(){
    /// user/profilePicture
    this.userService.getPicture().subscribe ((data : any ) => {
      // BitmapImage image = new BitmapImage();
      // image.SetSource(stream);
     });
  }


  /**
  * @author Edwin Quintuna
  *
  *	@brief Function that router to another page
  *
  * @pre User is in the home page
  * @post User is taken to the createcollab page
  *
  *	@return nothing
  */
  createCollab(){
    this.router.navigate(['/home/createcollab']);
  }

  /**
  * @author Edwin Quintuna
  *
  *	@brief Function that router to another page
  * @param[event] ,Emitted either of the 3 tabs, 'Recommended', 'All Collaborations' and 'My Collabs', is clicked
  *
  * @pre User is seeing either a list of recommended collaborations, all collabortions and my collaborations
  * @post User is presented with a different set of collaborations, either recommended collaborations,
  *       all collabortions or my collaborations
  *
  *	@return nothing
  */
  currentTab($event){
    switch($event) {

      case 0: {
       this.collabService
        .getRecCollabs().map((data: CollabModel[]) => data["collabs"].reverse())
        .subscribe(result => this.collabData = result)
        // this.collabData.subscribe( next => {
        //   localStorage[this.CACHE_KEY_0]= JSON.stringify(next);
        // });

        // this.collabData = this.collabData.pipe(
        //   startWith(JSON.parse(localStorage[this.CACHE_KEY_1] || '{}'))
        // )
        break;
      }

      case 1: {
        this.collabService
          .allCollabs()
          .map((data: CollabModel[]) => data["collabs"].reverse())
          .subscribe((result) => (this.collabData = result));
        // this.collabData.subscribe( next => {
        //   localStorage[this.CACHE_KEY_2] = JSON.stringify(next);
        // });

        // this.collabData = this.collabData.pipe(
        //   startWith(JSON.parse(localStorage[this.CACHE_KEY_0] || '{}'))
        // );

        break;
      }

      case 2: {
        this.collabService
          .myCollabs()
          .map((data: CollabModel[]) => data["collabs"].reverse())
          .subscribe((result) => (this.collabData = result));

        // this.collabData.subscribe( next => {
        //   localStorage[this.CACHE_KEY_1] = JSON.stringify(next);
        // });

        // this.collabData = this.collabData.pipe(
        //   startWith(JSON.parse(localStorage[this.CACHE_KEY_1] || '{}'))
        // );

        break;
      }

      default: {

        break;
      }


    }
  }



}

