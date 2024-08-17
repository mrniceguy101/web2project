const mongoose = require('mongoose');
const Vocab = mongoose.model("Vocab");

exports.list_all_words = (req, res) => {
    Vocab.find({}, (err, words) => {
        if (err) res.send(err);
        res.json(words);
    });
};

exports.create_a_word = async (req, res) => {
    try {
        const existingWord = await Vocab.findOne({
            $or: [
                { english: req.body.english },
                { german: req.body.german },
                { french: req.body.french }
            ]
        });

        if (existingWord) {
            return res.status(400).send({ message: 'Word already exists' });
        }

        const newWord = new Vocab(req.body);
        const word = await newWord.save();
        res.json(word);
    } catch (err) {
        res.send(err);
    }
};

exports.read_a_word = (req, res) => {
    Vocab.findById(req.params.wordId, (err, word) => {
        if (err) res.send(err);
        res.json(word);
    });
};

exports.update_a_word = async (req, res) => {
    try {
        const existingWord = await Vocab.findOne({
            $or: [
                { english: req.body.english },
                { german: req.body.german },
                { french: req.body.french }
            ],
            _id: { $ne: req.params.wordId } // Exclude the current word being updated
        });

        if (existingWord) {
            return res.status(400).send({ message: 'Word already exists' });
        }

        const word = await Vocab.findOneAndUpdate(
            { _id: req.params.wordId },
            req.body,
            { new: true }
        );
        res.json(word);
    } catch (err) {
        res.send(err);
    }
};

exports.delete_a_word = (req, res) => {
    Vocab.deleteOne({ _id: req.params.wordId }, err => {
        if (err) res.send(err);
        res.json({
            message: "Word successfully deleted",
            _id: req.params.wordId
        });
    });
};
