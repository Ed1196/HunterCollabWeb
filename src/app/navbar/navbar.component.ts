import { GroupMessagingModel } from './../shared/models/groupMessaging';
import { Message } from './../shared/models/message.model';
import { UserModel } from './../shared/models/user.model';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CollabModel } from '../shared/models/collab.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  
  collabData : CollabModel;
  panelOpenState = false;
  
  
  constructor(private router: Router) { }

  ngOnInit() {

  }

  GoToHomePage(){
    this.router.navigate(['/home'])
  }


  GoToProfile(){
    this.router.navigate(['/user'])
  }

  logOut(){
    localStorage.removeItem('accessToken');
    this.router.navigate(['/login']);
  } 

}
