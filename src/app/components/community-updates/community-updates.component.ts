import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-community-updates',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './community-updates.component.html',
  styleUrl: './community-updates.component.css'
})
export class CommunityUpdatesComponent {
  updates = [
    { date: new Date(), title: 'New Support Group Starting', content: 'Join our new weekly evening support group' },
    { date: new Date(Date.now() - 86400000), title: 'Workshop Announcement', content: 'Free life skills workshop next week' },
    { date: new Date(Date.now() - 172800000), title: 'Success Story Shared', content: 'Read our latest recovery success story' }
  ];
}
