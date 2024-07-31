# RSurvA - Really Super Anonymous Surveys

Surveys which claim to be anonymous often do very little to ensure that they actually are.

RSurvA tries to do anonymous surveys better.

## 🚀 **[Discover how RSurvA works and start creating really super anonymous surveys now!](https://rsurva.pages.dev/)**


## Key Benefits
1. **Client-Side Encryption:** Answers are encrypted with a public key on the client side before transmission, meaning they are stored encrypted on the server, keeping answers private.
2. **Conditional Access:** Survey responses are accessible only after the survey duration has ended and the minimum response threshold is met, enabling participant anonymity. 
3. **Private Key Decryption:** Encrypted answers can only be unlocked by the survey owner after the survey duration has completed using a private key only they have access to.
4. **Open Source:** This project is open-source, which means it is auditable and can be self-hosted.

## Motivation

Surveys which claim to be anonymous often are not.

- They often require login, meaning the server knows exactly who provided which answer.
- They may well store answers unencrypted, making them viewable by any entity with access to the server.
- They often allow survey owners to see responses as they come in, making correlating them to when respondents saw the survey link possible.
- They also offer no stylometry counter-measures (to stop the survey owner from identifying respondents using stylometry).
- Finally, they often do nothing to randomize responses, making it easier to identify respondents by viewing all their answers at once and applying stylometry or other information on this broader dataset.

<b>RSurvA attempts to address all of these issues by providing a simple low trust approach.</b>
See the [How it Works](https://rsurva.pages.dev/how-it-works) page, especially the [Limitations & Mitigations](https://rsurva.pages.dev/how-it-works#limitations-and-mitigations) section for details on how!



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
Yes please! Feel free to add issues or open PRs. 

## License
This project is licensed under the [MIT License](LICENSE.txt).

## Anything Else

If you have any questions or want a feature feel free to open an issue.