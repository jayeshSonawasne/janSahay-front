import { NgModule } from '@angular/core';
import { SecureComponent } from './secure.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', component: SecureComponent },
  { path: 'dashboard', loadComponent: () => import('../../components/secure/dashboard/dashboard.component').then(m => m.DashboardComponent), data: { breadcrumb: 'Dashboard' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SecureRoutingModule { }
