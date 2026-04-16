export interface Decision {
  date: string
  description: string
}

export interface Intent {
  goals: string[]
  constraints: string[]
  decisions: Decision[]
  openQuestions: string[]
}
