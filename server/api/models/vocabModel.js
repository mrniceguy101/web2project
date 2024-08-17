const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const VocabSchema = new Schema(
    {
        english: {
            type: String,
            required: 'English word cannot be blank',
            unique: true
        },
        german: {
            type: String,
            required: 'German word cannot be blank',
            unique: true
        },
        french: {
            type: String,
            required: 'French word cannot be blank',
            unique: true
        }
    },
    { collection: 'vocab' }
);

module.exports = mongoose.model('Vocab', VocabSchema);
