import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-drug-information',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './drug-information.component.html',
  styleUrls: ['./drug-information.component.css']
})
export class DrugInformationComponent implements OnInit {
  searchTerm = '';
  selectedCategory = 'All';
  categories = ['All', 'Stimulants', 'Depressants', 'Hallucinogens', 'Cannabis'];

  allDrugs = [
    {
      name: 'Cocaine',
      category: 'Stimulants',
      type: 'Powder/Crystal',
      severity: 'Severe',
      description: 'A powerful stimulant that affects the central nervous system.',
      shortTermEffects: ['Increased heart rate', 'High blood pressure', 'Euphoria', 'Anxiety'],
      healthRisks: ['Heart attack', 'Stroke', 'Addiction', 'Respiratory problems']
    },
    {
      name: 'Heroin',
      category: 'Depressants',
      type: 'Powder/Liquid',
      severity: 'Severe',
      description: 'An opioid that causes strong euphoria followed by depression.',
      shortTermEffects: ['Euphoria', 'Drowsiness', 'Impaired judgment', 'Slow breathing'],
      healthRisks: ['Overdose', 'Addiction', 'Liver disease', 'Infectious diseases']
    },
    {
      name: 'Methamphetamine',
      category: 'Stimulants',
      type: 'Powder/Crystal',
      severity: 'Severe',
      description: 'A highly addictive stimulant affecting the brain and body.',
      shortTermEffects: ['Increased energy', 'Decreased appetite', 'Rapid heart rate', 'Insomnia'],
      healthRisks: ['Addiction', 'Dental problems', 'Skin infections', 'Mental health issues']
    },
    {
      name: 'Cannabis',
      category: 'Cannabis',
      type: 'Plant/Oil',
      severity: 'Moderate',
      description: 'A psychoactive substance that affects perception and mood.',
      shortTermEffects: ['Altered perception', 'Impaired memory', 'Relaxation', 'Anxiety'],
      healthRisks: ['Addiction', 'Impaired driving', 'Mental health issues', 'Respiratory problems']
    },
    {
      name: 'LSD',
      category: 'Hallucinogens',
      type: 'Liquid/Tabs',
      severity: 'Moderate',
      description: 'A hallucinogen that causes visual and auditory distortions.',
      shortTermEffects: ['Hallucinations', 'Altered perception', 'Increased heart rate', 'Anxiety'],
      healthRisks: ['Psychological distress', 'Flashbacks', 'Impaired judgment', 'Accidents']
    }
  ];

  filteredDrugs = [...this.allDrugs];

  constructor() { }

  ngOnInit(): void {
    this.filterDrugs();
  }

  filterDrugs(): void {
    this.filteredDrugs = this.allDrugs.filter(drug => {
      const matchesSearch = drug.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = this.selectedCategory === 'All' || drug.category === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.filterDrugs();
  }
}
