// Initial Demo Data for QueueLess
// Populated with realistic college data for instantaneous presentation & testing

const initialUsers = [
  {
    id: "usr_admin_1",
    name: "Dr. Arvind Sharma",
    studentId: "ADMIN-01",
    email: "admin@queueless.com",
    phone: "+91 98765 43210",
    role: "admin",
    passwordHash: "$2a$10$wT8Kz54P9eH2J6vA7V1f2uQ2N/9uWv4wX7M0e9fA2m5l3b2n1o0e2", // hashed 'admin123'
    plainDemoPassword: "admin123",
    department: "Administration"
  },
  {
    id: "usr_admin_2",
    name: "Prof. Sunita Rao",
    studentId: "ADMIN-02",
    email: "sunita.admin@queueless.com",
    phone: "+91 98765 43211",
    role: "admin",
    passwordHash: "$2a$10$wT8Kz54P9eH2J6vA7V1f2uQ2N/9uWv4wX7M0e9fA2m5l3b2n1o0e2",
    plainDemoPassword: "admin123",
    department: "Accounts"
  },
  {
    id: "usr_student_1",
    name: "Rajesh Kumar",
    studentId: "2024CS108",
    email: "student@queueless.com",
    phone: "+91 91234 56789",
    role: "student",
    passwordHash: "$2a$10$wT8Kz54P9eH2J6vA7V1f2uQ2N/9uWv4wX7M0e9fA2m5l3b2n1o0e2", // 'student123'
    plainDemoPassword: "student123",
    department: "Computer Science & Engineering"
  },
  {
    id: "usr_student_2",
    name: "Ananya Iyer",
    studentId: "2024EC214",
    email: "ananya.iyer@queueless.com",
    phone: "+91 92345 67890",
    role: "student",
    passwordHash: "$2a$10$wT8Kz54P9eH2J6vA7V1f2uQ2N/9uWv4wX7M0e9fA2m5l3b2n1o0e2",
    plainDemoPassword: "student123",
    department: "Electronics & Communication"
  },
  {
    id: "usr_student_3",
    name: "Vikram Malhotra",
    studentId: "2023ME045",
    email: "vikram.m@queueless.com",
    phone: "+91 93456 78901",
    role: "student",
    passwordHash: "$2a$10$wT8Kz54P9eH2J6vA7V1f2uQ2N/9uWv4wX7M0e9fA2m5l3b2n1o0e2",
    plainDemoPassword: "student123",
    department: "Mechanical Engineering"
  },
  {
    id: "usr_student_4",
    name: "Pooja Hegde",
    studentId: "2024IT312",
    email: "pooja.h@queueless.com",
    phone: "+91 94567 89012",
    role: "student",
    passwordHash: "$2a$10$wT8Kz54P9eH2J6vA7V1f2uQ2N/9uWv4wX7M0e9fA2m5l3b2n1o0e2",
    plainDemoPassword: "student123",
    department: "Information Technology"
  },
  {
    id: "usr_student_5",
    name: "Karan Johar Patel",
    studentId: "2023CV089",
    email: "karan.p@queueless.com",
    phone: "+91 95678 90123",
    role: "student",
    passwordHash: "$2a$10$wT8Kz54P9eH2J6vA7V1f2uQ2N/9uWv4wX7M0e9fA2m5l3b2n1o0e2",
    plainDemoPassword: "student123",
    department: "Civil Engineering"
  },
  {
    id: "usr_student_6",
    name: "Meera Sen",
    studentId: "2024AI019",
    email: "meera.sen@queueless.com",
    phone: "+91 96789 01234",
    role: "student",
    passwordHash: "$2a$10$wT8Kz54P9eH2J6vA7V1f2uQ2N/9uWv4wX7M0e9fA2m5l3b2n1o0e2",
    plainDemoPassword: "student123",
    department: "Artificial Intelligence & Data Science"
  },
  {
    id: "usr_student_7",
    name: "Aditya Verma",
    studentId: "2023EE156",
    email: "aditya.v@queueless.com",
    phone: "+91 97890 12345",
    role: "student",
    passwordHash: "$2a$10$wT8Kz54P9eH2J6vA7V1f2uQ2N/9uWv4wX7M0e9fA2m5l3b2n1o0e2",
    plainDemoPassword: "student123",
    department: "Electrical Engineering"
  },
  {
    id: "usr_student_8",
    name: "Sneha Mukherjee",
    studentId: "2024BT067",
    email: "sneha.m@queueless.com",
    phone: "+91 98901 23456",
    role: "student",
    passwordHash: "$2a$10$wT8Kz54P9eH2J6vA7V1f2uQ2N/9uWv4wX7M0e9fA2m5l3b2n1o0e2",
    plainDemoPassword: "student123",
    department: "Biotechnology"
  },
  {
    id: "usr_student_9",
    name: "Rohan Deshmukh",
    studentId: "2023CS098",
    email: "rohan.d@queueless.com",
    phone: "+91 99012 34567",
    role: "student",
    passwordHash: "$2a$10$wT8Kz54P9eH2J6vA7V1f2uQ2N/9uWv4wX7M0e9fA2m5l3b2n1o0e2",
    plainDemoPassword: "student123",
    department: "Computer Science & Engineering"
  },
  {
    id: "usr_student_10",
    name: "Divya Nair",
    studentId: "2024CH042",
    email: "divya.n@queueless.com",
    phone: "+91 90123 45678",
    role: "student",
    passwordHash: "$2a$10$wT8Kz54P9eH2J6vA7V1f2uQ2N/9uWv4wX7M0e9fA2m5l3b2n1o0e2",
    plainDemoPassword: "student123",
    department: "Chemical Engineering"
  }
];

