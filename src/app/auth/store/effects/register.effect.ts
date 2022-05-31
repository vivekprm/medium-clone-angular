import {Injectable} from '@angular/core'
import {Actions, createEffect, ofType} from '@ngrx/effects'
import {catchError, map, of, switchMap} from 'rxjs'
import {
  registerAction,
  registerFailureAction,
  registerSuccessAction,
} from 'src/app/auth/store/actions/register.action'
import {AuthService} from 'src/app/auth/services/auth.service'
import {CurrentUserInterface} from 'src/app/shared/types/currentUser.interface'
import {HttpErrorResponse} from '@angular/common/http'

@Injectable()
export class RegisterEffect {
  constructor(private actions$: Actions, private authService: AuthService) {}
  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(registerAction),
      switchMap(({request}) => {
        return this.authService.register(request).pipe(
          map((currentUser: CurrentUserInterface) => {
            return registerSuccessAction({currentUser})
          }),
          catchError((errorResponse: HttpErrorResponse) => {
            return of(
              registerFailureAction({errors: errorResponse.error.errors})
            )
          })
        )
      })
    )
  )
}
