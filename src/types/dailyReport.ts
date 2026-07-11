export interface DailyReport {
  id: string;

  reportId: string;

  staffId: string;

  staffName: string;

  work: string;

  hoursWorked: number;

  status:
    | "Completed"
    | "In Progress"
    | "Pending";

  achievement: string;

  problems: string;

  tomorrowPlan: string;

  reportDate: string;

  submittedAt: string;
}

export interface CreateDailyReport {
  staffId: string;

  staffName: string;

  work: string;

  hoursWorked: number;

  status:
    | "Completed"
    | "In Progress"
    | "Pending";

  achievement: string;

  problems: string;
  
  tomorrowPlan: string;
}