
export const evaluationChecklist = [
  ...Array.from({ length: 5 }, (_, i) => ({
    title: `Evaluator ${i + 1}`,
    description: '',
    criteria: [
      { text: "Potential candidates for keys roles were present during the presentation. Experience and Technical Qualifications/Capabilities", value: i === 0 ? 100 : 0 },
      { text: "Proposed Programmatic Approach", value: i === 0 ? 100 : 0 },
      { text: "Commercial Excellence", value: i === 0 ? 100 : 0 },
      { text: "Innovative Solutions", value: i === 0 ? 100 : 0 },
      { text: "Mission Critical Experience/Data Center Experience", value: i === 0 ? 100 : 0 },
    ],
    observations: {
      placeholder: "Provide additional information if GC scored a \"5 | Good/Average\" or below."
    }
  })),
  {
    title: "NICON",
    description: '',
    criteria: [
      { text: "NICON - Contractor has experience managing NICON projects", value: 0 },
      { text: "NICON - Contractor demonstrated clear understanding of fiber installation", value: 0 },
      { text: "NICON - Criterion 3", value: 0 },
      { text: "NICON - Criterion 4", value: 0 },
      { text: "NICON - Criterion 5", value: 0 },
    ],
    observations: {
      placeholder: "Provide additional information if GC scored a \"5 | Good/Average\" or below."
    }
  },
  {
    title: "EHS",
    description: 'If a supplier has a "1-Poor" evaluation on EHS, the supplier will be reavaluated by DGS.',
    criteria: [
      { text: "EHS - Does the contractor provide EHS Policies that meet or exceed Google's program?", value: 100 },
      { text: "EHS - Did the contractor bring an EHS Professional to the presentation meeting?", value: 0 },
      { text: "EHS - Does the contractors safety culture meet Google's safety culture?", value: 0 },
      { text: "EHS - Criterion 4", value: 0 },
      { text: "EHS - Criterion 5", value: 0 },
      { text: "EHS - Criterion 6", value: 0 },
      { text: "EHS - Criterion 7", value: 0 },
      { text: "EHS - Criterion 8", value: 0 },
    ],
    observations: {
      placeholder: "Provide additional information if GC scored a \"5 | Good/Average\" or below."
    }
  },
  {
    title: "GPO",
    description: '',
    criteria: [
      { text: "GPO - EOI - On time/No Delay", value: 0 },
      { text: "GPO - RFP - On time/No Delay", value: 0 },
      { text: "GPO - Presentation agenda was followed", value: 0 },
      { text: "GPO - Active Communication", value: 0 },
      { text: "GPO - Criterion 5", value: 0 },
      { text: "GPO - Criterion 6", value: 0 },
      { text: "GPO - Criterion 7", value: 0 },
      { text: "GPO - Criterion 8", value: 0 },
    ],
    observations: {
      placeholder: "Provide additional information if GC scored a \"5 | Good/Average\" or below."
    }
  },
  {
    title: "FEP/MARCUS PMO",
    description: '',
    criteria: [
      { text: "FEP/PMO - Criterion 1", value: 0 },
      { text: "FEP/PMO - Criterion 2", value: 0 },
      { text: "FEP/PMO - Criterion 3", value: 0 },
      { text: "FEP/PMO - Criterion 4", value: 0 },
      { text: "FEP/PMO - Criterion 5", value: 0 },
      { text: "FEP/PMO - Criterion 6", value: 0 },
      { text: "FEP/PMO - Criterion 7", value: 0 },
      { text: "FEP/PMO - Criterion 8", value: 0 },
    ],
    observations: {
      placeholder: "Provide additional information if GC scored a \"5 | Good/Average\" or below."
    }
  }
];

    