export interface LegendEntry {
  name: string
  definition: string
}

export interface LegendSection {
  title: string
  entries: LegendEntry[]
}

export const legendSections: LegendSection[] = [
  {
    title: 'Clusters',
    entries: [
      {
        name: 'Privacy',
        definition:
          'Tools that help users protect their personal information and maintain control over their online privacy.',
      },
      {
        name: 'Rollback',
        definition:
          'Tools that allow for the reverting of actions to the previous state, usually in the context of rescinding penalizations imposed on a user.',
      },
      {
        name: 'Self-Moderation',
        definition:
          'Tools that help users monitor and regulate their own behavior or the content they create.',
      },
      {
        name: 'User Advisory',
        definition:
          'Tools that facilitate the notification or communication of information, such as warnings, reminders, alerts, etc. to users.',
      },
      {
        name: 'Automated Regulation',
        definition:
          'Tools that utilize automation or/and preset configurations to reduce time and effort to enforce regulatory actions without the need for ongoing human involvement.',
      },
      {
        name: 'Review',
        definition:
          'Tools that facilitate the re-evaluation, assessment, and feedback provision.',
      },
      {
        name: 'Communal Rewards',
        definition:
          'Tools that provide incentives to individuals in recognition of their contributions or achievements.',
      },
      {
        name: 'Pre-requisites',
        definition:
          'Tools that set the essential conditions, qualifications, or criteria that must be fulfilled in prior.',
      },
      {
        name: 'Punishment',
        definition:
          'Tools that are used to penalize users who have violated community guidelines or engaged in inappropriate behavior.',
      },
      {
        name: 'Participatory Governance',
        definition:
          'Tools that facilitate the engagement of member(s) in reporting and decision-making within a community or organization.',
      },
      {
        name: 'Communal Support',
        definition:
          'Tools that facilitate assistance and collaboration among members of a community to address common challenges, share knowledge, and provide support to one another.',
      },
      {
        name: 'Tracking',
        definition:
          'Tools that monitoring or recording of user activities, interactions, or data for various purposes such as analytics, personalization, or moderation.',
      },
      {
        name: 'Visibility Control',
        definition:
          'Tools that control or personalize the way a user sees their feed or what content of others they see on the platform.',
      },
      {
        name: 'Disengagement',
        definition:
          'Tools that enable users to reduce their level of engagement or involvement in a community.',
      },
      {
        name: 'Social Proximity Definition',
        definition:
          'Tools that define or create closeness or connection with another user.',
      },
    ],
  },
  {
    title: 'Customization',
    entries: [
      {
        name: 'Low',
        definition: 'The tool offers more than 2 options but less than 5.',
      },
      {
        name: 'Medium',
        definition:
          'The tool offers multiple options but the outcome is often controlled by the platform ultimately.',
      },
      {
        name: 'No',
        definition: 'The tool offers only 2 options (yes or no, on and off).',
      },
      {
        name: 'High',
        definition:
          'The tool can be well personalised by the user by choosing multiple options or introducing customized option.',
      },
    ],
  },
  {
    title: 'Target',
    entries: [
      {
        name: 'Feed',
        definition:
          'Stream of content that users see when they log into their accounts or visit a particular platform.',
      },
      {
        name: 'Voice',
        definition:
          'Voice-based content, especially real-time interactions between users.',
      },
      {
        name: 'Text',
        definition:
          'Textual content such as posts, comments, messages, captions, and other written communication.',
      },
      {
        name: 'Media',
        definition:
          'Various forms of multimedia content, including images, videos, GIFs, memes, and other visual or audiovisual content.',
      },
      {
        name: 'User',
        definition:
          'Actions, activity or content related to individual users, including their posts, comments, messages, profiles, and interactions.',
      },
      {
        name: 'Spam',
        definition:
          'Irrelevant or repetitive content. Spam can include automated or malicious messages, advertisements, or repetitive, low-quality posts.',
      },
    ],
  },
  {
    title: 'Tool Accessibility',
    entries: [
      {
        name: 'Power User',
        definition:
          'Elevated privileges compared to regular users, including volunteer moderators, administrators, and higher-tier users such as creators or business accounts.',
      },
      {
        name: 'User',
        definition: 'Regular users of the platform who have basic access rights.',
      },
      {
        name: 'Platform',
        definition:
          'Individuals or entities representing the platform itself, including commercial content moderators hired by the platform.',
      },
    ],
  },
  {
    title: 'Tool Persistence',
    entries: [
      {
        name: 'Adhoc',
        definition: 'Tool has to be used on a specific occasion.',
      },
      {
        name: 'Persistent',
        definition:
          'The effect of applying the tool persists after setting it once.',
      },
    ],
  },
]
