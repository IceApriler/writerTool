const mixin = {
  create (params) {
    let { name } = params
    console.log(name)
  },
  second (array) {
    return array[1]
  }
}

export default mixin
