import { Component } from '@angular/core';
// Add Router to be able to navigate from code (this.router.navigate(...)
import { ActivatedRoute, Router } from '@angular/router';
import { Resource } from 'ngx-jsonapi';
import { PhotosService } from '../../photos/photos.service';
import { AuthorsService, Author } from '../authors.service';
import { BooksService } from '../../books/books.service';

// Add Form control
import { FormControl, NgForm } from '@angular/forms';

@Component({
    selector: 'demo-author',
    templateUrl: './author.component.html'
})
export class AuthorComponent {
    public author: Author;
    public relatedbooks: Array<Resource>;

    // Flags for form modes
    public isEditMode: boolean = false;
    public isValidFormSubmitted: boolean  = true;

    public constructor(
        protected authorsService: AuthorsService,
        protected photosService: PhotosService,
        booksService: BooksService,
        // init router
        private router: Router,
        private route: ActivatedRoute
    ) {
        route.params.subscribe(({ id }) => {
          // Add processing id = 0 for add new records
          if ( id > 0 ) {
            authorsService.get(id, { include: ['books', 'photos'], ttl: 100 }).subscribe(
                author => {
                    this.author = author;
                    console.log('author loaded for id', id);
                },
                error => console.error('Could not load author.', error)
            );
          } else {
              this.author = this.authorsService.new();
              console.log('New author created');
              this.isEditMode = true;
          }
        });
    }

    /*
    Add a new author
    */
    public newAuthor() {
        let author = this.authorsService.new();
        author.attributes.name = prompt('New author name:', 'John Doe');
        if (!author.attributes.name) {
            return;
        }
        author.attributes.date_of_birth = '2030-12-10';
        console.log('author data for save', author.toObject());
        author
            .save
            /* { include: ['book'] } */
            ()
            .subscribe(success => {
                console.log('author saved', author.toObject());
            });
    }

    /*
    Update name for actual author
    */
    public updateAuthor() {
        this.author.attributes.name = prompt('Author name:', this.author.attributes.name);
        console.log('author data for save with book include', this.author.toObject({ include: ['books'] }));
        console.log('author data for save without any include', this.author.toObject());
        this.author.save(/* { include: ['book'] } */).subscribe(success => {
            console.log('author saved', this.author.toObject());
        });
    }

    public removeRelationship() {
        this.author.removeRelationship('photos', '1');
        this.author.save();
        console.log('removeRelationship save with photos include', this.author.toObject());
    }

    public turnEditMode( mode: boolean ) {
        this.isEditMode = mode;
    }

    public onEdit(  ) {
        this.isEditMode = true;
    }

    public onCancel(  ) {
        if ( this.author.id ) {
            this.isEditMode = false;
        } else {
            this.router.navigate(['/authors']);
        }
    }
/*
    ngOnInit() {
        if ( this.author.id ) {
            this.isEditMode = true;
        } else {
            this.router.navigate(['/authors']);
        }
    }
*/
    public onFormSubmit(form: NgForm) {
/*
        this.isValidFormSubmitted = false;
        if (form.valid) {
            this.isValidFormSubmitted = true;
        } else {
            return;
        }
*/
        var oldid = this.author.id
        console.log('author old id', oldid);

        this.author.attributes.name = form.value.name;
        this.author.attributes.date_of_birth = form.value.date_of_birth;
        this.author.attributes.date_of_death = form.value.date_of_death;
        console.log('author data for save with book include', this.author.toObject({ include: ['books'] }));
        console.log('author data for save without any include', this.author.toObject());
        this.author.save(/* { include: ['book'] } */).subscribe(success => {
            console.log('author saved', this.author.toObject());
            this.isEditMode = false;
            if ( oldid == '' ) { // if it was new record
            	this.router.navigate(['/authors', this.author.id]);
            }
        });
	}



}
