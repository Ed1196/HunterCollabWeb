import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserPageComponent } from './user-page/user-page.component';


/**
* @author Edwin Quintuna
* 
*	@brief Configure the routes for the feature module. Once loaded, we have 
*        access to the components declared in the feature module
*
*	@param[routes] ,  array that will contain our routes
*	@param[path]       ,  string that will redirect to the module specified on 'loadChildren'
*	@param[component]       , component to be loaded depending on the 'path' that was taken
*	@return nothing
*/
const routes: Routes = [
  {
    //Path to UserPageComponent, which places the parameter ':username' in the path
    //':username' will be used to retrieve that specific users data 
    path:':username',
    component: UserPageComponent
  },
  {
    //This is the default path the user will enter if the url is /user
    path:'',
    component: UserPageComponent

  }
];

@NgModule({
  //Lets angular know that the route list is only responsible 
  //for providing additional routes and intended for feature modules
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
