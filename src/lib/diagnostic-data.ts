export interface Question {
  id: number;
  text: string;
}

export interface Dimension {
  id: string;
  name: string;
  subtitle: string;
  questions: Question[];
  threshold: number; // score at or below this = show reflection
  reflection: string;
  reflectionPrompt: string;
}

export type Status = "green" | "amber" | "red";

export interface DimensionResult {
  dimension: Dimension;
  score: number;
  maxScore: number;
  status: Status;
  percentage: number;
}

export interface PatternInterpretation {
  id: string;
  label: string;
  description: string;
  condition: (results: DimensionResult[]) => boolean;
}

export const DIMENSIONS: Dimension[] = [
  {
    id: "icp-specificity",
    name: "ICP Specificity",
    subtitle:
      "Can you describe your buyer with enough precision to find them?",
    questions: [
      {
        id: 1,
        text: "Can you name the specific job title, function, and seniority level of your primary buyer?",
      },
      {
        id: 2,
        text: "Can you describe the specific pain your buyer experiences — in their language, not yours?",
      },
      {
        id: 3,
        text: "Can you identify at least 10 target accounts by name that match your ICP?",
      },
      {
        id: 4,
        text: "Is your ICP narrow enough that you could explain who you do NOT sell to?",
      },
    ],
    threshold: 2,
    reflection:
      "Your ICP is closer to a market segment than a buyer profile. Segments are useful for investors. Profiles are useful for sales. You need the profile.",
    reflectionPrompt:
      "If you emailed 50 people matching your ICP description, would they all recognise themselves as having the problem you solve?",
  },
  {
    id: "buyer-validation",
    name: "Buyer Validation",
    subtitle:
      "Have real buyers confirmed your assumptions?",
    questions: [
      {
        id: 5,
        text: "Have you conducted at least 10 substantive discovery conversations with people matching your ICP?",
      },
      {
        id: 6,
        text: "Did those conversations confirm that buyers experience the pain you're solving — unprompted?",
      },
      {
        id: 7,
        text: "Can you point to at least one buyer who described the problem in words you now use in your pitch?",
      },
    ],
    threshold: 1,
    reflection:
      "Your ICP is a hypothesis, not a finding. The difference matters — hypothetical ICPs produce hypothetical pipelines.",
    reflectionPrompt:
      "What's the last thing a potential buyer said that genuinely surprised you about how they experience this problem?",
  },
  {
    id: "decision-making-unit",
    name: "Decision-Making Unit",
    subtitle:
      "Do you know who decides, who pays, and who blocks?",
    questions: [
      {
        id: 8,
        text: "Can you distinguish between the person who feels the pain, the person who evaluates solutions, and the person who signs the contract?",
      },
      {
        id: 9,
        text: "Have you identified who inside the buyer's organisation could block or delay adoption — even after a decision to buy?",
      },
      {
        id: 10,
        text: "Do you know which budget line your product falls under in your buyer's organisation?",
      },
      {
        id: 11,
        text: "Have you mapped how decisions are typically made for purchases like yours (committee, single decision-maker, procurement process)?",
      },
    ],
    threshold: 2,
    reflection:
      "You're selling to the person who likes you, not the person who buys. In enterprise, these are rarely the same person.",
    reflectionPrompt:
      "In your last three sales conversations, were you speaking to someone with budget authority — or someone who would need to convince someone with budget authority?",
  },
  {
    id: "channel-entry-strategy",
    name: "Channel & Entry Strategy",
    subtitle:
      "Do you know how to reach your buyer and in what order?",
    questions: [
      {
        id: 12,
        text: "Have you identified the channels through which your ICP actually discovers and evaluates new solutions?",
      },
      {
        id: 13,
        text: "Is your go-to-market channel based on observed buyer behaviour rather than your own preferences or assumptions?",
      },
      {
        id: 14,
        text: "Have you chosen a beachhead segment to attack first — and can you articulate why that segment, in that order?",
      },
      {
        id: 15,
        text: "If you're targeting enterprise buyers, have you mapped the typical sales cycle length and procurement process for your price point?",
      },
    ],
    threshold: 2,
    reflection:
      "You have a buyer profile but no path to reach them. A well-defined ICP without a channel strategy is a portrait hanging in an empty room.",
    reflectionPrompt:
      "How did your last three paying customers actually find you — and is that channel repeatable at 10x volume?",
  },
  {
    id: "triangle-coherence",
    name: "Triangle Coherence",
    subtitle:
      "Does your ICP connect to your value proposition and pricing?",
    questions: [
      {
        id: 16,
        text: "Does your value proposition speak directly to the specific pain your ICP experiences — not a generic market need?",
      },
      {
        id: 17,
        text: "Is your pricing model compatible with how your ICP budgets and procures (e.g., per-seat for team tools, outcome-based for executive sponsors)?",
      },
      {
        id: 18,
        text: "If you changed your ICP tomorrow, would you also need to change your value proposition and pricing — or do they feel independent?",
      },
    ],
    threshold: 1,
    reflection:
      "Your ICP, value proposition, and pricing aren't reinforcing each other. This is the Layer 1 triangle: these three must resolve together, not independently. When the triangle is broken, you'll see symptoms downstream — pipeline that doesn't convert, pricing objections that feel irrational, champions who can't sell internally.",
    reflectionPrompt:
      "If your best customer described why they bought from you, would they mention the same value your pitch leads with?",
  },
];

