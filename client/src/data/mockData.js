export const inventoryData = [
  {
    id: 1,
    ledger: "L001",
    asset: "Dell Latitude 5420",
    category: "Laptop",
    quantity: 15,
    status: "Available",
  },
  {
    id: 2,
    ledger: "L002",
    asset: "HP LaserJet Pro",
    category: "Printer",
    quantity: 5,
    status: "Assigned",
  },
  {
    id: 3,
    ledger: "L003",
    asset: "Canon DR-C225",
    category: "Scanner",
    quantity: 3,
    status: "Available",
  },
  {
    id: 4,
    ledger: "L004",
    asset: "Cisco Catalyst 2960",
    category: "Networking",
    quantity: 8,
    status: "Under Maintenance",
  },
  {
    id: 5,
    ledger: "L005",
    asset: "Lenovo ThinkCentre",
    category: "Desktop",
    quantity: 12,
    status: "Available",
  },
];

export const transferData = [
  {
    id: "TR001",
    asset: "Dell Latitude 5420",
    from: "Rahul Sharma",
    to: "Priya Singh",
    status: "Pending",
    requestedDate: "15 Jul 2026",
  },
  {
    id: "TR002",
    asset: "HP LaserJet Pro",
    from: "Amit Kumar",
    to: "Neha Gupta",
    status: "Approved",
    requestedDate: "14 Jul 2026",
  },
  {
    id: "TR003",
    asset: "Canon Scanner",
    from: "Rahul Sharma",
    to: "Vikas Singh",
    status: "Rejected",
    requestedDate: "12 Jul 2026",
  },
];

export const disposalData = [
  {
    id: "DR001",
    asset: "Dell Latitude 5420",
    requestedBy: "Rahul Sharma",
    reason: "Damaged",
    status: "Pending",
    requestedDate: "15 Jul 2026",
  },
  {
    id: "DR002",
    asset: "HP LaserJet Pro",
    requestedBy: "Amit Kumar",
    reason: "Obsolete",
    status: "Approved",
    requestedDate: "13 Jul 2026",
  },
  {
    id: "DR003",
    asset: "Canon Scanner",
    requestedBy: "Priya Singh",
    reason: "Not Working",
    status: "Rejected",
    requestedDate: "11 Jul 2026",
  },
];



export const usersData = [
  {
    id: "U001",
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    role: "Inventory Holder",
    group: "IT Department",
    status: "Active",
  },
  {
    id: "U002",
    name: "Priya Singh",
    email: "priya.singh@example.com",
    role: "User",
    group: "Accounts",
    status: "Active",
  },
  {
    id: "U003",
    name: "Amit Kumar",
    email: "amit.kumar@example.com",
    role: "User",
    group: "HR",
    status: "Inactive",
  },
];

export const groupsData = [
  {
    id: "G001",
    name: "IT Department",
    description: "Handles technical infrastructure and software.",
    members: "15 users",
  },
  {
    id: "G002",
    name: "Accounts",
    description: "Manages financial operations.",
    members: "8 users",
  },
  {
    id: "G003",
    name: "Human Resources",
    description: "Employee management and recruitment.",
    members: "6 users",
  },
];