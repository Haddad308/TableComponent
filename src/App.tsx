import TableComponent, { type HeaderConfig } from "./components/TableComponent";

// Define the transaction data type
interface Transaction {
  id: number;
  amount_cents: number;
  currency: string;
  payment_status: string;
  created_at: string;
}

// Define the headers configuration
const headersConfig: HeaderConfig[] = [
  { key: "id", label: "Transaction ID", type: "number", sortable: true },
  {
    key: "amount_cents",
    label: "Amount",
    type: "number",
    sortable: true,
    formatter: (value: number) => (
      <div className="font-medium">
        {(value / 100).toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </div>
    ),
  },
  { key: "currency", label: "Currency", type: "string" },
  { key: "payment_status", label: "Status", type: "string", sortable: true },
  { key: "created_at", label: "Created At", type: "date", sortable: true },
];

// Sample transaction data
const transactionData: Transaction[] = [
  {
    id: 299894,
    amount_cents: 5000,
    currency: "EGP",
    payment_status: "UNPAID",
    created_at: "2024-12-03T16:37:51",
  },
  {
    id: 299895,
    amount_cents: 2000,
    currency: "EGP",
    payment_status: "PAID",
    created_at: "2024-12-01T10:21:03",
  },
  {
    id: 299896,
    amount_cents: 3000,
    currency: "EGP",
    payment_status: "PAID",
    created_at: "2024-12-01T10:21:03",
  },
  {
    id: 299897,
    amount_cents: 4000,
    currency: "EGP",
    payment_status: "UNPAID",
    created_at: "2024-12-01T10:21:03",
  },
  {
    id: 299898,
    amount_cents: 6000,
    currency: "EGP",
    payment_status: "UNPAID",
    created_at: "2024-12-01T10:21:03",
  },
];

function App() {
  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Transactions
          </h1>
          <p className="text-gray-600">
            Manage and monitor your payment transactions
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <TableComponent<Transaction>
            headersConfig={headersConfig}
            data={transactionData}
          />
        </div>
      </div>
    </main>
  );
}

export default App;
