import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatChipsModule } from '@angular/material/chips';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';


import { HomeComponent } from './collab-list/home.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';

//Material Components
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatStepperModule} from '@angular/material/stepper';
import {MatSelectModule} from '@angular/material/select';


import { CollabCardComponent } from './collab-card/collab-card.component';
import { CollabTableComponent } from './collab-table/collab-table.component';
import { CreateCollabComponent } from './create-collab/create-collab.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { EditCollabComponent } from './edit-collab/edit-collab.component';

@NgModule({
  declarations: [HomeComponent, CollabCardComponent, CollabTableComponent, CreateCollabComponent, EditCollabComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    //Angular Material
    MatTabsModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatListModule,
    MatExpansionModule,
    MatTableModule,
    ScrollDispatchModule,
    MatChipsModule,
    MatGridListModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatSelectModule,

    //Clock
    OwlDateTimeModule, 
    OwlNativeDateTimeModule,
    
    //Forms
    FormsModule,
    ReactiveFormsModule
  ]
})
export class HomeModule { }
