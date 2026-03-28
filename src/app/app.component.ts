import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Drug Free - Empowering Healthier Lives';
  isAuthPage = false;

  showIncompleteProfileAlert = false;

  constructor(private router: Router, private authService: AuthService) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects || event.url;
      this.isAuthPage = url.includes('/login') || url.includes('/register') || url.includes('/forgot-password');
    });
  }

  ngOnInit(): void {
    this.applyStoredTheme();
    this.checkUserProfile();
  }

  private checkUserProfile(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        // Assume incomplete if no phone or DOB is set, you can customize this logic
        const snoozed = localStorage.getItem('profileAlertSnoozed');
        const snoozedTime = snoozed ? parseInt(snoozed, 10) : 0;
        const now = new Date().getTime();

        // Show if incomplete AND (not snoozed or snoozed more than 24 hours ago)
        if (!user.phone || !user.dateOfBirth) {
          if (now - snoozedTime > 24 * 60 * 60 * 1000) {
            this.showIncompleteProfileAlert = true;
          }
        } else {
          this.showIncompleteProfileAlert = false;
        }
      } else {
        this.showIncompleteProfileAlert = false;
      }
    });
  }

  snoozeProfileAlert(): void {
    this.showIncompleteProfileAlert = false;
    localStorage.setItem('profileAlertSnoozed', new Date().getTime().toString());
  }

  goToProfileAndCloseAlert(): void {
    this.showIncompleteProfileAlert = false;
    this.router.navigate(['/profile']);
  }

  private applyStoredTheme(): void {
    const savedTheme = localStorage.getItem('appTheme') || 'light';
    const html = document.documentElement;
    const body = document.body;

    html.setAttribute('data-theme', savedTheme);
    body.setAttribute('data-theme', savedTheme);
  }
}


