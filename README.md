# 🚀 Bright network Challenge 🚀

- Clone repo, npm i && npm run dev to run the project
- Project was done in 2 sessions, tried not to go over the 3 hours allocation (too much)
- Main logic sits within the Questionnaire component, which is checking if the user is "logged in", check if the user submitted any questions, if the user had submitted we display results component, otherwise we start the questionnaire

# Technologies used:

- React 18 ( Vite with Typescript )
- Classic CSS Components
- dateFNS for date formatting ( lightweight lib and updated regularly )
- Custom API hooks using Tanstack Query for better api calls, error handling
- UI deployment: [UI](https://bntest.vercel.app)
- Vercel
- Motion for smooth animations

## ✅ Things to do:

- Make it even more responsive for different types of devices
- Handle login using clerk / auth0
- Improve state management, maybe use tools liks jotai, to access data globally in the app
- Better error handling, error component, loading spinner
- Tests using React Testing library
- Use Tailwind for easier development, not needed in my opinion for this kind of test
