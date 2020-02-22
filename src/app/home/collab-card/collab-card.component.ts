import { CollabsService } from 'src/app/shared/dbAccess/collabs.service';
import { UserService } from './../../shared/dbAccess/user.service';
import { CollabModel } from './../../shared/models/collab.model';
import { Component, OnInit, Input } from '@angular/core';
import { TableBuilder } from 'src/app/shared/models/tableBuilder.model';
import { UserModel } from 'src/app/shared/models/user.model';
import { Router } from '@angular/router';

export interface Requirements{
  skillOrClass: string,
  type: string
}

@Component({
  selector: 'collab-card',
  templateUrl: './collab-card.component.html',
  styleUrls: ['./collab-card.component.css']
})
export class CollabCardComponent implements OnInit {

  @Input() collabData: CollabModel;
 

  //Values being passed to collab-table
  table: Array<TableBuilder> = [];  
  xAxisReq: Array<string> = [];
  panelOpenState1 = false;
  panelOpenState2 = false;


  yAxisUsers: any
  alreadyBuilt: boolean = false;
  partOf = false; 
  isOwner = false; 

  //Will hold our user data.
  userData: UserModel;
  

  /**
  * @author Edwin Quintuna
  * 
  *	@brief Constructor that will create an instance of CollabCardComponent 
  *        and allow us to inject our dependencies; services that will be needed in the component
  * 
  *	@param[userService]    ,  service that will handle both retrival and updating user data via http requests
  *	@param[collabService]  ,  service that will handle all collaboration related http requests
  *	@param[router]         ,  enables navigation from one view to the next as users perform application tasks
  *
  * @pre nothing is set
  * @post A new instance of CollabModel is initialized
  * 
  *	@return nothing
  */
  constructor(private userService: UserService, 
              private collabService: CollabsService,
              private router: Router) {
               
                
              }

  /**
  * @author Edwin Quintuna
  * 
  *	@brief Function that will be called once Angular has finished initializing and setting up the component.
  *        Will use the userService to retrieve the details for the user that is currently logged in.
  * 
  * @pre no data for tthe user is known. userData is null
  * @post user data is retrieved via an Observable and that data is stored in the userData variable
  *        
  *	@return nothing
  */             
  async ngOnInit() {
    await this.userService.getUserdetails().subscribe(userData => this.userData = userData);
  }

  /**
  * @author Edwin Quintuna
  * 
  *	@brief Function that will be called once Angular has finished initializing and setting up the component.
  *        Will use the userService and the collabService to create a table of current members and display
  *        if the member knows or doesn't know the required skills and classes required by the collaboration.
  * 
  * @pre empty table
  * @post table of members with click-able names to thier profile page and if that member knows or doesn't know
  *       the required skills and classes specified by the collab creator
  *        
  *	@return nothing
  */ 
  async makeTable(){

    if(this.alreadyBuilt){

    this.table = []
    //Will store the list of users.
    let yAxisUsers : string[];

    //Fuction will stop here until function getAllRequred returns
    this.xAxisReq = await this.getAllRequired(); 
    
    //Will members of the collaboration
    yAxisUsers  = this.collabData.members;
    //console.log("Skills Required: " , xAxisReq);
    
    //Will loop through all the users and check if they know the required skills and classes
    for(let y of yAxisUsers){
      //console.log(x, " is being checked");

        //Will hold a single instance of TableBuilder modle
        let tableRow = await this.checkIfKnown(y,this.xAxisReq);
        this.table.push(tableRow);
        //console.log(tableRow);
     }

    } else {
    this.alreadyBuilt = true;
    //Will store the list of users.
    let yAxisUsers : string[];

    //Fuction will stop here until function getAllRequred returns
    this.xAxisReq = await this.getAllRequired(); 
    
    //Will members of the collaboration
    yAxisUsers  = this.collabData.members;
    //console.log("Skills Required: " , xAxisReq);
    
    //Will loop through all the users and check if they know the required skills and classes
    for(let y of yAxisUsers){
      //console.log(x, " is being checked");

        //Will hold a single instance of TableBuilder modle
        let tableRow = await this.checkIfKnown(y,this.xAxisReq);
        this.table.push(tableRow);
        //console.log(tableRow);
     }
    }
    
  }

  /**
  *	@deprecated , Not used.
  */
  RefreshPage(){
    this.getAllRequired();
    //Will members of the collaboration
    this.yAxisUsers  = this.collabData.members;
  } 
  
  //

  /**
  * @author Edwin Quintuna
  * 
  *	@brief Will check if a user knows skill or class, from the list of classes and skills that a user knows.
  *        
  *	@return Variable of type TableBuilder. Will hold a list if a user know or doesn't know a skill or class
  */ 
  async checkIfKnown(userName: string, listOfRequired: string[]){
    let tmp: TableBuilder = null;

    tmp = new TableBuilder(userName);

    let knownByUser;
   
    for(let x of listOfRequired){
      
      //Will return both skills and classes in a single array
      await this.userService.getUserSkillsAndClasses(userName).then(function(result){
        knownByUser = result;
        //console.log(knownByUser);
      });
      
      if(knownByUser.includes(x)){
        //console.log(userName , " knows ", x);
        tmp.setKnown(x,true);
        
      } else {
        //console.log(userName , " doesn't know ", x);
        tmp.setKnown(x,false);
      }
    }
    
    return tmp;
  }

