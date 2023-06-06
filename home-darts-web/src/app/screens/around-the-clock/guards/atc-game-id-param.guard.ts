import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { regexDigits } from '@constants/regex-digits';

@Injectable()
export class AtcGameIdParamGuard {
  constructor(private router: Router) { }

  public canActivate(route: ActivatedRouteSnapshot): boolean | UrlTree {
    const gameId = route.paramMap.get('gameId');
    if (gameId !== null && regexDigits.test(gameId)) {
      return true;
    } else {
      return this.router.parseUrl('/around-the-clock');
    }
  }
}
