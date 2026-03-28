import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-report',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-report.component.html',
  styleUrl: './progress-report.component.css'
})
export class ProgressReportComponent implements OnInit {
  soberDays = 245;
  attendanceRate = 88;
  completedGoals = 12;
  totalSessions = 45;
  supportGroups = 28;
  counselingSessions = 17;
  exerciseDays = 34;
  wellnessScore = 8.2;

  monthlyData = [
    { name: 'Jan', value: 70 },
    { name: 'Feb', value: 78 },
    { name: 'Mar', value: 85 },
    { name: 'Apr', value: 92 },
    { name: 'May', value: 88 },
    { name: 'Jun', value: 95 }
  ];

  constructor() { }

  ngOnInit(): void {
  }
}
