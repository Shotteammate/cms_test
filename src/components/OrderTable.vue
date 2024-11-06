<template>
  <div
    :style="{
      maxHeight: `${tableHeight}px`,
      overflowY: 'auto',
      position: 'relative',
    }"
  >
    <a-table
      sticky
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
    </a-table>

    <a-row class="summary-row">
      <a-col :span="8">
        <strong>Checked: </strong><span>HKD </span
        >{{ selectedTotal.toFixed(2) }}
      </a-col>
      <a-col :span="16">
        <strong>Total: </strong><span>HKD </span>{{ totalAmount.toFixed(2) }}
      </a-col>
    </a-row>

    <div class="footer-controls">
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
  </div>
</template>

<script setup>
import { ref, computed, defineProps, watch } from "vue";
import StatusColumn from "./StatusColumn.vue";
import { PaymentStatus, DeliveryStatus } from "../constants/enums";
import { getIcon } from "../utils/commonUtils";

const props = defineProps({
  dataSource: Array,
  tableHeight: Number,
});

const columns = [
  {
    title: "Order Date",
    dataIndex: "orderDate",
    key: "orderDate",
    sorter: true,
  },
  {
    title: "Bill No",
    dataIndex: "billNo",
    key: "billNo",
    sorter: true,
  },
  {
    title: "Total Amount",
    key: "totalAmount",
    customRender: ({ record }) =>
      `${record.currency} ${record.totalAmount.toFixed(2)}`,
    sorter: true,
  },
  {
    title: "Buyer",
    dataIndex: "buyer",
    key: "buyer",
    sorter: true,
  },
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

const pagination = ref({
  current: 1,
  pageSize: 5,
  total: props.dataSource.length,
});

watch(
  () => props.dataSource,
  (newData) => {
    pagination.value.total = newData.length;
    pagination.value.current = 1;
  },
  { immediate: true }
);

const selectedRows = ref([]);
const selectedRowKeys = ref([]);

const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys, selectedRowsData) => {
    selectedRowKeys.value = keys;
    selectedRows.value = selectedRowsData;
  },
}));

const paginatedData = computed(() => {
  const start = (pagination.value.current - 1) * pagination.value.pageSize;
  const end = start + pagination.value.pageSize;
  return props.dataSource.slice(start, end);
});

const selectedTotal = computed(() => {
  return selectedRows.value.reduce((sum, order) => sum + order.totalAmount, 0);
});

const totalAmount = computed(() => {
  return paginatedData.value.reduce((sum, order) => sum + order.totalAmount, 0);
});

const handlePageChange = (page) => {
  pagination.value.current = page;
  selectedRows.value = [];
  selectedRowKeys.value = [];
};

const handlePageSizeChange = (size) => {
  pagination.value.pageSize = size;
  pagination.value.current = 1;
  selectedRows.value = [];
  selectedRowKeys.value = [];
};
</script>

<style>
.sticky-summary {
  position: sticky;
  bottom: 0;
  background-color: white;
  z-index: 1;
}

.summary-row {
  position: sticky;
  bottom: 40px;
  background-color: white;
  padding: 10px;
  border-top: 1px solid #f0f0f0;
  z-index: 2;
}

.footer-controls {
  position: sticky;
  bottom: 0;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
  z-index: 3;
}
</style>
