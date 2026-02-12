# Grind Grid
A unified coding activity dashboard that visualizes your problem-solving journey across platforms like Codeforces, LeetCode, and GitHub.

Grind consistently. Track visually. Stay motivated.

## Tech Stack
- React.js
- TypeScript
- Node.js
- Express.js
- APIs

## How to use it?
- Enter your username in the specified platofrm input field and click on the "Go" button to fetch your activity data.

- For embeding the dashboard, you can use the following iframe code:
```
<iframe src="https://grindgrid-b.vercel.app/heatmap?leetcode=" width="100%"></iframe>
```
Supported Platforms: 
- GitHub: github=
- LeetCode: leetcode=
- Codeforces: codeforces=

## Setup & Run Locally

``` bash
  git clone https://github.com/AnshKumar200/Grind-Grid.git
  cd Grind-Grid
  
 # Fontend
  npm install
  npm run dev
  
  # Backend
  cd api
  # create a .env file following the .env.example file and fill the required environment variables
  npm install
  npm run dev
```

## Roadmap
- Add more ways to visualize activity ( major focus right now )
- Add support for more platforms
- Improve performance and scalability
