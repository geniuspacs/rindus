import { Injectable } from '@angular/core';
import { AuthService, SocialUser, GoogleLoginProvider } from 'angularx-social-login';
import { Observable, of, Subscription } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(
    private authService: AuthService,
  ) { }

  public loginWithGoogle(): Promise<SocialUser> {
    return this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  public getLoggedUser(): Observable<SocialUser> {
    return this.authService.authState.pipe(user => user);
  }

  public logoutOfGoogle(): Promise<any> {
    return this.authService.signOut();
  }

  public isLogged(): Observable<boolean> {
    return this.authService.authState
      .pipe(
        flatMap(user => of(user !== null)),
        map(isLogged => isLogged)
      );
  }

}
