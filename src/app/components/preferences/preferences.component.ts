import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-preferences',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './preferences.component.html',
  styleUrl: './preferences.component.css'
})
export class PreferencesComponent implements OnInit {
  theme = 'light';
  dailyReminders = true;
  appointmentAlerts = true;
  milestoneNotif = true;
  textSize = 'medium';
  language = 'en';

  constructor() { }

  ngOnInit(): void {
    this.loadSavedPreferences();
  }

  loadSavedPreferences(): void {
    const savedTheme = localStorage.getItem('appTheme');
    if (savedTheme) {
      this.theme = savedTheme;
      this.applyTheme(savedTheme);
    }
  }

  setTheme(themeValue: string): void {
    this.theme = themeValue;
    this.applyTheme(themeValue);
    localStorage.setItem('appTheme', themeValue);
  }

  applyTheme(themeValue: string): void {
    const html = document.documentElement;
    const body = document.body;
    
    if (themeValue === 'dark') {
      html.setAttribute('data-theme', 'dark');
      body.setAttribute('data-theme', 'dark');
    } else {
      html.setAttribute('data-theme', 'light');
      body.setAttribute('data-theme', 'light');
    }
  }

  savePreferences(): void {
    localStorage.setItem('appTheme', this.theme);
    localStorage.setItem('textSize', this.textSize);
    localStorage.setItem('language', this.language);
    localStorage.setItem('dailyReminders', String(this.dailyReminders));
    localStorage.setItem('appointmentAlerts', String(this.appointmentAlerts));
    localStorage.setItem('milestoneNotif', String(this.milestoneNotif));
    alert('Preferences saved successfully!');
  }
}

