import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private router: Router) { }

  /**
   * Activa este guard usando [LoginGuard] en la ruta donde quieras usarlo
   * Este guard revisa si existe el token en el local storage, en caso de existir redirige al dashboard.
   * Este guard es usado para evitar que un usuario loggeado acceda al login.
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
      const token = localStorage.getItem('token');
      if (token == null) {
          this.router.navigate(['/login']);
          return false;
      }  
      return true;
  }
}
