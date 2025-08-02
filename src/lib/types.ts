export type GoalPriority = "Low" | "Medium" | "High";

export interface Goal {
  id: string;
  title: string;
  targetDate: Date;
  priority: GoalPriority;
  isCompleted: boolean;
  completedAt: Date | null;
}
