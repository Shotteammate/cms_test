<template>
  <a-collapse
    :defaultActiveKey="['1']"
    style="margin-bottom: 20px"
    @change="handleCollapse"
  >
    <a-collapse-panel key="1" header="Search Order">
      <a-form layout="horizontal" labelAlign="left" :colon="false">
        <a-row gutter="16">
          <a-col :span="8">
            <a-form-item
              label="Bill No"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }"
            >
              <a-input v-model="filters.billNo" placeholder="Enter Bill No" />
            </a-form-item>
            <a-form-item
              label="Buyer"
              :labelCol="{ span: 8 }"
              :wrapperCol="{ span: 16 }"
            >
              <a-input v-model="filters.buyer" placeholder="Enter Buyer Name" />
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
                <a-select-option value="delivered">Delivered</a-select-option>
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

          <a-col :span="4">
            <a-form-item
              label="Order Date"
              :labelCol="{ span: 24 }"
              :wrapperCol="{ span: 24 }"
            >
              <a-range-picker v-model="filters.orderDate" style="width: 100%" />
            </a-form-item>
            <a-form-item>
              <a-button
                type="primary"
                @click="$emit('search')"
                block
                :icon="h(SearchOutlined)"
              >
                Search
              </a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-collapse-panel>
  </a-collapse>
</template>

<script setup>
import { h, ref } from "vue";
import { SearchOutlined } from "@ant-design/icons-vue";

const props = defineProps({
  filters: Object,
});

const emit = defineEmits(["toggle-collapse"]);

const collapsed = ref(false);

const handleCollapse = (keys) => {
  collapsed.value = !keys.includes("1");
  emit("toggle-collapse", collapsed.value);
};
</script>
