import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup,FormControl, Validators, ValidatorFn,AbstractControl, FormArray } from '@angular/forms';

import { Customer } from './customer';
import {debounceTime} from 'rxjs/operators';


function ratingRange(min: number, max: number): ValidatorFn {
  return (c: AbstractControl): { [key: string]: boolean } | null => {
    if (c.value !== null && (isNaN(c.value) || c.value < min || c.value > max)) {
      return { range: true };
    }
    return null;
  };
}

function emailMatcher(c: AbstractControl): { [key: string]: boolean } | null {
  const emailControl = c.get('email');
  const confirmControl = c.get('confirmEmail');

  if (emailControl?.pristine || confirmControl?.pristine) {
    return null;
  }

  if (emailControl?.value === confirmControl?.value) {
    return null;
  }
  return { match: true };
}


@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {
  customer = new Customer();
  customerForm!: FormGroup;
  emailMessage!: string;
  private validationMessages: any = {
    required: 'Please enter your email address.',
    email: 'Please enter a valid email address.'
  };

  constructor(
    private fb:FormBuilder
  ) { }

  get addresses(): FormArray {
    return this.customerForm.get('addresses') as FormArray;
  }

  ngOnInit(): void {
    this.customerForm = this.fb.group({
      firstName:['',[Validators.required,Validators.minLength(3)]],
      stubLastName:{value:'n/a',disabled:true},
      lastName:['',[Validators.required,Validators.minLength(50)]],
      email:['',  [Validators.required,Validators.email]],
      emailGroup: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        confirmEmail: ['', Validators.required],
      }, { validators: emailMatcher }),
      phone: '',
      rating: [null, ratingRange(1, 5)],
      notification: 'email',
      sendCatalog:true,
      addresses: this.fb.array([this.buildAddress()])
    })

    const emailControl = this.customerForm.get('emailGroup.email');
    emailControl?.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(
      value => this.setMessage(emailControl)
    );


  }


  addAddress(): void {
    this.addresses.push(this.buildAddress());
  }

  buildAddress(): FormGroup {
    return this.fb.group({
      addressType: 'home',
      street1: ['', Validators.required],
      street2: '',
      city: '',
      state: '',
      zip: ''
    });
  }

  setMessage(c: AbstractControl): void {
    this.emailMessage = '';
    if ((c.touched || c.dirty) && c.errors) {
      this.emailMessage = Object.keys(c.errors).map(
        key => this.validationMessages[key]).join(' ');
    }
  }

  updateFromCpnt(){
    this.customerForm.patchValue({
      firstName:'Nancy'
    })
  }

  save(): void {


    console.log(this.customerForm);
    console.log('Saved: ' + JSON.stringify(this.customerForm.value));
  }

  setNotification(notifyVia: string): void {
    const phoneControl = this.customerForm.get('phone');
    if (notifyVia === 'text') {
      phoneControl?.setValidators(Validators.required);
    } else {
      phoneControl?.clearValidators();
    }
    phoneControl?.updateValueAndValidity();
  }
}
