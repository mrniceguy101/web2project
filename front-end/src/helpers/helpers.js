import axios from 'axios';
import Vue from 'vue';
import VueFlashMessage from 'vue-flash-message';
import 'vue-flash-message/dist/vue-flash-message.min.css';

Vue.use(VueFlashMessage, {
  messageOptions: {
    timeout: 3000,
    pauseOnInteract: true
  }
});

const vm = new Vue();
const baseURL = 'http://localhost:3000/words/';

const handleError = fn => async (...params) => {
  try {
    return await fn(...params);
  } catch (error) {
    if (error.response) {
      if (error.response.status === 400 && error.response.data.message === 'Word already exists') {
        vm.flash('Word already exists', 'error');
      } else {
        vm.flash(`${error.response.status}: ${error.response.statusText}`, 'error');
      }
    } else {
      vm.flash('An unknown error occurred', 'error');
    }
    throw error;  // rethrow the error so that it can be caught in the component
  }
};

export const api = {
  getWord: handleError(async id => {
    const res = await axios.get(baseURL + id);
    return res.data;
  }),
  getWords: handleError(async () => {
    const res = await axios.get(baseURL);
    return res.data;
  }),
  deleteWord: handleError(async id => {
    const res = await axios.delete(baseURL + id);
    return res.data;
  }),
  createWord: handleError(async payload => {
    const res = await axios.post(baseURL, payload);
    return res.data;
  }),
  updateWord: handleError(async payload => {
    const res = await axios.put(baseURL + payload._id, payload);
    return res.data;
  })
};
