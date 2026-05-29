const { z } = require("zod");

const schema = z.coerce.number({ message: "Usia harus berupa angka" }).min(1, "Usia minimal 1");
const res = schema.safeParse("abc");
console.log(JSON.stringify(res, null, 2));
