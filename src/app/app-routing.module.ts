import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './layouts/public/login/login.component';

const routes: Routes = [
  // 👉 Home route
  {
    path: '',
    component: HomeComponent,
    pathMatch: 'full',
    data: { breadcrumb: 'Home' }
  },

  // 👉 Public module pages
  {
    path: 'public',
    loadChildren: () =>
      import('./layouts/public/public.module').then(m => m.PublicModule),
  },

  // 👉 Secure module pages
  {
    path: 'secure',
    loadChildren: () =>
      import('./layouts/secure/secure.module').then(m => m.SecureModule),
  },

  // 👉 Chatbox page (after login)
  {
    path: 'chatbox',
    loadComponent: () =>
      import('./components/secure/chatbox/chatbox.component').then(
        m => m.ChatboxComponent
      ),
    data: { breadcrumb: 'Chatbox' },
  },

  // 👉 Login page (public)
  { path: 'login', component: LoginComponent },

  // 👉 Not Found
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
