import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
  searchTerm = '';
  selectedCategory = 'All';
  activeFaqIndex = -1;
  categories = ['All', 'Services', 'Account', 'Appointments', 'Treatment', 'Support'];

  allFaqs = [
    { category: 'Services', question: 'What services do you offer?', answer: 'We offer counseling services, support groups, rehabilitation programs, life skills training, and community support for individuals on their recovery journey.' },
    { category: 'Services', question: 'Are your services confidential?', answer: 'Yes, all our services are confidential and comply with healthcare privacy regulations. Your personal information is protected.' },
    { category: 'Account', question: 'How do I create an account?', answer: 'Click the Login button and select Register. Fill in your details and create a secure password. You\'ll receive a verification email to activate your account.' },
    { category: 'Account', question: 'How can I reset my password?', answer: 'On the login page, click "Forgot Password" and enter your email. We\'ll send you a link to reset your password.' },
    { category: 'Appointments', question: 'How do I book an appointment?', answer: 'Go to the "Book Appointment" section, select your preferred counselor, date, and time. Confirm your booking and you\'ll receive a confirmation email.' },
    { category: 'Appointments', question: 'Can I reschedule my appointment?', answer: 'Yes, you can reschedule from your dashboard. Go to "Upcoming Appointments" and click "Reschedule" on the appointment you want to change.' },
    { category: 'Treatment', question: 'What treatment options are available?', answer: 'We offer individual counseling, group therapy, rehabilitation programs, and medication-assisted treatment options tailored to your needs.' },
    { category: 'Treatment', question: 'How long does treatment take?', answer: 'Treatment duration varies based on individual needs. Most programs are 3-6 months, but some may extend longer depending on progress.' },
    { category: 'Support', question: 'Are there support groups available?', answer: 'Yes, we have weekly support group meetings. You can join online or in-person. Check the Support Groups section for schedules.' },
    { category: 'Support', question: 'Is there 24/7 support available?', answer: 'Our helpline is available 24/7 at +1 (555) 123-4567. For emergencies, please call 911 or visit your nearest hospital.' }
  ];

  filteredFaqs = [...this.allFaqs];

  constructor() { }

  ngOnInit(): void {
    this.filterFAQs();
  }

  toggleFaq(index: number): void {
    this.activeFaqIndex = this.activeFaqIndex === index ? -1 : index;
  }

  filterFAQs(): void {
    this.activeFaqIndex = -1;
    this.filteredFaqs = this.allFaqs.filter(faq => {
      const matchesSearch = faq.question.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                           faq.answer.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = this.selectedCategory === 'All' || faq.category === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.filterFAQs();
  }
}
