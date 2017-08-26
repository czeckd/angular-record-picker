import { Component } from '@angular/core';

@Component({
	selector: 'demo-app',
	template:`
		<div style="margin:25px;">
			<form>
				<label><strong>Type of array: </strong></label>
				<label><input type="radio" name="tubedata" (click)="toggle()">strings</label>
				<label><input type="radio" name="tubedata" checked (click)="toggle()">objects</label>
			</form>

			<p><strong>Selected Record:</strong> {{record|json}}</p>
			<div style="width:200px;">
				<record-picker [list]="stops" [(record)]="record"></record-picker>
			</div>
		</div>
`
})

export class DemoAppComponent {

	private static StrTubeStops:Array<string> = [
		'Harrow & Wealdstone',
		'Kenton',
		'South Kenton',
		'North Wembley',
		'Wembley Central',
		'Stonebridge Park',
		'Harlesden',
		'Willesden Junction',
		'Kensal Green',
		"Queen's Park",
		'Kilburn Park',
		'Maida Vale',
		'Warwick Avenue',
		'Paddington',
		'Edgware Road',
		'Marylebone',
		'Baker Street',
		"Regent's Park",
		'Oxford Circus',
		'Piccadilly Circus',
		'Charing Cross',
		'Embankment',
		'Waterloo',
		'Lambeth North',
		'Elephant & Castle'
	];

	private static ObjTubeStops:Array<Object> = [
		{ _id: 1, _name: 'Harrow & Wealdstone' },
		{ _id: 2, _name: 'Kenton' },
		{ _id: 3, _name: 'South Kenton' },
		{ _id: 4, _name: 'North Wembley' },
		{ _id: 5, _name: 'Wembley Central' },
		{ _id: 6, _name: 'Stonebridge Park' },
		{ _id: 7, _name: 'Harlesden' },
		{ _id: 8, _name: 'Willesden Junction' },
		{ _id: 9, _name: 'Kensal Green' },
		{ _id: 10, _name: "Queen's Park" },
		{ _id: 11, _name: 'Kilburn Park' },
		{ _id: 12, _name: 'Maida Vale' },
		{ _id: 13, _name: 'Warwick Avenue' },
		{ _id: 14, _name: 'Paddington' },
		{ _id: 15, _name: 'Edgware Road' },
		{ _id: 16, _name: 'Marylebone' },
		{ _id: 17, _name: 'Baker Street' },
		{ _id: 18, _name: "Regent's Park" },
		{ _id: 19, _name: 'Oxford Circus' },
		{ _id: 20, _name: 'Piccadilly Circus' },
		{ _id: 21, _name: 'Charing Cross' },
		{ _id: 22, _name: 'Embankment' },
		{ _id: 23, _name: 'Waterloo' },
		{ _id: 24, _name: 'Lambeth North' },
		{ _id: 25, _name: 'Elephant & Castle' }
	];

	private stops:any = DemoAppComponent.ObjTubeStops;
	private record:any;

	toggle() {
		this.record = undefined;
		if (this.stops === DemoAppComponent.StrTubeStops) {
			this.stops = DemoAppComponent.ObjTubeStops;
		} else {
			this.stops = DemoAppComponent.StrTubeStops;
		}
	}

}
