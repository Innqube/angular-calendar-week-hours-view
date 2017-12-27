import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CalendarWeekHoursViewComponent} from './calendar-week-hours-view.component';

describe('AngularCalendarWeekHoursViewComponent', () => {
    let component: CalendarWeekHoursViewComponent;
    let fixture: ComponentFixture<CalendarWeekHoursViewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CalendarWeekHoursViewComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CalendarWeekHoursViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
