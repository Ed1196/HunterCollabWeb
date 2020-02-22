import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserPageComponent } from './user-page/user-page.component';

//Material Components
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule }  from '@angular/material/grid-list';
import { MatListModule }  from '@angular/material/list';
import { EditUserFormComponent } from './edit-user-form/edit-user-form.component';
import { EditClassesComponent } from './edit-classes/edit-classes.component';
import { EditSkillsComponent } from './edit-skills/edit-skills.component';
import { EditPictureComponent } from './edit-picture/edit-picture.component';

@NgModule({
  declarations: [UserPageComponent, EditUserFormComponent, EditClassesComponent, EditSkillsComponent, EditPictureComponent],
  imports: [
    CommonModule,
    UserRoutingModule,

    //Angular Material
    MatTabsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatGridListModule,
    MatListModule,
    ScrollDispatchModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatExpansionModule,
    MatDialogModule,

    //Flex Module
    FlexLayoutModule,

    //Template Driven Forms
    FormsModule,

    //
    ReactiveFormsModule,

  ],
  //Array that is used to define only components that are not found in html and created dynamically with ComponentFactoryResolver
  //Angular Material Dialoge will display these components
  entryComponents: [
    EditUserFormComponent,
    EditClassesComponent,
    EditSkillsComponent,
    EditPictureComponent
  ]
})
export class UserModule { }
