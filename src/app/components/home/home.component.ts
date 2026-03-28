import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  currentSlideIndex = 0;
  currentCarouselIndex = 0;
  slideInterval: any;
  carouselInterval: any;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.initializeSlider();
    this.initializeCarousel();
    this.initializeExpertModal();
    this.initializeTypingEffect();
  }

  initializeTypingEffect(): void {
    const typingElement = document.querySelector('.typing');
    if (typingElement) {
      const words = ['Drug-Free Life', 'Healthier Future', 'Recovery', 'Better Tomorrow'];
      let wordIndex = 0;
      let charIndex = 0;
      let isDeleting = false;

      const type = () => {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
          typingElement.textContent = currentWord.substring(0, charIndex - 1);
          charIndex--;
        } else {
          typingElement.textContent = currentWord.substring(0, charIndex + 1);
          charIndex++;
        }

        if (!isDeleting && charIndex === currentWord.length) {
          setTimeout(() => { isDeleting = true; }, 2000);
        } else if (isDeleting && charIndex === 0) {
          isDeleting = false;
          wordIndex = (wordIndex + 1) % words.length;
        }

        const typingSpeed = isDeleting ? 50 : 100;
        setTimeout(type, typingSpeed);
      };

      type();
    }
  }

  initializeSlider(): void {
    const slidesContainer = document.querySelector('.slides');
    const dotsContainer = document.querySelector('.slider-dots');
    
    if (slidesContainer && dotsContainer) {
      const slides = slidesContainer.querySelectorAll('.drug-slide');
      
      // Create dots
      slides.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => this.goToSlide(index));
        dotsContainer.appendChild(dot);
      });

      this.showSlide(0);
      this.slideInterval = setInterval(() => this.nextSlide(), 5000);
    }
  }

  showSlide(index: number): void {
    const slides = document.querySelectorAll('.drug-slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    
    if (slides.length === 0) return;

    this.currentSlideIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, i) => {
      (slide as HTMLElement).style.display = i === this.currentSlideIndex ? 'flex' : 'none';
    });

    dots.forEach((dot, i) => {
      if (i === this.currentSlideIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  nextSlide(): void {
    this.showSlide(this.currentSlideIndex + 1);
  }

  prevSlide(): void {
    this.showSlide(this.currentSlideIndex - 1);
  }

  goToSlide(index: number): void {
    this.showSlide(index);
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
      this.slideInterval = setInterval(() => this.nextSlide(), 5000);
    }
  }

  initializeCarousel(): void {
    const carouselInner = document.querySelector('.carousel-inner');
    const dotsContainer = document.querySelector('.carousel-dots');
    const prevBtn = document.querySelector('.prev-carousel');
    const nextBtn = document.querySelector('.next-carousel');
    
    if (carouselInner && dotsContainer) {
      const images = carouselInner.querySelectorAll('img');
      
      // Create dots for carousel
      images.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('carousel-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => this.goToCarouselSlide(index));
        dotsContainer.appendChild(dot);
      });

      if (prevBtn) {
        prevBtn.addEventListener('click', () => this.prevCarousel());
      }
      if (nextBtn) {
        nextBtn.addEventListener('click', () => this.nextCarousel());
      }

      this.showCarouselSlide(0);
      this.carouselInterval = setInterval(() => this.nextCarousel(), 4000);
    }
  }

  showCarouselSlide(index: number): void {
    const carouselInner = document.querySelector('.carousel-inner');
    const dots = document.querySelectorAll('.carousel-dot');
    
    if (!carouselInner) return;
    
    const images = carouselInner.querySelectorAll('img');
    if (images.length === 0) return;

    this.currentCarouselIndex = (index + images.length) % images.length;
    
    (carouselInner as HTMLElement).style.transform = `translateX(-${this.currentCarouselIndex * 100}%)`;

    dots.forEach((dot, i) => {
      if (i === this.currentCarouselIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }

  nextCarousel(): void {
    this.showCarouselSlide(this.currentCarouselIndex + 1);
  }

  prevCarousel(): void {
    this.showCarouselSlide(this.currentCarouselIndex - 1);
  }

  goToCarouselSlide(index: number): void {
    this.showCarouselSlide(index);
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
      this.carouselInterval = setInterval(() => this.nextCarousel(), 4000);
    }
  }

  initializeExpertModal(): void {
    const expertButton = document.getElementById('expertChatButton');
    const modal = document.getElementById('expertPopupModal');
    const closeButton = modal?.querySelector('.close-button');

    if (expertButton && modal) {
      expertButton.addEventListener('click', () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    }

    if (closeButton && modal) {
      closeButton.addEventListener('click', () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    // Close modal when clicking outside
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }
}
