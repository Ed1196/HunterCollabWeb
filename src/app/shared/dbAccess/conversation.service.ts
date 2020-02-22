import { Message } from './../models/message.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CollabModel } from '../models/collab.model';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  readonly rootUrl = 'http://13.58.204.157:5000';
  constructor(private http: HttpClient) { }
  
  //send group message to collab group
  sendMessageToCollabGroup(message , collabID){
    const body : Message ={
      message   : message,
      collabId  : collabID
    }
    return this.http.post(this.rootUrl+"/messaging/sendMessage",body)
  }

  //send personal message to collab members
  sendPersonalMessage( message , recipient){
    const body : Message ={
      message   : message,
      recipient : recipient
    }
    console.log(message+" "+ recipient)
    return this.http.post(this.rootUrl+"/messaging/sendMessage",body)

  }

  //return current user conversations
  myCoversations(){ 
    return this.http.get( this.rootUrl +"/messaging/myConvos");
  }

  getMessages(ident, collab: boolean): Observable<Message[]> {
    if (collab) {
      const body={
        page      : 0,
        collabId : ident
      }
      return this.http.post<Message[]>(this.rootUrl+"/messaging/getMessages",body)
    } else {
      const body={
        page      : 0,
        otherUser : ident
      }
      return this.http.post<Message[]>(this.rootUrl+"/messaging/getMessages",body)
    }
  }

  /**
    page should be 0, 1, 2, 3, et cetera.
    If you set page = 0, it will return the latest 20 messages.
    If you set page = 1, it will skip the latest 20 messages and return the next 20 messages.
    If you set page = 2, it will skip the latest 40 messages and return the next 20 messages.
    …. You get the idea.

    otherUser should be the other user’s username 
   */
  LoadOtherUserMessage(page:number, otherUser:string){
    const body={
      page      : page,
      otherUser : otherUser
    }
    return this.http.post(this.rootUrl+"/messaging/getMessages",body)
  }
  
  LoadGroupMessage(page:number, CollabId:string){
    const body={
      page      : page,
      collabId  : CollabId
    }
    return this.http.post(this.rootUrl+"/messaging/getMessages",body)
  }



}
