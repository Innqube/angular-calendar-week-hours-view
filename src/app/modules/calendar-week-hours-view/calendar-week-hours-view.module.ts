import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CalendarWeekHoursViewComponent} from './calendar-week-hours-view.component';
import {CalendarModule} from 'angular-calendar';
import {CalendarWeekHoursViewEventComponent} from './calendar-week-hours-view-event.component';
import {CalendarWeekHoursDayViewComponent} from './calendar-week-hours-day-view.component';
import {CalendarWeekHoursDayViewHourSegmentComponent} from './calendar-week-hours-day-view-hour-segment.component';
import {CalendarWeekHoursViewHeaderComponent} from './calendar-week-hours-view-header.component';
import {ResizableModule} from 'angular-resizable-element';
import {DragAndDropModule} from 'angular-draggable-droppable';

@NgModule({
    imports: [
        CommonModule,
        CalendarModule.forRoot(),
        ResizableModule,
        DragAndDropModule.forRoot()
    ],
    declarations: [
        CalendarWeekHoursViewComponent,
        CalendarWeekHoursViewHeaderComponent,
        CalendarWeekHoursViewEventComponent,
        CalendarWeekHoursDayViewComponent,
        CalendarWeekHoursDayViewHourSegmentComponent
    ],
    exports: [
        CalendarWeekHoursViewComponent,
        CalendarWeekHoursViewHeaderComponent,
        CalendarWeekHoursViewEventComponent,
        CalendarWeekHoursDayViewComponent,
        CalendarWeekHoursDayViewHourSegmentComponent
    ]
})
export class CalendarWeekHoursViewModule {
}
