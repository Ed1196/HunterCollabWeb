import { HomeRoutingModule } from './conversations-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollabMessagingComponent } from './collab-messaging/collab-messaging.component';

import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatChipsModule } from '@angular/material/chips';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { MatTableModule } from '@angular/material/table';
import { MatListModule } from '@angular/material/list';



//Material Components
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatStepperModule} from '@angular/material/stepper';


import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MessengerComponent } from './messenger/messenger.component';

@NgModule({
  declarations: [CollabMessagingComponent, 
    MessengerComponent
  ],
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
    OwlDateTimeModule, 
    OwlNativeDateTimeModule,
    

    FormsModule,
    ReactiveFormsModule
  ]
})
export class ConversationsModule { }