const initialDepartments = [
  {
    id: "dept_accounts",
    name: "Accounts Section",
    code: "F",
    location: "Admin Block - 1st Floor, Room 104",
    avgServiceTimeMinutes: 3,
    description: "Tuition fee payment, fee clearance certificates, scholarship distribution and receipts.",
    active: true,
    services: [
      { id: "srv_fee_pay", name: "Fee Payment", code: "F", estimatedMinutes: 3, description: "Semester tuition & exam fee settlements" },
      { id: "srv_fee_receipt", name: "Fee Receipt & Clearance", code: "F", estimatedMinutes: 2, description: "Duplicate receipts and no-due verifications" },
      { id: "srv_scholarship", name: "Scholarship Desk", code: "F", estimatedMinutes: 4, description: "State & merit scholarship forms validation" }
    ]
  },
  {
    id: "dept_office",
    name: "College Office",
    code: "O",
    location: "Main Building - Ground Floor, Room 008",
    avgServiceTimeMinutes: 4,
    description: "Student identity cards, bonafide verification, grade transcripts, and admission enquiry.",
    active: true,
    services: [
      { id: "srv_bonafide", name: "Bonafide Certificate", code: "O", estimatedMinutes: 3, description: "Official college bonafide certificate dispatch" },
      { id: "srv_degree_cert", name: "Degree & Certificates", code: "O", estimatedMinutes: 5, description: "Original certificate collection & attestation" },
      { id: "srv_id_card", name: "ID Card Replacement", code: "O", estimatedMinutes: 4, description: "Lost or damaged RFID smart card re-issuance" },
      { id: "srv_general_enquiry", name: "General Enquiry", code: "O", estimatedMinutes: 2, description: "Administrative circulars and university inquiries" }
    ]
  },
  {
    id: "dept_library",
    name: "Central Library",
    code: "L",
    location: "Library Annex - 2nd Floor",
    avgServiceTimeMinutes: 2,
    description: "Circulation desk, new membership registration, book loans, renewals, and fine clearance.",
    active: true,
    services: [
      { id: "srv_book_issue", name: "Book Issue", code: "L", estimatedMinutes: 2, description: "Checkout course textbooks and reference material" },
      { id: "srv_book_return", name: "Book Return", code: "L", estimatedMinutes: 2, description: "Return borrowed volumes and fine clearance" },
      { id: "srv_lib_membership", name: "Membership & Renewal", code: "L", estimatedMinutes: 3, description: "Annual library RFID registration" }
    ]
  },
  {
    id: "dept_canteen",
    name: "Campus Canteen",
    code: "C",
    location: "Student Center - Ground Floor",
    avgServiceTimeMinutes: 2,
    description: "Digital food voucher redemption, meal packaging, and counter express pickup.",
    active: true,
    services: [
      { id: "srv_food_order", name: "Food Order", code: "C", estimatedMinutes: 2, description: "Pre-order lunchtime combo meals and beverages" },
      { id: "srv_express_pickup", name: "Express Pickup", code: "C", estimatedMinutes: 1, description: "Instant pickup counter for pre-paid mobile orders" }
    ]
  }
];

