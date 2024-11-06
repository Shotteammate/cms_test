<template>
  <div>
    <a-card title="Order list" :bordered="false">
      <SearchOrder
        :filters="filters"
        @search="searchOrders"
        @toggle-collapse="handleToggleCollapse"
      />
      <OrderTable :dataSource="orderList" :tableHeight="tableHeight" />
    </a-card>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import SearchOrder from "./SearchOrder.vue";
import OrderTable from "./OrderTable.vue";

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

const orderList = ref([]);

// Fetch mock data asynchronously based on filters
const fetchOrders = async (filters) => {
  try {
    const response = await fetch("/src/data/orders.json");
    if (!response.ok) throw new Error("Failed to load orders data");
    let data = await response.json();

    // TODO: Filter data based on filters
    // data = data.filter((order) => {
    //   return ...
    // });

    orderList.value = data;
  } catch (error) {
    console.error(error);
  }
};

const searchOrders = () => {
  fetchOrders(filters.value);
};

// Dynamic table height
const tableHeight = ref(0);
const collapsed = ref(false);

const calculateTableHeight = () => {
  const windowHeight = window.innerHeight;
  const headerHeight = 100;
  const filterHeight = collapsed.value ? 30 : 300;
  const footerHeight = 80;
  tableHeight.value = windowHeight - headerHeight - filterHeight - footerHeight;
};

const handleToggleCollapse = (isCollapsed) => {
  collapsed.value = isCollapsed;
  calculateTableHeight();
};

onMounted(() => {
  calculateTableHeight();
  window.addEventListener("resize", calculateTableHeight);
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", calculateTableHeight);
});

watch(collapsed, calculateTableHeight);
</script>
