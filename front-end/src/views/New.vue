<template>
  <div>
    <h1>New Word</h1>
    <word-form @createOrUpdate="createOrUpdate"></word-form>
  </div>
</template>

<script>
import WordForm from '../components/WordForm.vue';
import { api } from '../helpers/helpers';

export default {
  name: 'new-word',
  components: {
    'word-form': WordForm
  },
  methods: {
    async createOrUpdate(word) {
      try {
        const existingWords = await api.getWords();
        const duplicate = existingWords.find(existingWord =>

          existingWord.english === word.english
        );

        if (duplicate) {
          alert('This word existed!');
        } else {
          const res = await api.createWord(word);
          this.flash('Word created', 'success');
          this.$router.push(`/words/${res._id}`);
        }
      } catch (error) {
        console.error('An error occurred: ',error);
        this.flash('An error occurred while creating the word!', 'error')
      }
    },
  }
};
</script>
