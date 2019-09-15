import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { SocialUser } from 'angularx-social-login';
import { Subscription } from 'rxjs';
import { AuthenticationService } from 'src/services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateUserComponent } from 'src/modals';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  public users: any = [];

  public whoami: SocialUser;

  authState: Subscription;

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService,
    private ngbModal: NgbModal,
    private toastService: ToastrService,
    private router: Router
    ) { }

  ngOnInit() {
    this.authState = this.authenticationService.getLoggedUser()
    .subscribe(user => {
      this.whoami = user;
    });

    this.loadData();
  }

  public logout() {
    this.authenticationService.logoutOfGoogle()
    .then(() => {
      localStorage.clear();
      this.router.navigate(['login']);
    });
  }

  private loadData() {
    this.http.get(environment.host + '/users')
    .subscribe(userList => {
      this.users = userList;
    });
  }

  ngOnDestroy() {
    this.authState.unsubscribe();
  }

  public openModalUser(user) {
    let modalRef = this.ngbModal.open(CreateUserComponent);
    modalRef.componentInstance.user = user;

    modalRef.result
    .then(() => this.loadData())
    .catch();
  }

  public removeItem(user) {
    this.http.delete(environment.host + '/users/' + user.id)
    .subscribe(() => {
      this.toastService.success('User deleted succesfully');
    }, error => {
      this.toastService.error('Error deleting user: ' + error);
    });
  }

}
