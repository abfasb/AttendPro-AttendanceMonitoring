# AttendPro-AttendanceMonitoring

AttendPro is an advanced and user-friendly attendance monitoring system that utilizes QR code technology for seamless and efficient tracking. This system is designed for educational institutions, corporate environments, and events, offering real-time attendance data and insights.

---

## Features

- **QR Code Generation and Scanning**: Generate unique QR codes for users and scan them for instant attendance logging.
- **User Authentication**: Secure login system for admins and users.
- **Real-Time Data Syncing**: Leverages real-time database technology for instant updates.
- **Comprehensive Reports**: Generate and download detailed attendance reports.
- **Mobile-Friendly**: Optimized for both desktop and mobile platforms.
- **Customizable Roles**: Support for multiple roles such as Admin, Teacher, and Student.

---

## Tech Stack

- **Frontend**:
  - React.js
  - Tailwind CSS
- **Backend**:
  - Node.js with Express.js Or Firebase (BAAS)
- **Database**:
  - Firebase Firestore (real-time database)
- **Authentication**:
  - Firebase Authentication(Google Auth [Optional])
- **QR Code Library**:
  - [QRCode.js](https://github.com/davidshimjs/qrcodejs) for generation
  - [zxing-js/library](https://github.com/zxing-js/library) for scanning

---

## Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/abfasb/AttendPro-AttendanceMonitoring.git
   cd AttendPro-AttendanceMonitoring
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm start
   ```

4. **Environment Variables**
   Create a `.env` file in both the frontend and backend directories and add the following:

   **Frontend `.env`**
   ```env
   REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
   REACT_APP_FIREBASE_PROJECT_ID=your-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   REACT_APP_FIREBASE_APP_ID=your-app-id
   ```

   **Backend `.env`**
   ```env
   PORT=5000
   FIREBASE_SERVICE_ACCOUNT_KEY=path/to/your/firebase-service-account.json
   ```

5. **Run the Application**
   - Client: `npm start` (runs on `http://localhost:5173`)

---

## Folder Structure

```
AttendPro/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── config/
│   │   ├── utils/
│   │   ├── services/
│   │   ├── api/
│   │   ├── App.js
│   │   ├── index.js
│   └── package.json
└── README.md
```

---

## Usage

1. **Admin Panel**
   - Login to the admin dashboard.
   - Create user accounts and generate QR codes.
   - View and export attendance reports.

2. **User Flow**
   - Users scan their QR codes via mobile or desktop.
   - Attendance is instantly logged and reflected in the system.

---

## Contributing

Contributions are welcome! Follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Make your changes and commit them: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Contact

For inquiries or support, contact:
- **Email**: matbalinton@gmail.com
- **GitHub**: [abfasb](https://github.com/abfasb)

---


### Future Enhancements

- Add face recognition as an alternative to QR code.
- Enable push notifications for attendance reminders.
- Integrate with third-party services like Google Calendar.

---

Thank you for using AttendPro!
