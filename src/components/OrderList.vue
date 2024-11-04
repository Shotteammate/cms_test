<template>
  <div>
    <a-card title="Order list" :bordered="false">
      <!-- Search Order Filter Section -->
      <a-card :style="{ backgroundColor: '#e6f7ff', marginBottom: '20px' }">
        <a-form layout="inline">
          <!-- Filter fields here -->
          <a-form-item label="Bill No">
            <a-input v-model="filters.billNo" placeholder="Enter Bill No" />
          </a-form-item>
          <!-- Additional filter fields go here -->
          <a-form-item>
            <a-button type="primary" @click="searchOrders">Search</a-button>
          </a-form-item>
        </a-form>
      </a-card>

      <!-- Orders Table -->
      <a-table :columns="columns" :dataSource="orderList" rowKey="id">
        <template #paymentStatus="{ record }">
          <div style="display: flex; align-items: center">
            <div
              v-for="icon in record.paymentStatus.icons"
              :key="icon"
              style="margin-right: 8px"
            >
              <img :src="getIcon(icon)" alt="icon" style="width: 24px" />
            </div>
            <span>{{ record.paymentStatus.status }}</span>
          </div>
        </template>
        <template #deliveryStatus="{ record }">
          <div style="display: flex; align-items: center">
            <div
              v-for="icon in record.deliveryStatus.icons"
              :key="icon"
              style="margin-right: 8px"
            >
              <img :src="getIcon(icon)" alt="icon" style="width: 24px" />
            </div>
            <span>{{ record.deliveryStatus.status }}</span>
          </div>
        </template>
        <template #totalAmount="{ record }">
          <span>{{ record.currency }} {{ record.totalAmount.toFixed(2) }}</span>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

// State for form filters
const filters = ref({
  billNo: "",
  buyer: "",
  contactNumber: "",
  emailAddress: "",
  deliveryAgent: "",
  orderDate: null,
  deliveryStatus: null,
  paymentStatus: null,
});

// Order list and columns
const orderList = ref([]);
const columns = [
  {
    title: "Order Date",
    dataIndex: "orderDate",
    key: "orderDate",
    sorter: true,
  },
  { title: "Bill No", dataIndex: "billNo", key: "billNo", sorter: true },
  {
    title: "Total Amount",
    key: "totalAmount",
    scopedSlots: { customRender: "totalAmount" },
  },
  { title: "Buyer", dataIndex: "buyer", key: "buyer" },
  {
    title: "Payment Status",
    key: "paymentStatus",
    scopedSlots: { customRender: "paymentStatus" },
  },
  {
    title: "Delivery Status",
    key: "deliveryStatus",
    scopedSlots: { customRender: "deliveryStatus" },
  },
];

// Pagination state
const pagination = ref({
  current: 1,
  pageSize: 25,
  total: 100,
});

// Fetch mock data asynchronously
const fetchOrders = async () => {
  try {
    const response = await fetch("/src/data/orders.json");
    console.log("response", response);
    if (!response.ok) throw new Error("Failed to load orders data");
    const data = await response.json();
    console.log("data", data);
    orderList.value = data;
    pagination.value.total = data.length;
  } catch (error) {
    console.error(error);
  }
};

// Function to get icon path
const getIcon = (iconName) => {
  switch (iconName) {
    case "HSBC":
      return "/path/to/hsbc-icon.png";
    case "Visa":
      return "/path/to/visa-icon.png";
    case "MasterCard":
      return "/path/to/mastercard-icon.png";
    case "PayMe":
      return "/path/to/payme-icon.png";
    case "SF Express":
      return "/path/to/sf-express-icon.png";
    case "7-Eleven":
      return "/path/to/7-eleven-icon.png";
    default:
      return "";
  }
};

// Fetch orders on component mount
onMounted(fetchOrders);

// Search function placeholder
const searchOrders = () => {
  // Implement your search logic here
};

// Pagination handler
const handlePageChange = (page) => {
  pagination.value.current = page;
};
</script>

<style scoped>
/* Custom styles for layout */
</style>
