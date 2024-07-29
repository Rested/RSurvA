# RSurvA - Secure, Anonymous Surveys

## Introduction
RSurvA is a tool to create anonymous surveys.

## Key Benefits
1. **Client-Side Encryption:** Answers are encrypted with a public key on the client side before transmission, meaning they are stored encrypted on the server, keeping answers private.
2. **Conditional Access:** Survey responses are accessible only after the survey duration has ended and the minimum response threshold is met, enabling participant anonymity. 
3. **Private Key Decryption:** Encrypted answers can only be unlocked by the survey owner after the survey duration has completed using a private key only they have access to.
4. **Open Source:** This project is open-source, which means it is auditable and can be self-hosted.

To learn more about how RSurvA works in detail, please refer to the [How it Works](https://rsurva.pages.dev/how-it-works) page, especially the [limitations and mitigations section](https://rsurva.pages.dev/how-it-works#limits-and-mitigations) and the [sequence diagram](https://rsurva.pages.dev/how-it-works#sequence-diagram).

## Project Structure
Here is an overview of the project structure:
```
RSurvA/
├── be/                     # Backend source code (fastapi, redis, flyio, upstash)
├── fe/                     # Frontend source code (vite, preact, ts, tailwindcss, daisyui, gh-pages)
├── e2e/                    # End-to-end tests (cypress)
├── .github/                # GitHub actions (lint, test, e2e, deploy (fly and cloudflare pages), post-deploy e2e)
├── docker-compose.yaml     # Docker Compose (be, fe, redis)
└── README.md               # You are here 
```

## Getting Started
1. **Clone the Repository:**
   ```bash
   git clone https://github.com/rested/RSurvA.git
   cd RSurvA
   ```

2. **Build and Run with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

3. **Opening the Project:**
   Navigate to `http://localhost:4173` in your browser to access the frontend running in docker.

4. **Run tests:**
   Go to `e2e` and run `npm i`. Now run `npm run test:docker`

You can also run the frontend with `npm dev` or the backend with `uvicorn app:app --reload`.

## Contributing
Yes please! 

## License
This project is licensed under the [MIT License](LICENSE.txt).

## Anything Else

If you have any questions or want a feature feel free to open an issue.