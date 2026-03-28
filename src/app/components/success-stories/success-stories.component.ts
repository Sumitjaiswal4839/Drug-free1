import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({ selector: 'app-success-stories', standalone: true, imports: [CommonModule], templateUrl: './success-stories.component.html', styleUrl: './success-stories.component.css' })
export class SuccessStoriesComponent { 
  stories = [
    { title: 'From Struggle to Strength', excerpt: 'How recovery transformed my life...', author: 'John D.' },
    { title: 'Finding My Path', excerpt: 'A second chance at happiness...', author: 'Emma L.' },
    { title: 'Breaking Free', excerpt: 'My journey to freedom...', author: 'Michael T.' }
  ];
}
