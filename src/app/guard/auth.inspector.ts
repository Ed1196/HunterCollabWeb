import { Observable } from 'rxjs/Observable';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpUserEvent, HttpEvent } from "@angular/common/http";
import 'rxjs/add/operator/do';
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from '../shared/dbAccess/user.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private router: Router, private userService : UserService) { }

    // Handler: Will intercept any http request going out.
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        /* If the request doesn't need auth; use this.
        * req.headers.get('No-Auth') :  This checks the header of the request
        * next.handle(req.clone()) : clone the whole request and send it
         */
        if (req.headers.get('No-Auth') === 'True')
            return next.handle(req);

        // If we do need auth, first if will fail.
        // localStorage.getItem('accessToken') : Will check if there is a token in local storage
        if (localStorage.getItem('accessToken') != null) {
            // Copies request that was caught and adds the authorization

            const clonedreq = req.clone({
                headers: req.headers.set("Authorization", 'Bearer '.concat(localStorage.getItem('accessToken')))
            });
            
            // This sends the request that was cloned.
            return next.handle(clonedreq).do(
                // If Successful
                succ => {
                    return;
                },
                //If error
                err => {
                    if (err.status === 401) {
                        try{
                            this.userService.refreshToken().subscribe(res => {
                                localStorage.setItem('accessToken', res['accessToken'])
                                this.router.navigateByUrl('./home');
                            })
                            localStorage.removeItem('accessToken');
                            this.router.navigateByUrl('/login');
                        }
                        catch (error) {
                            localStorage.removeItem("refreshToken");
                            localStorage.removeItem("accessToken");
                            this.router.navigateByUrl("/login");
                        }
                    }
                }
                );
        }
        //If no token, send user to login.
        else {
            this.router.navigateByUrl('/login');
        }
    }
}
