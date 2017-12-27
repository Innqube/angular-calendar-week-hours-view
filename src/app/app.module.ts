import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {CalendarWeekHoursViewModule} from './modules/calendar-week-hours-view/calendar-week-hours-view.module';
import {CalendarModule} from 'angular-calendar';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        CalendarModule.forRoot(),
        CalendarWeekHoursViewModule.forRoot()
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
}
