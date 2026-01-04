# BMSCE Lost & Found Management System

🎓 **AI-Powered Lost & Found Platform for BMS College of Engineering**

A comprehensive web application that helps students and staff efficiently report, search, and reclaim lost items on campus using modern web technologies and artificial intelligence.

## ✨ Features

- 🤖 **AI-Powered Image Matching** - TensorFlow.js with MobileNet for intelligent item comparison
- 👥 **Dual Portal System** - Separate interfaces for students and administrators
- 🔐 **Secure Authentication** - JWT-based authentication with role-based access control
- 📱 **Responsive Design** - Apple-inspired glassmorphism UI that works on all devices
- 📊 **Admin Dashboard** - Comprehensive management and analytics system
- 🔍 **Smart Search** - Advanced filtering and search capabilities
- 📈 **Real-time Updates** - Live status tracking and notifications

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with SSR
- **React 18** - Modern UI library
- **Custom CSS** - Apple-inspired glassmorphism design
- **Axios** - HTTP client for API communication

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling

### AI/ML
- **TensorFlow.js** - Machine learning library
- **MobileNet** - Pre-trained image classification model
- **Sharp** - High-performance image processing

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- MongoDB (v5+)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Management_of_LostandFound
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   node seed.js  # Populate with sample data
   npm run dev
   ```

3. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   cp .env.local.example .env.local
   # Edit .env.local with your API URL
   npm run dev
   ```

4. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🔑 Demo Credentials

### Student Login
- **Email**: arjun.kumar@bmsce.ac.in
- **Password**: student123

### Admin Login
- **Email**: admin@bmsce.ac.in
- **Password**: admin123

## 📁 Project Structure

```
Management_of_LostandFound/
├── backend/
│   ├── controllers/     # Business logic
│   ├── models/         # Database schemas
│   ├── routes/         # API endpoints
│   ├── middleware/     # Authentication & validation
│   ├── ai/            # Image similarity engine
│   ├── uploads/       # File storage
│   └── server.js      # Main server file
├── frontend/
│   ├── pages/         # Next.js pages
│   ├── components/    # React components
│   ├── styles/        # CSS styling
│   ├── utils/         # Helper functions
│   └── next.config.js # Next.js configuration
└── explaination.md    # Comprehensive documentation
```

## 🤖 AI Image Similarity

The system uses TensorFlow.js with a pre-trained MobileNet model to:
1. Extract features from uploaded images
2. Compare feature vectors using cosine similarity
3. Generate similarity scores (0-100%)
4. Assist admins in verifying item matches

## 📊 Key Features

### For Students
- Report lost/found items with photos
- Browse all campus items
- Make claims with AI similarity scores
- Track claim status in real-time

### For Administrators
- Comprehensive dashboard with analytics
- Review claims with AI assistance
- Manage users and items
- Generate reports and insights

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- File upload validation
- Role-based access control
- Input sanitization and validation

## 📖 Documentation

For detailed documentation, architecture details, and implementation guide, see [explaination.md](./explaination.md).

## 🚀 Deployment

### Production Build
```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is created for educational purposes at BMS College of Engineering.

## 📞 Support

For questions or support, please refer to the comprehensive documentation in `explaination.md`.

---

**Built with ❤️ for BMSCE students by BMSCE students**