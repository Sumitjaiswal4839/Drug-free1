import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
import { AuthLoginComponent } from './components/auth-login.component';
import { AuthRegisterComponent } from './components/auth-register.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: AuthLoginComponent },
  { path: 'register', component: AuthRegisterComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'health-history', component: HealthHistoryComponent },
  { path: 'progress-report', component: ProgressReportComponent },
  { path: 'manage-privacy', component: ManagePrivacyComponent },
  { path: 'preferences', component: PreferencesComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'track-journey', component: TrackJourneyComponent },
  { path: 'daily-goals', component: DailyGoalsComponent },
  { path: 'daily-motivation', component: DailyMotivationComponent },
  { path: 'goals-achievements', component: GoalsAchievementsComponent },
  { path: 'awards', component: AwardsComponent },
  { path: 'faq', component: FaqComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'helpline', component: HelplineComponent },
  { path: 'book-appointment', component: BookAppointmentComponent },
  { path: 'drug-information', component: DrugInformationComponent },
  { path: 'recommended-reading', component: RecommendedReadingComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'counselling-services', component: CounsellingServicesComponent },
  { path: 'community-updates', component: CommunityUpdatesComponent },
  { path: 'life-skills-training', component: LifeSkillsTrainingComponent },
  { path: 'community-support', component: CommunitySupportComponent },
  { path: 'rehabilitation-programs', component: RehabilitationProgramsComponent },
  { path: 'our-mission', component: OurMissionComponent },
  { path: 'resources', component: ResourcesComponent },
  { path: 'support-groups', component: SupportGroupsComponent },
  { path: 'testimonials', component: TestimonialsComponent },
  { path: 'success-stories', component: SuccessStoriesComponent },
  { path: 'inspiring-moments', component: InspiringMomentsComponent },
  { path: 'events-workshops', component: EventsWorkshopsComponent },
  { path: 'latest-news', component: LatestNewsComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
