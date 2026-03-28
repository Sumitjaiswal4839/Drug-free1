import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({ selector: 'app-resources', standalone: true, imports: [CommonModule], templateUrl: './resources.component.html', styleUrl: './resources.component.css' })
export class ResourcesComponent { 
  resources = [
    { title: 'E-Books', description: 'Free guides on recovery', icon: 'fa-solid fa-book' },
    { title: 'Videos', description: 'Educational video series', icon: 'fa-solid fa-video' },
    { title: 'Podcasts', description: 'Inspiring recovery stories', icon: 'fa-solid fa-podcast' }
  ];
}
