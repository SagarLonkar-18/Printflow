export interface OrderFile {
	id: string;
	originalName: string;
	copies: number;
	colorMode: string;
	status: string;
	pageCount: number;
	doubleSided: boolean;
	price: number;
}

export interface Order {
	id: string;
	createdAt: string;
	files: OrderFile[];
}