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
      <a-table
        :columns="columns"
        :dataSource="paginatedData"
        :pagination="false"
        rowKey="id"
      >
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

      <!-- Table Footer Controls -->
      <div
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
        "
      >
        <a-pagination
          :current="pagination.current"
          :total="pagination.total"
          :pageSize="pagination.pageSize"
          @change="handlePageChange"
        />
        <a-select
          v-model="pagination.pageSize"
          style="width: 120px; margin-left: 10px"
          @change="handlePageSizeChange"
        >
          <a-select-option value="5">5</a-select-option>
          <a-select-option value="10">10</a-select-option>
          <a-select-option value="15">15</a-select-option>
          <a-select-option value="20">20</a-select-option>
        </a-select>
      </div>
    </a-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

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
  pageSize: 5,
  total: 0,
});

// Compute paginated data based on pagination
const paginatedData = computed(() => {
  const start = (pagination.value.current - 1) * pagination.value.pageSize;
  const end = start + pagination.value.pageSize;
  return orderList.value.slice(start, end);
});

// Fetch mock data asynchronously
const fetchOrders = async () => {
  try {
    const response = await fetch("/src/data/orders.json");
    if (!response.ok) throw new Error("Failed to load orders data");
    const data = await response.json();
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

// Pagination handlers
const handlePageChange = (page) => {
  pagination.value.current = page;
};

const handlePageSizeChange = (size) => {
  pagination.value.pageSize = size;
  pagination.value.current = 1; // Reset to the first page when page size changes
};
</script>

<style scoped>
/* Custom styles for layout */
</style>
