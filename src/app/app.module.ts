import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AuthInterceptor } from './auth.interceptor';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';

// Import all components
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AwardsComponent } from './components/awards/awards.component';
import { FaqComponent } from './components/faq/faq.component';
import { ContactComponent } from './components/contact/contact.component';
import { BookAppointmentComponent } from './components/book-appointment/book-appointment.component';
import { DrugInformationComponent } from './components/drug-information/drug-information.component';
import { RecommendedReadingComponent } from './components/recommended-reading/recommended-reading.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { HealthHistoryComponent } from './components/health-history/health-history.component';
import { ProgressReportComponent } from './components/progress-report/progress-report.component';
import { ManagePrivacyComponent } from './components/manage-privacy/manage-privacy.component';
import { PreferencesComponent } from './components/preferences/preferences.component';
import { TrackJourneyComponent } from './components/track-journey/track-journey.component';
import { DailyGoalsComponent } from './components/daily-goals/daily-goals.component';
import { DailyMotivationComponent } from './components/daily-motivation/daily-motivation.component';
import { GoalsAchievementsComponent } from './components/goals-achievements/goals-achievements.component';
import { CounsellingServicesComponent } from './components/counselling-services/counselling-services.component';
import { CommunityUpdatesComponent } from './components/community-updates/community-updates.component';
import { LifeSkillsTrainingComponent } from './components/life-skills-training/life-skills-training.component';
import { CommunitySupportComponent } from './components/community-support/community-support.component';
import { RehabilitationProgramsComponent } from './components/rehabilitation-programs/rehabilitation-programs.component';
import { OurMissionComponent } from './components/our-mission/our-mission.component';
import { ResourcesComponent } from './components/resources/resources.component';
import { SupportGroupsComponent } from './components/support-groups/support-groups.component';
import { TestimonialsComponent } from './components/testimonials/testimonials.component';
import { SuccessStoriesComponent } from './components/success-stories/success-stories.component';
import { InspiringMomentsComponent } from './components/inspiring-moments/inspiring-moments.component';
import { EventsWorkshopsComponent } from './components/events-workshops/events-workshops.component';
import { LatestNewsComponent } from './components/latest-news/latest-news.component';
import { HelplineComponent } from './components/helpline/helpline.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';

// Import new auth components
import { AuthLoginComponent } from './components/auth-login.component';
import { AuthRegisterComponent } from './components/auth-register.component';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AuthLoginComponent,
    AuthRegisterComponent,
    HomeComponent,
    ProfileComponent,
    DashboardComponent,
    ContactComponent,
    AwardsComponent,
    FaqComponent,
    BookAppointmentComponent,
    DrugInformationComponent,
    RecommendedReadingComponent,
    ChangePasswordComponent,
    HealthHistoryComponent,
    ProgressReportComponent,
    ManagePrivacyComponent,
    PreferencesComponent,
    TrackJourneyComponent,
    DailyGoalsComponent,
    DailyMotivationComponent,
    GoalsAchievementsComponent,
    CounsellingServicesComponent,
    CommunityUpdatesComponent,
    LifeSkillsTrainingComponent,
    CommunitySupportComponent,
    RehabilitationProgramsComponent,
    OurMissionComponent,
    ResourcesComponent,
    SupportGroupsComponent,
    TestimonialsComponent,
    SuccessStoriesComponent,
    InspiringMomentsComponent,
    EventsWorkshopsComponent,
    LatestNewsComponent,
    HelplineComponent,
    HeaderComponent,
    FooterComponent
  ],
  providers: [
    SupabaseService,
    AuthService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class AppModule { }
