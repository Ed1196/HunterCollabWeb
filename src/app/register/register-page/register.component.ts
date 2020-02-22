import { UserService } from '../../shared/dbAccess/user.service';
import { Component , OnInit} from '@angular/core';
import {Router } from '@angular/router';
import { RegisterModel } from '../../shared/models/register.model';

//Needed to implement Reactive Forms
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit{
  
  user: RegisterModel;
  form: FormGroup;
  hide1: boolean;
  hide2: boolean;
  isRegiError : boolean;

  /**
  * @author Edwin Quintuna
  * 
  *	@brief Constructor that will create an instance of RegisterComponent 
  *        and allow us to inject our dependencies; services that will be needed in the component
  *
  *	@param[userService]   ,  service that will handle both retrival and updating user data via http requests
  *	@param[router]        ,  An NgModule that provides navigation and URL manipulation capabilities
  *	@param[formBuilder]   ,  Creates an AbstractControl from a user-specified configuration
  *	@return nothing
  */
  constructor(
    private userService : UserService,
    private router : Router,
    private formBuilder: FormBuilder) 
    {
      this.user = new RegisterModel();
      this.hide1 = true;
      this.hide2 = true;
     }

  /**
  * @author Edwin Quintuna
  * 
  *	@brief Function that will be called once the Angular has finished initializing and setting up the component
  *        This function is async as we need to wait for data to be retrieved before setting values or doing logic.
  *        Initializes our form using the formBuilder.
  * 
  * @pre  , form is not built
  * @post , form is built with child controls username, password and password2. Validators for each AbstractControlOption are specified.
  *         These fields are connected to the HTML fields that have the same formControlName as the child control.
  * 
  *	@return nothing
  */   
  ngOnInit() {
    this.form = this.formBuilder.group({
       username: [this.user.username, [
        Validators.required, 
        Validators.email
      ]],
       password: [this.user.password, [
        Validators.required,
        Validators.minLength(6)
      ]], 
       password2: [this.user.password2, [
        Validators.required,
        Validators.minLength(6)
      ]] 

    });
    }
  
  /**
  * @author Edwin Quintuna
  * 
  *	@brief Function that will call the UserService to update user details, once thats done return to UserPageComponent
  *
  * @pre All fields on the Angular Form has to be field in an in the correct format
  * @post userService will be called to make an http request to attempt to create a new user with the credentails from
  *       the Angular Form. If passwords match and the http request is succesful, a new user will be created and the 
  *       user will be taken to the home screen
  * 
  *	@return nothing
  */
  onSubmit() {

    this.user = Object.assign({}, this.form.value);
    
    if(this.user.password != this.user.password2){
      alert("Password did not matche!");
    }
    else
    {
      this.userService.registerUser(this.user.username , this.user.password)
      .subscribe((data: any)  =>{
            console.log ( data );
            //storing json object to localStorage
            localStorage.setItem('accessToken',data.token);

            if(data.success){

              this.router.navigate(['/home']);
              console.log ( this.user.username + " registered"); 
            }
            else{ 
                alert(data.error);
                this.router.navigate(['/register']);
            };
        });
    }
}


/**
* @author Edwin Quintuna
* 
*	@brief Getter method. In a reactive form, you can always access any form control through the get method on its parent group.
*
*	@return value of the child control 'username'
*/
get username(){
  return this.form.get('username');
}

/**
* @author Edwin Quintuna
* 
*	@brief Getter method. In a reactive form, you can always access any form control through the get method on its parent group.
*
*	@return value of the child control 'password'
*/
get password(){
  return this.form.get('password');
}

/**
* @author Edwin Quintuna
* 
*	@brief Getter method. In a reactive form, you can always access any form control through the get method on its parent group.
*
*	@return value of the child control 'password2'
*/
get password2(){
  return this.form.get('password2');
}

/**
  * @author Edwin Quintuna
  * 
  *	@brief Function that router to another page
  *
  * @pre User is in the register page
  * @post User is taken to the login page
  * 
  *	@return nothing
  */
login(){
  this.router.navigate(['/login']);
}

}