const initialCounters = [
  {
    id: "counter_1",
    counterNumber: 1,
    name: "Counter 1 (Office Services)",
    departmentId: "dept_office",
    departmentName: "College Office",
    status: "Active", // Active, Offline, On Break
    staffName: "Mr. R. K. Gupta",
    currentToken: "O-024"
  },
  {
    id: "counter_2",
    counterNumber: 2,
    name: "Counter 2 (Accounts & Fees)",
    departmentId: "dept_accounts",
    departmentName: "Accounts Section",
    status: "Active",
    staffName: "Mrs. Shobha Sharma",
    currentToken: "F-031"
  },
  {
    id: "counter_3",
    counterNumber: 3,
    name: "Counter 3 (Library Circulation)",
    departmentId: "dept_library",
    departmentName: "Central Library",
    status: "Active",
    staffName: "Mr. Anand Murthy",
    currentToken: "L-015"
  },
  {
    id: "counter_4",
    counterNumber: 4,
    name: "Counter 4 (Canteen Express)",
    departmentId: "dept_canteen",
    departmentName: "Campus Canteen",
    status: "Offline",
    staffName: "Chef Raju",
    currentToken: null
  }
];

const initialTokens = [
  // Accounts tokens
  {
    id: "tok_f_028",
    tokenNumber: "F-028",
    userId: "usr_student_3",
    studentName: "Vikram Malhotra",
    studentId: "2023ME045",
    departmentId: "dept_accounts",
    departmentName: "Accounts Section",
    service: "Fee Payment",
    status: "COMPLETED",
    counter: 2,
    createdAt: new Date(Date.now() - 48 * 60 * 1000).toISOString(),
    calledAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 36 * 60 * 1000).toISOString()
  },
  {
    id: "tok_f_029",
    tokenNumber: "F-029",
    userId: "usr_student_4",
    studentName: "Pooja Hegde",
    studentId: "2024IT312",
    departmentId: "dept_accounts",
    departmentName: "Accounts Section",
    service: "Fee Receipt & Clearance",
    status: "COMPLETED",
    counter: 2,
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
    calledAt: new Date(Date.now() - 34 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: "tok_f_030",
    tokenNumber: "F-030",
    userId: "usr_student_5",
    studentName: "Karan Johar Patel",
    studentId: "2023CV089",
    departmentId: "dept_accounts",
    departmentName: "Accounts Section",
    service: "Fee Payment",
    status: "SKIPPED",
    counter: 2,
    createdAt: new Date(Date.now() - 32 * 60 * 1000).toISOString(),
    calledAt: new Date(Date.now() - 26 * 60 * 1000).toISOString(),
    completedAt: null
  },
  {
    id: "tok_f_031",
    tokenNumber: "F-031",
    userId: "usr_student_6",
    studentName: "Meera Sen",
    studentId: "2024AI019",
    departmentId: "dept_accounts",
    departmentName: "Accounts Section",
    service: "Fee Payment",
    status: "CALLING",
    counter: 2,
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    calledAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
    completedAt: null
  },
  {
    id: "tok_f_032",
    tokenNumber: "F-032",
    userId: "usr_student_7",
    studentName: "Aditya Verma",
    studentId: "2023EE156",
    departmentId: "dept_accounts",
    departmentName: "Accounts Section",
    service: "Fee Payment",
    status: "WAITING",
    counter: 2,
    createdAt: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
    calledAt: null,
    completedAt: null
  },
  {
    id: "tok_f_033",
    tokenNumber: "F-033",
    userId: "usr_student_8",
    studentName: "Sneha Mukherjee",
    studentId: "2024BT067",
    departmentId: "dept_accounts",
    departmentName: "Accounts Section",
    service: "Scholarship Desk",
    status: "WAITING",
    counter: 2,
    createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    calledAt: null,
    completedAt: null
  },
  {
    id: "tok_f_034",
    tokenNumber: "F-034",
    userId: "usr_student_9",
    studentName: "Rohan Deshmukh",
    studentId: "2023CS098",
    departmentId: "dept_accounts",
    departmentName: "Accounts Section",
    service: "Fee Payment",
    status: "WAITING",
    counter: 2,
    createdAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
    calledAt: null,
    completedAt: null
  },
  {
    id: "tok_f_035",
    tokenNumber: "F-035",
    userId: "usr_student_10",
    studentName: "Divya Nair",
    studentId: "2024CH042",
    departmentId: "dept_accounts",
    departmentName: "Accounts Section",
    service: "Fee Payment",
    status: "WAITING",
    counter: 2,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    calledAt: null,
    completedAt: null
  },
  {
    id: "tok_f_036",
    tokenNumber: "F-036",
    userId: "usr_student_2",
    studentName: "Ananya Iyer",
    studentId: "2024EC214",
    departmentId: "dept_accounts",
    departmentName: "Accounts Section",
    service: "Scholarship Desk",
    status: "WAITING",
    counter: 2,
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    calledAt: null,
    completedAt: null
  },
  // Main student token (Rajesh Kumar - F-037)
  {
    id: "tok_f_037",
    tokenNumber: "F-037",
    userId: "usr_student_1",
    studentName: "Rajesh Kumar",
    studentId: "2024CS108",
    departmentId: "dept_accounts",
    departmentName: "Accounts Section",
    service: "Fee Payment",
    status: "WAITING",
    counter: 2,
    createdAt: new Date(Date.now() - 6 * 60 * 1000).toISOString(),
    calledAt: null,
    completedAt: null
  },

  // Office tokens
  {
    id: "tok_o_024",
    tokenNumber: "O-024",
    userId: "usr_student_4",
    studentName: "Pooja Hegde",
    studentId: "2024IT312",
    departmentId: "dept_office",
    departmentName: "College Office",
    service: "Bonafide Certificate",
    status: "CALLING",
    counter: 1,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    calledAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    completedAt: null
  },
  {
    id: "tok_o_025",
    tokenNumber: "O-025",
    userId: "usr_student_5",
    studentName: "Karan Johar Patel",
    studentId: "2023CV089",
    departmentId: "dept_office",
    departmentName: "College Office",
    service: "ID Card Replacement",
    status: "WAITING",
    counter: 1,
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    calledAt: null,
    completedAt: null
  },
  {
    id: "tok_o_026",
    tokenNumber: "O-026",
    userId: "usr_student_7",
    studentName: "Aditya Verma",
    studentId: "2023EE156",
    departmentId: "dept_office",
    departmentName: "College Office",
    service: "Degree & Certificates",
    status: "WAITING",
    counter: 1,
    createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    calledAt: null,
    completedAt: null
  },

  // Library tokens
  {
    id: "tok_l_015",
    tokenNumber: "L-015",
    userId: "usr_student_8",
    studentName: "Sneha Mukherjee",
    studentId: "2024BT067",
    departmentId: "dept_library",
    departmentName: "Central Library",
    service: "Book Issue",
    status: "CALLING",
    counter: 3,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    calledAt: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
    completedAt: null
  },
  {
    id: "tok_l_016",
    tokenNumber: "L-016",
    userId: "usr_student_9",
    studentName: "Rohan Deshmukh",
    studentId: "2023CS098",
    departmentId: "dept_library",
    departmentName: "Central Library",
    service: "Book Return",
    status: "WAITING",
    counter: 3,
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    calledAt: null,
    completedAt: null
  },

  // Student 1 Historical Tokens (for History view)
  {
    id: "tok_hist_1",
    tokenNumber: "F-012",
    userId: "usr_student_1",
    studentName: "Rajesh Kumar",
    studentId: "2024CS108",
    departmentId: "dept_accounts",
    departmentName: "Accounts Section",
    service: "Fee Payment",
    status: "COMPLETED",
    counter: 2,
    createdAt: "2026-10-06T10:14:00.000Z",
    calledAt: "2026-10-06T10:28:00.000Z",
    completedAt: "2026-10-06T10:32:00.000Z"
  },
  {
    id: "tok_hist_2",
    tokenNumber: "L-018",
    userId: "usr_student_1",
    studentName: "Rajesh Kumar",
    studentId: "2024CS108",
    departmentId: "dept_library",
    departmentName: "Central Library",
    service: "Book Issue",
    status: "COMPLETED",
    counter: 3,
    createdAt: "2026-10-05T14:20:00.000Z",
    calledAt: "2026-10-05T14:32:00.000Z",
    completedAt: "2026-10-05T14:35:00.000Z"
  },
  {
    id: "tok_hist_3",
    tokenNumber: "O-022",
    userId: "usr_student_1",
    studentName: "Rajesh Kumar",
    studentId: "2024CS108",
    departmentId: "dept_office",
    departmentName: "College Office",
    service: "Bonafide Certificate",
    status: "CANCELLED",
    counter: 1,
    createdAt: "2026-10-01T11:05:00.000Z",
    calledAt: null,
    completedAt: null
  }
];

