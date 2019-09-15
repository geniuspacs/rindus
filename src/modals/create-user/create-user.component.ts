import { Component, OnInit, Input } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {

  public createUserForm: FormGroup;

  @Input() user?: any;

  constructor(
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private toastService: ToastrService,
    public activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
    this.createUserForm = this.formBuilder.group({
      first_name: new FormControl(this.user ? this.user.first_name : '', [Validators.required, Validators.pattern('[a-zA-Z\ ]*')]),
      last_name: new FormControl(this.user ? this.user.last_name : '', [Validators.required, Validators.pattern('[a-zA-Z\ ]*')]),
      iban: new FormControl(this.user ? this.user.iban : '', [
        Validators.required,
        Validators.minLength(10),
        Validators.pattern('[a-zA-Z]{2}[0-9]{6,32}')
      ])
    });
  }

  public close() {
    this.activeModal.close();
  }

  public getErrorsField(field) {
    return Object.keys(this.createUserForm.get(field).errors || {});
  }

  public createUser(form) {
    if (form.valid) {
      if (this.user) {
        this.http.put(environment.host + '/users/' + this.user.id, form.value)
        .subscribe(result => {
          this.toastService.success('User modified succesfully');
          this.activeModal.close();
        }, error => {
          if (error.error) {
            this.toastService.error(error.error[Object.keys(error.error)[0]]);
          }
        });
      } else {
        this.http.post(environment.host + '/users', form.value)
        .subscribe(result => {
          this.toastService.success('User registered');
          this.activeModal.close();
        }, error => {
          if (error.error) {
            this.toastService.error(error.error[Object.keys(error.error)[0]]);
          }
        });
      }
      
    }
  }

}
