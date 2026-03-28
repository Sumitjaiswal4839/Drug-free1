import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-health-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './health-history.component.html',
  styleUrl: './health-history.component.css'
})
export class HealthHistoryComponent implements OnInit {
  showForm = false;

  healthRecords = [
    {
      type: 'Medical Checkup',
      date: new Date(2026, 1, 10),
      doctor: 'Dr. John Smith',
      diagnosis: 'Good overall health',
      notes: 'Blood pressure normal, no health concerns. Continue current routine.'
    },
    {
      type: 'Lab Work',
      date: new Date(2026, 0, 28),
      doctor: 'Health Lab Center',
      diagnosis: 'All tests passed',
      notes: 'Blood tests, screenings completed successfully. All values within normal range.'
    },
    {
      type: 'Initial Assessment',
      date: new Date(2025, 11, 15),
      doctor: 'Dr. Sarah Wilson',
      diagnosis: 'Recovery Program Started',
      notes: 'Baseline health assessment completed. Recovery plan established.'
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  toggleForm(): void {
    this.showForm = !this.showForm;
  }

  addRecord(): void {
    alert('Medical record added successfully!');
    this.showForm = false;
  }
}
