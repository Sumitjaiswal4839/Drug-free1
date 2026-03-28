import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-community-support',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './community-support.component.html',
  styleUrl: './community-support.component.css'
})
export class CommunitySupportComponent {
  supportGroups = [
    { name: 'Monday Evening Group', description: 'Weekly support meetings every Monday', members: 24 },
    { name: 'Recovery Warriors', description: 'Peer support for active recovery', members: 18 },
    { name: 'Family Support Circle', description: 'Support for families affected by addiction', members: 32 }
  ];
}
