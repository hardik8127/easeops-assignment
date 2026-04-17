import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { surveyApi } from "@/features/survey/surveyApi";
import { SurveyForm } from "@/features/survey/SurveyForm";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export function SurveyPage() {
  const [completed, setCompleted] = useState<number[]>([]);

  const { data: surveys = [], isLoading } = useQuery({
    queryKey: ["surveys"],
    queryFn: surveyApi.getSurveys,
  });

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Surveys</h1>
        <p className="text-muted-foreground text-sm mt-1">Share your feedback with us</p>
      </div>
      {isLoading ? (
        <LoadingSpinner />
      ) : surveys.length === 0 ? (
        <p className="text-muted-foreground">No active surveys at the moment.</p>
      ) : (
        surveys.map((survey) => (
          <div key={survey.id} className="bg-card border border-border rounded-xl p-6">
            <SurveyForm survey={survey} onComplete={() => setCompleted((c) => [...c, survey.id])} />
          </div>
        ))
      )}
    </main>
  );
}
