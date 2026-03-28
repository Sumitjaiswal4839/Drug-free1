import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-daily-motivation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './daily-motivation.component.html',
  styleUrl: './daily-motivation.component.css'
})
export class DailyMotivationComponent implements OnInit {
  currentQuote = { text: 'The only way out is through.', author: 'Robert Frost' };
  dailyTip = 'Take time to acknowledge your progress. Every day sober is a victory worth celebrating!';

  quotes = [
    { text: 'The only way out is through.', author: 'Robert Frost' },
    { text: 'One day at a time.', author: 'Recovery Motto' },
    { text: 'Courage is not the absence of fear.', author: 'Unknown' }
  ];

  stories = [
    { title: 'From Darkness to Light', excerpt: 'A story of transformation and hope...' },
    { title: 'Breaking Free', excerpt: 'How one person overcame addiction...' }
  ];

  affirmations = [
    'I am strong and capable',
    'My recovery is my priority',
    'I deserve happiness and health',
    'Each day brings new opportunities'
  ];

  constructor() { }
  ngOnInit(): void { }

  getNewQuote(): void {
    const index = Math.floor(Math.random() * this.quotes.length);
    this.currentQuote = this.quotes[index];
  }
}
