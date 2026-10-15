// Models definitions for Mongoose / MongoDB and schema documentation

/*
  QueueLess Data Schemas:

  1. User Schema:
     - name: String (required)
     - studentId: String (unique)
     - email: String (required, unique)
     - phone: String
     - passwordHash: String (required)
     - role: String (enum: ['student', 'admin'], default: 'student')
     - department: String

  2. Department Schema:
     - name: String (required)
     - code: String (e.g. 'F', 'O', 'L', 'C')
     - location: String
     - avgServiceTimeMinutes: Number
     - active: Boolean (default: true)
     - services: [{
         id: String,
         name: String,
         code: String,
         estimatedMinutes: Number,
         description: String
       }]

  3. Token Schema:
     - tokenNumber: String (e.g. 'F-037', unique)
     - userId: String / ObjectId (ref: 'User')
     - studentName: String
     - studentId: String
     - departmentId: String / ObjectId (ref: 'Department')
     - departmentName: String
     - service: String
     - status: String (enum: ['WAITING', 'CALLING', 'COMPLETED', 'SKIPPED', 'CANCELLED'])
     - counter: Number
     - createdAt: Date
     - calledAt: Date
     - completedAt: Date

  4. Counter Schema:
     - counterNumber: Number (required, unique)
     - name: String
     - departmentId: String
     - departmentName: String
     - status: String (enum: ['Active', 'Offline', 'On Break'])
     - staffName: String
     - currentToken: String

  5. Notification Schema:
     - userId: String (required)
     - title: String
     - message: String
     - type: String (enum: ['info', 'alert', 'warning', 'success'])
     - read: Boolean (default: false)
     - createdAt: Date
*/

module.exports = {
  roles: ['student', 'admin'],
  tokenStatuses: ['WAITING', 'CALLING', 'COMPLETED', 'SKIPPED', 'CANCELLED'],
  counterStatuses: ['Active', 'Offline', 'On Break']
};
