import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-goals-achievements',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './goals-achievements.component.html',
  styleUrl: './goals-achievements.component.css'
})
export class GoalsAchievementsComponent implements OnInit {
  totalAchievements = 24;
  thisMonth = 5;
  streakDays = 245;

  achievements = [
    { title: '100 Days Sober', date: new Date(2025, 10, 15), description: 'Reached 100 days milestone', level: 'gold', icon: 'fa-solid fa-medal' },
    { title: 'Support Group Champion', date: new Date(2025, 9, 1), description: 'Attended 20 meetings', level: 'silver', icon: 'fa-solid fa-star' },
    { title: 'Wellness Warrior', date: new Date(2025, 8, 15), description: 'Completed 30 exercise days', level: 'bronze', icon: 'fa-solid fa-heart' }
  ];

  activeGoals = [
    { name: 'Stay Sober', progress: 100 },
    { name: 'Exercise Regularly', progress: 85 },
    { name: 'Attend Support Meetings', progress: 92 }
  ];

  constructor() { }
  ngOnInit(): void { }
}
