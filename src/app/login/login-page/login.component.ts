import { UserService } from '../../shared/dbAccess/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component , OnInit} from '@angular/core';
import {Router } from '@angular/router';

//Material
import { MatButtonModule } from '@angular/material/button';
import { LogInModel } from 'src/app/shared/models/login.model';




@Component({

  selector: 'app-name-editor',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
 
})


export class LoginComponent implements OnInit {
 
 user: LogInModel;
  form: FormGroup;
  hide: boolean;

  isLoginError : boolean;

  /**
  * @author Edwin Quintuna
  * 
  *	@brief Constructor that will create an instance of LoginComponent 
  *        and allow us to inject our dependencies; services that will be needed in the component
  *
  *	@param[userService]  ,  service that will handle both retrival and updating user data via http requests
  *	@param[router]  ,  An NgModule that provides navigation and URL manipulation capabilities
  *	@param[formBuilder]       ,  Creates an AbstractControl from a user-specified configuration
  *	@return nothing
  */
  constructor(private formBuilder: FormBuilder,
              private userService : UserService,
              private router : Router) 
  {
    this.user = new LogInModel();
    this.hide = true;
   }

  /**
  * @author Edwin Quintuna
  * 
  *	@brief Function that will be called once Angular has finished initializing and setting up the component
  *        This function is async as we need to wait for data to be retrieved before setting values or doing logic
  * 
  * @pre  , form is not built
  * @post , form is built with child controls username, passwor. Validators for each AbstractControlOption are specified.
  *         These fields are connected to the HTML fields that have the same formControlName as the child control.
  * 
  *	@return nothing
  */ 
   ngOnInit(){
      this.form = this.formBuilder.group({
      username: [this.user.username, 
        [Validators.required, Validators.email
      ]],
      password: [this.user.password, [
        Validators.required,
        Validators.minLength(6),
      ]]
    });
  }

  
  
  /**
  * @author Edwin Quintuna
  * 
  *	@brief Function that will call the UserService to update user details, once thats done return to UserPageComponent
  *
  * @pre All fields on the Angular Form has to be field in an in the correct format
  * @post userService will be called to make an http request to attempt to log in a user with the credentails from
  *       the Angular Form. If passwords match and the http request is succesful, the user will be logged in and the 
  *       user will be taken to the home screen
  * 
  *	@return nothing
  */
  onSubmit() {

      this.user = Object.assign({}, this.form.value);

    this.userService.userAuthentication(this.user.username,this.user.password)
    .subscribe((data : any)=>{
      
      if(data.success){
        //storing json object to localStorage
        localStorage.setItem('accessToken', data.token);
        this.router.navigate(['/home']);
        //console.log ( this.user.username + "  logged-in"); 
      }
      else{ 
         alert(data.error);
         this.router.navigate(['/login']);
    }; 
      return;
      
    });
    
  }
 
  /**
  * @author Edwin Quintuna
  * 
  *	@brief Function that router to another page
  *
  * @pre User is in the login page
  * @post User is taken to the register page
  * 
  *	@return nothing
  */
  register(){
      this.router.navigate(['/register']);
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
 
}