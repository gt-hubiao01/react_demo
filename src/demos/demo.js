const targetObject = {
  name: 'Alice',
  get uppercaseName() {
    return this.name.toUpperCase();
  }
};

const receiverObject = {
  name: 'Bob'
};

console.log(Reflect.get(targetObject, 'uppercaseName', receiverObject)); // 输出: BOB
