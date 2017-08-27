import {Component, DoCheck, Input, Output, ElementRef, EventEmitter, HostListener, IterableDiffers,
	OnChanges, SimpleChange} from '@angular/core';

import { BasicList } from './basic-list';

@Component({
	selector: 'record-picker',
	styleUrls: [ './record-picker.component.css' ],
	template: `
<form>
	<div *ngIf="filter" class="filter">
		<input type="text" [(ngModel)]="available.picker" name="picker" (ngModelChange)="onFilter()" class="filter-input" [disabled]="disabled">
	</div>
	<div class="record-picker" [ngStyle]="{'max-height': height}" style="min-height:20px;min-width:200px;" tabindex="-1">
		<ul>
			<li *ngFor="let rec of available.sift; let i=index" (click)="selectRecord(rec)"
					[ngClass]="{ 'selected' : rec._record===record, 'disabled' : disabled}">
				<label>{{rec._name}}</label>
			</li>
			<li *ngIf="available.sift.length===0"><label>&nbsp;</label></li>
		</ul>
	</div>
</form>
`
})
export class RecordPickerComponent implements DoCheck, OnChanges {
	available = new BasicList();
	sourceDiffer:any;

	@Input() list:Array<any>;
	@Input() key = '_id';
	@Input() display = '_name';
	@Input() filter = true;
	@Input() height = '260px';
	@Input() disabled = false;
	@Input() sort = true;
	@Input() first = false;

	@Input() record:any = null;
	@Output() recordChange = new EventEmitter();

	@Input() compare = (a:any, b:any) => { return (a._name < b._name) ? -1 : ((a._name > b._name) ? 1 : 0); };

	constructor(private elem:ElementRef, private differs:IterableDiffers) {
	}

	@HostListener('keydown', ['$event'])
	onKeyDown(event:KeyboardEvent) {
		const target:any = event.target;
		if (target.tagName.toLowerCase() !== 'input') {
			const key = event.key.toLowerCase();
			let dir = 0;
			if (key.indexOf('down') !== -1) {
				dir = 1;
			} else if (key.indexOf('up') !== -1) {
				dir = -1;
			}

			if (dir) {
				event.stopPropagation();
				this.nextRecord(dir);

				const selected = this.elem.nativeElement.getElementsByClassName('selected');
				if (selected[0]) {
					event.preventDefault();
					try {
						const el = (dir < 0 ? selected[0].previousSibling : selected[0]);
						el.scrollIntoView();
					}
					/* tslint:disable:no-empty */
					catch (ignore) {}
					/* tslint:enable:no-empty */
				}
			}
		}
	}

	ngOnChanges(changeRecord: {[key:string]:SimpleChange} ) {
		if (changeRecord['list']) {
			this.available = new BasicList();
			this.updatedSource();
		}

		if (changeRecord['disabled']) {
			if (this.sort) {
				this.available.list.sort(this.compare);
			}
		}
	}

	ngDoCheck() {
		if (this.list && this.buildAvailable(this.list)) {
			this.onFilter(this.available);
		}
	}

	buildAvailable(source:Array<any>) : boolean {
		let sourceChanges = this.sourceDiffer.diff(source);
		if (sourceChanges) {
			sourceChanges.forEachRemovedItem((r:any) => {
				let idx = this.findItemIndex(this.available.list, r.item, this.key);
				if (idx !== -1) {
					this.available.list.splice(idx, 1);
				}
			});

			sourceChanges.forEachAddedItem((r:any) => {
				// Do not add duplicates even if source has duplicates.
				if (this.findItemIndex(this.available.list, r.item, this.key) === -1) {
					this.available.list.push( { _id: this.makeId(r.item), _name: this.makeName(r.item), _record: r.item });
				}
			});

			if (this.sort) {
				this.available.list.sort(this.compare);
			}
			this.available.sift = this.available.list;

			if (this.first) {
				this.selectRecord(this.available.sift[0]);
			}

			return true;
		}
		return false;
	}

