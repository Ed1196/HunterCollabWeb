import { CreateCollabComponent } from './create-collab/create-collab.component';
import { CollabCardComponent } from './collab-card/collab-card.component';
import { HomeComponent } from './collab-list/home.component';
import { EditCollabComponent } from './edit-collab/edit-collab.component';

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

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
    path: '',
    component: HomeComponent
  },
  {
  path:"collabinfo",
    component: CollabCardComponent
  },
  {
    path:"createcollab",
    component: CreateCollabComponent
  },
  {
    path:"editcollab/:_id",
    component: EditCollabComponent
  }
];

@NgModule({
  //Lets angular know that the route list is only responsible 
  //for providing additional routes and intended for feature modules
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
