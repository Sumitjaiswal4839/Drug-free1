import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  totalAppointments = 12;
  soberDays = 245;
  goalsAchieved = 8;
  supportSessions = 45;

  appointments = [
    { doctor: 'Dr. John Smith', date: new Date(2026, 1, 28), time: '2:00 PM', location: 'Building A, Room 305' },
    { doctor: 'Dr. Sarah Wilson', date: new Date(2026, 2, 5), time: '10:30 AM', location: 'Building B, Room 102' }
  ];

  goals = [
    { name: 'Exercise 3x per week', progress: 75 },
    { name: 'Attend support meetings', progress: 90 },
    { name: 'Daily meditation', progress: 60 },
    { name: 'Healthy eating habits', progress: 85 }
  ];

  recentActivity = [
    { date: new Date(), text: 'Completed daily meditation' },
    { date: new Date(Date.now() - 86400000), text: 'Attended support group meeting' },
    { date: new Date(Date.now() - 172800000), text: 'Logged workout session' },
    { date: new Date(Date.now() - 259200000), text: 'Updated health profile' }
  ];

  constructor() { }

  ngOnInit(): void {
  }
}
