export interface ChartProps {
	class?: string;
	id: string;
	labels: string[];
	datasets: {
		label: string;
		data: number[];
		backgroundColor?: string | string[];
	}[];
	options?: {
		responsive: boolean;
		maintainAspectRatio: boolean;
	};
}

export const chartColours = ["rgb(10, 169, 255)", "rgb(245, 17, 17)"];
