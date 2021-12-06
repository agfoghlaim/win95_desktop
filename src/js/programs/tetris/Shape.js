export default class Shape {

	constructor() {}

	randomShape() {
		let random = Math.floor(Math.random() * (7 - 1 + 1) + 1);
		return this.constructor.getShapes(random);
	}

	static getShapes(index) {
		const shapes = [
			{
				name: 'T',
				fill: 'pink',
				offset: { x: 0, y: 0 },
				matrix: [
					[0, 0, 0],
					[1, 1, 1],
					[0, 1, 0],
				],
			},
			{
				name: 'W',
				fill: 'orange',
				offset: { x: 0, y: 0 },
				matrix: [
					[0, 2, 0],
					[2, 2, 0],
					[2, 0, 0],
				],
			},
			{
				name: 'S',
				fill: 'yellow',
				offset: { x: 0, y: 0 },
				matrix: [
					[0, 0, 0],
					[3, 3, 0],
					[3, 3, 0],
				],
			},
			{
				name: 'I',
				fill: 'white',
				offset: { x: 0, y: 0 },
				matrix: [
					[0, 4, 0, 0],
					[0, 4, 0, 0],
					[0, 4, 0, 0],
					[0, 4, 0, 0],
				],
			},
			{
				name: 'M',
				fill: 'blue',
				offset: { x: 0, y: 0 },
				matrix: [
					[5, 0, 0],
					[5, 5, 0],
					[0, 5, 0],
				],
			},
			{
				name: 'L',
				fill: 'brown',
				offset: { x: 0, y: 0 },
				matrix: [
					[6, 6, 0],
					[6, 0, 0],
					[6, 0, 0],
				],
			},
			{
				name: 'T',
				fill: 'red',
				offset: { x: 0, y: 0 },
				matrix: [
					[7, 7, 0],
					[0, 7, 0],
					[0, 7, 0],
				],
			},
		];

		return shapes[index - 1] || shapes;
	}
}
