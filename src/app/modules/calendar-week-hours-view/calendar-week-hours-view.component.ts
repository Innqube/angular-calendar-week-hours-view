import {
    ChangeDetectorRef, Component, EventEmitter, Inject, Input, LOCALE_ID, OnChanges, OnDestroy, OnInit, Output,
    TemplateRef
} from '@angular/core';
import {CalendarEvent, DayViewHour, DayViewHourSegment, WeekDay, WeekViewEvent, WeekViewEventRow} from 'calendar-utils';
import {Subject} from 'rxjs/Subject';
import {ResizeEvent} from 'angular-resizable-element';
import {addDays} from 'date-fns';
import {Subscription} from 'rxjs/Subscription';
import {CalendarEventTimesChangedEvent, CalendarUtils} from 'angular-calendar';
import {WeekViewEventResize} from 'angular-calendar/modules/week/calendar-week-view.component';
import {validateEvents} from 'angular-calendar/modules/common/util';
import {CalendarResizeHelper} from 'angular-calendar/modules/common/calendar-resize-helper.provider';
import {CalendarDragHelper} from 'angular-calendar/modules/common/calendar-drag-helper.provider';

@Component({
    selector: 'iq-calendar-week-hours-view',
    template: `
        <div class="cal-week-hours-view" #weekViewContainer>
            <iq-calendar-week-hours-view-header
                [days]="days"
                [locale]="locale"
                [customTemplate]="headerTemplate"
                (dayHeaderClicked)="dayHeaderClicked.emit($event)"
                (eventDropped)="eventTimesChanged.emit($event)">
            </iq-calendar-week-hours-view-header>
            <div class="cal-days-container">
                <div class="cal-day-container">
                    <div class="cal-day-view">
                        <div class="cal-hour-rows">
                            <div class="cal-events">
                                <div class="cal-hour"
                                     [class.cal-week-hour-even]="i % 2 === 0"
                                     [class.cal-week-hour-odd]="i % 2 === 1"
                                     *ngFor="let hour of hours; let i = index">
                                    <iq-calendar-week-hours-day-view-hour-segment
                                        *ngFor="let segment of hour.segments"
                                        [style.height.px]="hourSegmentHeight"
                                        [segment]="segment"
                                        [segmentHeight]="hourSegmentHeight"
                                        [locale]="locale"
                                        [customTemplate]="hourSegmentTemplate"
                                        [class.cal-drag-over]="segment.dragOver"
                                        mwlDroppable
                                        (dragEnter)="segment.dragOver = true"
                                        (dragLeave)="segment.dragOver = false"
                                        (drop)="segment.dragOver = false; eventDropped($event, segment)">
                                    </iq-calendar-week-hours-day-view-hour-segment>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="cal-day-container" *ngFor="let day of days">
                    <iq-calendar-week-hours-day-view [dayStartHour]="dayStartHour"
                                                     [dayStartMinute]="dayStartMinute"
                                                     [dayEndHour]="dayEndHour"
                                                     [dayEndMinute]="dayEndMinute"
                                                     [events]="events"
                                                     [viewDate]="day.date"
                                                     [hourSegments]="hourSegments"
                                                     [hourSegmentHeight]="hourSegmentHeight"
                                                     [eventWidth]="(weekViewContainer.offsetWidth / 8) / 2"
                                                     (eventClicked)="eventClicked.emit($event)"
                                                     (hourSegmentClicked)="hourSegmentClicked.emit($event)"
                                                     (eventTimesChanged)="eventTimesChanged.emit($event)">
                    </iq-calendar-week-hours-day-view>
                </div>
            </div>
        </div>
    `
})
export class CalendarWeekHoursViewComponent implements OnChanges, OnInit, OnDestroy {
    /**
     * The current view date
     */
    @Input() viewDate: Date;

    /**
     * An array of events to display on view
     * The schema is available here:
     * https://github.com/mattlewis92/calendar-utils/blob/c51689985f59a271940e30bc4e2c4e1fee3fcb5c/src/calendarUtils.ts#L49-L63
     */
    @Input() events: CalendarEvent[] = [];

    /**
     * An array of day indexes (0 = sunday, 1 = monday etc) that will be hidden on the view
     */
    @Input() excludeDays: number[] = [];

    /**
     * An observable that when emitted on will re-render the current view
     */
    @Input() refresh: Subject<any>;

    /**
     * The locale used to format dates
     */
    @Input() locale: string;

    /**
     * The placement of the event tooltip
     */
    @Input() tooltipPlacement = 'bottom';

    /**
     * A custom template to use for the event tooltips
     */
    @Input() tooltipTemplate: TemplateRef<any>;

    /**
     * Whether to append tooltips to the body or next to the trigger element
     */
    @Input() tooltipAppendToBody = true;

    /**
     * The start number of the week
     */
    @Input() weekStartsOn: number;

