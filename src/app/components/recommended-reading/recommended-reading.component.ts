import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-recommended-reading',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recommended-reading.component.html',
  styleUrls: ['./recommended-reading.component.css']
})
export class RecommendedReadingComponent implements OnInit {
  searchTerm = '';
  selectedCategory = 'All';
  categories = ['All', 'Recovery', 'Mental Health', 'Wellness', 'Support'];

  allArticles = [
    {
      title: 'Understanding Addiction: A Comprehensive Guide',
      category: 'Recovery',
      author: 'Dr. Rachel Green',
      date: new Date(2026, 1, 15),
      readTime: 8,
      excerpt: 'Learn about the science of addiction and how it affects the brain and body.',
      tags: ['addiction', 'education', 'recovery'],
      image: 'https://via.placeholder.com/300x200?text=Addiction+Guide'
    },
    {
      title: 'Building a Strong Support Network',
      category: 'Support',
      author: 'John Martinez',
      date: new Date(2026, 1, 10),
      readTime: 6,
      excerpt: 'Discover how to build and maintain a support network during your recovery journey.',
      tags: ['support', 'community', 'relationships'],
      image: 'https://via.placeholder.com/300x200?text=Support+Network'
    },
    {
      title: 'Mindfulness and Meditation for Mental Health',
      category: 'Mental Health',
      author: 'Dr. Sophia Lee',
      date: new Date(2026, 1, 5),
      readTime: 7,
      excerpt: 'Explore how mindfulness practices can improve mental health and reduce stress.',
      tags: ['mindfulness', 'meditation', 'mental-health'],
      image: 'https://via.placeholder.com/300x200?text=Mindfulness'
    },
    {
      title: 'Nutrition and Physical Health in Recovery',
      category: 'Wellness',
      author: 'Lisa Rodriguez',
      date: new Date(2026, 0, 28),
      readTime: 9,
      excerpt: 'Learn how proper nutrition and exercise support your recovery and overall wellness.',
      tags: ['nutrition', 'health', 'wellness'],
      image: 'https://via.placeholder.com/300x200?text=Nutrition'
    },
    {
      title: 'Managing Stress and Triggers',
      category: 'Mental Health',
      author: 'Dr. Michael Chen',
      date: new Date(2026, 0, 20),
      readTime: 7,
      excerpt: 'Practical strategies for identifying and managing stress triggers during recovery.',
      tags: ['stress', 'triggers', 'coping'],
      image: 'https://via.placeholder.com/300x200?text=Stress+Management'
    },
    {
      title: 'Family Involvement in the Recovery Process',
      category: 'Support',
      author: 'Emma Thompson',
      date: new Date(2026, 0, 12),
      readTime: 8,
      excerpt: 'How families can support their loved ones and promote healing together.',
      tags: ['family', 'relationships', 'support'],
      image: 'https://via.placeholder.com/300x200?text=Family+Recovery'
    }
  ];

  filteredArticles = [...this.allArticles];

  constructor() { }

  ngOnInit(): void {
    this.filterArticles();
  }

  filterArticles(): void {
    this.filteredArticles = this.allArticles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           article.excerpt.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = this.selectedCategory === 'All' || article.category === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.filterArticles();
  }
}
