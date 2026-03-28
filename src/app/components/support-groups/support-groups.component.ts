import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({ selector: 'app-support-groups', standalone: true, imports: [CommonModule], templateUrl: './support-groups.component.html', styleUrl: './support-groups.component.css' })
export class SupportGroupsComponent { 
  groups = [
    { name: 'Monday Group', description: 'Evening support meetings', meeting: 'Mondays 6 PM' },
    { name: 'Recovery Warriors', description: 'Peer support community', meeting: 'Wednesdays 5 PM' },
    { name: 'Family Support', description: 'For families', meeting: 'Saturdays 10 AM' }
  ];
}
