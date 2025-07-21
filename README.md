# 🚀 Bright network Challenge 🚀

- Clone repo, npm i && npm run dev to run the project
- Project was done in 2 sessions, tried not to go over the 3 hours allocation (too much)
- Main logic sits within the Questionnaire component, which is checking if the user is "logged in", check if the user submitted any questions, if the user had submitted we display results component, otherwise we start the questionnaire

## Technologies used:

- React 18 ( Vite with Typescript )
- Classic CSS Components
- dateFNS for date formatting ( lightweight lib and updated regularly )
- Custom API hooks using Tanstack Query for better api calls, error handling
- UI deployment: [UI](https://bntest.vercel.app)
- Vercel
- Motion for smooth animations

## 🔮 Future Enhancements

- [ ] Enhanced responsive design for all device types
- [ ] Authentication system integration (Clerk/Auth0)
- [ ] Global state management with Jotai
- [ ] Comprehensive error handling and loading states
- [ ] Unit and integration tests with React Testing Library
- [ ] Tailwind CSS integration for faster styling
- [ ] Progress persistence across sessions
- [ ] Additional question types and assessment categories

## 📦 Installation & Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/puscasurazvan/bntest.git
   cd bright
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   # Add your API URL to the .env file
   VITE_API_URL=your_api_endpoint_here
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── Card/            # Feature cards
│   ├── Details/         # Assessment details section
│   ├── Header/          # Application header
│   ├── Questionnaire/   # Main questionnaire logic
│   └── Questions/       # Question components
├── hooks/               # Custom React hooks
│   ├── useFetchQuestions.ts
│   ├── useGetLatestSubmissions.ts
│   ├── useSubmitAnswers.ts
│   └── useUserFromUrl.ts
├── utils/               # Utility functions
└── App.tsx              # Main application component
```
