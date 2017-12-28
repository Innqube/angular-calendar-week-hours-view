# AngularCalendarWeekHoursView

This project aims to provide an alternative view to those already provided on [Angular Calendar](https://github.com/mattlewis92/angular-calendar).

It probably won't receive much support from me (@diegofsza), so you're encouraged to enhance it in any reasonable way and send pull requests.

## How it looks

![Example](https://lh5.googleusercontent.com/Etg4dK6AxEpulp5lP6NBnYRDJRzf5LrzB1Cmwa6c_W8Ccj5LtTPofP4LPwOPZKTiVD1DaO5b88tecpC4hjBt=w1440-h787-rw)

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

You should also include the scss file in your styles array in the .angular-cli.json file

```javascript
"../node_modules/angular-calendar-week-hours-view/angular-calendar-week-hours-view.scss"
```
