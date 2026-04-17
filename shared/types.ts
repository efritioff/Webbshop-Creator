type User = {
"_id" : string,
"email" : string,
"password" : string
}
type Store = {
  "name" : string,
  "ownerId" : "number",
  "subdomain" : string
}

type Product = {
    "name" : string,
    "productId" : "number",
    "cost" : "number"
}

type Order = {
    "name" : string,
    "productId" : "number",
    "cost" : "number",
    "orderId" : "number"
}