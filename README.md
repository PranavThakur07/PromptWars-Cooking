# ChefPlanner AI - Cooking To-Do List & Meal Plan Generator

ChefPlanner AI is a client-side React 19 micro-application developed for hackathons. It generates a daily meal plan (Breakfast, Lunch, Dinner), shopping lists, substitutions, and budget feasibility reports dynamically utilizing the **Google Gemini 1.5 Flash API**. 

The app features a Google Material Design 3 inspired, high-contrast, fully responsive, and accessible dashboard containing interactive recipe check-off items, cooking timelines, macro-nutrient charts, and budget meters.

---

## 🚀 Key Features

* **Real Gemini API Integration**: Single request using low-temperature structured output via a declared JSON schema. No mock responses or placeholders.
* **Smart Budget Logic**: Evaluates ingredient costs against your budget. Generates cost usage meters and suggests cheaper alternatives if exceeded.
* **Interactive To-Do Checklists**: Marks off recipe steps and grocery items as they are completed.
* **Pantry Adaptability & Substitutions**: Identifies swaps for allergies, dietary restrictions, and ingredients to avoid.
* **High Accessibility (WCAG compliant)**: Full keyboard navigation support with focus-visible indicators, proper semantic headings, and ARIA roles.
* **Micro-Animations & Themes**: Responsive layouts supporting both system and toggleable Light/Dark modes, loading animation panels with chef tip messages, and success toasts.
* **Local Storage Persistence**: Safely saves form inputs, API key configurations, and generated meal plans in the client browser across reloads.

---

## 🛠️ Tech Stack

* **React 19**
* **Vite**
* **Tailwind CSS v4** (including Vite CSS engine compiler `@tailwindcss/vite`)
* **Google Gemini API** (`fetch` endpoint with strict JSON schema options)
* **Lucide React** (icons)
* **JavaScript (ES Modules)**

---

## 📂 Project Structure

```
d:\PromptWars\
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── README.md
├── tailwind.config.js
├── vite.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── components/
│   │   ├── Common/
│   │   │   ├── ThemeToggle.jsx
│   │   │   ├── LoadingState.jsx
│   │   │   └── ErrorState.jsx
│   │   ├── FormSection.jsx
│   │   ├── MealPlanDashboard.jsx
│   │   ├── BudgetWidget.jsx
│   │   ├── GroceryShoppingList.jsx
│   │   └── SubstitutionPanel.jsx
│   ├── services/
│   │   └── gemini.js
│   ├── hooks/
│   │   └── useLocalStorage.js
│   ├── utils/
│   │   ├── validation.js
│   │   └── helpers.js
│   └── constants/
│       └── options.js
```

---

## ⚙️ Setup & Installation

### Prerequisite
Obtain a free Google Gemini API key from [Google AI Studio](https://aistudio.google.com/).

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Credentials
Create a `.env` file in the root directory:
```bash
VITE_GEMINI_API_KEY=your_actual_gemini_api_key_here
```
*Note: If the `.env` variable is not set, you can also paste the API key directly into the settings panel of the running application.*

### 3. Run Locally
Start the local development server:
```bash
npm run dev
```

### 4. Build for Production
Create the optimized static bundle in the `dist` folder:
```bash
npm run build
```

---

## ☁️ Netlify Deployment

Since ChefPlanner AI is a 100% serverless, client-side React 19 application, it can be deployed directly to Netlify without any server configurations.

### Deploying via Netlify CLI
1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```
2. Build the project:
   ```bash
   npm run build
   ```
3. Deploy the build output:
   ```bash
   netlify deploy --prod --dir=dist
   ```

### Deploying via GitHub & Netlify Dashboard
1. Push this project to a GitHub repository.
2. Link the repository in the Netlify Dashboard.
3. Configure build settings:
   * **Build command**: `npm run build`
   * **Publish directory**: `dist`
4. Set Environment Variables in Netlify Settings:
   * Add `VITE_GEMINI_API_KEY` under *Site configuration > Environment variables*.
