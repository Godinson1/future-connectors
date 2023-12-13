import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { ClientProxy } from "@nestjs/microservices";
import { catchError, lastValueFrom, Observable, tap } from "rxjs";
import { extractTokenFromHeader } from "./auth.service";
import { AUTH_SERVICE } from "./auth.service";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(@Inject(AUTH_SERVICE) private authClient: ClientProxy) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const authentication = this.getAuthentication(context);
    return lastValueFrom(
      this.authClient.send("authenticate", { Authentication: authentication }).pipe(
        tap((res) => {
          this.addUser(res, context);
        }),
        catchError(() => {
          throw new UnauthorizedException();
        })
      )
    );
  }

  private getAuthentication(context: ExecutionContext) {
    let authentication: string;
    if (context.getType() === "rpc") {
      authentication = context.switchToRpc().getData().Authentication;
    } else if (context.getType() === "http") {
      authentication = extractTokenFromHeader(context.switchToHttp().getRequest());
    }
    if (!authentication) {
      throw new UnauthorizedException("No value was provided for Authentication");
    }

    return authentication;
  }

  private addUser(user: any, context: ExecutionContext) {
    if (context.getType() === "rpc") {
      context.switchToRpc().getData().user = user;
    } else if (context.getType() === "http") {
      context.switchToHttp().getRequest().user = user;
    }
  }
}