    /**
     * A custom template to use to replace the header
     */
    @Input() headerTemplate: TemplateRef<any>;

    /**
     * A custom template to use for week view events
     */
    @Input() eventTemplate: TemplateRef<any>;

    /**
     * A custom template to use for event titles
     */
    @Input() eventTitleTemplate: TemplateRef<any>;

    /**
     * The precision to display events.
     * `days` will round event start and end dates to the nearest day and `minutes` will not do this rounding
     */
    @Input() precision: 'days' | 'minutes' = 'days';

    /**
     * An array of day indexes (0 = sunday, 1 = monday etc) that indicate which days are weekends
     */
    @Input() weekendDays: number[];

    /**
     * The day start hours in 24 hour time. Must be 0-23
     */
    @Input() dayStartHour = 0;

    /**
     * The day start minutes. Must be 0-59
     */
    @Input() dayStartMinute = 0;

    /**
     * The day end hours in 24 hour time. Must be 0-23
     */
    @Input() dayEndHour = 23;

    /**
     * The day end minutes. Must be 0-59
     */
    @Input() dayEndMinute = 59;

    /**
     * The number of segments in an hour. Must be <= 6
     */
    @Input() hourSegments = 2;

    /**
     * The height in pixels of each hour segment
     */
    @Input() hourSegmentHeight = 30;

    /**
     * A custom template to use to replace the hour segment
     */
    @Input() hourSegmentTemplate: TemplateRef<any>;

    /**
     * Called when a header week day is clicked.
     * Adding a `cssClass` property on `$event.day` will add that class to the header element
     */
    @Output()
    dayHeaderClicked: EventEmitter<{ day: WeekDay }> = new EventEmitter<{
        day: WeekDay;
    }>();

    /**
     * Called when the event title is clicked
     */
    @Output()
    eventClicked: EventEmitter<{ event: CalendarEvent }> = new EventEmitter<{
        event: CalendarEvent;
    }>();

    /**
     * Called when an hour segment is clicked
     */
    @Output()
    hourSegmentClicked: EventEmitter<{ date: Date }> = new EventEmitter<{
        date: Date;
    }>();

    /**
     * Called when an event is resized or dragged and dropped
     */
    @Output()
    eventTimesChanged: EventEmitter<CalendarEventTimesChangedEvent> = new EventEmitter<CalendarEventTimesChangedEvent>();

    /**
     * An output that will be called before the view is rendered for the current week.
     * If you add the `cssClass` property to a day in the header it will add that class to the cell element in the template
     */
    @Output()
    beforeViewRender: EventEmitter<{ header: WeekDay[] }> = new EventEmitter();

    /**
     * @hidden
     */
    hours: DayViewHour[] = [];

    /**
     * @hidden
     */
    days: WeekDay[];

    /**
     * @hidden
     */
    eventRows: WeekViewEventRow[] = [];

    /**
     * @hidden
     */
    refreshSubscription: Subscription;

    /**
     * @hidden
     */
    currentResizes: Map<WeekViewEvent, WeekViewEventResize> = new Map();

    /**
     * @hidden
     */
    validateDrag: (args: any) => boolean;

    /**
     * @hidden
     */
    validateResize: (args: any) => boolean;

    /**
     * @hidden
     */
    dayColumnWidth: number;

    /**
     * @hidden
     */
    constructor(private cdr: ChangeDetectorRef,
                private utils: CalendarUtils,
                @Inject(LOCALE_ID) locale: string) {
        this.locale = locale;
    }

    /**
     * @hidden
     */
    ngOnInit(): void {
        if (this.refresh) {
            this.refreshSubscription = this.refresh.subscribe(() => {
                this.refreshAll();
                this.cdr.markForCheck();
            });
        }
    }

    /**
     * @hidden
     */
    ngOnChanges(changes: any): void {
        if (changes.viewDate || changes.excludeDays || changes.weekendDays) {
            this.refreshHeader();
        }

        if (changes.events) {
            validateEvents(this.events);
        }

        if (changes.events || changes.viewDate || changes.excludeDays) {
            this.refreshBody();
        }

        if (
            changes.viewDate ||
            changes.dayStartHour ||
            changes.dayStartMinute ||
            changes.dayEndHour ||
            changes.dayEndMinute
        ) {
            this.refreshHourGrid();
        }
    }

    /**
     * @hidden
     */
    ngOnDestroy(): void {
        if (this.refreshSubscription) {
            this.refreshSubscription.unsubscribe();
        }
    }

    /**
     * @hidden
     */
    resizeStarted(weekViewContainer: HTMLElement,
                  weekEvent: WeekViewEvent,
                  resizeEvent: ResizeEvent): void {
        this.currentResizes.set(weekEvent, {
            originalOffset: weekEvent.offset,
            originalSpan: weekEvent.span,
            edge: typeof resizeEvent.edges.left !== 'undefined' ? 'left' : 'right'
        });
        this.dayColumnWidth = this.getDayColumnWidth(weekViewContainer);
        const resizeHelper: CalendarResizeHelper = new CalendarResizeHelper(
            weekViewContainer,
            this.dayColumnWidth
        );
        this.validateResize = ({rectangle}) =>
            resizeHelper.validateResize({rectangle});
        this.cdr.markForCheck();
    }

