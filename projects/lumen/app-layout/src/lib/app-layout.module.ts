import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppLayoutComponent } from './app-layout.component';

@NgModule({
  declarations: [AppLayoutComponent],
  imports: [BrowserAnimationsModule, MatSidenavModule, MatToolbarModule],
  exports: [AppLayoutComponent]
})
export class AppLayoutModule {}
