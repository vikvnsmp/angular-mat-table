


import {CollectionViewer, DataSource} from "@angular/cdk/collections";
import {Observable, BehaviorSubject, of} from "rxjs";
import {Lesson} from "../model/lesson";
import {CoursesService} from "./courses.service";
import {catchError, finalize} from "rxjs/operators";



export class LessonsDataSource implements DataSource<Lesson> {

    private lessonsSubject = new BehaviorSubject<Lesson[]>([]);

    private lessonsColsSubject = new BehaviorSubject<string[]>([]);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();

    public cols = this.lessonsColsSubject.asObservable();

    constructor(private coursesService: CoursesService) {

    }

    loadLessons(courseId:number,
                filter:string,
                sortDirection:string,
                pageIndex:number,
                pageSize:number) {

        this.loadingSubject.next(true);
                    debugger;
        this.coursesService.findLessons(courseId, filter, sortDirection,
            pageIndex, pageSize).pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe(
                lessons => {console.log(lessons);
                    debugger;
                    this.lessonsSubject.next(lessons);
                    this.lessonsColsSubject.next(Object.keys(lessons[0]));
                    //this.cols = Object.keys(lessons[0]);
                    //console.log("From service");
                    //console.log(this.cols);
                });

    }

    connect(collectionViewer: CollectionViewer): Observable<Lesson[]> {
        console.log("Connecting data source");
        return this.lessonsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.lessonsSubject.complete();
        this.loadingSubject.complete();
    }

}

