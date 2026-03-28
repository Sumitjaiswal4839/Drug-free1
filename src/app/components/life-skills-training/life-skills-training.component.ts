import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-life-skills-training',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './life-skills-training.component.html',
  styleUrl: './life-skills-training.component.css'
})
export class LifeSkillsTrainingComponent {
  courses = [
    { title: 'Stress Management', description: 'Learn healthy coping strategies', sessions: 6 },
    { title: 'Communication Skills', description: 'Improve relationships through better communication', sessions: 8 },
    { title: 'Job Readiness', description: 'Prepare for employment after recovery', sessions: 5 }
  ];
}
