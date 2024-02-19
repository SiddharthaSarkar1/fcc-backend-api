require('dotenv').config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true],
  },
  age: Number,
  favoriteFoods: [String],
});

const Person = mongoose.model("Person", personSchema);
// let Person;

const createAndSavePerson = (done) => {
  let personObj = new Person({
    name: "Siddhartha",
    age: 25,
    favoriteFoods: ["Chicken", "Fish", "Egg"],
  });
  personObj.save((err, data) => {
    if (err) {
      console.log(err);
    }
    done(null, data);
  })
};

let arrayOfPeople = [
  {
    name: "Bunty",
    age: 24,
    favoriteFoods: ["Nan", "Fish", "Egg"],
  },
  {
    name: "Titir",
    age: 24,
    favoriteFoods: ["Mar", "Fish", "Egg"],
  },
  {
    name: "Jaga",
    age: 28,
    favoriteFoods: ["Milk", "Fish", "Egg"],
  },
]

const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, (err, people) => {
    if (err) {
      console.log(err);
    }
    done(null, people);
  })

};

const findPeopleByName = (personName, done) => {
  Person.find({ name: personName }, (err, personFound) => {
    if (err) {
      console.log(err);
    }
    done(null, personFound);
  })
};

const findOneByFood = (food, done) => {
  Person.findOne({ favoriteFoods: food }, (err, data) => {
    if (err) {
      console.log(err);
    }
    done(null, data);
  })
};

const findPersonById = (personId, done) => {
  Person.findById(personId, (err, data) => {
    if (err) {
      console.log(err);
    }
    done(null, data);
  })
};

const findEditThenSave = (personId, done) => {
  const foodToAdd = "hamburger";
  Person.findById(personId, (err, person) => {
    if (err) {
      console.log(err);
    }
    person.favoriteFoods.push(foodToAdd);

    person.save((err, updatedPerson) => {
      if (err) {
        console.log(err);
      }
      done(null, updatedPerson);
    })
  })
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;
  Person.findOneAndUpdate({ name: personName }, { age: ageToSet }, { new: true }, (err, updatedPerson) => {
    if (err) {
      console.log(err);
    }
    done(null, updatedPerson);
  })
};

const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, (err, removedPerson) => {
    if (err) {
      console.log(err);
    }
    done(null, removedPerson);
  })
};

const removeManyPeople = (done) => {
  const nameToRemove = "Mary";
  Person.remove({ name: nameToRemove }, (err, response) => {
    if (err) {
      console.log(err);
    }
    done(null, response);
  })
};

const queryChain = (done) => {
  const foodToSearch = "burrito";
  Person.find({ favoriteFoods: foodToSearch })
  .sort({ name: 'asc' })
  .limit(2)
  .select('-age')
  .exec((err, people) => {
    if(err){
      console.log(err);
    }
    done(null, people);
  });
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
