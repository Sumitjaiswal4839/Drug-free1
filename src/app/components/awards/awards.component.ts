import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-awards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './awards.component.html',
  styleUrls: ['./awards.component.css']
})
export class AwardsComponent implements OnInit {
  selectedFilter = 'All';
  filterTypes = ['All', 'Organization', 'Community', 'Individual'];

  orgAwards = [
    {
      name: 'Best Community Support Program',
      year: 2024,
      description: 'Recognized for outstanding community outreach and support services.',
      issuedBy: 'National Health Organization'
    },
    {
      name: 'Excellence in Addiction Treatment',
      year: 2023,
      description: 'Award for innovative and effective addiction treatment methods.',
      issuedBy: 'Healthcare Excellence Board'
    },
    {
      name: 'Community Impact Award',
      year: 2023,
      description: 'Honored for significant positive impact on the local community.',
      issuedBy: 'City Council'
    },
    {
      name: 'Patient Choice Award',
      year: 2022,
      description: 'Voted by patients as the most trusted recovery support organization.',
      issuedBy: 'Patient Advocacy Group'
    }
  ];

  communityMilestones = [
    {
      name: 'Lives Transformed',
      count: '5,000+',
      description: 'People helped on their recovery journey',
      icon: 'fa-solid fa-heart',
      color: '#ff6b6b'
    },
    {
      name: 'Support Groups',
      count: '150+',
      description: 'Active support group meetings held',
      icon: 'fa-solid fa-users',
      color: '#4ecdc4'
    },
    {
      name: 'Counseling Hours',
      count: '10,000+',
      description: 'Professional counseling sessions provided',
      icon: 'fa-solid fa-handshake',
      color: '#45b7d1'
    },
    {
      name: 'Community Events',
      count: '200+',
      description: 'Awareness and wellness events organized',
      icon: 'fa-solid fa-calendar',
      color: '#96ceb4'
    }
  ];

  achievements = [
    {
      name: '30 Days Sober',
      level: 'bronze',
      icon: 'fa-solid fa-medal',
      description: 'Completed first 30 days of sobriety',
      progress: 75
    },
    {
      name: '100 Days Strong',
      level: 'silver',
      icon: 'fa-solid fa-star',
      description: 'Reached 100 days milestone',
      progress: 100
    },
    {
      name: '1 Year Victory',
      level: 'gold',
      icon: 'fa-solid fa-crown',
      description: 'Achieved one year of recovery',
      progress: 100
    },
    {
      name: 'Community Helper',
      level: 'platinum',
      icon: 'fa-solid fa-heart',
      description: 'Helped 10+ people in their recovery',
      progress: 60
    }
  ];

  successStories = [
    {
      title: 'From Struggle to Strength',
      date: new Date(2026, 0, 15),
      excerpt: 'After years of battling addiction, John found hope through our comprehensive program. Today, he\'s 3 years sober and mentoring others.',
      author: 'John D.'
    },
    {
      title: 'A Second Chance',
      date: new Date(2025, 11, 20),
      excerpt: 'Sarah\'s family was on the verge of falling apart. With our family counseling and support, they\'ve rebuilt their relationships stronger than ever.',
      author: 'Sarah M.'
    },
    {
      title: 'New Beginning',
      date: new Date(2025, 10, 10),
      excerpt: 'Michael thought he\'d lost everything. Through persistence and support, he got his life back and now works as a recovery counselor.',
      author: 'Michael T.'
    },
    {
      title: 'Breaking Free',
      date: new Date(2025, 9, 5),
      excerpt: 'Emma\'s journey of recovery inspired her to help others. She now volunteers at our center and has assisted dozens of people.',
      author: 'Emma L.'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  filterAwards(filter: string): void {
    this.selectedFilter = filter;
  }

  get displayedAwards() {
    if (this.selectedFilter === 'All' || this.selectedFilter === 'Organization') {
      return this.orgAwards;
    }
    return [];
  }

  get displayedMilestones() {
    if (this.selectedFilter === 'All' || this.selectedFilter === 'Community') {
      return this.communityMilestones;
    }
    return [];
  }

  get displayedAchievements() {
    if (this.selectedFilter === 'All' || this.selectedFilter === 'Individual') {
      return this.achievements;
    }
    return [];
  }

  get displayedStories() {
    if (this.selectedFilter === 'All') {
      return this.successStories;
    }
    return [];
  }
}
