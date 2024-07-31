export const sequenceDiagram = `sequenceDiagram
    participant Survey Owner
    participant Frontend
    participant Backend
    participant Respondent

    Survey Owner->>Frontend: Create New Survey (Enter Details, Add Questions)
    Frontend->>Frontend: Generate RSA Key Pair
    Frontend->>Backend: Store Survey Details and Public Key
    Frontend->Survey Owner: Display Private Key, Public Key, and Survey Link
    Survey Owner->Survey Owner: Save Private Key Securely
    Survey Owner->>Respondent: Share Survey Link

    Respondent->>Frontend: Access Survey Link
    Frontend->>Backend: Fetch Survey Details (Questions and Public Key)
    Backend->>Frontend: Return Questions and Public Key
    Frontend->Respondent: Display Questions

    Respondent->Frontend: Submit Answers
    Frontend->>Frontend: Encrypt Answers with Public Key
    Frontend->>Backend: Store Encrypted Answers

    Survey Owner->>Frontend: Check on survey
    Frontend->>Backend: Fetch Survey Details and Encrypted Answers
    Backend->>Backend: Check Conditions (Duration & Min Responses Met)
    Backend-->>Frontend: Return Encrypted Answers (If conditions met)

    Survey Owner->>Frontend: Provide Private Key
    Survey Owner->Frontend: Request Decryption
    Frontend->Frontend: Decrypt Responses Using Private Key
    Frontend->>Survey Owner: Decrypted Responses`;

export const infrastructureDiagram = `
graph LR
  G[GitHub Repository]
  F[Frontend deployed on Cloudflare Pages]
  B[Backend deployed on Fly.io]
  R[Redis on Fly Upstash]

  G -- deploys to --> F
  G -- deploys to --> B
  F -- API Calls --> B
  B -- stores data in --> R

  style G fill:#bbf,stroke:#333,stroke-width:2px
  style F fill:#f9f,stroke:#333,stroke-width:2px
  style B fill:#bfb,stroke:#333,stroke-width:2px
  style R fill:#fbf,stroke:#333,stroke-width:2px
`;
