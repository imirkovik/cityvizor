import { Routes, RouterModule } from '@angular/router';

import { EmbedLargeComponent } from './embed/embed-large/embed-large.component';

const appRoutes: Routes = [
  {path: 'embed/large',component: EmbedLargeComponent}
];

export const routing = RouterModule.forRoot(appRoutes);