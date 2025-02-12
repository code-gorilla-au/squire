export type ComplexFormSchema = {
	startDate: Date;
	endDate: Date;
	allowDependabot: boolean;
	allowSecurity: boolean;
	chores: {
		dependabot: {
			completed: boolean;
			type: "dependabot" | "security";
			week: Date;
		}[];
		security: {
			completed: boolean;
			type: "dependabot" | "security";
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
		chores: {
			dependabot: [],
			security: [],
		},
	});

	constructor(initialData: ComplexFormSchema) {
		this.data = initialData;
	}
}
