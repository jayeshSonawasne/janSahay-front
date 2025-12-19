import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';
import { ConfigService } from './core/services/config.service';
import { SocketService } from './core/services/socket.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = this.configService.title;

  constructor(
    private router: Router,
    private titleService: Title,
    private activatedRoute: ActivatedRoute,
    private configService: ConfigService,
    private socketService: SocketService,
    private snackbar: MatSnackBar
  ) {
    this.setDynamicPageTitle();
    this.scrollToTopOnNavigation();
    this.initializeGlobalSocketListeners();
  }

  private initializeGlobalSocketListeners() {
    this.socketService.onIncomingCall().subscribe((data) => {
      // Only handle if NOT on the chatbox page to avoid duplicate alerts
      if (this.router.url !== '/chatbox') {
        console.log('Global incoming call listener triggered');

        const snackBarRef = this.snackbar.open(`Incoming video call from ${data.from || 'Expert'}`, 'Accept', {
          duration: 10000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['incoming-call-snackbar']
        });

        snackBarRef.onAction().subscribe(() => {
          this.router.navigate(['/chatbox'], { state: { incomingCall: data } });
        });
      }
    });
  }

  /**
   * Sets the page title dynamically based on route data
   */
  private setDynamicPageTitle(): void {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        const currentRoute = this.getDeepestActivatedRoute(this.activatedRoute);
        const titleName = currentRoute.snapshot.data['breadcrumb'];

        if (titleName) {
          this.titleService.setTitle(titleName);
        }
      });
  }

  /**
   * Recursively finds the deepest activated route
   */
  private getDeepestActivatedRoute(route: ActivatedRoute): ActivatedRoute {
    return route.firstChild ? this.getDeepestActivatedRoute(route.firstChild) : route;
  }

  /**
   * Scrolls to top of the page on every navigation
   */
  private scrollToTopOnNavigation(): void {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        window.scrollTo(0, 0);
      });
  }
}