const initialNotifications = [
  {
    id: "notif_1",
    userId: "usr_student_1",
    title: "Queue Position Update",
    message: "You are currently 6 positions away for Token F-037. Est. wait time: 18 mins.",
    type: "info",
    read: false,
    createdAt: new Date(Date.now() - 4 * 60 * 1000).toISOString()
  },
  {
    id: "notif_2",
    userId: "usr_student_1",
    title: "Counter Assignment",
    message: "Fee Payment tokens are actively being processed at Counter 2 by Mrs. Shobha Sharma.",
    type: "info",
    read: true,
    createdAt: new Date(Date.now() - 6 * 60 * 1000).toISOString()
  },
  {
    id: "notif_3",
    userId: "usr_student_1",
    title: "Previous Token Completed",
    message: "Token F-012 (Fee Payment) was successfully completed on 06 Oct 2026.",
    type: "success",
    read: true,
    createdAt: "2026-10-06T10:33:00.000Z"
  }
];

const analyticsData = {
  summary: {
    totalTokensToday: 347,
    currentlyWaiting: 42,
    completed: 281,
    skipped: 24,
    averageWaitingTimeMinutes: 16,
    averageServiceTimeMinutes: 3.4,
    peakHours: "11:00 AM – 1:00 PM",
    mostBusyDepartment: "Accounts Section"
  },
  dailyVolume: [
    { day: "Monday", count: 320, completed: 275, skipped: 25, avgWait: 18 },
    { day: "Tuesday", count: 410, completed: 350, skipped: 30, avgWait: 22 },
    { day: "Wednesday", count: 380, completed: 330, skipped: 20, avgWait: 17 },
    { day: "Thursday", count: 450, completed: 395, skipped: 28, avgWait: 24 },
    { day: "Friday", count: 390, completed: 345, skipped: 21, avgWait: 19 }
  ],
  departmentBreakdown: [
    { department: "Accounts Section", count: 145, percentage: 42, color: "#4f46e5" },
    { department: "College Office", count: 98, percentage: 28, color: "#2563eb" },
    { department: "Central Library", count: 62, percentage: 18, color: "#06b6d4" },
    { department: "Campus Canteen", count: 42, percentage: 12, color: "#10b981" }
  ],
  hourlyTraffic: [
    { hour: "09:00 AM", tokens: 24 },
    { hour: "10:00 AM", tokens: 58 },
    { hour: "11:00 AM", tokens: 92 },
    { hour: "12:00 PM", tokens: 88 },
    { hour: "01:00 PM", tokens: 74 },
    { hour: "02:00 PM", tokens: 46 },
    { hour: "03:00 PM", tokens: 35 },
    { hour: "04:00 PM", tokens: 18 }
  ]
};

