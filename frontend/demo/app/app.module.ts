import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

// Add cookie sending
import { AuthInterceptor } from './services/auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { HttpClientModule } from '@angular/common/http';
import { environment } from '../environments/environment';
import { NgxJsonapiModule, JSONAPI_RIPPER_SERVICE, JSONAPI_STORE_SERVICE } from 'ngx-jsonapi';

import { AppComponent } from './app.component';
import { AuthorsService } from './authors/authors.service';
import { BooksService } from './books/books.service';
import { GenresService } from './genres/genres.service';
import { PhotosService } from './photos/photos.service';
import { SharedModule } from './shared/shared.module';

import { StoreService } from 'ngx-jsonapi/sources/store.service';
import { JsonRipper } from 'ngx-jsonapi/services/json-ripper';

// Add forms
import { FormsModule } from '@angular/forms';

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/authors',
        pathMatch: 'full'
    },
    {
        path: 'authors',
        loadChildren: './authors/authors.module#AuthorsModule'
    },
    {
        path: 'books',
        loadChildren: './books/books.module#BooksModule'
    },
    {
        path: 'genres',
        loadChildren: './genres/genres.module#GenresModule'
    }
];

@NgModule({
    providers: [
// Comment next lines in attempt to remove caching
/*
        {
            provide: JSONAPI_RIPPER_SERVICE,
            useClass: JsonRipper
        },
        {
            provide: JSONAPI_STORE_SERVICE,
            useClass: StoreService
        },
*/
        // Add cookie sending
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
        },

        AuthorsService,
        BooksService,
        GenresService,
        PhotosService
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        SharedModule,
        RouterModule.forRoot(appRoutes, { useHash: true }),
        NgxJsonapiModule.forRoot({
            url: environment.jsonapi_url,
            // try to avoid cache
            cache_prerequests: false
        }),
        // Add forms
        FormsModule
    ],
    declarations: [AppComponent],
    bootstrap: [AppComponent]
})
export class AppModule {}
