import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({ selector: 'app-inspiring-moments', standalone: true, imports: [CommonModule], templateUrl: './inspiring-moments.component.html', styleUrl: './inspiring-moments.component.css' })
export class InspiringMomentsComponent { 
  moments = [
    { title: '100 Days Sober', description: 'A milestone of strength', date: new Date(2025, 10, 15), icon: 'fa-solid fa-medal' },
    { title: 'First Job', description: 'Back in the workforce', date: new Date(2025, 9, 1), icon: 'fa-solid fa-briefcase' },
    { title: 'Family Reconnected', description: 'Healed relationships', date: new Date(2025, 8, 15), icon: 'fa-solid fa-heart' }
  ];
}
