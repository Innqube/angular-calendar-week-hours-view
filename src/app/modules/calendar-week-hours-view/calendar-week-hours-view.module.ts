import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CalendarWeekHoursViewComponent} from './calendar-week-hours-view.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    CalendarWeekHoursViewComponent
  ],
  exports: [
    CalendarWeekHoursViewComponent
  ]
})
export class CalendarWeekHoursViewModule {
}
