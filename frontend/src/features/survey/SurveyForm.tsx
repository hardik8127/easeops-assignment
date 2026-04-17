import { useState } from "react";
import type { Survey, SurveyQuestion } from "@/types/user";
import { surveyApi } from "./surveyApi";

interface Props {
  survey: Survey;
  onComplete: () => void;
}

export function SurveyForm({ survey, onComplete }: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleChange = (qId: string, value: string) =>
    setAnswers((prev) => ({ ...prev, [qId]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await surveyApi.respond(survey.id, answers);
      setDone(true);
      onComplete();
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="text-center py-10 text-muted-foreground">
        <p className="text-lg font-semibold text-foreground">Thank you for your response!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">{survey.title}</h2>
      {(survey.questions as SurveyQuestion[]).map((q) => (
        <div key={q.id} className="space-y-2">
          <label className="block text-sm font-medium text-foreground">{q.text}</label>
          {q.type === "text" && (
            <textarea
              value={answers[q.id] ?? ""}
              onChange={(e) => handleChange(q.id, e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            />
          )}
          {q.type === "radio" &&
            q.options?.map((opt) => (
              <label key={opt} className="flex items-center gap-2 text-sm text-foreground">
                <input
                  type="radio"
                  name={q.id}
                  value={opt}
                  checked={answers[q.id] === opt}
                  onChange={() => handleChange(q.id, opt)}
                  className="accent-primary"
                />
                {opt}
              </label>
            ))}
        </div>
      ))}
      <button
        type="submit"
        disabled={submitting}
        className="bg-primary text-primary-foreground font-semibold rounded-lg py-2 px-5 hover:opacity-90 disabled:opacity-60 transition"
      >
        {submitting ? "Submitting…" : "Submit"}
      </button>
    </form>
  );
}
