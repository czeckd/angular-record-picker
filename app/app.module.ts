import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';

import { DemoAppComponent } from './demo-app.component';
import { RecordPickerComponent } from './record-picker.component';

@NgModule({
	imports:         [ BrowserModule, FormsModule ],
	declarations:    [ DemoAppComponent, RecordPickerComponent ],
	bootstrap:       [ DemoAppComponent ]
})
export class AppModule { }

