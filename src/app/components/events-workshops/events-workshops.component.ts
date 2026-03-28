import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({ selector: 'app-events-workshops', standalone: true, imports: [CommonModule], templateUrl: './events-workshops.component.html', styleUrl: './events-workshops.component.css' })
export class EventsWorkshopsComponent { 
  events = [
    { title: 'Recovery Workshop', description: 'Learn recovery strategies', date: new Date(2026, 1, 28) },
    { title: 'Life Skills Training', description: 'Practical skills for success', date: new Date(2026, 1, 21) },
    { title: 'Community Gathering', description: 'Meet and connect', date: new Date(2026, 2, 7) }
  ];
}