const initialAppointments = [
  {
    id: "apt_1",
    studentId: "2024CS108",
    studentName: "Rajesh Kumar",
    departmentId: "dept_office",
    departmentName: "College Office",
    service: "Degree Verification",
    scheduledDate: "2026-10-16",
    scheduledTime: "10:30 AM",
    status: "SCHEDULED",
    notes: "Original marksheet verification & stamp"
  },
  {
    id: "apt_2",
    studentId: "2024EC214",
    studentName: "Ananya Iyer",
    departmentId: "dept_accounts",
    departmentName: "Accounts Section",
    service: "Scholarship Disbursal",
    scheduledDate: "2026-10-16",
    scheduledTime: "11:15 AM",
    status: "SCHEDULED",
    notes: "State merit scholarship verification"
  },
  {
    id: "apt_3",
    studentId: "2023ME045",
    studentName: "Vikram Malhotra",
    departmentId: "dept_library",
    departmentName: "Central Library",
    service: "Research Journal Access",
    scheduledDate: "2026-10-15",
    scheduledTime: "02:00 PM",
    status: "CHECKED_IN",
    notes: "IEEE digital library pass issuance"
  },
  {
    id: "apt_4",
    studentId: "2024IT312",
    studentName: "Pooja Hegde",
    departmentId: "dept_office",
    departmentName: "College Office",
    service: "Bonafide Certificate",
    scheduledDate: "2026-10-14",
    scheduledTime: "03:30 PM",
    status: "COMPLETED",
    notes: "Passport verification bonafide issued"
  }
];

