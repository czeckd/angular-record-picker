import {Component, Input, Output, EventEmitter, OnChanges} from 'angular2/core';
import {NgClass,NgStyle} from 'angular2/common';

@Component({
	selector: 'record-picker',
	styleUrls: [ 'css/record-picker.css' ],
	styles: [`
		.filter-button {
			padding: 0 6px;
			border-radius: 0 4px 4px 0;
			box-shadow: none;
			margin: 8px 8px 8px -4px;
			font-size: 0.85em;
			font-weight: 600;
			color: #fff;
			vertical-align: middle;
			line-height: 1.550em;
			border: 1px solid #a7a7a7;
			color: #303030;
			background: #bfbfbf;
			background: linear-gradient(to bottom, #f0f0f0 0%,#bfbfbf 50%,#bfbfbf 51%,#bfbfbf 100%);
			cursor: pointer;
		}
		.filter-input {
			font-size: 1.0em;
			width: 134px;
			display: inline-block;
			float: none;
			vertical-align: middle;
			border-radius: 5px 0 0 5px;
			border: 1px solid #7c7c7c;
			padding: 1px 4px;
			box-shadow: inset 1px 1px 1px #c6c6c6;
			color: #303030;
		}
		.filter-svg {
			height:1em;
			width:1em;
			fill:#000;
			display:inline-block;
			vertical-align:middle;
			position:relative;
			top:-1px;
			margin:-3px;
		}
	`],
	template: `
		<form>
			<span *ngIf="showFilter===true">
				<input type="text" [(ngModel)]="pickerFilter" (ngModelChange)="onFilter()" class="filter-input">
				<button class="filter-button"><img src="images/funnel.svg" class="filter-svg" />&nbsp;</button><br/>
			</span>
			<div class="record-picker" [ngStyle]="{'max-height': height}">
			<ul>
				<li *ngFor="#rec of displayList; #i=index" (click)="selectRecord(rec)" [ngClass]="{selected:rec===record, disabled:hasNew}">
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

	@Input () record;
	@Output () recordChange = new EventEmitter();

	private pickerFilter:string = '';
	private displayList:Array<any>;

	private sortDisplayList() {
		if (this.keepSorted) {
			this.displayList.sort();
		}
	}

	ngOnChanges(changeRecord) {
		if (changeRecord.list) {
			if (this.list !== this.displayList) {
				this.displayList = this.list;
				this.sortDisplayList();
			}

			if (changeRecord.list.currentValue !== changeRecord.list.previousValue) {
				this.pickerFilter = '';
			}
		}
	}

	onFilter() {
		if (this.pickerFilter.length > 0) {
			this.displayList = this.list.filter( item => {
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

	selectRecord (rec) {
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
