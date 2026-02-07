import * as yup from "yup";

export const productSchema = yup.object({
  name: yup
    .string()
    .required("Product name is required")
    .min(3),

  brand: yup
    .string()
    .required("Brand is required"),

  price: yup
    .string()
    .required("Price is required")
    .test("is-number", "Price must be a valid number", (value) =>
      value !== undefined && !isNaN(Number(value))
    ),

  image: yup
    .string()
    .url("Enter a valid image URL")
    .required("Image URL is required"),

  sizes: yup
    .array()
    .of(yup.string().required()) 
    .min(1, "Select at least one size")
    .required()
    .defined(), // 

  colors: yup
    .array()
    .of(yup.string().required())
    .min(1, "Select at least one color")
    .required()
    .defined(),
});
