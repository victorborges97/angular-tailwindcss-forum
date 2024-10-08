// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Role, RolePermissions } from 'src/app/auth/roles';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/services/auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(
        private authService: AuthService,
        private router: Router,
        private location: Location,
        private toastr: ToastrService,
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        this.authService.loadUserFromStorage();

        if (this.authService.isLogged()) {
            console.log("isLogged");
            const action = ((route.data['action'] ?? "").toString()) as keyof (typeof RolePermissions)[Role];
            console.log('action: ', action);
            if (this.authService.hasPermission(action)) {
                return true;
            } else {
                console.log('not permission action: ', action);
                this.toastr.warning("Sem permissão de acesso!", "Alerta");
                this.location.back();
                return false;
            }
        } else {
            console.log('not logged: ');
            this.toastr.warning("Por favor, faça login primeiro!", "Alerta");
            this.router.navigate(['/sign-in'], { queryParams: { returnUrl: state.url } });
            return false;
        }
    }
}
