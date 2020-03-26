const name = 'Max';
let age = 29;
const hasHobbies = true;

age = 30;

// this -> путой объект в стрелочных функциях
const summarizeUser = (userName, userAge, userHasHobbies) => {
    return (
        'Name is ' + userName +
        ', age is ' + userAge +
        ', and the user has hobbies - ' + (userHasHobbies ? 'yes' : 'no')
    );
}

const add = (a, b) => a + b;

// при одном аргументе можно не указывать скобки.
const addOne = a => a + 1;

const addRandom = () => 1 * 2;

console.log(
    summarizeUser(name, age, hasHobbies),
    add(1,2),
    addOne(2),
    addRandom(),
);

const person = {
    name: 'Max',
    age: 29,
    greet: function () {
        console.log('Hi, I am ' + this.name);

        return  this;
    },
};

// получить в функцию проперти объекта.
const printName = ({ name, greet }) => {
    console.log(name, greet);

    return this;
};

printName(person);

// создать константы из проперти массива
const { personName, personAge } = person;

console.log(personName, personAge);

console.log(person.greet());

const hobbies = ['Sports', 'Cooking'];
// В массив константы можно добавлять эелементы.
// Это не ошибка, так как переназначение не проихсодит.

const [ hobbyOne, hobbyTwo ] = hobbies;

console.log(hobbyOne, hobbyTwo);

for (let hobby of hobbies) {
    console.log(hobby);
}

// создает новый массив по правилу, не изменяя старого.
console.log(hobbies.map((hobby) => {
    return 'Hobby: ' + hobby;
}));

console.log(hobbies);

// копирование массива.
const copiedArray = hobbies.slice();
const copiedArray2 = [...hobbies];

// копирование объекта.
const coriedObject = {...person};

console.log(copiedArray);
console.log(copiedArray2);
console.log(coriedObject);

// альтернативное присвоение аргументов
const toArray = (...args) => {
    return args;
};

console.log(toArray(1, 2, 3, 4, 5));