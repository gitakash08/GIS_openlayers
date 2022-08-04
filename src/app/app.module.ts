import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChartsModule } from 'ng2-charts';
import { HttpClientModule } from '@angular/common/http';
import { ApexChart, NgApexchartsModule} from 'ng-apexcharts';
import { HighchartsChartModule } from 'highcharts-angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatRippleModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { SkillIndiaMapComponent } from './components/skill-india-map/skill-india-map.component';
import { InfoToolModalComponent } from './components/info-tool-modal/info-tool-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    HeaderComponent,
    FooterComponent,
    SkillIndiaMapComponent,
    InfoToolModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
	ChartsModule,
	HttpClientModule,
	HighchartsChartModule,
    BrowserAnimationsModule,
	NgApexchartsModule,
		ReactiveFormsModule,
		FormsModule,		
    MatFormFieldModule,
		MatRippleModule,
		FormsModule,
		MatInputModule,
		MatSelectModule,
		MatRadioModule,
		MatCheckboxModule,
		MatDialogModule,
		MatChipsModule,
		MatAutocompleteModule,
		MatIconModule,
		MatButtonModule,
		MatDividerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
