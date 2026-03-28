import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-track-journey',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './track-journey.component.html',
  styleUrl: './track-journey.component.css'
})
export class TrackJourneyComponent implements OnInit {
  totalDays = 245;
  milestones = 8;
  attendanceRate = 92;

  timeline = [
    { title: '100 Days Sober!', date: new Date(2025, 10, 15), description: 'Reached first major milestone in recovery' },
    { title: 'Started Support Group', date: new Date(2025, 9, 1), description: 'Joined weekly support group meetings' },
    { title: 'Recovery Program Began', date: new Date(2025, 5, 15), description: 'Official start of recovery journey' }
  ];

  monthlyData = [
    { name: 'Jan', value: 60 }, { name: 'Feb', value: 70 },
    { name: 'Mar', value: 80 }, { name: 'Apr', value: 85 },
    { name: 'May', value: 90 }, { name: 'Jun', value: 92 }
  ];

  constructor() { }
  ngOnInit(): void { }
}
