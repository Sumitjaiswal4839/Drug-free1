import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-counselling-services',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './counselling-services.component.html',
  styleUrl: './counselling-services.component.css'
})
export class CounsellingServicesComponent {
  services = [
    { name: 'Individual Therapy', description: 'One-on-one sessions with a professional counselor', icon: 'fa-solid fa-person' },
    { name: 'Family Counseling', description: 'Address family dynamics and heal relationships', icon: 'fa-solid fa-people-arrows' },
    { name: 'Group Therapy', description: 'Share experiences with others in recovery', icon: 'fa-solid fa-people-group' }
  ];
}
