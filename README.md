# Resources
*https://blogs.msmvps.com/deborahk/
* github.com/DeborahK/Angular-ReactiveForms

* from template driver and reactive forms 

# Template-Driver vs Reactive Forms

## Form Building BloCKS
* value changed : pristine, dirty 
* validty: valid, errors
* touched,untouched

* form is managed as a formGroup
* formModel has nested formGroups
![](./images/0.png)

# Building a Reactive Form
[customer component](Angular-ReactiveForms\demo-start-v12\src\app\customers\customer.component.ts)
* we define form model ourselves
* formArrays

## Binding to the form Model
* use formContralName biding to track every input we want to track

![](./images/1.png)

## setValue PatchValue
* to update html from form component
* use setValue to update whole form patchValue to update part
![](./images/2.png)

## Formbuilder
instead of this
```ts
    this.customerForm = FormBuilder({
      firstName:new FormControl(),
      lastName:new FormControl(),
      email:new FormControl(),
      sendCatalog:new FormControl(true)
    })
```

use this
```ts
    this.customerForm = this.fb.group({
      firstName:'',
      lastName:'',
      email:'',
      sendCatalog:true
    })
```

# Validation
* 3 param is async validation
* async validation doenst execute till all sync validatiors pass
![](./images/3.png)


## Adjusting Validation Rules at Runtime
* it will not change in the html call the last method to have the html update
  * also need click binding
![](./images/4.png)

refere to cusomterComponent.setNotifcaiton

## Custom Validator
* null if custom is valid
* key value pair if invlaid
![](./images/5.png)
* look at CustomerCompont RatingRange

## Custom Validator WIth Paramnters
RatingRange , validation donest support it so you need to wrap it

## Cross-Field Validation
* start is before end date
* use formGroupName for child form group  then formControlName as regular
![](./images/6.png)

### Validator fn
![](./imagees/7.png)

# Reacting to Changes
* valueChanges, more info
* statusChange, if the status has changed
![](./images/8.png)
* can go on root formGroup,child formGroup, formControl
![](./images/9.png)

![](./images/10.png)
* use debeonucetime for the user to react to changes
# Dynamic Duplicate Input Elements

```ts

  get addresses(): FormArray {
    return this.customerForm.get('addresses') as FormArray;
  }
  
    this.customerForm = this.fb.group({
      addresses: this.fb.array([this.buildAddress()])
    })


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
```



