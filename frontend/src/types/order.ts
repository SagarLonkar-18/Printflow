export interface OrderFile {
	id: string;
	originalName: string;
	copies: number;
	colorMode: string;
	status: string;
	pageCount: number;
	doubleSided: boolean;
}

export interface Order {
	id: string;
	createdAt: string;
	files: OrderFile[];
}