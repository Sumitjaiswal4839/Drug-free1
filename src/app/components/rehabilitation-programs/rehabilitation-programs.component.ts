import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-rehabilitation-programs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rehabilitation-programs.component.html',
  styleUrl: './rehabilitation-programs.component.css'
})
export class RehabilitationProgramsComponent {
  programs = [
    { name: 'Outpatient Program', description: 'Flexible recovery program while maintaining daily life', duration: '6-12 months' },
    { name: 'Intensive Inpatient', description: 'Comprehensive 24/7 treatment program', duration: '30-90 days' },
    { name: 'Aftercare Program', description: 'Continued support after initial recovery', duration: 'Ongoing' }
  ];
}
