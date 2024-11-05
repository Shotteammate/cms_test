<template>
  <div>
    <a-card title="Order list" :bordered="false">
      <!-- Search Order Filter Section with Collapsible Panel -->
      <a-collapse
        :defaultActiveKey="['1']"
        style="margin-bottom: 20px"
        @change="toggleCollapse"
      >
        <a-collapse-panel key="1" header="Search Orders">
          <SearchOrder :filters="filters" @search="searchOrders" />
        </a-collapse-panel>
      </a-collapse>

      <!-- Orders Table with Scrollable Section -->
      <div :style="{ maxHeight: `${tableHeight}px`, overflowY: 'auto' }">
        <a-table
          :columns="columns"
          :dataSource="paginatedData"
          :pagination="false"
          rowKey="id"
          :rowSelection="rowSelection"
          :scroll="{ y: tableHeight }"
        >
          <template #bodyCell="{ column, record }">
            <StatusColumn
              v-if="column.key === 'paymentStatus'"
              :icons="record.paymentStatus.icons"
              :status="record.paymentStatus.status"
              :statusEnum="PaymentStatus"
              :getIcon="getIcon"
            />
            <StatusColumn
              v-else-if="column.key === 'deliveryStatus'"
              :icons="record.deliveryStatus.icons"
              :status="record.deliveryStatus.status"
              :statusEnum="DeliveryStatus"
              :getIcon="getIcon"
            />
          </template>

          <template #summary>
            <tr class="sticky-summary">
              <td colspan="3">
                <strong>Checked: </strong><span>HKD</span
                >{{ selectedTotal.toFixed(2) }}
              </td>
              <td colspan="4">
                <strong>Total: </strong>{{ totalAmount.toFixed(2) }}
              </td>
            </tr>
          </template>
        </a-table>
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
import { ref, computed, onMounted, onBeforeUnmount, watch } from "vue";
import { getIcon } from "../utils/commonUtils";
import { DeliveryStatus, PaymentStatus } from "../constants/enums";
import StatusColumn from "./StatusColumn.vue";
import SearchOrder from "./SearchOrder.vue";

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
    customRender: ({ record }) =>
      `${record.currency} ${record.totalAmount.toFixed(2)}`,
    sorter: true,
  },
  { title: "Buyer", dataIndex: "buyer", key: "buyer", sorter: true },
  {
    title: "Payment Status",
    key: "paymentStatus",
    align: "center",
  },
  {
    title: "Delivery Status",
    key: "deliveryStatus",
    align: "center",
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
  onChange: (_, selectedRowsData) => {
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

// Fetch mock data asynchronously based on filters
const fetchOrders = async (filters) => {
  try {
    const response = await fetch("/src/data/orders.json");
    if (!response.ok) throw new Error("Failed to load orders data");
    let data = await response.json();

    // Filter data based on filters
    data = data.filter((order) => {
      return (
        (!filters.billNo || order.billNo.includes(filters.billNo)) &&
        (!filters.buyer || order.buyer.includes(filters.buyer))
        // Additional filter conditions can go here
      );
    });

    orderList.value = data;
    pagination.value.total = data.length;
  } catch (error) {
    console.error(error);
  }
};

// Calculate the total amount of paginated orders
const totalAmount = computed(() => {
  return paginatedData.value.reduce((sum, order) => sum + order.totalAmount, 0);
});

// Search function to trigger data fetching
const searchOrders = () => {
  fetchOrders(filters.value);
};

// Pagination handlers
const handlePageChange = (page) => {
  pagination.value.current = page;
};

const handlePageSizeChange = (size) => {
  pagination.value.pageSize = size;
  pagination.value.current = 1; // Reset to the first page when page size changes
};

// Dynamic table height
const tableHeight = ref(0);
const collapsed = ref(false);

const calculateTableHeight = () => {
  const windowHeight = window.innerHeight;
  const headerHeight = 100; // Estimate for header
  const filterHeight = collapsed.value ? 30 : 300; // Adjust height if panel is collapsed
  const footerHeight = 80; // Estimate for footer controls
  tableHeight.value = windowHeight - headerHeight - filterHeight - footerHeight;
};

// Toggle collapse state and recalculate height
const toggleCollapse = (keys) => {
  collapsed.value = !keys.includes("1");
};

onMounted(() => {
  calculateTableHeight();
  window.addEventListener("resize", calculateTableHeight);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", calculateTableHeight);
});

// Watch for collapse state changes
watch(collapsed, calculateTableHeight);
</script>

<style>
.sticky-summary {
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 1;
}
</style>
