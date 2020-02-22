import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CollabModel } from '../models/collab.model';
import { Observable } from 'rxjs/Observable';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CollabsService {

  readonly rootUrl = 'http://13.58.204.157:5000';
  constructor(private http: HttpClient) { }

  /**
  * 
  * @author Edwin Quintuna
  * 
  *	@deprecated , Not used.
  */
  collabDetails(){ 
    return this.http.get( this.rootUrl +"/collab/getCollabDetails");
  }
  /**
  * 
  * @author Edwin Quintuna
  * 
  *	@deprecated , Not used.
  */
  allCollabs(): Observable<CollabModel[]> { 
    return this.http.get<CollabModel[]>( this.rootUrl +"/collab/getAllCollabs");
  }
  
  /**
  * 
  * @author Edwin Quintuna
  * 
  *	@deprecated , Not used.
  */
  activeCollabs(){ 
    return this.http.get( this.rootUrl +"/collab/getActiveCollabs");
  }
  
  /**
  * 
  * @author Edwin Quintuna
  * 
  *	@deprecated , Not used.
  */
  myCollabs(){ 
    return this.http.get( this.rootUrl +"/messaging/myConvos");
  }

  /**
  * @author Edwin Quintuna
  * 
  *	@brief , Function that retrieve collaboration depending on the category specified by 'collabType'.
  * @param['collabType'] , string that specifies the type of collab that needs to be retrieved from the database
  *
  *	@return Observable with server response containing an array with a list of collaborations.
  */
  getCollabs(collabType: string){
    return this.http.get( this.rootUrl + "/collab/" + collabType);
  }

  /**
  * @author Edwin Quintuna
  * 
  *	@brief , Function that retrieve a single collaboration
  * @param['_id'] , specify the collaboration to be retrieved
  *
  *	@return Observable with server response containing an a single collaboration.
  */
  getSingleCollab(_id: string){
    
    const body = {
      id : _id
     }
     
    //console.log(body); 
    return this.http.post(this.rootUrl + "/collab/getCollab", body );
  }

  //______________POST_REQUEST____________

  /**
  * @author Edwin Quintuna
  * 
  *	@brief , Function that make a post request to create a collaboration with the data from CollabModel
  * @param['collabData'] , Model that will contain all of the fields needed to create a collab
  *
  *	@return Observable with server response, 'success: true' if creating a collab was succesful.
  */
  createCollab(collabData: CollabModel) {

    const body: CollabModel = {
      size : collabData.size,
      date : collabData.date,
      duration : collabData.duration,
      location : collabData.location,
      title: collabData.title,
      description: collabData.description,
      classes: collabData.classes,
      skills: collabData.skills,
    }
    return this.http.post(this.rootUrl + "/collab/createCollab", body);
  }

  /**
  * @author Edwin Quintuna
  * 
  *	@brief , Function that make a post request to add the current user to the list of members
  * @param['id'] , specify the collaboration to be retrieved
  * 
  * @pre collab will have x amount of members on its list
  * @post if not full and http request is succesful, add member to the collaboration
  *
  *	@return Observable with server response, 'success: true' if joining a collab was succesful.
  */
  joinCollab(id){

    //console.log(id["$oid"]);
    const body = {
     id : id["$oid"]
    }
    return this.http.post(this.rootUrl + "/collab/joinCollab", body);
  }

  /**
  * @author Edwin Quintuna
  * 
  *	@brief , Function that make a post request to remove the current user from the list of members
  * @param['id'] , specify the collaboration to be retrieved
  * 
  * @pre collab will have x amount of members on its list
  * @post if the member is the owner, change collaboration owner and then remove member
  *       if the member is the last member of the collaboration, remove member and delete the collaboration
  *
  *	@return Observable with server response, 'success: true' if leaving a collab was succesful.
  */
  leaveCollab(id){

    //console.log(id["$oid"]);
    const body = {
     id : id["$oid"]
    }
    return this.http.post(this.rootUrl + "/collab/leaveCollab", body);
  }

  /**
  * @author Edwin Quintuna
  * 
  *	@brief , Function that make a delete request to remove a collaboration from the database
  * @param['id'] , specify the collaboration to be retrieved
  * 
  * @pre collaboration is on the database
  * @post collaboration is removed from the database
  * 
  *	@return Observable with server response, 'success: true' if leaving a collab was succesful.
  */
  deleteCollab(id){

    const body = {
      id : id["$oid"]
    }
    return this.http.request('delete',this.rootUrl + "/collab/deleteCollabForReal", {body});
  }

  /**
  * @author Edwin Quintuna
  * 
  *	@brief , Function that retrieve collaboration depending on the classes and skills of the current user
  * @param['classes'] , string array that holds the users known classes
  * @param['skills'] , string array that  holds the users known skills
  *
  *	@return Observable with server response containing an array with a list of recommended collaborations.
  */
  getReqCollabs(classes: string[], skills: string[]){
    //console.log(classes);
    //console.log(skills);

    const body = {
      classes : classes,
      skills  : skills
    }

    return this.http.post(this.rootUrl + "/collab/getRecommendedCollabs", body);
  }

/**
  * @author Edwin Quintuna
  * 
  *	@brief , Function that will update a collaboration with data from CollabModel
  * @param['collabData'] , Model that will contain all of the fields needed to create a collab
  * @param['id'] , string that holds the id of the collaboration that will be edited
  *
  *	@return Observable with server response, 'success: true' if edit a collab was succesful.
  */
  editCollab(collabData: CollabModel, id: string){

      let date = new Date(collabData.date).getTime();
      let duration = new Date(collabData.duration).getTime();
      //console.log("duration:" +collabData.size);

  

      const body = {
          id : collabData._id,
          size : collabData.size,
          date : date,
          duration : duration,
          location : collabData.location,
          title: collabData.title,
          description: collabData.description,
          classes: collabData.classes,
          skills: collabData.skills,
          applicants  : collabData.applicants
      }
      return this.http.post(this.rootUrl + "/collab/editCollab",body)
  }

    
    


}

