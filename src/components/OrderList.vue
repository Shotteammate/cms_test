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
          <a-form layout="horizontal" labelAlign="left">
            <a-row gutter="16">
              <!-- First Column: Inputs -->
              <a-col :span="8">
                <a-form-item
                  label="Bill No"
                  :labelCol="{ span: 8 }"
                  :wrapperCol="{ span: 16 }"
                >
                  <a-input
                    v-model="filters.billNo"
                    placeholder="Enter Bill No"
                  />
                </a-form-item>
                <a-form-item
                  label="Buyer"
                  :labelCol="{ span: 8 }"
                  :wrapperCol="{ span: 16 }"
                >
                  <a-input
                    v-model="filters.buyer"
                    placeholder="Enter Buyer Name"
                  />
                </a-form-item>
                <a-form-item
                  label="Contact Number"
                  :labelCol="{ span: 8 }"
                  :wrapperCol="{ span: 16 }"
                >
                  <a-input
                    v-model="filters.contactNumber"
                    placeholder="Enter Contact Number"
                  />
                </a-form-item>
                <a-form-item
                  label="Email Address"
                  :labelCol="{ span: 8 }"
                  :wrapperCol="{ span: 16 }"
                >
                  <a-input
                    v-model="filters.emailAddress"
                    placeholder="Enter Email Address"
                  />
                </a-form-item>
              </a-col>

              <!-- Second Column: Selects -->
              <a-col :span="8">
                <a-form-item
                  label="Delivery Agent's Name"
                  :labelCol="{ span: 8 }"
                  :wrapperCol="{ span: 16 }"
                >
                  <a-select
                    v-model="filters.deliveryAgent"
                    placeholder="Select Delivery Agent"
                  >
                    <a-select-option value="agent1">Agent 1</a-select-option>
                    <a-select-option value="agent2">Agent 2</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item
                  label="Delivery Status"
                  :labelCol="{ span: 8 }"
                  :wrapperCol="{ span: 16 }"
                >
                  <a-select
                    v-model="filters.deliveryStatus"
                    placeholder="Select Delivery Status"
                  >
                    <a-select-option value="pending">Pending</a-select-option>
                    <a-select-option value="delivered"
                      >Delivered</a-select-option
                    >
                  </a-select>
                </a-form-item>
                <a-form-item
                  label="Payment Status"
                  :labelCol="{ span: 8 }"
                  :wrapperCol="{ span: 16 }"
                >
                  <a-select
                    v-model="filters.paymentStatus"
                    placeholder="Select Payment Status"
                  >
                    <a-select-option value="paid">Paid</a-select-option>
                    <a-select-option value="unpaid">Unpaid</a-select-option>
                  </a-select>
                </a-form-item>
                <a-form-item
                  label="Payment"
                  :labelCol="{ span: 8 }"
                  :wrapperCol="{ span: 16 }"
                >
                  <a-select
                    v-model="filters.payment"
                    placeholder="Select Payment Method"
                  >
                    <a-select-option value="creditCard"
                      >Credit Card</a-select-option
                    >
                    <a-select-option value="paypal">PayPal</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>

              <!-- Third Column: Date-Picker Range and Search Button -->
              <a-col :span="4">
                <a-form-item
                  label="Order Date"
                  :labelCol="{ span: 24 }"
                  :wrapperCol="{ span: 24 }"
                >
                  <a-range-picker
                    v-model="filters.orderDate"
                    style="width: 100%"
                  />
                </a-form-item>
                <a-form-item>
                  <a-button type="primary" @click="searchOrders" block
                    >Search</a-button
                  >
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
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
          <template #summary>
            <tr>
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
import { ref, computed, onMounted, onBeforeUnmount, watch, h } from "vue";

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
</script>
