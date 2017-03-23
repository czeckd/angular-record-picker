# angular-record-picker

The record-picker is an Angular 2 component that works similiarly to a select 
input item, but displays all the choices before and after the selection is 
made. An array of strings or objects can be passed to the `record-picker` for 
display in the pick list.

## Demo

A [working demo](http://czeckd.github.io/angular-record-picker/demo/) shows
the component in action. The demo shows London Underground stops from the 
Bakerloo Line and allows for them to be picked.

## Usage

Copy the `record-picker.css` and link it in the application's `index.html` 
file. Copy `record-picker.component.ts` into your app and then import the
`RecordPickerComponent` into a component and include it in that component's
directives. For a usage example, see `demo-app.component.ts`.

### Getting started

1. Clone this repo
1. Install the dependencies:
	```
    npm install
	```
1. Run the TypeScript compiler and start the server:
	```
	npm start
	```

## License

MIT


## Author
- David Czeck [@czeckd](https://github.com/czeckd)
