// Landing page schema and type
export const landingPageSchema = {
  hero: {
    headline: "",
    subheadline: "",
    cta: "",
    backgroundImage: ""
  },
  features: [
    { title: "", description: "", icon: "" }
  ],
  theme: {
    primaryColor: "",
    secondaryColor: "",
    fontFamily: ""
  },
  analytics: {
    googleAnalyticsId: "",
    facebookPixelId: ""
  }
};

export type LandingPageConfig = typeof landingPageSchema;

export function getSchemaString() {
  return JSON.stringify(landingPageSchema, null, 2);
} 