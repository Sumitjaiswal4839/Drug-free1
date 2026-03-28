import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
@Component({ selector: 'app-latest-news', standalone: true, imports: [CommonModule], templateUrl: './latest-news.component.html', styleUrl: './latest-news.component.css' })
export class LatestNewsComponent { 
  newsItems = [
    { title: 'New Support Group Launches', content: 'Join our evening support group', date: new Date() },
    { title: 'Success Story Shared', content: 'Read John\'s inspiring journey', date: new Date(Date.now() - 86400000) },
    { title: 'Workshop Next Week', content: 'Free life skills training available', date: new Date(Date.now() - 172800000) }
  ];
}
