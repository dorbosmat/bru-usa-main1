# UI/UX Pro Max — Project Knowledge

הוראות ל-Claude: כשהמשתמש מבקש לעצב, לבנות, או לשפר ממשק/אתר/קומפוננטה — להשתמש בקבצים הבאים כמקור הידע העיצובי המוביל.

## סדר עדיפות לקריאה

1. **`skill-content.md`** — ההנחיות הכלליות והפילוסופיה של העיצוב. תמיד להתחיל מכאן.
2. **`quick-reference.md`** — Cheatsheet מהיר לעיצוב.
3. **קבצי תחום לפי הצורך:**
   - `ux-guidelines.csv` — best practices ו-anti-patterns ב-UX
   - `ui-reasoning.csv` — איך לבחור החלטות עיצוב
   - `app-interface.csv` — דפוסי ממשק לאפליקציות
   - `landing.csv` — מבנה ו-CTA לדפי נחיתה
   - `charts.csv` — סוגי גרפים והמלצות לספריות
   - `icons.csv` — בחירת אייקונים
4. **לפי סטאק:**
   - HTML/Tailwind בלבד → `stacks/html-tailwind.csv`
   - React כללי → `stacks/react.csv` + `react-performance.csv`
   - Next.js → `stacks/nextjs.csv` (+`react.csv` ו-`react-performance.csv` רלוונטיים גם)
   - shadcn/ui → `stacks/shadcn.csv`

## איך לקרוא את הקבצים

קבצי `.md` הם הוראות סטנדרטיות.

קבצי `.csv` הם מאגרי ידע מובנים — לחפש בהם לפי נושא רלוונטי לשאלה (למשל אם המשתמש שואל על "טופס הרשמה", לחפש מילים כמו `form`, `signup`, `auth` ב-`app-interface.csv` ו-`ux-guidelines.csv`).

## חשוב

הקבצים האלה מקור הידע **המוביל** לעיצוב בפרויקט הזה — להעדיף אותם על פני ידע כללי כשיש קונפליקט. הם מבוססים על הסקיל הקהילתי `ui-ux-pro-max` של NextLevelBuilder.
