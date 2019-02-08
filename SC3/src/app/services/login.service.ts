import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  apiURL = environment.baseUrl;

  login(username, password){
    var data = {"username": username, "password": password};
    var reqHeader = new HttpHeaders({ 'Content-Type': 'application/json'});
    return this.http.post(this.apiURL + '/api/login', data, { headers: reqHeader });
  }

  logout(){
    this.deleteLocalStorageToken();
  }

  setLocalStorageToken(token){
    localStorage.setItem('token', token);
  }

  deleteLocalStorageToken(){
    localStorage.removeItem('token');
  }
}
