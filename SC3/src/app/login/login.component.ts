import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router'; 
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userName: FormControl;
  password: FormControl;

  @ViewChild('content') private content;

  constructor(private loginService: LoginService, private router: Router, private modalService: NgbModal) { }

  ngOnInit() {
    this.userName = new FormControl("", Validators.required);
    this.password = new FormControl("", Validators.required);
  }

  tryLogin(){
    if(this.userName.valid && this.password.valid){
      //TODO logica de login
      this.loginService.login(this.userName.value, this.password.value).subscribe(data => {
        this.loginService.setLocalStorageToken(data['token']);
        this.router.navigate(['/home'])
      }, error => {
        this.open(this.content);
        console.log(error);
      })
    }
  }

 /**
   * Abre un modal con un botón para recargar la pantalla y volver a intentarlo porque el servidor se demoró mucho en procesar la petición o porque se demoró mucho.
   * @param content El objeto del modal
   */
  open(content) {

    var modalRef = this.modalService.open(content, { centered: true });

  }
}
