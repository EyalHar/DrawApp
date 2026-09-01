# DrawApp

DrawApp (בשם הפנימי שלה: "לומדים לצייר") היא אפליקציית לימוד ציור אינטראקטיבית. המשתמש/ת בוחר/ת ציור מתוך גלריה (פרפר, דרקון, עין, ורד), ולומד/ת לצייר אותו שלב אחר שלב: בכל שלב מוצג קו הדרכה (guide path) על גבי קנבס SVG, והמשתמש/ת מציירת עליו בעזרת העכבר/מגע. האפליקציה משווה בזמן אמת בין הקווים שהמשתמש/ת ציירה לבין קו ההדרכה (כיסוי ודיוק ביחס לסף סטייה), ומאפשרת להתקדם רק כשהציור קרוב מספיק למקור. אחרי כמה ניסיונות כושלים ניתן לדלג על שלב, ובסיום כל השלבים מוצג הציור המלא שהורכב.

## Tech Stack

- **Frontend:** React 19 + Vite, plain CSS (ללא framework עיצוב חיצוני)
- **Backend:** Node.js + Express, עם `cors` לתמיכה ב-cross-origin requests
- **Linting:** oxlint (בצד ה-client)
- **Dev tooling:** `concurrently` להרצת client ו-server יחד בפקודה אחת
- **Data:** קבצי JSON סטטיים (ללא בסיס נתונים) תחת `server/data/lessons`

## Key Features

- **גלריית שיעורים (Home page):** רשימת ציורים זמינים, כל אחד עם כותרת ומספר שלבים, נטענת דינמית מה-API.
- **Sidebar ניווט:** מעבר בין דף הבית לבין השיעורים השונים, עם סימון השיעור הפעיל.
- **שיעורי ציור מודרכים שלב-אחר-שלב:** כל שיעור מורכב ממספר שלבים, כשלכל שלב הוראת טקסט וקו הדרכה משלו (יתכן גם עם `viewBox` ממוקד/מזום-אין לשלב הספציפי).
- **קנבס ציור חופשי מבוסס SVG:** ציור בעזרת Pointer Events, שממיר את נקודות המשיכה לנתיב SVG חלק (עקומות ריבועיות).
- **בדיקת דיוק אוטומטית:** השוואה בין נקודות הציור של המשתמש/ת לבין נקודות שנדגמות מקו ההדרכה, לפי מדדי כיסוי (coverage) ודיוק (precision) ביחס לסף סטייה יחסי לגודל הציור.
- **דילוג על שלב:** לאחר 3 ניסיונות כושלים ברצף מתאפשר כפתור "לדלג על השלב".
- **ניקוי / התחלה מחדש:** אפשרות לנקות את השלב הנוכחי או להתחיל את כל השיעור מחדש.
- **מסך סיום:** בסיום כל השלבים מוצג הציור המלא שהורכב מכל השלבים המאושרים, עם אפשרות לצייר שוב או לחזור לבחירת ציור אחר.

## Setup & Installation

לפרויקט יש שלושה תיקיות `package.json` נפרדים (root, `client`, `server`) - יש להתקין תלויות בכל אחת מהן:

```bash
npm install
npm install --prefix client
npm install --prefix server
```

לא נמצאו קבצי `.env` או משתני סביבה נדרשים בפרויקט. השרת קורא אופציונלית את `PORT` (ברירת מחדל: `6100`), אך אין `.env.example` בריפו. כתובת ה-API בצד ה-client מוגדרת כרגע כ-hardcoded ל-`http://localhost:6100/api` (בקובץ `client/src/api/lessons.js`), ולכן הרצה מקומית עם הפורטים המקוריים היא ה"נתיב הבטוח" ביותר.

## How to Run

### Development (client + server יחד)

מתוך תיקיית ה-root:

```bash
npm run dev
```

הפקודה מריצה במקביל (דרך `concurrently`) את שרת ה-dev של Vite (client, כברירת מחדל בכתובת `http://localhost:5173`) ואת שרת ה-Express (`server`, כברירת מחדל בכתובת `http://localhost:6100`), עם live-reload בשני הצדדים.

### Client בלבד

```bash
cd client
npm run dev      # שרת פיתוח (Vite)
npm run build    # build לפרודקשן
npm run preview  # תצוגה מקדימה של ה-build
npm run lint      # הרצת oxlint
```

### Server בלבד

```bash
cd server
npm run dev      # node --watch index.js
```

שימו לב: בקובץ `server/package.json` יש רק סקריפט `dev` (עם `node --watch`) - אין סקריפט `start` נפרד להרצת פרודקשן.

## Project Structure

```
DrawApp/
├── client/                       # אפליקציית React (Vite)
│   ├── src/
│   │   ├── api/lessons.js        # קריאות fetch לשרת (רשימת שיעורים / שיעור בודד)
│   │   ├── components/
│   │   │   ├── HomePage.jsx      # גלריית השיעורים
│   │   │   ├── LessonPage.jsx    # מסך שיעור - שלבים, בדיקת דיוק, סיום
│   │   │   ├── DrawingCanvas.jsx # קנבס ה-SVG לציור חופשי
│   │   │   └── Sidebar.jsx       # ניווט צדדי
│   │   ├── utils/matchDrawing.js # לוגיקת ניקוד/השוואת ציור מול קו הדרכה
│   │   └── App.jsx               # ניתוב בין דף הבית לשיעור
│   └── package.json
├── server/                        # שרת Express
│   ├── data/lessons/*.json        # הגדרות השיעורים (שלבים, נתיבי SVG, טקסטים)
│   ├── routes/lessons.js          # GET /api/lessons, GET /api/lessons/:id
│   ├── index.js                   # נקודת הכניסה של השרת
│   └── package.json
└── package.json                   # סקריפט dev משותף (concurrently)
```
