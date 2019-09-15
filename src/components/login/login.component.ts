import { Component, OnInit, OnDestroy } from '@angular/core';

import { GoogleLoginProvider } from 'angularx-social-login';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'src/services';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private toastService: ToastrService,
    public translate: TranslateService) { }

  public signInWithGoogle(): void {
    this.authenticationService.loginWithGoogle()
    .then(user => {
      localStorage.setItem('token', user.idToken);
      this.router.navigate(['dashboard']);
    }, error => {
      this.toastService.error(error);
    })
    .catch(error => {
      this.toastService.error(error);
    });
  }

  ngOnInit() {
    this.authenticationService.isLogged()
    .toPromise()
    .then(isLogged => {
      if (isLogged) {
        this.authenticationService.logoutOfGoogle()
        .then(() => {
          localStorage.clear();
        }, error => {
          this.toastService.error(error);
        })
        .catch(error => {
          this.toastService.error(error);
        });
      }
    });
  }

}
