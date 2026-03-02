import { useConfigureSuggestions } from "@copilotkit/react-core/v2";

export const useExampleSuggestions = () => {
  useConfigureSuggestions({
    suggestions: [
      { title: "Pie chart ( Controlled Generative UI )", message: "Show me the distribution of energy consumption by system area as a pie chart." },
      { title: "Bar chart ( Controlled Generative UI )", message: "Show me total maintenance costs by equipment type as a bar chart." },
      { title: "Change theme ( Frontend Tools )", message: "Switch the app to dark mode." },
      { title: "Scheduling ( Human In The Loop )", message: "Schedule a review meeting for our upcoming planned maintenance shutdown." },
      { title: "Tasks ( Shared State )", message: "Open the task canvas and add a checklist for our Q2 planned maintenance shutdown." },
      { title: "P&ID Diagram ( Shared State )", message: "Show me a P&ID diagram for a cooling water loop with a tank, pump, heat exchanger, and control valve." },
    ],
    available: "always",
  });
}
