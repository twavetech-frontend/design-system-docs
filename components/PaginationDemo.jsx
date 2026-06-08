'use client';
import { useState } from 'react';
import { Pagination } from './Pagination';

// Stateful wrapper used in the docs so the rendered Pagination is interactive.
// Lives in its own 'use client' module — inline components defined in MDX would
// run on the server during static export and can't use hooks.
export function PaginationDemo({ initial, ...props }) {
  const [page, setPage] = useState(initial ?? 1);
  return <Pagination {...props} currentPage={page} onPageChange={setPage} />;
}