  /**
  * @author Edwin Quintuna
  * 
  *	@brief Will retrieve a collaborations required skills and classes and concat them.
  *        
  *	@return A list of skills and classes concat together
  */
  getAllRequired(){
    let xAxisReq: Array<string> = [];
    xAxisReq = (this.collabData.skills).concat(this.collabData.classes);

    return xAxisReq;
  }
  
  /**
  * @author Edwin Quintuna
  * 
  *	@brief Will check that the current user seeing a collab is either part of it or the owner of it.
  *        
  *	@return nothing
  */
  async actionCheck(){
    await this.isUserOwner();
    this.isPartOf();
  }

  /**
  * @author Edwin Quintuna
  * 
  *	@brief Will check if the user viewing the collab is the owner of the collab.
  *        
  *	@return nothing
  */
  isUserOwner(){
    
    if(this.collabData.owner == this.userData['username']){
      this.isOwner = true;
    } else {
      this.isOwner = false;
    }
  }

  /**
  * @author Edwin Quintuna
  * 
  *	@brief Will check if the user viewing the collab is part of the collab.
  *        
  *	@return nothing
  */    
  isPartOf(){

    for(let member of this.collabData.members){
      if(member == this.userData['username']){
        this.partOf = true;
      }
    }
  }

  /**
  * @author Edwin Quintuna
  * 
  *	@brief getter for 'partOf'
  *        
  *	@return true or false depending on whether a user is part of a collab
  */ 
  checkPartOf(){
    return this.partOf;
  }

  /**
  * @author Edwin Quintuna
  * 
  *	@brief getter for 'isOwner'
  *        
  *	@return true or false depending on whether a user is the owner of the collab
  */ 
  checkOwner(){
    return this.isOwner;
  }
  
  /**
  * @author Edwin Quintuna
  * 
  *	@brief , Method that will use the collabService to make an http request to join a collab
  * 
  * @pre collab will have x amount of members on its list
  * @post if not full and http request is succesful, add member to the collaboration.
  *
  *	@return nothing
  */
  joinCollab(){

    this.collabService.joinCollab(this.collabData._id)
      .subscribe(res => { 
        if(res['success'] == true){
          this.partOf = true;
          this.getUpdatedData();
        } else {
          
        }
      });
  }

  /**
  * @author Edwin Quintuna
  * 
  *	@brief ,  Method that will use the collabService to make an http request to leave a collab
  *
  * @pre collab will have x amount of members on its list
  * @post if the member is the owner, change collaboration owner and then remove member
  *       if the member is the last member of the collaboration, remove member and delete the collaboration
  *
  *	@return nothing.
  */
  leaveCollab(){
    this.collabService.leaveCollab(this.collabData._id)
      .subscribe(res => { 
        if(res['success'] == true){
          this.partOf = false;
          this.getUpdatedData();
        } else {
          
        } 
      });
  }

  /**
  * @author Edwin Quintuna
  * 
  *	@brief ,   Method that will use the collabService to make an http request to delete a collab
  *
  * @pre collaboration is shown to the user
  * @post collaboration is removed from the view and the page is reloaded
  * 
  *	@return nothing
  */
  deleteCollab(){
    this.collabService.deleteCollab(this.collabData._id)
      .subscribe(res => { 
        console.log(res)
        if(res){
          window.location.reload();
        }
      })
  }

  /**
  * @author Edwin Quintuna
  * 
  *	@brief , Function that will redirect to the editcollab component and pass the collaboration's id as a url parameter
  *
  *	@return nothing.
  */
  editCollab(){
    this.router.navigate(['/home/editcollab/',this.collabData._id["$oid"]]);
  }

  /**
  * @author Edwin Quintuna
  * 
  *	@brief , Function that will retrieve the data for a similar collaboration. Then this datais mapped to the variable 'collabData'
  *
  *	@return nothing.
  */
  getUpdatedData(){
    this.collabService.getSingleCollab(this.collabData._id["$oid"]).subscribe(
      res => {
        console.log(res['0'],
        this.collabData = res['0'])
      }
    );
  }

  /**
  * @author Edwin Quintuna
  * 
  *	@brief , Method that will change variable 'panelOpenState1' to true, which in turn opens up a drop down menu in the view
  *          In this drop down the table from makeTable will be displayed
  *
  *	@return nothing.
  */
  panelWasOpen1(){
    this.panelOpenState1 = true;
    this.makeTable()
  }

  /**
  * @author Edwin Quintuna
  * 
  *	@brief , Method that will change variable 'panelOpenState2' to true, which in turn opens up a drop down menu in the view
  *          In this drop down buttons 'Join', 'Leave', 'Edit', and 'Delete' will show depending on the values of 'partOf' and 'isOwner'
  *
  *	@return nothing.
  */
  panelWasOpen2(){
    this.panelOpenState2 = true;
    this.actionCheck();
  }

  


}
