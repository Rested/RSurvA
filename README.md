# RSurvA - Secure, Anonymous Surveys

## Introduction
RSurvA is a tool to create anonymous surveys with end-to-end encryption. This project ensures that survey responses remain anonymous by restricting access to them on the surver, and private by encrypting them with a public key only the survey owner has access to. RSurvA (R-Surv-A) is a reference to the RSA cryptosystem being used.

## Key Benefits
1. **Client-Side Encryption:** Answers are encrypted with a public key on the client side before transmission, ensuring end-to-end privacy.
2. **Conditional Access:** Survey responses are accessible only after the survey duration has ended and the minimum response threshold is met, helping to achieve participant anonymity.
3. **Private Key Decryption:** Encrypted answers can only be unlocked by the survey owner after the survey has completed using a private key only they have access to.

To learn more about how this works in detail, please refer to our [How it Works](https://rested.github.io/RSurvA/how-it-works) page.

## Project Structure
Here is an overview of the project structure:
```
RSurvA/
├── be/                     # Backend source code (fastapi, redis, flyio, upstash)
├── fe/                     # Frontend source code (vite, preact, ts, tailwindcss, daisyui, gh-pages)
├── e2e/                    # End-to-end tests (cypress)
├── .github/                # GitHub actions (lint, test, e2e, deploy (fly and pages), post-deploy e2e)
└── docker-compose.yaml     # Docker Compose (be, fe, redis)
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

For more technical details and step-by-step sequences, please visit our [How it Works](https://github.com/RSurvA/how-it-works) page.

---

If you have any questions or need further assistance, feel free to open an issue.