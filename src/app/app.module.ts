import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {CalendarWeekHoursViewModule} from './modules/calendar-week-hours-view/calendar-week-hours-view.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CalendarWeekHoursViewModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
