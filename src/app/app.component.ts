import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  // template: `
  //   <h1>Hello, f1-blog</h1>
  //   <router-outlet></router-outlet>
  // `,
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'f1-blog';
}
