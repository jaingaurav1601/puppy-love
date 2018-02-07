import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatChipInputEvent } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';

import { MainService } from '../../services/main.service';

function ImageURL(rollnum: string, userid: string) {
    const iitkhome = `http://home.iitk.ac.in/~${ userid }/dp`;
    const oaimage = `https://oa.cc.iitk.ac.in/Oa/Jsp/Photo/${ rollnum }_0.jpg`;
    return `url("${ iitkhome }"), url("${ oaimage }")`;
}

@Component({
  selector: 'puppy-home',
  templateUrl: './home.component.html',
  styleUrls: [ './home.component.scss' ]
})
export class HomeComponent implements OnInit {

  // Enter, comma
  separatorKeysCodes = [ENTER, COMMA];

  user$: any;

    constructor(private main: MainService,
                private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.user$ = this.main.user$;
    this.doSubmit();
  }

  get url() {
    const currentUser = {
      ...this.main.user$.value
    };
    console.log(currentUser);
    return this.sanitizer.bypassSecurityTrustStyle(ImageURL(currentUser._id, currentUser.email));
  }

  maleHearts(user) {
    return user.data.received.filter((x) => x.genderOfSender === '1');
  }

  femaleHearts(user) {
    return user.data.received.filter((x) => x.genderOfSender === '0');
  }

  add(event): void {
    const currentUser = {
      ...this.main.user$.value
    };

    if (event._id !== currentUser._id && !currentUser.data.choices.some((x) => x._id === event._id)) {
      currentUser.data.choices.push(event);
      this.main.user$.next(currentUser);
    }
  }

  // add(event: MatChipInputEvent): void {
  //   const input = event.input;
  //   const value = event.value;

  //   const currentUser = {
  //     ...this.main.user$.value
  //   };
  //   if ((value || '').trim()) {
  //     currentUser.data.choices.push({ _id: value.trim(), name: 'Foobar', email: 'foobar' });
  //     this.main.user$.next(currentUser);
  //   }

  //   // Reset the input value
  //   if (input) {
  //     input.value = '';
  //   }
  // }

  remove(fruit: any): void {
    const currentUser = {
      ...this.main.user$.value
    };
    const index = currentUser.data.choices.indexOf(fruit);

    if (index >= 0) {
      currentUser.data.choices.splice(index, 1);
      this.main.user$.next(currentUser);
    }
  }

  doSubmit() {
    const user = this.user$.value;
    if (user.submitted) {
      this.onSubmit();
    }
  }

  onSubmit() {
    this.main.submit().subscribe(
      () => console.log('Successfully Submitted'),
      (error) => console.log('An error occurred: ' + error)
    );
  }

  onSave() {
    this.main.save();
  }
}
