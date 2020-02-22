import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CollabMessagingComponent } from './collab-messaging/collab-messaging.component';
import { MessengerComponent } from './messenger/messenger.component';

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
      // Path to messaging page component, which places the parameter ':unameOrCollabId' in the path
      //':unameOrCollabId' will be used to retreive the appropirate messages and initating
      // the connection with the realtime messaging server.
      path:'message/:unameOrCollabId',
      component: CollabMessagingComponent
    },
    { 
      //Path that shows conversation list.
      path: '',
      component: MessengerComponent
    }
  ];
  
  @NgModule({
    //Lets angular know that the route list is only responsible 
    //for providing additional routes and intended for feature modules
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class HomeRoutingModule { }