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
        :rowSelection="rowSelection"
        summary="tableSummary"
      />

      <!-- Selected Total Row -->
      <div style="margin-top: 15px">
        <span><strong>Checked: HKD</strong> {{ selectedTotal }}</span>
      </div>

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
          :value="pagination.pageSize"
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
import { h } from "vue";

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
    title: "",
    key: "select",
    dataIndex: "select",
    customRender: ({ record }) =>
      h("a-checkbox", { modelValue: record.checked }),
  },
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
    customRender: ({ record }) =>
      `${record.currency} ${record.totalAmount.toFixed(2)}`,
  },
  { title: "Buyer", dataIndex: "buyer", key: "buyer" },
  {
    title: "Payment Status",
    key: "paymentStatus",
    customRender: ({ record }) =>
      h("div", { style: { display: "flex", alignItems: "center" } }, [
        ...record.paymentStatus.icons.map((icon) =>
          h("img", {
            src: getIcon(icon),
            alt: "icon",
            style: { width: "24px", marginRight: "8px" },
          })
        ),
        h("span", record.paymentStatus.status),
      ]),
  },
  {
    title: "Delivery Status",
    key: "deliveryStatus",
    customRender: ({ record }) =>
      h("div", { style: { display: "flex", alignItems: "center" } }, [
        ...record.deliveryStatus.icons.map((icon) =>
          h("img", {
            src: getIcon(icon),
            alt: "icon",
            style: { width: "24px", marginRight: "8px" },
          })
        ),
        h("span", record.deliveryStatus.status),
      ]),
  },
];

// Pagination state
const pagination = ref({
  current: 1,
  pageSize: 5,
  total: 0,
});

// Row selection state
const selectedRows = ref([]);

// Row selection config
const rowSelection = {
  onChange: (selectedRowKeys, selectedRowsData) => {
    selectedRows.value = selectedRowsData;
  },
};

// Compute paginated data based on pagination
const paginatedData = computed(() => {
  const start = (pagination.value.current - 1) * pagination.value.pageSize;
  const end = start + pagination.value.pageSize;
  return orderList.value.slice(start, end);
});

// Calculate the total amount of selected orders
const selectedTotal = computed(() => {
  return selectedRows.value.reduce((sum, order) => sum + order.totalAmount, 0);
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
      return "/src/assets/icons/hsbc.png";
    case "Visa":
      return "/src/assets/icons/visa.png";
    case "MasterCard":
      return "/src/assets/icons/mastercard.png";
    case "PayMe":
      return "/src/assets/icons/payme.png";
    case "SF Express":
      return "/src/assets/icons/sf.png";
    case "7-Eleven":
      return "/src/assets/icons/7-eleven.png";
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
