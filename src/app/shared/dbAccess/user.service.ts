import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { UserModel } from '../models/user.model';
import { ConversationModel } from '../models/conversation.model';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Requirements } from 'src/app/home/collab-card/collab-card.component';


@Injectable()
export class UserService {
  readonly rootUrl = 'http://13.58.204.157:5000';
  constructor(private http: HttpClient) { }
  
  /**
  * @author Edwin Quintuna
  * 
  *	@brief Function that will be retrieve token with key 'accessToken' from local storage 
  *
  *	@return accessToken
  */
  getToken(){
    return localStorage.getItem('accessToken')
  }

  /**
  * @author Edwin Quintuna
  * 
  *	@brief , Function that will authenticate a user login credentials.
  * @param['username'] , User's myhunter email 
  * @param['password] , User's password
  * 
  * @pre No auth token in local storage
  * @post Auth token stored in local storage
  *
  *	@return Observable with server response 
  */
  userAuthentication(userName: string, password: string) {
    var reqHeader = new HttpHeaders({'No-Auth':'True'});
    return this.http.get(this.rootUrl +"/auth/login?"+"username="+userName+"&password="+password, {headers : reqHeader});
  }

  /**
  * @author Edwin Quintuna
  * 
  *	@brief , Function that will register a user.
  * @param['username'] , User's myhunter email 
  * @param['password] , User's password
  * 
  * @pre No auth token in local storage
  * @post Auth token stored in local storage
  *
  *	@return Observable with server response 
  */
  registerUser(username, password ) {
    const body: UserModel = {
      username: username,
      password: password,
    }

    //This request does not need authorization 
    var reqHeader = new HttpHeaders({'No-Auth':'True'});

    //Adding Parameters
    var requestedUrl = this.rootUrl + "/user?username="+username+"&password="+password;

    //requestUrl: endpoint
    //body: Needed, but not used
    //{headers : reqHeader} : Creating object from the header library; set to non-auth 
    return this.http.put(requestedUrl , body, {headers : reqHeader});
  }

  /**
  * @author Edwin Quintuna
  * 
  *	@brief , Function that will check if there is an auth token stored in local storage.
  * 
  *	@return nothing
  */
  public isAuthenticated() : boolean {
    return localStorage.getItem('accessToken') !== null;
  }


 /**
  * @author Edwin Quintuna
  * 
  *	@brief , Function that will retrieve the current users data.
  * 
  *	@return Observable with server response containing user details, will be mapped to UserModel
  */
 getUserdetails(): Observable<UserModel> {
  return this.http.get<UserModel>( this.rootUrl +"/user");
  }

  /**
  * @author Edwin Quintuna
  * 
  *	@brief , Function that will retrieve user with the name 'username' from the database.
  * @param['username'] , User's myhunter email 
  * 
  *	@return Observable with server response containing user details, will be mapped to UserModel
  */
  getMemberdetails(username: string): Observable<UserModel> {
    return this.http.get<UserModel>( this.rootUrl +"/user/" + username);
  }

  getConversations(): Observable<ConversationModel[]> {
    return this.http.get<ConversationModel[]>( this.rootUrl + "/messaging/myConvos" );
  }

  /**
  * @author Edwin Quintuna
  * 
  *	@brief , Function that will retrieve the user's skills 
  * @param['username'] , User's myhunter email 
  *
  *	@return Observable with server response containing an array with the users skills
  */
  getUserSkills(userName: string) { 
    return this.http.get( this.rootUrl + "/user/skills/" + userName).toPromise();
  }

  /**
  * @author Edwin Quintuna
  * 
  *	@brief , Function that will retrieve the user's classes
  * @param['username'] , User's myhunter email 
  *
  *	@return Observable with server response containing an array with the users classes
  */
  getUserClasses(userName: string){ 
    return this.http.get( this.rootUrl +"/user/classes/" + userName).toPromise();
  }

  /**
  * @author Edwin Quintuna
  * 
  *	@brief , Function that will retrieve the user's skills and classes
  * @param['username'] , User's myhunter email 
  *
  *	@return Observable with server response containing an array with the users skills and classes
  */
  async getUserSkillsAndClasses(username: string){
    
    let xAxisReq: Array<string> = [];
    let classes: string[];
    let skills: string[];

    await this.getUserSkills(username).then(function(result){
      xAxisReq = result["skills"];
    });

    await this.getUserClasses(username).then(function(result){
      classes = result["classes"];
    });
    
    xAxisReq = xAxisReq.concat(classes);
    return xAxisReq;
  }

/**
* @author Edwin Quintuna
* 
*	@brief , Function that will return a list of results that match the constrain
* @param['constrain'] , string that will be parsed to find matching results for autocomplete 
*
*	@return Observable with server response containing an array with the results for autocomplete
*/
searchSkills(constrain: string): Observable<any>{
  let params = new HttpParams().set("query",constrain);
  return this.http.get(this.rootUrl +"/search/skills",{params: params});
}

/**
* @author Edwin Quintuna
* 
*	@brief , Function that will return a list of results that match the constrain
* @param['constrain'] , string that will be parsed to find matching results for autocomplete 
*
*	@return Observable with server response containing an array with the results for autocomplete
*/
searchClasses(constrain: string): Observable<any>{
  let params = new HttpParams().set("query",constrain);
  return this.http.get(this.rootUrl +"/search/classes",{params: params});
}

/**
* @author Edwin Quintuna
* 
*	@brief , Function that will return the link to the users profile picture
*
*	@return Observable with server response containing a string with the url of the users profile picture
*/
getPicture(){
  return this.http.get(this.rootUrl + "/user/profilePicture", {responseType: 'text'});
}

/**
* @author Edwin Quintuna
* 
*	@brief , Function that will return the link to the users profile picture
* @param['username'] , Specify the user who's profile picture will be retrieved
*
*	@return Observable with server response containing a string with the url of the users profile picture
*/
getMemberPicture(username: string){
  return this.http.get( this.rootUrl +"/user/profilePicture?username=" + username , {responseType: 'text'});
}

uploadProfilePicture(fileToUpload: File){
  const formData: FormData = new FormData();
  formData.append('pic', fileToUpload, fileToUpload.name);
  return this.http.post(this.rootUrl+"/user/profilePicture", formData)
}

/**
* @author Edwin Quintuna
* 
*	@brief , Function that will make a post request and update a user's data.
* @param['userData'] , Model holding the fields that need to be updated
*
*	@return Observable with server response
*/
updateUserProfile(userData: UserModel){
  const body : UserModel ={
    name : userData.username,
    github  : userData.github,
    linkedin: userData.linkedin,
  }
  return this.http.post(this.rootUrl +"/user", body)
}

/**
* @author Edwin Quintuna
* 
*	@brief , Function that will make a post request and update a user's skills.
* @param['skills'] , Array that containes a list of skills to be added to the user's list on the database
*
*	@return Observable with server response
*/
updateUserSkills(skills){
  const body : UserModel ={
    skills  :skills,
    
  }
  //console.log(body)
  return this.http.post(this.rootUrl +"/user", body)
}

/**
* @author Edwin Quintuna
* 
*	@brief , Function that will make a post request and update a user's classes.
* @param['skills'] , Array that containes a list of classes to be added to the user's list on the database
*
*	@return Observable with server response
*/
updateUserclass(classes){
  const body : UserModel ={
    classes:classes
  }
  //console.log(body)
  return this.http.post(this.rootUrl +"/user", body)

}

}
