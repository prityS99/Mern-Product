'use client';

import { useForm, Controller } from "react-hook-form";
import {
  TextField,
  Button,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Stack
} from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import { productSchema } from "@/validations/productSchema";


type ProductFormValues = {
  name: string;
  brand: string;
  price: string;
  image: string;
  sizes: string[];
  colors: string[];
};



const SIZES = ["S", "M", "L", "XL", "XXL"];
const COLORS = ["Black", "White", "Red", "Blue", "Green"];

type Props = {
  defaultValues?: Partial<ProductFormValues>;
  onSubmit: (data: ProductFormValues) => Promise<void>;
  submitLabel: string;
};

export default function ProductForm({
  defaultValues,
  onSubmit,
  submitLabel
}: Props) {
const {
  control,
  handleSubmit,
  formState: { errors },
} = useForm<ProductFormValues>({
  resolver: yupResolver(productSchema),
  defaultValues: {
    name: "",
    brand: "",
    price: "",
    image: "",
    sizes: [] ,
    colors: [],
    ...defaultValues,
  },
});


  return (
    <Box maxWidth={600} mx="auto">
      <Typography variant="h5" fontWeight={800} mb={3}>
        {submitLabel}
      </Typography>

      <Stack spacing={3}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Product Name" fullWidth />
          )}
        />

        <Controller
          name="brand"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Brand" fullWidth />
          )}
        />

        <Controller
          name="price"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Price" type="number" fullWidth />
          )}
        />

        <Controller
          name="image"
          control={control}
          render={({ field }) => (
            <TextField {...field} label="Image URL" fullWidth />
          )}
        />

        {/* SIZES */}
        <Controller
          name="sizes"
          control={control}
          render={({ field }) => (
            <Box>
              <Typography fontWeight={700}>Sizes</Typography>
              <FormGroup row>
                {SIZES.map(size => (
                  <FormControlLabel
                    key={size}
                    control={
                      <Checkbox
                        checked={field.value?.includes(size)}
                        onChange={(e) =>
                          e.target.checked
                            ? field.onChange([...field.value, size])
                            : field.onChange(field.value.filter((s: string) => s !== size))
                        }
                      />
                    }
                    label={size}
                  />
                ))}
              </FormGroup>
            </Box>
          )}
        />

        {/* COLORS */}
        <Controller
          name="colors"
          control={control}
          render={({ field }) => (
            <Box>
              <Typography fontWeight={700}>Colors</Typography>
              <FormGroup row>
                {COLORS.map(color => (
                  <FormControlLabel
                    key={color}
                    control={
                      <Checkbox
                        checked={field.value?.includes(color)}
                        onChange={(e) =>
                          e.target.checked
                            ? field.onChange([...field.value, color])
                            : field.onChange(field.value.filter((c: string) => c !== color))
                        }
                      />
                    }
                    label={color}
                  />
                ))}
              </FormGroup>
            </Box>
          )}
        />

        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit(onSubmit)}
          sx={{ borderRadius: "12px", fontWeight: 800 }}
        >
          {submitLabel}
        </Button>
      </Stack>
    </Box>
  );
}


