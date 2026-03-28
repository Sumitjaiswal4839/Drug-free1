import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({ selector: 'app-testimonials', standalone: true, imports: [CommonModule], templateUrl: './testimonials.component.html', styleUrl: './testimonials.component.css' })
export class TestimonialsComponent { 
  testimonials = [
    { quote: 'This program changed my life completely', author: 'John D.' },
    { quote: 'I found hope when I thought there was none', author: 'Sarah M.' },
    { quote: 'The support was incredible and genuine', author: 'Michael T.' }
  ];
}
