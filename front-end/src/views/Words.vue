<template>
  <div>
    <h1>Words</h1>

    <!-- Search Bar -->
    <div class="ui search">
      <div class="ui icon input fluid">
        <input 
          type="text" 
          placeholder="Search words..."
          v-model="searchQuery"
        />
        <i class="search icon"></i>
      </div>
    </div>

    <!-- Words Table -->
    <table id="words" class="ui celled compact table">
      <thead>
        <tr>
          <th>English</th>
          <th>German</th>
          <th>French</th>
          <th colspan="3"></th>
        </tr>
      </thead>
      <tr v-for="(word, i) in paginatedWords" :key="word._id">
        <td>{{ word.english }}</td>
        <td>{{ word.german }}</td>
        <td>{{ word.french }}</td>
        <td width="75" class="center aligned">
          <router-link :to="{ name: 'show', params: { id: word._id } }">Show</router-link>
        </td>
        <td width="75" class="center aligned">
          <router-link :to="{ name: 'edit', params: { id: word._id } }">Edit</router-link>
        </td>
        <td width="75" class="center aligned" @click.prevent="onDestroy(word._id)">
          <a :href="`/words/${word._id}`">Destroy</a>
        </td>
      </tr>
    </table>

    <!-- Download CSV Button -->
    <button class="ui button" @click="downloadCSV">Download CSV</button>

    <!-- Pagination Controls -->
    <div class="ui pagination menu">
      <button class="ui button" :disabled="currentPage === 1" @click="currentPage--">Previous</button>
      
      <!-- Page Numbers -->
      <button
        class="ui button"
        v-for="page in totalPages"
        :key="page"
        :class="{ active: currentPage === page }"
        @click="goToPage(page)"
      >
        {{ page }}
      </button>

      <button class="ui button" :disabled="currentPage === totalPages" @click="currentPage++">Next</button>
    </div>
  </div>
</template>

<script>
import { api } from '../helpers/helpers';

export default {
  name: 'words',
  data() {
    return {
      words: [],
      searchQuery: '', // Data property for search query
      currentPage: 1, // Current page number
      pageSize: 5, // Number of words per page
    };
  },
  
  computed: {
    // Computed property for filtering words based on search query
    filteredWords() {
      if (!this.searchQuery) {
        return this.words;
      }
      const query = this.searchQuery.toLowerCase();
      return this.words.filter(word =>
        word.english.toLowerCase().includes(query) ||
        word.german.toLowerCase().includes(query) ||
        word.french.toLowerCase().includes(query)
      );
    },
    // Computed property for paginated words
    paginatedWords() {
      const start = (this.currentPage - 1) * this.pageSize;
      const end = start + this.pageSize;
      return this.filteredWords.slice(start, end);
    },
    // Total number of pages based on filtered words
    totalPages() {
      return Math.ceil(this.filteredWords.length / this.pageSize);
    }
  },
  methods: {
    async onDestroy(id) {
      const sure = window.confirm('Are you sure?');
      if (!sure) return;
      await api.deleteWord(id);
      this.flash('Word deleted successfully!', 'success');
      const newWords = this.words.filter(word => word._id !== id);
      this.words = newWords;
      // Adjust the current page if necessary
      if (this.currentPage > this.totalPages) {
        this.currentPage = this.totalPages;
      }
    },
    goToPage(page) {
      this.currentPage = page;
    },
    // Method to download words as CSV
    downloadCSV() {
      const headers = ['English', 'German', 'French'];
      const rows = this.words.map(word => [word.english, word.german, word.french]);

      const csvContent = "data:text/csv;charset=utf-8,\uFEFF"  // Add BOM (Byte Order Mark) for UTF-8
        + headers.join(",") + "\n"
        + rows.map(e => e.join(",")).join("\n");

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "words.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  },
  async mounted() {
    this.words = await api.getWords();
    this.words.reverse();
  }
};
</script>

<style scoped>
.ui.search {
  margin-bottom: 1rem;
}
.ui.pagination.menu {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
}
.ui.button {
  margin: 0 0.5rem;
}
.ui.button.active {
  background-color: #2185d0; /* Highlight active page */
  color: white;
}
</style>
