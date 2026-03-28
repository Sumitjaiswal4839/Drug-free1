import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-book-appointment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './book-appointment.component.html',
  styleUrls: ['./book-appointment.component.css']
})
export class BookAppointmentComponent implements OnInit {
  appointmentForm: FormGroup;

  counselors = [
    'Dr. John Smith',
    'Dr. Sarah Wilson',
    'Dr. Michael Brown',
    'Dr. Emily Davis',
    'Dr. Robert Johnson'
  ];

  timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '2:00 PM', '2:30 PM',
    '3:00 PM', '3:30 PM', '4:00 PM', '4:30 PM'
  ];

  counselorDetails = [
    {
      name: 'Dr. John Smith',
      specialty: 'Addiction Counseling',
      experience: 12,
      rating: 4.8,
      available: true
    },
    {
      name: 'Dr. Sarah Wilson',
      specialty: 'Family Therapy',
      experience: 10,
      rating: 4.9,
      available: true
    },
    {
      name: 'Dr. Michael Brown',
      specialty: 'Behavioral Health',
      experience: 8,
      rating: 4.7,
      available: false
    },
    {
      name: 'Dr. Emily Davis',
      specialty: 'Mental Health Support',
      experience: 15,
      rating: 4.9,
      available: true
    },
    {
      name: 'Dr. Robert Johnson',
      specialty: 'Group Therapy',
      experience: 9,
      rating: 4.6,
      available: true
    }
  ];

  constructor(private fb: FormBuilder) {
    this.appointmentForm = this.fb.group({
      counselor: ['', [Validators.required]],
      date: ['', [Validators.required]],
      time: ['', [Validators.required]],
      type: ['', [Validators.required]],
      notes: ['']
    });
  }

  ngOnInit(): void {
  }

  submitAppointment(): void {
    if (this.appointmentForm.valid) {
      console.log('Appointment Data:', this.appointmentForm.value);
      alert('Appointment booked successfully! You will receive a confirmation email shortly.');
      this.appointmentForm.reset();
    } else {
      alert('Please fill all required fields.');
    }
  }
}
