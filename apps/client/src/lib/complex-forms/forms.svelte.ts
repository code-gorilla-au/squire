import { differenceInWeeks, isMonday, nextMonday } from "date-fns";
import { previousMonday } from "date-fns/fp";

export type ComplexFormSchema = {
	startDate: Date;
	endDate: Date;
	allowDependabot: boolean;
	allowSecurity: boolean;
	sprintAllocation: {
		dependabot: number;
		security: number;
	};
	chores: {
		dependabot: {
			completed: boolean;
			week: Date;
		}[];
		security: {
			completed: boolean;
			week: Date;
		}[];
	};
};

export class ComplexForm {
	data = $state<ComplexFormSchema>({
		startDate: new Date(),
		endDate: new Date(),
		allowDependabot: true,
		allowSecurity: true,
		sprintAllocation: {
			dependabot: 10,
			security: 10,
		},
		chores: {
			dependabot: [],
			security: [],
		},
	});

	constructor(initialData: ComplexFormSchema) {
		this.data = initialData;
		this.data.startDate = previousMonday(this.data.startDate);

		$effect(() => {
			this.watchDependabot();
			this.watchSecurity();
		});
	}

	private watchDependabot() {
		if (!this.data.allowDependabot) {
			this.data.chores.dependabot = [];
		} else {
			this.data.chores.dependabot = this.buildWeeklyChores();
		}
	}
	private watchSecurity() {
		if (!this.data.allowSecurity) {
			this.data.chores.security = [];
		} else {
			this.data.chores.security = this.buildWeeklyChores();
		}
	}
	private buildWeeklyChores() {
		const iter = differenceInWeeks(this.data.endDate, this.data.startDate);

		let current = this.data.startDate;
		if (!isMonday(current)) {
			current = previousMonday(current);
		}

		const list: { completed: boolean; week: Date }[] = [];

		for (let i = 0; i < iter; i++) {
			const next = nextMonday(current);
			list.push({
				completed: false,
				week: next,
			});

			current = next;
		}

		return list;
	}
}