const initialFeedbacks = [
  {
    id: "fb_1",
    tokenNumber: "F-035",
    studentName: "Ananya Iyer",
    studentId: "2024EC214",
    departmentName: "Accounts Section",
    service: "Fee Payment",
    rating: 5,
    comment: "Super fast fee payment processing at Counter 2. Saved over 45 minutes of waiting!",
    sentiment: "Positive",
    createdAt: "2026-10-14T17:20:00.000Z"
  },
  {
    id: "fb_2",
    tokenNumber: "O-019",
    studentName: "Karan Johar Patel",
    studentId: "2023CV089",
    departmentName: "College Office",
    service: "Bonafide Certificate",
    rating: 4,
    comment: "Very smooth certificate issuing. Staff were polite and prompt.",
    sentiment: "Positive",
    createdAt: "2026-10-14T15:10:00.000Z"
  },
  {
    id: "fb_3",
    tokenNumber: "L-008",
    studentName: "Meera Sen",
    studentId: "2024AI019",
    departmentName: "Central Library",
    service: "Book Issue",
    rating: 5,
    comment: "Library book renewal was instantaneous with the digital token pass.",
    sentiment: "Positive",
    createdAt: "2026-10-14T12:45:00.000Z"
  },
  {
    id: "fb_4",
    tokenNumber: "C-011",
    studentName: "Aditya Verma",
    studentId: "2023EE156",
    departmentName: "Campus Canteen",
    service: "Food Order",
    rating: 4,
    comment: "Canteen counter wait time tracking was accurate.",
    sentiment: "Positive",
    createdAt: "2026-10-14T13:30:00.000Z"
  }
];

const initialSettings = {
  queueSettings: {
    maxActiveTokensPerStudent: 1,
    ticketPrefixAuto: true,
    autoCallNext: false,
    soundAlertEnabled: true
  },
  laneSettings: {
    totalLanes: 4,
    lanes: [
      { id: "lane_1", name: "Lane 01", department: "College Office", counterNumber: 1, color: "#2563eb", status: "Active" },
      { id: "lane_2", name: "Lane 02", department: "Accounts Section", counterNumber: 2, color: "#7c3aed", status: "Active" },
      { id: "lane_3", name: "Lane 03", department: "Central Library", counterNumber: 3, color: "#059669", status: "Active" },
      { id: "lane_4", name: "Lane 04", department: "Campus Canteen", counterNumber: 4, color: "#d97706", status: "Active" }
    ]
  },
  operatingHours: {
    openingTime: "09:00 AM",
    closingTime: "05:00 PM",
    lunchBreakStart: "01:00 PM",
    lunchBreakEnd: "02:00 PM"
  },
  securitySettings: {
    otpExpiryMinutes: 5,
    maxOtpAttempts: 5,
    resendCooldownSeconds: 60,
    requireAdmin2FA: true
  },
  themeSettings: {
    monitoringTheme: "dark",
    colorLegend: {
      serving: "#10b981",
      waiting: "#f59e0b",
      skipped: "#ef4444",
      completed: "#3b82f6",
      cancelled: "#64748b"
    }
  }
};

module.exports = {
  initialUsers,
  initialDepartments,
  initialCounters,
  initialTokens,
  initialNotifications,
  initialAppointments,
  initialFeedbacks,
  initialSettings,
  analyticsData
};
