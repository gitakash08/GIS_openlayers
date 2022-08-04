import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SkillIndiaMapComponent } from './components/skill-india-map/skill-india-map.component';

const subfolder = "";
const routes: Routes = [
  { path: subfolder, component: DashboardComponent  },
  { path: 'skill-india-map', component: SkillIndiaMapComponent  },
  { path: 'gis-map', component: SkillIndiaMapComponent  },
  { path: 'dashboard', component: DashboardComponent  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
