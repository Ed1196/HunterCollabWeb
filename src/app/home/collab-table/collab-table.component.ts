import { Component, OnInit, Input } from '@angular/core';
import { TableBuilder } from 'src/app/shared/models/tableBuilder.model';
import { Router } from '@angular/router';
import { UserService } from 'src/app/shared/dbAccess/user.service';

@Component({
  selector: 'collab-table',
  templateUrl: './collab-table.component.html',
  styleUrls: ['./collab-table.component.css']
})
export class CollabTableComponent implements OnInit {
  @Input() table: Array<TableBuilder> = [];
  @Input('xAxisReq') xAxisReq: Array<string> = [];
  displayNames: Map<String, String> = new Map();
 

  /**
  * @author Edwin Quintuna
  * 
  *	@brief Constructor that will create an instance of CollabTableComponent 
  *        and allow us to inject our dependencies; services that will be needed in the component
  *
  *	@param[router]         ,  enables navigation from one view to the next as users perform application tasks
  *	@param[userService]    ,  service that will handle both retrival and updating user data via http requests
  *
  * @pre nothing is set
  * @post A new instance of CollabModel is initialized
  * 
  *	@return nothing
  */
  constructor(
    private router: Router,
    private userservice : UserService
  ) 
  { }

  ngOnInit() {}

  /**
  * @author Edwin Quintuna
  * 
  *	@brief Method that will route the user to another users profile page.
  *
  *	@param[router]         ,  users myhunter email that will be used to retrieve a users profile data
  *
  * @pre we are in the home page.
  * @post we route to the user page of the specified user.
  * 
  *	@return nothing
  */
  goToProfile(user: string) {
      this.router.navigate(['/user/', user]);
  }


  /**
  * 
  *	@brief Method that will abreviate the name that is displayed on the table.
  *
  * @pre users are shown by their myhunter email on the table.
  * @post users display name is abriviated.
  * 
  *	@return nothing
  */
  getUserDispname(username: string){
    if (this.displayNames.has(username)) {
      return this.displayNames.get(username);
    } else {
      this.displayNames.set(username, "");
      
      setTimeout(()=>{
        this.userservice.getMemberdetails(username).subscribe((data :any)=>
        {
          //console.log(data);
          this.displayNames.set(username, data['name']);
        })
      });
      return this.displayNames.get(username);
    }
  }

}


