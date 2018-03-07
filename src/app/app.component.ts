import {Component} from '@angular/core';
import {addDays, addHours, endOfDay, endOfMonth, isSameDay, isSameMonth, startOfDay, subDays} from 'date-fns';
import {Subject} from 'rxjs/Subject';
import {CalendarEvent, CalendarEventTimesChangedEvent} from 'angular-calendar';

const colors: any = {
    red: {
        primary: '#ad2121',
        secondary: '#FAE3E3'
    },
    blue: {
        primary: '#1e90ff',
        secondary: '#D1E8FF'
    },
    yellow: {
        primary: '#e3bc08',
        secondary: '#FDF1BA'
    }
};

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    view = 'week';
    viewDate: Date = new Date();
    refresh: Subject<any> = new Subject();
    events: CalendarEvent[] = [
        {
            start: addHours(startOfDay(new Date()), 9),
            end: addHours(startOfDay(new Date()), 10),
            title: 'Patient A',
            color: colors.yellow,
            draggable: true,
            resizable: {
                beforeStart: true,
                afterEnd: true
            }
        },
        {
            start: addHours(startOfDay(new Date()), 10.5),
            end: addHours(startOfDay(new Date()), 11.5),
            title: 'Patient C',
            color: colors.yellow,
            draggable: true,
            resizable: {
                beforeStart: true,
                afterEnd: true
            }
        },
        {
            start: addHours(startOfDay(new Date()), 11),
            end: addHours(startOfDay(new Date()), 12),
            title: 'Patient D',
            color: colors.yellow,
            draggable: true,
            resizable: {
                beforeStart: true,
                afterEnd: true
            }
        },
        {
            start: addHours(startOfDay(new Date()), 10),
            end: addHours(startOfDay(new Date()), 11),
            title: 'Patient E',
            color: colors.yellow,
            draggable: true,
            resizable: {
                beforeStart: true,
                afterEnd: true
            }
        },
        {
            start: addHours(startOfDay(new Date()), 10),
            end: addHours(startOfDay(new Date()), 11),
            title: 'Patient B',
            color: colors.yellow,
            draggable: true,
            resizable: {
                beforeStart: true,
                afterEnd: true
            }
        },
        {
            start: addHours(startOfDay(new Date()), 9.5),
            end: addHours(startOfDay(new Date()), 10.5),
            title: 'Simoultaneous',
            color: colors.red,
            draggable: true,
            resizable: {
                beforeStart: true,
                afterEnd: true
            }
        },
        {
            start: addDays(addHours(startOfDay(new Date()), 15), 1),
            end: addDays(addHours(startOfDay(new Date()), 17), 1),
            title: 'Another example',
            color: colors.blue,
            draggable: true,
            resizable: {
                beforeStart: true,
                afterEnd: true
            }
        }
    ];

    eventClicked(event) {
        console.log(event);
    }

    hourSegmentClicked(event) {
        console.log(event);
    }

    eventTimesChanged({
                          event,
                          newStart,
                          newEnd
                      }: CalendarEventTimesChangedEvent): void {
        event.start = newStart;
        event.end = newEnd;
        this.refresh.next();
    }

}
