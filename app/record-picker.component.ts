import { Component, Input, EventEmitter, OnChanges, Output, SimpleChange } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';

@Component({
	selector: 'record-picker',
	styleUrls: [ 'css/record-picker.css' ],
	directives: [ NgClass, NgStyle ],
	styles: [`

		.filter {
			margin-bottom: -2em;
		}

		.filter::after {
			content:"o";
			width:40px;
			color:transparent;
			font-size:2em;
			background-image:url('images/funnel.svg');
			background-repeat:no-repeat;
			background-position:center center;
			opacity:.2;
			top: -31px;
			left: calc(100% - 21px);
			position:relative;
		}

		.filter-input {
			display: block;
			width:100%;
			padding: 1px 4px; 
			font-family: 'Open Sans', Verdana, Arial, Helvetica, sans-serif;
			font-size: 1em;
			color: #303030;
			float: none;
			border-radius: 5px;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
			box-sizing: border-box;
		}
	`],
	template: `
		<form>
			<div *ngIf="showFilter" class="filter">
				<input type="text" [(ngModel)]="pickerFilter" (ngModelChange)="onFilter()" class="filter-input">
 			</div>
			<div class="record-picker" [ngStyle]="{'max-height': height, 'min-height': height}">
				<ul>
					<li *ngFor="let rec of displayList;let i=index" (click)="selectRecord(rec)" [ngClass]="{selected:rec===record, disabled:hasNew}">
						<label>{{getLabel(i)}}</label>
					</li>
					<li *ngIf="displayList?.length===0"><label>&nbsp;</label></li>
				</ul>
			</div>
		</form>`
})

export class RecordPickerComponent implements OnChanges {
	@Input () list:any;
	@Input () display:any;

	@Input ('sort') keepSorted:boolean = typeof this.keepSorted !== 'undefined' ? this.keepSorted : false;
	@Input ('filter') filterKey:string = typeof this.filterKey !== 'undefined' ? this.filterKey : '_name';
	@Input ('show-filter') showFilter:boolean = typeof this.showFilter !== 'undefined' ? this.showFilter : true;
	@Input () height:string = typeof this.height !== 'undefined' ? this.height : '260px';
	@Input ('has-new') hasNew:boolean = false;

	@Input () record:any;
	@Output () recordChange = new EventEmitter();

	private pickerFilter:string = '';
	private displayList:Array<any>;

	private sortDisplayList() {
		if (this.keepSorted) {
			this.displayList.sort();
		}
	}

	ngOnChanges(changeRecord : { [key:string] : SimpleChange }) {
		if (changeRecord['list']) {
			if (this.list !== this.displayList) {
				this.displayList = this.list;
				this.sortDisplayList();
			}

			if (changeRecord['list'].currentValue !== changeRecord['list'].previousValue) {
				this.pickerFilter = '';
			}
		}
	}

	onFilter() {
		if (this.pickerFilter.length > 0) {
			this.displayList = this.list.filter( (item:any) => {
				if (Object.prototype.toString.call(item) === '[object Object]') {
					if (item[this.filterKey] !== undefined) {
						return item[this.filterKey].toLowerCase().indexOf(this.pickerFilter.toLowerCase()) !== -1;
					} else {
						return JSON.stringify(item).toLowerCase().indexOf(this.pickerFilter.toLowerCase()) !== -1;
					}
				} else {
					return item.toLowerCase().indexOf(this.pickerFilter.toLowerCase()) !== -1;
				}
			});
		} else {
			this.displayList = this.list;
		}
	}

	selectRecord(rec:any) {
		if (!this.hasNew) {
			if (this.record === rec) {
				this.record = null;
			} else {
				this.record = rec;
			}
		}
		this.recordChange.emit(this.record);
	}

	getLabel(idx:number) {
		let i:number, str:string = '', s:string, parts:Array<string>, nums:Array<string>;

		if (this.display !== undefined) {
			if (Object.prototype.toString.call( this.display ) === '[object Array]' ) {
				for (i = 0; i < this.display.length; i += 1) {
					if (str.length > 0) {
						str = str + '_';
					}

					if (this.display[i].indexOf('.') === -1) {
						// Simple, just add to string.
						str = str + this.displayList[idx][this.display[i]];
					} else {
						// Complex, some action needs to be performed
						parts = this.display[i].split('.');

						s = this.displayList[idx][parts[0]];
						if (s) {
							// Use brute force
							if (parts[1].indexOf('substring') !== -1) {
								nums = (parts[1].substring(parts[1].indexOf('(')+1, parts[1].indexOf(')'))).split(',');
								switch (nums.length) {
								case 1:
									str = str + s.substring(parseInt(nums[0], 10));
									break;
								case 2:
									str = str + s.substring(parseInt(nums[0], 10), parseInt(nums[1], 10));
									break;
								default:
									str = str + s;
									break;
								}
							} else {
								// method not approved, so just add s.
								str = str + s;
							}
						}
					}
				}
				return str;
			} else {
				return this.displayList[idx][this.display];
			}
		}

		switch (Object.prototype.toString.call(this.displayList[idx])) {
			case '[object Number]':
				return this.displayList[idx];
			case '[object String]':
				return this.displayList[idx];
			default:
				if (this.displayList[idx] !== undefined) {
					return this.displayList[idx][this.filterKey];
				}
		}
	}
}
