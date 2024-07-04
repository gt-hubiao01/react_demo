type Person = {
  name: string
  age: number
}

const bob: Person = {
  name: 'Bob',
  age: 18,
}

console.log(typeof bob)

type NewPerson = typeof bob

const jack: NewPerson = {
  name: 'Jack',
  age: 20,
}
