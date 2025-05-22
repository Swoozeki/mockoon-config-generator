/**
 * Configuration for the Users databucket
 */
export default {
  uuid: "91062199-b9b6-48a4-80c2-dcf5f6287d80",
  id: "334z",
  name: "Users",
  documentation: "",
  value: `[
  {{#repeat 50}}
  {
    "id": "{{faker 'string.uuid'}}",
    "username": "{{faker 'internet.userName'}}"
  }
  {{/repeat}}
]`,
};
