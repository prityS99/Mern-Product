'use client';

import { Stack, Button } from '@mui/material';
import { useRouter } from 'next/navigation';

export default function ProductActions({ id }) {
  const router = useRouter();

  const deleteProduct = async () => {
    if (!confirm('Delete this product?')) return;

    await fetch(`http://localhost:5000/api/products/${id}`, {
      method: 'DELETE',
    });

    router.refresh();
  };

  return (
    <Stack direction="row" spacing={1}>
      <Button size="small" onClick={() => router.push(`/edit/${id}`)}>
        Edit
      </Button>
      <Button size="small" color="error" onClick={deleteProduct}>
        Delete
      </Button>
    </Stack>
  );
}
