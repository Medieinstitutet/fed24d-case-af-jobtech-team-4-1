# 🌱 Kodbanken – Branch Out

Welcome to **Kodbanken – Branch Out**, a React-based job portal for developers. Here you can explore open positions, filter them by tech stack, and commit to your next career step. 🚀

## 🔍 Project overview

The task was to build a custom job portal using [Arbetsförmedlingens JobSearch API](https://jobsearch.api.jobtechdev.se/), with a focus on structured data fetching, clean React architecture, routing, and consistent styling using Arbetsförmedlingen's design system (@digi/arbetsformedlingen-react).

The application makes it easier for developers to:

- Find jobs based on their stack (Frontend, Backend, Fullstack)
- Search and filter jobs based on keywords and location
- Read detailed job ads, including deadlines and employer info
- Navigate seamlessly across pages with a clean, responsive UI powered by React Router and accessible design.

## ✨ Features

**Landing page ("/")**

- Welcomes users and provides quick access to job categories.

**Occupation pages ("/frontend", "/backend", "/fullstack", "/all")**

- Lists available job ads fetched from the JobSearch API
- Provides filtering based on occupation category.

**Search & filters**

- Free-text search input for job titles and descriptions
- Geolocation filter: find jobs near your location or within a chosen radius.

**Pagination**

- Job ads are displayed 25 per page with navigation for more results.

**Single job ad page ("/:occupationSlug/:id")**

- Detailed view of a job ad, including description, deadlines and employer info.
- Direct apply button ("Commit ansökan 😉").

**About page ("/om-oss")**

- Describes the idea behind Kodbanken and its mission.

**Context + Reducer for state management**

- Jobs are cached globally to avoid unnecessary API calls.

## 🎥 Demo

👉 [Click here to view the demo](https://github.com/Medieinstitutet/fed24d-case-af-jobtech-team-4-1)

## 📸 Screenshots

**Start page**  
![desktopstart] (LÄGG BILD HÄR)

**An example of occupation page**  
![occupation] (LÄGG BILD HÄR)

**detailed page**  
![detailpage] (LÄGG BILD HÄR)

## 🧑‍💻 Tech Stack

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white) ![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white) ![SASS](https://img.shields.io/badge/SASS-hotpink.svg?style=for-the-badge&logo=SASS&logoColor=white) ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white) ![React](https://img.shields.io/badge/react-%2361DAFB.svg?style=for-the-badge&logo=react&logoColor=black) ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) ![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white) ![Prettier](https://img.shields.io/badge/prettier-%23F7B93E.svg?style=for-the-badge&logo=prettier&logoColor=black) ![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)

**Tools:**  
![Visual Studio Code](https://img.shields.io/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=visual-studio-code&logoColor=white) ![GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)

## ✍️ Authors

Created by:

- [Olivia Almseger](https://github.com/oliviaalmseger)
- [Matilda Söderhall](https://github.com/matildasoderhall)
- [Yuliia Ponomarenko](https://github.com/Yuliia-fed23)

## 🤝 Credits

This project was developed as part of the curriculum at [Medieinstitutet](https://medieinstitutet.se/) during our second year of studies.

---
