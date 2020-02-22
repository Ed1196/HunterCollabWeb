import { CollabModel } from 'src/app/shared/models/collab.model';
import { UserService } from 'src/app/shared/dbAccess/user.service';
import { ConversationModel } from '../../shared/models/conversation.model';
import { GroupMessagingModel } from './../../shared/models/groupMessaging';
import { CollabsService } from 'src/app/shared/dbAccess/collabs.service';
import { Component, OnInit } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { Router } from '@angular/router';
import { Message } from 'src/app/shared/models/message.model';
import { UserModel } from 'src/app/shared/models/user.model';


@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.component.html',
  styleUrls: ['./messenger.component.css']
})
export class MessengerComponent implements OnInit {
  

  public user : string = null;
  public convos: ConversationModel[];
  displayNames: Map<String, String> = new Map();

  constructor(private userservice : UserService,
              private router :Router
    ) { }

  ngOnInit() {
    
    this.userservice.getUserdetails().subscribe((data:any)=>{
      this.user=data.username
      }); //Get user's name.
      
    this.userservice.getConversations().subscribe(convers => this.convos = convers);
    // Get the list of conversations.
    
  }
  
  gotoConvo(convo: ConversationModel) {
    if (convo.otherUser) {
      console.log("Goto personal convo: " + convo.otherUser);
      this.router.navigate(['/conversations/message/', convo.otherUser]);
    } else {
      console.log("Goto collab convo: " + convo._id.$oid);
      this.router.navigate(['/conversations/message/', convo._id.$oid]);
    }
  }

  

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
