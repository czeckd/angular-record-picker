export class BasicList {
	picker:string;

	list:Array<any>;
	sift:Array<any>;

	constructor() {
		this.picker = '';
		// Arrays will contain objects of { _id, _name }.
		this.list = [];
		this.sift = [];
	}
}
