import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth.service';
import { User } from '../../user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  tabs = ['Personal', 'Health', 'Settings'];
  activeTab = 'Personal';

  // Real authenticated user
  currentUser: User | null = null;

  // Hybrid user object that falls back to dummy data so we don't break the template
  user: any = {
    name: 'John Doe',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    dob: new Date(1990, 5, 15),
    location: 'Health City, DR',
    status: 'On Recovery Journey',
    joinDate: new Date(2023, 0, 15),
    emailNotif: true,
    smsNotif: true,
    appNotif: false,
    publicProfile: false,
    shareStats: true,
    medicalHistory: [
      { date: new Date(2026, 1, 10), event: 'Consultation with Dr. Smith' },
      { date: new Date(2026, 0, 28), event: 'Lab work completed' },
      { date: new Date(2025, 11, 15), event: 'Initial assessment' }
    ]
  };

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(authData => {
      this.currentUser = authData;
      if (authData) {
        this.user.name = authData.firstName + ' ' + authData.lastName;
        this.user.firstName = authData.firstName;
        this.user.lastName = authData.lastName;
        this.user.email = authData.email;
        this.user.phone = authData.phone || '(No phone number)';
        this.user.joinDate = authData.createdAt || new Date();
        this.user.location = authData.address || 'Unknown Location';
        if (authData.profilePicture) {
          this.user.profilePicture = authData.profilePicture;
        }
      }
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  toggleNotif(type: string): void {
    if (type === 'email') this.user.emailNotif = !this.user.emailNotif;
    if (type === 'sms') this.user.smsNotif = !this.user.smsNotif;
    if (type === 'app') this.user.appNotif = !this.user.appNotif;
  }

  togglePrivacy(type: string): void {
    if (type === 'public') this.user.publicProfile = !this.user.publicProfile;
    if (type === 'stats') this.user.shareStats = !this.user.shareStats;
  }

  editProfile(): void {
    alert("Profile editing is currently unavailable. No database storage connected.");
  }
}
