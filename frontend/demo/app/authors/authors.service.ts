import { Injectable } from '@angular/core';
import { Autoregister, Service, Resource, DocumentCollection } from 'ngx-jsonapi';
import { Book } from '../books/books.service';
import { Genre } from '../genres/genres.service';
import { Photo } from '../photos/photos.service';

export class Author extends Resource {
    public attributes = {
        name: 'default name',
        date_of_birth: '',
        date_of_death: '',
        created_at: '',
        updated_at: ''
    };

    public relationships = {
        books: new DocumentCollection<Book>(),
        genres: new DocumentCollection<Genre>(),
        photos: new DocumentCollection<Photo>()
    };
}

@Injectable()
export class AuthorsService extends Service<Author> {
    public resource = Author;
    public type = 'authors';
}
