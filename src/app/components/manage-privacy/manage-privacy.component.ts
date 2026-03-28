import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-manage-privacy',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-privacy.component.html',
  styleUrl: './manage-privacy.component.css'
})
export class ManagePrivacyComponent implements OnInit {
  privacyLevel = 'friends';
  shareProgress = true;
  shareStats = false;
  shareEmail = true;

  constructor() { }

  ngOnInit(): void {
  }

  setPrivacy(level: string): void {
    this.privacyLevel = level;
  }

  saveSettings(): void {
    alert('Privacy settings saved!');
  }
}
