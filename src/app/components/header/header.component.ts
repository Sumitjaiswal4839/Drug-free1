import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { User } from '../../user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isSidebarOpen = false;
  currentUser: User | null = null;
  isAuthenticated = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.initializeHeaderScripts();
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    this.authService.isAuthenticated$.subscribe(isAuth => {
      this.isAuthenticated = isAuth;
    });
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/']);
    });
  }

  initializeHeaderScripts(): void {
    // We now use Angular (click) handlers for submenus instead of vanilla querySelectorAll
    // which fails on dynamically added elements (*ngIf)
  }

  toggleSubmenu(e: Event): void {
    e.preventDefault();
    const parent = (e.currentTarget as HTMLElement).closest('.has-submenu');
    if (parent) {
      parent.classList.toggle('active');
    }
  }

  toggleSidebarSubmenu(e: Event): void {
    e.preventDefault();
    const parent = (e.currentTarget as HTMLElement).closest('.sidebar-item');
    if (parent) {
      parent.classList.toggle('active');
    }
  }



  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
    const sidebar = document.querySelector('.sidebar_menu');
    if (sidebar) {
      if (this.isSidebarOpen) {
        sidebar.classList.add('active');
        document.body.style.overflow = 'hidden';
      } else {
        sidebar.classList.remove('active');
        document.body.style.overflow = '';
      }
    }
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
    const sidebar = document.querySelector('.sidebar_menu');
    if (sidebar) {
      sidebar.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  goToLogin(): void {
    // Open login page securely in a completely new tab
    const url = this.router.serializeUrl(this.router.createUrlTree(['/login']));
    window.open(url, '_blank');
  }
}