export const PATTERN_INTERPRETATIONS: PatternInterpretation[] = [
  {
    id: "specificity-without-validation",
    label: "Specificity without validation",
    description:
      "You've built a detailed buyer profile, but it's based on assumptions rather than evidence. The most dangerous ICP is one that's precise and wrong.",
    condition: (results) => {
      const specificity = results.find((r) => r.dimension.id === "icp-specificity");
      const validation = results.find((r) => r.dimension.id === "buyer-validation");
      return (
        specificity !== undefined &&
        validation !== undefined &&
        specificity.status === "green" &&
        validation.status === "red"
      );
    },
  },
  {
    id: "validated-but-undifferentiated",
    label: "Validated but undifferentiated",
    description:
      "Buyers confirm the pain, but you're talking to the wrong people in the organisation. Pain owners and budget holders are rarely the same person in enterprise.",
    condition: (results) => {
      const validation = results.find((r) => r.dimension.id === "buyer-validation");
      const dmu = results.find((r) => r.dimension.id === "decision-making-unit");
      return (
        validation !== undefined &&
        dmu !== undefined &&
        validation.status === "green" &&
        dmu.status === "red"
      );
    },
  },
  {
    id: "strong-profile-no-path",
    label: "Strong profile, no path to market",
    description:
      "You know your buyer well but have no repeatable way to reach them. This is the gap between market research and go-to-market strategy.",
    condition: (results) => {
      const specificity = results.find((r) => r.dimension.id === "icp-specificity");
      const validation = results.find((r) => r.dimension.id === "buyer-validation");
      const channel = results.find((r) => r.dimension.id === "channel-entry-strategy");
      return (
        specificity !== undefined &&
        validation !== undefined &&
        channel !== undefined &&
        (specificity.status === "green" || specificity.status === "amber") &&
        (validation.status === "green" || validation.status === "amber") &&
        channel.status === "red"
      );
    },
  },
  {
    id: "broken-triangle",
    label: "Broken triangle",
    description:
      "Your ICP, value proposition, and pricing are operating independently. This is the most common Layer 1 pattern — founders work on each piece separately, but they only resolve together.",
    condition: (results) => {
      const triangle = results.find((r) => r.dimension.id === "triangle-coherence");
      const othersRed = results.filter(
        (r) => r.dimension.id !== "triangle-coherence" && r.status === "red"
      );
      return (
        triangle !== undefined &&
        triangle.status === "red" &&
        othersRed.length >= 1
      );
    },
  },
  {
    id: "universally-unclear",
    label: "Universally unclear",
    description:
      "Your ICP is still at the hypothesis stage across all dimensions. This isn't a refinement problem — it's a discovery problem. Before building pipeline, you need 15+ substantive buyer conversations.",
    condition: (results) => {
      const totalScore = results.reduce((sum, r) => sum + r.score, 0);
      return totalScore <= 8;
    },
  },
];

export const COI_COPY = {
  heading: "The Downstream Cost of an Unclear ICP",
  intro:
    "ICP gaps don't stay contained. They cascade through every subsequent layer of your business — from pilots that test the wrong thing, to pipeline that doesn't convert, to pricing objections that feel irrational but are actually structural.",
  body: "Startups that skip ICP clarity typically discover it as a Layer 3 problem — \"our pipeline isn't converting\" — when the real issue is two layers upstream. By that point, months of commercial effort have been invested in the wrong direction.",
};

export const CTA_COPY = {
  heading: "What This Diagnostic Surfaces — and What It Can't Fix",
  body: `This tool reveals where your buyer definition has gaps. It doesn't resolve them — because resolution requires working through the ICP–Value Prop–Price triangle with real buyer data, not self-assessment.

Each dimension of ICP clarity requires a different capability. Specificity requires research discipline. Validation requires genuine buyer conversations. DMU mapping requires enterprise sales experience. Channel strategy requires market testing. Triangle coherence requires the strategic judgment to hold all three in tension.`,
  callout:
    "If your profile shows gaps in two or more dimensions, a structured ICP workshop can resolve what self-assessment surfaces but can't fix alone.",
  contact: {
    name: "Alexandra N.",
    title: "Founder, Aieutics",
    subtitle: "Executive coaching & strategic transformation",
    website: "aieutics.com",
    email: "hello@aieutics.com",
  },
};

export const ATTRIBUTION =
  "Developed by Aieutics from the Critical Path Layers framework. Based on patterns observed across executive coaching, corporate accelerator programmes, and consulting engagements.";
