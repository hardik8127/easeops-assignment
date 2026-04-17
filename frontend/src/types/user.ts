export interface FAQ {
  id: number;
  question: string;
  answer: string;
  order: number;
}

export interface Survey {
  id: number;
  title: string;
  questions: SurveyQuestion[];
  is_active: boolean;
  created_at: string;
}

export interface SurveyQuestion {
  id: string;
  text: string;
  type: "text" | "radio" | "checkbox";
  options?: string[];
}

export interface ContactForm {
  name: string;
  email: string;
  subject?: string;
  message: string;
}
