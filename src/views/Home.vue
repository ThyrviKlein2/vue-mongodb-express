<template>
    <div class="w-96">
      <form @submit.prevent="addItem" class="m-auto">
        <input v-model="newItem.name" type="text" placeholder="Name" class="w-full p-2 border border-gray-300 rounded-md mb-4" />
        <textarea v-model="newItem.content" placeholder="Content" class="w-full p-2 border border-gray-300 rounded-md mb-4"></textarea>
        <button type="submit" class="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add Item</button>
      </form>

      <div v-for="item in items" :key="item._id" class="mb-4 border p-2">
        <h1 class="text-lg font-bold">{{ item.name }}</h1>
        <p>{{ item.content }}</p>
      </div>
    </div>
</template>



<script>
import axios from 'axios';

export default {
  name: 'HomeView',
  data() {
    return {
      items: [],
      newItem: {
        name: '',
        content: ''
      },
    };
  },
  async created() {
    this.fetchItems();
  },
  methods: {
    async fetchItems() {
      try {
        const response = await axios.get('http://localhost:3000/data');
        this.items = response.data;
      } catch (error) {
        console.error('Failed to fetch data', error);
      }
    },
    async addItem() {
      try {
        const response = await axios.post('http://localhost:3000/data', this.newItem);
        this.items.push(response.data);
        this.newItem.name = '';
        this.newItem.content = '';
      } catch (error) {
        console.error('Failed to add item', error);
      }
    },
  },
}
</script>
