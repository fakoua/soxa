import { soxa } from './mod.ts'

const url = 'https://jsonplaceholder.typicode.com/todos/1'
const url2 = 'https://enu8bvm0faj0e.x.pipedream.net/1'

var config = {
    auth: {
        username: 'janedoe',
        password: 's00pers3cret'
      }
}

soxa.post(url2, {} ,config)
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
