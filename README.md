# AngularCalendarWeekHoursView

This project aims to provide an alternative view to those already provided on [Angular Calendar](https://github.com/mattlewis92/angular-calendar).

It probably won't receive much support from me (@diegofsza), so you're encouraged to enhance it in any reasonable way and send pull requests.

## How it looks

![Imgur](https://i.imgur.com/deXyK1Q.jpg)

## Usage

Import the module wherever you want to use the view:

```javascript
@NgModule({
    declarations: [
        ...
    ],
    imports: [
        ...,
        CalendarModule.forRoot(),
        CalendarWeekHoursViewModule,
        ...
    ],   
})
```

Use the view in your html

```html
<iq-calendar-week-hours-view
            *ngSwitchCase="'week'"
            [viewDate]="viewDate"
            [events]="events"
            [hourSegments]="2"
            [dayStartHour]="8"
            [dayEndHour]="20"
            (eventClicked)="eventClicked($event)"
            (hourSegmentClicked)="hourSegmentClicked($event)"
            (eventTimesChanged)="eventTimesChanged($event)"
            [refresh]="refresh">
        </iq-calendar-week-hours-view>
```

You should also include the scss file in your styles array in the .angular-cli.json file

```javascript
"../node_modules/angular-calendar-week-hours-view/angular-calendar-week-hours-view.scss"
```
