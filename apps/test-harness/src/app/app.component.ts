import { NxWelcomeComponent } from './nx-welcome.component';
import { Component, inject } from '@angular/core';
import { TestServer } from '@riichi/test-server';

@Component({
    standalone: true,
    imports: [NxWelcomeComponent],
    providers: [
        TestServer
    ],
    selector: 'rth-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    title = 'test-harness';
    readonly testServer = inject(TestServer);
}
