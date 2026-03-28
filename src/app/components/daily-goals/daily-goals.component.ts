import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-daily-goals',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './daily-goals.component.html',
  styleUrl: './daily-goals.component.css'
})
export class DailyGoalsComponent implements OnInit {
  showAddGoal = false;
  newGoal = { title: '', description: '' };

  todaysGoals = [
    { title: 'Morning Exercise', completed: true, priority: 'high' },
    { title: 'Attend Support Meeting', completed: false, priority: 'high' },
    { title: 'Journal Reflection', completed: false, priority: 'medium' },
    { title: 'Drink 8 Glasses Water', completed: true, priority: 'low' }
  ];

  weeklyGoals = [
    { title: 'Weekly Counseling Session', description: 'One-on-one counseling', progress: 100 },
    { title: 'Exercise Days', description: '3+ days this week', progress: 80 },
    { title: 'Support Meetings', description: 'Attend at least 3 meetings', progress: 67 }
  ];

  constructor() { }
  ngOnInit(): void { }

  updateGoal(goal: any): void {
    console.log('Goal updated:', goal);
  }

  addGoal(): void {
    if (this.newGoal.title) {
      this.todaysGoals.push({...this.newGoal, completed: false, priority: 'medium'});
      this.newGoal = { title: '', description: '' };
      this.showAddGoal = false;
    }
  }
}
