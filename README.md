# 📊 Attendly - Smart Attendance Tracker

Attendly is a sleek, responsive, and feature-rich web application designed to help students track their class attendance with precision. It doesn't just count days; it provides actionable insights like how many classes you can "safely skip" or how many you "must attend" to reach your target percentage.

![Attendly Dashboard Placeholder](https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=1000)

## ✨ Features

- **🎯 Smart Goal Tracking**: Set a target percentage (e.g., 75%) and get real-time feedback on your standing.
- **📈 Advanced Analytics**: Calculates if you are safe to skip classes or drop below your target.
- **📅 Detailed History**: A built-in calendar view for every subject to manage past attendance.
- **🎨 Stunning UI & Customization**: With different themes and modes.
- **🔒 Privacy First**: All data is stored locally in your browser (LocalStorage). No servers, no tracking, just your data.
- **📱 Fully Responsive**: Works perfectly on desktops, tablets, and smartphones.

## 🛠️ Tech Stack

- **React 19**: Modern component-based architecture.
- **Tailwind CSS**: Utility-first styling with custom theme configurations.
- **TypeScript**: Robust type-checking for attendance logic and state management.
- **ES Modules**: Fast, lightweight loading via ESM.sh.


The attendance logic follows these rules:
- **Attendance % Formula**: `(Present + OD) / (Present + Absent + OD) * 100`
- **Sundays**: Automatically handled. Marking "Absent" on a Sunday does not penalize your percentage (ideal for tracking personal study schedules).
- **On Duty (OD)**: Recognized as "Attended" for the percentage calculation but labeled as OD for record-keeping.

## 📸 Screenshots

| Modern Dark Mode | Retro Light Mode |
| :---: | :---: |
| ![Modern Dark](https://via.placeholder.com/400x250?text=Modern+Dark+Mode) | ![Retro Light](https://via.placeholder.com/400x250?text=Retro+Light+Mode) |

---

Developed with ❤️ by [Amrisha](https://github.com/zafrose3)