    /**
     * @hidden
     */
    resizing(weekEvent: WeekViewEvent,
             resizeEvent: ResizeEvent,
             dayWidth: number): void {
        const currentResize: WeekViewEventResize = this.currentResizes.get(
            weekEvent
        );

        if (resizeEvent.edges.left) {
            const diff: number = Math.round(+resizeEvent.edges.left / dayWidth);
            weekEvent.offset = currentResize.originalOffset + diff;
            weekEvent.span = currentResize.originalSpan - diff;
        } else if (resizeEvent.edges.right) {
            const diff: number = Math.round(+resizeEvent.edges.right / dayWidth);
            weekEvent.span = currentResize.originalSpan + diff;
        }
    }

    /**
     * @hidden
     */
    resizeEnded(weekEvent: WeekViewEvent): void {
        const currentResize: WeekViewEventResize = this.currentResizes.get(
            weekEvent
        );

        let daysDiff: number;
        if (currentResize.edge === 'left') {
            daysDiff = weekEvent.offset - currentResize.originalOffset;
        } else {
            daysDiff = weekEvent.span - currentResize.originalSpan;
        }

        weekEvent.offset = currentResize.originalOffset;
        weekEvent.span = currentResize.originalSpan;

        let newStart: Date = weekEvent.event.start;
        let newEnd: Date = weekEvent.event.end;
        if (currentResize.edge === 'left') {
            newStart = addDays(newStart, daysDiff);
        } else if (newEnd) {
            newEnd = addDays(newEnd, daysDiff);
        }

        this.eventTimesChanged.emit({newStart, newEnd, event: weekEvent.event});
        this.currentResizes.delete(weekEvent);
    }

    /**
     * @hidden
     */
    eventDragged(weekEvent: WeekViewEvent,
                 draggedByPx: number,
                 dayWidth: number): void {
        const daysDragged: number = draggedByPx / dayWidth;
        // TODO - remove this check once https://github.com/mattlewis92/angular-draggable-droppable/issues/21 is fixed
        if (daysDragged !== 0) {
            const newStart: Date = addDays(weekEvent.event.start, daysDragged);
            let newEnd: Date;
            if (weekEvent.event.end) {
                newEnd = addDays(weekEvent.event.end, daysDragged);
            }

            this.eventTimesChanged.emit({newStart, newEnd, event: weekEvent.event});
        }
    }

    /**
     * @hidden
     */
    getDayColumnWidth(eventRowContainer: HTMLElement): number {
        return Math.floor(eventRowContainer.offsetWidth / this.days.length);
    }

    /**
     * @hidden
     */
    dragStart(weekViewContainer: HTMLElement, event: HTMLElement): void {
        this.dayColumnWidth = this.getDayColumnWidth(weekViewContainer);
        const dragHelper: CalendarDragHelper = new CalendarDragHelper(
            weekViewContainer,
            event
        );
        this.validateDrag = ({x, y}) =>
            this.currentResizes.size === 0 && dragHelper.validateDrag({x, y});
        this.cdr.markForCheck();
    }

    private refreshHeader(): void {
        this.days = this.utils.getWeekViewHeader({
            viewDate: this.viewDate,
            weekStartsOn: this.weekStartsOn,
            excluded: this.excludeDays,
            weekendDays: this.weekendDays
        });
        this.beforeViewRender.emit({
            header: this.days
        });
    }

    private refreshBody(): void {
        this.eventRows = this.utils.getWeekView({
            events: this.events,
            viewDate: this.viewDate,
            weekStartsOn: this.weekStartsOn,
            excluded: this.excludeDays,
            precision: this.precision,
            absolutePositionedEvents: true
        });
    }

    private refreshHourGrid(): void {
        this.hours = this.utils.getDayViewHourGrid({
            viewDate: this.viewDate,
            hourSegments: this.hourSegments,
            dayStart: {
                hour: this.dayStartHour,
                minute: this.dayStartMinute
            },
            dayEnd: {
                hour: this.dayEndHour,
                minute: this.dayEndMinute
            }
        });
    }

    private refreshAll(): void {
        this.refreshHeader();
        this.refreshBody();
        this.refreshHourGrid();
    }

    eventDropped(dropEvent: { dropData?: { event?: CalendarEvent } },
                 segment: DayViewHourSegment): void {
        if (dropEvent.dropData && dropEvent.dropData.event) {
            this.eventTimesChanged.emit({
                event: dropEvent.dropData.event,
                newStart: segment.date
            });
        }
    }
}
