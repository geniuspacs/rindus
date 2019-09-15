import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from 'src/services';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    req = req.clone({
      setHeaders: {
        'Authorization': 'Token ' + localStorage.getItem('token'),
      },
    });

    return next.handle(req)
      .pipe(catchError(error => {
        if (error instanceof HttpErrorResponse) {
          if (error.status === 401) {
            localStorage.clear();
            this.router.navigate(['login']);
          }
        }

        return throwError(error);
      }));
  }
}