	updatedSource() {
		this.available.list.length = 0;

//		if (this.list !== undefined) {
		if (this.list) {
			this.sourceDiffer = this.differs.find(this.list).create(null);
		}
	}

	// https://stackoverflow.com/a/16552413
	getPropertyByKeyPath(item:any, keyPath:string) {
		if (item) {
			let keys = keyPath.split('.');
			if (keys.length === 0) {
				return undefined;
			}
			keys = keys.reverse();

			let subItem = item;
			while (keys.length) {
				const k = keys.pop();
				if (!subItem.hasOwnProperty(k)) {
					return undefined;
				} else {
					subItem = subItem[k];
				}
			}
			return subItem;
		}
		return undefined;
	}

	findItemIndex(list:Array<any>, item:any, key:any = '_id') {
		let idx = -1;
		const gpbkp = this.getPropertyByKeyPath;

		function matchObject(e:any) {
			if (e._id === gpbkp(item, key)) {
				idx = list.indexOf(e);
				return true;
			}
			return false;
		}

		function match(e:any) {
			if (e._id === item) {
				idx = list.indexOf(e);
				return true;
			}
			return false;
		}

		// Assumption is that the arrays do not have duplicates.
		if (typeof item === 'object') {
			list.filter(matchObject);
		} else {
			list.filter(match);
		}

		return idx;
	}

	onFilter(source:BasicList = this.available) {
		if (source.picker.length > 0) {
			let filtered = source.list.filter( (item:any) => {
				if (Object.prototype.toString.call(item) === '[object Object]') {
					if (item._name !== undefined) {
						return item._name.toLowerCase().indexOf(source.picker.toLowerCase()) !== -1;
					} else {
						return JSON.stringify(item).toLowerCase().indexOf(source.picker.toLowerCase()) !== -1;
					}
				} else {
					return item.toLowerCase().indexOf(source.picker.toLowerCase()) !== -1;
				}
			});
			source.sift = filtered;
		} else {
			source.sift = source.list;
		}

	}

	selectRecord(rec:any) {
		if (!this.disabled) {
			if (this.record === rec._record) {
				this.record = null;
			} else {
				this.record = rec._record;
				this.elem.nativeElement.focus();
			}
			this.recordChange.emit(this.record);
		}
	}

	nextRecord(dir:number) {
		if (!this.disabled) {
			const idx = this.findItemIndex(this.available.sift, this.record, this.key);
			const len = this.available.sift.length;

			if ((idx >= 0) && ((idx + dir >= 0) && (idx + dir < len))) {
				this.selectRecord(this.available.sift[idx + dir]);
			}
		}
	}

	private makeId(item:any) : string | number {
		if (typeof item === 'object') {
			return this.getPropertyByKeyPath(item, this.key);
		} else {
			return item;
		}
	}

	// Allow for complex names by passing an array of strings.
	// Example: [display]="[ '_type.substring(0,1)', '_name' ]"
	private makeName(item:any) : string {
		const display = this.display;

		function fallback(itm:any) {
			switch (Object.prototype.toString.call(itm)) {
			case '[object Number]':
				return itm;
			case '[object String]':
				return itm;
			default:
				if (itm !== undefined) {
					return itm[display];
				} else {
					return 'undefined';
				}
			}
		}

		let str = '';

		if (display !== undefined) {
			if (Object.prototype.toString.call( display ) === '[object Array]' ) {

				for (let i = 0; i < display.length; i += 1) {
					if (str.length > 0) {
						str = str + '_';
					}

					if (display[i].indexOf('.') === -1) {
						// Simple, just add to string.
						str = str + item[display[i]];
					} else {
						// Complex, some action needs to be performed
						let parts = display[i].split('.');

						let s = item[parts[0]];
						if (s) {
							// Use brute force
							if (parts[1].indexOf('substring') !== -1) {
								let nums = (parts[1].substring(parts[1].indexOf('(') + 1, parts[1].indexOf(')'))).split(',');

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
								str = str + this.getPropertyByKeyPath(item, this.key);
							}
						}
					}
				}
				return str;
			} else {
				return fallback(item);
			}
		}

		return fallback(item);
	}
}
