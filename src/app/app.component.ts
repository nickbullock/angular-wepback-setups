import { Component } from '@angular/core';
import { AppService } from './app.service.js';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent {
  title = 'app';

  ngOnInit() {
    AppService.sayHelloWorld();
  }
}
